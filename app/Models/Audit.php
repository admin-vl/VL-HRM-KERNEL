<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Audit extends BaseModel
{
    use HasFactory;

    protected $appends = ['auditable_type_label'];

    public function getAuditableTypeLabelAttribute()
    {
        return Str::headline(class_basename($this->auditable_type));
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
