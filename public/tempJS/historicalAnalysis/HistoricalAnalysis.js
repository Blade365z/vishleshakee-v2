//imports 

import { getFreqDistDataForHA, getTweetIDsForHA, getSentiDistDataForHA, getCooccurDataForHA, getTopDataHA } from './helper.js'
import { generateFreqDistBarChart, generateFrequencyLineChart, generateSentiDistBarChart, generateSentiDistLineChart, generateBarChartForCooccur } from './chartHelper.js';
import { getCurrentDate, getRangeType, dateProcessor } from '../utilitiesJS/smatDate.js';
import { TweetsGenerator } from '../utilitiesJS/TweetGenerator.js';
import { generateUniqueID } from '../utilitiesJS/uniqueIDGenerator.js';
import { makeSuggestionsRead,makeSmatReady } from '../utilitiesJS/smatExtras.js'




 

//Global variable definitions 
var mainInputCounter = 0, statusTableFlag = 0, searchType = 0;
var searchRecords = [];
var fromDate = '', toDate = '', query = '';
let hashtagSuggestion = [];
//0:Normal, 1:AdvancedSearch
var mentionUniqueID = '', hashtagUniqueID = '', userUniqueID = '', userID;
if (localStorage.getItem('smat.me')) {
    let userInfoTemp = JSON.parse(localStorage.getItem('smat.me'));
    userID = userInfoTemp['id'];

} else {
    window.location.href = 'login';
}

jQuery(function () {
    makeSmatReady();
    // initiateHistoricalAnalysis('#WorldUnitedForSSRJustice','2020-09-08','2020-09-11');

    // /haQueryInputBox

    fromDate = getCurrentDate()
    toDate = dateProcessor(toDate, '-', 0);
    $("#fromDateHA").val(fromDate);
    $("#toDateHA").val(fromDate);
    getTopDataHA(fromDate, fromDate, 'top_hashtag', 50).then(response => {
        makeSuggestionsRead(response.data,'haQueryInputBox');
    });

    mainInputCounter = 0;
    statusTableFlag = 0;
    searchType = 0;
    $('.nav-item ').removeClass('smat-nav-active');
    $('#nav-HA').addClass('smat-nav-active');

    $('#addQueryButton').on('click', function () {
        mainInputCounter += 1;
        if (searchType !== 0)
            searchType = 1;
        $('#removeField').css('display', 'block');

        $('#queryInputDiv').append('<div id="fieldID' + mainInputCounter + '" ><div class=" form-group  d-flex"><div class="" value="' + mainInputCounter + '"><select class=" smat-select btn HA-operand-select mx-2" id="operandID' + mainInputCounter + '" ><option value="&">AND</option><option class="or-option"  value="+">OR</option></select></div><div class=" border smat-rounded px-2 py-1 bg-white w-100 d-flex" ><input  type="checkbox" value="" name="NOT" id="notID' + mainInputCounter + '" title="NOT" value="option2" style="margin-top:13px;"><input type="text" class="form-control  smat-ha-Input " id="queryID' + mainInputCounter + '" placeholder="Query"  autocomplete="OFF" required></div></div></div>');
        if (mainInputCounter === 3) {
            $('#addQueryButton').css('display', 'none');
        }
    });


    $('body').on('change', 'div .HA-operand-select', function () {
        let operandTemp = $(this).val();
        let idTemp = $(this).parent().attr('value');
        $('#notID' + idTemp).prop('checked', false); // Unchecks it
        if (operandTemp === '+') {

            $('#notID' + idTemp).css('display', 'none');
        } else {
            $('#notID' + idTemp).css('display', 'block');
        }

    })
    $('#removeField').on('click', function () {
        $('#fieldID' + mainInputCounter).remove();
        mainInputCounter -= 1;
        if (mainInputCounter < 1) {
            $('#removeField').css('display', 'none');
            searchType = 0;
        }
        if ($('#addQueryButton').is(":hidden") && mainInputCounter < 3) {
            $('#addQueryButton').css('display', 'block');
        }
    });

    $('#haQueryInputs').on('submit', function (event) {
        event.preventDefault();
        let q = $('#queryToken').val();

        statusTableFlag = 1;
        $('#searchTable').css('display', 'block');
        let fromDate = $('#fromDateHA').val();
        let toDate = $('#toDateHA').val();
        if (mainInputCounter > 0) {
            for (let i = 0; i <= mainInputCounter; i++) {
                if (i != 0) {
                    let qTemp = '(' + q;
                    let queryInput = $('#queryID' + i).val();
                    if (document.getElementById('notID' + i).checked) {
                        queryInput = '!' + queryInput;
                    }
                    let operandInput = $('#operandID' + i).val();
                    qTemp = qTemp + operandInput + queryInput + ')';
                    q = qTemp;
                }
            }
        }
        updateStatusTable(q, fromDate, toDate);
        resetQueryPanel(mainInputCounter);
    })
    $('#showTableBtn').on('click', function () {
        if (statusTableFlag === 0) {
            $('#searchTable').css('display', 'block');
            statusTableFlag = 1;
        }
        else {
            $('#searchTable').css('display', 'none');
            statusTableFlag = 0;
        }

    })


    $('#frqTabHA').on('click', function () {
    });
    $('#sentiTabHA').on('click', function () {
    });

    $('#mentionsTabHA').on('click', function () {
    });




    //TweetFiter
    $('body').on('click', 'div .filterTweets', function () {
        let args = $(this).attr('value');
        args = args.split(/[|]/).filter(Boolean);

        if (args[4] === 'hour' || args[4] === 'day') {
            getTweetIDsForHA(query, args[1], args[2], args[4], args[0]).then(response => {
                TweetsGenerator(response.data, 6, args[3], args[1], args[2], true, args[4]);
            });
        } else if (args[4] === '10sec') {
            getTweetIDsForHA(query, args[1], args[2], args[4], args[0], 1).then(response => {
                TweetsGenerator(response.data, 6, args[3], args[1], args[2], true, args[4]);
            });
        }
    });







});


