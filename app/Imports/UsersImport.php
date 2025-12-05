<?php

namespace App\Imports;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Employee;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use PhpOffice\PhpSpreadsheet\Shared\Date;

class UsersImport implements ToModel, WithChunkReading, WithBatchInserts, WithHeadingRow
{
    protected $createdBy;

    public function __construct()
    {
        $this->createdBy = Auth::id() ?? 1; // fallback for queue jobs
    }

    public function model(array $row)
    {
        $name  = data_get($row, 'name');
        $email = data_get($row, 'email');

        if (!$email) {
            Log::warning('Skipped row due to missing email', $row);
            return null;
        }

        try {
            DB::transaction(function () use ($row, $name, $email) {

                // USER
                $user = User::where('email', $email)->first();

                if (!$user) {
                    $user = User::create([
                        'name'       => $name,
                        'email'      => $email,
                        'type'       => 'employee',
                        'password'   => Hash::make('password'),
                        'created_by' => $this->createdBy,
                    ]);
                } else {
                    $updates = [];

                    if (empty($user->name) && $name) {
                        $updates['name'] = $name;
                    }

                    if (empty($user->type)) {
                        $updates['type'] = 'employee';
                    }

                    if ($updates) {
                        $user->update($updates);
                    }
                }

                // EMPLOYEE
                $dob = data_get($row, 'date_of_birth');
                try {
                    if (is_numeric($dob)) {
                        $dob = Date::excelToDateTimeObject($dob)->format('Y-m-d');
                    } else {
                        $dob = Carbon::createFromFormat('d-m-Y', $dob)->format('Y-m-d');
                    }
                } catch (\Throwable $th) {
                    $dob = Carbon::createFromFormat('d-m-Y', $dob)->format('Y-m-d');
                }

                $employeePayload = [
                    'employee_id'   => data_get($row, 'employee_id'),
                    'phone'         => data_get($row, 'phone'),
                    'date_of_birth' => $dob,
                    'gender'        => data_get($row, 'gender'),
                    'user_id'       => $user->id,
                    'date_of_joining' => Carbon::now()->format('Y-m-d'),
                    'created_by'    => $this->createdBy,
                    'branch_id'     => 2,
                    'department_id' => 3,
                    'designation_id' => 3
                ];

                $employee = Employee::where('user_id', $user->id)->first();

                if ($employee) {
                    $employee->fill($employeePayload);
                    if ($employee->isDirty()) {
                        $employee->save();
                    }
                } else {
                    Employee::create($employeePayload);
                }
            });
        } catch (\Exception $e) {
            Log::error('Import failure: ' . $e->getMessage(), ['row' => $row]);
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
