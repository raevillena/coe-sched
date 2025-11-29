<?php

namespace App\Http\Controllers;

use App\Models\UserPreference;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserPreferenceController extends Controller
{
    public function updatePinnedCalendar(Request $request)
    {
        $preference = UserPreference::updateOrCreate(
            ['user_id' => Auth::id()],
            ['pinned_calendar' => $request->pinnedCalendar]
        );

        return response()->json(['status' => 'success']);
    }

    public function getPinnedCalendar()
    {
        $preference = UserPreference::where('user_id', Auth::id())->first();
        return response()->json([
            'pinnedCalendar' => $preference ? $preference->pinned_calendar : null
        ]);
    }
}
