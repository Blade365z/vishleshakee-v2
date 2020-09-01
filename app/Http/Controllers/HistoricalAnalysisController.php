<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Library\QueryBuilder as QB;
use App\Library\Utilities as Ut;
use App\DBModel\DBmodel;
use App\DBModel\DBmodelAsync;

use DateInterval;
use DateTime;
use DatePeriod;
use Cassandra;

class HistoricalAnalysisController extends Controller
{
    private $total_main_category = 4; // not_sec_com(included pos, neg, neu), security(included pos, neg, neu), communal(included pos, neg, neu), sec_com(included pos, neg, neu)  
    public function get_frequency_distribution_data_ha()
    {
        $token = $_GET['query'];
        $from_datetime = $_GET['from_datetime'];
        $to_datetime = $_GET['to_datetime'];
        $range_type = $_GET['range_type'];
        return $this->get_frequency_distribution_data($to_datetime, $from_datetime, $token, $range_type, false, true);
    }
    
    public function get_sentiment_distribution_data_ha()
    {
        $token = $_GET['query'];
        $from_datetime = $_GET['from_datetime'];
        $to_datetime = $_GET['to_datetime'];
        $range_type = $_GET['range_type'];
        return $this->get_sentiment_distribution_data($to_datetime, $from_datetime, $token, $range_type);
    }
    
