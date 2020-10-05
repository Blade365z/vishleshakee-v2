//User Analysis Logic For Vishleshakee version 2.0 , Deployed by OSINT Lab ,IIT-G
//Witten By :: Mala Das , Amitabh Boruah 

//Use camelCase please notations:)



//Imports

import { formulateUserSearch } from '../utilitiesJS/userSearch.js';
import { get_tweet_location, getCompleteMap } from '../utilitiesJS/getMap.js';
import { getSuggestionsForUA, getUserDetails, getFreqDistDataForUA, getTweetIDsForUA, getSentiDistDataForUA, getCooccurDataForUA } from './helper.js';
import { getCurrentDate, getRangeType, dateProcessor, getDateInFormat } from '../utilitiesJS/smatDate.js';
import { TweetsGenerator } from '../utilitiesJS/TweetGenerator.js';
import { generateUniqueID } from '../utilitiesJS/uniqueIDGenerator.js';
import { generateFreqDistBarChart, generateFrequencyLineChart, generateSentiDistBarChart, generateSentiDistLineChart, generateBarChartForCooccur } from './chartHelper.js';
import { getRelationType, makeSmatReady } from '../utilitiesJS/smatExtras.js'
import { forwardToNetworkAnalysis, forwardToHistoricalAnalysis } from '../utilitiesJS/redirectionScripts.js';


//Global Declaration
var suggestionPopularIDs = ['$18839785', '$1447949844', '$1346439824', '$405427035', '$3171712086', '$1153045459', '$24705126', '$131188226', '$2570829264', '$207809313', '$2584552812', '$336611577', '$841609973687762944', '$4743651972', '$2166444230', '$3314976162', '$627355202', '$295833852', '$97217966', '$478469228', '$2541363451', '$39240673'];

var suggestionPopularNewsHandleIDs = ['$19897138', '$16343974', '$39240673', '$240649814', '$42606652', '$321271735', '$372754427', '$6509832', '$6433472', '$36327407', '$37034483', '$20751449', '$112404600', '$438156528', '$739053070932287488', '$267158021', '$128555221', '$742143', '$759251', '$701725963', '$55186601', '$28785486'];
var SearchID, fromDate, toDate;   //Global Variable to keep Track of current search
var mentionUniqueID, hashtagsUniqueID, userID;
var suggShowFLag = 1;
//Logic Implementation 
jQuery(function () {
    makeSmatReady();
    if (localStorage.getItem('smat.me')) {
        let userInfoTemp = JSON.parse(localStorage.getItem('smat.me'));
        userID = userInfoTemp['id'];
    } else {
        window.location.href = 'login';
    }
    toDate = getCurrentDate()
    fromDate = dateProcessor(toDate, '-', 3);
    if (incoming) {
        if (fromDateReceived && toDateReceived) {
            fromDate = fromDateReceived;
            toDate = toDateReceived;
        }
        SearchID = incoming;
        initateUserSearch(SearchID);
    }

    $('.nav-item ').removeClass('smat-nav-active');
    $('#nav-UA').addClass('smat-nav-active');
    generateSuggestions(suggestionPopularIDs, 'suggUsers', 'users')
    generateSuggestions(suggestionPopularNewsHandleIDs, 'suggNews', 'news')
    // generateSuggestions(null, 'suggNews')


    $('#fromDateUA').val(fromDate);
    $('#toDateUA').val(toDate);


    $('#uaDateForm').on('submit', function (e) {
        e.preventDefault();
        fromDate = $('#fromDateUA').val();
        toDate = $('#toDateUA').val();
        initateUserSearch(SearchID);

    });

    $('#uaSearchForm').on('submit', function (e) {
        e.preventDefault();
        let tokenCapturedForSearch = $('#queryUASearch').val();
        tokenCapturedForSearch = tokenCapturedForSearch.trim();
        formulateUserSearch(tokenCapturedForSearch, 'userContainerList');
    });

    $('body').on('click', '.authorName', function () {
        let capturedID = $(this).attr('value');
        $('.modal').modal('hide');
        initateUserSearch(capturedID);
    })


    $('.suggHandles').on('click', function () {
        let capturedToken = $(this).attr('value');
        initateUserSearch(capturedToken);
    });


    let tweetDivHeight = $('#userInfoDiv').height();
    $('#uaTweetsDiv').css('max-height', tweetDivHeight - 10 + 'px');

    $('body').on('click','div .closeGraph',function(){
        let valueCapt = $(this).attr('value');
        $('.'+valueCapt).remove();
    });

    $('#showUAsugg').on('click', function () {
        suggestionToggle();
    });

    $('#locationTabUA').on('click', function () {
        $('#locationContentUA').html('<div id="result-div-map" style="height:400px;"></div>');
        let rangeType = getRangeType(fromDate, toDate);

        get_tweet_location(SearchID, fromDate, toDate, rangeType, null).then(response => {
            console.log(response);
            getCompleteMap('result-div-map', response);
            for (var i = 0; i < response.length; i++) {

            }
        });

    });

    $('body').on('click', 'div .query', function () {
        let queryCaptured = $(this).text().trim();
        forwardToHistoricalAnalysis(queryCaptured, fromDate, toDate);
    });

    $('body').on('click', 'div .analyzeNetworkButton', function () {
        let args = $(this).attr('value');
        args = args.split(/[|]/).filter(Boolean);
        forwardToNetworkAnalysis(args);
    })



    $('body').on('click', 'div .filterTweets', function () {
        let args = $(this).attr('value');
        args = args.split(/[|]/).filter(Boolean);

        if (args[4] === 'hour' || args[4] === 'day') {
            getTweetIDsForUA(SearchID, args[1], args[2], args[4], args[0]).then(response => {
                TweetsGenerator(response.data, 6, args[3], args[1], args[2], true, args[4]);
            });
        } else if (args[4] === '10sec') {
            getTweetIDsForUA(SearchID, args[1], args[2], args[4], args[0], 1).then(response => {
                TweetsGenerator(response.data, 6, args[3], args[1], args[2], true, args[4]);
            });
        }
    })
});

