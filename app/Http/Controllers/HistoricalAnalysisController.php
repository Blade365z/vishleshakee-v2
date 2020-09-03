<?php
namespace App\Http\Controllers;

use App\Http\Controllers\CommonController as CC;
// use App\DBModel\DBmodel;
// use App\DBModel\DBmodelAsync;
// use App\Library\QueryBuilder as QB;
// use App\Library\Utilities as Ut;

use Illuminate\Http\Request;

class HistoricalAnalysisController extends Controller
{
    public function get_frequency_distribution_data_ha()
    {
        $common_object = new CC;
        $token = $_GET['query'];
        $from_datetime = $_GET['from_datetime'];
        $to_datetime = $_GET['to_datetime'];
        $range_type = $_GET['range_type'];
        return $common_object->get_frequency_distribution_data($to_datetime, $from_datetime, $token, $range_type, false, true);
    }

    public function get_sentiment_distribution_data_ha()
    {
        $common_object = new CC;
        $token = $_GET['query'];
        $from_datetime = $_GET['from_datetime'];
        $to_datetime = $_GET['to_datetime'];
        $range_type = $_GET['range_type'];
        return $common_object->get_sentiment_distribution_data($to_datetime, $from_datetime, $token, $range_type);
    }

    public function get_co_occur_data_ha()
    {
        $common_object = new CC;
        $token = $_GET['query'];
        $from_datetime = $_GET['from_datetime'];
        $to_datetime = $_GET['to_datetime'];
        $range_type = $_GET['range_type'];
        $co_occur_option = $_GET['co_occur_option'];
        // $unique_id = $_GET['unique_id'];
        // get directory name after user_login ....
        // $file_path = "directory_name/$unique_id.csv";
        $file_path = "common/" . $token . "_" . $co_occur_option . ".csv";
        return $common_object->get_co_occur_data($to_datetime, $from_datetime, $token, $range_type, $co_occur_option, $file_path, true);
    }

    public function get_top_data_ha()
    {
        $common_object = new CC;
        $token = null;
        if (isset($_GET['query'])) {
            $token = $_GET['query'];
        }
        $from_datetime = $_GET['from_datetime'];
        $to_datetime = $_GET['to_datetime'];
        // $range_type = $_GET['range_type'];
        $limit = $_GET['limit'];
        $top_option = $_GET['top_option'];
        return $common_object->get_top_data($to_datetime, $from_datetime, $top_option, $limit, $token);
    }

    public function get_tweets_ha()
    {
        $common_object = new CC;
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


    public function get_tweets_info_ha()
    {
        $common_object = new CC;
        $tweet_id_list = null;
        if (isset($_GET['tweet_id_list'])) {
            $tweet_id_list = $_GET['tweet_id_list'];
        }
        return $common_object->get_tweets_info($tweet_id_list);
    }


    public function get_user_info_ha(){
        $common_object = new CC;
        $user_id_list = $_GET['user_id_list'];
        // return $common_object->get_user_info($user_id_list);
        return $common_object->get_user_info($user_id_list, false);
    }

}
