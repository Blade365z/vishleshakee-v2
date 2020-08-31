
export const getFreqDistData = (interval, query) => {
    var freqData;
    $.ajax({
        type: "GET",
        url: 'smat/freqDist',
        contentType: "application/json",
        data:{interval,query},
        dataType: "json",
        async: false,
        success: function (response) {
          
            freqData = response;
    
        }
    });
    return freqData;
}


export const getSentiDistData = (interval, query) => {
    var sentiData;
    $.ajax({
        type: "GET",
        url: 'smat/sentiDist',
        contentType: "application/json",
        data:{interval,query},
        dataType: "json",
        async: false,
        success: function (response) {
                sentiData = response;
        }
    });
return sentiData;
}


export const getTopCooccurData = (interval, query ,type) => {
    let dataTopTemp;
    let dataArrayTemp = [];  
    let noOfNodes=0;
    let finalTime = '';
    $.ajax({
        type: "GET",
        url: 'smat/topCooccurDataPublic',
        contentType: "application/json",
        dataType: "json",
        data: {interval,query,option:type} ,
        async: false,
        success: function (response) {
            finalTime = response[0]['finalTime'];
            response = response[0]['data'];
                 
                    if(response.status=="success"){
                            noOfNodes = response['nodes'];
                       $.ajax({
                         type: "GET",
                        url: 'HA/coOccurDataFormatterHA',
                        contentType: "application/json",
                         dataType: "json",
                         data: {query,option:type,limit:50},
                         async: false,
                         success: function (response) {
                                    dataTopTemp = response;
                                }
                     });
        }
        }
    });
    dataArrayTemp.push({'data':dataTopTemp,'nodes':noOfNodes,'finalTime':finalTime});
    return dataArrayTemp;
}


export const getMe = () => {
    $.ajax({
        type: "GET",
        url: 'smat/getme',
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
             if(response.error){
                    if(localStorage.getItem('smat.me')){
                    localStorage.removeItem('smat.me');
                }
             }
             else{
                if(!localStorage.getItem('smat.me')){
                    localStorage.setItem('smat.me', JSON.stringify(response));
                
                 }
             }
        }
    });

}

export const getTopData = (interval) => {
    let topDataTemp;
     $.ajax({
        type: "GET",
        url: 'smat/getTopTrendingData',
        contentType: "application/json",
        data: {interval},
        dataType: "json",
        async:false,
        success: function (response) {
                topDataTemp=response['data'];     
            }
    });
return topDataTemp;
}

