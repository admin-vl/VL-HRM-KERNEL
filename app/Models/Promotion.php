<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;
use OwenIt\Auditing\Auditable;

class Promotion extends BaseModel implements AuditableContract
{
    use HasFactory;
    use Auditable;

    protected $fillable = [
        'employee_id',
        'previous_designation',
        'designation_id',
        'promotion_date',
        'effective_date',
        'salary_adjustment',
        'reason',
        'document',
        'status',
        'created_by'
    ];

    /**
     * Get the employee that received this promotion.
     */
    public function employee()
    {
        return $this->belongsTo(User::class, 'employee_id');
    }

    /**
     * Get the designation for this promotion.
     */
    public function designation()
    {
        return $this->belongsTo(Designation::class);
    }

    /**
     * Get the user who created this promotion.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}