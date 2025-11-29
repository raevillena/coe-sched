<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Reports;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HelpCenterController extends Controller
{
    public function index()
    {
        $breadcrumbs = [
            ['title' => 'Dashboard', 'link' => route('dashboard')],
            ['title' => 'Help Center', 'link' => route('help_center.index')],
        ];

        return Inertia::render('HelpCenter/Index', [
            'breadcrumbs' => $breadcrumbs
        ]);
    }
}
