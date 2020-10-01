/*
Client Side script for the public page of Vishleshakee

MODE LIST:
000->Frequency
001->Sentiment
002->Mentions
003->TopUsers
004->Locations
005->Tweets
*/

//Imports from helper.js
import { getFreqDistData, getTopCooccurData, getMe, getSentiDistData, getTopData, getTweetIDsFromController } from './helper.js';
import { generateFrequencyChart, generateSentimentChart, generateBarChart } from './chartHelper.js';
import { TweetsGenerator } from '../utilitiesJS/TweetGenerator.js';
import { get_tweet_location_home,getCompleteMap } from '../utilitiesJS/getMap.js';
import { makeSuggestionsRead, makeSmatReady } from '../utilitiesJS/smatExtras.js'
import { getCurrentDate } from '../utilitiesJS/smatDate.js';
import {forwardToHistoricalAnalysis, forwardToUserAnalysis} from '../utilitiesJS/redirectionScripts.js';

//Global variables 
var MODE = '000', interval = 900, query = '';
const publicAnalysisResultDiv = 'result-div';
const publicAnalysisResultDivTitle = 'result-div-title';
const publicAnalysisResultDivSubTitle = 'result-div-subtitle';
const modeDict = { '000': 'Frequency Distribution', '001': 'Sentiment Distribution', '002': 'Top Mentions', '003': 'Top Active Users', '004': 'Locations', '005': 'Tweet Information' ,'006':'Top Hashtags' };
const modeTitle = { '000': 'Zoom and click to know more.', '001': 'Zoom and click to know more.', '002': 'Click on the bar to analyse further.', '003': 'Click on the bar to analyse further.', '004': 'Click on the markers to know more.', '005': 'Raw tweets posted by the users.' ,'006':'Click on the bar to analyse further.' }
const intervalValues = { '15': 900, '30': 1800, '45': 2700, '1': 3600, '2': 7200 };
const categoryColor = { 'normal': 'text-normal', 'com': 'text-com', 'sec': 'text-sec', 'com_sec': 'text-com_sec' }
var date = getCurrentDate();
var TopTrendingData;
var userID='';

