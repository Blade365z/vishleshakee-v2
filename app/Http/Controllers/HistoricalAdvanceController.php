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
        $data['file'] = 'local:/home/admin/bbk/dataset_builder/spark/batch/advance_query.py';
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
        //curl -X GET -H "Content-Type: application/json" 172.16.117.202:8998/batches/{80}
        $request->validate([
            'id' => 'required',
            'unique_name_timestamp' =>  'required'
        ]);

        $id =  $request->input('id');
        $filename = $request->input('unique_name_timestamp');
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
        // $this->storeAsJson($request, $filename, $result);
        return $result;
        // return json_encode(array('status' => 'done', 'id' => $id));
    }




    private function get_session_uid(Request $request)
    {
        return $request->session()->get('uid');
    }



    public function storeAsJson(Request $request, $filename, $json_result)
    {
        $dir_name = strval($this->get_session_uid($request));

        // Check whether the directory is already created
        if (!file_exists("storage/$dir_name")) {
            mkdir("storage/$dir_name");
        }

        $fp = fopen("storage/$dir_name/$filename.json", "w");
        fwrite($fp, json_encode($json_result, JSON_PRETTY_PRINT));
        fclose($fp);
    }


    public function readJsonFile(Request $request, $filename)
    {
        $dir_name = strval($this->get_session_uid($request));
        // $id =  $_GET['id'];
        // $filename = $_GET['filename'];
        // $fp = fopen("storage/$dir_name/$filename.json", "w");
        if(!is_numeric($filename)){
            $str = file_get_contents("storage/trendingtopics/$filename.json");    
        }
        else{
            $str = file_get_contents("storage/$dir_name/$filename.json");        
        }
    
        $json_array = json_decode($str, true); // decode the JSON into an associative array
        return $json_array;
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



    public function getDataForFrequncydistributionFromJson($to_datetime, $from_datetime, $token, $range_type, $category_info_total = false, $category_info_details = true, $filename=null)
    {
        $ut_obj = new Utilities;
        $final_result = array();
        // $range_type = $_GET['range_type'];
        // $filename = $_GET['filename'];
        // if (isset($_GET['fromdate']))
        $fromdate = ($ut_obj->separate_date_time($from_datetime))[0];
        // if (isset($_GET['todate']))
        $todate = ($ut_obj->separate_date_time($from_datetime))[0];
        if (isset($_GET['startTime']))
            $startTime = $_GET['startTime'];
        // $json_result_array = $this->readJsonFile($request, $filename);
        $json_result_array = $ut_obj->read_file($file_type='json', $file_path='1415.json');
        $temp_arr = array();
        // $current_date = (new DateTime())->format('Y-m-d');

        // if ($range_type == "10sec") {
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
        // } else if ($range_type == "hour") {
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
        // } else if ($range_type == "days") {
        // if ($range_type == "day") {
        //     $keys_arr = array_keys($json_result_array); 
        //     sort($keys_arr); //date key array getting from json file should be sorted;
            // foreach ($keys_arr as $key) {
            //     $count = 0;
            //     $datetime1 = $key . ' 00:00:00';
            //     $value = $json_result_array[$key];
            //     if ($value) {
            //         // if date is cuurent date
            //         if($key == $current_date){
            //             foreach ($value as $k => $v) {
            //                 if($v){
            //                     $sentiment_arr = $v["sentiment"];
            //                     foreach ($sentiment_arr as $k1 => $v1) {
            //                         $count += sizeof($v1["tid"]);
            //                     }
            //                 }
            //             }
            //         }
            //         else{
            //             $sentiment_arr = $value["sentiment"];
            //             foreach ($sentiment_arr as $k => $v) {
            //                 $count += sizeof($v["tid"]);
            //             }
            //         }
            //         array_push($temp_arr, array($datetime1, $count));
            //     }
            // }
        // }

        // $final_result["range_type"] = $range_type;
        // $final_result["chart_type"] = "freq_dist";
        // $final_result["data"] = $temp_arr;
        // echo json_encode($final_result);
    }




}