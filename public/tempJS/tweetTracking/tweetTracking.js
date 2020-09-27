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
    getTweetRAWTEMP(data, divTemp, false, analysisBtnFlag);
}

const getTweetRAWTEMP = (tweetData, div, dropDownArg = true, analysisBtnArg = false) => {
    let userIDTemp, feedback = '', analysisBtn = '';
    if (localStorage.getItem('smat.me')) {
        let userInfoJSON = JSON.parse(localStorage.getItem('smat.me'));
        userIDTemp = userInfoJSON['id'];
    }



    $('#' + div).html("");
    tweetData.forEach(tweet => {



        if (analysisBtnArg) {
            analysisBtn = '<span class="btn-primary mx-2 px-2 py-1 tweetAnalysisBtn  smat-rounded" type="button"  value="' + tweet.tid + '">Analysis</span>';
        } else {
            analysisBtn = '';
        }



        if (dropDownArg) {
            if (userIDTemp) {
                feedback = '<div class="ml-auto" > <i class="fas fa-chevron-circle-down nav-link  " id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" ></i>     <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">\
    <li class="dropdown-item clickable feedbackOption" value="'+ tweet.tid + '|' + userIDTemp + '|' + tweet.sentiment + '|' + tweet.category + '"   id="feedbackOption-' + div + tweet.tid + '">Give Feedback</li>\
    <li class="dropdown-item clickable "  id="' + div + tweet.tid + '">Track Tweet </li>\
    </div></div>';
            }
            else {
                console.log('NOT LOGGED IN');
            }
        }
        let sentiment = '', category = '', media = '', location = '';
        let senticlass = '';
        category = (tweet.category == 'normal') ? 'Normal' : ((tweet.category == 'sec') ? 'Security' : ((tweet.category == 'com') ? 'Communal' : 'Communal & Security'));
        if (tweet.sentiment === 0) {
            sentiment = 'Postive';
            senticlass = 'pos'
        } else if (tweet.sentiment === 1) {
            sentiment = 'Negative';
            senticlass = 'neg'
        } else {
            sentiment = 'Neutral';
            senticlass = 'neu'
        }

        if (tweet.t_location) {
            location = tweet.t_location;
        }


        $('#' + div).append('<div class="border  p-2 "><div class="d-flex"><div class="profilePictureDiv p-1 text-center mr-2"><img src="' + tweet.author_profile_image + '" style="height:33px;border-radius:50%" /></div><div> <p class="pt-1 m-0 font-weight-bold username"   value="' + tweet.author_id + '" >' + tweet.author + ' </p><p class="smat-dash-title pull-text-top m-0 "> @' + tweet.author_screen_name + ' </p></div> <div class="px-1 pt-1 mx-2  " >  <i class="fa fa-circle   text-' + tweet.category + '" aria-hidden="true" title="' + category + '"></i> </div> ' + feedback + '</div>  <div style="width:80%;"><p class="smat-tweet-body-text mb-1">' + tweet.tweet_text + '</p></div><div id="" class="row d-flex justify-content-center tweet_media_body_' + tweet['tid'] + '" ></div><div class="d-flex"><p class="m-0 tweet-details"> <span>  ' + tweet.datetime + '  &nbsp </span> <span>' + location + '</span> &nbsp ' + analysisBtn + ' <span class=" mx-2" >  <i class="fa fa-circle text-' + senticlass + '" aria-hidden="true" title="' + sentiment + '"></i>  ' + sentiment + '</span>              </p> </div></div>');



    });
}

const adjustLines = () => {
    let widthOfTweetCard = $('.tweetCard').css('width');
    widthOfTweetCard = widthOfTweetCard.includes('px') ? widthOfTweetCard.replace('px', '') : widthOfTweetCard;
    widthOfTweetCard = Math.round(widthOfTweetCard) / 2;

    $('.tweetBoxConnector').attr('x1', widthOfTweetCard);
    $('.tweetBoxConnector').attr('x2', widthOfTweetCard);
}

const initiateTweetAnalysis = (id, from, to, type) => {
    id = '1308832944925147146'; //hardcoding it for now.
    currentlyAnalysed = id;
    $('#analysisType').text(tweetTypeDict[type]);
    $('.TTtab').html('<div class="text-center  smat-loader " ><i class="fa fa-circle-o-notch donutSpinner mt-5" aria-hidden="true"></i></div>');
    console.log('Analysis submitted for : ' + currentlyAnalysed + ' From:' + from + ' to:' + to + ' Type:' + type);
    getFreqDataForTweets(id, from, to, 'retweet').then(response => {
        if (response.data.length < 1) {
            $('#retweetContent').html('<div class="alert-danger text-center m-3 p-2 smat-rounded"> No Data Found </div>')
        } else {
            drawFreqDataForTweet(response, 'retweetContent');
        }
    });
    getFreqDataForTweets(id, from, to, 'QuotedTweet').then(response => {
        if (response.data.length < 1) {
            $('#quotedtweetContent').html('<div class="alert-danger text-center m-3 p-2 smat-rounded"> No Data Found </div>')
        } else {
            drawFreqDataForTweet(response, 'quotedtweetContent');
        }
    });
    getFreqDataForTweets(id, from, to, 'Reply').then(response => {
        if (response.data.length < 1) {
            $('#replytweetContent').html('<div class="alert-danger text-center m-3 p-2 smat-rounded"> No Data Found </div>')
        } else {
            drawFreqDataForTweet(response, 'replytweetContent');
        }
    });
}

