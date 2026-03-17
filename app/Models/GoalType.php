<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;
use OwenIt\Auditing\Auditable;

class GoalType extends BaseModel implements AuditableContract
{
    use HasFactory;
    use Auditable;

    protected $fillable = [
        'created_by',
        'name',
        'description',
        'status'
    ];

    /**
     * Get the company that owns this goal type.
     */
    public function company()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the employee goals for this goal type.
     */
    public function goals()
    {
        return $this->hasMany(EmployeeGoal::class, 'goal_type_id');
    }
}