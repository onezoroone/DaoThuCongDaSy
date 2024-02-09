<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PosterController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\OrderController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
Route::get('orders/getOrderByUser', [OrderController::class, 'getOrderByUser']);
Route::middleware('auth:sanctum')->group(function() {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logOut', [AuthController::class, 'logout']);
    // Guest
    Route::post('products/addToCart', [ProductController::class, 'addtoCart']);
    Route::post('products/postReview', [ProductController::class, 'postReview']);
    Route::post('Order', [OrderController::class, 'Order']);
    Route::post('carts/{id}/getCart', [OrderController::class, 'getCart']);
    Route::post('carts/removeCart', [ProductController::class,'removeCart']);
    Route::post('getIndex/{id}', [UserController::class, 'getCountCart']);
    Route::post('orders/Order', [OrderController::class, 'Order']);
    Route::post('users/updateUser', [UserController::class, 'update']);
    Route::post('orders/getOrderByUser', [OrderController::class, 'getOrderByUser']);
    Route::post('orders/cancelOrder', [OrderController::class, 'cancelOrder']);
    // Admin
    Route::group(['middleware' => 'admin'], function () {
        // Poster
        Route::post('posters/getPosters', [PosterController::class, 'index']);
        Route::post('posters/uploadPoster', [PosterController::class, 'create']);
        Route::post('posters/{id}/deletePoster', [PosterController::class, 'destroy']);
        // User
        Route::post('users/getUsers', [UserController::class, 'index']);
        // Category
        Route::post('categories/getCategories', [CategoryController::class, 'index']);
        Route::post('categories/addCategory', [CategoryController::class, 'create']);
        Route::post('categories/{id}/deleteCategory', [CategoryController::class, 'destroy']);
        // Product
        Route::post('products/getProducts', [ProductController::class, 'index']);
        Route::post('products/addProduct', [ProductController::class, 'create']);
        Route::post('products/{id}/deleteProduct', [ProductController::class, 'destroy']);
        Route::post('products/{id}/getProductById', [ProductController::class, 'getProductById']);
        Route::post('products/updateProduct', [ProductController::class, 'update']);
        Route::post('images/{id}/deleteImage',[ProductController::class, 'deleteImage']);
        Route::post('products/getSaleProducts', [ProductController::class, 'getSaleProducts']);
        Route::post('products/updateSaleProduct', [ProductController::class, 'updateSaleProduct']);
        // News
        Route::post('news/getNews', [NewsController::class, 'index']);
        Route::post('news/addNews', [NewsController::class, 'create']);
        Route::post('news/{id}/deleteNews', [NewsController::class, 'destroy']);
        Route::post('news/getNewsById', [NewsController::class, 'getNewsById']);
        Route::post('news/updateNews', [NewsController::class, 'update']);
        // Order
        Route::post('orders/getOrdersSuccess',[OrderController::class, 'index']);
        Route::post('orders/getDetailOrder', [OrderController::class, 'getDetailOrder']);
        Route::post('orders/getOrdersPeding',[OrderController::class, 'getOrdersPending']);
        Route::post('orders/getOrdersCancel',[OrderController::class, 'getOrdersCancel']);
        Route::post('orders/updateStatusOrder', [OrderController::class, 'updateStatusOrder']);
        // Dashboard
        Route::post('getNotifications', [UserController::class ,'getNotifications']);
        Route::post('readNotifications', [UserController::class, 'readNotifications']);
        Route::post('products/getProductsData', function () {
            $mostViewedProducts = app(ProductController::class)->getProductsMostView(5);
            $mostSellableProducts = app(ProductController::class)->getProductsMostSellable();
            $revenue = app(OrderController::class)->getRevenue();
            $productsTotal = app(ProductController::class)->getTotalProducts();
            $ordersTotal = app(OrderController::class)->getTotalOrders();
            $usersTotal = app(UserController::class)->getTotalUsers();
            $newsTotal = app(NewsController::class)->getTotalNews();
            $viewsDaily = app(ProductController::class)->getViewsDaily();
            $soldDaily = app(ProductController::class)->getProductsSold();
            $accessTimes = app(UserController::class)->getAccessTimes();
            $totalMoney = app(OrderController::class)->getTotalMoneyByMonth();
            return [
                'mostViewedProducts' => $mostViewedProducts,
                'mostSellableProducts' => $mostSellableProducts,
                'revenue' => $revenue,
                'totalProducts' => $productsTotal,
                'totalOrders' => $ordersTotal,
                'totalNews' => $newsTotal,
                'totalUsers' => $usersTotal,
                'viewsDaily' => $viewsDaily,
                'soldDaily' => $soldDaily,
                'accessTimes' => $accessTimes,
                'totalMoney' => $totalMoney,
            ];
        });
    });
});
// Account
Route::post('login', [AuthController::class, 'login']);
Route::post('signUp', [AuthController::class, 'signup']);
Route::post('verify/{token}', [AuthController::class ,'verifyAccount']);
Route::post('forgotPassword', [AuthController::class, 'forgotPassword']);
Route::post('resetPassword', [AuthController::class, 'reset']);

// Index
Route::post('web/fetchData', function () {
    $posters = app(PosterController::class)->index();
    $mostViewedProducts4 = app(ProductController::class)->getProductsMostView(5);
    $mostViewedProducts6 = app(ProductController::class)->getProductsMostView(6);
    $news = app(NewsController::class)->index(4);
    $lastestProducts = app(ProductController::class)->getProductsLastest(18);
    $salesProducts = app(ProductController::class)->getProductsBigSales(12);
    return [
        'posters' => $posters,
        'mostViewedProducts4' => $mostViewedProducts4,
        'mostViewedProducts6' => $mostViewedProducts6,
        'news' => $news,
        'lastestProducts' => $lastestProducts,
        'salesProducts' => $salesProducts,
    ];
});
Route::post('products/{id}/getProductById', [ProductController::class, 'getProductById']);
Route::get('categories/getCategories', [CategoryController::class, 'index']);
Route::get('users/upTimeAccess', [UserController::class ,'upTimeAccess']);
Route::post('products/{name}/getProduct', [ProductController::class, 'getProduct']);
Route::get('news/getNews', function () {
    $news = app(NewsController::class)->index(10);
    $news1 = app(NewsController::class)->getNewsMostView(6);
    return [
        'news' => $news,
        'newsViews' => $news1
    ];
});
Route::post('news/getNewsByTitle', [NewsController::class, 'getNewsByTitle']);
// Filter
Route::post('products/filterProducts', function () {
    $categories = app(CategoryController::class)->index();
    $products = app(ProductController::class)->index();
    return [
        'categories' => $categories,
        'products' => $products,
    ];
});
Route::post('products/getProductsByCategory', [ProductController::class, 'getProductsByCategory']);
