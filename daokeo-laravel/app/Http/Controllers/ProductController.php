<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use ImageKit\ImageKit;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Carbon\Carbon;

class ProductController extends Controller
{
    public function index(){
        $products = DB::table('products')->join('images','images.idProduct','=','products.id')
        ->join('product_categories','products.id','=','product_categories.idProduct')
        ->join('categories', 'categories.id','=','product_categories.idCategory')
        ->select('products.id','products.name','slugName' ,'sumdescription', 'description', 'price', 'quantity', 'discount', 'rating', DB::raw('MIN(images.imageName) as imageName'),DB::raw('MIN(images.imageLink) as imageLink'), DB::raw('MIN(categoryName) as categoryName'), 'create_at')
        ->groupBy('products.id', 'products.name','slugName' , 'sumdescription' ,'description', 'price', 'quantity', 'discount', 'rating', 'create_at')
        ->get();
        $categories = [];
        foreach($products as $product){
            $category = $this->getCategoriesByProduct($product->id);
            $categoryNames = [];
            foreach ($category as $categoryItem) {
                $categoryNames[] = $categoryItem->categoryName;
            }
            $categories[] = $categoryNames;
        }
        $updatedProducts = $products->map(function ($product, $index) use ($categories) {
            $product->categoryName = $categories[$index];
            return $product;
        });
        return response()->json($updatedProducts, 200);
    }

    public function create(Request $request){
        $name = $request->input('name');
        $slug = $request->input('slug');
        $sumDes = $request->input('sumDes');
        $des = $request->input('des');
        $price = $request->input('price');
        $quantity = $request->input('quantity');
        $categories = $request->input('selectedCategories');
        $keyword = $request->input('keyword');
        $files = $request->file('files');
        $request->validate([
            'name' => 'required|unique:products,name',
            'price' => 'required|numeric',
            'selectedCategories' => 'required',
            'files' => 'required'
        ], [
            'name.required' => 'Tên không được để trống',
            'name.unique' => 'Tên dao đã tồn tại.',
            'price.required' => 'Giá tiền không được để trống.',
            'selectedCategories.required' => 'Không được để trống loại dao.',
            'files.required' => 'Bạn chưa thêm ảnh cho sản phẩm.'
        ]);

        $imageKit = new ImageKit(
            config('services.imagekit.public_key'),
            config('services.imagekit.private_key'),
            config('services.imagekit.url_endpoint')
        );

        $idProduct = DB::table('products')->insertGetId([
            'name' => $name,
            'slugName' => $slug,
            'sumdescription' => $sumDes,
            'description' => $des,
            'price' => $price,
            'quantity' => $quantity,
            'keyword' => $keyword
        ]);

        $imagePath = 'public/images/'.$name;
        $enName = Str::slug($name, '-');
        foreach($files as $file){
            $imageName = $file->getClientOriginalName();
            $file->storeAs($imagePath, $imageName);
            $response = $imageKit->upload([
                'file' => fopen(Storage::path($imagePath.'/').$imageName,"r"),
                'fileName' => $imageName,
                'folder' => 'images/'.$enName,
            ]);
            $imageLink = $response->result->url;
            DB::table('images')->insert([
                'idProduct' => $idProduct,
                'imageName' => $imageName,
                'imageLink' => $imageLink
            ]);
        }
        foreach($categories as $category){
            DB::table('product_categories')->insert([
                'idProduct' => $idProduct,
                'idCategory' => $category['id']
            ]);
        }
        return response()->json('Thêm sản phẩm '.$name.' thành công!', 200);
    }

    public function update(Request $request){
        $id = $request->input('idProduct');
        $name = $request->input('name');
        $slug = $request->input('slug');
        $sumDes = $request->input('sumDes');
        $des = $request->input('des');
        $price = $request->input('price');
        $quantity = $request->input('quantity');
        $categories = $request->input('selectedCategories');
        $keyword = $request->input('keyword');
        $request->validate([
            'name' => 'required|string|unique:products,name,'.$id.',id',
            'price' => 'required|numeric',
            'selectedCategories' => 'required',
        ], [
            'name.required' => 'Tên không được để trống',
            'name.unique' => 'Tên dao đã tồn tại.',
            'price.required' => 'Giá tiền không được để trống.',
            'selectedCategories.required' => 'Không được để trống loại dao.',
        ]);

        $imageKit = new ImageKit(
            config('services.imagekit.public_key'),
            config('services.imagekit.private_key'),
            config('services.imagekit.url_endpoint')
        );

        DB::table('products')->where('id',$id)->update([
            'name' => $name,
            'slugName' => $slug,
            'sumdescription' => $sumDes,
            'description' => $des,
            'price' => $price,
            'quantity' => $quantity,
            'keyword' => $keyword
        ]);

        if($request->hasFile('files')){
            $files = $request->file('files');
            $imagePath = 'public/images/'.$name;
            $enName = Str::slug($name, '-');
            foreach($files as $file){
                $imageName = $file->getClientOriginalName();
                $file->storeAs($imagePath, $imageName);
                $response = $imageKit->upload([
                    'file' => fopen(Storage::path($imagePath.'/').$imageName,"r"),
                    'fileName' => $imageName,
                    'folder' => 'images/'.$enName,
                ]);
                $imageLink = $response->result->url;
                DB::table('images')->insert([
                    'idProduct' => $id,
                    'imageName' => $imageName,
                    'imageLink' => $imageLink
                ]);
            }
        }
        DB::table('product_categories')->where('idProduct', $id)->delete();
        foreach($categories as $category){
            DB::table('product_categories')->insert([
                'idProduct' => $id,
                'idCategory' => $category['id']
            ]);
        }
        return response()->json('Sửa sản phẩm '.$name.' thành công!', 200);
    }

