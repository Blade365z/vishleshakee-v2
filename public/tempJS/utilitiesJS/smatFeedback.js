
import {get_tweets_info_AjaxRequest ,generate_tweets_div} from '../utilitiesJS/TweetGenerator.js';
//API HEADERS for the http api requests
var HeadersForApi = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
};


export const insertFeedbackForTweets = async (tweetID,userID,feedbackType,originalTag,feedbackTag) => {
    let dataArgs =  JSON.stringify({
        tweetID,userID,feedbackType,originalTag,feedbackTag
    })
    let response = await fetch('feedback', {
        method: 'post',
        headers: HeadersForApi,
        body: dataArgs
    })
    let data = await response.json();
    return data;
}

export const checkIfFeedbackAlreadyGiven = async (userID,tweetID,feedbackType) => {
    let dataArgs =  JSON.stringify({
        userID,tweetID,feedbackType
    })

    let response = await fetch('getFeedback', {
        method: 'post',
        headers: HeadersForApi,
        body: dataArgs
    })
    let data = await response.json();
    return data;
}


export const smatFeedbackMain = () => {
    var feedbackArgs = [];
$('body').on('click','div .feedbackOption',function(){
    let args = $(this).attr('value');
    feedbackArgs = args.split(/[|]/).filter(Boolean);
    let userIDForFeedbackTemp = feedbackArgs[1];
    let tweetIDForFeedbackTemp=feedbackArgs[0];
    let originalSentimentTagTemp=feedbackArgs[2];
    let originalCategoryTagTemp=feedbackArgs[2];
    $('#feedbackModalBody').html('');
    $('#feedbackModalBody').html('<div class="text-center pt-5 " ><i class="fa fa-circle-o-notch donutSpinner" aria-hidden="true"></i></div>')

    $('#smatTweetFeedbackModal').modal('show');
    let arrTemp = [tweetIDForFeedbackTemp];
    checkIfFeedbackAlreadyGiven(userIDForFeedbackTemp,tweetIDForFeedbackTemp,'sentiment').then(response=>{
        response.length > 0 ?  $('#categorySentimentButtons').html('<div class="alert-danger px-3" >Feedback Already Provided!</div> ') : $('#categorySentimentButtons').html(' <div class="my-1 mx-2"><i class="fa fa-circle text-pos feedbackIcon " aria-hidden="true" title="Positive" value="0-sentiment"></i> </div><div class="my-1 mx-2"> <i class="fa fa-circle text-neg feedbackIcon" aria-hidden="true" title="Negative" value="1-sentiment"></i></div><div class="my-1 mx-2"><i class="fa fa-circle text-neu feedbackIcon" aria-hidden="true" title="Neutral" value="2-sentiment"></i> </div>');  
    });
    checkIfFeedbackAlreadyGiven(userIDForFeedbackTemp,tweetIDForFeedbackTemp,'category').then(response=>{
        response.length > 0 ?  $('#categoryFeedbackButtons').html('<div class="alert-danger px-3" >Feedback Already Provided!</div> ') :  $('#categoryFeedbackButtons').html('<div class="my-1 mx-2"><i class="fa fa-circle text-normal feedbackIcon" aria-hidden="true" title="Normal"  value="normal-category" ></i> </div><div class="my-1 mx-2"> <i class="fa fa-circle text-sec feedbackIcon" aria-hidden="true" title="Security" value="sec-category"></i></div><div class="my-1 mx-2"><i class="fa fa-circle text-com feedbackIcon" aria-hidden="true" title="Communal" value="com-category"></i> </div><div class="my-1 mx-2"><i class="fa fa-circle text-com_sec feedbackIcon" aria-hidden="true" title="Communal & Security" value="com_sec-category"> </i> </div>');
        });
    
    get_tweets_info_AjaxRequest(arrTemp, function (response) {
        generate_tweets_div(response, 'feedbackModalBody', false );
    });

// TweetsGenerator(arrTemp, 1, 'feedbackModalBody', fromDate, toDate)
})

$('body').on('click','div .feedbackIcon',function(){
    let userIDForFeedbackTemp = feedbackArgs[1];
    let tweetIDForFeedbackTemp=feedbackArgs[0];
    let originalSentimentTagTemp=feedbackArgs[2];
    let originalCategoryTagTemp=feedbackArgs[3];
    let valueArgs= $(this).attr('value');
    valueArgs = valueArgs.split(/[-]/).filter(Boolean);
    let feedbackTag = valueArgs[0];
    let feedbackType = valueArgs[1];
    let originalTag='';
    
    if(feedbackType==='sentiment'){
        originalTag =  originalSentimentTagTemp; 
    }else{
       originalTag =  originalCategoryTagTemp ;
    }
    insertFeedbackForTweets(tweetIDForFeedbackTemp,userIDForFeedbackTemp,feedbackType,originalTag,feedbackTag).then(response => {
            if(response.data){
                feedbackType === 'category' ? $('#categoryFeedbackButtons').html('<div class="alert-success px-3">'+response.data+'</div> ') : $('#categorySentimentButtons').html('<div class="alert-success px-3">'+response.data+'</div> ') ;
            }
    });
})



}