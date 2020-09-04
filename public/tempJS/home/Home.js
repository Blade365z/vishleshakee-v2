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
import { getCompleteMap } from '../utilitiesJS/getMap.js';



//Global variables 
var MODE = '000';
var interval = 900;
var query = '';


const publicAnalysisResultDiv = 'result-div';
const publicAnalysisResultDivTitle = 'result-div-title';
const publicAnalysisResultDivSubTitle = 'result-div-subtitle';
const modeDict = { '000': 'Frequency Distribution', '001': 'Sentiment Distribution', '002': 'Top Mentions', '003': 'Top Active Users', '004': 'Locations', '005': 'Tweet Information' };
const modeTitle = { '000': 'Zoom and click to know more.', '001': 'Zoom and click to know more.', '002': 'Click on the bar to analyse further.', '003': 'Click on the bar to analyse further.', '004': 'Click on the markers to know more.', '005': 'Raw tweets posted by the users.' }
const intervalValues = { '15': 900, '30': 1800, '45': 2700, '1': 3600, '2': 7200 };
const categoryColor = { 'normal': 'text-normal', 'com': 'text-com', 'sec': 'text-sec', 'com_sec': 'text-com_sec' }

var TopTrendingData;





window.onresize = function (event) {
  let mainPublicCardHeight = $('#main-public-dash').height();
  $('#public-trending').css('height', mainPublicCardHeight - 93);

};

$(document).ready(function () {

  getMe();
  TopTrendingData = getTopData(interval);
  let mainPublicCardHeight = $('#main-public-dash').height();
  $('#public-trending').css('height', mainPublicCardHeight - 60);



  generatePublicHashtags(TopTrendingData, 'all');
  if (incoming) {
    query = incoming;
  }
  else {
    query = Object.keys(TopTrendingData)[0];

  }


  $('#publicCurrentQuery').text(query);
  $('#' + publicAnalysisResultDiv).html('<div class="text-center pt-5 " ><i class="fa fa-circle-o-notch donutSpinner mt-5" aria-hidden="true"></i></div>')


  frequencyPublic();
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
    MODE = '000';
    $('.public-analysis-tab').removeClass('smat-active ');
    $(this).addClass('smat-active ');
    $('.public-analysis-result').html('');
    makePublicAnalysisReady(MODE);
    frequencyPublic('public-analysis-result');
  });


  $('.senti-public-tab').on('click', function () {
    MODE = '001';
    $('.public-analysis-tab').removeClass('smat-active ');
    $(this).addClass('smat-active ');
    $('.public-analysis-result').html('');
    makePublicAnalysisReady(MODE);
    sentimentPublic();

  });

  $('.mentions-public-tab').on('click', function () {
    MODE = '002';
    $('#' + publicAnalysisResultDiv).html('')
    $('#' + publicAnalysisResultDiv).html('<div class="text-center pt-5 " ><i class="fa fa-circle-o-notch donutSpinner" aria-hidden="true"></i></div>')
    $('.public-analysis-tab').removeClass('smat-active ');
    $(this).addClass('smat-active ');
    $('.public-analysis-result').html('');
    makePublicAnalysisReady(MODE);
    coOccurPublic('mention');

  });

  $('.topusers-public-tab').on('click', function () {
    MODE = '003';
    $('.public-analysis-tab').removeClass('smat-active ');
    $(this).addClass('smat-active ');
    $('.public-analysis-result').html('');
    makePublicAnalysisReady(MODE);
    coOccurPublic('user');
  });
  $('.locations-public-tab').on('click', function () {
    MODE = '004';
    $('.public-analysis-tab').removeClass('smat-active ');
    $(this).addClass('smat-active ');
    $('.public-analysis-result').html('');
    makePublicAnalysisReady(MODE);
    generatePublicLocations();
  });
  $('.tweets-public-tab').on('click', function () {
    MODE = '005';
    $('.public-analysis-tab').removeClass('smat-active ');
    $(this).addClass('smat-active ');
    $('.public-analysis-result').html('');
    makePublicAnalysisReady(MODE);
    tweetPublic();
  });

  $('.publicHashtagsFilter').on('click', function () {
    let typeTemp = $(this).attr('value');
    console.log(typeTemp)
    generatePublicHashtags(TopTrendingData, typeTemp);
  });




  $('body').on('click', 'div .filter-tweets', function () {
    let capturedClass = $(this).attr('value');
    capturedClass = capturedClass == 'all' ? null : capturedClass;
    let helperData = getTweetIDsFromController(null, query, queriedTweetFromTime, queriedTweetToTime, capturedClass);
    let tweetIDs = helperData[0]['data']['data'];
    TweetsGenerator(tweetIDs, 6, 'result-div');
  })

  $('.interval-buttons-public').on('click', function () {
    let key = $(this).val();
    let intervalTemp = intervalValues[key];
    $('.interval-buttons-public').removeClass('smat-active ');
    $(this).addClass('smat-active ');
    interval = intervalTemp;
    TopTrendingData = getTopData(interval);
    generatePublicHashtags(TopTrendingData, 'all');
    if (MODE == "000") {
      frequencyPublic(publicAnalysisResultDiv);
    }
    else if (MODE == "001") {
      sentimentPublic();

    }
    else if (MODE == "002") {
      coOccurPublic('mention');
    }
    else if (MODE == "003") {
      coOccurPublic('user');
    }
    else if (MODE == "005") {
      tweetPublic();
    }
  });


  //update public hahstag every 1 min 

  let updatePublicHashtagOneMinInt = setInterval(updatePublicTrendingHashtagsEveryOneMiute, 15000);


});

