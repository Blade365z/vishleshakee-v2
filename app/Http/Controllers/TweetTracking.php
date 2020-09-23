<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\CommonController as CC;


class TweetTracking extends Controller
{
    public function getTweetInfo(Request $request)
    {
        $request->validate([
            'id' => 'required'
        ]);
        $id= $request->input('id');
        $commonObj = new CommonController;
        $data = $commonObj->get_tweets_info($id,false);
        return $data;
    }
}
