//User Analysis Logic For Vishleshakee version 2.0 , Deployed by OSINT Lab ,IIT-G
//Witten By :: Mala Das , Amitabh Boruah 

//Use camelCase please notations:)



//Imports
import { generateFreqDistChart, generateSentimentChart, generateBarChart } from './chartHelper.js';
import { formulateUserSearch } from '../utilitiesJS/userSearch.js';
import { getSuggestionsForUA, getUserDetails, getFreqDistDataForUA, getTweetIDsForUA, getSentiDistDataForUA ,getCooccurDataForUA} from './helper.js';
import { getCurrentDate, getRangeType, dateProcessor } from '../utilitiesJS/smatDate.js';
import { TweetsGenerator } from '../utilitiesJS/TweetGenerator.js';
import {generateUniqueID} from '../utilitiesJS/uniqueIDGenerator.js';
import { generateFreqDistBarChart, generateFrequencyLineChart, generateSentiDistBarChart, generateSentiDistLineChart ,generateBarChartForCooccur  } from '../utilitiesJS/smatChartBuilder.js';


//Global Declaration
var suggestionPopularIDs = ['$18839785', '$1447949844', '$1346439824', '$405427035', '$3171712086', '$1153045459', '$24705126', '$131188226', '$2570829264', '$207809313', '$2584552812', '$336611577', '$841609973687762944', '$4743651972', '$2166444230', '$3314976162', '$627355202', '$295833852', '$97217966', '$478469228', '$2541363451', '$39240673'];

