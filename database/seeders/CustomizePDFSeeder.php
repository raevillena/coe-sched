<?php

namespace Database\Seeders;

use App\Models\CustomizePDF\CustomizePDF;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CustomizePDFSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        CustomizePDF::create([
            'year_implemented' => '2025',
            'name' => 'curriculum_header',
            'image' => 'pdf_customizations/headers/header.png',
            'is_active' => '1',
        ]);

        CustomizePDF::create([
            'year_implemented' => '2025',
            'name' => 'curriculum_footer',
            'image' => 'pdf_customizations/footers/footer.png',
            'is_active' => '1',
        ]);
    }
}