jQuery(function () {
  if (localStorage.getItem('smat.me')) {
    let userInfoTemp = JSON.parse(localStorage.getItem('smat.me'));
    userID = userInfoTemp['id'];
  } 
  getMe();
  makeSmatReady();
  $('#alertsDiv').append('<div class="text-center  smat-loader"  id="alertBoxLoader"><i class="fa fa-circle-o-notch donutSpinner" aria-hidden="true"></i></div>')
  if (localStorage.getItem('smat-currentlyTrending')) {
    $('#alertBoxLoader').remove();
    let alreadyStoredTemp = JSON.parse(localStorage.getItem('smat-currentlyTrending'));
    for (let i = 0; i < alreadyStoredTemp.length; i++) {
      let offset = i + 1;
      $('#alert-' + offset).text(alreadyStoredTemp[i]);
    }
  }
  makeSuggestionsRead('homeSearchInput', 'top_hashtag', 50, true).then(response => {
    var response = response.slice(0, 3);
    $('#alertBoxLoader').remove();
    if (!localStorage.getItem('smat-currentlyTrending')) {
      localStorage.setItem('smat-currentlyTrending', JSON.stringify(response));
      for (let i = 0; i < response.length; i++) {
        let offset = i + 1;
        $('#alert-' + offset).text(response[i]);
      }
    } else {
      let alreadyStoredTemp = JSON.parse(localStorage.getItem('smat-currentlyTrending'));

      let checkFlag = 0;
      for (let i = 0; i <= alreadyStoredTemp.length; i++) {
        if (alreadyStoredTemp[i] !== response[i]) {
          checkFlag = 1;
        }
      }

      if (checkFlag == 1) {
        localStorage.removeItem('smat-currentlyTrending');
        localStorage.setItem('smat-currentlyTrending', JSON.stringify(response));
        for (let i = 0; i < response.length; i++) {
          let offset = i + 1;
          $('#alert-' + offset).text(response[i]);
        }
      }
    }
  });
  //Since all the logics implemented will be executed asynchronously, Therefore the function get
  getTopData(interval).then(response => {

    TopTrendingData = response.data

    generatePublicHashtags(TopTrendingData, 'all');
    query = incoming ? query = incoming : Object.keys(TopTrendingData)[0];
    $('#publicCurrentQuery').text(query);
    $('#' + publicAnalysisResultDiv).html('<div class="text-center smat-loader " ><i class="fa fa-circle-o-notch donutSpinner mt-5" aria-hidden="true"></i></div>')
    frequencyPublic(query, interval,'freq-public-tab');
  });



  let mainPublicCardHeight = $('#main-public-dash').height();
  $('#public-trending').css('height', mainPublicCardHeight - 56);



  makePublicAnalysisReady(MODE);
  $('.freq-public-tab').addClass('smat-active ');
  $('#15minsBtn').addClass('smat-active ');

  $('#public-trending').on('scroll', function () {
    $('#down-arrow-animation').css('display', 'block');
    if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
      $('#down-arrow-animation').css('display', 'none');
    }
  })

  $('.freq-public-tab').on('click', function () {
        frequencyPublic(query, interval,'freq-public-tab');
  });


  $('.senti-public-tab').on('click', function () {

    $('.public-analysis-result').html('');
    sentimentPublic(query, interval,'senti-public-tab');

  });

  $('.mentions-public-tab').on('click', function () {
    $('.public-analysis-result').html('');
    coOccurPublic('mention',query, interval,'mentions-public-tab');

  });
  $('.hashtags-public-tab').on('click', function () {
    $('.public-analysis-result').html('');
    coOccurPublic('hashtag',query, interval,'hashtags-public-tab');

  });


  $('.topusers-public-tab').on('click', function () {
   
    $('.public-analysis-result').html('');
   
    coOccurPublic('user',query, interval,'topusers-public-tab');
  });
  $('.locations-public-tab').on('click', function () {
    $('.public-analysis-result').html('');
    generatePublicLocations(query, interval,'locations-public-tab');
  });
  $('.tweets-public-tab').on('click', function () {
  
    $('.public-analysis-result').html('');
   
    tweetPublic(query, interval,'tweets-public-tab');
  });

  $('.publicHashtagsFilter').on('click', function () {
    let typeTemp = $(this).attr('value');
    console.log(typeTemp)
    generatePublicHashtags(TopTrendingData, typeTemp);
  });
  $('body').on('click', 'div .username', function () {
    let queryCaptured = '$' + $(this).attr('value');
    forwardToUserAnalysis(queryCaptured,date,date);
  });
  $('body').on('click','#analyzeMoreBtn',function(){
    forwardToHistoricalAnalysis(query,date,date);
  })

  $('body').on('click','div .query ',function(){
    let queryCaptured = $(this).text().trim();
    forwardToHistoricalAnalysis(queryCaptured,date,date); 
});


  $('body').on('click', 'div .filter-tweets', function () {
    let capturedClass = $(this).attr('value');
    capturedClass = capturedClass == 'all' ? null : capturedClass;
    getTweetIDsFromController(null, query, queriedTweetFromTime, queriedTweetToTime, capturedClass).then(response => {
      let tweetIDs = response[0]['data']['data'];
      TweetsGenerator(tweetIDs, 6, 'result-div');
    });
  })

  $('.interval-buttons-public').on('click', function () {
    let key = $(this).val();
    let intervalTemp = intervalValues[key];
    $('.interval-buttons-public').removeClass('smat-active ');
    $(this).addClass('smat-active ');
    interval = intervalTemp;
    clearInterval(updatePublicHashtagOneMinInt);
    getTopData(interval).then(response => {
      TopTrendingData = response.data
      generatePublicHashtags(TopTrendingData, 'all');

    })
    if (MODE == "000") {
      frequencyPublic(query, interval,'freq-public-tab');
    }
    else if (MODE == "001") {
      sentimentPublic(query, interval,'senti-public-tab');

    }
    else if (MODE == "002") { 
      coOccurPublic('mention',query, interval,'mentions-public-tab');
    }
    else if (MODE == "003") {
      coOccurPublic('user',query, interval,'topusers-public-tab');
    }
    else if (MODE == "005") {
      tweetPublic(query, interval,'tweets-public-tab');
    } else if (MODE == "006") {
      coOccurPublic('hashtag',query, interval,'hashtags-public-tab');
    } 
  });


  //update public hahstag every 1 min 

  let updatePublicHashtagOneMinInt = setInterval(updatePublicTrendingHashtagsEveryOneMiute, 10000);


});

const updatePublicTrendingHashtagsEveryOneMiute = () => {
  getTopData(interval).then(response => {
    TopTrendingData = response.data
    generatePublicHashtags(TopTrendingData, 'all');
  })

}

