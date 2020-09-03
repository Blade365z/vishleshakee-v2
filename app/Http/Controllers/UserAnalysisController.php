<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\DBModel\DBmodel;
use App\Http\Controllers\CommonController as CC;



class UserAnalysisController extends Controller
{

    public function first_list(Request $request)
    {

        $user_name = $_GET['token'];
        $user_name = strtolower($user_name);
        $verified = $_GET['verified'];
        $clearFlag = $_GET['clearFlag'];
        if ($clearFlag == 1) {
            $request->session()->forget('page_state_token');
        }
        $lucene = '{filter: [{type: "match", field: "verified", value: "' . $verified . '"}],  query: {type: "phrase", field: "author", value: "' . $user_name . '"}}';
        $statement = "select author_id,author_screen_name,author,profile_image_url_https,verified from user_record  WHERE expr(user_record_index1,'" . $lucene . "')";
        $trigger = new DBmodel;
        if ($request->session()->has('page_state_token')) {
            $options = array(
                'page_size' => 10,
                'paging_state_token' => $request->session()->get('page_state_token'),
            );
        } else {
            $options = array(
                'page_size' => 20,
            );
        }
        $result = $trigger->execute_query($statement, $options, 'raw');
        $request->session()->put('page_state_token', $result->pagingStateToken());
        $data = array();
        foreach ($result as $record) {
            $arr['author_id'] = $record['author_id'];
            $arr['author'] = $record['author'];
            $arr['profile_image_url_https'] = $record['profile_image_url_https'];
            $arr['verified'] = $record['verified'];
            $arr['author_screen_name'] = $record['author_screen_name'];
            array_push($data, $arr);
        }
        echo json_encode($data);
    }
    public function get_page_state_token(Request $request)
    {
        $page_state = $request->session()->get('page_state_token');
        return $page_state;
    }

    public function getSuggestedUsers(){
        if(isset($_GET['userIDArray'])){
            $userIDsArr = $_GET['userIDArray'];
        }else{
            return response()->json(['error' => 'No Data Captured'], 404);
        }
        $common_object = new CC;
        echo $common_object->get_user_info($userIDsArr, true);
        }

    }
