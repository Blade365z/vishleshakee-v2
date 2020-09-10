<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TweetFeedback extends Model
{
    protected $fillable = [
        'userID',
        'feedbackType',
        'tweetID',
        'originalTag',
        'feedbackTag'
    ];
}