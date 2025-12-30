<?php

namespace App\Imports;

use App\Models\Employee;
use App\Models\EmployeeSalary;
use App\Models\MonthlySalarySettlement;
use App\Models\SalaryComponent;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class EmployeeMonthlySalaryImport implements ToModel, WithChunkReading, WithBatchInserts, WithHeadingRow
{
    public array $failedRows = [];

    protected $createdBy;
    public function __construct()
    {
        $this->createdBy = Auth::id() ?? 1;
    }

    private function convertNamesToIds($row)
    {
        try {
            $employee      = data_get($row, 'employee');
            $employeeDetails = explode('-', $employee);
            // $userName = $employeeDetails[0];
            $employeeId = $employeeDetails[1];

            $employeeId = Employee::where('employee_id', $employeeId)->value('user_id');
            $salaryComponent = data_get($row, 'salary_component');

            $salaryComponentId = SalaryComponent::where('name', $salaryComponent)->value('id');

            return compact('employeeId', 'salaryComponentId');
        } catch (\Throwable $e) {
            return null;
        }
    }

    public function model(array $row)
    {
        try {
            $employee = data_get($row, 'employee');
            $amount = data_get($row, 'amount');

            if (!$employee || !$amount) {
                // Log::info("Missing required fields in row: " . json_encode($row));
                return null;
            }
            Log::info($row);
            // Log::info("Success ==");

            DB::transaction(function () use ($row) {
                $ids = $this->convertNamesToIds($row);

                // $employeeSalary = EmployeeSalary::where('employee_id', $ids['employeeId'])
                //     ->whereIn('created_by', getCompanyAndUsersId())
                //     ->first();

                MonthlySalarySettlement::updateOrCreate(
                    [
                        'employee_id' => $ids['employeeId'],
                        'created_by'  => $this->createdBy
                    ],
                    [
                        'amount' => $row['basic_salary'],
                        'salaryComponentId'   => $$ids['salaryComponentId'],
                        'is_active'    => true,
                        'notes'        => $row['notes']
                    ]
                );
            });
        } catch (\Throwable $e) {

            // capture failed row + error
            $row['error'] = $e->getMessage();
            $this->failedRows[] = $row;

            return null;
        }

        return null;
    }

    public function chunkSize(): int
    {
        return 1000;
    }
    public function batchSize(): int
    {
        return 1000;
    }
}
