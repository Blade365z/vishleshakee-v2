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
    public function get_statement($to_datetime, $from_datetime, $token=null, $range_type=null, $feature_option=null, $co_occur_option=null, $async=true, $limit = null, $id_list=null){
        $ut_obj = new Ut;
        $final_res = null;        
        if(($feature_option == 'freq') or ($feature_option == 'sent') or ($feature_option == 'co_occur') or ($feature_option == 'tweet')){
            if(($range_type == '10sec') or ($range_type == 'hour') or ($range_type == 'day')){
                if($async){
                    if($feature_option == 'freq'){
                        $query_class = $this->get_query_class($token);                            
                        if($range_type == '10sec'){
                            $columns = 'created_date, created_time, category_class_list, count_list';
                            $table_name = 'token_count';
                            $input_args = $ut_obj->get_10sec_list_for_cassandra($to_datetime, $from_datetime);
                            $where_clause = "created_date = ? AND class=" . $query_class . " AND created_time = ? AND token_name='" . $token ."'";
                        }
                        else if($range_type == 'hour'){
                            $columns = 'created_date, created_time, category_class_list, count_list';
                            $table_name = 'token_count_hour_wise';
                            $input_args = $ut_obj->get_hour_list_for_cassandra($to_datetime, $from_datetime);
                            $where_clause = "created_date = ? AND class=" . $query_class . " AND created_time = ? AND token_name='" . $token ."'";
                        }else if($range_type == 'day'){
                            $columns = 'created_date, category_class_list, count_list';
                            $table_name = 'token_count_day_wise';
                            $input_args = $ut_obj->get_day_list_for_cassandra($to_datetime, $from_datetime);
                            $where_clause = "created_date = ? AND class=" . $query_class . " AND token_name='" . $token ."'";
                        }
                    }else if($feature_option == 'sent'){
                        $query_class = $this->get_query_class($token);                            
                        if($range_type == '10sec'){
                            $columns = 'created_date, created_time, category_class_list, count_list';
                            $table_name = 'token_count';
                            $input_args = $ut_obj->get_10sec_list_for_cassandra($to_datetime, $from_datetime);
                            $where_clause = "created_date = ? AND class=" . $query_class . " AND created_time = ? AND token_name='" . $token ."'";
                        }else  if($range_type == 'hour'){
                            $columns = 'created_date, created_time, category_class_list, count_list';
                            $table_name = 'token_count_hour_wise';
                            $input_args = $ut_obj->get_hour_list_for_cassandra($to_datetime, $from_datetime);
                            $where_clause = "created_date = ? AND class=" . $query_class . " AND created_time = ? AND token_name='" . $token ."'";
                        }else if($range_type == 'day'){
                            $columns = 'created_date, category_class_list, count_list';
                            $table_name = 'token_count_day_wise';
                            $input_args = $ut_obj->get_day_list_for_cassandra($to_datetime, $from_datetime);
                            $where_clause = "created_date = ? AND class=" . $query_class . " AND token_name='" . $token ."'";
                        }
                    }else if($feature_option == 'co_occur'){
                        $query_class = $this->get_query_class($token, 'co_occur', $co_occur_option);
                        if($range_type == '10sec'){
                            $columns = 'created_date, created_time, token_name2, count_list';
                            $table_name = 'token_co_occur';
                            $input_args = $ut_obj->get_10sec_list_for_cassandra($to_datetime, $from_datetime);
                            $where_clause = "created_date = ? AND class=" . $query_class . " AND created_time = ? AND token_name1='" . $token ."'";
                        }else if($range_type == 'hour'){
                            $columns = 'created_date, created_time, token_name2, count_list';
                            $table_name = 'token_co_occur_hour_wise';
                            $input_args = $ut_obj->get_hour_list_for_cassandra($to_datetime, $from_datetime);
                            $where_clause = "created_date = ? AND class=" . $query_class . " AND created_time = ? AND token_name1='" . $token ."'";
                        }else if($range_type == 'day'){
                            $columns = 'created_date, token_name2, count_list';
                            $table_name = 'token_co_occur_day_wise';
                            $input_args = $ut_obj->get_day_list_for_cassandra($to_datetime, $from_datetime);
                            $where_clause = "created_date = ? AND class=" . $query_class . " AND token_name1='" . $token ."'";
                        }
                    }else if($feature_option == 'tweet'){
                        $query_class = $this->get_query_class($token);
                        if($range_type == '10sec'){
                            $columns = 'category_class_list, tweetidlist';
                            $table_name = 'token_count';
                            $input_args = $ut_obj->get_10sec_list_for_cassandra($to_datetime, $from_datetime);
                            $where_clause = "created_date = ? AND class=" . $query_class . " AND created_time = ? AND token_name='" . $token ."'";
                        }else if($range_type == 'hour'){
                            $columns = 'category_class_list, tweetidlist';
                            $table_name = 'token_count_hour_wise';
                            $input_args = $ut_obj->get_hour_list_for_cassandra($to_datetime, $from_datetime);
                            $where_clause = "created_date = ? AND class=" . $query_class . " AND created_time = ? AND token_name='" . $token ."'";
                        }else  if($range_type == 'day'){
                            $columns = 'category_class_list, tweetidlist';
                            $table_name = 'token_count_day_wise';
                            $input_args = $ut_obj->get_day_list_for_cassandra($to_datetime, $from_datetime);
                            $where_clause = "created_date = ? AND class=" . $query_class . " AND token_name='" . $token ."'";
                        }
                    }
                    $prepared_statement = "SELECT ".$columns." FROM ".$table_name." WHERE ".$where_clause;  
                    $final_res[0] = $prepared_statement;
                    $final_res[1] = $input_args;
                }else{
                    //not async
                }
            }
        }
        

        // for top_hashtag, top_mention, top_user
        $feature_option_split = explode("_", $feature_option); //$feature_option = 'top_hashtag'/'top_mention' or 'top_latlng_hashtag'/'top_latlng_mention'
        if(($feature_option_split[0] == 'top') and ($feature_option_split[1] == 'latlng')){  
            // to get top data from location_token_co_occur................................................................
            // get location statement after where clause after getting country, state, city from mysql by calling function
            $loc_str = "country='^india'";
            $query_class = $this->get_query_class($feature_option_split[2], $feature_option_split[0]);
            if(($range_type == '10sec') or ($range_type == 'hour') or ($range_type == 'day')){
                if($range_type == '10sec'){
                    $table_name = 'location_token_co_occur';
                    $input_args = $ut_obj->get_10sec_list_for_cassandra($to_datetime, $from_datetime);
                    $where_clause = "created_date = ? AND class=" . $query_class . " AND created_time = ?";                   
                }else if($range_type == 'hour'){
                    $table_name = 'location_token_co_occur_hour_wise';
                    $input_args = $ut_obj->get_hour_list_for_cassandra($to_datetime, $from_datetime);
                    $where_clause = "created_date = ? AND class=" . $query_class . " AND created_time = ?"; 
                }else if($range_type == 'day'){
                    $table_name = 'location_token_co_occur_day_wise';
                    $input_args = $ut_obj->get_day_list_for_cassandra($to_datetime, $from_datetime);
                    $where_clause = "created_date = ? AND class=" . $query_class; 
                }
            }
            $columns = 'category_class_list, count_list, token_name, tweet_cl_latitude, tweet_cl_longitude, country, city, state';
            $prepared_statement = "SELECT ".$columns." FROM ".$table_name." WHERE ".$where_clause. " AND ".$loc_str;  
            $final_res[0] = $prepared_statement;
            $final_res[1] = $input_args;
        }else if($feature_option_split[0] == 'top'){
            // to get top data from location_token_count................................................................
            $query_class = $this->get_query_class($feature_option_split[1], $feature_option_split[0]);
            if(($range_type == '10sec') or ($range_type == 'hour') or ($range_type == 'day')){
                if($range_type == '10sec'){
                    $table_name = 'token_count';
                    $input_args = $ut_obj->get_10sec_list_for_cassandra($to_datetime, $from_datetime);
                    $where_clause = "created_date = ? AND class=" . $query_class . " AND created_time = ?";                   
                }else if($range_type == 'hour'){
                    $table_name = 'token_count_hour_wise';
                    $input_args = $ut_obj->get_hour_list_for_cassandra($to_datetime, $from_datetime);
                    $where_clause = "created_date = ? AND class=" . $query_class . " AND created_time = ?"; 
                }else if($range_type == 'day'){
                    $table_name = 'token_count_day_wise';
                    $input_args = $ut_obj->get_day_list_for_cassandra($to_datetime, $from_datetime);
                    $where_clause = "created_date = ? AND class=" . $query_class; 
                }
            }
            $columns = 'category_class_list, count_list, token_name';
            $prepared_statement = "SELECT ".$columns." FROM ".$table_name." WHERE ".$where_clause;  
            $final_res[0] = $prepared_statement;
            $final_res[1] = $input_args;
        }


        
        // for tweet info
        if($feature_option == 'tweet_info'){
            if($async){
                $final_res[0] = "SELECT t_location,datetime,tid,author,author_id,author_profile_image,author_screen_name,sentiment,quoted_source_id,tweet_text,retweet_source_id,media_list,type,category from tweet_info_by_id_test WHERE tid=?";
                $input_args = array();
                foreach ($id_list as $value) {
                    array_push($input_args, array($value));
                }
                $final_res[1] = $input_args;
            }else{
                $final_res[0] = "SELECT t_location,datetime,tid,author,author_id,author_profile_image,author_screen_name,sentiment,quoted_source_id,replyto_source_id,retweet_source_id,tweet_text,retweet_source_id,media_list,type,category from tweet_info_by_id_test WHERE tid=" . "'" .$token."'";
            }
        }

        // for user info
        if($feature_option == 'user_info'){
            if($async){
                $final_res[0] = "SELECT author_id, author, author_screen_name, profile_image_url_https from user_record WHERE author_id=?";
                $input_args = array();
                foreach ($id_list as $value) {
                    $value = str_replace('$','', $value);
                    array_push($input_args, array($value));
                }
                $final_res[1] = $input_args;
            }else{
                // $token = '$821712536215362' 
                $token = str_replace('$','', $token);
                $final_res[0] = "SELECT author_id, author, author_screen_name, profile_image_url_https,description,created_at,url,verified,location from user_record WHERE author_id=" . "'" .$token."'";
            }
        }
        
        return $final_res;
    }





    /**
    * Get class of token or co-occur of token('hashtag'/'mention'/'user'/'#COVID'/'@modi')
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
                    case 'keyword':
                        $class = 4;
                        break;
                    default:
                        # code...
                        break;
                }
            } else  if (strpos($token, '*') !== false) {
                switch ($co_occur_option) {
                    case 'mention':
                        $class = 111;
                        break;
                    case 'hashtag':
                        $class = 111;
                        break;
                    case 'user':
                        $class = 111;
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
                        $class = 1;
                        break;
                    case 'hashtag':
                        $class = 3;
                        break;
                    case 'user':
                        $class = 10;
                        break;
                    case 'keyword':
                        $class = 6;
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
            } else  if (strpos($token, '^') !== false) {
                $class = 4;
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