<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
    public function calculateAllComponents()
    {
        // $selectedComponentIds = $this->components ?? [];
        $recurringNonRecurringIds = EmployeeSalaryComponent::where('employee_salary_id', $this->id)
            // ->where('type', 1)
            ->pluck('salary_components_id');

        $monthlySalarySettlement = MonthlySalarySettlement::where('employee_id', $this->employee_id)
            ->whereIn('created_by', getCompanyAndUsersId())
            ->pluck('salary_component_id');

        // $nonRecurringIds = EmployeeSalaryComponent::where('employee_salary_id', $this->id)
        //     ->where('type', 2)
        //     ->pluck('salary_components_id');

        $combinedIds = $recurringNonRecurringIds
            ->merge($monthlySalarySettlement)
            ->unique()
            ->values()
            ->toArray();

        $components = SalaryComponent::whereIn('id', $combinedIds)
            ->where('status', 'active')
            ->whereIn('created_by', getCompanyAndUsersId())
            ->get();

        $earnings = ['Basic Salary' => $this->basic_salary];

        $deductions = [];
        $totalEarnings = $this->basic_salary;
        $totalDeductions = 0;

        foreach ($components as $component) {
            $amount = $component->calculateAmount($this->basic_salary);
            if ($component->type === 'earning' || $component->type === 'reimbursement') {
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
