<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeInfo extends Model
{

    protected $fillable = [
        'user_id',
        'title',
        'father_or_husband',
        'mother_name',
        'contractor',
        'grade',
        'cost_center',
        'reporting_person',
        'physical_status',
        'pf_number',
        'pf_limit',
        'esi_number',
        'uan_number',
        'location_id',
        'esi_applicability',
        'tds_applicability',
        'date_of_leaving',
        'resignation_date',
        'settlement_date'
    ];
}
