<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DashboardWidget extends Model
{
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
