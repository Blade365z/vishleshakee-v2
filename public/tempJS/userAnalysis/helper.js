/*
The Script contains all the http API targets for User Analysis(Authenticated) of the Social Media Analysis tool 
developed at OSINT LAB , IIT-G

-----------------------------
IMPORTANT NOTE
-----------------------------
1.Use camelCase notations:)
2.PLEASE NOTE that the range types are :: 1. days , 2.hour , 3.10sec
3.Avoid using synchronous requests as XML-http-requests has been deprecated already.

Script written by : Mala Das (maladas601@gmail.com), Amitabh Boruah(amitabhyo@gmail.com)
*/

 

//API HEADERS for the http api requests
var HeadersForApi = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
};


//TODO::Change to FETCH !
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

//FETCH API Request for getting user details 
/*
Input----> UserID as string;
Output----> User Details (json)
*/
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


//FETCH API Request for Frequency Distribution data 
/*
Input----> IF(Day,Hour):query,fromDate,toDate,rangeType ELSE : Time 
Output----> Freq. Data(json)
*/
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



export const getTweetIDsForUA = async (query, from = null, to = null, rangeType,filter = null ,isDateTimeAlready=0)=> {
    let dataArgs;
    if (from!= null && to!= null && isDateTimeAlready==0) {
        dataArgs = JSON.stringify({ from, to, query,rangeType,filter,isDateTimeAlready});
    } else if(isDateTimeAlready==1){
        dataArgs = JSON.stringify({ from, to, query,rangeType,filter,isDateTimeAlready});
    }
    let response = await fetch('UA/getTweetIDs', {
        method: 'post',
        headers: HeadersForApi,
        body: dataArgs
    })
    let data = await response.json();
    return data;
}