//The Function below are specific to the query panel:: NOT COOMPLETED YET!!!
//TODO::Formulatem these functions based on the searches
$('body').on('click', '.showBtn', function () {
    $('#analysisPanelHA').css('display', 'block');
    let recordsCaptured = searchRecords[$(this).attr('value')];
    initiateHistoricalAnalysis(recordsCaptured[0]['query'], recordsCaptured[0]['from'], recordsCaptured[0]['to'], recordsCaptured[0]['mentionUniqueID'], recordsCaptured[0]['hashtagUniqueID'], recordsCaptured[0]['userUniqueID']);

});
const updateStatusTable = (query, fromDate, toDate) => {
    let currentTimestamp = new Date().getTime();
    let queryElement = decodeQuery(query);
    $('#tableInitialTitle').remove();
    mentionUniqueID = generateUniqueID();
    hashtagUniqueID = generateUniqueID();
    userUniqueID = generateUniqueID();
    $('#haStatusTable').append('<tr><th scope="row">' + currentTimestamp + '</th><td>' + queryElement + '</td><td>' + fromDate + '</td><td>' + toDate + '</td><td>Ready</td><td><button class="btn btn-primary smat-rounded mx-1 showBtn" value="' + currentTimestamp + '"> Show </button><button class="btn btn-neg mx-1  smat-rounded"> Delete </button></td></tr>');

    //TODO::status read--.
    let recordTemp = [{ 'query': query, 'from': fromDate, 'to': toDate, 'mentionUniqueID': mentionUniqueID, 'hashtagUniqueID': hashtagUniqueID, 'userUniqueID': userUniqueID }];
    searchRecords[currentTimestamp] = recordTemp;
}
const resetQueryPanel = (counter) => {
    for (let i = 0; i <= counter; i++) {
        $('#fieldID' + i).remove();
    }
    $('#queryToken').val('');
    $('#fromDateHA').val('');
    $('#toDateHA').val('');
    $('#removeField').css('display', 'none');

}

