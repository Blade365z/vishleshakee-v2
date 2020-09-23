// this js is for advance search in historical analysis


export const requestToSpark = (query_list, unique_name_timestamp) => {
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


export const checkStatus = (id, unique_name_timestamp) => {
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


export const storeToMySqlAdvanceSearchData = (userID, queryID, fromDate, toDate, query) => {
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



export const getOuputFromSparkAndStoreAsJSON = (id, unique_name_timestamp) => {
    let dataArgs;
    dataArgs = JSON.stringify({ id, unique_name_timestamp });
    let response = await fetch('HA/getOuputFromSparkAndStoreAsJSON', {
        method: 'post',
        headers: HeadersForApi,
        body: dataArgs
    })
    let data = await response.json();
    return data;
}






export const getFreqDistDataForAdvanceHA = async (query, from, to, toTime = null, rangeType, isDateTimeAlready = 0) => {
    let dataArg;
    if (toTime) {
        dataArg = JSON.stringify({ query, toTime, rangeType, isDateTimeAlready });
    } else {
        dataArg = JSON.stringify({ query, from, to, rangeType, isDateTimeAlready });
    }
    let response = await fetch('HA/getFrequencyDataForHistorical', {
        method: 'post',
        headers: HeadersForApi,
        body: dataArg
    }); 
    let data = await response.json()

    return data;
}