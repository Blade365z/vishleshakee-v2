/*
The Script conatains the modules to render the Rww tweets on the Social Media Analysis tool 
developed at OSINT LAB , IIT-G

-----------------------------
IMPORTANT NOTE
-----------------------------
1.Use camelCase notations:)
2.PLEASE NOTE that the range types are :: 1. days , 2.hour , 3.10sec
3.Avoid using synchronous requests as XML-http-requests has been deprecated already.

Script written by : Mala Das(maladas601@gmail.com), Amitabh Boruah(amitabhyo@gmail.com)
*/



var TweetIDS;


export const TweetsGenerator = (data_list, max_per_page, chart_draw_div_id, fromDate, toDate, filterOptions = false, rangeType = null) => {
  //per page max (max_per_page)
  TweetIDS = data_list;
  var tweetDiv = chart_draw_div_id + '_tweets';
  var tweet_div_page_selection = chart_draw_div_id + 'page-selection';
  let title='';
  if(fromDate && toDate){
    title='<div class="mx-1 mt-3 d-flex">Tweets from: ' + fromDate + ' to ' + toDate + ' &nbsp '  + '   </div>';
  }

  if (filterOptions) {
    filterOptions = '<div class="btn-group pull-text-top ml-auto"><button type="button"\
               class="btn btn-white smat-rounded dropdown-toggle text-normal" data-toggle="dropdown"\
               aria-haspopup="true" aria-expanded="false">Filter Tweets</button>\
           <div class="dropdown-menu dropdown-menu-right">\
           <li class="dropdown-item clickable filter-pos-tweets filterTweets" value="all|'+ fromDate + '|' + toDate + '|' + chart_draw_div_id + '|' + rangeType + '"   id="' + chart_draw_div_id + rangeType + '">Show All Tweets</li>\
               <li class="dropdown-item clickable filter-pos-tweets filterTweets" value="pos|'+ fromDate + '|' + toDate + '|' + chart_draw_div_id + '|' + rangeType + '"   id="' + chart_draw_div_id + rangeType + '"><i class="fa fa-circle text-pos "\
                       aria-hidden="true" ></i> Positive Tweets</li>\
               <li class="dropdown-item clickable filter-neg-tweets filterTweets " value="neg|'+ fromDate + '|' + toDate + '|' + chart_draw_div_id + '|' + rangeType + '"   id="' + chart_draw_div_id + rangeType + '" ><i class="fa fa-circle text-neg "\
                       aria-hidden="true"></i> Negative Tweets</li>\
               <li class="dropdown-item clickable filter-neu-tweets filterTweets "  value="neu|'+ fromDate + '|' + toDate + '|' + chart_draw_div_id + '|' + rangeType + '"  id="' + chart_draw_div_id + rangeType + '"> <i class="fa fa-circle text-neu"\
                       aria-hidden="true"></i> Neutral Tweets</li>\
               <li class="dropdown-item clickable filter-normal-tweets filterTweets " value="normal|'+ fromDate + '|' + toDate + '|' + chart_draw_div_id + '|' + rangeType + '"   id="' + chart_draw_div_id + rangeType + '"> <i\
                       class="fa fa-circle text-normal" aria-hidden="true"></i> Normal Tweets</li>\
               <li class="dropdown-item clickable filter-com-tweets filterTweets " value="com|'+ fromDate + '|' + toDate + '|' + chart_draw_div_id + '|' + rangeType + '"  id="' + chart_draw_div_id + rangeType + ' " > <i class="fa fa-circle text-com"\
                       aria-hidden="true"></i> Communal Tweets</li>\
               <li class="dropdown-item clickable filter-sec-tweets filterTweets " value="sec|'+ fromDate + '|' + toDate + '|' + chart_draw_div_id + '|' + rangeType + '"   id="' + chart_draw_div_id + rangeType + '"> <i class="fa fa-circle text-sec"\
                       aria-hidden="true"></i> Security Tweets</li>\
               <li class="dropdown-item clickable filter-seccom-tweets filterTweets"  value="com_sec|'+ fromDate + '|' + toDate + '|' + chart_draw_div_id + '|' + rangeType + '"   id="' + chart_draw_div_id + rangeType + '"> <i\
                       class="fa fa-circle text-seccom" aria-hidden="true"></i> Communal and Security\
                   Tweets</li>\
           </div>\
       </div>\
  ';
  } else {
    filterOptions = '';
  }

  $('#' + chart_draw_div_id).html(title+'<div id="' + tweetDiv + '"> </div><div> <div class="float-center " id="' + tweet_div_page_selection + '"></div>  </div>')


  $(tweet_div_page_selection).empty();
  $(tweet_div_page_selection).removeData("twbs-pagination");
  $(tweet_div_page_selection).unbind("page");

  var total_length = TweetIDS.length; // total_length = 384
  var slot = total_length / max_per_page; // total_length = 3
  slot = (total_length % max_per_page) ? slot + 1 : slot; //if total_length = 384 ? 3+1 : 3

  // by deafult get first page (max (max_per_page))
  var num = 1;
  var start_index = (num - 1) * max_per_page;
  var final_index = start_index + (max_per_page - 1);
  var slice_tid_list = TweetIDS.slice(start_index, (final_index + 1));
  get_tweets_info_AjaxRequest(slice_tid_list, function (result) {
    generate_tweets_div(result, tweetDiv);
  });
  //.......................................END

  $('#' + tweet_div_page_selection).bootpag({
    total: slot,
    page: 1,
    maxVisible: 6
  }).on('page', function (event, num) {
    $("#" + tweetDiv).scrollTop(0);
    /* *******************
    //if max_per_page = 100
    //when num = 0 --> start_index = 0 , final_index = 99
    //when num = 1 --> start_index = 100 , final_index = 199
    //when num = 2 --> start_index = 200 , final_index = 299
    // start_index=(1-1)*100 = 0*100 = 0, where num=1
    // final_index=0+(100-1) = 0+99, from 0-->99=100
    // slice_tid_list = data_list.slice(0, (99+1))
    ******************  */
    var start_index = (num - 1) * max_per_page;
    var final_index = start_index + (max_per_page - 1);
    var slice_tid_list = TweetIDS.slice(start_index, (final_index + 1)); // slice list including 100 element 

    /* ****** 
    // depend on num --> tweet_id list will change on that div id = "content" and 
    // get tweet_info of those tweet_ids and show on div
    ****** */
    get_tweets_info_AjaxRequest(slice_tid_list, function (result) {
      generate_tweets_div(result, tweetDiv);
    });
  });
}