const generateSuggestions = (userIDArray, div, type = null) => {
    let cookie = 'smat-' + type + '-suggestionJSON';
    let helperResult;
    if (localStorage.getItem(cookie)) {
        helperResult = JSON.parse(localStorage.getItem(cookie));
    } else {
        helperResult = getSuggestionsForUA(userIDArray);
        localStorage.setItem(cookie, JSON.stringify(helperResult));
    }
    let counter = 0;
    let index = 1;
    helperResult.forEach(element => {
        counter++;
        if (counter === 12)
            index = 2
        $('#' + div + '-' + index).append('<div class="suggHandles" title="' + element[1] + '"  value="' + element[0] + '"> <img src="' + element[3] + '" class="profilePicSmall UAProfilePicture" /> </div>');
    });

}

const initateUserSearch = (id) => {
    SearchID = id
    mentionUniqueID = generateUniqueID();
    hashtagsUniqueID = generateUniqueID();
    getUserDetails(SearchID).then(data => makePageReady(data));
    let rangeType = getRangeType(fromDate, toDate);
    window.history.pushState("", "", 'userAnalysis?query=' + encodeURIComponent(SearchID) + '&from=' + fromDate + '&to=' + toDate);
    frequencyDistributionUA(SearchID, rangeType, fromDate, toDate, null, 'freqContentUA', false);

    sentimentDistributionUA(SearchID, rangeType, fromDate, toDate, null, 'sentiContentUA', false);
    //forHashtagsGraph
    plotDistributionGraphUA(SearchID, fromDate, toDate, 'hashtag', hashtagsUniqueID, userID, 'hashtagsContentTab');
    //forMentionsGraph
    plotDistributionGraphUA(SearchID, fromDate, toDate, 'mention', mentionUniqueID, userID, 'mentionsContentUA');
}
const makePageReady = (userDetails) => {
    if (suggShowFLag === 1) {
        suggestionToggle();
    }
    $('.haTab').removeClass('active show');
    $('#freqContentUA').addClass('active show');
    $('.uaNav').removeClass('active');
    $('#frqTabUA').addClass('active');
    $('#UAAnalysisDiv').css('display', 'block');
    $("#currentUAProfilePic").attr("src", userDetails.profile_image_url_https.includes('_normal') ? userDetails.profile_image_url_https.replace('_normal', '') : userDetails.profile_image_url_https);
    $('#currentUAUserName').text(userDetails.author);
    $('#showingResultsFor').text(userDetails.author);
    $('#currentUAVerified').html(userDetails.verified === "True" ? '<img class="verifiedIcon" src="public/icons/smat-verified.png"/>' : '');

    $('#currentUAUserHandle').text('@' + userDetails.author_screen_name);
    $('#userDetailsID').text(SearchID.replace('$', ''));
    let createdOn = new Date(userDetails.created_at.seconds * 1000);
    $('#userDetailsJOINEDON').text(createdOn);
    $('#userDetailsLOCATION').text(userDetails.location == null ? 'Location not shared by user' : userDetails.location);
    $('#userDetailsBIO').text(userDetails.description == null ? 'Bio not available' : userDetails.description);
    $('#userDetailsURL').html(userDetails.url == null ? 'URL not available' : '<a href=' + userDetails.url + ' target="_blank">' + userDetails.url + '</a>');

    let tweetDivHeight = $('#ua-leftDiv').height();
    $('.uaTabTopRight').css('height', tweetDivHeight - 78 + 'px');
}


