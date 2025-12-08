<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyInfo extends Model
{
     protected $table = 'company_info'; // <- force singular table name
    protected $fillable = [
        'user_id', 'company_name','address','email', 'tel', 'pan', 'tan', 'pf_code', 'esi_code',
        'ptax_no', 'statutory_rates', 'company_logo', 'sign_name',
        'sign_designation', 'sign_father_name', 'sign_address',
        'sign_pan', 'sign_adhar', 'sign_dob', 'sign_email',
        'sign_mobile', 'employee_code'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

