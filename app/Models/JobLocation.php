<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;
use OwenIt\Auditing\Auditable;

class JobLocation extends BaseModel implements AuditableContract
{
    use HasFactory;
    use Auditable;

    protected $fillable = [
        'name',
        'address',
        'city',
        'state',
        'country',
        'postal_code',
        'is_remote',
        'status',
        'created_by'
    ];

    protected $casts = [
        'is_remote' => 'boolean',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function jobPostings()
    {
        return $this->hasMany(JobPosting::class, 'location_id');
    }
}