const decodeQuery = (query) => {
    // let query = '#CAA&#Radio+!*protest';
    let queries = query.split(/[+&]+/g).filter(Boolean);
    let operands = query.match(/[+&]+/g);

    let counter = 0;
    let finalString = '';
    finalString = '<div>';
    for (let i = 0; i < queries.length; i++) {
        if (i == 0) {
            finalString += '<span>' + queries[i] + '</span> ';
        } else {
            finalString += '<span> <b>' + decodeOperand(operands[i - 1]) + '</b> </span> ';
            if (queries[i].includes('!')) {
                let tempQuery = queries[i].replace('!', '');
                finalString += '<span class="NOT">' + tempQuery + '</span> ';
            }

            else
                finalString += '<span>' + queries[i] + '</span> ';
        }
    }

    return finalString;
}

const decodeOperand = (operand) => {
    if (operand == '&')
        return 'AND';
    else
        return 'OR'
}


/*
-------------------------------------------------------------------------
            HISTORICAL ANALYSIS  MAIN LOGIC STARTS HERE 
------------------------------------------------------------------------
(Please use camelCase Notation :) )
*/



const initiateHistoricalAnalysis = (queryTemp, fromTemp, toTemp, mentionID, hashtagID, activeUserID) => {
    //  mentionUniqueID = generateUniqueID();



    query = queryTemp;
    fromDate = fromTemp;
    toDate = toTemp;
    $('#currentlySearchedQuery').text(query);
    $('#analysisPanelHA').css('display', 'block');
    let rangeType = getRangeType(fromDate, toDate);
    frequencyDistributionHA(query, rangeType, fromDate, toDate, null, 'freqContentHA', false);
    sentimentDistributionHA(query, rangeType, fromDate, toDate, null, 'sentiContentHA', false);
    plotDistributionGraphHA(query, fromDate, toDate, 'user', activeUserID, userID, 'usersContentHA');
    plotDistributionGraphHA(query, fromDate, toDate, 'mention', mentionID, userID, 'mentionsContentHA');
    plotDistributionGraphHA(query, fromDate, toDate, 'hashtag', hashtagID, userID, 'hashtagsContentTab');
}




let freqParentDiv = 'freqContentHA';
export const frequencyDistributionHA = (query = null, rangeType, fromDate = null, toDate = null, toTime = null, div, appendArg = false) => {
    let chartType = 'freq-chart';
    let appendedChartParentID = rangeType + '-' + chartType;
    $('.' + appendedChartParentID).remove();

    let chartDivID = div + '-' + rangeType + '-chart';
    let summaryDivID = div + '-' + rangeType + '-summary';
    let chartTweetDivID = div + rangeType + '-tweets';
    // class="' + rangeType + '-charts"
    console.log(chartDivID);
    if (rangeType == 'hour') {
        $('.hour-chart').remove();
        $('.10sec-chart').remove();
    }
    if (appendArg) {
        $('#' + freqParentDiv).append('<div class=" mt-2   appendedChart ' + appendedChartParentID + '"   ><div class="d-flex"> <div class="mr-auto closeGraph"    value="' + rangeType + '-charts" title="close" >  <i class="fas fa-times"></i> </div> </div> <div class="row"><div class="col-sm-8"><div class="haTab freqDistChart border" id="' + chartDivID + '" ></div></div><div class="col-sm-4"><div class="freqDistTweets border" id="' + chartTweetDivID + '"></div><div class="freqDistSummary border d-flex pt-2"  id="' + summaryDivID + '" ></div></div></div></div>');
    } else {
        $('#' + div).html('<div><div class="row"><div class="col-sm-8"><div class="haTab freqDistChart border" id="' + chartDivID + '" ></div></div><div class="col-sm-4"><div class="freqDistTweets border" id="' + chartTweetDivID + '"></div><div class="freqDistSummary border d-flex pt-2"  id="' + summaryDivID + '" ></div></div></div></div>');
    }
    //Loader...
    $('#' + chartDivID).html('<div class="text-center pt-5 " ><i class="fa fa-circle-o-notch donutSpinner" aria-hidden="true"></i></div>')
    $('#' + chartTweetDivID).html('<div class="text-center pt-5 " ><i class="fa fa-circle-o-notch donutSpinner" aria-hidden="true"></i></div>')
    if (rangeType == 'day') {
        getFreqDistDataForHA(query, fromDate, toDate, null, rangeType, 0).then(data => {
            generateFreqDistBarChart(query, data, rangeType, chartDivID);
            freqSummaryGenerator(data, summaryDivID, rangeType);
        });
        getTweetIDsForHA(query, fromDate, toDate, rangeType, null).then(response => {
            TweetsGenerator(response.data, 6, chartTweetDivID, fromDate, toDate, true, rangeType);
        });

    } else if (rangeType == 'hour') {
        getFreqDistDataForHA(query, fromDate, toDate, null, rangeType, 0).then(data => {
            generateFreqDistBarChart(query, data, rangeType, chartDivID);
            freqSummaryGenerator(data, summaryDivID, rangeType);
        });
        getTweetIDsForHA(query, fromDate, toDate, rangeType, null).then(response => {
            TweetsGenerator(response.data, 6, chartTweetDivID, fromDate, toDate, true, rangeType);
        });

    } else {
        getFreqDistDataForHA(query, fromDate, toDate, null, rangeType, 1).then(data => {
            generateFrequencyLineChart(query, data, rangeType, chartDivID);
            freqSummaryGenerator(data, summaryDivID, rangeType);
        });
        getTweetIDsForHA(query, fromDate, toDate, rangeType, null, 1).then(response => {
            let fromDateTemp = fromDate.split(/[ ,]+/).filter(Boolean);
            TweetsGenerator(response.data, 6, chartTweetDivID, fromDate, fromDate, true, rangeType);
        });
    }

}