    public function destroy($id){
        $product = DB::table('products')->where('id', $id)->first();
        DB::table('products')->where('id',$id)->delete();
        return response()->json('Xóa thành công sản phẩm '.$product->name.'.', 200);
    }

    public function getCategoriesByProduct($id){
        return DB::table('categories')->join('product_categories','categories.id','product_categories.idCategory')
        ->where('idProduct', $id)->select('categories.id','categoryName')->get()->toArray();
    }

    public function getProductById($id){
        $product = DB::table('products')->where('id',$id)->get();
        $images = DB::table('images')->where('idProduct', $id)->get();
        $categories = DB::table('categories')->join('product_categories','categories.id','=','product_categories.idCategory')->where('idProduct',$id)
        ->select('categories.id','categoryName')->get();
        $sold = DB::table('ordersdetail')->where('idProduct', $id)->select(DB::raw('sum(quantity) as total'))->groupBy('idProduct')->first();
        return response()->json([
            'product' => $product,
            'images' => $images,
            'categories' => $categories,
            'sold' => $sold
        ], 200);
    }

    public function getProduct($name){
        $product = DB::table('products')->where('slugName',$name)->first();
        DB::table('products')->where('id', $product->id)->update([
            'views' => $product->views + 1
        ]);
        $today = Carbon::now()->toDateString();
        $check = DB::table('views_daily')
        ->where('idProduct', $product->id)
        ->whereDate('Date', $today)->first();
        if($check){
            DB::table('views_daily')->where('idProduct', $product->id)
            ->whereDate('Date', $today)->update(['count'=> $check->count + 1]);
        }
        else{
            DB::table('views_daily')->insert([
                'idProduct' => $product->id,
                'Date' => now(),
                'count'=> 1
            ]);
        }
        $reviews = DB::table('product_ratings')->join('users','users.id','=','product_ratings.idUser')
        ->select('product_ratings.id','rating','content','image',DB::raw("DATE_FORMAT(create_at, '%d/%m/%y') AS ngaydang"),'name')
        ->where('idProduct', $product->id)->get();
        $totalReview = DB::table('product_ratings')->where('idProduct',$product->id)
        ->select(DB::raw("count(*) as total"), DB::raw("avg(rating) as avg"),DB::raw("avg(rating=1) as avg1"),DB::raw("avg(rating=2) as avg2"),DB::raw("avg(rating=3) as avg3")
        ,DB::raw("avg(rating=4) as avg4"),DB::raw("avg(rating=5) as avg5"))->first();
        $images = DB::table('images')->where('idProduct', $product->id)->get();
        $categories = DB::table('categories')->join('product_categories','categories.id','=','product_categories.idCategory')->where('idProduct',$product->id)
        ->select('categories.id','categoryName')->get();
        $relatedProducts = DB::table('products')->join('images','images.idProduct','=','products.id')
        ->join('product_categories','products.id','=','product_categories.idProduct')->where('idCategory',$categories[0]->id)
        ->select('products.id','products.name', 'sumdescription', 'description', 'price', 'quantity', 'discount', 'rating', DB::raw('MIN(images.imageName) as imageName'),DB::raw('MIN(images.imageLink) as imageLink'), 'create_at')
        ->groupBy('products.id', 'products.name', 'sumdescription' ,'description', 'price', 'quantity', 'discount', 'rating', 'create_at')
        ->get();
        $sold = DB::table('ordersdetail')->where('idProduct', $product->id)->select(DB::raw('sum(quantity) as total'))->groupBy('idProduct')->first();
        return response()->json([
            'product' => $product,
            'images' => $images,
            'categories' => $categories,
            'sold' => $sold,
            'relatedProducts' => $relatedProducts,
            'reviews' => $reviews,
            'totalReviews' => $totalReview
        ], 200);
    }