//Frequency Distribution chart Logic starts here
/*
Please NOTE :
1. Set a global with value defined as the parent div to ease the process we  need to append the chart.
2.Set append Args to True when append is requeired
*/
let freqParentDiv = 'freqContentUA';
export const frequencyDistributionUA = (query = null, rangeType, fromDate = null, toDate = null, toTime = null, div, appendArg = false) => {
    let chartType = 'freq-chart';
    let appendedChartParentID = rangeType + '-' + chartType;
    $('.' + appendedChartParentID).remove();

    let chartDivID = div + '-' + rangeType + '-chart';
    let summaryDivID = div + '-' + rangeType + '-summary';
    let chartTweetDivID = div + rangeType + '-tweets';
    // class="' + rangeType + '-charts"
    if (rangeType == 'hour') {
        $('.hour-' + chartType).remove();
        $('.10sec-' + chartType).remove();
    }
    if (appendArg) {
        $('#' + freqParentDiv).append('<div class=" mt-2   appendedChart ' + appendedChartParentID + '"><div class="d-flex"> <div class="mr-auto closeGraph"    value="' + rangeType + '-freq-chart" title="close" >  <i class="fas fa-times"></i> </div> </div> <div class="row"><div class="col-sm-8"><div class="uaTab freqDistChart resultDiv  chartDiv border" id="' + chartDivID + '" ></div></div><div class="col-sm-4"><div class="freqDistTweets border resultDiv " id="' + chartTweetDivID + '"></div><div class="freqDistSummary border d-flex pt-2 resultDiv "  id="' + summaryDivID + '" ></div></div></div></div>');
    } else {
        $('#' + div).html('<div><div class="row"><div class="col-sm-8"><div class="uaTab freqDistChart border resultDiv  chartDiv" id="' + chartDivID + '" ></div></div><div class="col-sm-4"><div class="freqDistTweets resultDiv   border" id="' + chartTweetDivID + '"></div><div class="freqDistSummary border d-flex pt-2 resultDiv "  id="' + summaryDivID + '" ></div></div></div></div>');
    }
    //Loader...
    $('#' + chartDivID).html('<div class="text-center pt-5  " ><i class="fa fa-circle-o-notch donutSpinner" aria-hidden="true"></i></div>')
    $('#' + chartTweetDivID).html('<div class="text-center pt-5 " ><i class="fa fa-circle-o-notch donutSpinner" aria-hidden="true"></i></div>');
    if (rangeType == 'day') {
        getFreqDistDataForUA(query, fromDate, toDate, null, rangeType, 0).then(response => {
            if (response.data.length < 1) {
                $('.resultDiv').html('<div class="alert-danger text-center m-3 p-2 smat-rounded"> No Data Found </div>')
            } else {
                generateFreqDistBarChart(query, response, rangeType, chartDivID);
                freqSummaryGenerator(response, summaryDivID, rangeType);
                getTweetIDsForUA(query, fromDate, toDate, rangeType, null).then(response => {
                    TweetsGenerator(response.data, 6, chartTweetDivID, fromDate, toDate, true, rangeType);
                });
            }

        });


    } else if (rangeType == 'hour') {
        getFreqDistDataForUA(query, fromDate, toDate, null, rangeType, 0).then(response => {
            if (response.data.length < 1) {
                $('.resultDiv').html('<div class="alert-danger text-center m-3 p-2 smat-rounded"> No Data Found </div>')
            } else {
                generateFreqDistBarChart(query, response, rangeType, chartDivID);
                freqSummaryGenerator(response, summaryDivID, rangeType);
                getTweetIDsForUA(query, fromDate, toDate, rangeType, null).then(response => {
                    TweetsGenerator(response.data, 6, chartTweetDivID, fromDate, toDate, true, rangeType);
                });
            }
        });

    } else {
        getFreqDistDataForUA(query, fromDate, toDate, null, rangeType, 1).then(response => {
            if (response.data.length < 1) {
                $('.resultDiv').html('<div class="alert-danger text-center m-3 p-2 smat-rounded"> No Data Found </div>')
            } else {
                generateFrequencyLineChart(query, response, rangeType, chartDivID);
                freqSummaryGenerator(response, summaryDivID, rangeType);
                getTweetIDsForUA(query, fromDate, toDate, rangeType, null, 1).then(response => {
                    let fromDateTemp = fromDate.split(/[ ,]+/).filter(Boolean);
                    TweetsGenerator(response.data, 6, chartTweetDivID, fromDate, fromDate, true, rangeType);
                });
            }
        });
    }

}
let sentiParentDiv = 'sentiContentUA';
export const sentimentDistributionUA = (query = null, rangeType, fromDate = null, toDate = null, toTime = null, div, appendArg = false) => {
    let chartType = 'senti-chart';
    let appendedChartParentID = rangeType + '-' + chartType;
    $('.' + appendedChartParentID).remove();
    let chartDivID = div + '-' + rangeType + '-chart';
    let summaryDivID = div + '-' + rangeType + '-summary';
    let chartTweetDivID = div + rangeType + '-tweets';
    if (rangeType == 'hour') {
        $('.hour-' + chartType).remove();
        $('.10sec-' + chartType).remove();
    }
    if (appendArg) {
        $('#' + sentiParentDiv).append('<div class=" mt-2 ' + appendedChartParentID + '"><div class="d-flex"> <div class="mr-auto closeGraph"    value="' + rangeType + '-senti-chart" title="close" >  <i class="fas fa-times"></i> </div> </div> <div class="row"><div class="col-sm-8"><div class="uaTab sentiDistChart chartDiv resultDiv  border" id="' + chartDivID + '" ></div></div><div class="col-sm-4"><div class="sentiDistTweets  resultDiv border" id="' + chartTweetDivID + '"></div><div class="sentiDistSummary border  resultDiv d-flex pt-2"  id="' + summaryDivID + '" ></div></div></div></div>');
    } else {
        $('#' + div).html('<div><div class="row"><div class="col-sm-8"><div class="uaTab resultDiv  sentiDistChart  chartDiv border"  id="' + chartDivID + '" ></div></div><div class="col-sm-4"><div class="sentiDistTweets  resultDiv border" id="' + chartTweetDivID + '"></div><div class="sentiDistSummary resultDiv  border d-flex pt-2"  id="' + summaryDivID + '" ></div></div></div></div>');
    }
    //Loader...
    $('#' + chartDivID).html('<div class="text-center pt-5 " ><i class="fa fa-circle-o-notch donutSpinner" aria-hidden="true"></i></div>')
    $('#' + chartTweetDivID).html('<div class="text-center pt-5 " ><i class="fa fa-circle-o-notch donutSpinner" aria-hidden="true"></i></div>');
    if (rangeType == 'day') {
        getSentiDistDataForUA(query, fromDate, toDate, null, rangeType, 0).then(response => {
            if (response.data.length < 1) {
                $('.resultDiv').html('<div class="alert-danger text-center m-3 p-2 smat-rounded"> No Data Found </div>')
            } else {
                generateSentiDistBarChart(response, query, rangeType, chartDivID);
                generateSentimentSummary(response, summaryDivID, rangeType);
                getTweetIDsForUA(query, fromDate, toDate, rangeType, null).then(response => {
                    TweetsGenerator(response.data, 6, chartTweetDivID, fromDate, toDate, true, rangeType);
                });
            }

        });

    } else if (rangeType == 'hour') {
        getSentiDistDataForUA(query, fromDate, toDate, null, rangeType, 0).then(response => {
            if (response.data.length < 1) {
                $('.resultDiv').html('<div class="alert-danger text-center m-3 p-2 smat-rounded"> No Data Found </div>')
            } else {
                generateSentiDistBarChart(response, query, rangeType, chartDivID);
                generateSentimentSummary(response, summaryDivID, rangeType);
                getTweetIDsForUA(query, fromDate, toDate, rangeType, null).then(response => {
                    TweetsGenerator(response.data, 6, chartTweetDivID, fromDate, toDate, true, rangeType);
                });
            }
        });
    } else {

        getSentiDistDataForUA(query, fromDate, toDate, null, rangeType, 1).then(response => {
            if (response.data.length < 1) {
                $('.resultDiv').html('<div class="alert-danger text-center m-3 p-2 smat-rounded"> No Data Found </div>')
            } else {
                generateSentiDistLineChart(query, response, rangeType, chartDivID);
                generateSentimentSummary(response, summaryDivID, rangeType);
                getTweetIDsForUA(query, fromDate, toDate, rangeType, null, 1).then(response => {
                    let fromDateTemp = fromDate.split(/[ ,]+/).filter(Boolean);
                    TweetsGenerator(response.data, 6, chartTweetDivID, fromDate, fromDate, true, rangeType);
                });
            }
         });
    }



}

