<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;
use OwenIt\Auditing\Auditable;

class EmailTemplateLang extends Model implements AuditableContract
{
    use Auditable;

    protected $fillable = [
        'parent_id',
        'lang',
        'subject',
        'content',
    ];

    public function emailTemplate(): BelongsTo
    {
        return $this->belongsTo(EmailTemplate::class, 'parent_id');
    }
}
