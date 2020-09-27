<?php

namespace App\Http\Controllers;

use App\Http\Controllers\CommonController;
use App\User;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

date_default_timezone_set('Asia/Kolkata');

class Home extends Controller
{
    public function CurrentDateTimeGeneratorPublic($interval)
    {

        $datetimeobj = new DateTime();
        $datetime = $datetimeobj->format('Y-m-d H:i:s');
        $datetime = date('Y-m-d H:i:s', strtotime($datetime) - 60);
        $datetime = new DateTime($datetime);
        $temp_sec = (int) ($datetime->format('s')) % 10;
        $t = '-' . strval($temp_sec) . ' second';
        $datetime = $datetime->format('Y-m-d H:i:s');
        $toTime = date('Y-m-d H:i:s', strtotime($t, strtotime($datetime)));
        $fromTime = date('Y-m-d H:i:s', strtotime($toTime) - $interval);
        $dateTimeArgs = [$fromTime, $toTime];
        return $dateTimeArgs;
    }
    public function me()
    {

        try {
            if (Auth::check()) {
                $user = Auth::user()->username;
                $email = Auth::user()->email;
                $id = Auth::id();
                $role = Auth::user()->role;
                $me = ['id' => $id, 'username' => $user, 'email' => $email, 'role' => $role];
                return response()->json($me, 200);
            } else {
                return response()->json(['error' => 'not logged in '], 200);
            }
        } catch (Exception $e) {
            return response()->json(['error' => 'login status not found']);
        }
    }
    public function getUserNameFromID(Request $request)
    {
        $request->validate([
            'id' => 'required']);
        $idCaptured = $request->input('id');
        $userObj = User::where('id', '=', $idCaptured)->firstOrFail();
        $userObj=$userObj['username'];
        return response()->json(['data' => $userObj], 200);
    }
    public function getFrequencyDistributionData(Request $request)
    {
        if ($request->input('interval') && $request->input('query')) {
            $interval = $request->input('interval');
            if ($interval > 86400) {
                return response()->json(['error' => 'Not Allowed'], 404);
            }
            $query = $request->input('query');
            $dateTimeArgs = $this->CurrentDateTimeGeneratorPublic($interval);
            $freqDistObj = new CommonController;
            $freqData = $freqDistObj->get_frequency_distribution_data($dateTimeArgs[1], $dateTimeArgs[0], $query, '10sec', true, true);
            return ($freqData);
        } else if ($request->input('fromTime') && $request->input('query')) {
            $fromTime = $request->input('fromTime');
            $fromTime = date('Y-m-d H:i:s', strtotime($fromTime) + 10);
            $query = $request->input('query');
            $freqDistObj = new CommonController;
            $freqData = $freqDistObj->get_frequency_distribution_data($fromTime, $fromTime, $query, '10sec', true, true);
            $finalData = array(['data' => $freqData, 'finalTime' => $fromTime]);
            return ($finalData);
        } else {
            return response()->json(['error' => 'Arguments not set properly in http request'], 404);
        }

    }

    public function getSentimentDistributionData(Request $request)
    {
        if ($request->input('interval') && $request->input('query')) {
            $interval = $request->input('interval');
            if ($interval > 86400) {
                return response()->json(['error' => 'Not Allowed'], 404);
            }
            $query = $request->input('query');
            $dateTimeArgs = $this->CurrentDateTimeGeneratorPublic($interval);
            $sentiDistObj = new CommonController;
            $sentiData = $sentiDistObj->get_sentiment_distribution_data($dateTimeArgs[1], $dateTimeArgs[0], $query, '10sec');
            return $sentiData;
        } else if ($request->input('fromTime') && $request->input('query')) {
            $fromTime = $request->input('fromTime');
            $fromTime = date('Y-m-d H:i:s', strtotime($fromTime) + 10);
            $query = $request->input('query');
            $sentiDistObj = new CommonController;
            $sentiData = $sentiDistObj->get_sentiment_distribution_data($fromTime, $fromTime, $query, '10sec');
            $finalData = array(['data' => $sentiData, 'finalTime' => $fromTime]);
            return ($finalData);
        } else {
            return response()->json(['error' => 'interval  or query not set'], 404);
        }

    }

