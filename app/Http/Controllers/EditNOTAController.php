<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\CustomizePDF\StoreCustomPDFRequest;
use App\Models\CustomizePDF\CustomizePDF;
use App\Models\EditNOTA\EditNOTA;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;


class EditNOTAController extends Controller
{
    //curriculum pdf 
    public function index()
    {
        $breadcrumbs = [
            ['title' => 'Dashboard', 'link' => route('dashboard')],
            ['title' => 'Document Management'],
            ['title' => 'NOTA Content Settings', 'link' => route('edit_nota.index')],
        ];

        return Inertia::render('DocumentManagement/EditNOTA/Index', [
            'breadcrumbs' => $breadcrumbs,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'intro' => 'nullable | string',
            'body' => 'nullable| string',
        ]);

        $notaContent = EditNOTA::create([
            'intro' => $request->input('intro'),
            'body' => $request->input('body'),
        ]);

        return response()->json(['success' => true, 'data' => $notaContent]);
    }

    public function show()
    {
        $notaContent = EditNOTA::latest()->first();
        return response()->json(['data' => $notaContent]);
    }
}
