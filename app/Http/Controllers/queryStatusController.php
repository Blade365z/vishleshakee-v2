<?php

namespace App\Http\Controllers;

use App\QueryStatus;
use Illuminate\Http\Request;

class queryStatusController extends Controller
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
            'queryID' => 'required',
            'userID' => 'required',
            'query' => 'required',
            'fromDate' => 'required',
            'toDate' => 'required',
        ]);
        $statusObj = new QueryStatus([
            'queryID' => $request->get('queryID'),
            'userID' => $request->get('userID'),
            'query' => $request->get('query'),
            'fromDate' => $request->get('fromDate'),
            'toDate' => $request->get('toDate'),
        ]);
        $statusObj->save();
        return response()->json(['data' => 'Submitted Successfully!'], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $statusObj = QueryStatus::where('userID', $id)->firstOrFail();
        return $statusObj;
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