    public function deleteImage($id){
        DB::table('images')->where('id',$id)->delete();
        return response()->json('Xóa ảnh thành công!', 200);
    }

    public function getSaleProducts(){
        $products = DB::table('products')->join('images','images.idProduct','=','products.id')
        ->select('products.id','products.name','discount','price',DB::raw('(price-(price*discount/100)) as PriceDiscount'),DB::raw('MIN(images.imageName) as imageName'),DB::raw('MIN(images.imageLink) as imageLink'), 'create_at')
        ->groupBy('products.id', 'products.name', 'price','discount','create_at')
        ->get();
        return response()->json($products, 200);
    }

    public function updateSaleProduct(Request $request){
        $id = $request->input('idProduct');
        $discount = $request->input('discount');
        DB::table('products')->where('id',$id)->update([
            'discount' => $discount
        ]);
        return response()->json('Cập nhật ưu đãi thành công!', 200);
    }

    public function getProductsMostView($limit){
        $products = DB::table('products')->join('images','images.idProduct','=','products.id')
        ->select('products.id','products.name','quantity','price','discount','rating', DB::raw('MIN(images.imageName) as imageName'),DB::raw('MIN(images.imageLink) as imageLink'))
        ->groupBy('products.id', 'name', 'quantity', 'price', 'discount','rating')
        ->orderByDesc('views')
        ->limit($limit)
        ->get();
        return response()->json($products, 200);
    }

    public function getProductsLastest($limit){
        $products = DB::table('products')->join('images','images.idProduct','=','products.id')
        ->select('products.id','products.name','quantity','price','discount','rating', DB::raw('MIN(images.imageName) as imageName'),DB::raw('MIN(images.imageLink) as imageLink'))
        ->groupBy('products.id', 'name', 'quantity', 'price', 'discount','rating')
        ->orderByDesc('create_at')
        ->limit($limit)
        ->get();
        return response()->json($products, 200);
    }

    public function getProductsBigSales($limit){
        $products = DB::table('products')->join('images','images.idProduct','=','products.id')
        ->select('products.id','products.name','quantity','price','discount','rating', DB::raw('MIN(images.imageName) as imageName'),DB::raw('MIN(images.imageLink) as imageLink'))
        ->groupBy('products.id', 'name', 'quantity', 'price', 'discount','rating')
        ->orderByDesc('discount')
        ->limit($limit)
        ->get();
        return response()->json($products, 200);
    }

    public function getProductsMostSellable(){
        $subquery = DB::table('ordersdetail')->select(
            'idProduct',
            DB::raw('SUM(quantity) as total_quantity_sold')
        )
        ->groupBy('idProduct');
        $products = Product::select(
            'products.id',
            'name',
            'products.quantity',
            'od.total_quantity_sold',
            DB::raw('MIN(images.imageLink) as imageLink'),
            DB::raw('MIN(images.imageName) as imageName'),
        )
        ->leftJoinSub($subquery, 'od', function ($join) {
            $join->on('products.id', '=', 'od.idProduct');
        })
        ->leftJoin('images', 'products.id', '=', 'images.idProduct')
        ->groupBy('products.id', 'products.name','products.quantity', 'od.total_quantity_sold')
        ->limit(5)
        ->get();
        return response()->json($products, 200);
    }

    public function getTotalProducts(){
        $total = DB::table('products')->select(DB::raw('count(*) as count'))->first();
        return response()->json($total, 200);
    }

    public function getViewsDaily(){
        $today = DB::table('views_daily')->select(DB::raw("DATE_FORMAT(Date, '%d/%m') AS day"), DB::raw('SUM(count) AS total'))
        ->whereRaw('YEARWEEK(Date, 1) = YEARWEEK(CURDATE(), 1)')
        ->groupBy(DB::raw('Date'))
        ->orderBy('Date')
        ->get();
        $weekStartDate = Carbon::now()->startOfWeek();
        $weekEndDate = Carbon::now()->endOfWeek();
        $missingDays = [];

        for ($date = $weekStartDate; $date->lte($weekEndDate); $date->addDay()) {
            $day = $date->format('d/m');
            $total = 0;

            foreach ($today as $order) {
                if ($order->day == $day) {
                    $total = $order->total;
                    break;
                }
            }

            $missingDays[] = ['day' => $day, 'total' => $total];
        }
        return response()->json($missingDays, 200);
    }

