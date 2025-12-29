<?php

namespace App\Imports;

use App\Models\Employee;
use App\Models\EmployeeSalary;
use App\Models\SalaryComponent;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class EmployeeSalaryImport implements ToModel, WithChunkReading, WithBatchInserts, WithHeadingRow
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
            $recurringSalary = data_get($row, 'recurring_salary');
            $recurringSalaryArray = explode(",", $recurringSalary);

            $nonRecurringSalary  = data_get($row, 'non_recurring_salary');
            $nonRecurringSalaryArray = explode(",", $nonRecurringSalary);

            $recurringSalaryIds = SalaryComponent::select(
                'id',
                'calculation_type',
                'default_amount',
                'percentage_of_basic'
            )
                ->whereIn('name', $recurringSalaryArray)
                ->get();


            $nonRecurringSalaryIds = SalaryComponent::select(
                'id',
                'calculation_type',
                'default_amount',
                'percentage_of_basic'
            )
                ->whereIn('name', $nonRecurringSalaryArray)
                ->get();

            return compact('employeeId', 'recurringSalaryIds', 'nonRecurringSalaryIds');
        } catch (\Throwable $e) {
            return null;
        }
    }

    public function model(array $row)
    {
        try {
            $employee = data_get($row, 'employee');
            $basicSalary = data_get($row, 'basic_salary');

            if (!$employee || !$basicSalary) {
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



                $recurringSalaryIds = [];
                if (!empty($ids['recurringSalaryIds'])) {
                    $recurringSalaryIds = $ids['recurringSalaryIds']->pluck('id');
                }
                // Log::info("bababaab".$recurringSalaryIds);
                $employeeSalary = EmployeeSalary::updateOrCreate(
                    [
                        'employee_id' => $ids['employeeId'],
                        'created_by'  => $this->createdBy
                    ],
                    [
                        'basic_salary' => $row['basic_salary'],
                        'components'   => $recurringSalaryIds,
                        'is_active'    => true,
                        'notes'        => $row['notes']
                    ]
                );

                Log::info("Success ==". json_encode($ids['recurringSalaryIds']));

                $recurring = [];
                if (!empty($ids['recurringSalaryIds'])) {
                    $recurring = collect($ids['recurringSalaryIds'])
                        ->mapWithKeys(fn($item) => [
                            (string) $item['id'] => [
                                'amount' => $item['calculation_type'] == "fixed" ? $item['default_amount'] : $item['percentage_of_basic'],
                                'type'   => 1,
                            ]
                        ]);
                }

                $nonRecurring = [];
                if (!empty($ids['nonRecurringSalaryIds'])) {
                    $nonRecurring = collect($ids['nonRecurringSalaryIds'])
                        ->mapWithKeys(fn($item) => [
                            (string) $item['id'] => [
                                'amount' => $item['calculation_type'] == "fixed" ? $item['default_amount'] : $item['percentage_of_basic'],
                                'type'   => 2,
                            ]
                        ]);
                }
                $allComponents = $recurring->union($nonRecurring)->toArray();

                $employeeSalary->salaryComponents()->sync($allComponents);
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
