<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;

class FailedUsersExport implements FromArray
{
    protected $failedRows;

    public function __construct($failedRows)
    {
        $this->failedRows = $failedRows;
    }

    public function array(): array
    {
        return $this->failedRows;
    }
}
