<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;
use OwenIt\Auditing\Auditable;

class Currency extends Model implements AuditableContract
{
    use Auditable;
    
    protected $fillable = [
        'name',
        'code',
        'symbol',
        'description',
        'is_default'
    ];

    protected $casts = [
        'is_default' => 'boolean'
    ];
}
