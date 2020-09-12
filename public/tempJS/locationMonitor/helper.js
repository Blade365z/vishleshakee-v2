export const get_current_time = (time) =>{
    var from_to_datetime;
    $.ajax({
        type: "GET",
        url: 'LM/getTime',
        data : {interval: time},
        async: false,
        success: function (response) {
            from_to_datetime = response;
            

                
        }
    });
    return from_to_datetime;
}


export const getTweetIdList = (from_datetime,to_datetime,place) => {
    var tweet_info;
    $.ajax({
        type: "GET",
        url: 'LM/getTweetId',
        data:{from :from_datetime,
                to:to_datetime,
                query: place},
        async: false,
        success: function (response) {
            tweet_info = response;
            console.log(tweet_info);
            
            

                
        }
    });

    return tweet_info;

    
    
}


