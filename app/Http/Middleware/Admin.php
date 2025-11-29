<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use Exception;
class Admin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        //not logged in
        if(!Auth::check()) {
            return redirect()->route('login');
        }

        $userRole = Auth::user()->role;
        
        //Super Admin
        if ($userRole == 'super-admin') {
            return redirect()->route('super-admin.dashboard');

        //Admin
        } elseif ($userRole == 'admin') {
            return $next($request);
        }

        //User
        elseif ($userRole == 'user') {
            return redirect()->route('dashboard');
        } else {
            // You can add a default return statement or throw an exception for unknown user roles
            throw new Exception('Unknown user role');
        }
    }
}
