<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeSalaryComponent extends Model
{
    protected $fillable = [
        'employee_salary_id',
        'salary_components_id',
        'amount',
        'type'
    ];
}
