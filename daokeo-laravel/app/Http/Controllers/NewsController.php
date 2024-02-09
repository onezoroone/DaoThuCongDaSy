<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use ImageKit\ImageKit;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class NewsController extends Controller
{
    public function index($limit = null){
        $news = DB::table('news')->limit($limit)->orderByDesc('create_at')->get();
        return response()->json($news, 200);
    }

    public function getNewsMostView($limit = null){
        $news = DB::table('news')->limit($limit)->orderByDesc('views')->get();
        return response()->json($news, 200);
    }

    public function create(Request $request){
        $request->validate([
            'title' => 'required|string|unique:news,title',
            'selectedImage' => 'required'
        ],[
            'title.required' => 'Tiêu đề không được để trống.',
            'title.unique' => 'Tiêu đề đã bị trùng với bài viết khác.',
            'selectedImage.required' => 'Thiếu ảnh cho bài viết'
        ]);
        $title = $request->input('title');
        $content = $request->input('text');
        $image = $request->file('selectedImage');
        $linkProduct = $request->input('link');
        $keyword = $request->input('keyword');
        $imageKit = new ImageKit(
            config('services.imagekit.public_key'),
            config('services.imagekit.private_key'),
            config('services.imagekit.url_endpoint')
        );
        $enTitle = Str::slug($title, '-');
        $imageName = $image->getClientOriginalName();
        $imagePath = 'public/news/'.$enTitle;
        $image->storeAs($imagePath, $imageName);
        $response = $imageKit->upload([
            'file' => fopen(Storage::path($imagePath.'/').$imageName,"r"),
            'fileName' => $imageName,
            'folder' => 'news/'.$enTitle,
        ]);
        $imageLink = $response->result->url;
        DB::table('news')->insert([
            'title' => $title,
            'slugTitle' => $request->slugTitle,
            'content' => $content,
            'image' => $imageLink,
            'linkProduct' => $linkProduct,
            'keyword' => $keyword
        ]);
        return response()->json('Đăng tin '.$title.' thành công!', 200);
    }

    public function update(Request $request){
        $id = $request->input('id');
        $request->validate([
            'title' => 'required|string|unique:news,title,'.$id.',id'
        ],[
            'title.required' => 'Tiêu đề không được để trống.',
            'title.unique' => 'Tiêu đề đã bị trùng với bài viết khác.',
        ]);
        $title = $request->input('title');
        $content = $request->input('text');
        $linkProduct = $request->input('link');
        $keyword = $request->input('keyword');
        $imageKit = new ImageKit(
            config('services.imagekit.public_key'),
            config('services.imagekit.private_key'),
            config('services.imagekit.url_endpoint')
        );
        if($request->hasFile('selectedImage')){
            $image = $request->file('selectedImage');
            $enTitle = Str::slug($title, '-');
            $imageName = $image->getClientOriginalName();
            $imagePath = 'public/news/'.$enTitle;
            $image->storeAs($imagePath, $imageName);
            $response = $imageKit->upload([
                'file' => fopen(Storage::path($imagePath.'/').$imageName,"r"),
                'fileName' => $imageName,
                'folder' => 'news/'.$enTitle,
            ]);
            $imageLink = $response->result->url;
            DB::table('news')->where('id',$id)->update([
                'image' => $imageLink,
            ]);
        }
        DB::table('news')->where('id',$id)->update([
            'title' => $title,
            'content' => $content,
            'linkProduct' => $linkProduct,
            'keyword' => $keyword
        ]);
        return response()->json('Sửa tin '.$title.' thành công!', 200);
    }

    public function destroy($id){
        $news = DB::table('news')->where('id',$id)->first();
        DB::table('news')->where('id',$id)->delete();
        return response()->json('Xóa thành công bài viết '. $news->title.'!', 200);
    }

    public function getNewsById(Request $request){
        $id = $request->input('id');
        $news = DB::table('news')->where('id',$id)->first();
        return response()->json($news, 200);
    }

    public function getNewsByTitle(Request $request){
        $news = DB::table('news')->where('slugTitle',$request->title)->first();
        $news1 = $this->index(6);
        return ['news' => $news, 'news1'=>$news1];
    }

    public function getTotalNews(){
        $total = DB::table('products')->select(DB::raw('count(*) as count'))->first();
        return response()->json($total, 200);
    }
}
