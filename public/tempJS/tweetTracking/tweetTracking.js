/*
The Script contains the modules to render charts in Modules namely Tweet Tracking (Authunticated) of  of the Social Media Analysis tool 
developed at OSINT LAB , IIT-G

-----------------------------
IMPORTANT NOTE
-----------------------------
1.Use camelCase notations:)
2.Avoid using synchronous requests as XML-http-requests has been deprecated already.


Script written by : Mala Das(maladas601@gmail.com), Amitabh Boruah(amitabhyo@gmail.com)
*/


/*
Test ID's:
1. Retweet : 3257530106
2. Quoted : 1303260892776128512
3: Three levels : 1303260736936792064,1303260963039133698
retweet,reply,tweet,quotedTweet

http://172.16.117.160/vishleshakee/tracking?tweetID=1310236170706497538
*/

import { get_tweets_info_AjaxRequest, generate_tweets_div } from '../utilitiesJS/TweetGenerator.js';
import { getTweetInfo, getFreqDataForTweets } from './helper.js';
import { makeSmatReady } from '../utilitiesJS/smatExtras.js';
import { getCurrentDate, getRangeType, dateProcessor } from '../utilitiesJS/smatDate.js';
import { drawFreqDataForTweet } from './chartHelper.js';


//Globals
var tweetDiv = 'tweetDiv';
var currentQuery, currentlyAnalysed, fromDate, toDate;
var divOffsetFlag = 0, trackTweetHistory; //As in offset 0 the currently searched Tweet would be printed;
const tweetTypeDict = { 'Tweet': 'Source Tweet', 'retweet': 'Re Tweet', 'QuotedTweet': 'Quoted Tweet', 'Reply': 'Reply Tweet' };
var historyJSON = {};

//Logic
jQuery(function () {
    makeSmatReady();
    $('body').on('click', 'div .username', function () {
        let queryCaptured = '$' + $(this).attr('value');
        queryCaptured = encodeURIComponent(queryCaptured);
        let redirectURL = 'userAnalysis' + '?query=' + queryCaptured + '&from=' + fromDate + '&to=' + toDate;
        window.open(redirectURL, '_blank');
      });
    toDate = getCurrentDate()
    fromDate = dateProcessor(toDate, '-', 7);
    $('#fromDateTT').val(fromDate);
    $('#toDateTT').val(toDate);

    $('body').on('click', 'div .tweetAnalysisBtn', function () {
        let idCaptured = $(this).attr('value');
        initiateTweetAnalysis(idCaptured, fromDate, toDate, historyJSON[idCaptured]['type']);
    })

    $('#ttDateForm').on('submit', function (e) {
        e.preventDefault();
        fromDate = $('#fromDateTT').val();
        toDate = $('#toDateTT').val();
        initiateTweetAnalysis(currentlyAnalysed, fromDate, toDate, historyJSON[currentlyAnalysed]['type']);
    })


    if (tweetIDCaptured) {
        currentQuery = tweetIDCaptured;
    } else {
        console.log('Nothing capt.')
    }

    //Check if currently queried Tweet is the sourceTweetAlready!
    getTweetInfo(currentQuery).then(response => {
        if (response.type === 'Tweet') {
            printTweetOnDiv(response, 1, 'Tweet');
            let tid = response.tid;
            historyJSON[tid] = { 'type': response.type , 'source': null };
            //TRIGGER INITIATE ANALYSIS HERE
            initiateTweetAnalysis(tid, fromDate, toDate, historyJSON[tid]['type'])
        } else {
            findHistoryIDs(currentQuery);
        }
    });

});