export const get_tweets_info_AjaxRequest = (slice_tid_list, callback) => {
  $.ajax({
    url: 'smat/getTweetsRaw',
    type: 'GET',
    dataType: 'JSON',
    data: {
      tweet_id_list: slice_tid_list
    }
  })
    .done(function (res) {
      callback(res);

    })
    .fail(function () {
      console.log("fd error");
    })
}

export const generate_tweets_div = (tweetData, div, dropDownArg = true) => {
  let userIDTemp, feedback = '';
  console.log(tweetData);
  if (localStorage.getItem('smat.me')) {
    let userInfoJSON = JSON.parse(localStorage.getItem('smat.me'));
    userIDTemp = userInfoJSON['id'];
  }

  $('#' + div).html("");
  tweetData.forEach(tweet => {
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
   let senticlass='';
    category = (tweet.category == 'normal') ? 'Normal' : ((tweet.category == 'sec') ? 'Security' : ((tweet.category == 'com') ? 'Communal' : 'Communal & Security'));
    if (tweet.sentiment === 0) {
      sentiment = 'Postive';
      senticlass='pos'
    } else if (tweet.sentiment === 1) {
      sentiment = 'Negative';
      senticlass='neg'
    } else {
      sentiment = 'Neutral';
      senticlass='neu'
    }

    if (tweet.t_location) {
      location = tweet.t_location;
    }

 
    $('#' + div).append('<div class="border  p-2 "><div class="d-flex"><div class="profilePictureDiv p-1 text-center mr-2"><img src="' + tweet.author_profile_image + '" style="height:33px;border-radius:50%" /></div><div> <p class="pt-1 m-0 font-weight-bold username"   value="'+tweet.author_id+'" >' + tweet.author + ' </p><p class="smat-dash-title pull-text-top m-0 "> @' + tweet.author_screen_name + ' </p></div> <div class="px-1 pt-1 mx-2  " >  <i class="fa fa-circle   text-' + tweet.category + '" aria-hidden="true" title="' + category + '"></i> </div> ' + feedback + '</div>  <div style="width:80%;"><p class="smat-tweet-body-text mb-1">' + tweet.tweet_text + '</p></div><div id="" class="row d-flex justify-content-center tweet_media_body_' + tweet['tid'] + '" ></div><div class="d-flex"><p class="m-0 tweet-details"> <span>  ' + tweet.datetime + '  &nbsp </span> <span>' + location + '</span> &nbsp   <span class=" mx-2" >  <i class="fa fa-circle text-' + senticlass + '" aria-hidden="true" title="' + sentiment + '"></i>  ' + sentiment + '</span>              </p> </div></div>');



    if (tweet['media_list'].length > 0) {
      $('.tweet_media_body_' + tweet['tid']).html(
        '<div class="row d-flex justify-content center" style="width:60%;height:90%;padding:20px;"><div class="col tweet_media_body_' +
        tweet['tid'] +
        '_0"></div><div class="col-3 "> <div class="row  tweet_media_body_' +
        tweet['tid'] +
        '_1" style="height:33%;overflow:hidden;">  </div>  <div class="row tweet_media_body_' +
        tweet['tid'] +
        '_3" style="height:33%;overflow:hidden;"> </div> <div class="row tweet_media_body_' +
        tweet['tid'] +
        '_4" style="height:33%;overflow:hidden;">  </div> </div></div>'
      )
      for (var i = 0; i < tweet['media_list'].length; i++) {
        if (tweet['media_list'][i][0] == 'photo') {
          $('.tweet_media_body_' + tweet['tid'] + '_' + i).html(
            '<img  class="image_content" src="' +
            tweet['media_list'][i][1] +
            '" width="100%" height="100%">'
          )
        } else if (tweet['media_list'][i][0] == 'video') {
          $('.tweet_media_body_' + tweet['tid'] + '_' + i).html(
            '<video width="100%" height=auto controls><source src="' +
            tweet['media_list'][i][1] +
            '" type="video/mp4"></video>'
          )
        }
      }
    }

  });

}




