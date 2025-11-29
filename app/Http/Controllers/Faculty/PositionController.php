<?php

namespace App\Http\Controllers\Faculty;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use App\Models\Faculty\Position;
use App\Http\Resources\Faculty\PositionResource;
use Illuminate\Support\Facades\Log;

class PositionController extends Controller
{
    public function index(Request $request)
    {
        $cacheKeyPosition = 'positions_department_' . $request->department_id;

        $positions = cache()->remember($cacheKeyPosition, 300, function () use ($request) {
            return Position::where('department_id', $request->department_id)
                ->where('is_active', 1)->get();
        });

        // if (cache()->has($cacheKey)) {
        //     Log::info("Positions cache hit");
        // } else {
        //     Log::info("Positions cache miss");
        // }

        return PositionResource::collection($positions);
    }
}
