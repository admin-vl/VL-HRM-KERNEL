<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;
use OwenIt\Auditing\Auditable;

class Branch extends BaseModel implements AuditableContract
{
    use HasFactory;
    use Auditable;

    protected $fillable = [
        'name',
        'address',
        'city',
        'state',
        'country',
        'zip_code',
        'professional_tax_rates',
        'welfare_status',
        'welfare_type',
        'welfare_fund',
        'phone',
        'email',
        'status',
        'created_by',
    ];

    protected $casts = [
        'status' => 'string',
    ];

    public function company()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function departments()
    {
        return $this->hasMany(Department::class);
    }
}