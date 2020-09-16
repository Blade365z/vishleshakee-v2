<?php

namespace App\Http\Controllers;

use App\DBModel\DBmodel;
use App\DBModel\DBmodelAsync;
use App\Library\QueryBuilder as QB;
use App\Library\Utilities as Ut;
use Illuminate\Http\Request;
use DateTime;

// ini_set('max_execution_time', 0);
// set_time_limit(0);
ini_set('memory_limit','1000M');

class CommonController extends Controller
{
    private $total_main_category = 4; // not_sec_com(included pos, neg, neu), security(included pos, neg, neu), communal(included pos, neg, neu), sec_com(included pos, neg, neu)

    /**
     * Get data for frequency Distribution
     *
     * @return json
     */
    public function get_frequency_distribution_data($to_datetime = null, $from_datetime = null, $token = null, $range_type = null, $category_info_total = false, $category_info_details = false)
    {
        $db_object = new DBmodelAsync;
        $db_object_not_async = new DBmodel;
        $qb_obj = new QB;
        $ut_obj = new Ut;
        $final_result = array();
        $temp_arr = array();
        $total = 0;
        $total_com = 0;
        $total_sec = 0;
        $total_com_sec = 0;
        $total_non_com_sec = 0;
        $current_date = $ut_obj->get_current_date_time($option='datetime000');
        if($range_type == "10sec"){
            $stm_list = $qb_obj->get_statement($to_datetime, $from_datetime, $token, $range_type, 'freq');
            $result_async_from_db = $db_object->executeAsync_query($stm_list[1], $stm_list[0]);

            foreach ($result_async_from_db as $rows) {
                $com = 0;
                $sec = 0;
                $com_sec = 0;
                $non_com_sec = 0;
                foreach ($rows as $row) {
                    $t = $row['created_date'];
                    $datetime1 = $ut_obj->get_date_time_from_cass_date_obj($t, "Y-m-d") . ' ' . $row['created_time'];
                    $count_list = $row['count_list']->values();
                    $ar_sum = array_sum($count_list);
                    if ($category_info_details or $category_info_total) {
                        $com += $count_list[3] + $count_list[4] + $count_list[5];
                        $sec += $count_list[6] + $count_list[7] + $count_list[8];
                        $com_sec += $count_list[9] + $count_list[10] + $count_list[11];
                        $non_com_sec += $count_list[0] + $count_list[1] + $count_list[2];
                        array_push($temp_arr, array($datetime1, $ar_sum, $com, $sec, $com_sec, $non_com_sec));
                        $total_com += $com;
                        $total_sec += $sec;
                        $total_com_sec += $com_sec;
                        $total_non_com_sec += $non_com_sec;
                    } else {
                        array_push($temp_arr, array($datetime1, $ar_sum));
                    }
                }
            }
        }else if($range_type == "hour"){
            $stm_list = $qb_obj->get_statement($to_datetime, $from_datetime, $token, $range_type, 'freq');
            $result_async_from_db = $db_object->executeAsync_query($stm_list[1], $stm_list[0]);

            foreach ($result_async_from_db as $rows) {
                $com = 0;
                $sec = 0;
                $com_sec = 0;
                $non_com_sec = 0;
                foreach ($rows as $row) {
                    $t = $row['created_date'];
                    $datetime1 = $ut_obj->get_date_time_from_cass_date_obj($t, "Y-m-d") . ' ' . $row['created_time'];
                    $count_list = $row['count_list']->values();
                    $ar_sum = array_sum($count_list);
                    if ($category_info_details or $category_info_total) {
                        $com += $count_list[3] + $count_list[4] + $count_list[5];
                        $sec += $count_list[6] + $count_list[7] + $count_list[8];
                        $com_sec += $count_list[9] + $count_list[10] + $count_list[11];
                        $non_com_sec += $count_list[0] + $count_list[1] + $count_list[2];
                        array_push($temp_arr, array($datetime1, $ar_sum, $com, $sec, $com_sec, $non_com_sec));
                        $total_com += $com;
                        $total_sec += $sec;
                        $total_com_sec += $com_sec;
                        $total_non_com_sec += $non_com_sec;
                    } else {
                        array_push($temp_arr, array($datetime1, $ar_sum));
                    }
                }
            }

            // if date is current date, thn get the data for current time(2020-09-06 21:48:10) from 10_sec table
            // ...........................remain
            if($to_datetime == $current_date){                 
                // and current hour(10sec table)
                $current_datetime_obj = new DateTime();
                $to_datetime = $current_datetime_obj->format('Y-m-d H:i:s'); //2020-09-08 21:44:40
                $from_datetime = ($current_datetime_obj->format('Y-m-d H')). ':00:00'; //2020-09-08 21:00:00
                $stm_list = $qb_obj->get_statement($to_datetime, $from_datetime, $token, '10sec', 'freq');
                $result_async_from_db = $db_object->executeAsync_query($stm_list[1], $stm_list[0]);

                // if crnt time = 2020-09-08 21:44:40, thn next hr = 2020-09-08 22:00:00 but if crnt time = 2020-09-08 23:44:40, thn next hr = 2020-09-09 00:00:00
                $datetime1 = $ut_obj->get_next_date_hour($to_datetime);
                

                $com = 0;
                $sec = 0;
                $com_sec = 0;
                $non_com_sec = 0;
                $ar_sum = 0;
                foreach ($result_async_from_db as $rows) {               
                    foreach ($rows as $row) {
                        // $t = $row['created_date'];
                        // $datetime1 = $ut_obj->get_date_time_from_cass_date_obj($t, "Y-m-d") . ' ' . $row['created_time'];
                        $count_list = $row['count_list']->values();
                        $ar_sum += array_sum($count_list);
                        if ($category_info_details or $category_info_total) {
                            $com += $count_list[3] + $count_list[4] + $count_list[5];
                            $sec += $count_list[6] + $count_list[7] + $count_list[8];
                            $com_sec += $count_list[9] + $count_list[10] + $count_list[11];
                            $non_com_sec += $count_list[0] + $count_list[1] + $count_list[2];                          
                        }
                    }
                }
                if ($category_info_details or $category_info_total) {
                    $total_com += $com;
                    $total_sec += $sec;
                    $total_com_sec += $com_sec;
                    $total_non_com_sec += $non_com_sec;
                    array_push($temp_arr, array($datetime1, $ar_sum, $com, $sec, $com_sec, $non_com_sec));
                }
                else
                    array_push($temp_arr, array($datetime1, $ar_sum));
            }
        }else if ($range_type == "day") {
            // past days
            $stm_list = $qb_obj->get_statement($to_datetime, $from_datetime, $token, $range_type, 'freq');
            $result_async_from_db = $db_object->executeAsync_query($stm_list[1], $stm_list[0]);

            foreach ($result_async_from_db as $rows) {
                $com = 0;
                $sec = 0;
                $com_sec = 0;
                $non_com_sec = 0;
                foreach ($rows as $row) {
                    $t = $row['created_date'];
                    $datetime1 = $ut_obj->get_date_time_from_cass_date_obj($t, "Y-m-d");
                    $count_list = $row['count_list']->values();
                    $ar_sum = array_sum($count_list);
                    if ($category_info_details or $category_info_total) {
                        $com += $count_list[3] + $count_list[4] + $count_list[5];
                        $sec += $count_list[6] + $count_list[7] + $count_list[8];
                        $com_sec += $count_list[9] + $count_list[10] + $count_list[11];
                        $non_com_sec += $count_list[0] + $count_list[1] + $count_list[2];
                        array_push($temp_arr, array($datetime1, $ar_sum, $com, $sec, $com_sec, $non_com_sec));
                        $total_com += $com;
                        $total_sec += $sec;
                        $total_com_sec += $com_sec;
                        $total_non_com_sec += $non_com_sec;
                    } else {
                        array_push($temp_arr, array($datetime1, $ar_sum));
                    }
                }
            }

            //if to_date == current_date, query for current hour, and all the past hours of current day.....remain
            if($to_datetime == $current_date){
                // past hours(hour table) ($to_datetime = 2020-09-08 00:00:00, $from_datetime= 2020-09-08 00:00:00)
                $result_async_from_db1 = array();
                $stm_list = $qb_obj->get_statement($to_datetime, $from_datetime, $token, 'hour', 'freq');
                $result_async_from_db1 = $db_object->executeAsync_query($stm_list[1], $stm_list[0]);                    
                // and current hour(10sec table)
                $result_async_from_db2 = array(); 
                $current_datetime_obj = new DateTime();
                $to_datetime = $current_datetime_obj->format('Y-m-d H:i:s'); //2020-09-08 21:44:40
                $from_datetime = ($current_datetime_obj->format('Y-m-d H')). ':00:00'; //2020-09-08 21:44:40
                $stm_list = $qb_obj->get_statement($to_datetime, $from_datetime, $token, '10sec', 'freq');
                $result_async_from_db2 = $db_object->executeAsync_query($stm_list[1], $stm_list[0]);

                $result_async_from_db = array_merge($result_async_from_db1, $result_async_from_db2);  
                
                $com = 0;
                $sec = 0;
                $com_sec = 0;
                $non_com_sec = 0;
                $ar_sum = 0;
                $datetime1 = $ut_obj->get_current_date_time($option='date');
                foreach ($result_async_from_db as $rows) {                   
                    foreach ($rows as $row) {
                        $count_list = $row['count_list']->values();
                        $ar_sum += array_sum($count_list);
                        if ($category_info_details or $category_info_total) {
                            $com += $count_list[3] + $count_list[4] + $count_list[5];
                            $sec += $count_list[6] + $count_list[7] + $count_list[8];
                            $com_sec += $count_list[9] + $count_list[10] + $count_list[11];
                            $non_com_sec += $count_list[0] + $count_list[1] + $count_list[2];
                        }
                    }
                }

                if ($category_info_details or $category_info_total) {
                    $total_com += $com;
                    $total_sec += $sec;
                    $total_com_sec += $com_sec;
                    $total_non_com_sec += $non_com_sec;
                    array_push($temp_arr, array($datetime1, $ar_sum, $com, $sec, $com_sec, $non_com_sec));
                }else{
                    array_push($temp_arr, array($datetime1, $ar_sum));
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
        return ($final_result);
    }




    /**
     * Get data for sentiment Distribution
     *
     * @return json
     */
    public function get_sentiment_distribution_data($to_datetime = null, $from_datetime = null, $token = null, $range_type = null)
    {
        $db_object = new DBmodelAsync;
        $db_object_not_async = new DBmodel;
        $qb_obj = new QB;
        $ut_obj = new Ut;
        $final_result = array();
        $temp_arr = array();
        $current_date = $ut_obj->get_current_date_time($option='datetime000');
        if ($range_type == "10sec") {
            $stm_list = $qb_obj->get_statement($to_datetime, $from_datetime, $token, $range_type, 'sent');
            $result_async_from_db = $db_object->executeAsync_query($stm_list[1], $stm_list[0]);

            foreach ($result_async_from_db as $rows) {
                $datetime1 = null;
                $pos = 0;
                $neg = 0;
                $neu = 0;
                foreach ($rows as $row) {
                    $t = $row['created_date'];
                    $datetime1 = $ut_obj->get_date_time_from_cass_date_obj($t, "Y-m-d") . ' ' . $row['created_time'];
                    $count_list = $row['count_list']->values();
                    /*  pos index -> 0, 3, 6, 9
                        neg index -> 1, 4, 7, 10
                        neu index -> 2, 5, 8, 11
    
                        pos -> 0*3+0=0, 1*3+0=3, 2*3+0=6, 3*3+0=9
                        neg -> 0*3+1=1, 1*3+1=4, 2*3+1=7, 3*3+1=10
                        neu -> 0*3+2=2, 1*3+2=5, 2*3+2=8, 3*3+2=11 */
                    for ($i = 0; $i < $this->total_main_category; $i++) {
                        $pos += $count_list[($i * 3) + 0];
                        $neg += $count_list[($i * 3) + 1];
                        $neu += $count_list[($i * 3) + 2];
                    }
                }
                if ($datetime1) {
                    array_push($temp_arr, array($datetime1, $pos, $neg, $neu));
                }
            }
        }else if($range_type == "hour"){
            $stm_list = $qb_obj->get_statement($to_datetime, $from_datetime, $token, $range_type, 'sent');
            $result_async_from_db = $db_object->executeAsync_query($stm_list[1], $stm_list[0]);

            foreach ($result_async_from_db as $rows) {
                $datetime1 = null;
                $pos = 0;
                $neg = 0;
                $neu = 0;
                foreach ($rows as $row) {
                    $t = $row['created_date'];
                    $datetime1 = $ut_obj->get_date_time_from_cass_date_obj($t, "Y-m-d") . ' ' . $row['created_time'];
                    $count_list = $row['count_list']->values();
                    /*  pos index -> 0, 3, 6, 9
                        neg index -> 1, 4, 7, 10
                        neu index -> 2, 5, 8, 11
    
                        pos -> 0*3+0=0, 1*3+0=3, 2*3+0=6, 3*3+0=9
                        neg -> 0*3+1=1, 1*3+1=4, 2*3+1=7, 3*3+1=10
                        neu -> 0*3+2=2, 1*3+2=5, 2*3+2=8, 3*3+2=11 */
                    for ($i = 0; $i < $this->total_main_category; $i++) {
                        $pos += $count_list[($i * 3) + 0];
                        $neg += $count_list[($i * 3) + 1];
                        $neu += $count_list[($i * 3) + 2];
                    }
                }
                if ($datetime1) {
                    array_push($temp_arr, array($datetime1, $pos, $neg, $neu));
                }
            }

            // if date is current date, thn get the data for current time(2020-09-06 21:48:10) form 10_sec table
            // ...........................remain
            if($to_datetime == $current_date){                 
                // and current hour(10sec table)
                $current_datetime_obj = new DateTime();
                $to_datetime = $current_datetime_obj->format('Y-m-d H:i:s'); //2020-09-08 21:44:40
                $from_datetime = ($current_datetime_obj->format('Y-m-d H')). ':00:00'; //2020-09-08 21:44:40
                $stm_list = $qb_obj->get_statement($to_datetime, $from_datetime, $token, '10sec', 'sent');
                $result_async_from_db = $db_object->executeAsync_query($stm_list[1], $stm_list[0]);

                // if crnt time = 2020-09-08 21:44:40, thn next hr = 2020-09-08 22:00:00 but if crnt time = 2020-09-08 23:44:40, thn next hr = 2020-09-09 00:00:00
                $datetime1 = $ut_obj->get_next_date_hour($to_datetime);
                $pos = 0;
                $neg = 0;
                $neu = 0;
                foreach ($result_async_from_db as $rows) {
                    foreach ($rows as $row) {
                        $count_list = $row['count_list']->values();
                        /*  pos index -> 0, 3, 6, 9
                            neg index -> 1, 4, 7, 10
                            neu index -> 2, 5, 8, 11
        
                            pos -> 0*3+0=0, 1*3+0=3, 2*3+0=6, 3*3+0=9
                            neg -> 0*3+1=1, 1*3+1=4, 2*3+1=7, 3*3+1=10
                            neu -> 0*3+2=2, 1*3+2=5, 2*3+2=8, 3*3+2=11 */
                        for ($i = 0; $i < $this->total_main_category; $i++) {
                            $pos += $count_list[($i * 3) + 0];
                            $neg += $count_list[($i * 3) + 1];
                            $neu += $count_list[($i * 3) + 2];
                        }
                    }
                }
                array_push($temp_arr, array($datetime1, $pos, $neg, $neu));
            }
        }else if($range_type == "day"){
            $stm_list = $qb_obj->get_statement($to_datetime, $from_datetime, $token, $range_type, 'sent');
            $result_async_from_db = $db_object->executeAsync_query($stm_list[1], $stm_list[0]);

            foreach ($result_async_from_db as $rows) {
                $datetime1 = null;
                $pos = 0;
                $neg = 0;
                $neu = 0;
                foreach ($rows as $row) {
                    $t = $row['created_date'];
                    $datetime1 = $ut_obj->get_date_time_from_cass_date_obj($t, "Y-m-d");
                    $count_list = $row['count_list']->values();
                    /*  pos index -> 0, 3, 6, 9
                        neg index -> 1, 4, 7, 10
                        neu index -> 2, 5, 8, 11
    
                        pos -> 0*3+0=0, 1*3+0=3, 2*3+0=6, 3*3+0=9
                        neg -> 0*3+1=1, 1*3+1=4, 2*3+1=7, 3*3+1=10
                        neu -> 0*3+2=2, 1*3+2=5, 2*3+2=8, 3*3+2=11 */
                    for ($i = 0; $i < $this->total_main_category; $i++) {
                        $pos += $count_list[($i * 3) + 0];
                        $neg += $count_list[($i * 3) + 1];
                        $neu += $count_list[($i * 3) + 2];
                    }
                }
                if ($datetime1) {
                    array_push($temp_arr, array($datetime1, $pos, $neg, $neu));
                }
            }

            //if to_date == current_date, query for current hour, and all the past hours of current day.....remain
            if($to_datetime == $current_date){
                // past hours(hour table) ($to_datetime = 2020-09-08 00:00:00, $from_datetime= 2020-09-08 00:00:00)
                $result_async_from_db1 = array();
                $stm_list = $qb_obj->get_statement($to_datetime, $from_datetime, $token, 'hour', 'sent');
                $result_async_from_db1 = $db_object->executeAsync_query($stm_list[1], $stm_list[0]);                    
                // and current hour(10sec table)
                $result_async_from_db2 = array(); 
                $current_datetime_obj = new DateTime();
                $to_datetime = $current_datetime_obj->format('Y-m-d H:i:s'); //2020-09-08 21:44:40
                $from_datetime = ($current_datetime_obj->format('Y-m-d H')). ':00:00'; //2020-09-08 21:44:40
                $stm_list = $qb_obj->get_statement($to_datetime, $from_datetime, $token, '10sec', 'sent');
                $result_async_from_db2 = $db_object->executeAsync_query($stm_list[1], $stm_list[0]);

                $result_async_from_db = array_merge($result_async_from_db1, $result_async_from_db2);  

                $datetime1 = $ut_obj->get_current_date_time($option='date');
                $pos = 0;
                $neg = 0;
                $neu = 0;
                foreach ($result_async_from_db as $rows) {
                    foreach ($rows as $row) {
                        // $t = $row['created_date'];
                        // $datetime1 = $ut_obj->get_date_time_from_cass_date_obj($t, "Y-m-d");
                        $count_list = $row['count_list']->values();
                        /*  pos index -> 0, 3, 6, 9
                            neg index -> 1, 4, 7, 10
                            neu index -> 2, 5, 8, 11
        
                            pos -> 0*3+0=0, 1*3+0=3, 2*3+0=6, 3*3+0=9
                            neg -> 0*3+1=1, 1*3+1=4, 2*3+1=7, 3*3+1=10
                            neu -> 0*3+2=2, 1*3+2=5, 2*3+2=8, 3*3+2=11 */
                        for ($i = 0; $i < $this->total_main_category; $i++) {
                            $pos += $count_list[($i * 3) + 0];
                            $neg += $count_list[($i * 3) + 1];
                            $neu += $count_list[($i * 3) + 2];
                        }
                    }
                }
                array_push($temp_arr, array($datetime1, $pos, $neg, $neu));
            }
        }
        

        $final_result["range_type"] = $range_type;
        $final_result["chart_type"] = "sent_dist";
        $final_result["data"] = $temp_arr;
        return ($final_result);
    }




    /**
     * Get co-occur data given a token
     *
     * @return json
     */
    public function get_co_occur_data($to_datetime = null, $from_datetime = null, $token = null, $range_type = null, $co_occur_option = null, $file_path = null, $need_to_store = false, $data_formatter = false, $userID=null)
    {
        $db_object = new DBmodelAsync;
        $db_object_not_async = new DBmodel;
        $qb_obj = new QB;
        $ut_obj = new Ut;
        $final_result = array();
        $temp_arr = array();
        $total = 0;
        if($range_type){
            $stm_list = $qb_obj->get_statement($to_datetime, $from_datetime, $token, $range_type, 'co_occur', $co_occur_option);
            $result_async_from_db = $db_object->executeAsync_query($stm_list[1], $stm_list[0]);
        }else{
            $diff = $ut_obj->get_difference_between_two_datetime($to_datetime, $from_datetime, 'day');
            $current_date = $ut_obj->get_current_date_time($option='datetime000');
            if($diff == 0){
                if((($ut_obj->separate_date_time($to_datetime))[1] != '00:00:00') and (($ut_obj->separate_date_time($from_datetime))[1] != '00:00:00')){
                    // 10sec ($to_datetime = 2020-09-08 10:30:10, $from_datetime= 2020-09-08 10:00:10)
                    $stm_list = $qb_obj->get_statement($to_datetime, $from_datetime, $token, '10sec', 'co_occur', $co_occur_option);
                    $result_async_from_db = $db_object->executeAsync_query($stm_list[1], $stm_list[0]);                    
                }else if($to_datetime == $current_date){
                    // past hours(hour table) ($to_datetime = 2020-09-08 00:00:00, $from_datetime= 2020-09-08 00:00:00)
                    $result_async_from_db1 = array();
                    $stm_list = $qb_obj->get_statement($to_datetime, $from_datetime, $token, 'hour', 'co_occur', $co_occur_option);
                    $result_async_from_db1 = $db_object->executeAsync_query($stm_list[1], $stm_list[0]);        
                    // and current hour(10sec table)
                    $result_async_from_db2 = array(); 
                    $current_datetime_obj = new DateTime();
                    $to_datetime = $current_datetime_obj->format('Y-m-d H:i:s'); //2020-09-08 21:44:40
                    $from_datetime = ($current_datetime_obj->format('Y-m-d H')). ':00:00'; //2020-09-08 21:44:40
                    $stm_list = $qb_obj->get_statement($to_datetime, $from_datetime, $token, '10sec', 'co_occur', $co_occur_option);
                    $result_async_from_db2 = $db_object->executeAsync_query($stm_list[1], $stm_list[0]);

                    $result_async_from_db = array_merge($result_async_from_db1, $result_async_from_db2);                    
                }else{
                    // ($to_datetime = 2020-09-06 00:00:00, $from_datetime= 2020-09-06 00:00:00)
                    $stm_list = $qb_obj->get_statement($to_datetime, $from_datetime, $token, 'day', 'co_occur', $co_occur_option);
                    $result_async_from_db = $db_object->executeAsync_query($stm_list[1], $stm_list[0]);
                }
            }else if($diff > 0){
                if($to_datetime == $current_date){
                    // past days.......................................// ($to_datetime = 2020-09-08 00:00:00, $from_datetime= 2020-09-06 00:00:00)
                    $result_async_from_db1 = array();
                    $stm_list = $qb_obj->get_statement($to_datetime, $from_datetime, $token, 'day', 'co_occur', $co_occur_option);
                    $result_async_from_db1 = $db_object->executeAsync_query($stm_list[1], $stm_list[0]);
                    // For current Day............................... $to_datetime = 2020-09-08 00:00:00
                    // past hours(hour table)
                    $result_async_from_db2 = array();
                    $stm_list = $qb_obj->get_statement($to_datetime, $from_datetime, $token, 'hour', 'co_occur', $co_occur_option);
                    $result_async_from_db2 = $db_object->executeAsync_query($stm_list[1], $stm_list[0]);
                    // and current hour(10sec table)
                    $result_async_from_db3 = array();
                    $current_datetime_obj = new DateTime();
                    $to_datetime = $current_datetime_obj->format('Y-m-d H:i:s'); //2020-09-08 21:44:40
                    $from_datetime = ($current_datetime_obj->format('Y-m-d H')). ':00:00'; //2020-09-08 21:44:40
                    $stm_list = $qb_obj->get_statement($to_datetime, $from_datetime, $token, '10sec', 'co_occur', $co_occur_option);
                    $result_async_from_db3 = $db_object->executeAsync_query($stm_list[1], $stm_list[0]);

                    $result_async_from_db = array_merge($result_async_from_db1, $result_async_from_db2, $result_async_from_db3);                    
                }else{
                    // /($to_datetime = 2020-09-07 00:00:00, $from_datetime= 2020-09-01 00:00:00)
                    $stm_list = $qb_obj->get_statement($to_datetime, $from_datetime, $token, 'day', 'co_occur', $co_occur_option);
                    $result_async_from_db = $db_object->executeAsync_query($stm_list[1], $stm_list[0]);
                }
            }else{
                echo "nothing";
            }
        }
     
        foreach ($result_async_from_db as $rows) {
            foreach ($rows as $row) {
                $tn2 = $row['token_name2'];
                $ar_sum = array_sum($row['count_list']->values());
                if (array_key_exists($tn2, $temp_arr)) {
                    $temp_arr[$tn2] += $ar_sum;
                } else {
                    $temp_arr[$tn2] = $ar_sum;
                }
                $total += $ar_sum;
            }
        }
        arsort($temp_arr);

        if ($need_to_store) {
            if ($file_path) {
                $ut_obj->write_to_file('csv', $file_path, $temp_arr, $token, $userID);
            } else {
                $file_path = "common/" . $token . "_" . $co_occur_option . ".csv";
            }
            $ut_obj->write_to_file('csv', $file_path, $temp_arr, $token);
            return (array('status' => 'success', 'nodes' => sizeof($temp_arr)));
        } else {
            if ($data_formatter) {
                foreach ($temp_arr as $key => $value) {
                    if ($co_occur_option == 'mention') {
                        array_push($final_result, array("handle" => $key, "count" => intval($value)));
                    } else if ($co_occur_option == 'hashtag') {
                        array_push($final_result, array("hashtag" => $key, "count" => intval($value)));
                    } else if ($co_occur_option == 'user') {
                        array_push($final_result, array("handle" => $key, "count" => intval($value)));
                        /* Conversion of $uid to user_name and user_screen_name
                        ..............................................................remain
                        */
                    }
                }
                return ($final_result);
            } else {
                $final_result["range_type"] = $range_type;
                $final_result["chart_type"] = "co_occur";
                $final_result["data"] = $temp_arr;
                return ($final_result);
            }
        }
    }



    /**
     * Get data for top #tag, @mention, user
     *
     * @return json
     */
    public function get_top_data($to_datetime = null, $from_datetime = null, $top_option = null, $limit = 50, $token = null, $range_type=null)
    {
        $db_object = new DBmodelAsync;
        $db_object_not_async = new DBmodel;
        $qb_obj = new QB;
        $ut_obj = new Ut;
        $final_result = array();        

        if($range_type){           
            $stm_list = $qb_obj->get_statement($to_datetime, $from_datetime, $token, $range_type, $top_option);
            $result_async_from_db = $db_object->executeAsync_query($stm_list[1], $stm_list[0]);           
        }else{
            $diff = $ut_obj->get_difference_between_two_datetime($to_datetime, $from_datetime, 'day');
            $current_date = $ut_obj->get_current_date_time($option='datetime000');
            if($diff == 0){
                if((($ut_obj->separate_date_time($to_datetime))[1] != '00:00:00') and (($ut_obj->separate_date_time($from_datetime))[1] != '00:00:00')){
                    // 10sec ($to_datetime = 2020-09-08 10:30:10, $from_datetime= 2020-09-08 10:00:10)
                    $stm_list = $qb_obj->get_statement($to_datetime, $from_datetime, $token, '10sec', $top_option);
                    $result_async_from_db = $db_object->executeAsync_query($stm_list[1], $stm_list[0]);                    
                }else if($to_datetime == $current_date){
                    // past hours(hour table) ($to_datetime = 2020-09-08 00:00:00, $from_datetime= 2020-09-08 00:00:00)
                    $result_async_from_db1 = array();
                    $stm_list = $qb_obj->get_statement($to_datetime, $from_datetime, $token, 'hour', $top_option);
                    $result_async_from_db1 = $db_object->executeAsync_query($stm_list[1], $stm_list[0]);
                    $result_async_from_db2 = array(); 
                    // and current hour(10sec table)
                    $current_datetime_obj = new DateTime();
                    $to_datetime = $current_datetime_obj->format('Y-m-d H:i:s'); //2020-09-08 21:44:40
                    $from_datetime = ($current_datetime_obj->format('Y-m-d H')). ':00:00'; //2020-09-08 21:44:40
                    $stm_list = $qb_obj->get_statement($to_datetime, $from_datetime, $token, '10sec', $top_option);
                    $result_async_from_db2 = $db_object->executeAsync_query($stm_list[1], $stm_list[0]);

                    $result_async_from_db = array_merge($result_async_from_db1, $result_async_from_db2);                    
                }else{
                    // ($to_datetime = 2020-09-06 00:00:00, $from_datetime= 2020-09-06 00:00:00)
                    $stm_list = $qb_obj->get_statement($to_datetime, $from_datetime, $token, 'day', $top_option);
                    $result_async_from_db = $db_object->executeAsync_query($stm_list[1], $stm_list[0]);
                }
            }else if($diff > 0){
                if($to_datetime == $current_date){
                    // past days.......................................// ($to_datetime = 2020-09-08 00:00:00, $from_datetime= 2020-09-06 00:00:00)
                    $result_async_from_db1 = array();
                    $stm_list = $qb_obj->get_statement($to_datetime, $from_datetime, $token, 'day', $top_option);
                    $result_async_from_db1 = $db_object->executeAsync_query($stm_list[1], $stm_list[0]);
                    // For current Day............................... $to_datetime = 2020-09-08 00:00:00
                    // past hours(hour table)
                    $result_async_from_db2 = array();
                    $stm_list = $qb_obj->get_statement($to_datetime, $from_datetime, $token, 'hour', $top_option);
                    $result_async_from_db2 = $db_object->executeAsync_query($stm_list[1], $stm_list[0]);
                    // and current hour(10sec table)
                    $result_async_from_db3 = array();
                    $current_datetime_obj = new DateTime();
                    $to_datetime = $current_datetime_obj->format('Y-m-d H:i:s'); //2020-09-08 21:44:40
                    $from_datetime = ($current_datetime_obj->format('Y-m-d H')). ':00:00'; //2020-09-08 21:44:40
                    $stm_list = $qb_obj->get_statement($to_datetime, $from_datetime, $token, '10sec', $top_option);
                    $result_async_from_db3 = $db_object->executeAsync_query($stm_list[1], $stm_list[0]);

                    $result_async_from_db = array_merge($result_async_from_db1, $result_async_from_db2, $result_async_from_db3);                    
                }else{
                    // /($to_datetime = 2020-09-07 00:00:00, $from_datetime= 2020-09-01 00:00:00)
                    $stm_list = $qb_obj->get_statement($to_datetime, $from_datetime, $token, 'day', $top_option);
                    $result_async_from_db = $db_object->executeAsync_query($stm_list[1], $stm_list[0]);
                }
            }else{
                echo "nothing";
            }
        }

        $hash_arr = array();
        $hash_cat_arr = array();
        foreach ($result_async_from_db as $rows) {
            foreach ($rows as $row) {
                $tn2 = $row['token_name'];
                $count_list = $row['count_list']->values();
                $ar_sum = array_sum($count_list);
                $com = $count_list[3] + $count_list[4] + $count_list[5];
                $sec = $count_list[6] + $count_list[7] + $count_list[8];
                $com_sec = $count_list[9] + $count_list[10] + $count_list[11];
                $non_com_sec = $count_list[0] + $count_list[1] + $count_list[2];
                if (array_key_exists($tn2, $hash_arr)) {
                    $hash_arr[$tn2] += $ar_sum;
                    $hash_cat_arr[$tn2][0] += $com;
                    $hash_cat_arr[$tn2][1] += $sec;
                    $hash_cat_arr[$tn2][2] += $com_sec;
                    $hash_cat_arr[$tn2][3] += $non_com_sec;
                } else {
                    $hash_arr[$tn2] = $ar_sum;
                    $hash_cat_arr[$tn2] = array($com, $sec, $com_sec, $non_com_sec);
                }
            }
        }

        arsort($hash_arr);
        foreach ($hash_arr as $h => $v) {
            $index_max = array_search(max($hash_cat_arr[$h]), $hash_cat_arr[$h]);
            $cat = -1;
            switch ($index_max) {
                case 0:
                    $cat = 'com';
                    break;
                case 1:
                    $cat = 'sec';
                    break;
                case 2:
                    $cat = 'com_sec';
                    break;
                case 3:
                    $cat = 'normal';
                    break;
            }
            // $hash_arr[$h] = array($v, $cat, $hash_cat_arr[$h]);
            $hash_arr[$h] = array($v, $cat);
        }
        $final_result["chart_type"] = "top";
        $final_result["data"] = array_slice($hash_arr, 0, $limit);
        return ($final_result);
    }


    /**
     * get tweet ids list based on query
     *
     * @return json
     */
    public function get_tweets($to_datetime = null, $from_datetime = null, $token = null, $range_type = null, $filter_type=null)
    {
        $index_arr = array();
        if($filter_type)
            $index_arr = $this->get_index_arr_of_category($filter_type);
        $db_object = new DBmodelAsync;
        $db_object_not_async = new DBmodel;
        $qb_obj = new QB;
        $ut_obj = new Ut;
        $final_result = array();
    
        // $stm_list_10sec = $qb_obj->get_statement($to_datetime, $from_datetime, $token, '10sec', 'tweet');
        if($range_type){
            $stm_list = $qb_obj->get_statement($to_datetime, $from_datetime, $token, $range_type, 'tweet');
            $result_async_from_db = $db_object->executeAsync_query($stm_list[1], $stm_list[0]);
        }else{
            $diff = $ut_obj->get_difference_between_two_datetime($to_datetime, $from_datetime, 'day');
            $current_date = $ut_obj->get_current_date_time($option='datetime000');
            if($diff == 0){
                if((($ut_obj->separate_date_time($to_datetime))[1] != '00:00:00') and (($ut_obj->separate_date_time($from_datetime))[1] != '00:00:00')){
                    // 10sec ($to_datetime = 2020-09-08 10:30:10, $from_datetime= 2020-09-08 10:00:10)
                    $stm_list = $qb_obj->get_statement($to_datetime, $from_datetime, $token, '10sec', 'tweet');
                    $result_async_from_db = $db_object->executeAsync_query($stm_list[1], $stm_list[0]);                    
                }else if($to_datetime == $current_date){
                    // past hours(hour table) ($to_datetime = 2020-09-08 00:00:00, $from_datetime= 2020-09-08 00:00:00)
                    $result_async_from_db1 = array();
                    $stm_list = $qb_obj->get_statement($to_datetime, $from_datetime, $token, 'hour', 'tweet');
                    $result_async_from_db1 = $db_object->executeAsync_query($stm_list[1], $stm_list[0]);
                    $result_async_from_db2 = array(); 
                    // and current hour(10sec table)
                    $current_datetime_obj = new DateTime();
                    $to_datetime = $current_datetime_obj->format('Y-m-d H:i:s'); //2020-09-08 21:44:40
                    $from_datetime = ($current_datetime_obj->format('Y-m-d H')). ':00:00'; //2020-09-08 21:44:40
                    $stm_list = $qb_obj->get_statement($to_datetime, $from_datetime, $token, '10sec', 'tweet');
                    $result_async_from_db2 = $db_object->executeAsync_query($stm_list[1], $stm_list[0]);

                    $result_async_from_db = array_merge($result_async_from_db1, $result_async_from_db2);                    
                }else{
                    // ($to_datetime = 2020-09-06 00:00:00, $from_datetime= 2020-09-06 00:00:00)
                    $stm_list = $qb_obj->get_statement($to_datetime, $from_datetime, $token, 'day', 'tweet');
                    $result_async_from_db = $db_object->executeAsync_query($stm_list[1], $stm_list[0]);
                }
            }else if($diff > 0){
                if($to_datetime == $current_date){
                    // past days.......................................// ($to_datetime = 2020-09-08 00:00:00, $from_datetime= 2020-09-06 00:00:00)
                    $result_async_from_db1 = array();
                    $stm_list = $qb_obj->get_statement($to_datetime, $from_datetime, $token, 'day', 'tweet');
                    $result_async_from_db1 = $db_object->executeAsync_query($stm_list[1], $stm_list[0]);
                    // For current Day............................... $to_datetime = 2020-09-08 00:00:00
                    // past hours(hour table)
                    $result_async_from_db2 = array();
                    $stm_list = $qb_obj->get_statement($to_datetime, $from_datetime, $token, 'hour', 'tweet');
                    $result_async_from_db2 = $db_object->executeAsync_query($stm_list[1], $stm_list[0]);
                    // and current hour(10sec table)
                    $result_async_from_db3 = array();
                    $current_datetime_obj = new DateTime();
                    $to_datetime = $current_datetime_obj->format('Y-m-d H:i:s'); //2020-09-08 21:44:40
                    $from_datetime = ($current_datetime_obj->format('Y-m-d H')). ':00:00'; //2020-09-08 21:44:40
                    $stm_list = $qb_obj->get_statement($to_datetime, $from_datetime, $token, '10sec', 'tweet');
                    $result_async_from_db3 = $db_object->executeAsync_query($stm_list[1], $stm_list[0]);

                    $result_async_from_db = array_merge($result_async_from_db1, $result_async_from_db2, $result_async_from_db3);                    
                }else{
                    // /($to_datetime = 2020-09-07 00:00:00, $from_datetime= 2020-09-01 00:00:00)
                    $stm_list = $qb_obj->get_statement($to_datetime, $from_datetime, $token, 'day', 'tweet');
                    $result_async_from_db = $db_object->executeAsync_query($stm_list[1], $stm_list[0]);
                }
            }else{
                echo "nothing";
            }
        }

        $tweet_id_list = array();
        $i = 0;       
        foreach ($result_async_from_db as $rows) {
            foreach ($rows as $row) {        
                $tweet_list = $row['tweetidlist']->values();   
                $i = 0;
                foreach ($tweet_list as $t) {   
                    if($filter_type){   
                        if(in_array($i, $index_arr)){
                            $tweet_l = $t->values();
                            foreach ($tweet_l as $t1) {
                                if ($t1 != "0") {
                                    array_push($tweet_id_list, $t1);
                                }
                            }
                        }
                    }else{
                        $tweet_l = $t->values();
                        foreach ($tweet_l as $t1) {
                            if ($t1 != "0") {
                                array_push($tweet_id_list, $t1);
                            }
                        }
                    }
                    $i++;
                }
            }
        }
        $final_result["range_type"] = $range_type;
        $final_result["chart_type"] = "tweet";
        $final_result["data"] = $tweet_id_list;
        return ($final_result);
    }


   

    /**
     * get tweet info given by tweet_id_list
     *
     * @return json
     */
    public function get_tweets_info($tweet_id_list)
    {
        $ut_obj = new Ut;
        $qb_obj = new QB;
        $db_object = new DBmodelAsync;

        $final_result = array();
        $stm_list = $qb_obj->get_statement(null, null, null, null, $feature_option='tweet_info', null, $async=true, null, $id_list=$tweet_id_list);        
        $result_async_from_db = $db_object->executeAsync_query($stm_list[1], $stm_list[0]);
        foreach ($result_async_from_db as $rows) {
            foreach ($rows as $row) {
                $media_list_temp = array();
                $media_list = $row["media_list"];
                $c = $row["category"];
                // for category                
                if(($c == 11) or ($c == 12) or ($c == 13))
                    $category = 'com';
                else if(($c == 101) or ($c == 102) or ($c == 103))
                    $category = 'sec';
                else if(($c == 111) or ($c == 112) or ($c == 113))
                    $category = 'com_sec';  
                else if(($c == 1) or ($c == 2) or ($c == 3))
                    $category = 'normal';
                // ******
                if (!is_null($media_list)) {
                    foreach ($media_list as $m) {
                        array_push($media_list_temp, array($m["media_type"], $m["media_url"]));
                    }
                }
                $datetime_str = $ut_obj->get_date_time_from_cass_date_obj($row["datetime"], 'Y-m-d H:i:s');
                $datetime_str = $ut_obj->convert_utc_datetime_to_local_datetime($datetime_str);
                $temp_arr = array("t_location" => $row["t_location"], "datetime" => $datetime_str, "tid" => $row["tid"], "author" => $row["author"], "author_id" => $row["author_id"], "author_profile_image" => $row["author_profile_image"], "author_screen_name" => $row["author_screen_name"], "sentiment" => $row["sentiment"]->value(), "quoted_source_id" => $row["quoted_source_id"], "tweet_text" => $row["tweet_text"], "retweet_source_id" => $row["retweet_source_id"], "media_list" => $media_list_temp, "type" => $row["type"], "category" => $category);
                array_push($final_result, $temp_arr);
            }
        }
        echo json_encode($final_result);    
    }


    /**
     * get user_info by user_id/user_id_list
     *
     * @return json
     */
    public function get_user_info($user_id_list=null, $async=true){
        $final_res = array();
        $ut_obj = new Ut;
        $qb_obj = new QB;
        $db_object = new DBmodelAsync;
        $dbmodel_object = new DBmodel;
        if($async){
            // echo json_encode($user_id_list);
            // user_id_list = ['$821712536215362', '$82171253621542']
            $stm_list = $qb_obj->get_statement(null, null, null, null, $feature_option='user_info', null, $async=true, null, $id_list=$user_id_list);        
            $result_async_from_db = $db_object->executeAsync_query($stm_list[1], $stm_list[0]);
            foreach ($result_async_from_db as $rows) {             
                foreach ($rows as $row) {
                    $author_name = null;
                    array_push($final_res,array('$'.$row['author_id'],$row["author"], $row["author_screen_name"], $row["profile_image_url_https"]));
                }
            }     
        }else{
            // here user_id_list is user_id, this is not list , user_id_list = '$821712536215362'
            $stm_list = $qb_obj->get_statement(null, null, $user_id_list, null, $feature_option='user_info', null, $async=false);
            $final_res = $dbmodel_object->execute_query_first_require($stm_list[0]); // return StdClass() object
        } 
        return json_encode($final_res); //converted array to string json;
    }


    /**
     * dataformattor(for chart) for co-occur
     *
     * @return json
     */ 
    public function data_formatter_for_co_occur($token=null, $option=null, $limit=null, $unique_id=null, $file_path=null,$userID=null)
    {
        $ut_obj = new Ut;
        $final_res = array();
        if($token){
            $file_path = "common/" . $token . "_" . $option . ".csv";
        }else if ($unique_id) {
            // get directory name after user_login
            $filename = $unique_id;
            $file_path = "$userID/$filename.csv";
        }
        if($limit)
            $res = $ut_obj->read_file('csv', $file_path, $limit);
        else    
            $res = $ut_obj->read_file('csv', $file_path);
        $i = 0;            
        foreach ($res as $line) {
            if ($i == 0) {
                $i++;
                continue;
            }
            if ($option == 'mention') {
                array_push($final_res, array("handle" => $line[1], "count" => intval($line[2])));
            } else if ($option == 'hashtag') {
                array_push($final_res, array("hashtag" => $line[1], "count" => intval($line[2])));
            } else if ($option == 'user') {
                $uid_info_arr = json_decode($this->get_user_info($line[1], false)); //converted string StdClass() object to StdClass() object;
                // {"author_id":"955979293615587330","author":"Emmanuel Batman \ud83c\udde6\ud83c\uddf7\ud83d\udc0d","author_screen_name":"EmmanuelBatman_","profile_image_url_https":"https:\/\/pbs.twimg.com\/profile_images\/1299482928007831552\/alqHQyCP_normal.jpg"}
                // echo $uid_info_arr->{'author'};
                array_push($final_res, array("id"=>$line[1], "count"=>intval($line[2]), "author"=> $uid_info_arr->{'author'}, "handle" =>  $uid_info_arr->{'author_screen_name'}));
            }
        }
        return ($final_res);
    }



    /**
     * get top info(hashtag, mention, user) based on lat, lng search by location(country, state, city)
     *
     * @return json
    */ 
    public function get_top_data_lat_lng($to_datetime = null, $from_datetime = null, $top_option = null, $token = null, $range_type=null)
    {
        $final_res = array();
        $ut_obj = new Ut;
        $qb_obj = new QB;
        $db_object = new DBmodelAsync;
        $dbmodel_object = new DBmodel;

        if($range_type){         
            $stm_list = $qb_obj->get_statement($to_datetime, $from_datetime, $token, $range_type, $top_option);
            $result_async_from_db = $db_object->executeAsync_query($stm_list[1], $stm_list[0]);  
        }else{
            //remain
        }

        $lat_lng_hash_arr = array();
        $hash_lat_lng_total_cat_info_arr = array();
        $lat_lng_info_arr = array();

        foreach ($result_async_from_db as $rows) {             
            foreach ($rows as $row) {
                $tn = $row['token_name'];
                $count_list = $row['count_list']->values();
                $ar_sum = array_sum($count_list);
                $lat = $row['tweet_cl_latitude'];
                $lng = $row['tweet_cl_longitude'];
                $lat_lng = $lat.'_'.$lng;
                $com = $count_list[3] + $count_list[4] + $count_list[5];
                $sec = $count_list[6] + $count_list[7] + $count_list[8];
                $com_sec = $count_list[9] + $count_list[10] + $count_list[11];
                $non_com_sec = $count_list[0] + $count_list[1] + $count_list[2];
                if (array_key_exists($lat_lng, $lat_lng_hash_arr)) {
                    if (!(in_array($tn, $lat_lng_hash_arr[$lat_lng]))) //for uniqueness
                        array_push($lat_lng_hash_arr[$lat_lng], $tn);
                } else {
                    $lat_lng_hash_arr[$lat_lng] = array($tn);
                }

                if (array_key_exists($lat_lng, $lat_lng_info_arr)) {
                   
                } else {
                    $lat_lng_info_arr[$lat_lng] = array($row['country'], $row['state'], $row['city']);
                }

                if (array_key_exists($tn, $hash_lat_lng_total_cat_info_arr)) {
                    if(array_key_exists($lat_lng, $hash_lat_lng_total_cat_info_arr[$tn])){
                        $hash_lat_lng_total_cat_info_arr[$tn][$lat_lng][0] += $ar_sum;
                        $hash_lat_lng_total_cat_info_arr[$tn][$lat_lng][1] += $com;
                        $hash_lat_lng_total_cat_info_arr[$tn][$lat_lng][2] += $sec;
                        $hash_lat_lng_total_cat_info_arr[$tn][$lat_lng][3] += $com_sec;
                        $hash_lat_lng_total_cat_info_arr[$tn][$lat_lng][4] += $non_com_sec;
                    }else{
                        $hash_lat_lng_total_cat_info_arr[$tn][$lat_lng] = array($ar_sum, $com, $sec, $com_sec, $non_com_sec);
                    }          
                } else {
                    $hash_lat_lng_total_cat_info_arr[$tn] = array($lat_lng => array($ar_sum, $com, $sec, $com_sec, $non_com_sec));
                }
            }
        }   

        $final_result["chart_type"] = "top_lat_lng_hash";
        $final_result["lat_lng_info_arr"] = $lat_lng_info_arr;
        $final_result["lat_lng_hash_arr"] = $lat_lng_hash_arr;
        $final_result["hash_lat_lng_total_cat_info_arr"] = $hash_lat_lng_total_cat_info_arr;
        return ($final_result);
    }



    /**
     * get top info(hashtag, mention, user) with category info search by location(country, state, city)
     *
     * @return json
    */ 
    public function get_top_data_cat_by_location($to_datetime = null, $from_datetime = null, $top_option = null, $token = null, $range_type=null)
    {
        $final_res = array();
        $ut_obj = new Ut;
        $qb_obj = new QB;
        $db_object = new DBmodelAsync;
        $dbmodel_object = new DBmodel;

        if($range_type){         
            $stm_list = $qb_obj->get_statement($to_datetime, $from_datetime, $token, $range_type, $top_option);
            $result_async_from_db = $db_object->executeAsync_query($stm_list[1], $stm_list[0]);  
        }else{

        }


        $top_data_with_cat_location = array();
       

        foreach ($result_async_from_db as $rows) {             
            foreach ($rows as $row) {
                $tn = $row['token_name'];
                $count_list = $row['count_list']->values();
                $ar_sum = array_sum($count_list);
                $lat = $row['tweet_cl_latitude'];
                $lng = $row['tweet_cl_longitude'];
                $lat_lng = $lat.'_'.$lng;
                $com = $count_list[3] + $count_list[4] + $count_list[5];
                $sec = $count_list[6] + $count_list[7] + $count_list[8];
                $com_sec = $count_list[9] + $count_list[10] + $count_list[11];
                $non_com_sec = $count_list[0] + $count_list[1] + $count_list[2];

                if (array_key_exists($tn, $top_data_with_cat_location)) {
                    $top_data_with_cat_location[$tn][0] += $ar_sum;
                    $top_data_with_cat_location[$tn][1] += $com;
                    $top_data_with_cat_location[$tn][2] += $sec;
                    $top_data_with_cat_location[$tn][3] += $com_sec;
                    $top_data_with_cat_location[$tn][4] += $non_com_sec;         
                } else {
                    $top_data_with_cat_location[$tn] = array($ar_sum, $com, $sec, $com_sec, $non_com_sec);
                }
            }
        }   

        arsort($top_data_with_cat_location);
        foreach ($top_data_with_cat_location as $h => $v) {           
            $cat_arr_tmp = array($v[1], $v[2], $v[3], $v[4]);
            $index_max = array_search(max($cat_arr_tmp), $cat_arr_tmp);
            $cat = -1;
            switch ($index_max) {
                case 0:
                    $cat = 'com';
                    break;
                case 1:
                    $cat = 'sec';
                    break;
                case 2:
                    $cat = 'com_sec';
                    break;
                case 3:
                    $cat = 'normal';
                    break;
            }
            // $top_data_with_cat_location[$h] = array($v[0], $cat, $v);
            $top_data_with_cat_location[$h] = array($v[0], $cat); //total, category
        }

        $final_result["chart_type"] = "top_data_with_cat";
        $final_result["top_data_with_cat_by_location"] = $top_data_with_cat_location;
        return ($final_result);
    }



    public function get_index_arr_of_category($filter_type){
        if($filter_type == 'com'){
            $index_arr = [3, 4, 5];                            
        }else if($filter_type == 'sec'){
            $index_arr = [6, 7, 8];
        }else if($filter_type == 'com_sec'){
            $index_arr = [9, 10, 11];
        }else if($filter_type == 'normal'){
            $index_arr = [0, 1, 2];
        }else if($filter_type == 'pos'){
            $index_arr = [0, 3, 6, 9];
        }else if($filter_type == 'neg'){
            $index_arr = [1, 4, 7, 10];
        }else if($filter_type == 'neu'){
            $index_arr = [2, 5, 8, 11];
        }else if($filter_type == 'all'){
            $index_arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        }

        return $index_arr;
    }



    /**
     * generate network and write the file as csv
     *
     * @return 'success'
    */ 
    public function gen_network(){
        $ut_obj = new Ut;
        $token = '@ndtv';
        $from_datetime='2020-09-15 00:00:00';
        $to_datetime='2020-09-15 00:00:00';
        $feature_option = 'co_occur';
        $co_occur_option = 'hashtag';
        $no_of_nodes = '50';
        $framework = 'networkx';
        $nodes = array();
        $edges = array();
        // 1st level
        $co_occur_result = $this->get_co_occur_data($to_datetime, $from_datetime, $token, $range_type = null, $co_occur_option);
        if($no_of_nodes)
            $co_occur_result = array_slice($co_occur_result['data'], 0, $no_of_nodes);

        // push node to nodes array
        foreach ($co_occur_result as $key => $value) {
            array_push($nodes, $key);
        }

        // 2nd level
        $i=0;
        foreach($co_occur_result as $key => $count){
            $edges[] = [$token, $key, (string) $count];
            $co_occur_result_2nd_level = $this->get_co_occur_data($to_datetime, $from_datetime, $key, $range_type = null, $co_occur_option);
            if($no_of_nodes)
                $co_occur_result_2nd_level = array_slice($co_occur_result_2nd_level['data'], 0, $no_of_nodes);
            foreach ($co_occur_result_2nd_level as $k => $c) {
                // creating among connection
                if (in_array($k, $nodes)) {
                    $edges[] = [$key, $k, (string) $c]; 
                }
            }
            // echo (new DateTime())->format('y-m-d H:i:s');
            echo $i;
            $i += 1;
            echo "    ";
            ob_flush();
            flush();
            sleep(2);
        }

        // write to file
        $ut_obj->write_to_file($file_type='csv', $file_path='2/test_narendramodi_hashtag.csv', $edges, $token=null, $userID=2);
        echo json_encode(array('res'=>'success'));
    }
}