const updatePublicTrendingHashtagsEveryOneMiute = () => {
  TopTrendingData = getTopData(interval);
  generatePublicHashtags(TopTrendingData, 'all');
}

const frequencyPublic = () => {
  for (let i = 0; i <= 100; i++)
    clearInterval(i);
  $('#' + publicAnalysisResultDiv).html('<div class="text-center pt-5 " ><i class="fa fa-circle-o-notch donutSpinner" aria-hidden="true"></i></div>')
  $('#public-summary-row').html('<div class="d-flex"> <span class="mx-2"><p class="m-0 smat-box-title-large font-weight-bold text-dark" id="freqTotalPublic">0</p><p class="pull-text-top smat-dash-title m-0 ">Tweets Arrived</p></span></div><div class="d-flex "><span class="mx-2"><p class="m-0 smat-box-title-large font-weight-bold text-normal" id="publicNormalTotal">0</p><p class="pull-text-top smat-dash-title m-0 ">Normal</p></span><span class="mx-2"><p class="m-0 smat-box-title-large font-weight-bold text-sec" id="publicSecTotal">0</p><p class="pull-text-top smat-dash-title m-0">Security</p></span><span class="mx-2"><p class="m-0 smat-box-title-large font-weight-bold text-com" id="publicComTotal">0</p><p class="pull-text-top smat-dash-title m-0">Communal</p></span><span class="mx-2"><p class="m-0 smat-box-title-large font-weight-bold text-com_sec" id="publiccom_secTotal">0</p><p class="pull-text-top smat-dash-title m-0">Sec.& Com.</p></span></div>');
  let data = getFreqDistData(interval, query);

  generateFrequencyChart(data, query, publicAnalysisResultDiv);

}

const sentimentPublic = () => {
  $('#' + publicAnalysisResultDiv).html('<div class="text-center pt-5 " ><i class="fa fa-circle-o-notch donutSpinner" aria-hidden="true"></i></div>')

  renderSentimentSummary('public-summary-1', 'public-summary-2')
  let sentimentTotals = [920, 3221, 1133];
  let data = getSentiDistData(interval, query);
  generateSentimentChart(data, query, publicAnalysisResultDiv);

}


const coOccurPublic = (type) => {

  let coOccurData = getTopCooccurData(interval, query, type);
  generateBarChart(coOccurData, query, publicAnalysisResultDiv, type);
}


let queriedTweetFromTime, queriedTweetToTime;
const tweetPublic = () => {
  $('#public-summary-2').html('<div class="btn-group"><button type="button" class="btn btn-white smat-rounded dropdown-toggle text-normal" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Filter Tweets</button><div class="dropdown-menu dropdown-menu-right"><li class="dropdown-item clickable filter-tweets" value="all"> Show all tweets</li><li class="dropdown-item clickable filter-tweets" value="pos"><i class="fa fa-circle text-pos " aria-hidden="true"></i> Positive Tweets</li><li class="dropdown-item clickable filter-tweets" value="neg"><i class="fa fa-circle text-neg " aria-hidden="true"></i> Negative Tweets</li><li class="dropdown-item clickable filter-tweets" value="neu"> <i class="fa fa-circle text-neu" aria-hidden="true"></i> Neutral Tweets</li><li class="dropdown-item clickable filter-tweets" value="normal"> <i class="fa fa-circle text-normal" aria-hidden="true"></i> Normal Tweets</li><li class="dropdown-item clickable filter-tweets" value="com"> <i class="fa fa-circle text-com" aria-hidden="true"></i> Communal Tweets</li><li class="dropdown-item clickable filter-tweets" value="sec"> <i class="fa fa-circle text-sec" aria-hidden="true"></i> Security Tweets</li><li class="dropdown-item clickable filter-tweets" value="com_sec"> <i class="fa fa-circle text-com_sec" aria-hidden="true"></i> Communal and Security Tweets</li></div></div>');

  let helperData = getTweetIDsFromController(interval, query);
  let tweetIDs = helperData[0]['data']['data'];
  
  queriedTweetFromTime = helperData[0]['fromTime'];
  queriedTweetToTime = helperData[0]['toTime'];
  // console.log(tweetIDs);
  TweetsGenerator(tweetIDs, 6, 'result-div');
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
    let category =  (value[1]=='normal') ? 'Normal' : ((value[1]=='sec') ? 'Security' : ((value[1]=='com') ?  'Communal' : 'Communal & Security' ));
    let urlArg = key.includes('#') ? key.replace('#','%23') : ''+key;
    $('#public-trending').append('<div class="mb-1 publicHashtag-' + value[1] + '"><p class="hashtags"><a class="text-dark" href="?query='+urlArg+'" target="_blank"  >' + key + '</a></p><p class=" m-0 smat-dash-title  text-dark "> <span>' + value[0] + '</span><span class="mx-1">Tweets</span><span class="mx-1"   title ="'+category+'" ><i class="fa fa-circle ' + categoryColor[value[1]] + ' " aria-hidden="true"></i> </span></p></div>');
  }



}


const generatePublicLocations = () => {
  //TODO::Rajdeep
  $('#result-div').html('<div id="result-div-map" style="height:400px;"></div>');
  getCompleteMap('result-div-map',query,interval);
  
  
}