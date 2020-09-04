<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\DBModel\DBmodel;
use App\DBModel\DBmodelAsync;
use App\Http\Controllers\Home as Hm;



class LocationMap extends Controller
{

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
        echo json_encode($final_result);

    }
}