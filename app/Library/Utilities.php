<?php
namespace App\Library;
use Cassandra;
use DateTime;
use DateTimeZone;
use DateInterval;
use DatePeriod;
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
    * Get 10sec list to query to cassandra
    *
    * @return array of array [[CASS_DATE('2020-08-10'), 10:00:00'], [CASS_DATE('2020-08-10'), '10:00:10'], [CASS_DATE('2020-08-10'), '10:00:20'], [CASS_DATE('2020-08-10'), '10:00:30']]

    *Description: Reason for concatnating '18:30:00' with date '2020-09-06' -> 2020-09-06 18:30:00, because cassandra only knows datetime in UTC. So, if we opearate with local datetime(settig local timezone), then it behaves in different way[like if we queried on date 2020-09-04 00:00:00(as local), Cassandra/Date class assume I am queried on 2020-09-03 05:30:00(as local datetime), converts it to 2020-09-03 00:00:00(as it knows only UTC).], So, we can observe that when we queried on 2020-09-04 00:00:00(as local), it converts to 2020-09-03 05:30:00(as local), [so -18:30:00] and it queried to database with 2020-09-03 00:00:00(as UTC), but we want data for 2020-09-04 00:00:00. So, if want to query on  2020-09-04 00:00:00 into database, then if we queried on 2020-09-04 18:30:00(as local), then  Cassandra/Date class it assumes we queried on 2020-09-04 05:30:00(as local), so it converts it to  2020-09-04 00:00:00(as UTC, because cassandra operated only on UTC).
    */
    public function get_10sec_list_for_cassandra($to_datetime, $from_datetime){
        $tenSec_array = array();
        $diff_value_in_sec = $this->get_difference_between_two_datetime($to_datetime, $from_datetime, $option='sec');
        for ($i = 0; $i <= ($diff_value_in_sec/10); $i++) {
            $to_date_time_list = $this->separate_date_time($to_datetime);
            $cass_date_obj = $this->convert_php_date_obj_to_cass_date_obj(strtotime($to_date_time_list[0]. ' 18:30:00')); //convert php date_obj to cass_date_obj
            array_push($tenSec_array,  array($cass_date_obj, $to_date_time_list[1]));
            if($to_datetime == $from_datetime)
                break;
            $to_datetime_tmp = strtotime('-10 seconds', strtotime($to_datetime));
            $to_datetime = date('Y-m-d H:i:s', $to_datetime_tmp);            
        }
        return array_reverse($tenSec_array);
    }



    /**
        * Get 10sec list
        *
        * @return array of array [['2020-08-10', 10:00:00'], ['2020-08-10', '10:00:10'], ['2020-08-10', '10:00:20'], ['2020-08-10', '10:00:30']]
    **/
    public function get_10sec_list($to_datetime, $from_datetime){
        $tenSec_array = array();
        $diff_value_in_sec = $this->get_difference_between_two_datetime($to_datetime, $from_datetime, $option='sec');
        for ($i = 0; $i <= ($diff_value_in_sec/10); $i++) {
            $to_date_time_list = $this->separate_date_time($to_datetime);
            $date_str = $to_date_time_list[0];
            array_push($tenSec_array,  array($date_str, $to_date_time_list[1]));
            if($to_datetime == $from_datetime)
                break;
            $to_datetime_tmp = strtotime('-10 seconds', strtotime($to_datetime));
            $to_datetime = date('Y-m-d H:i:s', $to_datetime_tmp);            
        }
        return array_reverse($tenSec_array);
    }




    /**
    * Get hour list to query to cassandra
    *
    * @return array of array [[CASS_DATE('2020-08-10'), 01:00:00'], [CASS_DATE('2020-08-10'), '02:00:00'], [CASS_DATE('2020-08-10'), '03:00:00']]
    */
    public function get_hour_list_for_cassandra($to_datetime, $from_datetime){
        $hour_array = array();
        $hours_array_tmp = array("01:00:00", "02:00:00", "03:00:00", "04:00:00", "05:00:00", "06:00:00", "07:00:00", "08:00:00", "09:00:00", "10:00:00", "11:00:00", "12:00:00", "13:00:00", "14:00:00", "15:00:00", "16:00:00", "17:00:00", "18:00:00", "19:00:00", "20:00:00", "21:00:00", "22:00:00", "23:00:00");
        $to_date_time_list = $this->separate_date_time($to_datetime); // ['2020-09-06', '00:00:00']
        // $cass_date_obj = $this->convert_php_date_obj_to_cass_date_obj(strtotime($to_date_time_list[0])); //convert php date_obj to cass_date_obj

        $cass_date_obj = $this->convert_php_date_obj_to_cass_date_obj(strtotime($to_date_time_list[0]. ' 18:30:00'));        
        for ($i = 0; $i < 23; $i++) {
            array_push($hour_array,  array($cass_date_obj, $hours_array_tmp[$i]));
        }
        // for hour 2020-09-09 24:00:00 --> 2020-09-10 00:00:00(it should be next day at 00:00:00)
        $nxt_day = $this->get_previous_next_day($to_date_time_list[0], 'next');
        $nxt_date_obj = $this->convert_php_date_obj_to_cass_date_obj(strtotime($nxt_day. ' 18:30:00'));  
        array_push($hour_array,  array($nxt_date_obj, '00:00:00'));
                
        return $hour_array;
    }





    /**
    * Get hour list
    *
    * @return array of array [['2020-08-10', 01:00:00'], ['2020-08-10', '02:00:00'], ['2020-08-10', '03:00:00']]
    */
    public function get_hour_list($to_datetime, $from_datetime){
        $hour_array = array();
        $hours_array_tmp = array("01:00:00", "02:00:00", "03:00:00", "04:00:00", "05:00:00", "06:00:00", "07:00:00", "08:00:00", "09:00:00", "10:00:00", "11:00:00", "12:00:00", "13:00:00", "14:00:00", "15:00:00", "16:00:00", "17:00:00", "18:00:00", "19:00:00", "20:00:00", "21:00:00", "22:00:00", "23:00:00");
        $to_date_time_list = $this->separate_date_time($to_datetime); // ['2020-09-06', '00:00:00']
        $date_str =  $to_date_time_list[0] ;    
        for ($i = 0; $i < 23; $i++) {
            array_push($hour_array,  array($date_str, $hours_array_tmp[$i]));
        }
        // for hour 2020-09-09 24:00:00 --> 2020-09-10 00:00:00(it should be next day at 00:00:00)
        $nxt_day = $this->get_previous_next_day($to_date_time_list[0], 'next');
        $nxt_date_obj = $this->convert_php_date_obj_to_cass_date_obj(strtotime($nxt_day. ' 18:30:00'));  
        array_push($hour_array,  array($nxt_date_obj, '00:00:00'));
                
        return $hour_array;
    }





    /**
    * Get day list to query to cassandra
    *
    * @return array of array [[CASS_DATE('2020-08-10')], [CASS_DATE('2020-08-11')], [CASS_DATE('2020-08-12')]]
    */
    public function get_day_list_for_cassandra($to_datetime, $from_datetime){
        // echo $to_datetime, $from_datetime;
        $day_list = array();
        $to_date_time_list = $this->separate_date_time($to_datetime); // ['2020-09-06', '00:00:00']
        $from_date_time_list = $this->separate_date_time($from_datetime); // ['2020-09-01', '00:00:00']
        $day_list = $this->getDatesFromRange($to_date_time_list[0], $from_date_time_list[0], 'Y-m-d', 'cas_date_obj_array_of_array');

        return $day_list;
    }




    /**
    * Get day list to query
    *
    * @return array of array [['2020-08-10'], ['2020-08-11'], ['2020-08-12']]
    */
    public function get_day_list($to_datetime, $from_datetime){
        // echo $to_datetime, $from_datetime;
        $day_list = array();
        $to_date_time_list = $this->separate_date_time($to_datetime); // ['2020-09-06', '00:00:00']
        $from_date_time_list = $this->separate_date_time($from_datetime); // ['2020-09-01', '00:00:00']
        $day_list = $this->getDatesFromRange($to_date_time_list[0], $from_date_time_list[0], 'Y-m-d', 'array');
        return $day_list;
    }



    /**
    * Get array of dates between two dates
    *
    * @return array or cas_date_obj_array_of_array(array of array)
    * array(normal)['2020-09-06', '2020-09-07', '2020-09-08'] or cas_date_obj_array_of_array(array of array)[[CASS_DATE('2020-08-10')], [CASS_DATE('2020-08-11')], [CASS_DATE('2020-08-12')]]
    */
    public function getDatesFromRange($to_date, $from_date, $format = 'Y-m-d', $return_type = 'array')
    {
        $final_array = array();
        $interval = new DateInterval('P1D'); // Variable that store the date interval of period 1 day        

        $realEnd = new DateTime($to_date);
        $realEnd->add($interval);

        $period = new DatePeriod(new DateTime($from_date), $interval, $realEnd);

        // Use loop to store date into array 
        if ($return_type == 'cas_date_obj_array_of_array') {
            foreach ($period as $date) {
                $tmp_array = array();
                $tmp_array[] = $this->convert_php_date_obj_to_cass_date_obj(strtotime(($date->format('Y-m-d')). ' 18:30:00')); //convert php date obj to cassandra date obj
                array_push($final_array, $tmp_array);
            }
        } else {
            foreach ($period as $date) {
                $final_array[] = $date->format($format);
            }
        }

        // Return the array elements 
        return $final_array;
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
    * @return integer(sec, no. of days)
    */
    public function get_difference_between_two_datetime($to_datetime, $from_datetime, $option){
        if($option == 'sec'){
            $to_datetime  = strtotime($to_datetime);
            $from_datetime = strtotime($from_datetime);
            $differenceInSeconds = $to_datetime - $from_datetime;
            return $differenceInSeconds;
        }
        else if($option == 'day'){
            $from_datetime_obj = new DateTime($from_datetime);
            $to_datetime_obj = new DateTime($to_datetime);
            $interval = $from_datetime_obj->diff($to_datetime_obj);
            return $interval->format('%a'); //no. of days
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
    public function write_to_file($file_type='csv', $file_path=null, $data=null, $token=null, $userID=null){
        if($file_path){
            $file_path = "storage/$file_path"; //"storage/$dir_name/$filename.csv"
            if($file_type='csv'){
                //checking directory is present or not
                if (!file_exists("storage/$userID")) {
                    mkdir("storage/$userID");
                }
                // $data should be in key value pair
                $file = fopen($file_path, "w");
                $parts = (array_chunk($data, 1000, true));
                fputcsv($file, ['src', 'dst', 'count']);
                if($token){
                    foreach ($parts as $lines) {
                        foreach ($lines as $key => $value) {
                            fputcsv($file, array($token, $key, strval($value)));
                        }
                    }
                }else{
                    foreach ($parts as $lines) {                        
                        foreach ($lines as $key) {
                            // echo json_encode($key);
                            fputcsv($file, $key);
                        }
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
            if($file_type=='csv'){
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
            }else if($file_type=='json'){
                $final_arr = json_decode(file_get_contents($file_path), true);
                // var_dump($final_arr);
            }
            return $final_arr;
        }
        else{
            echo "file path is missing";
        }
    }


    // public function get_range_type($to_datetime, $from_datetime, $differenceFormat = '%a'){
    //     $from_datetime_obj = new DateTime($from_datetime);
    //     $to_datetime_obj = new DateTime($to_datetime);
    //     $interval = $from_datetime_obj->diff($to_datetime_obj);
    //     echo $interval->format('%R%a days');
    //     return $range_type;
    // }



    /**
        * get previous day or next day based on given date
        *
        * @return datetime in string format
    */
    public function get_previous_next_day($date, $option){
        if($option == 'prev'){
            return date('Y-m-d', strtotime('-1 day', strtotime($date)));
        }else if ($option == 'next'){
            return date('Y-m-d', strtotime('1 day', strtotime($date)));
        }
    }



    public function get_next_date_hour($datetime_str){
        $res = null;
        $date = ($this->separate_date_time($datetime_str))[0];
        $time = ($this->separate_date_time($datetime_str))[1];
        $t = explode(':', $time)[0] + 1;
        if(floor($t/10) == 0)  //for 1-9 = 0(1-9) and others (10-24) = as it is
            $t = '0'.$t;        
        if($t == 24){
            $res = ($this->get_previous_next_day($date, 'next')). ' 00:00:00'; // current time-->"2020-09-16 24:00:00"  convert to "2020-09-17 00:00:00"
        }else{
            $time_tmp = $t . ':00:00' ; // current time-->"2020-09-16 20:06:20"  convert to "2020-09-16 21:00:00"
            $res = $date.' '.$time_tmp;
        }
        return $res;
    }



    /**
        * convert utc datetime to local datetime
        *
        * @return datetime in string format
    */
    public function convert_utc_datetime_to_local_datetime($datetime_str){
        // $s = '2020-09-10 12:23:20';
        $date = new DateTime($datetime_str);
        $date->add(new DateInterval('PT5H30M'));
        return $date->format('Y-m-d H:i:s');
    }
}