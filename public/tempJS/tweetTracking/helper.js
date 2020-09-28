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
    // console.log('ID',id);
    let data = await response.json()
    return data;
}


export const getFreqDataForTweets = async(id,from,to,type) => {
    let dataArgs = JSON.stringify({
        id,from,to,type
    })
    // console.log(dataArgs);
    let response = await fetch('track/getFrequencyDistributionTweet', {
        method: 'post',
        headers: HeadersForApi,
        body:dataArgs
    });
    let data = await response.json()
    return data;
}

