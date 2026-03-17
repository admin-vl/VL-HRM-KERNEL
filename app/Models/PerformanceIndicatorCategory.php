<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;
use OwenIt\Auditing\Auditable;

class PerformanceIndicatorCategory extends BaseModel implements AuditableContract
{
    use HasFactory;
    use Auditable;

    protected $fillable = [
        'name',
        'description',
        'status',
        'created_by'
    ];

    /**
     * Get the user who created this category.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the performance indicators for this category.
     */
    public function indicators()
    {
        return $this->hasMany(PerformanceIndicator::class, 'category_id');
    }
}