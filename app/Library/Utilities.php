<?php
namespace App\Library;
use Cassandra;
use DateTime;
use DateTimeZone;
// date_default_timezone_set('UTC');  //enable to get datetime as UTC
date_default_timezone_set('Asia/Kolkata');  //enable to get datetime as local
class Utilities{
    /**
    * Get from datetime and to datetime based on interval
    *
    * @return array
    */
    public function fromDatetime_toDatetime_generator_basedOn_interval($interval){
        //  $datetimeobj = new DateTime('2020-08-24 20:18:00');
         $datetimeobj = new DateTime();
         $datetime = $datetimeobj->format('Y-m-d H:i:s');
         $datetime =  date('Y-m-d H:i:s', strtotime($datetime) - 60);
         $datetime = new DateTime($datetime);
         $temp_sec = (int) ($datetime->format('s')) % 10;
         $t = '-' . strval($temp_sec) . ' second';
         $datetime = $datetime->format('Y-m-d H:i:s');
         $toTime = date('Y-m-d H:i:s', strtotime($t, strtotime($datetime)));
         $fromTime = date('Y-m-d H:i:s', strtotime($toTime)-$interval);
         $dateTimeArgs = [$fromTime,$toTime];
         return $dateTimeArgs;
    }
    
    /**
    * Get 10sec list 
    *
    * @return array of array [[CASS_DATE('2020-08-10'), 10:00:00'], ['2020-08-10', '10:00:10'], ['2020-08-10', '10:00:20'], ['2020-08-10', '10:00:30']]
    */
    public function get_10sec_list($to_datetime, $from_datetime){
        $tenSec_array = array();
        $diff_value_in_sec = $this->get_difference_between_two_datetime($to_datetime, $from_datetime, $option='sec');
        for ($i = 0; $i <= ($diff_value_in_sec/10); $i++) {
            $to_date_time_list = $this->separate_date_time($to_datetime);
            $cass_date_obj = $this->convert_php_date_obj_to_cass_date_obj(strtotime($to_date_time_list[0])); //convert php date_obj to cass_date_obj
            array_push($tenSec_array,  array($cass_date_obj, $to_date_time_list[1]));
            if($to_datetime == $from_datetime)
                break;
            $to_datetime_tmp = strtotime('-10 seconds', strtotime($to_datetime));
            $to_datetime = date('Y-m-d H:i:s', $to_datetime_tmp);
            
        }
        return array_reverse($tenSec_array);
    }
    
    /**
    * Convert Cassandra dateTime obj to str date or str dateTime
    *
    * @return string
    */
    public function get_date_time_from_cass_date_obj($cass_date_obj, $format)
    {
        if ($format == "Y-m-d H:i:s")
            return $cass_date_obj->toDateTime()->format('Y-m-d H:i:s');
        else if ($format == "Y-m-d")
            return $cass_date_obj->toDateTime()->format('Y-m-d');
    }
    
    /**
    * Get current dateTime or date based on delay(in sec)
    *
    * @return string
    */
    public function get_current_date_time($option='datetime000', $delay = 0){
        $current_datetime_obj = new DateTime();
        $res = null;
        if($option == 'date')
            $res = $current_datetime_obj->format('Y-m-d');
        else if($option == 'datetime111'){
            $current_datetime = $current_datetime_obj->format('Y-m-d H:i:s');
            $r = ($delay + (int) ($current_datetime_obj->format('s')) % 10);
            $t = '-' . strval($r) . ' seconds';
            $res = date('Y-m-d H:i:s', strtotime($t, strtotime($current_datetime)));
        }
        else if($option == 'datetime000'){
            $res = $current_datetime_obj->format('Y-m-d');
            $res .= ' 00:00:00';
        }
        else if($option == 'datetime110'){
            $res = $current_datetime_obj->format('Y-m-d H:i');
            $res .= ':00';
        }
        else if($option == 'datetime100'){
            $res = $current_datetime_obj->format('Y-m-d H');
            $res .= ':00:00';
        }
            
        return $res;
    }
    
    /**
    * Get diff between two datetime
    *
    * @return integer(sec, no. of days, min, hour)
    */
    public function get_difference_between_two_datetime($to_datetime, $from_datetime, $option){
        if($option == 'sec'){
            $to_datetime  = strtotime($to_datetime);
            $from_datetime = strtotime($from_datetime);
            $differenceInSeconds = $to_datetime - $from_datetime;
            return $differenceInSeconds;
        }
        else if($option == 'day'){
            
        }
    }
    
    /**
    * split datetime_str to date and time
    *
    * @return array
    */
    public function separate_date_time($datetime_str){
        $temp = explode(' ', $datetime_str);
        return array($temp[0], $temp[1]); 
    }
    
    /**
    * Convert timestamp_obj to cass date obj
    *
    * @return cass date obj
    */
    public function convert_php_date_obj_to_cass_date_obj($timestamp_obj)
    {
        return new Cassandra\Date($timestamp_obj);
    }
    
    /**
    * create directory
    *
    * @return 0 or 1
    */
    public function create_directory($dir_name){
        if($dir_name){
            //Check whether the directory is already created
            if (!file_exists("storage/$dir_name")) {
                mkdir("storage/$dir_name");
            }
            return 1;
        }else
            return 0;
    }
    
    /**
    * write to file
    *
    * @return 0 or 1
    */
    public function write_to_file($file_type='csv', $file_path=null, $data=null, $token=null){
        if($file_path){
            $file_path = "storage/$file_path"; //"storage/$dir_name/$filename.csv"
            if($file_type='csv'){
                // $data should be in key value pair
                $file = fopen($file_path, "w");
                $parts = (array_chunk($data, 1000, true));
                fputcsv($file, ['from', 'to', 'count']);
                foreach ($parts as $lines) {
                    foreach ($lines as $key => $value) {
                        fputcsv($file, array($token, $key, strval($value)));
                    }
                }
                fclose($file);
            }else if($file_type='json'){
                // $data should be in key value pair
                $newJsonString = json_encode($data);
                file_put_contents($file_path, $newJsonString);
            }
            return 1;
        }else{
            return 0;
        }
        
    }
    
    
    /**
    * read file
    *
    * @return array of array
    */
    public function read_file($file_type = null, $file_path=null, $limit=null)
    {
        if($file_path){
            $file_path = "storage/$file_path"; //"storage/$dir_name/$filename.csv"
            $final_arr = [];
            if($file_type='csv'){
                $csvFile = file($file_path); 
                $i = 1;
                foreach ($csvFile as $line) {
                    $final_arr[] = str_getcsv($line);
                    if($limit){
                        if($i == $limit)
                            break;
                        $i++;
                    }
                }
            }else if($file_type='json'){
                $final_arr = json_decode(file_get_contents($file_path));
            }
            // echo json_encode($final_arr);
            return $final_arr;
        }
        else{
            echo "file path is missing";
        }
    }
}