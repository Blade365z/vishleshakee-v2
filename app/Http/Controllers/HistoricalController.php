<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class HistoricalController extends Controller
{
    public function getFrequencyDataForHistorical(Request $request)
    {
            if ($request->input('to') && $request->input('from') && $request->input('query') && $request->input('rangeType')) {
            $rangeType = $request->input('rangeType');
            $query = $request->input('query');
            $from = $request->input('from');
            $to = $request->input('to');
            $rangeType = $request->input('rangeType');
            if ($request->input('isDateTimeAlready') == 0) {
                $fromTime = date('Y-m-d H:i:s', strtotime($from) + 0);
                $toTime = date('Y-m-d H:i:s', strtotime($to) + 0);
            } else {
                $fromTime = $from;
                $toTime = $to;
            }

            //A little extra processing for 10seconds plot.
            if ($rangeType == '10sec') {
                $fromTime = date('Y-m-d H:i:s', strtotime($fromTime) - 3600);
                $toTime = date('Y-m-d H:i:s', strtotime($toTime) + 0);
            }

            $commonObj = new CommonController;
            $data = $commonObj->get_frequency_distribution_data($toTime, $fromTime, $query, $rangeType, true, true);
            return $data;

        } else {
            return response()->json(['error' => 'Please check yout arguments'], 404);
        }
    }


    public function getSentimentDataForHistorical(Request $request)
    {
        if ($request->input('to') && $request->input('from') && $request->input('query') && $request->input('rangeType')) {
            $rangeType = $request->input('rangeType');
            $query = $request->input('query');
            $from = $request->input('from');
            $to = $request->input('to');
            $rangeType = $request->input('rangeType');
            if ($request->input('isDateTimeAlready') == 0) {
                $fromTime = date('Y-m-d H:i:s', strtotime($from) + 0);
                $toTime = date('Y-m-d H:i:s', strtotime($to) + 0);
            } else {
                $fromTime = $from;
                $toTime = $to;
            }

            //A little extra processing for 10seconds plot.
            if ($rangeType == '10sec') {
                $fromTime = date('Y-m-d H:i:s', strtotime($fromTime) - 3600);
                $toTime = date('Y-m-d H:i:s', strtotime($toTime) + 0);
            }

            $commonObj = new CommonController;
            $data = $commonObj->get_sentiment_distribution_data($toTime, $fromTime, $query, $rangeType);
            return $data;

        } else {
            return response()->json(['error' => 'Please check yout arguments'], 404);
        }
    }


    public function getCooccurDataForHA(Request $request)
    {
        if ($request->input('uniqueID') && $request->input('userID')  && $request->input('option')) {
            $uniqueID = $request->input('uniqueID');
            $userID = $request->input('userID');
            $option = $request->input('option');
            $file_path = $userID . '/' . $uniqueID . '.csv';
        } else {
            return response()->json(['error' => 'Unique ID / User ID not provided'], 404);
        }

        if ($request->input('mode')=='write') {
            if ($request->input('to') && $request->input('from') && $request->input('query')) {
                $query = $request->input('query');
                $from = $request->input('from');
                $to = $request->input('to');
                $fromTime = date('Y-m-d H:i:s', strtotime($from) + 0);
                $toTime = date('Y-m-d H:i:s', strtotime($to) + 0);
                //To Debug using the line below :: To check if all the arguments in the body are being parsed or not.
                // return response()->json(['fromDate' => $fromTime,'toDate'=>$toTime,'query'=>$query,'option'=>$option,'uniqueID'=>$uniqueID,'userID'=>$userID ,'filePath'=> $path ], 200);

                $commonObj = new CommonController;
                $data = $commonObj->get_co_occur_data($toTime, $fromTime, $query, null, $option, $file_path, true, false, $userID);
                return $data;
            } else {
                return response()->json(['error' => 'Please check yout arguments'], 404);
            }
        }else if($request->input('mode')=='read'){
            $commonObj = new CommonController;
            $limit=$request->input('limit');
            $data = $commonObj->data_formatter_for_co_occur(null, $option, $limit,$uniqueID,$file_path,$userID);
            return $data;
        }

    }

    
    public function  temp(){
        echo 'lol';
    }





    // all these just for testing.........................................................

    public function getFrequencyDataForHA(){
        $common_object = new CommonController;
        $adv_object = new HistoricalAdvanceController;
        $token = null;
        $token = $_GET['query'];
        $from_datetime = $_GET['from_datetime'];
        $to_datetime = $_GET['to_datetime'];
        $range_type = $_GET['range_type'];
        $search_type = $_GET['search_type'];
        $filename = $_GET['filename'];
        if($search_type == 'normal')
            return $common_object->get_frequency_distribution_data($to_datetime, $from_datetime, $token, $range_type, $category_info_total = false, $category_info_details = true);
        else    
            return $adv_object->get_freq_from_file($to_datetime, $from_datetime, $token, $range_type, $category_info_total = false, $category_info_details = true, $filename);
    }



    public function getSentimentDataForHA(){
        $common_object = new CommonController;
        $token = null;
        $token = $_GET['query'];
        $from_datetime = $_GET['from_datetime'];
        $to_datetime = $_GET['to_datetime'];
        $range_type = $_GET['range_type'];
        return $common_object->get_sentiment_distribution_data($to_datetime, $from_datetime, $token, $range_type);
    }


    public function get_Co_occur_Data_For_HA(){
        $common_object = new CommonController;
        $token = null;
        $token = $_GET['query'];
        $from_datetime = $_GET['from_datetime'];
        $to_datetime = $_GET['to_datetime'];
        // $range_type = $_GET['range_type'];
        return $common_object->get_co_occur_data($to_datetime, $from_datetime, $token, $range_type = null, $co_occur_option = 'hashtag', $file_path = null, $need_to_store = false, $data_formatter = false, $userID=null);
    }


    public function get_tweets_ha()
    {
        $common_object = new CommonController;
        $token = null;
        if (isset($_GET['query'])) {
            $token = $_GET['query'];
        }
        $from_datetime = $_GET['from_datetime'];
        $to_datetime = $_GET['to_datetime'];
        $range_type = $_GET['range_type'];
        $filter_type = $_GET['filter_type'];
        return $common_object->get_tweets($to_datetime, $from_datetime, $token, $range_type, $filter_type);
    }



    public function get_top_data_lat_lng_ha(){
        $commonObj = new CommonController;
        $token = null;
        if (isset($_GET['query'])) {
            $token = $_GET['query'];
        }
        $from_datetime = $_GET['from_datetime'];
        $to_datetime = $_GET['to_datetime'];
        // $range_type = $_GET['range_type'];
        $limit = $_GET['limit'];
        $top_option = $_GET['top_option'];
        return $commonObj->get_top_data_lat_lng($to_datetime, $from_datetime, $top_option, $token, '10sec');
    }


    public function get_top_data_cat_location_ha(){
        $commonObj = new CommonController;
        $token = null;
        if (isset($_GET['query'])) {
            $token = $_GET['query'];
        }
        $from_datetime = $_GET['from_datetime'];
        $to_datetime = $_GET['to_datetime'];
        // $range_type = $_GET['range_type'];
        $limit = $_GET['limit'];
        $top_option = $_GET['top_option'];
        return $commonObj->get_top_data_cat_by_location($to_datetime, $from_datetime, $top_option, $token, '10sec');
    }
}