    public function getProductsSold(){
        $today = DB::table('orders')
        ->join('ordersdetail', 'orders.id', '=', 'ordersdetail.idOrder')
        ->select(DB::raw("DATE_FORMAT(create_at, '%d/%m') AS day"), DB::raw('SUM(quantity) AS total'))
        ->whereRaw('YEARWEEK(create_at, 1) = YEARWEEK(CURDATE(), 1)')
        ->groupBy('day')
        ->orderBy('day')
        ->get();

        $weekStartDate = Carbon::now()->startOfWeek();
        $weekEndDate = Carbon::now()->endOfWeek();
        $missingDays = [];

        for ($date = $weekStartDate; $date->lte($weekEndDate); $date->addDay()) {
            $day = $date->format('d/m');
            $total = 0;

            foreach ($today as $order) {
                if ($order->day == $day) {
                    $total = $order->total;
                    break;
                }
            }

            $missingDays[] = ['day' => $day, 'total' => $total];
        }
        return response()->json($missingDays, 200);
    }

    public function addtoCart(Request $request){
        $idCustomer = $request->idUser;
        $idProduct = $request->idProduct;
        $quantity = $request->quantity;
        $product = DB::table('products')->where('id',$idProduct)->first();
        if (!$product) {
            return response()->json("Sản phẩm không tồn tại", 404);
        }
        if ($product->quantity < $quantity) {
            return response()->json("Không đủ số lượng sản phẩm để thêm vào giỏ hàng", 400);
        }
        $check = DB::table('carts')->where('idCustomer', $idCustomer)->where('idProduct', $idProduct)->first();
        if(!$check){
            DB::table('carts')->insert([
                'idCustomer' => $idCustomer,
                'idProduct' => $idProduct,
                'quantity' => $quantity,
                'created_at' => now()
            ]);
        }else{
            DB::table('carts')->where('idCustomer', $idCustomer)->where('idProduct', $idProduct)->update([
                'quantity' => $check->quantity + $quantity
            ]);
        }
        return response()->json("Thêm ".$product->name." thành công vào giỏ hàng", 200);
    }

    public function removeCart(Request $request){
        DB::table('carts')->where('idProduct',$request->idProduct)->where('idCustomer',$request->idUser)->delete();
        return response()->json("Xóa thành công sản phẩm khỏi giỏ hàng.", 200);
    }

    public function postReview(Request $request){
        $idProduct = $request->idProduct;
        $idUser = $request->idUser;
        $content = $request->content;
        $rating = $request->rating;

        $imageKit = new ImageKit(
            config('services.imagekit.public_key'),
            config('services.imagekit.private_key'),
            config('services.imagekit.url_endpoint')
        );
        if($request->hasFile('image')){
            $image = $request->file('image');
            $imageName = $image->getClientOriginalName();
            $imagePath = 'public/reviews/' . $imageName;
            $image->storeAs('public/reviews', $imageName);
            $response = $imageKit->upload([
                'file' => fopen(Storage::path('public/reviews/').$imageName,"r"),
                'fileName' => $imageName,
                'folder' => 'posters',
            ]);
            $imageUrl = $response->result->url;
            DB::table('product_ratings')->insert([
                'idProduct' => $idProduct,
                'idUser' => $idUser,
                'rating' => $rating,
                'content' => $content,
                'image' => $imageUrl,
                'create_at' => now()
            ]);
        }else{
            DB::table('product_ratings')->insert([
                'idProduct' => $idProduct,
                'idUser' => $idUser,
                'rating' => $rating,
                'content' => $content,
                'create_at' => now()
            ]);
        }
        $avgRating = DB::table('product_ratings')->where('idProduct', $idProduct)->avg('rating');
        DB::table('products')->where('id',$idProduct)->update([
            'rating' => $avgRating
        ]);
        return response()->json("Bình luận thành công!", 200);
    }

    public function getProductsByCategory(Request $request){
        $id = $request->id;
        $products = DB::table('products')->join('images','images.idProduct','=','products.id')
        ->join('product_categories','products.id','=','product_categories.idProduct')
        ->join('categories', 'categories.id','=','product_categories.idCategory')
        ->where('categories.id', $id)
        ->select('products.id','products.name','slugName' ,'sumdescription', 'description', 'price', 'quantity', 'discount', 'rating', DB::raw('MIN(images.imageName) as imageName'),DB::raw('MIN(images.imageLink) as imageLink'), DB::raw('MIN(categoryName) as categoryName'), 'create_at')
        ->groupBy('products.id', 'products.name','slugName' , 'sumdescription' ,'description', 'price', 'quantity', 'discount', 'rating', 'create_at')
        ->get();
        $categories = [];
        foreach($products as $product){
            $category = $this->getCategoriesByProduct($product->id);
            $categoryNames = [];
            foreach ($category as $categoryItem) {
                $categoryNames[] = $categoryItem->categoryName;
            }
            $categories[] = $categoryNames;
        }
        $updatedProducts = $products->map(function ($product, $index) use ($categories) {
            $product->categoryName = $categories[$index];
            return $product;
        });
        return response()->json($updatedProducts, 200);
    }
}
