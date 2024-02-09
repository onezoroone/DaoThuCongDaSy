<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
class CategoryController extends Controller
{
    public function index(){
        $categories = DB::table('categories')->orderBy('id')->get();
        return response()->json($categories, 200);
    }

    public function create(Request $request){
        $name = $request->input('categoryName');
        $request->validate([
            'categoryName' => 'required|unique:categories,categoryName',
        ], [
            'categoryName.unique' => 'Loại dao đã tồn tại.',
        ]);
        DB::table('categories')->insert([
            'categoryName' => $name
        ]);
        return response()->json('Thêm loại '.$name.' thành công!', 200);
    }

    public function destroy($id){
        $category = DB::table('categories')->where('id',$id)->first();
        DB::table('categories')->where('id',$id)->delete();
        return response()->json('Xóa loại dao '.$category->categoryName.' thành công.', 200);
    }
}
