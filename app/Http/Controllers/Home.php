<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use DateTime;
use App\Http\Controllers\HistoricalAnalysisController;

date_default_timezone_set('Asia/Kolkata');

class Home extends Controller
{
    public function CurrentDateTimeGeneratorPublic($interval){
               
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
    public function me()
    {
        
        try {
            if (Auth::check())
            {
             $user = Auth::user()->username;
             $email = Auth::user()->email;
             $id=Auth::id();
             $role=Auth::user()->role;
             $me =  ['id'=>$id,'username'=>$user,'email'=>$email,'role'=>$role];
              return response()->json($me,200);
            }else{
                   return response()->json(['error'=>'not logged in '],200);
            }
            } 
            catch (Exception $e) {
                return response()->json(['error'=>'login status not found']);
            }

      
     }
    public function getFrequencyDistributionData(){
             if(isset($_GET['interval']) && isset($_GET['query'])){
                 $interval = $_GET['interval'];
                   if($interval > 86400){
                    return response()->json(['error'=>'Not Allowed'],404);
                 }
                 $query = $_GET['query'];
             }else{
                 return response()->json(['error'=>'interval  or query not set'],404);
             }
            $dateTimeArgs = $this->CurrentDateTimeGeneratorPublic($interval);
            $freqDistObj = new HistoricalAnalysisController;
          
            $freqData = $freqDistObj->get_frequency_distribution_data($dateTimeArgs[1],$dateTimeArgs[0],$query,'10sec',true,true);
            return ($freqData);
        }
    public function updateFreqDistGraphRealtime(){
        $fromTime = $_GET['finalTime'];
      $fromTime =  date('Y-m-d H:i:s', strtotime($fromTime) + 10);
          $query = $_GET['query'];
        $freqDistObj = new HistoricalAnalysisController;
        $freqData = $freqDistObj->get_frequency_distribution_data($fromTime,$fromTime,$query,'10sec',true,true);
        return ($freqData);
        
    }
    
    public function getSentimentDistributionData(){
        if(isset($_GET['interval']) && isset($_GET['query'])){
                 $interval = $_GET['interval'];
                   if($interval > 86400){
                    return response()->json(['error'=>'Not Allowed'],404);
                 }
                 $query = $_GET['query'];
             }else{
                 return response()->json(['error'=>'interval  or query not set'],404);
             }
             
        $dateTimeArgs = $this->CurrentDateTimeGeneratorPublic($interval);      
       $sentiDistObj = new HistoricalAnalysisController;
       $sentiData = $sentiDistObj->get_sentiment_distribution_data($dateTimeArgs[1],$dateTimeArgs[0],$query,'10sec');
       return $sentiData;
    }
    public function updateSentiDistGraphRealtime(){
        $fromTime = $_GET['finalTime'];
        $fromTime =  date('Y-m-d H:i:s', strtotime($fromTime) + 10);
          $query = $_GET['query'];
        $sentiDistObj = new HistoricalAnalysisController;
        $sentiData = $sentiDistObj->get_sentiment_distribution_data($fromTime,$fromTime,$query,'10sec');
        return ($sentiData);
        
    }
    public function getTopCoocurDataPublic(){
         if(isset($_GET['interval']) && isset($_GET['query'])){
                 $interval = $_GET['interval'];
                   if($interval > 86400){
                    return response()->json(['error'=>'Not Allowed'],404);
                 }
                 $query = $_GET['query'];
                  $option = $_GET['option'];
             }else{
                 return response()->json(['error'=>'interval  or query not set'],404);
             }
            $dateTimeArgs = $this->CurrentDateTimeGeneratorPublic($interval);
            $haObj = new HistoricalAnalysisController;
            $data = $haObj->get_co_occur_data($dateTimeArgs[1],$dateTimeArgs[0],$query , '10sec', $option, null,true);
            $finalData = array(['data'=>$data,'finalTime'=>$dateTimeArgs[1]]);
            return ($finalData);
    }
    
    public function updateTopCoocureDataRealtime() {
        $fromTime = $_GET['finalTime'];
        $fromTime =  date('Y-m-d H:i:s', strtotime($fromTime) + 10);
        $query = $_GET['query'];
        $option=$_GET['option'];
        $haObj = new HistoricalAnalysisController;
        $data = $haObj->get_co_occur_data($fromTime,$fromTime,$query,'10sec', $option, null,false,true);
        $finalData = array(['data'=>$data,'finalTime'=>$fromTime]);
        return $finalData;
    }
    
    public function getTopTrendingData(){
          if(isset($_GET['interval'])){
                 $interval = $_GET['interval'];
                   if($interval > 86400){
                    return response()->json(['error'=>'Not Allowed'],404);
                 }
             }else{
                 return response()->json(['error'=>'interval  or query not set'],404);
             }
        $dateTimeArgs = $this->CurrentDateTimeGeneratorPublic($interval);
        $haObj = new HistoricalAnalysisController;
        $data = $haObj->get_top_data($dateTimeArgs[1],$dateTimeArgs[0],'top_hashtag', $limit=50, null);
        return $data;
    }
    
    
}




