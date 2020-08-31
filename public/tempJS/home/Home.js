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
import { getFreqDistData, getTopCooccurData, getMe, getSentiDistData, getTopData } from './helper.js';
import { generateFrequencyChart, generateSentimentChart, generateBarChart } from './chartHelper.js';

//Global variables 
var MODE = '000';
var interval = 900;
var query = '';


const publicAnalysisResultDiv = 'result-div';
const publicAnalysisResultDivTitle = 'result-div-title';
const publicAnalysisResultDivSubTitle = 'result-div-subtitle';
const modeDict = { '000': 'Frequency Distribution', '001': 'Sentiment Distribution', '002': 'Top Mentions', '003': 'Top Active Users', '004': 'Locations', '005': 'Tweet Information' };
const modeTitle = { '000': 'Zoom and click to know more.', '001': 'Zoom and click to know more.', '002': 'Click on the bar to analyse further.', '003': 'Click on the bar to analyse further.', '004': 'Click on the markers to know more.', '005': 'Raw tweets posted by the users.' }
const intervalValues = { '15': 900, '30': 1800, '45': 2700, '1': 3600, '5': 18000 };
const categoryColor = { 'normal': 'text-normal', 'com': 'text-com', 'sec': 'text-sec', 'seccom': 'text-seccom' }

var TopTrendingData;


//Code Starts Here
$(document).ready(function () {


  TopTrendingData = getTopData(interval);


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
    for (let i = 0; i <= 100; i++)
      clearInterval(i);
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


  $('.hashtags').on('click', function () {
    let queryTemp = $(this).text();
    queryTemp = queryTemp.replace("#", "%23");
    window.location.href = "home?query=" + queryTemp;

  });



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



});



