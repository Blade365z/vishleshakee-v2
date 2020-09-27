<?php

namespace App\Http\Controllers;

use App\TweetFeedback;
use Illuminate\Http\Request;

class FeebackController extends Controller
{
    public function insertFeedback(Request $request)
    {
        $request->validate([
            'userID' => 'required',
            'feedbackType' => 'required',
            'tweetID' => 'required',
            'originalTag' => 'required',
            'feedbackTag' => 'required',
        ]);
        $feedbackObj = new TweetFeedback([
            'userID' => $request->get('userID'),
            'feedbackType' => $request->get('feedbackType'),
            'tweetID' => $request->get('tweetID'),
            'originalTag' => $request->get('originalTag'),
            'feedbackTag' => $request->get('feedbackTag'),
        ]);
        $feedbackObj->save();
        return response()->json(['data' => 'Submitted Successfully!'], 200);
    }
    public function checkIfFeedbackExist(Request $request)
    {
        $request->validate([
            'userID' => 'required',
            'feedbackType' => 'required',
            'tweetID' => 'required',
        ]);

        $feedbackObj = TweetFeedback::where([['userID', '=', $request->get('userID')], ['feedbackType', '=', $request->get('feedbackType')], ['tweetID', '=', $request->get('tweetID')]])->get();
        return $feedbackObj;

    }

    public function extractFeedbacks(Request $request)
    {
        $request->validate([
            'from' => 'required',
            'to' => 'required',
        ]);
        $fromDate = date('Y-m-d H:i:s', strtotime($request->input('from')) + 0);
        $toDate = date('Y-m-d H:i:s', strtotime($request->input('to')) + 86400);
        if ($fromDate && $toDate && !$request->input('userID') && !$request->input('filter')) {
   
            $feedbackObj = TweetFeedback::where([['created_at', '>',  $fromDate], ['created_at', '<', $toDate]])->get();
            return $feedbackObj;
        } else if ($fromDate && $toDate && $request->input('userID') && !$request->input('filter')) {
            $feedbackObj = TweetFeedback::where([['userID', '=', $request->get('userID')]])->get();
            return $feedbackObj;
        } else if ($fromDate && $toDate && !$request->input('userID') && $request->input('filter')) {
            $feedbackObj = TweetFeedback::where([['feedbackType', '=', $request->get('filter')]])->get();
            return $feedbackObj;

        } else if ($fromDate && $toDate && $request->input('userID') && $request->input('filter')) {
            $feedbackObj = TweetFeedback::where([['userID', '=', $request->get('userID')], ['feedbackType', '=', $request->get('filter')]])->get();
            return $feedbackObj;
        }

    }

}