    public function get_co_occur_data_ha()
    {
        $token = $_GET['query'];
        $from_datetime = $_GET['from_datetime'];
        $to_datetime = $_GET['to_datetime'];
        $range_type = $_GET['range_type'];
        $co_occur_option = $_GET['co_occur_option'];
        // $unique_id = $_GET['unique_id'];
        // get directory name after user_login ....
        // $file_path = "directory_name/$unique_id.csv";
        $file_path = "common/".$token."_".$co_occur_option.".csv";
        return $this->get_co_occur_data($to_datetime, $from_datetime, $token, $range_type, $co_occur_option, $file_path, true);
    }
    
    
    public function get_top_data_ha()
    {
        $token = null;
        if(isset($_GET['query']))
            $token = $_GET['query'];
        $from_datetime = $_GET['from_datetime'];
        $to_datetime = $_GET['to_datetime'];
        // $range_type = $_GET['range_type'];
        $limit = $_GET['limit'];
        $top_option = $_GET['top_option'];
        return $this->get_top_data($to_datetime, $from_datetime, $top_option, $limit, $token);
    }
    
    
    public function get_tweets_ha()
    {
        $token = null;
        if(isset($_GET['query']))
            $token = $_GET['query'];
        $from_datetime = $_GET['from_datetime'];
        $to_datetime = $_GET['to_datetime'];
        $range_type = $_GET['range_type'];
        return $this->get_tweets($to_datetime, $from_datetime, $token, $range_type);
    }
    
    
    /**
     * Get data for frequency Distribution
     *
     * @return json
     */
    public function get_frequency_distribution_data_old($to_datetime=null, $from_datetime=null, $token=null, $range_type=null)
    {
        $db_object = new DBmodelAsync;
        $db_object_not_async = new DBmodel;
        $qb_obj = new QB;
        $ut_obj = new Ut;
        $final_result = array();
        $stm_list = $qb_obj->get_statement($to_datetime, $from_datetime, $token, $range_type, 'freq');
        $temp_arr = array();
        if ($range_type == "10sec") {
            $result_async_from_db = $db_object->executeAsync_query($stm_list[1], $stm_list[0]);
            foreach ($result_async_from_db as $rows) {
                foreach ($rows as $row) {
                    $t = $row['created_date'];
                    $datetime1 = $ut_obj->get_date_time_from_cass_date_obj($t, "Y-m-d") . ' ' . $row['created_time'];
                    $ar_sum = array_sum($row['count_list']->values());
                    array_push($temp_arr, array($datetime1, $ar_sum));
                }
            }
        } 
        
        $final_result["range_type"] = $range_type;
        $final_result["chart_type"] = "freq_dist";
        $final_result["data"] = $temp_arr;
        return json_encode($final_result);
    }
    
    
    /**
     * Get data for frequency Distribution
     *
     * @return json
     */
    public function get_frequency_distribution_data($to_datetime=null, $from_datetime=null, $token=null, $range_type=null, $category_info_total=false, $category_info_details=false)
    {
        $db_object = new DBmodelAsync;
        $db_object_not_async = new DBmodel;
        $qb_obj = new QB;
        $ut_obj = new Ut;
        $final_result = array();
        $stm_list = $qb_obj->get_statement($to_datetime, $from_datetime, $token, $range_type, 'freq');
        $temp_arr = array();
        $total = 0;
        $total_com = 0;
        $total_sec = 0;
        $total_com_sec = 0;
        $total_non_com_sec = 0;
        if ($range_type == "10sec") {
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
                    if($category_info_details or $category_info_total){
                        $com += $count_list[3]+$count_list[4]+$count_list[5];
                        $sec += $count_list[6]+$count_list[7]+$count_list[8];
                        $com_sec += $count_list[9]+$count_list[10]+$count_list[11];
                        $non_com_sec += $count_list[0]+$count_list[1]+$count_list[2];
                        array_push($temp_arr, array($datetime1, $ar_sum, $com, $sec, $com_sec, $non_com_sec));
                        $total_com += $com;
                        $total_sec += $sec;
                        $total_com_sec += $com_sec;
                        $total_non_com_sec += $non_com_sec;
                    }else{
                        array_push($temp_arr, array($datetime1, $ar_sum));
                    }
                }
            }
        } 
        
       
        $final_result["range_type"] = $range_type;
        $final_result["chart_type"] = "freq_dist";
        if($category_info_details or $category_info_total){
            if($category_info_details){
                $final_result["data"] = $temp_arr;
            }
            $final_result["com"] = $total_com;
            $final_result["sec"] = $total_sec;
            $final_result["com_sec"] = $total_com_sec;
            $final_result["normal"] = $total_non_com_sec;
            $final_result["total"] = $total_com + $total_sec + $total_com_sec + $total_non_com_sec;
        }else{
            $final_result["data"] = $temp_arr;
        }
        return ($final_result);
    }
    
    
    /**
     * Get data for sentiment Distribution
     *
     * @return json
     */
    public function get_sentiment_distribution_data($to_datetime=null, $from_datetime=null, $token=null, $range_type=null)
    {
        $db_object = new DBmodelAsync;
        $db_object_not_async = new DBmodel;
        $qb_obj = new QB;
        $ut_obj = new Ut;
        $final_result = array();
        $stm_list = $qb_obj->get_statement($to_datetime, $from_datetime, $token, $range_type, 'sent');
        $temp_arr = array();
        if ($range_type == "10sec") {
            $result_async_from_db = $db_object->executeAsync_query($stm_list[1], $stm_list[0]);
            foreach ($result_async_from_db as $rows) {
                $datetime1 = Null;
                $pos = 0;
                $neg = 0;
                $neu = 0;
                foreach ($rows as $row) {
                    $t = $row['created_date'];
                    $datetime1 = $ut_obj->get_date_time_from_cass_date_obj($t, "Y-m-d") . ' ' . $row['created_time'];
                    $count_list = $row['count_list']->values();
                    // echo json_encode($count_list);
                    // echo "-------";
                    /*
                        pos index -> 0, 3, 6, 9
                        neg index -> 1, 4, 7, 10
                        neu index -> 2, 5, 8, 11
                        
                        pos -> 0*3+0=0, 1*3+0=3, 2*3+0=6, 3*3+0=9
                        neg -> 0*3+1=1, 1*3+1=4, 2*3+1=7, 3*3+1=10
                        neu -> 0*3+2=2, 1*3+2=5, 2*3+2=8, 3*3+2=11
                    */
                    for($i=0; $i<$this->total_main_category; $i++){
                      $pos += $count_list[($i*3) + 0];
                      $neg += $count_list[($i*3) + 1];
                      $neu += $count_list[($i*3) + 2];
                    }
                }
                if ($datetime1)
                    array_push($temp_arr, array($datetime1, $pos, $neg, $neu));
            }
        } 
        
        $final_result["range_type"] = $range_type;
        $final_result["chart_type"] = "sent_dist";
        $final_result["data"] = $temp_arr;
        return ($final_result);
    }
    
    
    /**
     * Get data for co-occur
     *
     * @return json
     */
    public function get_co_occur_data($to_datetime=null, $from_datetime=null, $token=null, $range_type=null, $co_occur_option=null, $file_path=null, $need_to_store=false, $data_formatter=false)
    {
        $db_object = new DBmodelAsync;
        $db_object_not_async = new DBmodel;
        $qb_obj = new QB;
        $ut_obj = new Ut;
        $final_result = array();
        $stm_list = $qb_obj->get_statement($to_datetime, $from_datetime, $token, $range_type, 'co_occur', $co_occur_option);

        $temp_arr = array();
        $total = 0;
        if ($range_type == "10sec") {
            $result_async_from_db = $db_object->executeAsync_query($stm_list[1], $stm_list[0]);
            foreach ($result_async_from_db as $rows) {
                foreach ($rows as $row) {
                    $tn2 = $row['token_name2'];
                    $ar_sum = array_sum($row['count_list']->values());
                    if(array_key_exists($tn2, $temp_arr)){
                        $temp_arr[$tn2] += $ar_sum;
                    }else{
                        $temp_arr[$tn2] = $ar_sum;
                    }
                    $total += $ar_sum;
                }
            }
        } 
        arsort($temp_arr);
        
        if($need_to_store){
            if($file_path){
                
            }else{
                $file_path="common/".$token."_".$co_occur_option.".csv";
            }
            $ut_obj->write_to_file('csv', $file_path, $temp_arr, $token);
            return (array('status'=>'success', 'nodes'=>sizeof($temp_arr)));
        }else{
            if($data_formatter){
                foreach($temp_arr as $key => $value){
                    if($co_occur_option == 'mention')
                        array_push($final_result, array("handle"=>$key, "count"=>intval($value)));
                    else if($co_occur_option == 'hashtag')
                        array_push($final_result, array("hashtag"=>$key, "count"=>intval($value)));
                    else if($co_occur_option == 'user'){
                        array_push($final_result, array("handle"=>$key, "count"=>intval($value)));
                        // $uid = ltrim($line[0], 1);
                        // $uid_info_arr = json_decode($this->get_user_details_by_user_id($uid)); //converted string json to array;
                        // // echo $uid_info_arr[0];
                        // array_push($final_result, array("id"=>$uid, "count"=>intval($line[1]), "author"=> $uid_info_arr[0], "author_screen_name" =>  $uid_info_arr[1], "profile_picture" => $uid_info_arr[2]));
                    }
                }
                return ($final_result);
            }else{
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
    public function get_top_data($to_datetime=null, $from_datetime=null, $top_option=null, $limit=50, $token=null)
    {
        $db_object = new DBmodelAsync;
        $db_object_not_async = new DBmodel;
        $qb_obj = new QB;
        $ut_obj = new Ut;
        $final_result = array();
        $stm_list_hour = null;
        $stm_list_10sec = null;
        $stm_list_day = null;
        
        $stm_list_10sec = $qb_obj->get_statement($to_datetime, $from_datetime, $token, '10sec', $top_option);
        // echo json_encode($stm_list_10sec);
        /*$todate = explode(" ", $to_datetime)[0];
        $fromdate = explode(" ", $from_datetime)[0];
        if(($todate == $fromdate) and ($todate == $ut_obj->get_current_date_time('date'))){
            $stm_list_hour = $qb_obj->get_statement($to_datetime, $from_datetime, $token, 'hour', $top_option);
            $stm_list_10sec = $qb_obj->get_statement($to_datetime, $from_datetime, $token, '10sec', $top_option);
        }else{
            $stm_list_day = $qb_obj->get_statement($to_datetime, $from_datetime, $token, 'day', $top_option);
            if($todate == $ut_obj->get_current_date_time('date')){
                $stm_list_hour = $qb_obj->get_statement($to_datetime, $from_datetime, $token, 'hour', $top_option);
                $stm_list_10sec = $qb_obj->get_statement($to_datetime, $from_datetime, $token, '10sec', $top_option);
            }
        }*/

       
        $hash_arr = array();
        $hash_cat_arr = array();
        if ($stm_list_10sec) {
            $result_async_from_db = $db_object->executeAsync_query($stm_list_10sec[1], $stm_list_10sec[0]);
            foreach ($result_async_from_db as $rows) {
                foreach ($rows as $row) {
                    $tn2 = $row['token_name'];
                    $count_list = $row['count_list']->values();
                    $ar_sum = array_sum($count_list);
                    $com = $count_list[3]+$count_list[4]+$count_list[5];
                    $sec = $count_list[6]+$count_list[7]+$count_list[8];
                    $com_sec = $count_list[9]+$count_list[10]+$count_list[11];
                    $non_com_sec = $count_list[0]+$count_list[1]+$count_list[2];
                    if(array_key_exists($tn2, $hash_arr)){
                        $hash_arr[$tn2] += $ar_sum;
                        $hash_cat_arr[$tn2][0] += $com;
                        $hash_cat_arr[$tn2][1] += $sec;
                        $hash_cat_arr[$tn2][2] += $com_sec;
                        $hash_cat_arr[$tn2][3] += $non_com_sec;
                    }else{
                        $hash_arr[$tn2] = $ar_sum;
                        $hash_cat_arr[$tn2] = array($com, $sec, $com_sec, $non_com_sec);
                    }
                }
            }
        } 
        
        arsort($hash_arr);
        foreach($hash_arr as $h => $v){
            $index_max = array_search(max($hash_cat_arr[$h]), $hash_cat_arr[$h]);
            $cat = -1;
            switch($index_max){
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
    
    /**s
     * get tweets based on query
     *
     * @return json
     */
    public function get_tweets($to_datetime=null, $from_datetime=null, $token=null,  $range_type=null){
        $db_object = new DBmodelAsync;
        $db_object_not_async = new DBmodel;
        $qb_obj = new QB;
        $ut_obj = new Ut;
        $final_result = array();
        $stm_list_hour = null;
        $stm_list_10sec = null;
        $stm_list_day = null;
        $stm_list_10sec = $qb_obj->get_statement($to_datetime, $from_datetime, $token, '10sec', 'tweet');
        $tweet_id_list = array();
        $i = 0;
        if ($range_type == "10sec") {
            $result_async_from_db = $db_object->executeAsync_query($stm_list_10sec[1], $stm_list_10sec[0]);
            foreach ($result_async_from_db as $rows) {
                foreach ($rows as $row) {
                    $tweet_list = $row['tweetidlist']->values();
                    // echo json_encode($tweet_list);
                    foreach($tweet_list as $t){
                        // echo json_encode($t->values());
                        $tweet_l =  $t->values();
                        foreach($tweet_l as $t1){
                            if($t1 != "0")
                                array_push($tweet_id_list, $t1);
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


     /**
     * get tweet info by tweet_id_list
     *
     * @return json
     */
    public function get_tweets_info()
    {
        $ut_obj = new Ut;
        $final_result = array();

        $prepared_statement = "SELECT t_location,datetime,tid,author,author_id,author_profile_image,author_screen_name,sentiment,quoted_source_id,tweet_text,retweet_source_id,media_list,type,category from tweet_info_by_id_test WHERE tid=?";
        $tweet_id_list = $_GET['tweet_id_list'];
        $input_args = array();
        foreach ($tweet_id_list as $value) {
            array_push($input_args, array($value));
        }

        $db_object = new DBmodelAsync;

        $result_async_from_db = $db_object->executeAsync_query($input_args, $prepared_statement,'raw');
        foreach ($result_async_from_db as $rows) {
            foreach ($rows as $row) {
                $media_list_temp = array();
                $media_list = $row["media_list"];
                if (!is_null($media_list)) {
                    foreach ($media_list as $m) {
                        array_push($media_list_temp, array($m["media_type"], $m["media_url"]));
                    }
                }

                $temp_arr = array("t_location" => $row["t_location"], "datetime" => $ut_obj->get_date_time_from_cass_date_obj($row["datetime"], 'Y-m-d H:i:s'), "tid" => $row["tid"], "author" => $row["author"], "author_id" => $row["author_id"], "author_profile_image" => $row["author_profile_image"], "author_screen_name" => $row["author_screen_name"], "sentiment" => $row["sentiment"]->value(), "quoted_source_id" => $row["quoted_source_id"], "tweet_text" => $row["tweet_text"], "retweet_source_id" => $row["retweet_source_id"], "media_list" => $media_list_temp, "type" =>  $row["type"]);
                array_push($final_result, $temp_arr);
            }
        }
        echo json_encode($final_result);
    }

    
    
    /**
     * dataformattor(for chart) for co-occur
     *
     * @return json
     */
    public function data_formatter_for_co_occur(Request $request){
        $ut_obj = new Ut;
        $final_res = array();
        $file_path = null;
        $option = $_GET['option'];
        $limit = $_GET['limit'];
        if (isset($_GET['query'])){
            $token  = $_GET['query'];
            $file_path = "common/".$token."_".$option.".csv";
        }
        else if (isset($_GET['unique_id'])){
            // get directory name after user_login
            $filename = $_GET['unique_id'];
            $file_path = "directory_name/$filename.csv";
        }
        $res = $ut_obj->read_file('csv',$file_path,$limit);
        $i = 0;
        foreach($res as $line){
            if($i == 0){
                $i++;
                continue;
            }
            if($option == 'mention')
                array_push($final_res, array("handle"=>$line[1], "count"=>intval($line[2])));
            else if($option == 'hashtag')
                array_push($final_res, array("hashtag"=>$line[1], "count"=>intval($line[2])));
            else if($option == 'user'){
                array_push($final_res, array("handle"=>$line[1], "count"=>intval($line[2])));
                // $uid = ltrim($line[0], 1);
                // $uid_info_arr = json_decode($this->get_user_details_by_user_id($uid)); //converted string json to array;
                // // echo $uid_info_arr[0];
                // array_push($final_res, array("id"=>$uid, "count"=>intval($line[1]), "author"=> $uid_info_arr[0], "author_screen_name" =>  $uid_info_arr[1], "profile_picture" => $uid_info_arr[2]));
            }
        }
        return json_encode($final_res);
    }
}