const frequencyPublic = () => {
  for (let i = 0; i <= 100; i++)
    clearInterval(i);
  $('#' + publicAnalysisResultDiv).html('<div class="text-center pt-5 " ><i class="fa fa-circle-o-notch donutSpinner" aria-hidden="true"></i></div>')
  $('#public-summary-row').html('<div class="d-flex"> <span class="mx-2"><p class="m-0 smat-box-title-large font-weight-bold text-dark" id="freqTotalPublic">0</p><p class="pull-text-top smat-dash-title m-0 ">Tweets Arrived</p></span></div><div class="d-flex "><span class="mx-2"><p class="m-0 smat-box-title-large font-weight-bold text-normal" id="publicNormalTotal">0</p><p class="pull-text-top smat-dash-title m-0 ">Normal</p></span><span class="mx-2"><p class="m-0 smat-box-title-large font-weight-bold text-sec" id="publicSecTotal">0</p><p class="pull-text-top smat-dash-title m-0">Security</p></span><span class="mx-2"><p class="m-0 smat-box-title-large font-weight-bold text-com" id="publicComTotal">0</p><p class="pull-text-top smat-dash-title m-0">Communal</p></span><span class="mx-2"><p class="m-0 smat-box-title-large font-weight-bold text-seccom" id="publicSecComTotal">0</p><p class="pull-text-top smat-dash-title m-0">Sec.& Com.</p></span></div>');
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



const tweetPublic = () => {
  $('#public-summary-2').html('<div class="btn-group"><button type="button" class="btn btn-white smat-rounded dropdown-toggle text-normal" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Filter Tweets</button><div class="dropdown-menu dropdown-menu-right"><li class="dropdown-item clickable filter-pos-tweets"><i class="fa fa-circle text-pos " aria-hidden="true"></i> Positive Tweets</li><li class="dropdown-item clickable filter-neg-tweets"><i class="fa fa-circle text-neg " aria-hidden="true"></i> Negative Tweets</li><li class="dropdown-item clickable filter-neu-tweets"> <i class="fa fa-circle text-neu" aria-hidden="true"></i> Neutral Tweets</li><li class="dropdown-item clickable filter-normal-tweets"> <i class="fa fa-circle text-normal" aria-hidden="true"></i> Normal Tweets</li><li class="dropdown-item clickable filter-com-tweets"> <i class="fa fa-circle text-com" aria-hidden="true"></i> Communal Tweets</li><li class="dropdown-item clickable filter-sec-tweets"> <i class="fa fa-circle text-sec" aria-hidden="true"></i> Security Tweets</li><li class="dropdown-item clickable filter-seccom-tweets"> <i class="fa fa-circle text-seccom" aria-hidden="true"></i> Communal and Security Tweets</li></div></div>');
  generateTweets(publicAnalysisResultDiv);

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






export const generateTweets = (div) => {
  $('#' + div).html("");
  // for (let i = 0; i < 7; i++) {
  //   $('#' + div).append('<div class="border p-2 "><div class="d-flex"><div class="profilePictureDiv p-1 text-center"><img src="public/img/amitabh.jpg" style="height:33px;border-radius:50%" /></div><div> <p class="pt-1 m-0 font-weight-bold"> Amitabh Baruah </p><p class="smat-dash-title pull-text-top m-0 "> @amitabh.baruah12 </p></div> <div class="px-1 pt-1" >  <i class="fa fa-circle text-sec" aria-hidden="true"></i>   <i class="fa fa-circle text-neg" aria-hidden="true"></i> </div></div><div style="width:80%;"><p class="smat-tweet-body-text mb-1">It is so sad indeed what happened recently at #GalwanValley . My sincere condolences to the bereaved families. It is time to teach china a lesson . #IndianArmy #JaiHind #ShameOnChina </p></div><div class="d-flex"><p class="m-0 smat-tweet-body-text font-weight-bold"> <span>  2020-03-12  &nbsp </span> <span> Guwahati, India</span> &nbsp  <span class="text-normal clickable"> Track Tweet</span>   </p> </div></div>');
  // }
  let tweetData = tweetProvider();
  tweetData.forEach(tweet => {
   //TODO :: 1. sentiment 2. category 3. Media 4.Location 5.Pagination
    let sentiment = '' , category = '' , media='',location='';
    if(tweet.sentiment===0){
      sentiment = 'pos';
    }else if (tweet.sentiment===1){
      sentiment = 'neg';
    }else{
      sentiment = 'neu';
    }

    $('#' + div).append('<div class="border p-2 "><div class="d-flex"><div class="profilePictureDiv p-1 text-center mx-2"><img src="'+tweet.author_profile_image+'" style="height:33px;border-radius:50%" /></div><div> <p class="pt-1 m-0 font-weight-bold">'+tweet.author+' </p><p class="smat-dash-title pull-text-top m-0 "> @'+tweet.author_screen_name+' </p></div> <div class="px-1 pt-1" >  <i class="fa fa-circle text-sec" aria-hidden="true"></i>   <i class="fa fa-circle text-neg" aria-hidden="true"></i> </div></div><div style="width:80%;"><p class="smat-tweet-body-text mb-1">'+tweet.tweet_text+'</p></div><div id="" class="row d-flex justify-content-center tweet_media_body_' +tweet['tid'] +'" ></div><div class="d-flex"><p class="m-0 smat-tweet-body-text font-weight-bold"> <span>  '+tweet.datetime+'  &nbsp </span> <span> Guwahati, India</span> &nbsp  <span class="text-normal clickable"> Track Tweet</span>   </p> </div></div>');



  if (tweet['media_list'].length > 0) {
    $('.tweet_media_body_' + tweet['tid']).html(
      '<div class="row d-flex justify-content center" style="width:60%;height:90%;padding:20px;"><div class="col " id="tweet_media_body_' +
      tweet['tid'] +
      '_0"></div><div class="col-3 "> <div class="row " id="tweet_media_body_' +
      tweet['tid'] +
      '_1" style="height:33%;overflow:hidden;">  </div>  <div class="row " id="tweet_media_body_' +
      tweet['tid'] +
      '_3" style="height:33%;overflow:hidden;"> </div> <div class="row " id="tweet_media_body_' +
      tweet['tid'] +
      '_4" style="height:33%;overflow:hidden;">  </div> </div></div>'
    )
    for (var i = 0; i < tweet['media_list'].length; i++) {
      if (tweet['media_list'][i][0] == 'photo') {
        $('#tweet_media_body_' + tweet['tid'] + '_' + i).html(
          '<img  class="image_content" src="' +
          tweet['media_list'][i][1] +
          '" width="100%" height="100%">'
        )
      } else if (tweet['media_list'][i][0] == 'video') { 
        $('#tweet_media_body_' + tweet['tid'] + '_' + i).html(
          '<video width="100%" height=auto controls><source src="' +
          tweet['media_list'][i][1] +
          '" type="video/mp4"></video>'
        )
      }
    }
  }

});

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
    $('#public-trending').append('<div class="mb-1 publicHashtag-' + value[1] + '"><p class="hashtags">' + key + '</p><p class=" m-0 smat-dash-title  text-dark "> <span>' + value[0] + '</span><span class="mx-1">Tweets</span><span class="mx-1"> <i class="fa fa-circle ' + categoryColor[value[1]] + '" aria-hidden="true"></i> </span></p></div>');
  }



}



const tweetProvider = () => {
  let tempData = [{ "t_location": null, "datetime": "2020-08-03 22:56:54", "tid": "1290421413778776067", "author": "GlobalPandemic.NET", "author_id": "166326763", "author_profile_image": "https:\/\/pbs.twimg.com\/profile_images\/1242182806274523136\/mlr_RoKf_normal.jpg", "author_screen_name": "GlobalPandemics", "sentiment": 1, "quoted_source_id": null, "tweet_text": "ALERT: 'We Have Made Mistakes': Norway Cruise Company Reports\nCOVID-19 Outbreak - Global Pandemic News | #Coronavirus #COVID19 #Protests - https:\/\/t.co\/1fuUcEr8y7 https:\/\/t.co\/05W3K1JgRr", "retweet_source_id": null, "media_list": [["photo", "https:\/\/pbs.twimg.com\/media\/Eeh_b-QU0AAqYfP.jpg"]], "type": "Tweet" }, { "t_location": null, "datetime": "2020-08-03 22:56:54", "tid": "1290421413778776067", "author": "GlobalPandemic.NET", "author_id": "166326763", "author_profile_image": "https:\/\/pbs.twimg.com\/profile_images\/1242182806274523136\/mlr_RoKf_normal.jpg", "author_screen_name": "GlobalPandemics", "sentiment": 1, "quoted_source_id": null, "tweet_text": "ALERT: 'We Have Made Mistakes': Norway Cruise Company Reports\nCOVID-19 Outbreak - Global Pandemic News | #Coronavirus #COVID19 #Protests - https:\/\/t.co\/1fuUcEr8y7 https:\/\/t.co\/05W3K1JgRr", "retweet_source_id": null, "media_list": [["photo", "https:\/\/pbs.twimg.com\/media\/Eeh_b-QU0AAqYfP.jpg"]], "type": "Tweet" }, { "t_location": null, "datetime": "2020-08-03 22:56:54", "tid": "1290421413778776067", "author": "GlobalPandemic.NET", "author_id": "166326763", "author_profile_image": "https:\/\/pbs.twimg.com\/profile_images\/1242182806274523136\/mlr_RoKf_normal.jpg", "author_screen_name": "GlobalPandemics", "sentiment": 1, "quoted_source_id": null, "tweet_text": "ALERT: 'We Have Made Mistakes': Norway Cruise Company Reports\nCOVID-19 Outbreak - Global Pandemic News | #Coronavirus #COVID19 #Protests - https:\/\/t.co\/1fuUcEr8y7 https:\/\/t.co\/05W3K1JgRr", "retweet_source_id": null, "media_list": [["photo", "https:\/\/pbs.twimg.com\/media\/Eeh_b-QU0AAqYfP.jpg"]], "type": "Tweet" }, { "t_location": null, "datetime": "2020-08-03 22:56:54", "tid": "1290421413778776067", "author": "GlobalPandemic.NET", "author_id": "166326763", "author_profile_image": "https:\/\/pbs.twimg.com\/profile_images\/1242182806274523136\/mlr_RoKf_normal.jpg", "author_screen_name": "GlobalPandemics", "sentiment": 1, "quoted_source_id": null, "tweet_text": "ALERT: 'We Have Made Mistakes': Norway Cruise Company Reports\nCOVID-19 Outbreak - Global Pandemic News | #Coronavirus #COVID19 #Protests - https:\/\/t.co\/1fuUcEr8y7 https:\/\/t.co\/05W3K1JgRr", "retweet_source_id": null, "media_list": [["photo", "https:\/\/pbs.twimg.com\/media\/Eeh_b-QU0AAqYfP.jpg"]], "type": "Tweet" }, { "t_location": null, "datetime": "2020-08-03 22:56:54", "tid": "1290421413778776067", "author": "GlobalPandemic.NET", "author_id": "166326763", "author_profile_image": "https:\/\/pbs.twimg.com\/profile_images\/1242182806274523136\/mlr_RoKf_normal.jpg", "author_screen_name": "GlobalPandemics", "sentiment": 1, "quoted_source_id": null, "tweet_text": "ALERT: 'We Have Made Mistakes': Norway Cruise Company Reports\nCOVID-19 Outbreak - Global Pandemic News | #Coronavirus #COVID19 #Protests - https:\/\/t.co\/1fuUcEr8y7 https:\/\/t.co\/05W3K1JgRr", "retweet_source_id": null, "media_list": [["photo", "https:\/\/pbs.twimg.com\/media\/Eeh_b-QU0AAqYfP.jpg"]], "type": "Tweet" }, { "t_location": null, "datetime": "2020-08-03 22:56:54", "tid": "1290421413778776067", "author": "GlobalPandemic.NET", "author_id": "166326763", "author_profile_image": "https:\/\/pbs.twimg.com\/profile_images\/1242182806274523136\/mlr_RoKf_normal.jpg", "author_screen_name": "GlobalPandemics", "sentiment": 1, "quoted_source_id": null, "tweet_text": "ALERT: 'We Have Made Mistakes': Norway Cruise Company Reports\nCOVID-19 Outbreak - Global Pandemic News | #Coronavirus #COVID19 #Protests - https:\/\/t.co\/1fuUcEr8y7 https:\/\/t.co\/05W3K1JgRr", "retweet_source_id": null, "media_list": [["photo", "https:\/\/pbs.twimg.com\/media\/Eeh_b-QU0AAqYfP.jpg"]], "type": "Tweet" }, { "t_location": null, "datetime": "2020-08-03 22:56:54", "tid": "1290421413778776067", "author": "GlobalPandemic.NET", "author_id": "166326763", "author_profile_image": "https:\/\/pbs.twimg.com\/profile_images\/1242182806274523136\/mlr_RoKf_normal.jpg", "author_screen_name": "GlobalPandemics", "sentiment": 1, "quoted_source_id": null, "tweet_text": "ALERT: 'We Have Made Mistakes': Norway Cruise Company Reports\nCOVID-19 Outbreak - Global Pandemic News | #Coronavirus #COVID19 #Protests - https:\/\/t.co\/1fuUcEr8y7 https:\/\/t.co\/05W3K1JgRr", "retweet_source_id": null, "media_list": [["photo", "https:\/\/pbs.twimg.com\/media\/Eeh_b-QU0AAqYfP.jpg"]], "type": "Tweet" }, { "t_location": null, "datetime": "2020-08-03 22:56:54", "tid": "1290421413778776067", "author": "GlobalPandemic.NET", "author_id": "166326763", "author_profile_image": "https:\/\/pbs.twimg.com\/profile_images\/1242182806274523136\/mlr_RoKf_normal.jpg", "author_screen_name": "GlobalPandemics", "sentiment": 1, "quoted_source_id": null, "tweet_text": "ALERT: 'We Have Made Mistakes': Norway Cruise Company Reports\nCOVID-19 Outbreak - Global Pandemic News | #Coronavirus #COVID19 #Protests - https:\/\/t.co\/1fuUcEr8y7 https:\/\/t.co\/05W3K1JgRr", "retweet_source_id": null, "media_list": [["photo", "https:\/\/pbs.twimg.com\/media\/Eeh_b-QU0AAqYfP.jpg"]], "type": "Tweet" }];


  return tempData;
}




