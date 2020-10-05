<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Library\Utilities;

class HistoricalAdvanceController extends Controller
{

    public function requestToSpark(Request $request)
    {
        $request->validate([
            'query_list' => 'required',
            'unique_name_timestamp' => 'required'
        ]);

        $query_list = $request->input('query_list');
        $rname = $request->input('unique_name_timestamp');
        $result = $this->curlData($query_list, $rname);
        $result = json_decode($result, true);

        // if($status=='success')
        // while (1) {
        //     $status = $this->curlData($id);
        //     $status = $this->getCurlStatus(210  );
        //     if ($status == 'success') {
        //         break;
        //     }
        // }

        echo json_encode(array('query_time' => $rname, 'status' => $result['state'], 'id' => $result['id']));
    }




    public  function  curlData($query_list, $rname)
    {
        $curl = curl_init();
        $data['conf'] = array('spark.jars.packages' => 'anguenot:pyspark-cassandra:2.4.0', 'spark.cassandra.connection.host' => '172.16.117.201', 'spark.cores.max' => 4);
        // $data['file'] = 'local:/home/admin/bbk/dataset_builder/spark/batch/advance_query.py';
        $data['file'] = 'local:/home/admin/bbk/rahul_test1/spark/batch/new_advance_query.py';
        $data['args'] = $query_list;
        $data['name'] = strval($rname) . 'a77';
        $data['executorCores'] = 4;
        $data['numExecutors'] = 3;
        $data['executorMemory'] = '6G';
        $data = json_encode($data);
        curl_setopt($curl, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json',
            'Connection: Keep-Alive'
        ));
        curl_setopt($curl, CURLOPT_URL, '172.16.117.202:8998/batches');
        curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_TIMEOUT, 0);
        $curl_result = curl_exec($curl);
        return $curl_result;
    }




    public function getStatusFromSpark(Request $request)
    {       
        //curl -X GET -H "Content-Type: application/json" 172.16.117.202:8998/batches/{80}

        $request->validate([
            'id' => 'required'
        ]);

        $id =  $request->input('id');
        $curl_result = curl_init();
        curl_setopt($curl_result, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json'
        ));
        $url = '172.16.117.202:8998/batches/' . $id;
        curl_setopt($curl_result, CURLOPT_URL, $url);
        curl_setopt($curl_result, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl_result, CURLOPT_TIMEOUT, 0);
        $curl_result = curl_exec($curl_result);
        // echo $curl_result;
        $result = json_decode($curl_result, true);
        return json_encode(array('status' => $result['state'], 'id' => $result['id']));
    }




    public function getOuputFromSparkAndStoreAsJSON(Request $request)
    {
        $ut_obj = new Utilities;
        //curl -X GET -H "Content-Type: application/json" 172.16.117.202:8998/batches/{80}
        $request->validate([
            'id' => 'required',
            'unique_name_timestamp' =>  'required',
            'userid' => 'required'
        ]);

        $id =  $request->input('id');
        $filename = $request->input('unique_name_timestamp');
        $userid =  $request->input('userid');

        $curl_result = curl_init();
        curl_setopt($curl_result, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json'
        ));
        $url = '172.16.117.202:8998/batches/' . $id;
        curl_setopt($curl_result, CURLOPT_URL, $url);
        curl_setopt($curl_result, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl_result, CURLOPT_TIMEOUT, 0);
        $curl_result = curl_exec($curl_result);
        $result = json_decode($curl_result, true);
        // return $curl_result['state'];

        $result = $result["log"][8]; //string type   
        $result = json_decode($result, true); //array type  
        $file_path =  "$userid/$filename.json";
        $ut_obj->write_to_file($file_type='json', $file_path, $result, $token=null, $userid);
        // $this->storeAsJson($request, $filename, $result);

        // return $result;
        return json_encode(array('status' => 'done', 'id' => $id));
    }




    public function getFrequencyDataForHistoricalAdvance(Request $request)
    {
        $request->validate([
            'query' => 'required',
            'to' =>  'required',
            'from' => 'required',
            'rangeType' => 'required',
            'filename' => 'required',
            'userid' => 'required',
        ]);

        $query =  $request->input('query');
        $to =  $request->input('to');
        $from =  $request->input('from');        
        $to_datetime = date('Y-m-d H:i:s', strtotime($to) + 0);
        $range_type =  $request->input('rangeType');
        $filename = $request->input('filename');
        $userid =  $request->input('userid');

        //A little extra processing for 10seconds plot.
        if ($range_type == '10sec') {
            $from_datetime = date('Y-m-d H:i:s', strtotime($from) - 3600);
        }else{
            $from_datetime = date('Y-m-d H:i:s', strtotime($from) + 0);
        }

        return $this->getFrequencyDataForHistoricalAdvance_main($query, $to_datetime,  $from_datetime, $range_type, $filename, $userid, $category_info_total = false, $category_info_details = true);
    }



    public function getSentimentDataForHistoricalAdvance(Request $request)
    {
        $request->validate([
            'query' => 'required',
            'to' =>  'required',
            'from' => 'required',
            'rangeType' => 'required',
            'filename' => 'required',
            'userid' => 'required',
        ]);

        $query =  $request->input('query');
        $to =  $request->input('to');
        $from =  $request->input('from');        
        $to_datetime = date('Y-m-d H:i:s', strtotime($to) + 0);
        $range_type =  $request->input('rangeType');
        $filename = $request->input('filename');
        $userid =  $request->input('userid');

        //A little extra processing for 10seconds plot.
        if ($range_type == '10sec') {
            $from_datetime = date('Y-m-d H:i:s', strtotime($from) - 3600);
        }else{
            $from_datetime = date('Y-m-d H:i:s', strtotime($from) + 0);
        }

        return $this->getSentimentDataForHistoricalAdvance_main($query, $to_datetime,  $from_datetime, $range_type, $filename, $userid, $category_info_total = false, $category_info_details = true);
    }




    public function getCooccurDataForAdvance(Request $request)
    {
        if ($request->input('uniqueID') && $request->input('userID')  && $request->input('option')) {
            $uniqueID = $request->input('uniqueID');
            $userID = $request->input('userID');
            $option = $request->input('option');
            $file_path_to_write_csv = $userID . '/' . $uniqueID . '.csv';
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
                $filename = $request->input('filename');
                //To Debug using the line below :: To check if all the arguments in the body are being parsed or not.
                // return response()->json(['fromDate' => $fromTime,'toDate'=>$toTime,'query'=>$query,'option'=>$option,'uniqueID'=>$uniqueID,'userID'=>$userID ,'filePath'=> $path ], 200);

                $data = $this->getCooccurDataForAdvance_main($toTime, $fromTime, $query, $option, $file_path_to_write_csv, true, $userID, $filename);
                return $data;
            } else {
                return response()->json(['error' => 'Please check yout arguments'], 404);
            }
        }else if($request->input('mode')=='read'){
            $commonObj = new CommonController;
            $limit=$request->input('limit');
            $data = $commonObj->data_formatter_for_co_occur(null, $option, $limit,$uniqueID,$file_path_to_write_csv,$userID);
            return $data;
        }
    }





    public function getTweetIDForAdvance(Request $request)
    {
        if ($request->input('to') && $request->input('from') && $request->input('query')) {
            $rangeType = $request->input('rangeType');
            $query = $request->input('query');
            $from = $request->input('from');
            $to = $request->input('to');
            $userid = $request->input('userID');
            $filename = $request->input('filename');
            // if ($request->input('isDateTimeAlready') == 0) {
            //     $fromTime = date('Y-m-d H:i:s', strtotime($from) + 0);
            //     $toTime = date('Y-m-d H:i:s', strtotime($to) + 0);
            // } else {
            //     $fromTime = $from;
            //     $toTime = $to;
            // }
            if ($request->input('filter') != 'all') {
                $filter = $request->input('filter');
            } else {
                $filter = null;
            }
            //A little extra processing for 10seconds plot.
            if ($rangeType == '10sec') {
                $fromTime = date('Y-m-d H:i:s', strtotime($from) - 3600);
            }else{
                $fromTime = date('Y-m-d H:i:s', strtotime($from) + 0);               
            }
            $toTime = date('Y-m-d H:i:s', strtotime($to) + 0);
            $arrTemp = ["range_type" => $rangeType, "fromTime" => $fromTime, "toTime" => $toTime, "query" => $query, "filter" => $filter];
            $data = $this->getTweetIDForAdvance_main($toTime, $fromTime, $query, $rangeType, $filter, $userid, $filename);
            return $data;
        } else {
            return response()->json(['error' => 'Please check yout arguments'], 404);
        }
    }



    public function getFrequencyDataForHistoricalAdvance_main($query, $to_datetime,  $from_datetime, $range_type, $filename, $userid, $category_info_total = false, $category_info_details = false)
    {
        $ut_obj = new Utilities;
        $final_result = array();
        $fromdate = ($ut_obj->separate_date_time($from_datetime))[0];
        $todate = ($ut_obj->separate_date_time($to_datetime))[0];
        $file_path = "$userid/$filename.json";
        $json_result_array = $ut_obj->read_file($file_type='json', $file_path);
        // echo json_encode($json_result_array);
        $temp_arr = array();
        $current_date = $ut_obj->get_current_date_time($option='datetime000');
        $total = 0;
        $total_com = 0;
        $total_sec = 0;
        $total_com_sec = 0;
        $total_non_com_sec = 0;      
        
       
        if ($range_type == "10sec") {            
            $re_for_given_date = $json_result_array[$fromdate];
            $date = $fromdate;
            $tenSec_arr = $ut_obj->get_10sec_list($to_datetime, $from_datetime);
            if ($re_for_given_date) {
                // if date is cuurent date
                if($date == $current_date){
                    // if($re_for_given_date[$startTime]){
                    //     $sec_arr = $re_for_given_date[$startTime]["second"];
                    //     foreach ($tenSec_arr as $k => $v) {
                    //         $datetime1 = $date . " " . $v;
                    //         $c = 0;
                    //         if (array_key_exists($v, $sec_arr)) {
                    //             $v = $sec_arr[$v];
                    //             foreach ($v as $k1 => $v1) {
                    //                 $c += sizeof($v1["tid"]);
                    //             }
                    //         }
                    //         array_push($temp_arr, array($datetime1, $c));
                    //     }
                    // }
                }else{
                    $sec_arr = $re_for_given_date["second"];
                    foreach ($tenSec_arr as $k => $v) {
                        $date = $v[0]; //date
                        $v = $v[1]; //take only time, $v = ["2020-09-11","18:00:00"]                        
                        $datetime1 = $date . " " . $v;
                        $count = 0;
                        $com = 0;
                        $sec = 0;
                        $com_sec = 0;
                        $non_com_sec = 0;
                        if (array_key_exists($v, $sec_arr)) {
                            $v = $sec_arr[$v];
                            foreach ($v as $k1 => $v1) {
                                if(($k1 == "11") or ($k1 == "12") or ($k1 == "13"))
                                    $com += sizeof($v1["tid"]);
                                else if(($k1 == "101") or ($k1 == "102") or ($k1 == "103"))
                                    $sec += sizeof($v1["tid"]);
                                else if(($k1 == "111") or ($k1 == "112") or ($k1 == "113"))
                                    $com_sec += sizeof($v1["tid"]);
                                else if(($k1 == "1") or ($k1 == "2") or ($k1 == "3"))
                                    $non_com_sec += sizeof($v1["tid"]);
                                $count += sizeof($v1["tid"]);
                                $total_com += $com;
                                $total_sec += $sec;
                                $total_com_sec += $com_sec;
                                $total_non_com_sec += $non_com_sec;
                            }
                        }
                        if ($category_info_details or $category_info_total) {
                            array_push($temp_arr, array($datetime1, $count, $com, $sec, $com_sec, $non_com_sec));
                        } else {
                            array_push($temp_arr, array($datetime1, $count));
                        }
                    }
                }
            }
        } else if ($range_type == "hour") {
            $re_for_given_date = $json_result_array[$fromdate];
            $date = $fromdate;
            if ($re_for_given_date) {
                // if date is cuurent date
                if($date == $current_date){
                    // $keys_arr = array_keys($re_for_given_date); 
                    // sort($keys_arr); //date key array getting from json file should be sorted;
                    // foreach ($keys_arr as $k_hr) {
                    //     $v_hr = $re_for_given_date[$k_hr];
                    //     if($v_hr){
                    //         $hr_arr = $v_hr["hours"];
                    //         foreach ($hr_arr as $k => $v) {
                    //             $datetime1 = $date . " " . $k_hr;
                    //             $c = 0;
                    //             if($k == $k_hr){
                    //                 foreach ($v as $k1 => $v1) {
                    //                     $c += $v1["tid_count"];
                    //                 }
                    //                 array_push($temp_arr, array($datetime1, $c));
                    //             }
                    //         }
                    //     }
                    // }
                }
                else{
                    $hr_arr = $re_for_given_date["hours"];
                    $hr_key_arr = array_keys($hr_arr); 
                    sort($hr_key_arr); //hour key array getting from json file should be sorted;
                    foreach ($hr_key_arr as $k) {
                        $v = $hr_arr[$k];
                        $datetime1 = $date . " " . $k;
                        $count = 0;
                        $com = 0;
                        $sec = 0;
                        $com_sec = 0;
                        $non_com_sec = 0;
                        foreach ($v as $k1 => $v1) {
                            if(($k1 == "11") or ($k1 == "12") or ($k1 == "13"))
                                $com += sizeof($v1["tid"]);
                            else if(($k1 == "101") or ($k1 == "102") or ($k1 == "103"))
                                $sec += sizeof($v1["tid"]);
                            else if(($k1 == "111") or ($k1 == "112") or ($k1 == "113"))
                                $com_sec += sizeof($v1["tid"]);
                            else if(($k1 == "1") or ($k1 == "2") or ($k1 == "3"))
                                $non_com_sec += sizeof($v1["tid"]);
                            $count += $v1["tid_count"];
                            $total_com += $com;
                            $total_sec += $sec;
                            $total_com_sec += $com_sec;
                            $total_non_com_sec += $non_com_sec;
                        }
                        if ($category_info_details or $category_info_total) {
                            array_push($temp_arr, array($datetime1, $count, $com, $sec, $com_sec, $non_com_sec));
                        } else {
                            array_push($temp_arr, array($datetime1, $count));
                        }
                    }
                }
            }
        } else if ($range_type == "day") {
            $keys_arr = array_keys($json_result_array); 
            sort($keys_arr); //date key array getting from json file should be sorted;
            foreach ($keys_arr as $key) {
                $count = 0;
                $com = 0;
                $sec = 0;
                $com_sec = 0;
                $non_com_sec = 0;
                $datetime1 = $key;
                $value = $json_result_array[$key];
                if ($value) {
                    // if date is cuurent date
                    if($key == $current_date){
                        // foreach ($value as $k => $v) {
                        //     if($v){
                        //         $sentiment_arr = $v["sentiment"];
                        //         foreach ($sentiment_arr as $k1 => $v1) {
                        //             $count += sizeof($v1["tid"]);
                        //         }
                        //     }
                        // }
                    }
                    else{
                        $category_arr = $value["category"];
                        foreach ($category_arr as $k => $v) {
                            if(($k == "11") or ($k == "12") or ($k == "13"))
                                $com += sizeof($v["tid"]);
                            else if(($k == "101") or ($k == "102") or ($k == "103"))
                                $sec += sizeof($v["tid"]);
                            else if(($k == "111") or ($k == "112") or ($k == "113"))
                                $com_sec += sizeof($v["tid"]);
                            else if(($k == "1") or ($k == "2") or ($k == "3"))
                                $non_com_sec += sizeof($v["tid"]);
                            $count += sizeof($v["tid"]);
                            $total_com += $com;
                            $total_sec += $sec;
                            $total_com_sec += $com_sec;
                            $total_non_com_sec += $non_com_sec;
                        }
                    }
                    if ($category_info_details or $category_info_total) {
                        array_push($temp_arr, array($datetime1, $count, $com, $sec, $com_sec, $non_com_sec));
                    } else {
                        array_push($temp_arr, array($datetime1, $count));
                    }
                }
            }
        }

        $final_result["range_type"] = $range_type;
        $final_result["chart_type"] = "freq_dist";
        if ($category_info_details or $category_info_total) {
            if ($category_info_details) {
                $final_result["data"] = $temp_arr;
            }
            $final_result["com"] = $total_com;
            $final_result["sec"] = $total_sec;
            $final_result["com_sec"] = $total_com_sec;
            $final_result["normal"] = $total_non_com_sec;
            $final_result["total"] = $total_com + $total_sec + $total_com_sec + $total_non_com_sec;
        } else {
            $final_result["data"] = $temp_arr;
        }
        echo json_encode($final_result);
    }






    public function getSentimentDataForHistoricalAdvance_main($query, $to_datetime,  $from_datetime, $range_type, $filename, $userid, $category_info_total = false, $category_info_details = true){
        $ut_obj = new Utilities;
        $final_result = array();
        $fromdate = ($ut_obj->separate_date_time($from_datetime))[0];
        $todate = ($ut_obj->separate_date_time($to_datetime))[0];
        $file_path = "$userid/$filename.json";
        $json_result_array = $ut_obj->read_file($file_type='json', $file_path);
        $temp_arr = array();
        $current_date = $ut_obj->get_current_date_time($option='datetime000');
        if ($range_type == "10sec") {
            $re_for_given_date = $json_result_array[$fromdate];
            $date = $fromdate;
            $tenSec_arr = $ut_obj->get_10sec_list($to_datetime, $from_datetime);
            if ($re_for_given_date) {
                // if date is cuurent date
                if($date == $current_date){
                    // if($re_for_given_date[$startTime]){
                    //     $sec_arr = $re_for_given_date[$startTime]["second"];
                    //     foreach ($tenSec_arr as $k => $v) {
                    //         $datetime1 = $date . " " . $v;
                    //         $pos = 0;
                    //         $neg = 0;
                    //         $neu = 0;
                    //         if (array_key_exists($v, $sec_arr)) {
                    //             $v = $sec_arr[$v];
                    //             if (array_key_exists("0", $v))
                    //                 $pos += sizeof($v["0"]["tid"]);
                    //             if (array_key_exists("1", $v))
                    //                 $neg += sizeof($v["1"]["tid"]);
                    //             if (array_key_exists("2", $v))
                    //                 $neu += sizeof($v["2"]["tid"]);
                    //         }
                    //         array_push($temp_arr, array($datetime1, $pos, $neg, $neu));
                    //     }
                    // }
                }else{
                    $sec_arr = $re_for_given_date["second"];
                    foreach ($tenSec_arr as $k => $v) {
                        $date = $v[0]; //date
                        $v = $v[1]; //take only time, $v = ["2020-09-11","18:00:00"]   
                        $datetime1 = $date . " " . $v;
                        $pos = 0;
                        $neg = 0;
                        $neu = 0;
                        if (array_key_exists($v, $sec_arr)) {
                            $v_arr = $sec_arr[$v];
                            foreach ($v_arr as $k => $v) {
                                if(($k == "1") or ($k == "11") or ($k == "101") or ($k == "111"))
                                    $pos += sizeof($v["tid"]);
                                else if(($k == "2") or ($k == "12") or ($k == "102") or ($k == "112"))
                                    $neg += sizeof($v["tid"]);
                                else if(($k == "3") or ($k == "13") or ($k == "103") or ($k == "113"))
                                    $neu += sizeof($v["tid"]);
                            }
                        }
                        array_push($temp_arr, array($datetime1, $pos, $neg, $neu));
                    }
                }
            }
        } else if ($range_type == "hour") {
            $re_for_given_date = $json_result_array[$fromdate];
            $date = $fromdate;
            if ($re_for_given_date) {
                // if date is cuurent date
                if($date == $current_date){
                    // $keys_arr = array_keys($re_for_given_date); 
                    // sort($keys_arr); //date key array getting from json file should be sorted;
                    // foreach ($keys_arr as $k_hr) {
                    //     $v_hr = $re_for_given_date[$k_hr];
                    //     if($v_hr){
                    //         $hr_arr = $v_hr["hours"];
                    //         foreach ($hr_arr as $k => $v) {
                    //             $datetime1 = $date . " " . $k_hr;
                    //             $pos = 0;
                    //             $neg = 0;
                    //             $neu = 0;
                    //             if($k == $k_hr){
                    //                 if (array_key_exists("0", $v))
                    //                     $pos += sizeof($v["0"]["tid"]);
                    //                 if (array_key_exists("1", $v))
                    //                     $neg += sizeof($v["1"]["tid"]);
                    //                 if (array_key_exists("2", $v))
                    //                     $neu += sizeof($v["2"]["tid"]);
                    //                 array_push($temp_arr, array($datetime1, $pos, $neg, $neu));
                    //             }
                    //         }
                    //     }
                    // }
                }else{
                    $hr_arr = $re_for_given_date["hours"];
                    $hr_key_arr = array_keys($hr_arr); 
                    sort($hr_key_arr); //hour key array getting from json file should be sorted;
                    foreach ($hr_key_arr as $k) {
                        $value_arr = $hr_arr[$k];
                        $datetime1 = $date . " " . $k;
                        $pos = 0;
                        $neg = 0;
                        $neu = 0;
                        foreach ($value_arr as $k => $v) {
                            if(($k == "1") or ($k == "11") or ($k == "101") or ($k == "111"))
                                $pos += sizeof($v["tid"]);
                            else if(($k == "2") or ($k == "12") or ($k == "102") or ($k == "112"))
                                $neg += sizeof($v["tid"]);
                            else if(($k == "3") or ($k == "13") or ($k == "103") or ($k == "113"))
                                $neu += sizeof($v["tid"]);
                        }
                        array_push($temp_arr, array($datetime1, $pos, $neg, $neu));
                    }
                }
            }
        } else if ($range_type == "day") {
            $keys_arr = array_keys($json_result_array); 
            sort($keys_arr); //date key array getting from json file should be sorted;
            foreach ($keys_arr as $key) {
                $value = $json_result_array[$key];
                $datetime1 = $key;
                $pos = 0;
                $neg = 0;
                $neu = 0;
                if ($value) {
                    // if date is cuurent date
                    if($key == $current_date){
                        // foreach ($value as $k => $v) {
                        //     if($v){
                        //         $sentiment_arr = $v["sentiment"];
                        //         if (array_key_exists("0", $sentiment_arr))
                        //             $pos += sizeof($sentiment_arr["0"]["tid"]);
                        //         if (array_key_exists("1", $sentiment_arr))
                        //             $neg += sizeof($sentiment_arr["1"]["tid"]);
                        //         if (array_key_exists("2", $sentiment_arr))
                        //             $neu += sizeof($sentiment_arr["2"]["tid"]);
                        //     }
                        // }
                        // array_push($temp_arr, array($datetime1, $pos, $neg, $neu));
                    }else{
                        $category_arr = $value["category"];
                        foreach ($category_arr as $k => $v) {
                            if(($k == "1") or ($k == "11") or ($k == "101") or ($k == "111"))
                                $pos += sizeof($v["tid"]);
                            else if(($k == "2") or ($k == "12") or ($k == "102") or ($k == "112"))
                                $neg += sizeof($v["tid"]);
                            else if(($k == "3") or ($k == "13") or ($k == "103") or ($k == "113"))
                                $neu += sizeof($v["tid"]);
                        }
                        array_push($temp_arr, array($datetime1, $pos, $neg, $neu));
                    }
                }
            }
        }

        $final_result["range_type"] = $range_type;
        $final_result["chart_type"] = "senti_dist";
        $final_result["data"] = $temp_arr;
        echo json_encode($final_result);
    }




    public function getCooccurDataForAdvance_main($to_datetime,  $from_datetime, $token,  $co_occur_option,  $file_path_to_write_csv, $need_to_store = true, $userid=null, $json_filename_to_get_data=null)
    {
        $ut_obj = new Utilities;
        $final_result = array();
        $total = 0;
        $fromdate = ($ut_obj->separate_date_time($from_datetime))[0];
        $todate = ($ut_obj->separate_date_time($to_datetime))[0];
        $file_path = "$userid/$json_filename_to_get_data.json";
        $json_result_array = $ut_obj->read_file($file_type='json', $file_path);
        $temp_arr = array();
        $current_date = $ut_obj->get_current_date_time('date');
        if($co_occur_option == 'mention')
            $co_occur_option = 'mentions';
        else  if($co_occur_option == 'hashtag')
            $co_occur_option = 'hashtags';

        foreach ($json_result_array as $key => $value) {
            if ($value) {                             
                if($key == $current_date){   
                    foreach ($value as $k => $v) {
                        if($v){
                            if (array_key_exists($co_occur_option, $v)) {
                                $co_array = $v[$co_occur_option];
                                foreach ($co_array as $k1 => $v1) {
                                    if (array_key_exists($k1, $temp_arr)) {
                                        $temp_arr[$k1] =  $temp_arr[$k1] + $v1;
                                    } else {
                                        $temp_arr[$k1] = $v1;
                                    }
                                }
                            }
                        }
                    }
                }else{
                    if (array_key_exists($co_occur_option, $value)) {
                        $co_array = $value[$co_occur_option];
                        foreach ($co_array as $k => $v) {
                            if (array_key_exists($k, $temp_arr)) {
                                $temp_arr[$k] =  $temp_arr[$k] + $v;
                            } else {
                                $temp_arr[$k] = $v;
                            }
                        }
                    }
                }
            }
        }
        arsort($temp_arr);
        if (sizeof($temp_arr) == 0) {
            return (array('status' => 'success', 'nodes' => sizeof($temp_arr)));
        }else{
            if ($need_to_store) {
                if ($file_path_to_write_csv) {
                    $ut_obj->write_to_file('csv', $file_path_to_write_csv, $temp_arr, $token, $userid);
                    return (array('status' => 'success', 'nodes' => sizeof($temp_arr)));
                }else{
                    return (array('status' => 'fath to store not provided', 'nodes' => sizeof($temp_arr)));
                }                
            }
        }
    }



    public function getTweetIDForAdvance_main($to_datetime, $from_datetime, $query, $range_type, $filter, $userid=null, $json_filename_to_get_data=null){
        $ut_obj = new Utilities;
        $final_result = array();
        $total = 0;
        $fromdate = ($ut_obj->separate_date_time($from_datetime))[0];
        $todate = ($ut_obj->separate_date_time($to_datetime))[0];
        $totime = ($ut_obj->separate_date_time($to_datetime))[1];
        $file_path = "$userid/$json_filename_to_get_data.json";
        $json_result_array = $ut_obj->read_file($file_type='json', $file_path);
        $temp_arr = array();
        $current_date = $ut_obj->get_current_date_time('date');
        $tweet_id_list = array();

        
        if($range_type == "day"){
            foreach ($json_result_array as $key => $value) {
                if ($value) {
                    // if date is cuurent date
                    if($key == '2020-09-30'){                       
                        foreach ($value as $k1 => $v1) {
                            if($v1){
                                $category_arr = $v1["category"];
                                // echo json_encode($category_arr);
                                foreach ($category_arr as $k => $v) {
                                    $tweet_id_list = array_merge($tweet_id_list, $v["tid"]);
                                }
                            }
                        }
                    }else{
                        $category_arr = $value["category"];
                        foreach ($category_arr as $k => $v) {
                            $tweet_id_list = array_merge($tweet_id_list, $v["tid"]);
                        }
                    }
                }
            }
        }else if($range_type == "hour"){
            $re_for_given_date = $json_result_array[$fromdate];
            $date = $fromdate;
            if ($re_for_given_date) {
                // if date is cuurent date
                if($date == $current_date){

                }else{
                    $category_arr = $re_for_given_date["category"];
                    foreach ($category_arr as $k => $v) {
                        $tweet_id_list = array_merge($tweet_id_list, $v["tid"]);
                    }
                }
            }
        }else if($range_type == '10sec'){
            $re_for_given_date = $json_result_array[$fromdate];
            $date = $fromdate;
            if ($re_for_given_date) {
                // if date is cuurent date
                if($date == $current_date){

                }else{
                    $hr_arr = $re_for_given_date["hours"];
                    if(array_key_exists($totime, $hr_arr)){
                        $hr_arr = $hr_arr[$totime];
                        foreach ($hr_arr as $k => $v) {
                            $tweet_id_list = array_merge($tweet_id_list, $v["tid"]);
                        }
                    }
                }
            }
        }

        $final_result["range_type"] = $range_type;
        $final_result["chart_type"] = "tweet";
        $final_result["data"] = $tweet_id_list;
        return ($final_result);
    }

  
}