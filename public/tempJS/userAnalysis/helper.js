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
export const getUserDetails = (id) => {
    let userDetailsJSON;
    $.ajax({
        type: "GET",
        url: 'UA/getUserDetails',
        contentType: "application/json",
        data: { userID: id },
        dataType: "json",
        async: false,
        success: function (response) {
            userDetailsJSON = response;
        }
    });
    return userDetailsJSON;
}

export const getFreqDistDataForUA = (query,fromDate,toDate,toTime=null,rangeType) => {
    let freqDataUA;
    let dataArg;
    if(toTime){
        dataArg = {query,toTime,rangeType};
    }else{
        dataArg = { query,fromDate,toDate,rangeType};
    }
    $.ajax({
        type: "GET",
        url: 'UA/getFrequencyDataForUser',
        contentType: "application/json",
        data: dataArg,
        dataType: "json",
        async: false,
        success: function (response) {
            freqDataUA = response;
        }
    });
    return freqDataUA;
}