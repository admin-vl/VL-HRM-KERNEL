<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MonthlySalarySettlement extends Model
{
    protected $fillable = [
        'employee_id',
        'year',
        'month',
        'amount',
        'salary_component_id',
        'notes',
        'status',
        'created_by'
    ];
}
