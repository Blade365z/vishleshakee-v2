/*
The Script contains all the http API targets for Home page for the Social Media Analysis tool 
developed at OSINT LAB , IIT-G

-----------------------------
IMPORTANT NOTE
-----------------------------
1.Use camelCase notations:)
2.Avoid using synchronous requests as XML-http-requests has been deprecated already.

Script written by : Mala Das (maladas601@gmail.com), Amitabh Boruah(amitabhyo@gmail.com)
*/




//API HEADERS for the http api requests
var HeadersForApi = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
};


export const getFreqDistData = async (interval = null, query, isRealTime = false, fromTime = null) => {
    let dataArgs;
    if (isRealTime == false) {
        dataArgs = JSON.stringify({ interval, query });
    } else {
        dataArgs = JSON.stringify({ fromTime, query });
    }
    let response = await fetch('smat/freqDist', {
        method: 'post',
        headers: HeadersForApi,
        body: dataArgs
    })
    let data = await response.json();
    return data
}


export const getSentiDistData = async (interval = null, query, isRealTime = false, fromTime = null) => {
    let dataArgs;
    if (isRealTime == false) {
        dataArgs = JSON.stringify({ interval, query });
    } else {
        dataArgs = JSON.stringify({ fromTime, query });
    }

    let response = await fetch('smat/sentiDist', {
        method: 'post',
        headers: HeadersForApi,
        body: dataArgs
    })
    let data = await response.json();
    return data
}


export const getTopCooccurData = async (interval = null, query, option, isRealTime = false, fromTime = null) => {
    let dataArrayTemp = [];
    let noOfNodes = 0;
    let finalTime = '', dataArgs, dataArgsForRead;
    if (isRealTime == false) {
        dataArgs = JSON.stringify({ interval, query, option });
        dataArgsForRead = JSON.stringify({ query, option, limit: 50 });
    } else {
        dataArgs = JSON.stringify({ fromTime, query, option });
    }
    console.log(dataArgs);
    let response = await fetch('smat/topCooccurDataPublic', {
        method: 'post',
        headers: HeadersForApi,
        body: dataArgs
    })
    let data = await response.json();
    if (isRealTime == false) {
      
        finalTime = data[0]['finalTime'];
        data = data[0]['data'];
        if (data.status == "success") {
            noOfNodes = data['nodes'];
            console.log(dataArgsForRead);
            let readResponse = await fetch('smat/readCooccurData', {
                method: 'post',
                headers: HeadersForApi,
                body: dataArgsForRead
            })
            let readData = await readResponse.json();
            dataArrayTemp.push({ 'data': readData, 'nodes': noOfNodes, 'finalTime': finalTime });
            return dataArrayTemp;
        }
    } else {
      return data;
    }
}


export const getMe = async () => {
    let response = await fetch('smat/getme', {
        method: 'get'
    });
    let data = await response.json()
    if (data.error) {
        if (localStorage.getItem('smat.me')) {
            localStorage.removeItem('smat.me');
        }
    }
    else {
        if (!localStorage.getItem('smat.me')) {
            localStorage.setItem('smat.me', JSON.stringify(data));

        }
    }


}

export const getTopData = async (interval) => {
    let response = await fetch('smat/getTopTrendingData', {
        method: 'post',
        headers: HeadersForApi,
        body: JSON.stringify({
            interval
        })
    });
    let data = await response.json()
    return data;
}



export const getTweetIDsFromController = async (interval = null, query, fromTime = null, toTime = null, filter = null) => {
    let dataArgs;
    if (interval == null && fromTime != null) {
        dataArgs = JSON.stringify({ fromTime, toTime, query });
    } else {
        dataArgs = JSON.stringify({ interval, query });
    }
    if (filter !== null) {
        dataArgs = JSON.stringify({ fromTime, toTime, query, filter });
    }
    let response = await fetch('smat/getTweetIDs', {
        method: 'post',
        headers: HeadersForApi,
        body: dataArgs
    })
    let data = await response.json();
    return data;
}