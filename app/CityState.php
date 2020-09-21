<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CityState extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'city',
        'state',
        'country'
    ];
}
