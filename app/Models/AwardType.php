<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;
use OwenIt\Auditing\Auditable;

class AwardType extends BaseModel implements AuditableContract
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
     * Get the awards for this award type.
     */
    public function awards()
    {
        return $this->hasMany(Award::class);
    }

    /**
     * Get the user who created this award type.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}