const plotDistributionGraphUA = (query, fromDate, toDate, option, uniqueID, userID, div) => {
    //Loader...
    let chartDivID = option + '-chart';
    $('#' + div).html('<div class="text-center pt-5 " ><i class="fa fa-circle-o-notch donutSpinner" aria-hidden="true"></i></div>');
    getCooccurDataForUA(query, fromDate, toDate, option, uniqueID, userID).then(response => {
        let relType= getRelationType(query,option);  
        $('#' + div).html('<div class="d-flex"> <span class="ml-auto mr-3"><p class="m-0 smat-box-title-large font-weight-bold text-dark" id="' + option + '-total">0</p><p class="pull-text-top smat-dash-title m-0 ">Total Nodes</p></span> <button class="btn btn-primary  smat-rounded  mr-1  mt-1 analyzeNetworkButton "   value="' + query + '|' + toDate + '|' + fromDate + '|' + relType + '|' + uniqueID + '|' + userID + '" > <span> Analyse network </span> </button></div><div class="px-3" id="' + chartDivID + '" style="min-height:30%;"></div>');
        response.length < 1 ? $('#' + div).html('<div class="alert-danger text-center m-3 p-2 smat-rounded"> No Data Found </div>') : generateBarChartForCooccur(query, response[0]['data'], chartDivID, option, fromDate, toDate);
        $('#' + option + '-total').text(response[0]['nodes']);
    });
    0.
}


