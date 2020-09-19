// this js is for advance search in historical analysis


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