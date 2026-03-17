<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;
use OwenIt\Auditing\Auditable;

class DashboardWidget extends Model implements AuditableContract
{
    use Auditable;
    
    protected $fillable = [
        'user_id',
        'title',
        'query_key',
        'icon',
        'color',
        'order',
        'is_active',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