var suggestionPopularNewsHandleIDs = ['$19897138', '$16343974', '$39240673', '$240649814', '$42606652', '$321271735', '$372754427', '$6509832', '$6433472', '$36327407', '$37034483', '$20751449', '$112404600', '$438156528', '$739053070932287488', '$267158021', '$128555221', '$742143', '$759251', '$701725963', '$55186601', '$28785486'];
var SearchID, fromDate, toDate;   //Global Variable to keep Track of current search
var mentionUniqueID,hashtagsUniqueID,userID;
//Logic Implementation 
$(document).ready(function () {
    toDate = getCurrentDate()
    fromDate = dateProcessor(toDate, '-', 3);
    if(localStorage.getItem('smat.me')){
        let userInfoTemp = JSON.parse(localStorage.getItem('smat.me'));
        userID =  userInfoTemp['id']; 
    }else{
        alert('Not Logged In');
        window.location.href='login';
    }

    $('.nav-item ').removeClass('smat-nav-active');
    $('#nav-UA').addClass('smat-nav-active');
    generateSuggestions(suggestionPopularIDs, 'suggUsers', 'users')
    generateSuggestions(suggestionPopularNewsHandleIDs, 'suggNews', 'news')
    // generateSuggestions(null, 'suggNews')
    initateUserSearch('$16343974');

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
    })
    let tweetDivHeight = $('#userInfoDiv').height();
    $('#uaTweetsDiv').css('max-height', tweetDivHeight - 10 + 'px');
    $('#frqTabUA').on('click', function () {
        let rangeType = getRangeType(fromDate, toDate);
        frequencyDistributionUA(SearchID, rangeType, fromDate, toDate, null, 'freqContentUA', false);

    });
    $('#sentiTabUA').on('click', function () {
        let rangeType = getRangeType(fromDate, toDate);
        sentimentDistributionUA(SearchID, rangeType, fromDate, toDate, null, 'sentiContentUA', false);
        // generateSentimentSummary(null, 'summaryContent-1', 'hour');
    });


    let suggShowFLag = 0;
    $('#showUAsugg').on('click', function () {
        if (suggShowFLag == 0) {
            $('#suggDiv').css('display', 'flex');
            $('#suggestionCurrentStatus').text('Hide');
            suggShowFLag = 1;
        } else {
            $('#suggDiv').css('display', 'none');
            $('#suggestionCurrentStatus').text('Show');
            suggShowFLag = 0;
        }

    });


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
    mentionUniqueID =generateUniqueID();
    hashtagsUniqueID = generateUniqueID();
    getUserDetails(SearchID).then(data => makePageReady(data));
    let rangeType = getRangeType(fromDate, toDate);
    $('.haTab').removeClass('active show');
    $('#freqContentUA').addClass('active show');
    $('.uaNav').removeClass('active');
    $('#frqTabUA').addClass('active');
    frequencyDistributionUA(SearchID, rangeType, fromDate, toDate, null, 'freqContentUA', false);
    //forHashtagsGraph
    plotDistributionGraphUA(SearchID,fromDate,toDate,'hashtag',hashtagsUniqueID,userID,'hashtagsContentTab');
    //forMentionsGraph
    plotDistributionGraphUA(SearchID,fromDate,toDate,'mention',mentionUniqueID,userID,'mentionsContentUA');
}
const makePageReady = (userDetails) => {
    $('#UAAnalysisDiv').css('display', 'block');
    $("#currentUAProfilePic").attr("src", userDetails.profile_image_url_https.includes('_normal') ? userDetails.profile_image_url_https.replace('_normal', '') : userDetails.profile_image_url_https);
    $('#currentUAUserName').text(userDetails.author);
    $('#showingResultsFor').text(userDetails.author);
    $('#currentUAVerified').html(userDetails.verified === "True" ? '<img class="verifiedIcon" src="public/icons/smat-verified.png"/>' : '');

    $('#currentUAUserHandle').text('@' + userDetails.author_screen_name);
    $('#userDetailsID').text(SearchID.replace('$', ''));
    $('#userDetailsJOINEDON').text(userDetails.created_at.seconds);
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
    $('.' + rangeType + '-charts').remove();
    let chartDivID = div + '-' + rangeType + '-chart';
    let summaryDivID = div + '-' + rangeType + '-summary';
    let chartTweetDivID = div + rangeType + '-tweets';
    // class="' + rangeType + '-charts"
    if (appendArg) {
        $('#' + freqParentDiv).append('<div class="' + rangeType + '-charts"><div class="row"><div class="col-sm-8"><div class="uaTab freqDistChart border" id="' + chartDivID + '" ></div></div><div class="col-sm-4"><div class="freqDistTweets border" id="' + chartTweetDivID + '"></div><div class="freqDistSummary border d-flex pt-2"  id="' + summaryDivID + '" ></div></div></div></div>');
    } else {
        $('#' + div).html('<div><div class="row"><div class="col-sm-8"><div class="uaTab freqDistChart border" id="' + chartDivID + '" ></div></div><div class="col-sm-4"><div class="freqDistTweets border" id="' + chartTweetDivID + '"></div><div class="freqDistSummary border d-flex pt-2"  id="' + summaryDivID + '" ></div></div></div></div>');
    }
    //Loader...
    $('#' + chartDivID).html('<div class="text-center pt-5 " ><i class="fa fa-circle-o-notch donutSpinner" aria-hidden="true"></i></div>')

    if (rangeType == 'day') {
        getFreqDistDataForUA(query, fromDate, toDate, null, rangeType, 0).then(data => {
            generateFreqDistBarChart(query, data, rangeType, chartDivID);
            freqSummaryGenerator(data, summaryDivID, rangeType);
        });
        getTweetIDsForUA(query, fromDate, toDate, rangeType, null).then(response => {
            TweetsGenerator(response.data, 6, chartTweetDivID, fromDate, toDate, true, rangeType);
        });

    } else if (rangeType == 'hour') {
        getFreqDistDataForUA(query, fromDate, toDate, null, rangeType, 0).then(data => {
            generateFreqDistBarChart(query, data, rangeType, chartDivID);
            freqSummaryGenerator(data, summaryDivID, rangeType);
        });
        getTweetIDsForUA(query, fromDate, toDate, rangeType, null).then(response => {
            TweetsGenerator(response.data, 6, chartTweetDivID, fromDate, toDate, true, rangeType);
        });

    } else {
        getFreqDistDataForUA(query, fromDate, toDate, null, rangeType, 1).then(data => {
            generateFrequencyLineChart(query, data, rangeType, chartDivID);
            freqSummaryGenerator(data, summaryDivID, rangeType);
        });
        getTweetIDsForUA(query, fromDate, toDate, rangeType, null, 1).then(response => {
            let fromDateTemp = fromDate.split(/[ ,]+/).filter(Boolean);
            TweetsGenerator(response.data, 6, chartTweetDivID, fromDate, fromDate, true, rangeType);
        });
    }

}
let sentiParentDiv = 'sentiContentUA';
export const sentimentDistributionUA = (query = null, rangeType, fromDate = null, toDate = null, toTime = null, div, appendArg = false) => {
    $('.' + rangeType + '-charts').remove();
    let chartDivID = div + '-' + rangeType + '-chart';
    let summaryDivID = div + '-' + rangeType + '-summary';
    let chartTweetDivID = div + rangeType + '-tweets';
    if (appendArg) {
        $('#' + sentiParentDiv).append('<div class="' + rangeType + '-charts"><div class="row"><div class="col-sm-8"><div class="uaTab sentiDistChart border" id="' + chartDivID + '" ></div></div><div class="col-sm-4"><div class="sentiDistTweets border" id="' + chartTweetDivID + '"></div><div class="sentiDistSummary border d-flex pt-2"  id="' + summaryDivID + '" ></div></div></div></div>');
    } else {
        $('#' + div).html('<div><div class="row"><div class="col-sm-8"><div class="uaTab sentiDistChart border" id="' + chartDivID + '" ></div></div><div class="col-sm-4"><div class="sentiDistTweets border" id="' + chartTweetDivID + '"></div><div class="sentiDistSummary border d-flex pt-2"  id="' + summaryDivID + '" ></div></div></div></div>');
    }
    //Loader...
    $('#' + chartDivID).html('<div class="text-center pt-5 " ><i class="fa fa-circle-o-notch donutSpinner" aria-hidden="true"></i></div>')
    if (rangeType == 'day') {
        getSentiDistDataForUA(query, fromDate, toDate, null, rangeType, 0).then(data => {
            generateSentiDistBarChart(data, query, rangeType, chartDivID);
            generateSentimentSummary(data, summaryDivID, rangeType);
        })

        getTweetIDsForUA(query, fromDate, toDate, rangeType, null).then(response => {
            TweetsGenerator(response.data, 6, chartTweetDivID, fromDate, toDate, true, rangeType);
        });

    } else if (rangeType == 'hour') {
        getSentiDistDataForUA(query, fromDate, toDate, null, rangeType, 0).then(data => {
            generateSentiDistBarChart(data, query, rangeType, chartDivID);
            generateSentimentSummary(data, summaryDivID, rangeType);
        })
        getTweetIDsForUA(query, fromDate, toDate, rangeType, null).then(response => {
            TweetsGenerator(response.data, 6, chartTweetDivID, fromDate, toDate, true, rangeType);
        });

    } else {

        getSentiDistDataForUA(query, fromDate, toDate, null, rangeType, 1).then(data => {
            generateSentiDistLineChart(query, data, rangeType, chartDivID);
            generateSentimentSummary(data, summaryDivID, rangeType);
        })
        getTweetIDsForUA(query, fromDate, toDate, rangeType, null, 1).then(response => {
            let fromDateTemp = fromDate.split(/[ ,]+/).filter(Boolean);
            TweetsGenerator(response.data, 6, chartTweetDivID, fromDate, fromDate, true, rangeType);
        });
    }



}

