<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\CommonController as CC;
use App\DBModel\DBmodel;
use App\DBModel\DBmodelAsync;
use App\Library\QueryBuilder;
use App\Library\Utilities;

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


    public function dummyFunctionForFreq(){
        $tempArr = array("range_type"=>"hour","chart_type"=>"freq_dist","data"=>[["2020-09-24 01:00:00","3"],["2020-09-24 02:00:00","13"],["2020-09-24 03:00:00","28"],["2020-09-24 04:00:00","21"],["2020-09-24 05:00:00","30"],["2020-09-24 06:00:00","28"],["2020-09-24 07:00:00","30"],["2020-09-24 08:00:00","36"],["2020-09-24 09:00:00","35"],["2020-09-24 10:00:00","30"],["2020-09-24 11:00:00","28"],["2020-09-24 12:00:00","28"],["2020-09-24 13:00:00","21"],["2020-09-24 14:00:00","5"]]);
        return $tempArr;
    }



    public function getFrequencyDistributionTweet(Request $request){
        $request->validate([
            'to' => 'required',
            'from' => 'required',
            'id' => 'required',
            'type' => 'required',
        ]);
        
        $to= $request->input('to');
        $from= $request->input('from');
        $source_tweet_id= $request->input('id');
        $distribution_type= $request->input('type');
        $from_datetime = date('Y-m-d H:i:s', strtotime($from) + 0);
        $to_datetime = date('Y-m-d H:i:s', strtotime($to) + 0);    
         $db_object = new DBmodelAsync;
        $qb_obj = new QueryBuilder;
        $ut_obj = new Utilities;
        $final_result = array();
        $temp_arr = array();

        $stm_list = $qb_obj->get_statement($to_datetime, $from_datetime, $source_tweet_id, $distribution_type, 'tweet_track');
        $result_async_from_db = $db_object->executeAsync_query($stm_list[1], $stm_list[0]);

        foreach ($result_async_from_db as $rows) {
            $total_count = 0;
            foreach ($rows as $row) {
                $t = $row['datetime'];
                $datetime1 = $ut_obj->get_date_time_from_cass_date_obj($t, "Y-m-d") . ' 00:00:00';
                $total_count+=1;
            }
            if($total_count > 0)
                array_push($temp_arr, array($datetime1, $total_count));
        }

        $final_result["chart_type"] = "freq_dist_tweet_tracking_of_type_$distribution_type";
        $final_result["data"] = $temp_arr;

        return json_encode($final_result);
    }



    public function get_tweet_idlist_for_track_type_sourceid($date, $source_tweet_id, $tweet_type_of_dist){
        $request->validate([
            'sid' =>'required',
            'to' => 'required',
            'tweet_id_list_type' => 'required'
        ]);
        
        $to= $request->input('to');
        $from= $request->input('sid');
        $tweet_id_list_type= $request->input('tweet_id_list_type');
        $to_datetime = date('Y-m-d H:i:s', strtotime($to) + 0);    
        $db_object = new DBmodelAsync;
        $qb_obj = new QueryBuilder;
        $ut_obj = new Utilities;
        $final_result = array();
        $temp_arr = array();

        $stm_list = $qb_obj->get_statement($to_datetime, $from_datetime, $source_tweet_id, $distribution_type, 'tweet_track');
        $result_async_from_db = $db_object->executeAsync_query($stm_list[1], $stm_list[0]);

        foreach ($result_async_from_db as $rows) {


        }
    }
}
