<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Events\NotificationOrder;

class OrderController extends Controller
{
    public function index(){
        $orders = DB::table('orders')->join('users','users.id','=','orders.idCustomer')->where('status','2')
        ->select('orders.id','status','name','totalMoney','orders.create_at')->get();
        return response()->json($orders, 200);
    }

    public function getOrdersPending(){
        $orders = DB::table('orders')->join('users','users.id','=','orders.idCustomer')->where('status','1')->orWhere('status','0')
        ->select('orders.id','status','name','totalMoney','orders.create_at')->get();
        return response()->json($orders, 200);
    }

    public function getOrdersCancel(){
        $orders = DB::table('orders')->join('users','users.id','=','orders.idCustomer')->where('status','-1')
        ->select('orders.id','status','name','totalMoney','orders.create_at')->get();
        return response()->json($orders, 200);
    }

    public function getDetailOrder(Request $request){
        $id = $request->input('idOrder');
        $order = DB::table('ordersdetail')->join('products','products.id', '=', 'ordersdetail.idProduct')
        ->join('images','images.idProduct','=','products.id')->where('idOrder',$id)
        ->select('ordersdetail.id','name','ordersdetail.idProduct','ordersdetail.quantity','toMoney', 'price',DB::raw('MIN(imageName) as imageName'), DB::raw('MIN(imageLink) as imageLink'))
        ->groupBy('ordersdetail.id','name','ordersdetail.idProduct','ordersdetail.quantity', 'toMoney', 'price')->get();
        return response()->json($order, 200);
    }

    public function updateStatusOrder(Request $request){
        $id = $request->input('idOrder');
        $status = $request->input('status');
        if($status == "Đang giao"){
            DB::table('orders')->where('id',$id)->update([
                'status' => "1"
            ]);
        }else if($status == "Đang chờ"){
            DB::table('orders')->where('id',$id)->update([
                'status' => "0"
            ]);
        }else{
            DB::table('orders')->where('id',$id)->update([
                'status' => "2"
            ]);
        }
        return response()->json('Sửa trạng thái đơn hàng thành công!', 200);
    }

    public function getRevenue(){
        $revenue = DB::table('orders')
        ->select(DB::raw('MONTH(create_at) as month'),
        DB::raw('DAY(create_at) as day'),
        DB::raw('SUM(totalMoney) as revenue'))
        ->where('status', '2')
        ->whereMonth('create_at', Carbon::now()->month)
        ->groupBy(DB::raw('DAY(create_at)'), DB::raw('MONTH(create_at)'))
        ->orderBy('day')->orderBy('month')->get();
        return response()->json($revenue, 200);
    }

    public function getTotalOrders(){
        $success = DB::table('orders')->where('status','2')->select(DB::raw('count(*) as count'))->first();
        $pending = DB::table('orders')->where('status','1')->orWhere('status','0')->select(DB::raw('count(*) as count'))->first();
        return response()->json(['success' => $success, 'pending' => $pending], 200);
    }

    public function getTotalMoneyByMonth(){
        $total = DB::table('orders')->select(DB::raw('SUM(totalMoney) as total'))->where('status','2')->whereMonth('create_at', Carbon::now()->month)->first();
        return response()->json($total);
    }

    public function getCart($id){
        $cart = DB::table('carts')->join('products', 'products.id','=','carts.idProduct')
        ->join('images','images.idProduct','=','products.id')
        ->select('products.id','carts.idProduct','carts.quantity','price','name','discount', DB::raw('MIN(images.imageName) as imageName'),DB::raw('MIN(images.imageLink) as imageLink'))
        ->groupBy('products.id', 'carts.idProduct', 'carts.quantity' ,'price', 'name', 'discount')
        ->where('idCustomer', $id)->get();
        return response()->json($cart, 200);
    }

    public function Order(Request $request){
        $id = DB::table('orders')->insertGetId([
            'idCustomer' => $request->idUser,
            'create_at' => now()
        ]);
        foreach($request->product as $item){
            DB::table('products')->where('id', $item['id'])->decrement('quantity', $item['quantity']);
            DB::table('carts')->where('idProduct', $item['id'])->where('idCustomer',$request->idUser)->delete();
            DB::table('ordersdetail')->insert([
                'idOrder' => $id,
                'idProduct' => $item['id'],
                'quantity' => $item['quantity'],
                'toMoney' => $item['price'] - ($item['price'] * $item['discount'] / 100) * $item['quantity']
            ]);
        }
        $total = DB::table('ordersdetail')->where('idOrder',$id)->sum('toMoney');
        DB::table('orders')->where('id',$id)->update([
            'totalMoney' => $total
        ]);
        event(new NotificationOrder('Bạn có 1 đơn hàng mới.'));
        DB::table('notifications')->insert([
            'idUser' => $request->idUser,
            'created_at' => now()
        ]);
        return response()->json('Đặt hàng thành công!', 200);
    }

    public function getOrderByUser(Request $request){
        $orders = DB::table('orders')->join('ordersdetail','orders.id','=','ordersdetail.idOrder')
        ->join('products','products.id','=','ordersdetail.idProduct')
        ->join('images','images.idProduct','=','products.id')
        ->select('orders.id','ordersdetail.idProduct','products.name', 'totalMoney', 'ordersdetail.quantity', 'toMoney', 'status', 'discount', 'price', DB::raw('MIN(images.imageName) as imageName'),DB::raw('MIN(images.imageLink) as imageLink'),DB::raw("DATE_FORMAT(orders.create_at, '%d/%m/%y') AS created_at"))
        ->where('idCustomer',$request->id)->groupBy('orders.id','ordersdetail.idProduct','products.name', 'totalMoney', 'ordersdetail.quantity', 'toMoney', 'status', 'discount', 'price', 'orders.create_at')
        ->orderByDesc('orders.create_at')
        ->get();
        $result = $orders->groupBy('id')->map(function ($items) {
            return [
                'id' => $items->first()->id,
                'created_at' => $items->first()->created_at,
                'totalMoney' => $items->first()->totalMoney,
                'status' => $items->first()->status,
                'products' => $items->map(function ($item) {
                    return [
                        'idProduct' => $item->idProduct,
                        'name' => $item->name,
                        'quantity' => $item->quantity,
                        'toMoney' => $item->toMoney,
                        'discount' => $item->discount,
                        'price' => $item->price,
                        'imageName' => $item->imageName,
                        'imageLink' => $item->imageLink,
                    ];
                })->all(),
            ];
        })->values()->all();
        return response()->json($result, 200);
    }

    public function cancelOrder(Request $request){
        DB::table('orders')->where('id', $request->id)->update(['status'=>'-1']);
        return response()->json("Hủy đơn hàng thành công.", 200);
    }
}