    public function getTopCoocurDataPublic(Request $request)
    {
        if ($request->input('interval') && $request->input('query')) {
            $interval = $request->input('interval');
            if ($interval > 86400) {
                return response()->json(['error' => 'Not Allowed'], 404);
            }
            $query = $request->input('query');
            $option = $request->input('option');
            $dateTimeArgs = $this->CurrentDateTimeGeneratorPublic($interval);
            $commonObj = new CommonController;
            $data = $commonObj->get_co_occur_data($dateTimeArgs[1], $dateTimeArgs[0], $query, '10sec', $option, null, true);
            $finalData = array(['data' => $data, 'finalTime' => $dateTimeArgs[1]]);
            return ($finalData);
        } else if ($request->input('fromTime') && $request->input('query')) {
            $fromTime = $request->input('fromTime');
            $fromTime = date('Y-m-d H:i:s', strtotime($fromTime) + 10);
            $query = $request->input('query');
            $option = $request->input('option');
            $commonObj = new CommonController;
            $data = $commonObj->get_co_occur_data($fromTime, $fromTime, $query, '10sec', $option, null, false, true);
            $finalData = array(['data' => $data, 'finalTime' => $fromTime]);
            return $finalData;
        } else {
            return response()->json(['error' => 'interval  or query not set'], 404);
        }

    }

    public function readCooccurDataPublic(Request $request)
    {
        if ($request->input('option') && $request->input('query') && $request->input('limit')) {
            $option = $request->input('option');
            $query = $request->input('query');
            $limit = $request->input('limit');
            $commonObj = new CommonController;
            $data = $commonObj->data_formatter_for_co_occur($query, $option, $limit);
            return $data;
        } else {
            return response()->json(['error' => 'Arguments not set'], 404);
        }
    }

    public function updateTopCoocureDataRealtime()
    {
        $fromTime = $_GET['finalTime'];
        $fromTime = date('Y-m-d H:i:s', strtotime($fromTime) + 10);
        $query = $_GET['query'];
        $option = $_GET['option'];
        $commonObj = new CommonController;
        $data = $commonObj->get_co_occur_data($fromTime, $fromTime, $query, '10sec', $option, null, false, true);
        $finalData = array(['data' => $data, 'finalTime' => $fromTime]);
        return $finalData;
    }

    public function getTopTrendingData(Request $request)
    {

        if ($request->input('interval')) {
            $interval = $request->input('interval');
            if ($interval > 86400) {
                return response()->json(['error' => 'Not Allowed'], 404);
            }
        } else {
            return response()->json(['error' => 'interval  or query not set'], 404);
        }
        $dateTimeArgs = $this->CurrentDateTimeGeneratorPublic($interval);
        $commonObj = new CommonController;
        $data = $commonObj->get_top_data($dateTimeArgs[1], $dateTimeArgs[0], 'top_hashtag', $limit = 50, null);
        return $data;
    }

    public function getTweetIDData($intervalArg = null, $queryArg = null, Request $request)
    {
        if (!$request->input('fromTime') || !$request->input('toTime')) {
            if ($request->input('interval') && $request->input('query')) {
                $interval = $request->input('interval');
                if ($interval > 86400) {
                    return response()->json(['error' => 'Not Allowed'], 404);
                }
                $query = $request->input('query');
            } else if ($intervalArg && $queryArg) {
                $interval = $intervalArg;
                $query = $queryArg;

            } else {
                return response()->json(['error' => 'interval  or query not set'], 404);
            }
            $dateTimeArgs = $this->CurrentDateTimeGeneratorPublic($interval);
            $fromTime = $dateTimeArgs[0];
            $toTime = $dateTimeArgs[1];
        } else {
            $fromTime = $request->input('fromTime');
            $toTime = $request->input('toTime');
            $query = $request->input('query');
        }
        if ($request->input('filter')) {
            $filter = $request->input('filter');
        } else {
            $filter = null;
        }
        $commonObj = new CommonController;
        $data = $commonObj->get_tweets($toTime, $fromTime, $query, '10sec', $filter);
        $finalData = array(['data' => $data, 'fromTime' => $fromTime, 'toTime' => $toTime]);
        return $finalData;
    }

    public function getRawTweets()
    {
        if (isset($_GET['tweet_id_list'])) {
            $tIDlist = $_GET['tweet_id_list'];
        } else {
            return response()->json(['error' => 'No Data Captured'], 404);
        }
        $commonObj = new CommonController;
        $data = $commonObj->get_tweets_info($tIDlist);
        return $data;
    }
}
