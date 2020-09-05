var  TweetIDS ;
export const  TweetsGenerator = (data_list, max_per_page, chart_draw_div_id) => {
    //per page max (max_per_page)
    TweetIDS = data_list;
    var tweetDiv = chart_draw_div_id + '_tweets';
    var tweet_div_page_selection =  chart_draw_div_id + 'page-selection';
      
    
       $('#'+chart_draw_div_id).html('<div id="'+tweetDiv+'"> </div><div> <div class="float-center " id="'+tweet_div_page_selection+'"></div>  </div>')  
    
    
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
  
      $('#'+tweet_div_page_selection).bootpag({
        total: slot,
        page: 1,
        maxVisible: 10
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
  
  const get_tweets_info_AjaxRequest = (slice_tid_list, callback) =>  {
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
            console.log(res);
        })
        .fail(function () {
            console.log("fd error");
        })
  }
  
   const generate_tweets_div = (tweetData,div) => {
    $('#' + div).html("");
    tweetData.forEach(tweet => {
      console.log(tweet);
      let sentiment = '' , category = '' , media='',location='';
      category =  (tweet.category=='normal') ? 'Normal' : ((tweet.category=='sec') ? 'Security' : ((tweet.category=='com') ?  'Communal' : 'Communal & Security' ));
      if(tweet.sentiment===0){
        sentiment = 'Postive';
      }else if (tweet.sentiment===1){
        sentiment = 'Negative';
      }else{
        sentiment = 'Neutral';
      }
  
      if(tweet.t_location){
        location = tweet.t_location;
      }
  
      
      $('#' + div).append('<div class="border p-2 "><div class="d-flex"><div class="profilePictureDiv p-1 text-center mr-2"><img src="'+tweet.author_profile_image+'" style="height:33px;border-radius:50%" /></div><div> <p class="pt-1 m-0 font-weight-bold">'+tweet.author+' </p><p class="smat-dash-title pull-text-top m-0 "> @'+tweet.author_screen_name+' </p></div> <div class="px-1 pt-1" >  <i class="fa fa-circle   mx-2 text-'+tweet.category+'" aria-hidden="true" title="'+category+'"></i> </div></div><div style="width:80%;"><p class="smat-tweet-body-text mb-1">'+tweet.tweet_text+'</p></div><div id="" class="row d-flex justify-content-center tweet_media_body_' +tweet['tid'] +'" ></div><div class="d-flex"><p class="m-0 tweet-details"> <span>  '+tweet.datetime+'  &nbsp </span> <span>'+location+'</span> &nbsp  <span class="text-normal clickable"> Track Tweet</span>  <span class=" font-weight-bold mx-2" > '+sentiment+'</span>    </p> </div></div>');
  
  
  
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