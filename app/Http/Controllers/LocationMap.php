<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\DBModel\DBmodel;
use App\DBModel\DBmodelAsync;
use App\Http\Controllers\Home as Hm;

use App\Http\Controllers\CommonController;

use App\Library\Utilities as Ut;



class LocationMap extends Controller
{

    // This will provide tweet information
    // given tweet id.
    // param: tweet_id list
    // output: tweet information

    public function tweet_info($tweetid_list_array)
    {
        $input_args = array();
        foreach ($tweetid_list_array as $value) {
            array_push($input_args, array($value));
        }
        $final_result = array();
        $prepared_statement = "SELECT t_location,datetime,tid,author,tl_longitude,tl_latitude ,author_id,author_profile_image,author_screen_name,sentiment,quoted_source_id,tweet_text,retweet_source_id,media_list,type from tweet_info_by_id_test WHERE tid=?";
        $db_object = new DBmodelAsync;

        $result_async_from_db = $db_object->executeAsync_query($input_args, $prepared_statement,'raw');
        foreach ($result_async_from_db as $rows) {
            foreach ($rows as $row) {
                $temp_arr = array("t_location" => $row["t_location"], "Latitude" => $row["tl_latitude"], "Longitude" => $row["tl_longitude"], "t" => $row["tid"], "author" => $row["author"], "author_id" => $row["author_id"], "author_profile_image" => $row["author_profile_image"], "author_screen_name" => $row["author_screen_name"], "sentiment" => $row["sentiment"], "quoted_source_id" => $row["quoted_source_id"], "tweet" => $row["tweet_text"], "retweet_source_id" => $row["retweet_source_id"], "media_list" => $row["media_list"], "type" =>  $row["type"]);
                array_push($final_result, $temp_arr);
            }
        }
        return json_encode($final_result);

    }

    public function get_current_date_time(){
        $interval = $_GET['interval'];
        $datetime_object = new Hm;
        $current_datetime_to_datetime = $datetime_object->CurrentDateTimeGeneratorPublic(3600);
        
        return $current_datetime_to_datetime;
    }

    public function get_tweet_id_list(){

        $commonObj = new CommonController;
        
        
        $query = $_GET['query'];
        $from_datetime = $_GET['from'];
        $to_datetime = $_GET['to'];
        
        $r = $commonObj->get_tweets($to_datetime,$from_datetime,$query,'10sec','all');
        
        $tweetid_list_array = array();
        
            
        foreach ($r['data'] as $tid) {
            array_push($tweetid_list_array, $tid);
        }
            
        
        return $this->tweet_info($tweetid_list_array);
    }


    // This function is used for
    // public page to plot on the map
    // param: query as hashtag, intervals
    //        as time
    // output: echo the results in json format
    
    public function locationTweet(){
        
        $db_object = new DBmodelAsync;        
        $query = $_GET['query'];
        $interval = $_GET['interval'];
        $tweet_object = new Hm;
        $result = $tweet_object->getTweetIDData($interval,$query);
        
        $tweetid_list_array = array();
        foreach ($result as $rows) {
            
            foreach ($rows['data']['data'] as $tid) {
                array_push($tweetid_list_array, $tid);
            }
            
        }
        
        $tweetid_list_array = array_unique($tweetid_list_array);

        echo $this->tweet_info($tweetid_list_array);
        

        

    }

}