const plotDistributionGraphUA = (query,fromDate,toDate,option,uniqueID,userID,div) => {
          //Loader...

    $('#' + div).html('<div class="text-center pt-5 " ><i class="fa fa-circle-o-notch donutSpinner" aria-hidden="true"></i></div>');
 
    let chartDivID = option+'-chart';
    $('#'+div).html('<div id="'+chartDivID+'"></div>');
    getCooccurDataForUA(query,fromDate,toDate,option,uniqueID,userID).then(response =>{
           generateBarChartForCooccur(query,response,chartDivID,option)
    });  
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
    $('#' + div).html('<div class="sentiSummaryDiv" id="sentiSummary' + range + '" ><div class="removeMarginMediaQuery"  > <div  id="sentiSummaryBar-' + range + '" ></div> </div><div> <div class="d-flex "><div><p class=" smat-box-title-large m-0 font-weight-bold text-dark ">'+posSumTemp+'</p><p class="pull-text-top m-0 smat-dash-title ">Positive</p></div><div class="mx-2"><p class=" smat-box-title-large m-0 font-weight-bold text-dark ">'+neuSumTemp+'</p><p class="pull-text-top m-0 smat-dash-title ">Neutral</p></div><div class="mx-2"><p class=" smat-box-title-large m-0 font-weight-bold text-dark ">'+negSumTemp+'</p><p class="pull-text-top m-0 smat-dash-title ">Negative</p></div></div></div></div>');
   
    arrTemp=[posSumTemp,negSumTemp,neuSumTemp];
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


