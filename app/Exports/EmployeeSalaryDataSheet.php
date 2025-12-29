<?php

namespace App\Exports;

use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Cell\DataValidation;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Events\AfterSheet;
use App\Models\SalaryComponent;
use App\Models\User;
use PhpOffice\PhpSpreadsheet\NamedRange;

class EmployeeSalaryDataSheet implements WithHeadings, WithMapping, WithEvents, FromArray
{
    public function headings(): array
    {
        return [
            'employee',
            'basic_salary',
            'notes',
            'recurring_salary',
            'non_recurring_salary',
            'All Recurring Components',
            'All Non Recurring Components',
            'Note'
        ];
    }

    public function array(): array
    {
        return [[
            '',
            20000,
            'Notes',
            '',
            '',
            '',
            '',
            'For multiple recurring and non recurring add comma separated'
        ]];
    }

    public function map($row): array
    {
        return $row;
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $spreadsheet = $event->sheet->getParent();
                $sheet = $event->sheet->getDelegate();

                /** ================== CREATE HIDDEN LIST SHEET ================== */
                $listSheet = new Worksheet($spreadsheet, 'lists');
                $spreadsheet->addSheet($listSheet);
                $listSheet->setSheetState(Worksheet::SHEETSTATE_HIDDEN);

                /** ================== EMPLOYEES ================== */
                $employees = User::whereIn('users.created_by', getCompanyAndUsersId())
                    ->join('employees', 'employees.user_id', '=', 'users.id')
                    ->where('status', 'active')
                    ->get()
                    ->map(fn($e) => trim($e->name . '-' . $e->employee_id))
                    ->filter()
                    ->values()
                    ->toArray();

                if (!empty($employees)) {
                    foreach ($employees as $i => $emp) {
                        $listSheet->setCellValue('A' . ($i + 1), $emp);
                    }

                    $spreadsheet->addNamedRange(
                        new NamedRange('EmpList', $listSheet, '$A$1:$A$' . count($employees))
                    );

                    $this->applyDropdown($sheet, 'A2:A500', '=EmpList');
                }

                /** ================== RECURRING COMPONENTS ================== */
                $recurring = SalaryComponent::whereIn('created_by', getCompanyAndUsersId())
                    ->where('status', 'active')
                    ->where('recurring_type', 'recurring')
                    ->pluck('name')
                    ->map(fn($v) => trim($v))
                    ->filter()
                    ->values()
                    ->toArray();

                if (!empty($recurring)) {
                    foreach ($recurring as $i => $name) {
                        $listSheet->setCellValue('B' . ($i + 1), $name);
                    }

                    $spreadsheet->addNamedRange(
                        new NamedRange('RecList', $listSheet, '$B$1:$B$' . count($recurring))
                    );

                    $this->applyDropdown($sheet, 'F2:F500', '=RecList');
                }

                /** ================== NON-RECURRING COMPONENTS ================== */
                $nonRecurring = SalaryComponent::whereIn('created_by', getCompanyAndUsersId())
                    ->where('status', 'active')
                    ->where('recurring_type', 'non-recurring')
                    ->pluck('name')
                    ->map(fn($v) => trim($v))
                    ->filter()
                    ->values()
                    ->toArray();

                if (!empty($nonRecurring)) {
                    foreach ($nonRecurring as $i => $name) {
                        $listSheet->setCellValue('C' . ($i + 1), $name);
                    }

                    $spreadsheet->addNamedRange(
                        new NamedRange('NonRecList', $listSheet, '$C$1:$C$' . count($nonRecurring))
                    );

                    $this->applyDropdown($sheet, 'G2:G500', '=NonRecList');
                }
            }
        ];
    }

    /**
     * Optimized Dropdown Application
     */
    private function applyDropdown($sheet, string $range, string $formula)
    {
        // Get the first cell of the range to set up validation
        $cellAddress = explode(':', $range)[0];
        $validation = $sheet->getCell($cellAddress)->getDataValidation();
        
        $validation->setType(DataValidation::TYPE_LIST);
        $validation->setErrorStyle(DataValidation::STYLE_STOP);
        $validation->setAllowBlank(true);
        $validation->setShowDropDown(true);
        $validation->setShowErrorMessage(true);
        $validation->setErrorTitle('Input error');
        $validation->setError('Value not in list');
        $validation->setFormula1($formula);

        // Apply the validation to the entire range at once
        $sheet->setDataValidation($range, $validation);
    }
}