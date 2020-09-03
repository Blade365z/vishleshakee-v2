<?php

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
Route::get('/home', function () {
    if (isset($_GET['query'])) {
        $query = $_GET['query'];
        return view('modules.home', compact('query'));
    } else {
        $query = '';
        return view('modules.home', compact('query'));
    }

});
Route::get('/userAnalysis', function () {
    return view('modules.userAnalysis');
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
    Route::get('topCooccurDataPublic', 'Home@getTopCoocurDataPublic');
    Route::get('getme', 'Home@me');
    Route::get('/freqDist', 'Home@getFrequencyDistributionData');
    Route::get('/updateFreqDist', 'Home@updateFreqDistGraphRealtime');
    Route::get('/sentiDist', 'Home@getSentimentDistributionData');
    Route::get('/updateSentiDist', 'Home@updateSentiDistGraphRealtime');
    Route::get('/updateBarPlotRealTime', 'Home@updateTopCoocureDataRealtime');
    Route::get('/getTopTrendingData', 'Home@getTopTrendingData');
    Route::get('/getTweetIDs', 'Home@getTweetIDData');
    Route::get('/getTweetsRaw', 'Home@getRawTweets');

});

//Define API routes requiring middleware here.
Route::group(['prefix' => 'login'], function () {

});

//Define API routes requiring middleware here for  Historical Analysis
Route::group(['prefix' => 'HA'], function () {
    Route::get('freqDistDataHA', 'HistoricalAnalysisController@get_frequency_distribution_data_ha');
    Route::get('sentDistDataHA', 'HistoricalAnalysisController@get_sentiment_distribution_data_ha');
    Route::get('coOccurDataHA', 'HistoricalAnalysisController@get_co_occur_data_ha');
    Route::get('coOccurDataFormatterHA', 'CommonController@data_formatter_for_co_occur');
    Route::get('topDataHA', 'HistoricalAnalysisController@get_top_data_ha');
    Route::get('tweetsHA', 'HistoricalAnalysisController@get_tweets_ha');
    Route::get('getTweetsInfoHA', 'HistoricalAnalysisController@get_tweets_info_ha');
    Route::get('getUserInfoHA', 'HistoricalAnalysisController@get_user_info_ha');
});

//Define API routes requiring middleware here for Network Analysis
Route::group(['prefix' => 'NA'], function () {
    Route::get('nettest', 'networkAnalysisEvolution@tester');
    Route::get('jobsubmit', 'networkAnalysisEvolution@jobSubmission');
});

//Define API routes requiring middleware here for User Analysis
Route::group(['prefix' => 'UA'], function () {
    Route::get('/userlist', 'UserAnalysisController@first_list');
    Route::get('/getpagingstate','UserAnalysisController@get_page_state_token');
    Route::get('/getSuggestedUsers','UserAnalysisController@getSuggestedUsers');
    
});
