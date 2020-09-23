<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class QueryStatus extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'queryID',
        'userID',
        'query',
        'fromDate',
        'toDate'
    ];
}
