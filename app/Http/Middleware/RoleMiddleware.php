<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use Exception;
class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        // not logged in
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $userRole = Auth::user()->role;

        // role hierarchy
        $roleHierarchy = [
            'super-admin' => 3,
            'admin' => 2,
            'user' => 1,
        ];

        if (!isset($roleHierarchy[$userRole]) || $roleHierarchy[$userRole] < $roleHierarchy[$role]) {
            if ($userRole === 'super-admin') {
                return redirect()->route('super-admin.dashboard');
            } elseif ($userRole === 'admin') {
                return redirect()->route('admin.dashboard');
            } elseif ($userRole === 'user') {
                return redirect()->route('dashboard');
            }
            // default action for unknown roles
            abort(403, 'Unauthorized');
        }

        return $next($request);
    }
}