let sentiParentDiv = 'sentiContentHA';
export const sentimentDistributionHA = (query = null, rangeType, fromDate = null, toDate = null, toTime = null, div, appendArg = false) => {
    let chartType = 'senti-chart';
    let appendedChartParentID = rangeType + '-' + chartType;
    $('.' + appendedChartParentID).remove();
    let chartDivID = div + '-' + rangeType + '-chart';
    let summaryDivID = div + '-' + rangeType + '-summary';
    let chartTweetDivID = div + rangeType + '-tweets';
    if (rangeType == 'hour') {
        $('.hour-chart').remove();
        $('.10sec-chart').remove();
    }
    if (appendArg) {
        $('#' + sentiParentDiv).append('<div class=" mt-2 ' + appendedChartParentID + '"><div class="d-flex"> <div class="mr-auto closeGraph"    value="' + rangeType + '-charts" title="close" >  <i class="fas fa-times"></i> </div> </div> <div class="row"><div class="col-sm-8"><div class="uaTab sentiDistChart border" id="' + chartDivID + '" ></div></div><div class="col-sm-4"><div class="sentiDistTweets border" id="' + chartTweetDivID + '"></div><div class="sentiDistSummary border d-flex pt-2"  id="' + summaryDivID + '" ></div></div></div></div>');
    } else {
        $('#' + div).html('<div><div class="row"><div class="col-sm-8"><div class="uaTab sentiDistChart border" id="' + chartDivID + '" ></div></div><div class="col-sm-4"><div class="sentiDistTweets border" id="' + chartTweetDivID + '"></div><div class="sentiDistSummary border d-flex pt-2"  id="' + summaryDivID + '" ></div></div></div></div>');
    }
    //Loader...
    $('#' + chartDivID).html('<div class="text-center pt-5 " ><i class="fa fa-circle-o-notch donutSpinner" aria-hidden="true"></i></div>');
    $('#' + chartTweetDivID).html('<div class="text-center pt-5 " ><i class="fa fa-circle-o-notch donutSpinner" aria-hidden="true"></i></div>');
    if (rangeType == 'day') {
        getSentiDistDataForHA(query, fromDate, toDate, null, rangeType, 0).then(data => {
            generateSentiDistBarChart(data, query, rangeType, chartDivID);
            generateSentimentSummary(data, summaryDivID, rangeType);
        })

        getTweetIDsForHA(query, fromDate, toDate, rangeType, null).then(response => {
            TweetsGenerator(response.data, 6, chartTweetDivID, fromDate, toDate, true, rangeType);
        });

    } else if (rangeType == 'hour') {
        getSentiDistDataForHA(query, fromDate, toDate, null, rangeType, 0).then(data => {
            generateSentiDistBarChart(data, query, rangeType, chartDivID);
            generateSentimentSummary(data, summaryDivID, rangeType);
        })
        getTweetIDsForHA(query, fromDate, toDate, rangeType, null).then(response => {
            TweetsGenerator(response.data, 6, chartTweetDivID, fromDate, toDate, true, rangeType);
        });

    } else {

        getSentiDistDataForHA(query, fromDate, toDate, null, rangeType, 1).then(data => {
            generateSentiDistLineChart(query, data, rangeType, chartDivID);
            generateSentimentSummary(data, summaryDivID, rangeType);
        })
        getTweetIDsForHA(query, fromDate, toDate, rangeType, null, 1).then(response => {
            let fromDateTemp = fromDate.split(/[ ,]+/).filter(Boolean);
            TweetsGenerator(response.data, 6, chartTweetDivID, fromDate, fromDate, true, rangeType);
        });
    }



}


