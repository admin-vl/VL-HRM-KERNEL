<?php

namespace App\Http\Controllers;

use App\Models\PayrollEntry;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function salaryRegister(Request $request)
    {
        $salaryQuery = PayrollEntry::join('users', 'users.id', '=', 'payroll_entries.employee_id')
            ->join('employees', 'employees.user_id', '=', 'users.id')
            ->leftJoin('departments', 'departments.id', 'employees.department_id')
            ->leftJoin('designations', 'designations.id', 'employees.designation_id')
            ->leftJoin('branches', 'departments.id', 'employees.branch_id')
            ->select([
                "users.name",
                "employees.employee_id",
                "employees.date_of_birth",
                "employees.date_of_joining",
                "employees.bank_name",
                "account_number",
                "basic_salary",
                "gross_pay",
                "net_pay",
                "total_deductions",
                "unpaid_leave_days",
                "working_days",
                "present_days",
                "full_present_days",
                "half_days",
                "holiday_days",
                "paid_leave_days",
                "absent_days",
                "overtime_hours",
                "overtime_amount",
                "per_day_salary",
                "unpaid_leave_deduction",
                "earnings_breakdown",
                "deductions_breakdown",
                "designations.name as designation",
                "departments.name as department",
                "branches.name as location",
            ])->orderBy('payroll_entries.created_at', 'DESC');

        $perPage = $request->has('per_page') ? (int)$request->per_page : 10;
        $salaries = $salaryQuery->paginate($perPage)->withQueryString();

        return Inertia::render('reports/salary-register', [
            'salary_reports' => $salaries,
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