//Summary Scripts
const freqSummaryGenerator = (data = null, div, rangeType) => {
    data = data['data'];
    $('#' + div).html('<div class="d-flex"> <span class="mx-2"><p class="m-0 smat-box-title-large font-weight-bold text-dark" id="freqTotalPublic-' + rangeType + '">0</p><p class="pull-text-top smat-dash-title m-0 ">Tweets Arrived</p></span></div><div class="d-flex "><span class="mx-2"><p class="m-0 smat-box-title-large font-weight-bold text-normal" id="publicNormalTotal-' + rangeType + '">0</p><p class="pull-text-top smat-dash-title m-0 ">Normal</p></span><span class="mx-2"><p class="m-0 smat-box-title-large font-weight-bold text-sec" id="publicSecTotal-' + rangeType + '">0</p><p class="pull-text-top smat-dash-title m-0">Security</p></span><span class="mx-2"><p class="m-0 smat-box-title-large font-weight-bold text-com" id="publicComTotal-' + rangeType + '">0</p><p class="pull-text-top smat-dash-title m-0">Communal</p></span><span class="mx-2"><p class="m-0 smat-box-title-large font-weight-bold text-com_sec" id="publiccom_secTotal-' + rangeType + '">0</p><p class="pull-text-top smat-dash-title m-0">Sec.& Com.</p></span></div>');

    let freqTotal = 0, totalNormal = 0, totalSec = 0, totalCom = 0, totalcom_sec = 0;
    data.forEach(element => {
        freqTotal += element[1];
        totalNormal += element[5];
        totalSec += element[3];
        totalCom += element[2];
        totalcom_sec += element[4];

    });

    $('#freqTotalPublic-' + rangeType).text(freqTotal);
    $('#publicNormalTotal-' + rangeType).text(totalNormal);
    $('#publicSecTotal-' + rangeType).text(totalSec);
    $('#publicComTotal-' + rangeType).text(totalCom);
    $('#publiccom_secTotal-' + rangeType).text(totalcom_sec);



}
const generateSentimentSummary = (data = null, div, range) => {
    let arrTemp = [];
    let posSumTemp = 0, negSumTemp = 0, neuSumTemp = 0;
    if (data['data'].length > 0) {
        data['data'].forEach(element => {
            posSumTemp += parseInt(element[1]);
            negSumTemp += parseInt(element[2]);
            neuSumTemp += parseInt(element[3]);
        });
    }
    $('#' + div).html('<div class="sentiSummaryDiv" id="sentiSummary' + range + '" ><div class="removeMarginMediaQuery"  > <div  id="sentiSummaryBar-' + range + '" ></div> </div><div> <div class="d-flex "><div><p class=" smat-box-title-large m-0 font-weight-bold text-dark ">' + posSumTemp + '</p><p class="pull-text-top m-0 smat-dash-title ">Positive</p></div><div class="mx-2"><p class=" smat-box-title-large m-0 font-weight-bold text-dark ">' + neuSumTemp + '</p><p class="pull-text-top m-0 smat-dash-title ">Neutral</p></div><div class="mx-2"><p class=" smat-box-title-large m-0 font-weight-bold text-dark ">' + negSumTemp + '</p><p class="pull-text-top m-0 smat-dash-title ">Negative</p></div></div></div></div>');

    arrTemp = [posSumTemp, negSumTemp, neuSumTemp];
    generateSentimentSummaryBar(arrTemp, "sentiSummaryBar-" + range, 'hour')
}
const generateSentimentSummaryBar = (sentiTotalArray, div, range_type) => {

    let total_pos = sentiTotalArray[0];
    let total_neg = sentiTotalArray[1];
    let total_neu = sentiTotalArray[2];

    $('#' + div).html('<div class="row  p-1"> <span style="display: inline-block;"><div class=" sentiment_bar_summary border sentiment_bar_pos" id="' + div + '_bar_' + range_type + '_pos" data-toggle="popover"  data-content="' + total_pos + ' Positive Tweets posted"></div> </span> <span style=" display: inline-block;"><div class="  sentiment_bar_summary border sentiment_bar_neu "  id="' + div + '_bar_' + range_type + '_neu" data-toggle="popover" data-content="' + total_neu + ' Neutral Tweets posted"></div>  </span> <span style=" display: inline-block;"><div class=" sentiment_value_neg sentiment_bar_summary border sentiment_bar_neg"  id="' + div + '_bar_' + range_type + '_neg"data-toggle="popover"  data-content="' + total_neg + ' Negative Tweets posted"></div></span></div ><div class="row"><span>  <a class="senti_summary_bar_text"  id="' + div + '_value_' + range_type + '_pos" >23%</a>  </span><span> <a  class="senti_summary_bar_text"  id="' + div + '_value_' + range_type + '_neu" >48%</a>   </span> <span><a class="senti_summary_bar_text"  id="' + div + '_value_' + range_type + '_neg" >29%</a></span>');

    var total = total_pos + total_neg + total_neu;


    var pos = Math.round((total_pos / total) * 100);
    var neg = Math.round((total_neg / total) * 100);
    var neu = Math.round((total_neu / total) * 100);


    $('#' + div + '_bar_' + range_type + '_pos').css('width', pos + 'px');
    $('#' + div + '_bar_' + range_type + '_neg').css('width', neg + 'px');
    $('#' + div + '_bar_' + range_type + '_neu').css('width', neu + 'px');

    $('#' + div + '_value_' + range_type + '_pos').css('margin-left', (pos / 4) + 'px');
    $('#' + div + '_value_' + range_type + '_neg').css('margin-left', (neg / 4) + 5 + 'px');
    $('#' + div + '_value_' + range_type + '_neu').css('margin-left', (neu / 4) + 5 + 'px');


    $('#' + div + '_value_' + range_type + '_pos').text(pos + '%');
    $('#' + div + '_value_' + range_type + '_neg').text(neg + '%');
    $('#' + div + '_value_' + range_type + '_neu').text(neu + '%');


}

//Tooggling the Suesstion List
const suggestionToggle = () => {
    if (suggShowFLag == 0) {
        $('#suggDiv').css('display', 'flex');
        $('#suggestionCurrentStatus').text('Hide');
        suggShowFLag = 1;
    } else {
        $('#suggDiv').css('display', 'none');
        $('#suggestionCurrentStatus').text('Show');
        suggShowFLag = 0;
    }
}
/*
The code written below is to capture the back event. Since we are appending the window.history wtih current query so redirect the page we have to write this .
*/
$(window).on('popstate', function (event) {
    var url = window.location.href;
    window.location.href = url;
});
