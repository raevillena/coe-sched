<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\CustomizePDF\StoreCustomPDFRequest;
use App\Models\CustomizePDF\CustomizePDF;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;


class CustomizePDFController extends Controller
{
    //curriculum pdf 
    public function index()
    {
        $breadcrumbs = [
            ['title' => 'Dashboard', 'link' => route('dashboard')],
            ['title' => 'Document Management'],
            // ['title' => 'View Curriculum', 'link' => route('curriculum.index')],
            ['title' => 'Header & Footer Settings', 'link' => route('customize_pdf.index')],
        ];

        return Inertia::render('DocumentManagement/CustomizePDF/Index', [
            'breadcrumbs' => $breadcrumbs,
        ]);
    }

    public function storeCurriculum(StoreCustomPDFRequest $request)
    {
        $headerPath = null;
        $footerPath = null;
        $name = '';

        if ($headerFile = $request->file('curriculum_header')) {
            $headerFileName = time() . '-header-' . $headerFile->getClientOriginalName();
            $headerPath = $headerFile->storeAs('pdf_customizations/headers', $headerFileName, 'public');
            $name = 'curriculum_header';
            // Log::info('Header file uploaded', ['headerFileName' => $headerFileName, 'headerPath' => $headerPath]);
        }

        if ($footerFile = $request->file('curriculum_footer')) {
            $footerFileName = time() . '-footer-' . $footerFile->getClientOriginalName();
            $footerPath = $footerFile->storeAs('pdf_customizations/footers', $footerFileName, 'public');
            $name = 'curriculum_footer';
            // Log::info('Footer file uploaded', ['footerFileName' => $footerFileName, 'footerPath' => $footerPath]);
        }

        if ($headerPath || $footerPath) {
            if ($headerPath && $footerPath) {
                //save each file separately with their respective names.
                CustomizePDF::create([
                    'year_implemented' => $request->input('year_implemented'),
                    'name' => 'curriculum_header',
                    'image' => $headerPath,
                ]);

                CustomizePDF::create([
                    'year_implemented' => $request->input('year_implemented'),
                    'name' => 'curriculum_footer',
                    'image' => $footerPath,
                ]);
            } else {
                CustomizePDF::create([
                    'year_implemented' => $request->input('year_implemented'),
                    'name' => $name,
                    'image' => $headerPath ?? $footerPath,
                ]);
            }

            return redirect()->back()->with('success', 'PDF Customization saved successfully.');
        }

        return redirect()->back()->with('error', 'No file was uploaded.');
    }

    // public function getCurriculumHeaderPDFYear(){
    //     $header_year = CustomizePDF::where('name', 'curriculum_header')->pluck('year_implemented')->unique();
    //     return response()->json($header_year);
    // }

    public function getCurriculumHeaderImages()
    {
        $header_images = CustomizePDF::where('name', 'curriculum_header')->get('image');
        return response()->json($header_images);
    }

    public function getCurriculumFooterImages()
    {
        $footer_images = CustomizePDF::where('name', 'curriculum_footer')->get('image');
        return response()->json($footer_images);
    }

    public function updateHeaderFooterStatus(Request $request)
    {
        $image = $request->input('image');
        $type = $request->input('type');

        CustomizePDF::where('name', $type)->update(['is_active' => 0]);
        CustomizePDF::where('image', $image)->update(['is_active' => 1]);

        return response()->json(['message' => 'Image status updated successfully']);
    }

    public function getActiveHeaderFooter(Request $request)
    {
        $type = $request->input('type');

        $activeHeaderFooter = CustomizePDF::where('name', $type)->where('is_active', 1)->first();

        if ($activeHeaderFooter) {
            return response()->json($activeHeaderFooter);
        } else {
            return response()->json(['message' => 'No active image found'], 404);
        }
    }
}
