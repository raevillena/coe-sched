<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;

class ToursController extends Controller
{
    public function update()
    {
        request()->validate(['tour' => ['required', 'string']]);

        $user = request()->user();

        Log::info("User {$user->id} completed the tour: " . request('tour'));

        $user->update([
            'tours' => array_merge(
                $user->tours ?? [],
                [request('tour') => true]
            )
        ]);

        return response()->noContent();
    }
}