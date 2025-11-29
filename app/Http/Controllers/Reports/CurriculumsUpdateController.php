<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CurriculumsUpdateController extends Controller
{
    public function index()
    {
        $breadcrumbs = [
            ['title' => 'Dashboard', 'link' => route('dashboard')],
            ['title' => 'Reports'],
            ['title' => 'Curriculums Update', 'link' => route('curriculums_update.index')],
        ];

        return Inertia::render('Reports/CurriculumsUpdate', [
            'breadcrumbs' => $breadcrumbs,
        ]);
    }
}
