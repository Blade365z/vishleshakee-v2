
//API HEADERS for the http api requests
var HeadersForApi = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
};



export const getSuggestionsForUA = (userIDArray) => {
    let userSuggestionRes;
    $.ajax({
        type: "GET",
        url: 'UA/getSuggestedUsers',
        contentType: "application/json",
        data: { userIDArray },
        dataType: "json",
        async: false,
        success: function (response) {
            userSuggestionRes = response;
        }
    });
    return userSuggestionRes;
}
export const getUserDetails = async (id) => {
    let response = await fetch('UA/getUserDetailsTemp', {
        method: 'post',
        headers: HeadersForApi,
        body: JSON.stringify({
            userID: id
        })
    });
    let data = await response.json()
    return data;
}

export const getFreqDistDataForUA = async (query, fromDate, toDate, toTime = null, rangeType) => {
    let dataArg;
    if (toTime) {
        dataArg =JSON.stringify({ query, toTime, rangeType });
    } else {
        dataArg =JSON.stringify({  query, fromDate, toDate, rangeType });
    }
    let response = await fetch('UA/getFrequencyDataForUser', {
        method: 'post',
        headers: HeadersForApi,
        body:dataArg
    });
    let data = await response.json()
    return data;

}