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

    public function employee()
    {
        return $this->belongsTo(User::class, 'employee_id');
    }



    /**
     * Get the user who created the salary.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function salary_component()
    {
        return $this->belongsTo(SalaryComponent::class, 'salary_component_id');
    }
}
