<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
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

Route::get('/networkAnalysis', function () {
    return view('modules.networkAnalysis');
})->middleware('auth');

Route::get('/locationMonitor', function () {
    return view('modules.locationMonitor');
})->middleware('auth');

Route::get('/trendAnalysis', function () {
    return view('modules.trendAnalysis');
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

});

//Define API routes requiring middleware here.
Route::group(['prefix' => 'login'], function () {

});

//Define API routes requiring middleware here for  Historical Analysis
// Route::group(['prefix' => 'HA'], function () {
//     Route::post('freqDistDataHA', 'HistoricalAnalysisController@getFrequencyDataForHistorical');
//     Route::post('sentDistDataHA', 'HistoricalAnalysisController@getFrequencyDataForHistorical');
//     Route::post('getCooccurDataForHA', 'HistoricalAnalysisController@getCooccurDataForHA');
//     Route::get('coOccurDataFormatterHA', 'HistoricalAnalysisController@data_formatter_for_co_occur_ha');
//     Route::get('topDataHA', 'HistoricalAnalysisController@get_top_data_ha');
//     Route::get('tweetsHA', 'HistoricalAnalysisController@get_tweets_ha');
//     Route::get('getTweetsInfoHA', 'HistoricalAnalysisController@get_tweets_info_ha');
//     Route::get('getUserInfoHA', 'HistoricalAnalysisController@get_user_info_ha');

//     Route::get('getTopLatLngHA', 'HistoricalAnalysisController@get_top_data_lat_lng_ha');
// });

//Define API routes requiring middleware here for  Historical Analysis
Route::group(['prefix' => 'HA'], function () {
    Route::post('getFrequencyDataForHistorical', 'HistoricalController@getFrequencyDataForHistorical');
    Route::post('getSentimentDataForHistorical', 'HistoricalController@getSentimentDataForHistorical');
    Route::post('getCooccurDataForHA', 'HistoricalController@getCooccurDataForHA');

    Route::get('getTopLatLngHA', 'HistoricalController@get_top_data_lat_lng_ha');
    Route::get('getTopCatLocationHA', 'HistoricalController@get_top_data_cat_location_ha');
    Route::get('genNetwork', 'CommonController@gen_network');
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
    Route::post('requestToSparkandStoreResult', 'networkAnalysisController@requestToSpark');
    Route::post('genNetwork', 'networkAnalysisController@gen_network');
    Route::get('getdirname', 'networkAnalysisController@getdirname');

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
    
});

//Define API routes requiring middleware here for Trend Analysis
Route::group(['prefix' => 'TA'], function () {
    Route::post('/getTopTrending', 'TrendAnalysisController@getTrending');

});

//Resource Route for feedback controller
Route::post('/feedback', 'FeebackController@insertFeedback');
Route::post('/getFeedback', 'FeebackController@checkIfFeedbackExist');



Route::resource('status', 'queryStatusController', ['except' => ['show']]);
Route::get('/status/{username}', 'queryStatusController@show');