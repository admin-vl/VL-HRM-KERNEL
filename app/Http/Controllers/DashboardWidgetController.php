<?php

namespace App\Http\Controllers;

use App\Models\DashboardWidget;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardWidgetController extends Controller
{
    /**
     * Store a newly created dashboard widget
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title'     => 'required|string|max:255',
                'query_key' => 'required|string|max:255',
            ]);

            // Prevent duplicate widget per user (extra safety beyond DB unique index)
            $exists = DashboardWidget::where('user_id', Auth::id())
                ->where('query_key', $validated['query_key'])
                ->exists();

            if ($exists) {
                return redirect()->back()->with(
                    'error',
                    __('This dashboard widget already exists.')
                );
            }

            $nextOrder = DashboardWidget::where('user_id', Auth::id())->max('order') ?? 0;

            DashboardWidget::create([
                'user_id'   => Auth::id(),
                'title'     => $validated['title'],
                'query_key' => $validated['query_key'],
                'order'     => $nextOrder + 1,
            ]);

            return redirect()->back()->with(
                'success',
                __('Dashboard widget added successfully.')
            );
        } catch (\Exception $e) {
            return redirect()->back()->with(
                'error',
                $e->getMessage() ?: __('Failed to add dashboard widget.')
            );
        }
    }
}
