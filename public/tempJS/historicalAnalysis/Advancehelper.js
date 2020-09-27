/* this js is for advance search in historical analysis */


//API HEADERS for the http api requests
var HeadersForApi = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
};



export const requestToSpark = async (query_list, unique_name_timestamp) => {
    let dataArgs;
    dataArgs = JSON.stringify({ query_list, unique_name_timestamp });
    let response = await fetch('HA/requestToSpark', {
        method: 'post',
        headers: HeadersForApi,
        body: dataArgs
    })
    let data = await response.json();
    return data;
}


export const checkStatus = async (id, unique_name_timestamp) => {
    let dataArgs;
    dataArgs = JSON.stringify({ id, unique_name_timestamp });
    let response = await fetch('HA/getStatusFromSpark', {
        method: 'post',
        headers: HeadersForApi,
        body: dataArgs
    })
    let data = await response.json();
    return data;
}


export const storeToMySqlAdvanceSearchData = async (userID, queryID, fromDate, toDate, query) => {
    let dataArgs;
    dataArgs = JSON.stringify({ userID, queryID, fromDate, toDate,  query });
    let response = await fetch('status', {
        method: 'post',
        headers: HeadersForApi,
        body: dataArgs
    })
    let data = await response.json();
    return data;
}



export const getOuputFromSparkAndStoreAsJSON = async (id, unique_name_timestamp, userid) => {
    let dataArgs;
    dataArgs = JSON.stringify({ id, unique_name_timestamp, userid});
    let response = await fetch('HA/getOuputFromSparkAndStoreAsJSON', {
        method: 'post',
        headers: HeadersForApi,
        body: dataArgs
    })
    let data = await response.json();
    return data;
}




export const getFreqDistDataForAdvanceHA = async (query, from, to, rangeType, filename, userid) => {
    let dataArg;
    dataArg = JSON.stringify({ query, to, from, rangeType, filename, userid });
    
    let response = await fetch('HA/getFrequencyDataForHistoricalAdvance', {
        method: 'post',
        headers: HeadersForApi,
        body: dataArg
    }); 
    let data = await response.json()

    return data;
}



export const getSentiDistDataForAdvanceHA = async (query, from, to, rangeType, filename, userid) => {
    let dataArg;
    dataArg = JSON.stringify({ query, to, from, rangeType, filename, userid });
    
    let response = await fetch('HA/getSentimentDataForHistoricalAdvance', {
        method: 'post',
        headers: HeadersForApi,
        body: dataArg
    }); 
    let data = await response.json()
    return data;
}




export const getCooccurDataForAdvanceHA = async (query, from, to, option, uniqueID, userID, filename) => {
    let dataArg;
    dataArg = JSON.stringify({ query, from, to, option, uniqueID, userID, mode:'write', filename});
    
    let response = await fetch('HA/getCooccurDataForAdvance', {
        method: 'post',
        headers: HeadersForApi,
        body: dataArg
    }); 
    let data = await response.json()
    return data;
}



export const getTweetIDsForAdvanceHA = async (query, from = null, to = null, rangeType, filter = null,  userID, filename) => {
    let dataArgs;   
    dataArgs = JSON.stringify({ from, to, query, rangeType, filter, userID, filename });

    let response = await fetch('HA/getTweetIDForAdvance', {
        method: 'post',
        headers: HeadersForApi,
        body: dataArgs
    });
    
    let data = await response.json();
    return data;
}