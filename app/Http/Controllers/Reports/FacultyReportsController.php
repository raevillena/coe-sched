<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class FacultyReportsController extends Controller
{
    public function index()
    {
        $breadcrumbs = [
            ['title' => 'Dashboard', 'link' => route('dashboard')],
            ['title' => 'Reports'],
            ['title' => 'Faculty Reports', 'link' => route('faculty_reports.index')],
        ];

        return Inertia::render('Reports/FacultyReports', [
            'breadcrumbs' => $breadcrumbs,
        ]);
    }
}
