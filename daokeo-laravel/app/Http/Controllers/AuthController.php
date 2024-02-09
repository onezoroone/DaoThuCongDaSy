<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use App\Mail\VerificationEmail;

class AuthController extends Controller
{
    public function login(Request $request){
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password'=> 'required'
        ],[
            'email.email' => 'Địa chỉ Email không hợp lệ!'
        ]);
        if (Auth::attempt($credentials)) {
            $user = User::where('email', $credentials['email'])->firstOrFail();
            if($user->verified == "true"){
                $token = $user->createToken('auth-token')->plainTextToken;
                return response(compact('user', 'token'));
            }else{
                return response([
                    'message' => 'Tài khoản chưa được xác thực.'
                ], 422);
            }
        }else{
            return response([
                'message' => 'Thông tin đăng nhập không chính xác.'
            ], 422);
        }
    }
    public function signup(Request $request){
        $request->validate([
            'name' => 'required',
            'address' => 'required',
            'email' => 'required|email|unique:users,email',
            'phone' => 'unique:users,phone',
            'password' => [
                'required',
                'confirmed',
                Password::min(8)->letters()->symbols()
            ]
        ], [
            'name.required' => 'Tên không được để trống.',
            'email.required' => 'Email không được để trống.',
            'email.unique' => 'Email đã được sử dụng.',
            'address.required' => 'Địa chỉ không được để trống',
            'password.confirmed' => 'Mật khẩu không khớp.',
            'password.required' => 'Mật khẩu không được để trống',
            'password' => 'Mật khẩu chứa ít nhất 8 ký tự, 1 ký tự đặc biệt và 1 chữ số',
            'phone.unique' => 'Số điện thoại đã được sử dụng.'
        ]);
        $token = Str::random(40);
        $link = env('APP_URL')."/dang-ky/xac-thuc/".$token;
        Mail::raw('Nhấp vào đường dẫn sau để kích hoạt tài khoản: '.$link, function ($message) use ($request) {
            $message->from(env('MAIL_FROM_ADDRESS'), 'Dao Thủ Công Đa Sỹ');
            $message->to($request->email, $request->name)->subject('Xác thực tài khoản');
        });
        $user = DB::table('users')->insert([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'address' => $request->address,
            'verification_code' => $token,
        ]);
        return response([
            'message' => 'Đăng ký thành công. Vui lòng kiểm tra email của bạn để xác thực tài khoản'
        ]);
    }

    public function verifyAccount($token){
        $user = DB::table('users')->where('verification_code',$token)->first();
        if (!$user) {
            abort(404, 'Xác thực thất bại.');
        }
        $now = Carbon::now();
        DB::table('users')->where("verification_code", $token)->update([
            'verification_code' => null,
            'verified' => true,
            'email_verified_at' => $now
        ]);
        return response()->json("Xác thực thành công!", 200);
    }

    public function logout(Request $request){
        $user = $request->user();
        $user->currentAccessToken()->delete();
        return response('', 204);
    }

    public function forgotPassword(Request $request){
        $request->validate([
            'email' => 'required|exists:users,email',
        ],[
            'email.required' => 'Email không được để trống.',
            'email.exists' => 'Email chưa được đăng ký.'
        ]);

        $email = $request->email;
        $token = Str::random(60);
        $link = env('APP_URL')."/quen-mat-khau/doi-mat-khau/".$token;
        Mail::raw('Nhấp vào đường dẫn sau để tiến hành đổi mật khẩu mới: '.$link, function ($message) use ($request) {
            $message->from(env('MAIL_FROM_ADDRESS'), 'Dao Thủ Công Đa Sỹ');
            $message->to($request->email, $request->name)->subject('Quên mật khẩu');
        });
        DB::table('password_reset_tokens')->insert([
            'email' => $email,
            'token' => $token,
            'created_at' => now(),
        ]);
        return response()->json("Gửi mã thành công.", 200);
    }

    public function reset(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'password' => [
                'required',
                'confirmed',
                Password::min(8)->letters()->symbols()
            ]
        ], [
            'password.confirmed' => 'Mật khẩu không khớp.',
            'password.required' => 'Mật khẩu không được để trống',
            'password' => 'Mật khẩu chứa ít nhất 8 ký tự, 1 ký tự đặc biệt và 1 chữ số'
        ]);

        $email = DB::table('password_reset_tokens')->where('token', $request->token)->value('email');
        $resetPassword = DB::table('password_reset_tokens')
            ->where('email', $email)
            ->where('token', $request->token)
            ->first();
        if (!$resetPassword) {
            return response([
                'message' => 'Token không hợp lệ.'
            ], 422);
        }
        $password = Hash::make($request->password);

        DB::table('users')
            ->where('email', $email)
            ->update(['password' => $password]);
        DB::table('password_reset_tokens')->where('email',$email)->update([
            'token' => "Đã dùng"
        ]);
        return response([
            'message' => 'Đổi mật khẩu thành công!'
        ]);
    }
}
