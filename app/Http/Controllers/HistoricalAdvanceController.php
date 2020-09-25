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
        $data['conf'] = array('spark.jars.packages' => 'anguenot:pyspark-cassandra:2.4.0', 'spark.cassandra.connection.host' => '10.0.0.12', 'spark.cores.max' => 4);
        // $data['file'] = 'local:/home/admin/bbk/dataset_builder/spark/batch/advance_query.py';
        $data['file'] = 'local:/home/admin/bbk/rahul_test1/spark/batch/new_advance_query.py';
        $data['args'] = $query_list;
        $data['name'] = strval($rname) . 'a77';
        $data['executorCores'] = 4;
        $data['numExecutors'] = 2;
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




    public function getTweetIdFromJson(Request $request)
    {
        $final_result = array();
        $tweet_id_list = array();
        $filename = $_GET['filename'];
        $date = null;
        $time = null;
        $range_type = null;
        $current_date = (new DateTime())->format('Y-m-d');
        
        if (isset($_GET['range_type'])) {
            $range_type = $_GET['range_type'];
        }
        if (isset($_GET['date'])) {
            $date = $_GET['date'];
        }
        if ( (isset($_GET['date'])) && (isset($_GET['startTime']))  ) {
            $date = $_GET['date'];
            $time = $_GET['startTime'];
        }
        
        // only for request coming from on click on 10sec chart
        if ( (isset($_GET['date'])) && (isset($_GET['time']))  ) {
            $date = $_GET['date'];
            $time = $_GET['time'];
        }


        $json_result_array = $this->readJsonFile($request, $filename);
        // if only date present
        if ($date && !($time)) {
            $date = date('Y-m-d', strtotime($date));
            $re_for_given_date = $json_result_array[$date];
            if ($re_for_given_date) {
                // if date is cuurent date
                if($date == $current_date){
                    foreach ($re_for_given_date as $key => $value) {
                        if($value){
                            $sentiment_arr = $value["sentiment"];
                            foreach ($sentiment_arr as $k => $v) {
                                $tweet_id_list = array_merge($tweet_id_list, $v["tid"]);
                            }
                        }
                    }
                }
                else{
                    $sentiment_arr = $re_for_given_date["sentiment"];
                    foreach ($sentiment_arr as $k => $v) {
                        $tweet_id_list = array_merge($tweet_id_list, $v["tid"]);
                    }
                }
            }
        }
        // if date and time both present
        else if ($date && $time) {
            $date = date('Y-m-d', strtotime($date));
            $time=date('H:i:s', strtotime($time));
            $re_for_given_date = $json_result_array[$date];
            if ($re_for_given_date) {
                // if date is cuurent date
                if($date == $current_date){
                    if($range_type == '10sec')
                        $second_result=$re_for_given_date[$time]["hours"][$time]; //get tweet for hour plot
                    else{
                        foreach ($re_for_given_date as $key => $value) {
                            if($value){
                                if(array_key_exists($time,$value["second"]))
                                    $second_result=$value["second"][$time];
                            }
                        }
                    }
                    foreach ($second_result as $key => $value) {
                        $tweet_id_list = array_merge($tweet_id_list, $value["tid"]);
                    }
                }else{
                    if($range_type == '10sec')
                        $second_result=$re_for_given_date["hours"][$time]; //get tweet for hour plot
                    else
                        $second_result=$re_for_given_date["second"][$time];
                    foreach ($second_result as $key => $value) {
                        $tweet_id_list = array_merge($tweet_id_list, $value["tid"]);
                    }
                }
            }
        }
        // if nothing is present
        else {
            foreach ($json_result_array as $key => $value) {
                if ($value) {
                    // if date is cuurent date
                    if($key == $current_date){
                        foreach ($value as $k => $v) {
                            if($v){
                                $sentiment_arr = $v["sentiment"];
                                foreach ($sentiment_arr as $k => $v) {
                                    $tweet_id_list = array_merge($tweet_id_list, $v["tid"]);
                                }
                            }
                        }
                    }else{
                        $sentiment_arr = $value["sentiment"];
                        foreach ($sentiment_arr as $k => $v) {
                            // echo json_encode($v["tid"]);
                            $tweet_id_list = array_merge($tweet_id_list, $v["tid"]);
                        }
                    }
                }
            }
        }

        $final_result["chart_type"] = "tweet";
        $final_result["data"] = $tweet_id_list;
        echo json_encode($final_result);
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
        $from_datetime = date('Y-m-d H:i:s', strtotime($from) + 0);
        $to_datetime = date('Y-m-d H:i:s', strtotime($to) + 0);
        $range_type =  $request->input('rangeType');
        $filename = $request->input('filename');
        $userid =  $request->input('userid');

        return $this->getFrequencyDataForHistoricalAdvance_main($query, $to_datetime,  $from_datetime, $range_type, $filename, $userid, $category_info_total = false, $category_info_details = true);
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



        // $range_type = $_GET['range_type'];
        // $filename = $_GET['filename'];
        // if (isset($_GET['fromdate']))        
        // if (isset($_GET['todate']))      
        if (isset($_GET['startTime']))
            $startTime = $_GET['startTime'];
        // $json_result_array = $this->readJsonFile($request, $filename);
        // $current_date = (new DateTime())->format('Y-m-d');

       
        
       
        if ($range_type == "10sec") {
        //     $re_for_given_date = $json_result_array[$fromdate];
        //     $date = $fromdate;
        //     $tenSec_arr = $this->get_10_sec_list_of_day($startTime);
        //     if ($re_for_given_date) {
        //         // if date is cuurent date
        //         if($date == $current_date){
        //             if($re_for_given_date[$startTime]){
        //                 $sec_arr = $re_for_given_date[$startTime]["second"];
        //                 foreach ($tenSec_arr as $k => $v) {
        //                     $datetime1 = $date . " " . $v;
        //                     $c = 0;
        //                     if (array_key_exists($v, $sec_arr)) {
        //                         $v = $sec_arr[$v];
        //                         foreach ($v as $k1 => $v1) {
        //                             $c += sizeof($v1["tid"]);
        //                         }
        //                     }
        //                     array_push($temp_arr, array($datetime1, $c));
        //                 }
        //             }
        //         }else{
        //             $sec_arr = $re_for_given_date["second"];
        //             foreach ($tenSec_arr as $k => $v) {
        //                 $datetime1 = $date . " " . $v;
        //                 $c = 0;
        //                 if (array_key_exists($v, $sec_arr)) {
        //                     $v = $sec_arr[$v];
        //                     foreach ($v as $k1 => $v1) {
        //                         $c += sizeof($v1["tid"]);
        //                     }
        //                 }
        //                 array_push($temp_arr, array($datetime1, $c));
        //             }
        //         }
        //     }
        } else if ($range_type == "hour") {
        //     $re_for_given_date = $json_result_array[$fromdate];
        //     $date = $fromdate;
        //     if ($re_for_given_date) {
        //         // if date is cuurent date
        //         if($date == $current_date){
        //             $keys_arr = array_keys($re_for_given_date); 
        //             sort($keys_arr); //date key array getting from json file should be sorted;
        //             foreach ($keys_arr as $k_hr) {
        //                 // echo json_encode($v_hr["hours"]);
        //                 $v_hr = $re_for_given_date[$k_hr];
        //                 if($v_hr){
        //                     $hr_arr = $v_hr["hours"];
        //                     foreach ($hr_arr as $k => $v) {
        //                         $datetime1 = $date . " " . $k_hr;
        //                         $c = 0;
        //                         if($k == $k_hr){
        //                             foreach ($v as $k1 => $v1) {
        //                                 $c += $v1["tid_count"];
        //                             }
        //                             array_push($temp_arr, array($datetime1, $c));
        //                         }
        //                     }
        //                 }
        //             }
        //         }
        //         else{
        //             $hr_arr = $re_for_given_date["hours"];
        //             $hr_key_arr = array_keys($hr_arr); 
        //             sort($hr_key_arr); //hour key array getting from json file should be sorted;
        //             foreach ($hr_key_arr as $k) {
        //                 $v = $hr_arr[$k];
        //                 $datetime1 = $date . " " . $k;
        //                 $c = 0;
        //                 foreach ($v as $k1 => $v1) {
        //                     $c += $v1["tid_count"];
        //                 }
        //                 array_push($temp_arr, array($datetime1, $c));
        //             }
        //         }
        //     }
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
                        array_push($temp_arr, array($datetime1, $ar_sum));
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
}