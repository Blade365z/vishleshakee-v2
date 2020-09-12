<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TrendAnalysisController extends Controller
{
    public function getTrending(Request $request){
        $request->validate([
            'from'=>'required',
            'to'=>'required',
            'option'=>'required',
            'limit'=>'required'
        ]);
        $from = $request->input('from');
        $to = $request->input('to');
        $option = $request->input('option');
        $fromTime = date('Y-m-d H:i:s', strtotime($from) + 0);
        $toTime = date('Y-m-d H:i:s', strtotime($to) + 0);
        $commonObj = new CommonController;
        $data=$commonObj->get_top_data($toTime, $fromTime,  $option, $limit = 50, null,null);
        return $data;  
    }
}
