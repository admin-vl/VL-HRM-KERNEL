<?php

namespace App\Http\Controllers;

use App\Exports\EmployeeMonthlySalaryTemplateExport;
use App\Imports\EmployeeMonthlySalaryImport;
use App\Models\EmployeeSalary;
use App\Models\MonthlySalarySettlement;
use App\Models\SalaryComponent;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\HeadingRowImport;

class MonthlySalaryController extends Controller
{
    public function index(Request $request)
    {
        // Auto-create salary records for employees who don't have one
        // $companyEmployees = User::where('type', 'employee')
        //     ->whereIn('created_by', getCompanyAndUsersId())
        //     ->get();

        // foreach ($companyEmployees as $employee) {
        //     $exists = EmployeeSalary::where('employee_id', $employee->id)->exists();
        //     if (!$exists) {
        //         EmployeeSalary::create([
        //             'employee_id' => $employee->id,
        //             'basic_salary' => 0,
        //             'components' => null,
        //             'is_active' => true,
        //             'created_by' => creatorId(),
        //         ]);
        //     }
        // }

        $query = MonthlySalarySettlement::whereIn('created_by', getCompanyAndUsersId())
            ->where('status', 0)
            // ->lefyJoin('salary_components', 'salary_components.id', '=', 'monthly_salary_settlements.salary_component_id')
            ->with(['employee', 'creator', 'salary_component']);

        // Handle search
        if ($request->has('search') && !empty($request->search)) {
            $query->where(function ($q) use ($request) {
                $q->whereHas('employee', function ($subQ) use ($request) {
                    $subQ->where('name', 'like', '%' . $request->search . '%');
                });
            });
        }

        // Handle employee filter
        if ($request->has('employee_id') && !empty($request->employee_id) && $request->employee_id !== 'all') {
            $query->where('employee_id', $request->employee_id);
        }



        // Handle active status filter
        // if ($request->has('is_active') && !empty($request->is_active) && $request->is_active !== 'all') {
        //     $query->where('is_active', $request->is_active === 'active');
        // }

        // Handle sorting
        if ($request->has('sort_field') && !empty($request->sort_field)) {
            $query->orderBy($request->sort_field, $request->sort_direction ?? 'asc');
        } else {
            $query->orderBy('id', 'desc');
        }

        $monthlySalary = $query->paginate($request->per_page ?? 10);

        // Load component names and types for each salary record
        // $employeeSalaries->getCollection()->transform(function ($salary) {
        //     if ($salary->components) {
        //         $components = SalaryComponent::whereIn('id', $salary->components)
        //             ->get(['id', 'name', 'type']);
        //         $salary->component_names = $components->pluck('name')->toArray();
        //         $salary->component_types = $components->pluck('type')->toArray();
        //     } else {
        //         $salary->component_names = [];
        //         $salary->component_types = [];
        //     }
        //     return $salary;
        // });


        // Get employees for filter dropdown
        $employees = User::where('type', 'employee')
            ->whereIn('created_by', getCompanyAndUsersId())
            ->get(['id', 'name']);

        // Get salary components for form
        $salaryComponents = SalaryComponent::where('status', 'active')
            ->whereIn('created_by', getCompanyAndUsersId())
            ->get(['id', 'name', 'type', 'calculation_type', 'default_amount', 'percentage_of_basic']);

        return Inertia::render('hr/monthly-salary/index', [
            'monthlySalary' => $monthlySalary,
            'salaryComponents' => $salaryComponents,
            'employees' => $employees,
            'filters' => $request->all(['search', 'employee_id', 'is_active', 'sort_field', 'sort_direction', 'per_page']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:users,id',
            'basic_salary' => 'required|numeric|min:0',
            'components' => 'nullable|array',
            'components.*' => 'exists:salary_components,id',
            'notes' => 'nullable|string',
        ]);

        // Check if employee already has salary
        $exists = EmployeeSalary::where('employee_id', $validated['employee_id'])
            ->whereIn('created_by', getCompanyAndUsersId())
            ->exists();

        if ($exists) {
            return redirect()->back()->with('error', __('Employee already has a salary record. Please update the existing one.'));
        }

        $validated['created_by'] = creatorId();
        $validated['is_active'] = true;

        EmployeeSalary::create($validated);

        return redirect()->back()->with('success', __('Employee salary created successfully.'));
    }



    public function update(Request $request, $monthlySalaryId)
    {
        $monthlySalary = MonthlySalarySettlement::where('id', $monthlySalaryId)
            ->whereIn('created_by', getCompanyAndUsersId())
            ->first();

        if ($monthlySalary) {
            try {
                $validated = $request->validate([
                    'employee_id' => 'required|exists:users,id',
                    'amount' => 'required|numeric|min:0',
                    'salary_component_id' => 'exists:salary_components,id',
                    'notes' => 'nullable|string',
                ]);

                $monthlySalary->update($validated);

                return redirect()->back()->with('success', __('Monthly salary statement updated successfully'));
            } catch (\Exception $e) {
                return redirect()->back()->with('error', $e->getMessage() ?: __('Failed to update monthly salary statement'));
            }
        } else {
            return redirect()->back()->with('error', __('Monthly salary statement salary Not Found.'));
        }
    }

    public function destroy($monthlySalaryId)
    {
        $employeeSalary = MonthlySalarySettlement::where('id', $monthlySalaryId)
            ->whereIn('created_by', getCompanyAndUsersId())
            ->first();

        if ($employeeSalary) {
            try {
                $employeeSalary->delete();
                return redirect()->back()->with('success', __('Employee salary deleted successfully'));
            } catch (\Exception $e) {
                return redirect()->back()->with('error', $e->getMessage() ?: __('Failed to delete employee salary'));
            }
        } else {
            return redirect()->back()->with('error', __('Employee salary Not Found.'));
        }
    }

    public function downloadTemplate()
    {
        return Excel::download(new EmployeeMonthlySalaryTemplateExport(), 'employee_monthly_settlement_template.xlsx');
    }

    public function create_bulk()
    {
        $years = $this->getYears();
        return Inertia::render('hr/monthly-salary/create_bulk', [
            'years' => $years
        ]);
    }

    public function getYears()
    {
        $years = [];
        $currentYear = date('Y');

        for ($i = 0; $i < 5; $i++) {
            $year = $currentYear - $i;
            $years[] = [
                'value' => (string) $year,
                'label' => (string) $year,
            ];
        }

        return $years;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function bulkCreate(Request $request)
    {
        try {
            // Validate basic information
            $validator = Validator::make($request->all(), [
                'bulk_file' => 'required',
                'month' => 'required',
                'year' => 'required'
            ]);

            if ($validator->fails()) {
                return redirect()->back()->withErrors($validator)->withInput();
            }

            $file = $request->file('bulk_file');

            $headerRow      = (new HeadingRowImport())->toArray($file)[0][0];
            $actualHeadings = array_map('trim', array_values($headerRow));

            $requiredHeadings = [
                'employee',
                'amount',
                'salary_component',
                'notes'
            ];

            $missing = array_diff($requiredHeadings, $actualHeadings);

            if (!empty($missing)) {
                return redirect()->back()->with('error', 'Missing required columns: ' . implode(', ', $missing))->withInput();
            }

            // Create User model object
            $import = new EmployeeMonthlySalaryImport($request->month, $request->year);
            Excel::import($import, $file);

            // Check if there are failed rows
            // if (count($import->failedRows) > 0) {
            //     \Log::info('Some rows failed during employee import', ['failed_rows' => $import->failedRows]);

            //     $fileName = 'excel/failed_rows_' . now()->format('Y-m-d_H-i-s') . '.xlsx';

            //     return redirect()
            //         ->back()
            //         ->with('error', 'employee_create_failed' . Storage::url($fileName))
            //         ->withInput();
            // }

            return redirect()->route('hr.monthly-salary.index')->with('success', __('Employee Upload successfully'));
        } catch (\Exception $e) {
            Log::error('Employee creation failed: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return redirect()->back()->with('error', __('Failed to create employee: :message', ['message' => $e->getMessage()]))->withInput();
        }
    }
}
