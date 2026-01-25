<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function salaryRegister(Request $request)
    {
        return Inertia::render('reports/salary-register', [
            'salary_reports' => [],
            'filters' => $request->all(['search', 'sort_field', 'sort_direction', 'per_page']),
        ]);
    }

    public function itax(Request $request)
    {
        return Inertia::render('reports/itax', [
            'reports' => [],
            'filters' => $request->all(['search', 'sort_field', 'sort_direction', 'per_page']),
        ]);
    }

    public function netpay(Request $request)
    {
        return Inertia::render('reports/netpay', [
            'reports' => [],
            'filters' => $request->all(['search', 'sort_field', 'sort_direction', 'per_page']),
        ]);
    }

    public function pf(Request $request)
    {
        return Inertia::render('reports/pf', [
            'reports' => [],
            'filters' => $request->all(['search', 'sort_field', 'sort_direction', 'per_page']),
        ]);
    }

    public function esi(Request $request)
    {
        return Inertia::render('reports/esi', [
            'reports' => [],
            'filters' => $request->all(['search', 'sort_field', 'sort_direction', 'per_page']),
        ]);
    }

    public function lwf(Request $request)
    {
        return Inertia::render('reports/lwf', [
            'reports' => [],
            'filters' => $request->all(['search', 'sort_field', 'sort_direction', 'per_page']),
        ]);
    }

    public function ptax(Request $request)
    {
        return Inertia::render('reports/ptax', [
            'reports' => [],
            'filters' => $request->all(['search', 'sort_field', 'sort_direction', 'per_page']),
        ]);
    }

    public function salary(Request $request)
    {
        return Inertia::render('reports/salary', [
            'reports' => [],
            'filters' => $request->all(['search', 'sort_field', 'sort_direction', 'per_page']),
        ]);
    }
}