const frequencyPublic = (queryArg, intervalArg,btnClass) => {
  $('.public-analysis-tab').removeClass('smat-active ');
  $('.'+btnClass).addClass('smat-active ');
  $('.public-analysis-result').html('');
  $('#' + publicAnalysisResultDiv).html('<div class="text-center smat-loader " ><i class="fa fa-circle-o-notch donutSpinner" aria-hidden="true"></i></div>')
  $('#public-summary-row').html('<div class="d-flex"> <span class="mx-2"><p class="m-0 smat-box-title-large font-weight-bold text-dark" id="freqTotalPublic">0</p><p class="pull-text-top smat-dash-title m-0 ">Tweets Arrived</p></span></div><div class="d-flex "><span class="mx-2"><p class="m-0 smat-box-title-large font-weight-bold text-normal" id="publicNormalTotal">0</p><p class="pull-text-top smat-dash-title m-0 ">Normal</p></span><span class="mx-2"><p class="m-0 smat-box-title-large font-weight-bold text-sec" id="publicSecTotal">0</p><p class="pull-text-top smat-dash-title m-0">Security</p></span><span class="mx-2"><p class="m-0 smat-box-title-large font-weight-bold text-com" id="publicComTotal">0</p><p class="pull-text-top smat-dash-title m-0">Communal</p></span><span class="mx-2"><p class="m-0 smat-box-title-large font-weight-bold text-com_sec" id="publiccom_secTotal">0</p><p class="pull-text-top smat-dash-title m-0">Sec.& Com.</p></span></div>');
  getFreqDistData(intervalArg, query).then(response => {
    // console.log(response);
    MODE = '000';
    makePublicAnalysisReady(MODE);
    generateFrequencyChart(response, queryArg, publicAnalysisResultDiv);
  });

}

const sentimentPublic = (queryArg, intervalArg,btnClass) => {
  $('.public-analysis-tab').removeClass('smat-active ');
  $('.'+btnClass).addClass('smat-active ');
  $('.public-analysis-result').html('');
  $('#' + publicAnalysisResultDiv).html('<div class="text-center smat-loader " ><i class="fa fa-circle-o-notch donutSpinner" aria-hidden="true"></i></div>')

  renderSentimentSummary('public-summary-1', 'public-summary-2')
  getSentiDistData(intervalArg, queryArg).then(response => {
    MODE = '001';
    makePublicAnalysisReady(MODE);
    generateSentimentChart(response, queryArg, publicAnalysisResultDiv);
  });


}


const coOccurPublic = (type,queryArg, intervalArg,btnClass) => {
  $('.public-analysis-tab').removeClass('smat-active ');
  $('.'+btnClass).addClass('smat-active ');
  $('.public-analysis-result').html('');
  let analysisButton = '';
  userID!=='' ? analysisButton = '<button class="btn btn-primary smat-rounded  ml-auto mr-3 mt-1 analyzeNetworkButton " > <span> Analyse network </span> </button>' : '';
  $('#'+publicAnalysisResultDiv).html('<div class="d-flex">'+analysisButton+'</div><div id="barChart"></div>')
  $('#barChart').html('<div class="text-center smat-loader " ><i class="fa fa-circle-o-notch donutSpinner" aria-hidden="true"></i></div>')
  getTopCooccurData(intervalArg, queryArg, type).then(response => {
    if(type=='hashtag'){
      MODE = '006';
      makePublicAnalysisReady(MODE);
    }
    else if(type=='mention'){
      MODE = '002';
      makePublicAnalysisReady(MODE);
    }else{
      MODE = '003';
      makePublicAnalysisReady(MODE);
    }
    generateBarChart(response, queryArg, 'barChart', type);
  })

}


let queriedTweetFromTime, queriedTweetToTime;
const tweetPublic = (queryArg, intervalArg,btnClass) => {
  $('.public-analysis-tab').removeClass('smat-active ');
  $('.'+btnClass).addClass('smat-active ');
  $('.public-analysis-result').html('');
  $('#' + publicAnalysisResultDiv).html('<div class="text-center smat-loader " ><i class="fa fa-circle-o-notch donutSpinner" aria-hidden="true"></i></div>');
  $('#public-summary-2').html('<div class="btn-group"><button type="button" class="btn btn-white smat-rounded dropdown-toggle text-normal" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Filter Tweets</button><div class="dropdown-menu dropdown-menu-right"><li class="dropdown-item clickable filter-tweets" value="all"> Show all tweets</li><li class="dropdown-item clickable filter-tweets" value="pos"><i class="fa fa-circle text-pos " aria-hidden="true"></i> Positive Tweets</li><li class="dropdown-item clickable filter-tweets" value="neg"><i class="fa fa-circle text-neg " aria-hidden="true"></i> Negative Tweets</li><li class="dropdown-item clickable filter-tweets" value="neu"> <i class="fa fa-circle text-neu" aria-hidden="true"></i> Neutral Tweets</li><li class="dropdown-item clickable filter-tweets" value="normal"> <i class="fa fa-circle text-normal" aria-hidden="true"></i> Normal Tweets</li><li class="dropdown-item clickable filter-tweets" value="com"> <i class="fa fa-circle text-com" aria-hidden="true"></i> Communal Tweets</li><li class="dropdown-item clickable filter-tweets" value="sec"> <i class="fa fa-circle text-sec" aria-hidden="true"></i> Security Tweets</li><li class="dropdown-item clickable filter-tweets" value="com_sec"> <i class="fa fa-circle text-com_sec" aria-hidden="true"></i> Communal and Security Tweets</li></div></div>');
  getTweetIDsFromController(intervalArg, queryArg).then(response => {
    MODE = '005';
    makePublicAnalysisReady(MODE);
    let tweetIDs = response[0]['data']['data'];
    queriedTweetFromTime = response[0]['fromTime'];
    queriedTweetToTime = response[0]['toTime'];
    TweetsGenerator(tweetIDs, 6, 'result-div');
  });


  // console.log(tweetIDs);

}

