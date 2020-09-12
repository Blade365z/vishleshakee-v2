<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class HistoricalController extends Controller
{
    public function getFrequencyDataForHistorical(Request $request)
    {
            if ($request->input('to') && $request->input('from') && $request->input('query') && $request->input('rangeType')) {
            $rangeType = $request->input('rangeType');
            $query = $request->input('query');
            $from = $request->input('from');
            $to = $request->input('to');
            $rangeType = $request->input('rangeType');
            if ($request->input('isDateTimeAlready') == 0) {
                $fromTime = date('Y-m-d H:i:s', strtotime($from) + 0);
                $toTime = date('Y-m-d H:i:s', strtotime($to) + 0);
            } else {
                $fromTime = $from;
                $toTime = $to;
            }

            //A little extra processing for 10seconds plot.
            if ($rangeType == '10sec') {
                $fromTime = date('Y-m-d H:i:s', strtotime($fromTime) - 3600);
                $toTime = date('Y-m-d H:i:s', strtotime($toTime) + 0);
            }

            $commonObj = new CommonController;
            $data = $commonObj->get_frequency_distribution_data($toTime, $fromTime, $query, $rangeType, true, true);
            return $data;

        } else {
            return response()->json(['error' => 'Please check yout arguments'], 404);
        }
    }
    public function getSentimentDataForHistorical(Request $request)
    {
        if ($request->input('to') && $request->input('from') && $request->input('query') && $request->input('rangeType')) {
            $rangeType = $request->input('rangeType');
            $query = $request->input('query');
            $from = $request->input('from');
            $to = $request->input('to');
            $rangeType = $request->input('rangeType');
            if ($request->input('isDateTimeAlready') == 0) {
                $fromTime = date('Y-m-d H:i:s', strtotime($from) + 0);
                $toTime = date('Y-m-d H:i:s', strtotime($to) + 0);
            } else {
                $fromTime = $from;
                $toTime = $to;
            }

            //A little extra processing for 10seconds plot.
            if ($rangeType == '10sec') {
                $fromTime = date('Y-m-d H:i:s', strtotime($fromTime) - 3600);
                $toTime = date('Y-m-d H:i:s', strtotime($toTime) + 0);
            }

            $commonObj = new CommonController;
            $data = $commonObj->get_sentiment_distribution_data($toTime, $fromTime, $query, $rangeType);
            return $data;

        } else {
            return response()->json(['error' => 'Please check yout arguments'], 404);
        }
    }
    public function getCooccurDataForHA(Request $request)
    {
        if ($request->input('uniqueID') && $request->input('userID')  && $request->input('option')) {
            $uniqueID = $request->input('uniqueID');
            $userID = $request->input('userID');
            $option = $request->input('option');
            $file_path = $userID . '/' . $uniqueID . '.csv';
        } else {
            return response()->json(['error' => 'Unique ID / User ID not provided'], 404);
        }

        if ($request->input('mode')=='write') {
            if ($request->input('to') && $request->input('from') && $request->input('query')) {
                $query = $request->input('query');
                $from = $request->input('from');
                $to = $request->input('to');
                $fromTime = date('Y-m-d H:i:s', strtotime($from) + 0);
                $toTime = date('Y-m-d H:i:s', strtotime($to) + 0);
                //To Debug using the line below :: To check if all the arguments in the body are being parsed or not.
                // return response()->json(['fromDate' => $fromTime,'toDate'=>$toTime,'query'=>$query,'option'=>$option,'uniqueID'=>$uniqueID,'userID'=>$userID ,'filePath'=> $path ], 200);

                $commonObj = new CommonController;
                $data = $commonObj->get_co_occur_data($toTime, $fromTime, $query, null, $option, $file_path, true, false, $userID);
                return $data;
            } else {
                return response()->json(['error' => 'Please check yout arguments'], 404);
            }
        }else if($request->input('mode')=='read'){
            $commonObj = new CommonController;
            $limit=$request->input('limit');
            $data = $commonObj->data_formatter_for_co_occur(null, $option, $limit,$uniqueID,$file_path,$userID);
            return $data;
        }

    }
    public function  temp(){
        echo 'lol';
    }
}
