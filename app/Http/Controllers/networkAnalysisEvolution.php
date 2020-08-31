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
use  CURLFile;

class networkAnalysisEvolution extends Controller
{
    private $total_main_category = 4; // not_sec_com(included pos, neg, neu), security(included pos, neg, neu), communal(included pos, neg, neu), sec_com(included pos, neg, neu)  
   
    public function tester()
    {
        echo "Testing network evolution module!";
    }
    
    public function jobSubmission($subject='#a',$start_date='2020-08-08',$end_date='2020-08-16',$duration='day'){
           
           $all_dates = $this->getDatesFromRange($start_date,$end_date); 
           if($duration=='day'){
               foreach($all_dates as $one_day){
                  $random_name='a4'.rand();
                  $query_list = array($one_day,$one_day,'114',$subject);
                  $this->requestToSpark($query_list,$random_name);
               }
           }else if($duration == 'week'){
              $no_of_weeks = sizeof($all_dates) / 7;
              $end_date_index = -1;
               for($i=0;$i<$no_of_weeks;$i++){
                   $start_date_index = $end_date_index + 1;
                   $end_date_index = $start_date_index + 6;
                   
                   if($end_date_index > sizeof($all_dates)){
                       $end_date_index = sizeof($all_dates);
                   }
                   
                   echo $start_date_index;
                   echo $end_date_index;
                   
                   $this->requestToSpark($query_list,$random_name);
              }
           }
    }
    
    // Function to get all the dates in given range 
    function getDatesFromRange($start, $end, $format = 'Y-m-d') { 
          
        // Declare an empty array 
        $array = array(); 
          
        // Variable that store the date interval 
        // of period 1 day 
        $interval = new DateInterval('P1D'); 
      
        $realEnd = new DateTime($end); 
        $realEnd->add($interval); 
      
        $period = new DatePeriod(new DateTime($start), $interval, $realEnd); 
      
        // Use loop to store date into array 
        foreach($period as $date) {                  
            $array[] = $date->format($format);  
        } 
      
        // Return the array elements 
        return $array; 
    } 
    
    public  function  curlData($query_list, $rname)
    {
        $curl = curl_init();
        $data['conf'] = array('spark.jars.packages' => 'anguenot:pyspark-cassandra:2.4.0', 'spark.cassandra.connection.host' => '10.0.0.11', 'spark.cores.max' => 16);
        $data['file'] = 'local:/home/admin/bbk/sigma/spark/batch/network_interaction.py';
        $data['args'] = $query_list;
        $data['name'] = strval($rname) . 'a78';
        $data['executorCores'] = 8;
        $data['numExecutors'] = 2;
        $data['executorMemory'] = '25G';
        $data['driverMemory'] = '1G';
        $data = json_encode($data);
        // echo $data;
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
    
    // public function getData_from_REST()
    public function requestToSpark($query_list, $rname)
    {
       // $query_list = $_GET['query_list'];
       // $rname = $_GET['rname'];
       
        
        $result = $this->curlData($query_list, $rname);
        $result = json_decode($result, true);

        //echo json_encode($result);
        // echo json_encode(array('query_time' => $rname, 'status' => $result['state'], 'id' => $result['id']));
        $id = $result['id'];

        while (1) {
            $re = $this->getStatusFromSpark($id);
            echo $re['status'];
            if ($re['status'] == 'success')
                break;
            sleep(10);
        }

     //   $filename_arr = array_slice($query_list, 1, sizeof($query_list));
     //   $filename_to_write = $this->get_filename($query_list[0], $filename_arr);

     //   $re1 = $this->getOuputFromSparkAndStoreAsJSON($request, $id, $filename_to_write, $query_list[0]);

     //   return json_encode($re1);
    }
    
    // Added by Roshan
    public function getStatusFromSpark($id)
    {
        //curl -X GET -H "Content-Type: application/json" 172.16.117.202:8998/batches/{80}
        // $id =  $_GET['id'];
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
        // return json_encode(array('status' => $result['state'], 'id' => $result['id']));
        return array('status' => $result['state'], 'id' => $result['id']);
    }
}