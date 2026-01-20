<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;
use OwenIt\Auditing\Auditable;

class EmployeeSalaryComponent extends Model implements AuditableContract
{
    use Auditable;
    
    protected $fillable = [
        'employee_salary_id',
        'salary_components_id',
        'amount',
        'type'
    ];
}
