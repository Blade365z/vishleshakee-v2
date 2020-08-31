<?php
namespace App\Library;

use App\Library\Utilities as Ut;
// date_default_timezone_set('UTC');  //enable to get datetime as UTC
date_default_timezone_set('Asia/Kolkata');  //enable to get datetime as local
class QueryBuilder{
    /**
    * Get statement and parameter to execute
    *
    * @return array containing prepared_statement and parameter
    */
    public function get_statement($to_datetime, $from_datetime, $token=null, $range_type=null, $feature_option=null, $co_occur_option=null, $async=true, $limit = null, $first_row = false){
        $ut_obj = new Ut;
        $final_res = null;
        if(($range_type == '10sec') or ($range_type == 'hour')){
            if($from_datetime and $to_datetime and $token){
                if($async){
                    if($feature_option == 'freq'){
                        $query_class = $this->get_query_class($token);
                        $prepared_statement_10sec = "SELECT created_date, created_time, category_class_list, count_list from token_count WHERE created_date = ? AND class=" . $query_class . " AND created_time = ? AND token_name='" . $token . "'";
                        if($range_type == '10sec')
                            $input_args_10sec = $ut_obj->get_10sec_list($to_datetime, $from_datetime);
                        else
                            echo 'hour';
                    }else if($feature_option == 'sent'){
                        $query_class = $this->get_query_class($token);
                        $prepared_statement_10sec = "SELECT created_date, created_time, category_class_list, count_list from token_count WHERE created_date = ? AND class=" . $query_class . " AND created_time = ? AND token_name='" . $token . "'";
                        if($range_type == '10sec')
                            $input_args_10sec = $ut_obj->get_10sec_list($to_datetime, $from_datetime);
                        else
                            echo 'hour';
                    }
                    else if($feature_option == 'co_occur'){
                        $query_class = $this->get_query_class($token, 'co_occur', $co_occur_option);
                        $prepared_statement_10sec = "SELECT created_date, created_time, token_name2, count_list from token_co_occur WHERE created_date = ? AND class=" . $query_class . " AND created_time = ? AND token_name1='" . $token . "'";
                        if($range_type == '10sec')
                            $input_args_10sec = $ut_obj->get_10sec_list($to_datetime, $from_datetime);
                        else
                            echo 'hour';
                    }
                    $final_res[0] = $prepared_statement_10sec;
                    $final_res[1] = $input_args_10sec;
                }else{
                    //not assync
                }
            }
        }else if($range_type == 'day'){
            // for day
        }
        
        $feature_option_split = explode("_", $feature_option); //$feature_option = 'top_hashtag'/'top_mention'
        if($feature_option_split[0] == 'top'){
            $query_class = $this->get_query_class($feature_option_split[1], $feature_option_split[0]);
            if(($range_type == '10sec') or ($range_type == 'hour')){
                $prepared_statement_10sec = "SELECT category_class_list, count_list, token_name from token_count WHERE created_date = ? AND class=" . $query_class . " AND created_time = ?";
                if($range_type == '10sec'){
                    $input_args_10sec = $ut_obj->get_10sec_list($to_datetime, $from_datetime);
                    $final_res[0] = $prepared_statement_10sec;
                    $final_res[1] = $input_args_10sec;
                }
                else
                    echo 'hour';
            }
            else if($range_type == 'day'){
                
            }
        }
        
        return $final_res;
    }
    
    /**
    * Get class of token or co-occur of token
    *
    * @return integer
    */
    public function get_query_class($token=null, $option=null, $co_occur_option=null){
        if($option == 'co_occur'){
            if (strpos($token, '#') !== false) {
               
                switch ($co_occur_option) {
                    case 'mention':
                        $class = 2;
                        break;
                    case 'hashtag':
                        $class = 0;
                        break;
                    case 'user':
                        $class = 8;
                        break;
                    default:
                        # code...
                        break;
                }
            } else  if (strpos($token, '*') !== false) {
                switch ($co_occur_option) {
                    case 'mention':
                        $class = 7;
                        break;
                    case 'hashtag':
                        $class = 5;
                        break;
                    case 'user':
                        $class = 12;
                        break;
                    default:
                        # code...
                        break;
                }
            } else  if (strpos($token, '$') !== false) {
                switch ($co_occur_option) {
                    case 'mention':
                        $class = 11;
                        break;
                    case 'hashtag':
                        $class = 9;
                        break;

                    default:
                        # code...
                        break;
                }
            }else  if (strpos($token, '@') !== false) {
                switch ($co_occur_option) {
                    case 'mention':
                        $class = 11;
                        break;
                    case 'hashtag':
                        $class = 9;
                        break;
                    case 'user':
                        $class = 12;
                        break;

                    default:
                        # code...
                        break;
                }
            }
        }else if($option == 'top'){
            switch($token){
                case 'mention':
                    $class = 1;
                    break;
                case 'hashtag':
                    $class = 0;
                    break;
                case 'user':
                    $class = 2;
                    break;
                default:
                    # code...
                    break;
            }
        }else{
            if (strpos($token, '#') !== false) {
                $class = 0;
            } else  if (strpos($token, '*') !== false) {
                $class = 3;
            } else  if (strpos($token, '$') !== false) {
                $class = 2;
            }else  if (strpos($token, '@') !== false) {
                $class = 1;
            }
        }
        return $class;
    }
}