<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
 */

//Define View Routes Here.

Route::get('/', function () {
    $URL = env('APP_URL', null);
    return redirect($URL . 'home');
});
Route::get('/home', function (Request $request) {
    $query = '';
    $from = '';
    $to = '';
    if ($request->input('query')) {
        $query = $request->input('query');
    } elseif ($request->input('query') && $request->input('from') && $request->input('to')) {
        $query = $request->input('query');
        $from = $request->input('from');
        $to = $request->input('to');
    }
    return view('modules.home', compact('query', 'from', 'to'));
});
Route::get('/userAnalysis', function (Request $request) {
    $query = '';
    $from = '';
    $to = '';
    if ($request->input('query')) {
        $query = $request->input('query');
    } elseif ($request->input('query') && $request->input('from') && $request->input('to')) {
        $query = $request->input('query');
        $from = $request->input('from');
        $to = $request->input('to');
    }
    return view('modules.userAnalysis', compact('query', 'from', 'to'));

})->middleware('auth');

Route::get('/historicalAnalysis', function () {
    return view('modules.historicalAnalysis');
})->middleware('auth');

Route::get('/networkAnalysis', function (Request $request) {
    $query = '';
    $from = '';
    $to = '';
    $uniqueID = '';
    $realtion = '';
    $user = '';
    if ($request->input('query')) {
        $query = $request->input('query');
        $from = $request->input('from');
        $to = $request->input('to');
        $uniqueID = $request->input('uniqueID');
        $relation = $request->input('realtion');
        $user = $request->input('user');
        return view('modules.networkAnalysis', compact('query', 'from', 'to','uniqueID','relation','user'));
    } else {
        return view('modules.networkAnalysis');
    }

})->middleware('auth');

Route::get('/locationMonitor', function () {
    return view('modules.locationMonitor');
})->middleware('auth');

Route::get('/trendAnalysis', function () {
    return view('modules.trendAnalysis');
})->middleware('auth');

Route::get('/feedbackPortal', function () {
    return view('modules.feedbackManage');
})->middleware('auth', 'isAdmin');

Route::get('/tracking', function (Request $request) {
    if ($request->input('tweetID')) {
        $tweetID = $request->input('tweetID');
        return view('modules.tweetTracking', compact('tweetID'));
    } else {
        return view('modules.tweetTracking');
    }

})->middleware('auth');

//Few Auth Routes
Auth::routes();
Route::get('/logout', 'Auth\LoginController@logout')->name('logout');

//Define API routes requiring middleware here.
Route::group(['prefix' => 'smat'], function () {
    Route::get('ua', 'Home@home');
    Route::post('topCooccurDataPublic', 'Home@getTopCoocurDataPublic');
    Route::get('getme', 'Home@me');
    Route::post('/freqDist', 'Home@getFrequencyDistributionData');
    Route::post('/sentiDist', 'Home@getSentimentDistributionData');
    Route::post('/readCooccurData', 'Home@readCooccurDataPublic');
    Route::post('/getTopTrendingData', 'Home@getTopTrendingData');
    Route::post('/getTweetIDs', 'Home@getTweetIDData');
    Route::get('/getTweetsRaw', 'Home@getRawTweets');
    Route::post('/getUserNameFromID', 'Home@getUserNameFromID');

});

//Define API routes requiring middleware here.
Route::group(['prefix' => 'login'], function () {

});

//Define API routes requiring middleware here for  Historical Analysis
Route::group(['prefix' => 'HA'], function () {
    Route::post('getFrequencyDataForHistorical', 'HistoricalController@getFrequencyDataForHistorical');
    Route::post('getSentimentDataForHistorical', 'HistoricalController@getSentimentDataForHistorical');
    Route::post('getCooccurDataForHA', 'HistoricalController@getCooccurDataForHA');

    //spark(advance search)
    Route::post('requestToSpark', 'HistoricalAdvanceController@requestToSpark');
    Route::post('getStatusFromSpark', 'HistoricalAdvanceController@getStatusFromSpark');
    Route::post('getOuputFromSparkAndStoreAsJSON', 'HistoricalAdvanceController@getOuputFromSparkAndStoreAsJSON');
    Route::post('storeToMySqlAdvanceSearchData', 'HistoricalAdvanceController@storeToMySqlAdvanceSearchData');

    Route::post('getFrequencyDataForHistoricalAdvance', 'HistoricalAdvanceController@getFrequencyDataForHistoricalAdvance');
    Route::post('getSentimentDataForHistoricalAdvance', 'HistoricalAdvanceController@getSentimentDataForHistoricalAdvance');
    Route::post('getCooccurDataForAdvance', 'HistoricalAdvanceController@getCooccurDataForAdvance');
    Route::post('getTweetIDForAdvance', 'HistoricalAdvanceController@getTweetIDForAdvance');




    // just for testing
    Route::get('freqDistDataHA', 'HistoricalController@getFrequencyDataForHA');
    Route::get('sentDistDataHA', 'HistoricalController@getSentimentDataForHA');
    Route::get('getCooccurDataForHA', 'HistoricalController@get_Co_occur_Data_For_HA');
    Route::get('getTopLatLngHA', 'HistoricalController@get_top_data_lat_lng_ha');
    Route::get('getTopCatLocationHA', 'HistoricalController@get_top_data_cat_location_ha');
    Route::get('genNetwork', 'CommonController@gen_network');
    Route::get('getFrequencyDistributionTweet', 'HistoricalController@getFrequencyDistributionTweetHA');

});

