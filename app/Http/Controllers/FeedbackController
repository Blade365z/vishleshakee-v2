<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\TweetFeedback;
class FeedbackController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
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
        return response()->json(['message' => 'Feedback Submitted Successfully.'], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $feedbackObj =  TweetFeedback::where('userID','=',$id)->first();
        return response()->json(['message' => $feedbackObj ], 200); 
        
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    
}
