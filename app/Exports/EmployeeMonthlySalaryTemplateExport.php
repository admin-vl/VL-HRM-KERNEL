<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class EmployeeMonthlySalaryTemplateExport implements WithMultipleSheets
{
    use Exportable;

    public function sheets(): array
    {
        return [
            new EmployeeMonthlySalaryDataSheet(),     // main sheet with record + dropdowns (creates its own hidden helper sheet)
        ];
    }
}
