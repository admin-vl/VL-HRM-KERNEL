<?php

namespace App\Exports;

use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\NamedRange;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Events\AfterSheet;
use App\Models\Branch;
use App\Models\Department;
use App\Models\Designation;
use Illuminate\Support\Facades\Log;

class EmployeeDataSheet implements WithHeadings, WithMapping, WithEvents, FromArray
{
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
            // 'employment_type',
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
            'bank_branch'
        ];
    }

    public function array(): array
    {
        // Load dynamic first records (if available)
        $branch = Branch::whereIn('created_by', getCompanyAndUsersId())
            ->where('status', 'active')
            ->first();

        $department = Department::where('branch_id', optional($branch)->id)
            ->whereIn('created_by', getCompanyAndUsersId())
            ->where('status', 'active')
            ->first();

        $designation = Designation::where('department_id', optional($department)->id)
            ->whereIn('created_by', getCompanyAndUsersId())
            ->where('status', 'active')
            ->first();

        $shift = \App\Models\Shift::whereIn('created_by', getCompanyAndUsersId())
            ->select('name')
            ->where('status', 'active')
            ->first();

        return [[
            'Test User',
            'test@gmail.com',
            'EMP001',
            '9876543210',
            optional($branch)->name,
            optional($department)->name,
            optional($designation)->name,
            optional($shift)->name,
            '25-03-1995',
            'male',
            '25-03-2025',
            // 'Full-time',
            'Address line 1',
            'Address line 2',
            'Thane',
            'Maharashtra',
            'India',
            '400609',
            'SBI',
            'Test User',
            '1234567890',
            'IFSC0001',
            'Majiwada Branch'
        ]];
    }

    // One sample record
    public function map($row): array
    {
        return $row;
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {

                /** @var Worksheet $sheet */
                $sheet = $event->sheet->getDelegate();
                $spreadsheet = $sheet->getParent();

                // Create Dropdown helper sheet
                $dropdown = $spreadsheet->createSheet();
                $dropdown->setTitle('Dropdown');

                // Fetch lists from DB
                $branches = Branch::whereIn('created_by', getCompanyAndUsersId())
                    ->where('status', 'active')
                    ->get(['id', 'name']);

                $departments = Department::whereIn('created_by', getCompanyAndUsersId())
                    ->where('status', 'active')
                    ->get(['id', 'name', 'branch_id']);

                $designations = Designation::whereIn('created_by', getCompanyAndUsersId())
                    ->where('status', 'active')
                    ->get(['id', 'name', 'department_id']);

                $shiftsData = \App\Models\Shift::whereIn('created_by', getCompanyAndUsersId())
                    ->where('status', 'active')
                    ->get(['name']);

                $shifts = [];
                foreach ($shiftsData as $s) {
                    $shifts[] = $s->name;
                }

                // --- Populate Dropdown sheet with safe defaults if empty ---

                // BRANCHES: A = id, E = name
                $bRow = 1;
                if ($branches->isEmpty()) {
                    // ensure at least one row exists to avoid 0-length range
                    $dropdown->setCellValue('A1', '0');
                    $dropdown->setCellValue('E1', 'N/A');
                    $bRow = 2; // so branchEnd = 1
                } else {
                    foreach ($branches as $b) {
                        $dropdown->setCellValue("A{$bRow}", $b->id);
                        $dropdown->setCellValue("E{$bRow}", $b->name);
                        $bRow++;
                    }
                }
                $branchEnd = max(1, $bRow - 1); // ensure >=1

                // DEPARTMENTS: B = id, F = name (grouped by branch)
                $deptRow = 1;
                if ($departments->isEmpty()) {
                    $dropdown->setCellValue('B1', '0');
                    $dropdown->setCellValue('F1', 'N/A');
                    $deptRow = 2;
                } else {
                    foreach ($branches as $b) {
                        $deptStart = $deptRow;
                        // departments->where('branch_id', $b->id) will be empty for branches w/o departments
                        foreach ($departments->where('branch_id', $b->id) as $d) {
                            $dropdown->setCellValue("B{$deptRow}", $d->id);
                            $dropdown->setCellValue("F{$deptRow}", $d->name);
                            $deptRow++;
                        }
                        $deptEnd = $deptRow - 1;
                        if ($deptEnd >= $deptStart) {
                            $branchKey = 'B_' . $b->id;
                            $spreadsheet->addNamedRange(new NamedRange(
                                $branchKey . '_DEPT',
                                $dropdown,
                                'B' . $deptStart . ':B' . $deptEnd
                            ));
                            $spreadsheet->addNamedRange(new NamedRange(
                                $branchKey . '_DEPT_NAMES',
                                $dropdown,
                                'F' . $deptStart . ':F' . $deptEnd
                            ));
                        }
                    }
                }
                $deptMax = max(1, $deptRow - 1);

                // DESIGNATIONS: C = id, G = name (grouped by department)
                $desigRow = 1;
                if ($designations->isEmpty()) {
                    $dropdown->setCellValue('C1', '0');
                    $dropdown->setCellValue('G1', 'N/A');
                    $desigRow = 2;
                } else {
                    foreach ($departments as $d) {
                        $desigStart = $desigRow;
                        foreach ($designations->where('department_id', $d->id) as $ds) {
                            $dropdown->setCellValue("C{$desigRow}", $ds->id);
                            $dropdown->setCellValue("G{$desigRow}", $ds->name);
                            $desigRow++;
                        }
                        $desigEnd = $desigRow - 1;
                        if ($desigEnd >= $desigStart) {
                            $deptKey = 'D_' . $d->id;
                            $spreadsheet->addNamedRange(new NamedRange(
                                $deptKey . '_DESG',
                                $dropdown,
                                'C' . $desigStart . ':C' . $desigEnd
                            ));
                            $spreadsheet->addNamedRange(new NamedRange(
                                $deptKey . '_DESG_NAMES',
                                $dropdown,
                                'G' . $desigStart . ':G' . $desigEnd
                            ));
                        }
                    }
                }
                $desigMax = max(1, $desigRow - 1);

                // SHIFTS: D = name
                $shiftRow = 1;
                if (empty($shifts)) {
                    $dropdown->setCellValue('D1', 'N/A');
                    $shiftRow = 2;
                } else {
                    foreach ($shifts as $sName) {
                        $dropdown->setCellValue("D{$shiftRow}", $sName);
                        $shiftRow++;
                    }
                }
                $shiftEnd = max(1, $shiftRow - 1);

                // Hide helper sheet (Very Hidden)
                $dropdown->setSheetState(Worksheet::SHEETSTATE_VERYHIDDEN);

                // --- Apply data validation on main sheet ---
                // NOTE: your headings map branch->E, dept->F, desg->G, shift->H (per previous code)
                // Branch dropdown (E2)
                $branchValidation = $sheet->getCell('E2')->getDataValidation();
                $branchValidation->setType(\PhpOffice\PhpSpreadsheet\Cell\DataValidation::TYPE_LIST);
                // use quoted sheet name and safe range
                $branchValidation->setFormula1("'Dropdown'!\$E\$1:\$E\$" . $branchEnd);
                $branchValidation->setAllowBlank(true);
                $branchValidation->setShowDropDown(true);

                // Department dropdown (F2) - depends on branch chosen in E2
                $deptValidation = $sheet->getCell('F2')->getDataValidation();
                $deptValidation->setType(\PhpOffice\PhpSpreadsheet\Cell\DataValidation::TYPE_LIST);
                // safe INDIRECt with properly quoted sheet name and correct end row ($branchEnd)
                $deptValidation->setFormula1(
                    '=IF(E2="","",INDIRECT("B_" & INDEX(\'Dropdown\'!$A$1:$A$' . $branchEnd .
                    ',MATCH(E2,\'Dropdown\'!$E$1:$E$' . $branchEnd . ',0)) & "_DEPT_NAMES"))'
                );
                $deptValidation->setAllowBlank(true);
                $deptValidation->setShowDropDown(true);

                // Designation dropdown (G2) - depends on department chosen in F2
                $desigValidation = $sheet->getCell('G2')->getDataValidation();
                $desigValidation->setType(\PhpOffice\PhpSpreadsheet\Cell\DataValidation::TYPE_LIST);
                $desigValidation->setFormula1(
                    '=IF(F2="","",INDIRECT("D_" & INDEX(\'Dropdown\'!$B$1:$B$' . $deptMax .
                    ',MATCH(F2,\'Dropdown\'!$F$1:$F$' . $deptMax . ',0)) & "_DESG_NAMES"))'
                );
                $desigValidation->setAllowBlank(true);
                $desigValidation->setShowDropDown(true);

                // Shift dropdown (H2)
                $shiftValidation = $sheet->getCell('H2')->getDataValidation();
                $shiftValidation->setType(\PhpOffice\PhpSpreadsheet\Cell\DataValidation::TYPE_LIST);
                $shiftValidation->setFormula1("'Dropdown'!\$D\$1:\$D\$" . $shiftEnd);
                $shiftValidation->setAllowBlank(true);
                $shiftValidation->setShowDropDown(true);
            }
        ];
    }
}
