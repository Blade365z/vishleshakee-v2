<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\TweetFeedback;
class FeebackController extends Controller
{
    public function insertFeedback(Request $request){
        $request->validate([
            'userID'=>'required',
            'feedbackType'=>'required',
            'tweetID'=>'required',
            'originalTag'=>'required',
            'feedbackTag'=>'required'
        ]);
        $feedbackObj = new TweetFeedback([
            'userID' => $request->get('userID'),
            'feedbackType' => $request->get('feedbackType'),
            'tweetID' => $request->get('tweetID'),
            'originalTag' => $request->get('originalTag'),
            'feedbackTag' => $request->get('feedbackTag')
        ]);
        $feedbackObj->save();  
        return response()->json(['data' => 'Submitted Successfully!'], 200);
    }
    public function checkIfFeedbackExist(Request $request){
        $request->validate([
            'userID'=>'required',
            'feedbackType'=>'required',
            'tweetID'=>'required'
        ]);
        
        $feedbackObj = TweetFeedback::where([['userID','=',$request->get('userID')],['feedbackType','=',$request->get('feedbackType')],['tweetID','=',$request->get('tweetID')]])->get();
        return $feedbackObj;

    }
}
