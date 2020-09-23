//API HEADERS for the http api requests
var HeadersForApi = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
};


export const getTweetInfo = async (id) => {
    let response = await fetch('track/getTweetInfo', {
        method: 'post',
        headers: HeadersForApi,
        body: JSON.stringify({
            id
        })
    });
    let data = await response.json()
    return data;
}


export const getTweetRAWTEMP =(tweetData, div, dropDownArg = true) => {
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


        $('#' + div).append('<div class="border  p-2 "><div class="d-flex"><div class="profilePictureDiv p-1 text-center mr-2"><img src="' + tweet.author_profile_image + '" style="height:33px;border-radius:50%" /></div><div> <p class="pt-1 m-0 font-weight-bold username"   value="' + tweet.author_id + '" >' + tweet.author + ' </p><p class="smat-dash-title pull-text-top m-0 "> @' + tweet.author_screen_name + ' </p></div> <div class="px-1 pt-1 mx-2  " >  <i class="fa fa-circle   text-' + tweet.category + '" aria-hidden="true" title="' + category + '"></i> </div> ' + feedback + '</div>  <div style="width:80%;"><p class="smat-tweet-body-text mb-1">' + tweet.tweet_text + '</p></div><div id="" class="row d-flex justify-content-center tweet_media_body_' + tweet['tid'] + '" ></div><div class="d-flex"><p class="m-0 tweet-details"> <span>  ' + tweet.datetime + '  &nbsp </span> <span>' + location + '</span> &nbsp   <span class=" mx-2" >  <i class="fa fa-circle text-' + senticlass + '" aria-hidden="true" title="' + sentiment + '"></i>  ' + sentiment + '</span>              </p> </div></div>');



    });
}