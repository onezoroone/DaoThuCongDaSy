<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class UserController extends Controller
{
    public function index(){
        $users = DB::table('users')->orderBy('id')->get();
        return response()->json($users, 200);
    }

    public function update(Request $request){
        DB::table('users')->where('id',$request->id)->update([
            'phone' => $request->phone,
            'name' => $request->name,
            'address' => $request->address,
            'updated_at' => now()
        ]);
        $user = User::where('id',$request->id)->first();
        return response()->json($user, 200);
    }

    public function getTotalUsers(){
        $total = DB::table('users')->select(DB::raw('count(*) as count'))->first();
        return response()->json($total, 200);
    }

    public function getAccessTimes(){
        $results = DB::table('access_times')
        ->select(DB::raw('
            CASE
                WHEN HOUR(created_at) >= 0 AND HOUR(created_at) < 10 THEN "0h-10h"
                WHEN HOUR(created_at) >= 10 AND HOUR(created_at) < 18 THEN "10h-18h"
                WHEN HOUR(created_at) >= 18 AND HOUR(created_at) <= 24 THEN "18h-24h"
            END AS hour_range,
            SUM(count) AS total_count
        '))
        ->groupBy('hour_range')
        ->get();
        return response()->json($results, 200);
    }

    public function getCountCart($id){
        $count = DB::table('carts')->where('idCustomer',$id)->count();
        return response()->json($count, 200);
    }

    public function upTimeAccess(){
        DB::table('access_times')->insert([
            'created_at' => now()
        ]);
    }

    public function getNotifications(){
        $notifications = DB::table('notifications')->join('users', 'users.id','=','notifications.idUser')
        ->select('notifications.id','name','notifications.created_at', 'status')
        ->where('status','0')
        ->orderByDesc('created_at')
        ->get();
        return response()->json($notifications, 200);
    }

    public function readNotifications(){
        DB::table('notifications')->update([
            'status' => '1',
        ]);
    }
}