//Define API routes requiring middleware here for Network Analysis
Route::group(['prefix' => 'na'], function () {
    Route::get('generateNetwork', 'networkAnalysisController@generateNetwork');
    Route::post('graph_view_data_formator', 'networkAnalysisController@graph_view_data_formator_for_rendering_in_visjs');
    Route::get('readcsv', 'networkAnalysisController@read_csv_file');
    Route::get('readcsv', 'networkAnalysisController@read_csv_file');
    Route::post('centrality_data_formator', 'networkAnalysisController@centrality_data_formator_for_rendering_in_visjs');
    Route::get('mysessionid', 'networkAnalysisController@mysessionid');
    // Route::get('centrality', 'networkAnalysisController@centrality');
    Route::post('centrality', 'networkAnalysisController@centrality');

    Route::post('link_prediction_data_formator', 'networkAnalysisController@link_prediction_data_formator_new');
    Route::post('link_prediction', 'networkAnalysisController@linkPrediction');
    Route::get('shortest_path_data_formator', 'networkAnalysisController@shortest_path_data_formator_new');
    Route::post('shortestpath', 'networkAnalysisController@shortestpath');
    Route::post('communitydetection', 'networkAnalysisController@community_detection');
    Route::post('community_data_formator', 'networkAnalysisController@community_data_formator_for_rendering_in_visjs');

    Route::post('union', 'networkAnalysisController@union');
    Route::post('union_data_formator', 'networkAnalysisController@union_data_formator');
    Route::post('intersection', 'networkAnalysisController@intersection');
    Route::post('difference', 'networkAnalysisController@difference');
    Route::post('formator_inter_diff', 'networkAnalysisController@difference_data_formator');

    Route::post('writedelete', 'networkAnalysisController@write_delete');
    Route::get('isfileexist', 'networkAnalysisController@isfileexist');
    Route::post('fileupload', 'networkAnalysisController@fileupload');
    Route::get('fileUploadRequest', 'networkAnalysisController@fileUploadRequest');
    // Route::post('requestToSparkandStoreResult', 'networkAnalysisController@requestToSpark');
    Route::post('requestToSpark', 'networkAnalysisController@requestToSpark');
    Route::post('genNetwork', 'networkAnalysisController@gen_network');
    Route::get('getdirname', 'networkAnalysisController@getdirname');

    Route::get('getsparkstatus/{sparkID}', 'networkAnalysisController@getSparkStats');
    Route::post('getFromSparkAndStore', 'networkAnalysisController@getOuputFromSparkAndStore');
    //For network evolution
    Route::get('nettest', 'networkAnalysisEvolution@tester');
    Route::get('jobsubmit', 'networkAnalysisEvolution@jobSubmission');
});

//Define API routes requiring middleware here for User Analysis
Route::group(['prefix' => 'UA'], function () {
    Route::post('/userlist', 'UserAnalysisController@first_list');
    Route::get('/getpagingstate', 'UserAnalysisController@get_page_state_token');
    Route::get('/getSuggestedUsers', 'UserAnalysisController@getSuggestedUsers');
    Route::get('/getUserDetails', 'UserAnalysisController@getUserDetails');
    Route::post('/getUserDetailsTemp', 'UserAnalysisController@getUserDetails');
    Route::post('/getFrequencyDataForUser', 'UserAnalysisController@getFrequencyDataForUser');
    Route::post('/getTweetIDs', 'UserAnalysisController@getTweetIDUA');
    Route::post('/getSentimentDataForUser', 'UserAnalysisController@getSentimentDataForUser');
    Route::post('/getCooccurDataForUser', 'UserAnalysisController@getCooccurDataForUser');
});

//Define API routes requiring middleware here for Map
Route::group(['prefix' => 'LM'], function () {
    Route::post('getTweetId', 'LocationMap@get_tweet_id_list');
    Route::get('/getTime', 'LocationMap@get_current_date_time');
    Route::post('getHashtag', 'LocationMap@get_hashtags');
    Route::post('getTopHashtag', 'LocationMap@get_top_hashtags');
    Route::post('checkLocation', 'LocationMap@checkLocation_');
    Route::post('/getcityState', 'LocationMap@showData');
    Route::post('/getTweetInfo', 'LocationMap@location_tweet');
    Route::post('/getTweetInfoHome', 'LocationMap@location_tweet_home');
    

});

//Define API routes requiring middleware here for Trend Analysis
Route::group(['prefix' => 'TA'], function () {
    Route::post('/getTopTrending', 'TrendAnalysisController@getTrending');

});

//Resource Route for feedback controller
Route::post('/feedback', 'FeebackController@insertFeedback');
Route::post('/getFeedback', 'FeebackController@checkIfFeedbackExist');
Route::post('/extractFeedbacks', 'FeebackController@extractFeedbacks');

Route::resource('status', 'queryStatusController', ['except' => ['show']]);
Route::get('/status/{username}', 'queryStatusController@show');

//Define API routes requiring middleware here for Tweet Tracking
Route::group(['prefix' => 'track'], function () {
    Route::post('/getTweetInfo', 'TweetTracking@getTweetInfo');
    Route::post('/getFrequencyDistributionTweet', 'TweetTracking@getFrequencyDistributionTweet');
    Route::post('/getTweetIDsForSource', 'TweetTracking@get_tweet_idlist_for_track_type_sourceid');
});
