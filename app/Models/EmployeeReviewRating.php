<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;
use OwenIt\Auditing\Auditable;

class EmployeeReviewRating extends Model implements AuditableContract
{
    use HasFactory;
    use Auditable;

    protected $fillable = [
        'employee_review_id',
        'performance_indicator_id',
        'rating',
        'comments'
    ];

    protected $casts = [
        'rating' => 'float',
    ];

    /**
     * Get the review that owns this rating.
     */
    public function review()
    {
        return $this->belongsTo(EmployeeReview::class, 'employee_review_id');
    }

    /**
     * Get the performance indicator for this rating.
     */
    public function indicator()
    {
        return $this->belongsTo(PerformanceIndicator::class, 'performance_indicator_id');
    }
}