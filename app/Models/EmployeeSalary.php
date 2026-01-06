<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class EmployeeSalary extends BaseModel
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'basic_salary',
        'components',
        'is_active',
        'calculation_status',
        'notes',
        'created_by'
    ];

    protected $casts = [
        'basic_salary' => 'decimal:2',
        'components' => 'array',
        'is_active' => 'boolean',
    ];

    /**
     * Get the employee.
     */
    public function employee()
    {
        return $this->belongsTo(User::class, 'employee_id');
    }



    /**
     * Get the user who created the salary.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get active salary for employee.
     */
    public static function getActiveSalary($employeeId)
    {
        return static::where('employee_id', $employeeId)
            ->where('is_active', true)
            ->first();
    }

    /**
     * Get basic salary for employee.
     */
    public static function getBasicSalary($employeeId)
    {
        $salary = static::getActiveSalary($employeeId);
        return $salary ? $salary->basic_salary : 0;
    }

    /**
     * Calculate salary components based on selected components.
     */
    public function calculateAllComponents($payrollDate)
    {
        $payrollMonth = Carbon::parse($payrollDate)->month;
        $payrollYear = Carbon::parse($payrollDate)->year;

        $employeeComponents = SalaryComponent::join('employee_salary_components', 'salary_components.id', '=', 'employee_salary_components.salary_components_id')
            ->leftJoin('employee_salaries', 'employee_salaries.id', '=', 'employee_salary_components.employee_salary_id')
            ->where('employee_salaries.id', $this->id)  // Adjust the condition to match the employee salary ID
            ->select(
                'salary_components.type as component_type',
                'salary_components.name as name',
                'salary_components.calculation_type',
                'employee_salary_components.amount as amount',
                'employee_salary_components.salary_components_id as salary_component_id'
            );

        $monthlySettlement = SalaryComponent::join('monthly_salary_settlements', 'salary_components.id', '=', 'monthly_salary_settlements.salary_component_id')
            ->whereIn('monthly_salary_settlements.created_by', getCompanyAndUsersId())
            ->where('monthly_salary_settlements.status', 0)
            ->where('monthly_salary_settlements.month', $payrollMonth)
            ->where('monthly_salary_settlements.year', $payrollYear)
            ->where('monthly_salary_settlements.employee_id', $this->employee_id)
            ->select(
                'salary_components.type as component_type',
                'salary_components.name as name',
                DB::raw("'fixed' as calculation_type"),
                'monthly_salary_settlements.amount as amount',
                'monthly_salary_settlements.salary_component_id as salary_component_id'
            );

        $components = $employeeComponents
            ->unionAll($monthlySettlement)  // Use union() if you want distinct results
            ->get();

        $earnings = ['Basic Salary' => $this->basic_salary];

        $deductions = [];
        $totalEarnings = $this->basic_salary;
        $totalDeductions = 0;
        // Log::info(json_encode($components));

        foreach ($components as $component) {
            // $amount = $component->calculateAmount($this->basic_salary);
            $amount = $component->reviceCalculateAmount($this->basic_salary, $component->calculation_type, $component->amount);
            if ($component->component_type === 'earning' || $component->component_type === 'reimbursement') {
                $earnings[$component->name] = $amount;
                $totalEarnings += $amount;
            } else {
                $deductions[$component->name] = $amount;
                $totalDeductions += $amount;
            }
        }

        return [
            'basic_salary' => $this->basic_salary,
            'earnings' => $earnings,
            'deductions' => $deductions,
            'total_earnings' => $totalEarnings,
            'total_deductions' => $totalDeductions,
            'gross_salary' => $totalEarnings,
            'net_salary' => $totalEarnings - $totalDeductions,
        ];

        // Log::info(json_encode($data));
        // return $data;
    }

    public function salaryComponents()
    {
        return $this->belongsToMany(
            SalaryComponent::class,
            'employee_salary_components',
            'employee_salary_id',
            'salary_components_id'
        )
            ->withPivot(['amount', 'type'])
            ->withTimestamps();
    }

    public function employeeSalaryComponents()
    {
        return $this->hasMany(
            EmployeeSalaryComponent::class,
            "employee_salary_id",
            "id"
        );
    }
}
