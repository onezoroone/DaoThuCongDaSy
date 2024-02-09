<?php

namespace App\Http\Controllers;

use App\Models\Poster;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use ImageKit\ImageKit;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
class PosterController extends Controller
{
    public function index()
    {
        $posters = DB::table('posters')->get();
        return response()->json($posters, 200);
    }

    public function create(Request $request)
    {
        $imageKit = new ImageKit(
            config('services.imagekit.public_key'),
            config('services.imagekit.private_key'),
            config('services.imagekit.url_endpoint')
        );

        $image = $request->file('selectedImage');
        $imageName = $image->getClientOriginalName();
        $imagePath = 'public/posters/' . $imageName;
        if(Storage::exists($imagePath)){
            $extension = $image->getClientOriginalExtension();
            $imageName = Str::random(10) . '.' . $extension;
        }
        $image->storeAs('public/posters', $imageName);
        $response = $imageKit->upload([
            'file' => fopen(Storage::path('public/posters/').$imageName,"r"),
            'fileName' => $imageName,
            'folder' => 'posters',
        ]);
        $imageUrl = $response->result->url;
        DB::table('posters')->insert([
            'imageName' => $imageName,
            'imageLink' => $imageUrl
        ]);
        return response()->json('Tải ảnh lên thành công!', 200);
    }

    public function destroy($id)
    {
        $poster = DB::table('posters')->where('id',$id)->first();
        $posterName = $poster->imageName;
        $posterPath = 'public/posters/' . $posterName;
        Storage::delete($posterPath);
        DB::table('posters')->where('id',$id)->delete();
        return response()->json('Xóa ảnh thành công!', 200);
    }
}