// This function is currently performning in recurssion. Please check if there are other methods.!
const findHistoryIDs = async (searhIDTemp) => {
    console.log('Tracing history Please wait..')
    getTweetInfo(searhIDTemp).then(response => {
        let type = '', tempArr, tid;
        if (response.type === 'Tweet') {
            type = 'Tweet';
            tid = response.tid;
            historyJSON[tid] = { 'type': type, 'source': null };
            //TRIGGER INITIATE ANALYSIS HERE


            initiateTweetAnalysis(tid, fromDate, toDate, historyJSON[tid]['type'])
            printTweetOnDiv(response, 3, type);

        } else if (response.type === 'retweet') {
            type = 'retweet';
            tid = response.tid;
            historyJSON[tid] = { 'type': type, 'source': response.retweet_source_id };
            let offset = divOffsetFlag === 0 ? 1 : 2;
            printTweetOnDiv(response, offset, type);
            findHistoryIDs(response.retweet_source_id)
        } else if (response.type === "QuotedTweet") {
            type = 'QuotedTweet';
            tid = response.tid;
            historyJSON[tid] = { 'type': type, 'source': response.quoted_source_id };
            let offset = divOffsetFlag === 0 ? 1 : 2;
            printTweetOnDiv(response, offset, type);
            findHistoryIDs(response.quoted_source_id)

        } else if (response.type === "Reply") {
            type = 'Reply';
            tid = response.tid;
            historyJSON[tid] = { 'type': type, 'source': response.replyto_source_id };
            let offset = divOffsetFlag === 0 ? 1 : 2;
            printTweetOnDiv(response, offset, type);
            findHistoryIDs(response.replyto_source_id)

        }
    });
}




const printTweetOnDiv = (data, offset, type) => {
    adjustLines();
    divOffsetFlag = 1; //TODO check left for source.
    $('.level' + '-' + offset).css('display', 'block');
    let divTemp = tweetDiv + '-' + offset;
    data = [data];
    let analysisBtnFlag = false
    if (type === 'QuotedTweet' || type === 'Reply' || type === 'Tweet') {
        analysisBtnFlag = true
    }
    $('#tweetTitle' + '-' + offset).text(tweetTypeDict[type]);
    generate_tweets_div(data, divTemp,true,analysisBtnFlag)

}




const adjustLines = () => {
    let widthOfTweetCard = $('.tweetCard').css('width');
    widthOfTweetCard = widthOfTweetCard.includes('px') ? widthOfTweetCard.replace('px', '') : widthOfTweetCard;
    widthOfTweetCard = Math.round(widthOfTweetCard) / 2;

    $('.tweetBoxConnector').attr('x1', widthOfTweetCard);
    $('.tweetBoxConnector').attr('x2', widthOfTweetCard);
}

const initiateTweetAnalysis = (id, from, to, type) => {
    // id = '1308832944925147146'; //hardcoding it for now.
    currentlyAnalysed = id;
    $('#analysisType').text(tweetTypeDict[type]);
    $('.TTtab').html('<div class="text-center  smat-loader " ><i class="fa fa-circle-o-notch donutSpinner mt-5" aria-hidden="true"></i></div>');
    console.log('Analysis submitted for : ' + currentlyAnalysed + ' From:' + from + ' to:' + to + ' Type:' + type);
    getFreqDataForTweets(id, from, to, 'retweet').then(response => {
        if (response.data.length < 1) {
            $('#retweetContent').html('<div class="alert-danger text-center m-3 p-2 smat-rounded"> No Data Found </div>')
        } else {
            drawFreqDataForTweet(response, 'retweetContent',id, 'retweet');
        }
    });
    getFreqDataForTweets(id, from, to, 'QuotedTweet').then(response => {
        if (response.data.length < 1) {
            $('#quotedtweetContent').html('<div class="alert-danger text-center m-3 p-2 smat-rounded"> No Data Found </div>')
        } else {
            drawFreqDataForTweet(response, 'quotedtweetContent',id,'QuotedTweet');
        }
    });
    getFreqDataForTweets(id, from, to, 'Reply').then(response => {
        if (response.data.length < 1) {
            $('#replytweetContent').html('<div class="alert-danger text-center m-3 p-2 smat-rounded"> No Data Found </div>')
        } else {
            drawFreqDataForTweet(response, 'replytweetContent',id, 'Reply');
        }
    });
}

