<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;
use OwenIt\Auditing\Auditable;

class EmailTemplate extends Model implements AuditableContract
{
    use Auditable;
    
    protected $fillable = [
        'name',
        'from',
        'user_id',
    ];

    public function emailTemplateLangs(): HasMany
    {
        return $this->hasMany(EmailTemplateLang::class, 'parent_id');
    }

    public function userEmailTemplates(): HasMany
    {
        return $this->hasMany(UserEmailTemplate::class, 'template_id');
    }
}
