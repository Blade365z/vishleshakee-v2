<?php

namespace App\Http\Controllers;

use App\DBModel\DBmodel;
use App\Http\Controllers\CommonController as CC;
use Illuminate\Http\Request;

class UserAnalysisController extends Controller
{

    public function first_list(Request $request)
    {

        $user_name = $request->input('token');
        $user_name = strtolower($user_name);
        $verified = $request->input('verified');
        $clearFlag = $request->input('clearFlag');
        if ($clearFlag == 1) {
            $request->session()->forget('page_state_token');
        }
        $lucene = '{filter: [{type: "match", field: "verified", value: "' . $verified . '"}],  query: {type: "phrase", field: "author", value: "' . $user_name . '"}}';
        $statement = "select author_id,author_screen_name,author,profile_image_url_https,verified from user_record  WHERE expr(user_record_index1,'" . $lucene . "')";
        $trigger = new DBmodel;
        if ($request->session()->has('page_state_token')) {
            $options = array(
                'page_size' => 10,
                'paging_state_token' => $request->session()->get('page_state_token'),
            );
        } else {
            $options = array(
                'page_size' => 20,
            );
        }
        $result = $trigger->execute_query($statement, $options, 'raw');
        $request->session()->put('page_state_token', $result->pagingStateToken());
        $data = array();
        foreach ($result as $record) {
            $arr['author_id'] = $record['author_id'];
            $arr['author'] = $record['author'];
            $arr['profile_image_url_https'] = $record['profile_image_url_https'];
            $arr['verified'] = $record['verified'];
            $arr['author_screen_name'] = $record['author_screen_name'];
            array_push($data, $arr);
        }
        echo json_encode($data);
    }
    public function get_page_state_token(Request $request)
    {
        $page_state = $request->session()->get('page_state_token');
        return $page_state;
    }

    public function getSuggestedUsers()
    {
        if (isset($_GET['userIDArray'])) {
            $userIDsArr = $_GET['userIDArray'];
        } else {
            return response()->json(['error' => 'No Data Captured'], 404);
        }
        $common_object = new CC;
        echo $common_object->get_user_info($userIDsArr, true);
    }

    public function getUserDetails(Request $request)
    {
        if ($request->input('userID')) {
            $userID = $request->input('userID');
        } else {
            return response()->json(['error' => 'No Data Captured'], 404);
        }
        $common_object = new CC;
        return $common_object->get_user_info($userID, false);
    }
    public function getFrequencyDataForUser(Request $request)
    {
        if ($request->input('time')) {
            $time = $_GET['time'];
        } else if ($request->input('fromDate')) {
            $fromDate = $request->input('fromDate');
            $toDate = $request->input('toDate');
        } else {
            return response()->json(['error' => 'No Data Captured'], 404);
        }
        if ($request->input('query')) {
            $query = $request->input('query');
        } else {
            return response()->json(['error' => 'No Argument Set'], 404);
        }
        if ($request->input('rangeType')) {
            $rangeType = $request->input('rangeType');
        } else {
            return response()->json(['error' => 'Please add range type as argument'], 404);
        }

        if ($rangeType == 'days') {
            $arrTemp = ["range_type" => "days", "chart_type" => "freq_dist", "data" => [["2020-08-30 00:00:00", "236"], ["2020-08-31 00:00:00", "347"], ["2020-09-02 00:00:00", "347"], ["2020-09-03 00:00:00", "315"], ["2020-09-04 00:00:00", 146]]];
            return $arrTemp;
        } else if ($rangeType == 'hour') {
            $arrTemp = ["range_type" => "hour", "chart_type" => "freq_dist", "data" => [["2020-09-04 01:00:00", "1"], ["2020-09-04 02:00:00", "1"], ["2020-09-04 03:00:00", "12"], ["2020-09-04 04:00:00", "14"], ["2020-09-04 05:00:00", "21"], ["2020-09-04 06:00:00", "16"], ["2020-09-04 07:00:00", "18"], ["2020-09-04 08:00:00", "26"], ["2020-09-04 09:00:00", "26"], ["2020-09-04 10:00:00", "11"]]];
            return $arrTemp;
        } else {
            $arrTemp = ["range_type" => "10sec", "chart_type" => "freq_dist", "data" => [["2020-09-04 05:06:30", "1"], ["2020-09-04 05:09:30", "1"], ["2020-09-04 05:17:20", "1"], ["2020-09-04 05:17:30", "1"], ["2020-09-04 05:27:10", "1"], ["2020-09-04 05:28:00", "1"], ["2020-09-04 05:37:00", "1"], ["2020-09-04 05:40:20", "1"], ["2020-09-04 05:43:00", "1"], ["2020-09-04 05:45:20", "1"], ["2020-09-04 05:48:10", "1"], ["2020-09-04 05:49:40", "1"], ["2020-09-04 05:50:20", "1"], ["2020-09-04 05:52:50", "1"], ["2020-09-04 05:53:40", "1"], ["2020-09-04 05:58:00", "1"]]];
            return $arrTemp;
        }
    }

    public function getTweetIDUA(Request $request)
    {
        
        if ($request->input('to') && $request->input('from') && $request->input('query')) {
            $rangeType = $request->input('rangeType');
            $query = $request->input('query');
            $from = $request->input('from');
            $to = $request->input('to');
            if ($request->input('isDateTimeAlready')==0) {
                $fromTime=date('Y-m-d H:i:s', strtotime($from) + 0);
                $toTime=date('Y-m-d H:i:s', strtotime($to) + 0);
            } else {
                $fromTime = $from;
                $toTime = $to;
            }
            if ($request->input('filter')!='all') {
                $filter = $request->input('filter');
            } else {
                $filter = null;
            }
            $arrTemp = ["range_type" => $rangeType,"fromTime"=>$fromTime,"toTime"=>$toTime,"query"=>$query,"filter"=>$filter];
            $commonObj = new CommonController;
            $data = $commonObj->get_tweets($toTime, $fromTime, $query, $rangeType, $filter);
            return $data;
        } else {
            return response()->json(['error' => 'Please check yout arguments'], 404);
        }
       
    }

}
