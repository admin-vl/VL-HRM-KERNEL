<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;

class FailedUsersExport implements FromArray, WithHeadings
{
    protected $failedRows;

    public function __construct($failedRows)
    {
        $this->failedRows = $failedRows;
    }

    public function headings(): array
    {
        return [
            'name',
            'email',
            'employee',
            'phone_no',
            'branch',
            'department',
            'designation',
            'shift',
            'date_of_birth',
            'gender',
            'date_of_joining',
            'address_line_1',
            'address_line_2',
            'city',
            'state',
            'country',
            'postal_code',
            'bank_name',
            'account_holder_name',
            'account_number',
            'ifsc_code',
            'bank_branch',
            'reason' // Add reason column at the end
        ];
    }

    public function array(): array
    {
        $result = [];
        
        foreach ($this->failedRows as $row) {
            $mappedRow = [
                $row['name'] ?? '',
                $row['email'] ?? '',
                $row['employee'] ?? '',
                $row['phone_no'] ?? '',
                $row['branch'] ?? '',
                $row['department'] ?? '',
                $row['designation'] ?? '',
                $row['shift'] ?? '',
                $row['date_of_birth'] ?? '',
                $row['gender'] ?? '',
                $row['date_of_joining'] ?? '',
                $row['address_line_1'] ?? '',
                $row['address_line_2'] ?? '',
                $row['city'] ?? '',
                $row['state'] ?? '',
                $row['country'] ?? '',
                $row['postal_code'] ?? '',
                $row['bank_name'] ?? '',
                $row['account_holder_name'] ?? '',
                $row['account_number'] ?? '',
                $row['ifsc_code'] ?? '',
                $row['bank_branch'] ?? '',
                $row['error'] ?? 'Unknown error' // Reason column at the end
            ];
            
            $result[] = $mappedRow;
        }
        
        return $result;
    }
}
