<?php

namespace App\Models;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;
use OwenIt\Auditing\Auditable;

use Illuminate\Database\Eloquent\Model;

class Location extends Model implements AuditableContract
{
    use Auditable;
    //
}