const makePublicAnalysisReady = (mode) => {
  let currentMode = modeDict[mode];
  let currentModeSubTitle = modeTitle[mode];
  $('#' + publicAnalysisResultDivTitle).text('');
  $('#' + publicAnalysisResultDivSubTitle).text('');
  $('#' + publicAnalysisResultDivTitle).text(currentMode);
  $('#' + publicAnalysisResultDivSubTitle).text(currentModeSubTitle);
}


const renderSentimentSummary = (div1, div2) => {
  $('#' + div1).html('<div class="row  p-1"> <span style="display: inline-block;"><div class="sentiment_bar_summary border sentiment_bar_pos" id="publicPosBar"></div> </span> <span style=" display: inline-block;"><div class="  sentiment_bar_summary border sentiment_bar_neu " id="publicNeuBar" ></div>  </span> <span style=" display: inline-block;"><div class=" sentiment_value_neg sentiment_bar_summary border sentiment_bar_neg"  id="publicNegBar" ></div></span></div ><div class="row"><span>  <a class="senti_summary_bar_text"  id="publicPosValue" >0%</a>  </span><span> <a  class="senti_summary_bar_text"  id="publicNeuValue" >0%</a>   </span> <span><a class="senti_summary_bar_text"  id="publicNegValue" >0%</a></span>');

  $('#' + div2).html('<div class="d-flex"><div class="text-left mr-3"><p class="smat-box-title-large m-0 font-weight-bold text-dark" id="publicPosTotal">0</p><p class="pull-text-top m-0 smat-dash-title ">Positive</p></div><div class="text-left mr-3"><p class="smat-box-title-large m-0 font-weight-bold text-dark" id="publicNeuTotal">0</p><p class="pull-text-top m-0 smat-dash-title ">Neutral</p></div><div class="text-left mr-3"><p class="smat-box-title-large m-0 font-weight-bold text-dark" id="publicNegTotal">0</p><p class="pull-text-top m-0 smat-dash-title ">Negative</p></div></div>');


}
const generatePublicHashtags = (data, filterArgument = null) => {
  $('#public-trending').html('');
  const arrayTemp = data;
  for (const [key, value] of Object.entries(arrayTemp)) {
    if (filterArgument !== 'all') {
      if (value[1] !== filterArgument) {
        continue;
      }
    }
    let category = (value[1] == 'normal') ? 'Normal' : ((value[1] == 'sec') ? 'Security' : ((value[1] == 'com') ? 'Communal' : 'Communal & Security'));
    let urlArg = key.includes('#') ? key.replace('#', '%23') : '' + key;
    $('#public-trending').append('<div class="mb-1 publicHashtag-' + value[1] + '"><p class="hashtags"><a class="text-dark" href="?query=' + urlArg + '" target="_blank"  >' + key + '</a></p><p class=" m-0 smat-dash-title  text-dark "> <span>' + value[0] + '</span><span class="mx-1">Tweets</span><span class="mx-1"   title ="' + category + '" ><i class="fa fa-circle ' + categoryColor[value[1]] + ' " aria-hidden="true"></i> </span></p></div>');
  }



}


const generatePublicLocations = (queryArg, intervalArg,btnClass) => {
  //TODO::Rajdeep
  $('.public-analysis-tab').removeClass('smat-active ');
  $('.'+btnClass).addClass('smat-active ');
  $('.public-analysis-result').html('');
  $('#result-div').html(`<div id="result-div-map" style="height:400px;"></div>
                          <div class="modal_lm">
                            <div class="modal-content">
                                <span class="close-button">&times;</span>
                                <ul id="markersList"></ul>
                            </div>
                          </div>`);
  
  let capturedClass = $(this).attr('value');
  capturedClass = capturedClass == 'all' ? null : capturedClass;
  get_tweet_location_home(intervalArg, queryArg, queriedTweetFromTime, queriedTweetToTime, capturedClass).then(response => {
    MODE = '004';
    makePublicAnalysisReady(MODE);

    console.log(response);
    getCompleteMap('result-div-map',response);
    
  });


}