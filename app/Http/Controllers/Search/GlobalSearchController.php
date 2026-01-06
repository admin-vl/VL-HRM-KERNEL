<?php

namespace App\Http\Controllers\Search;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\Department;
use App\Models\Designation;
use App\Models\User;
use Illuminate\Http\Request;
use App\Models\Employee;
use App\Models\EmployeeSalary;
use App\Models\EmployeeTraining;
use App\Models\EmployeeContract;

class GlobalSearchController extends Controller
{
    public function search(Request $request)
    {
        $q = $request->get('q');

        if (!$q || strlen($q) < 2) {
            return response()->json([]);
        }

        $results = [];
     /* =====================
         * 🔹 COMPANY SEARCH
         * ===================== */
        $companies = User::where('type', 'company')->where('name', 'like', "%{$q}%")
            ->limit(5)
            ->get();

        foreach ($companies as $company) {
            $results[] = [
                'type' => 'Company',
                'label' => $company->name,
                'sub' => $company->email,
                'url' => route('companies.index'),
            ];
        }
        /* =====================
         * 🔹 Users SEARCH
         * ===================== */
        $loggedInUser = auth()->user();

        $users = User::whereNotIn('type', ['superadmin', 'company', 'employee'])
            ->where('created_by', $loggedInUser->id)
            // ->where('panel', $loggedInUser->panel) // optional if panel column exists
            ->where('name', 'like', "%{$q}%")
            ->limit(5)
            ->get();


        foreach ($users as $user) {
            $results[] = [
                'type' => $user->type,
                'label' => $user->name,
                'sub' => $user->email,
                'url' => route('users.index'),
            ];
        }

        /* =====================
         * 🔹 BRANCH / LOCATION
         * ===================== */
        $branches = Branch::with('company')
            ->where('name', 'like', "%{$q}%")
            ->limit(5)
            ->get();

        foreach ($branches as $branch) {
            $results[] = [
                'type' => 'Location',
                'label' => $branch->name,
                'sub' => $branch->city . ', ' . $branch->state,
                'url' => route('hr.branches.index'),
            ];
        }

        /* =====================
         * 🔹 DEPARTMENT
         * ===================== */
        $departments = Department::with('branch')
            ->where('name', 'like', "%{$q}%")
            ->limit(5)
            ->get();

        foreach ($departments as $department) {
            $results[] = [
                'type' => 'Department',
                'label' => $department->name,
                'sub' => optional($department->branch)->name,
                'url' => route('hr.departments.index'),
            ];
        }

        /* =====================
         * 🔹 DESIGNATION
         * ===================== */
        $designations = Designation::with('department')
            ->where('name', 'like', "%{$q}%")
            ->limit(5)
            ->get();

        foreach ($designations as $designation) {
            $results[] = [
                'type' => 'Designation',
                'label' => $designation->name,
                'sub' => optional($designation->department)->name,
                'url' => route('hr.designations.index'),
            ];
        }
        
        // 🔹 Employees
        $employees = Employee::with('user')
            ->whereHas('user', function ($query) use ($q) {
                $query->where('name', 'like', "%{$q}%")
                    ->orWhere('email', 'like', "%{$q}%");
            })
            ->orWhere('employee_id', 'like', "%{$q}%")
            ->orWhere('phone', 'like', "%{$q}%")
            ->limit(5)
            ->get();

        foreach ($employees as $employee) {
            $results[] = [
                'type' => 'Employee',
                'label' => $employee->user->name . ' (' . $employee->employee_id . ')',
                'url' => route('hr.employees.show', $employee->id),
            ];
        }
        

        return response()->json($results);
    }
}