const plotDistributionGraphHA = (query, fromDate, toDate, option, uniqueID, userID, div) => {
    //Loader...

    let chartDivID = option + '-chart';
    $('#' + div).html('<div class="d-flex" ><button class="btn btn-primary analyzeNetworkbtn mr-auto smat-rounded"> Analyze Network</button></div><div id="' + chartDivID + '"></div>');
    $('#' + chartDivID).html('<div class="text-center pt-5 " ><i class="fa fa-circle-o-notch donutSpinner" aria-hidden="true"></i></div>');
    getCooccurDataForHA(query, fromDate, toDate, option, uniqueID, userID).then(response => {
        generateBarChartForCooccur(query, response, chartDivID, option)
        console.log(response);
    });
}











//Summary Scripts
const freqSummaryGenerator = (data = null, div, rangeType) => {
    data = data['data'];
    $('#' + div).html('<div class="d-flex"> <span class="mx-2"><p class="m-0 smat-box-title-large font-weight-bold text-dark" id="freqTotalPublic-' + rangeType + '">0</p><p class="pull-text-top smat-dash-title m-0 ">Tweets Arrived</p></span></div><div class="d-flex "><span class="mx-2"><p class="m-0 smat-box-title-large font-weight-bold text-normal" id="publicNormalTotal-' + rangeType + '">0</p><p class="pull-text-top smat-dash-title m-0 ">Normal</p></span><span class="mx-2"><p class="m-0 smat-box-title-large font-weight-bold text-sec" id="publicSecTotal-' + rangeType + '">0</p><p class="pull-text-top smat-dash-title m-0">Security</p></span><span class="mx-2"><p class="m-0 smat-box-title-large font-weight-bold text-com" id="publicComTotal-' + rangeType + '">0</p><p class="pull-text-top smat-dash-title m-0">Communal</p></span><span class="mx-2"><p class="m-0 smat-box-title-large font-weight-bold text-com_sec" id="publiccom_secTotal-' + rangeType + '">0</p><p class="pull-text-top smat-dash-title m-0">Sec.& Com.</p></span></div>');

    let freqTotal = 0, totalNormal = 0, totalSec = 0, totalCom = 0, totalcom_sec = 0;
    data.forEach(element => {
        freqTotal += element[1];
        totalNormal += element[5];
        totalSec += element[3];
        totalCom += element[2];
        totalcom_sec += element[4];

    });

    $('#freqTotalPublic-' + rangeType).text(freqTotal);
    $('#publicNormalTotal-' + rangeType).text(totalNormal);
    $('#publicSecTotal-' + rangeType).text(totalSec);
    $('#publicComTotal-' + rangeType).text(totalCom);
    $('#publiccom_secTotal-' + rangeType).text(totalcom_sec);



}
const generateSentimentSummary = (data = null, div, range) => {
    let arrTemp = [];
    let posSumTemp = 0, negSumTemp = 0, neuSumTemp = 0;
    if (data['data'].length > 0) {
        data['data'].forEach(element => {
            posSumTemp += parseInt(element[1]);
            negSumTemp += parseInt(element[2]);
            neuSumTemp += parseInt(element[3]);
        });
    }
    $('#' + div).html('<div class="sentiSummaryDiv" id="sentiSummary' + range + '" ><div class="removeMarginMediaQuery"  > <div  id="sentiSummaryBar-' + range + '" ></div> </div><div> <div class="d-flex "><div><p class=" smat-box-title-large m-0 font-weight-bold text-dark ">' + posSumTemp + '</p><p class="pull-text-top m-0 smat-dash-title ">Positive</p></div><div class="mx-2"><p class=" smat-box-title-large m-0 font-weight-bold text-dark ">' + neuSumTemp + '</p><p class="pull-text-top m-0 smat-dash-title ">Neutral</p></div><div class="mx-2"><p class=" smat-box-title-large m-0 font-weight-bold text-dark ">' + negSumTemp + '</p><p class="pull-text-top m-0 smat-dash-title ">Negative</p></div></div></div></div>');

    arrTemp = [posSumTemp, negSumTemp, neuSumTemp];
    generateSentimentSummaryBar(arrTemp, "sentiSummaryBar-" + range, 'hour')
}
const generateSentimentSummaryBar = (sentiTotalArray, div, range_type) => {

    let total_pos = sentiTotalArray[0];
    let total_neg = sentiTotalArray[1];
    let total_neu = sentiTotalArray[2];

    $('#' + div).html('<div class="row  p-1"> <span style="display: inline-block;"><div class=" sentiment_bar_summary border sentiment_bar_pos" id="' + div + '_bar_' + range_type + '_pos" data-toggle="popover"  data-content="' + total_pos + ' Positive Tweets posted"></div> </span> <span style=" display: inline-block;"><div class="  sentiment_bar_summary border sentiment_bar_neu "  id="' + div + '_bar_' + range_type + '_neu" data-toggle="popover" data-content="' + total_neu + ' Neutral Tweets posted"></div>  </span> <span style=" display: inline-block;"><div class=" sentiment_value_neg sentiment_bar_summary border sentiment_bar_neg"  id="' + div + '_bar_' + range_type + '_neg"data-toggle="popover"  data-content="' + total_neg + ' Negative Tweets posted"></div></span></div ><div class="row"><span>  <a class="senti_summary_bar_text"  id="' + div + '_value_' + range_type + '_pos" >23%</a>  </span><span> <a  class="senti_summary_bar_text"  id="' + div + '_value_' + range_type + '_neu" >48%</a>   </span> <span><a class="senti_summary_bar_text"  id="' + div + '_value_' + range_type + '_neg" >29%</a></span>');

    var total = total_pos + total_neg + total_neu;


    var pos = Math.round((total_pos / total) * 100);
    var neg = Math.round((total_neg / total) * 100);
    var neu = Math.round((total_neu / total) * 100);


    $('#' + div + '_bar_' + range_type + '_pos').css('width', pos + 'px');
    $('#' + div + '_bar_' + range_type + '_neg').css('width', neg + 'px');
    $('#' + div + '_bar_' + range_type + '_neu').css('width', neu + 'px');

    $('#' + div + '_value_' + range_type + '_pos').css('margin-left', (pos / 4) + 'px');
    $('#' + div + '_value_' + range_type + '_neg').css('margin-left', (neg / 4) + 5 + 'px');
    $('#' + div + '_value_' + range_type + '_neu').css('margin-left', (neu / 4) + 5 + 'px');


    $('#' + div + '_value_' + range_type + '_pos').text(pos + '%');
    $('#' + div + '_value_' + range_type + '_neg').text(neg + '%');
    $('#' + div + '_value_' + range_type + '_neu').text(neu + '%');


}








