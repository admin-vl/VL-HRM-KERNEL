<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;
use OwenIt\Auditing\Auditable;

class ReviewCycle extends BaseModel implements AuditableContract
{
    use HasFactory;
    use Auditable;

    protected $fillable = [
        'created_by',
        'name',
        'frequency',
        'description',
        'status'
    ];

    /**
     * Get the company that owns this review cycle.
     */
    public function company()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the employee reviews for this review cycle.
     */
    public function reviews()
    {
        return $this->hasMany(EmployeeReview::class, 'review_cycle_id');
    }
}