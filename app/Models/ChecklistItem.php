<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;
use OwenIt\Auditing\Auditable;

class ChecklistItem extends BaseModel implements AuditableContract
{
    use HasFactory;
    use Auditable;

    protected $fillable = [
        'checklist_id',
        'task_name',
        'description',
        'category',
        'assigned_to_role',
        'due_day',
        'is_required',
        'status',
        'created_by'
    ];

    protected $casts = [
        'is_required' => 'boolean',
    ];

    public function checklist()
    {
        return $this->belongsTo(OnboardingChecklist::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}