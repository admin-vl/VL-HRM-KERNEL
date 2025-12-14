<?php

namespace App\Imports;

use App\Models\User;
use App\Models\Employee;
use App\Models\Branch;
use App\Models\Department;
use App\Models\Designation;
use App\Models\Shift;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use PhpOffice\PhpSpreadsheet\Shared\Date;

class UsersImport implements ToModel, WithChunkReading, WithBatchInserts, WithHeadingRow
{
    public array $failedRows = [];   // IMPORTANT

    protected $createdBy;
    private $bulkMode;
    public function __construct($bulkMode = 'add')
    {
        $this->createdBy = Auth::id() ?? 1;
        $this->bulkMode = $bulkMode;
    }

    private function parseDate($value)
    {
        if (!$value) return null;

        try {
            if (is_numeric($value)) {
                return Date::excelToDateTimeObject($value)->format('Y-m-d');
            }
            return Carbon::parse($value)->format('Y-m-d');
        } catch (\Throwable $e) {
            return null;
        }
    }

    private function convertNamesToIds($row)
    {
        try {
            $branchName      = data_get($row, 'branch');
            $departmentName  = data_get($row, 'department');
            $designationName = data_get($row, 'designation');
            $shiftName       = data_get($row, 'shift');

            $branchId = Branch::where('name', $branchName)->value('id');
            $departmentId = Department::where('name', $departmentName)
                ->when($branchId, fn($q) => $q->where('branch_id', $branchId))
                ->value('id');
            $designationId = Designation::where('name', $designationName)
                ->when($departmentId, fn($q) => $q->where('department_id', $departmentId))
                ->value('id');
            $shiftId = Shift::where('name', $shiftName)->value('id');

            return compact('branchId', 'departmentId', 'designationId', 'shiftId');
        } catch (\Throwable $e) {
            return null;
        }
    }

    public function model(array $row)
    {
        try {
            $email = data_get($row, 'email');
            $employeeId = data_get($row, 'employee');
            $phone = data_get($row, 'phone_no');

            if (!$email || !$employeeId || !$phone) {
                Log::info("Missing required fields in row: " . json_encode($row));
                return null;
                // throw new \Exception("Missing required fields");
            }

            DB::transaction(function () use ($row, $email) {

                $name = data_get($row, 'name');

                if ($this->bulkMode === 'add') {
                    $employeeExists = Employee::where('employee_id', $row['employee'])->first();
                    $userExists = Employee::where('employee_id', $row['employee'])->first();
                    if ($userExists) {
                        throw new \Exception("Employee already exists waith email $email.");
                    }
                    if ($employeeExists) {
                        throw new \Exception("Employee already exists waith employee code {$row['employee']}.");
                    }

                    $user = User::create([
                        'name'       => $name,
                        'email'      => $email,
                        'type'       => 'employee',
                        'password'   => Hash::make('password'),
                        'created_by' => $this->createdBy,
                    ]);
                } elseif ($this->bulkMode === 'update') {
                    $employeeUser = Employee::where('employee_id', $row['employee'])->first();
                    if (!$employeeUser) {
                        throw new \Exception("User with employee code {$row['employee']} not found for update.");
                    }
                    $user = User::where('id', $employeeUser->user_id)->first();
                    if (!$user) {
                        throw new \Exception("User with email {$email} not found for update.");
                    }
                    if ($name) {
                        $user->update(['name' => $name]);
                    }
                }

                // if (!$user->name && $name) {
                //     $user->update(['name' => $name]);
                // }

                $ids = $this->convertNamesToIds($row);

                // if (!$ids || !$ids['branchId']) {
                //     throw new \Exception("Invalid dropdown values (branch/department/designation/shift)");
                // }

                $employeePayload = [
                    'employee_id'   => $row['employee'],
                    'phone'         => $row['phone_no'],
                    'date_of_birth' => $this->parseDate(data_get($row, 'date_of_birth')),
                    'gender'        => data_get($row, 'gender'),
                    'user_id'       => $user->id,
                    'created_by'    => $this->createdBy,
                    'date_of_joining' => now()->format('Y-m-d'),

                    'branch_id'     => $ids['branchId'],
                    'department_id' => $ids['departmentId'],
                    'designation_id' => $ids['designationId'],
                    'shift_id'      => $ids['shiftId'] ?? null,
                ];

                if ($this->bulkMode === 'add') {
                    Employee::create($employeePayload);
                } elseif ($this->bulkMode === 'update') {
                    $employee = Employee::where('user_id', $user->id)->first();
                    if ($employee) {
                        // Log::info("Updating employee: " . $employee->id);
                        $employee->update($employeePayload);
                    }
                }
                // $employee = Employee::firstOrNew(['user_id' => $user->id]);
                // $employee->fill($employeePayload);
                // $employee->save();
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
