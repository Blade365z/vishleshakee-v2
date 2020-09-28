<?php

namespace App\Http\Controllers;

use App\DBModel\DBmodel;
use App\DBModel\DBmodelAsync;
use App\Http\Controllers\CommonController;
use App\Http\Controllers\Home as Hm;
use Illuminate\Http\Request;
use App\CityState;

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

        $result_async_from_db = $db_object->executeAsync_query($input_args, $prepared_statement, 'raw');
        foreach ($result_async_from_db as $rows) {
            foreach ($rows as $row) {
                $temp_arr = array("t_location" => $row["t_location"], "Latitude" => $row["tl_latitude"], "Longitude" => $row["tl_longitude"], "t" => $row["tid"], "author" => $row["author"], "author_id" => $row["author_id"], "author_profile_image" => $row["author_profile_image"], "author_screen_name" => $row["author_screen_name"], "sentiment" => $row["sentiment"], "quoted_source_id" => $row["quoted_source_id"], "tweet" => $row["tweet_text"], "retweet_source_id" => $row["retweet_source_id"], "media_list" => $row["media_list"], "type" => $row["type"]);
                array_push($final_result, $temp_arr);
            }
        }
        return json_encode($final_result);

    }

    public function get_current_date_time()
    {
        $interval = $_GET['interval'];
        $datetime_object = new Hm;
        $current_datetime_to_datetime = $datetime_object->CurrentDateTimeGeneratorPublic($interval);

        return $current_datetime_to_datetime;
    }

    public function get_tweet_id_list(Request $request)
    {

        $query = $request->input('query');
        $from_datetime = $request->input('from');
        $to_datetime = $request->input('to');
        $option = $request->input('option');

        $commonObj = new CommonController;

        $r = $commonObj->get_tweets('2020-09-12 23:30:00', '2020-09-12 23:00:00', $query, '10sec', 'all');

        $tweetid_list_array = array();

        foreach ($r['data'] as $tid) {
            array_push($tweetid_list_array, $tid);
        }

        if ($option == "tweet_id") {
            return $tweetid_list_array;
        } else if ($option == "tweet_info") {
            return $this->tweet_info($tweetid_list_array);
        }
    }

    public function get_top_hashtags(Request $request)
    {
        $commonObj = new CommonController;
        $query = $request->input('query');
        $from_datetime = $request->input('from');
        $to_datetime = $request->input('to');
        $type = $request->input('type');
        // $all_location = $this->get_location_statement($query);
        $r = $commonObj->get_top_data_cat_by_location('2020-09-12 23:30:00', '2020-09-12 23:00:00', 'top_latlng_hashtag', $query, '10sec');
        return $r;

    }

    public function get_hashtags(Request $request)
    {

        $commonObj = new CommonController;
        $query = $request->input('query');
        $from_datetime = $request->input('from');
        $to_datetime = $request->input('to');
        $type = $request->input('type');
        // $all_location = $this->get_location_statement($query);
        $r = $commonObj->get_top_data_lat_lng('2020-09-12 23:30:00', '2020-09-12 23:00:00', 'top_latlng_hashtag', $query, '10sec');

        return json_encode($r);

    }

    // This function is used for
    // public page to plot on the map
    // param: query as hashtag, intervals
    //        as time
    // output: echo the results in json format

    public function location_tweet(Request $request)
    {

        if ($request->input('to') && $request->input('from') && $request->input('query')) {
            $rangeType = $request->input('rangeType');
            $query = $request->input('query');
            $from = $request->input('from');
            $to = $request->input('to');
            if ($request->input('isDateTimeAlready') == 0) {
                $fromTime = date('Y-m-d H:i:s', strtotime($from) + 0);
                $toTime = date('Y-m-d H:i:s', strtotime($to) + 0);
            } else {
                $fromTime = $from;
                $toTime = $to;
            }
            if ($request->input('filter') != 'all') {
                $filter = $request->input('filter');
            } else {
                $filter = null;
            }
            //A little extra processing for 10seconds plot.
            if ($rangeType == '10sec') {
                $fromTime = date('Y-m-d H:i:s', strtotime($fromTime) - 3600);
                $toTime = date('Y-m-d H:i:s', strtotime($toTime) + 0);
            }
            $arrTemp = ["range_type" => $rangeType, "fromTime" => $fromTime, "toTime" => $toTime, "query" => $query, "filter" => $filter];
            $commonObj = new CommonController;
            $data = $commonObj->get_tweets($toTime, $fromTime, $query, $rangeType, $filter);
            
         
            $tweetid_list_array = array();
            // array_push($tweetid_list_array,'1300689867836395526');
            // array_push($tweetid_list_array,'1305520073982054404');
            
            foreach ($data['data'] as $tid) {
                array_push($tweetid_list_array, $tid);
            }

            $tweetid_list_array = array_unique($tweetid_list_array);

            return $this->tweet_info($tweetid_list_array);
    }

    }

    public function location_tweet_home($intervalArg = null, $queryArg = null, Request $request)
    {
        if (!$request->input('fromTime') || !$request->input('toTime')) {
            if ($request->input('interval') && $request->input('query')) {
                $interval = $request->input('interval');
                if ($interval > 86400) {
                    return response()->json(['error' => 'Not Allowed'], 404);
                }
                $query = $request->input('query');
            } else if ($intervalArg && $queryArg) {
                $interval = $intervalArg;
                $query = $queryArg;

            } else {
                return response()->json(['error' => 'interval  or query not set'], 404);
            }

            $datetime_object = new Hm;
            $dateTimeArgs = $datetime_object->CurrentDateTimeGeneratorPublic($interval);
            $fromTime = $dateTimeArgs[0];
            $toTime = $dateTimeArgs[1];
        } else {
            $fromTime = $request->input('fromTime');
            $toTime = $request->input('toTime');
            $query = $request->input('query');
        }
        if ($request->input('filter')) {
            $filter = $request->input('filter');
        } else {
            $filter = null;
        }
        $commonObj = new CommonController;
        $data = $commonObj->get_tweets($toTime, $fromTime, $query, '10sec', $filter);
        // return $data;
        $tweetid_list_array = array();
        array_push($tweetid_list_array,'1300689867836395526');
        array_push($tweetid_list_array,'1305520073982054404');
        
        foreach ($data['data'] as $tid) {
            array_push($tweetid_list_array, $tid);
        }

        $tweetid_list_array = array_unique($tweetid_list_array);

        return $this->tweet_info($tweetid_list_array);
    }

    public function checkLocation_(Request $request)
    {
        $place = $request->input('place');
        $trigger = new DBmodel;
        $statement = "SELECT code from location_code WHERE location ='" . $place . "'";
        $result_code = $trigger->execute_query($statement, null, null);
        foreach ($result_code as $c) {
            $code = $c['code'];
        }
        return json_encode($code);

    }

    public function get_location_statement($location)
    {
        $state = ' ';
        $city = ' ';
        $country = ' ';

        $trigger = new DBmodel;
        $statement = "SELECT code from location_code WHERE location ='" . $location . "'";
        $result_code = $trigger->execute_query($statement, null, null);
        foreach ($result_code as $c) {
            $code = $c['code'];
        }

        if ($code == 0) {$locationType = "city";}
        elseif ($code == 1) {$locationType = "state";}
        elseif ($code == 2) {$locationType = "country";}

        $locationObj = CityState::where($locationType, $location)->firstOrFail();
        // return $locationObj["state"];

        $city_state_country_stm = '';
        if ($code == 0) {$city_state_country_stm = "country='^" . $locationObj["country"] . "' AND state='^" . $locationObj["state"] . "' AND city='^" . $locationObj["city"] . "'";}
        elseif ($code == 1) {$city_state_country_stm = "country='^" . $locationObj["country"] . "' AND state='^" . $locationObj["state"] . "'";}
        elseif ($code == 2) {$city_state_country_stm = "country='^" .$locationObj["country"] . "'";}
        // if (($city == ' ') && ($state == ' ') && ($country == ' ')) {
            // echo nothing
        // } else if (($city != ' ') && ($state != ' ') && ($country != ' ')) {
        //     $city_state_country_stm = "country='" . $country . "' AND state='" . $state . "' AND city='" . $city . "'";
        // } else if (($city == ' ') && ($state != ' ') && ($country != ' ')) {
        //     $city_state_country_stm = "country='" . $country . "' AND state='" . $state . "'";
        // } else if (($city == ' ') && ($state == ' ') && ($country != ' ')) {
        //     $city_state_country_stm = "country='" . $country . "'";
        // }

        return $city_state_country_stm;
    }

    public function showData(Request $request)
    {

    }
}


   