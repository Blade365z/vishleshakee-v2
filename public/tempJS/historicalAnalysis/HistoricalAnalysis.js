//imports 

import { generateFreqDistChart, generateSentimentChart, generateBarChart } from './chartHelper.js';


let mainInputCounter = 0;
let statusTableFlag = 0;
let searchType = 0;
let searchRecords = [];
//0:Normal, 1:AdvancedSearch


$(document).ready(function () {

    generateFreqDistChart(null, 'freqContentHA');
    freqSummaryGenerator(null, null);

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
        console.log('REMOVE');
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
        console.log('Counter Set to : ', mainInputCounter);


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



        // console.log(q);
        executeQuery(q, fromDate, toDate);

        // resetQueryPanel(mainInputCounter);
        // mainInputCounter = 0;
        // searchType = 0;


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
        generateFreqDistChart(null, 'freqContentHA');
        freqSummaryGenerator(null, null);
    });
    $('#sentiTabHA').on('click', function () {
        generateSentimentChart(null, 'sentiContentHA');
        generateSentimentSummary(null, 'summaryContent-1', 'hour');
    });

    $('#mentionsTabHA').on('click', function () {
        generateBarChart(null, 'mentionsContentHA');
        generateBarChartSummary(null, 'summaryContent-1', 'hour');
    });
    $('#tweetsTabHA').on('click', function () {
        $('#summaryContent-1').html('');
        generateTweets('tweetsContentHA');

    });









});
$('body').on('click', '.showBtn', function () {
    $('#analysisPanelHA').css('display', 'block');
});
const executeQuery = (query, fromDate, toDate) => {
    let currentTimestamp = new Date().getTime();
    query = decodeQuery(query);
    $('#tableInitialTitle').remove();
    $('#haStatusTable').append('<tr><th scope="row">' + currentTimestamp + '</th><td>' + query + '</td><td>' + fromDate + '</td><td>' + toDate + '</td><td>Ready</td><td><button class="btn btn-primary smat-rounded mx-1 showBtn"> Show </button><button class="btn btn-neg mx-1  smat-rounded"> Delete </button></td></tr>');
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

export const generateTweets = (div) => {
    $('#' + div).html("");
    for (let i = 0; i < 7; i++) {
        $('#' + div).append('<div class="border p-2 "><div class="d-flex"><div class="profilePictureDiv p-1 text-center"><img src="public/img/amitabh.jpg" style="height:33px;border-radius:50%" /></div><div> <p class="pt-1 m-0 font-weight-bold"> Amitabh Baruah </p><p class="smat-dash-title pull-text-top m-0 "> @amitabh.baruah12 </p></div> <div class="px-1 pt-1" >  <i class="fa fa-circle text-sec" aria-hidden="true"></i>   <i class="fa fa-circle text-neg" aria-hidden="true"></i> </div></div><div style="width:80%;"><p class="smat-tweet-body-text mb-1">It is so sad indeed what happened recently at #GalwanValley . My sincere condolences to the bereaved families. It is time to teach china a lesson . #IndianArmy #JaiHind #ShameOnChina </p></div><div class="d-flex"><p class="m-0 smat-tweet-body-text font-weight-bold"> <span>  2020-03-12  &nbsp </span> <span> Guwahati, India</span> &nbsp  <span class="text-normal clickable"> Track Tweet</span>   </p> </div></div>');
    }

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

const queryEncoder = (arX, opX) => {
    console.log(arX);
    console.log(opX);
    // let finalString = arX[0];
    // let Flag = 0;
    // for (let i = 0; i < arX.length; i++) {
    //     if (i != 0) {
    //         // if (opX[i - 1] == '&') {
    //             finalString = '(' + finalString + opX[i - 1] + arX[i] + ')';
    //         // }
    //     }
    // }
    // console.log(finalString);
}


const freqSummaryGenerator = (data = null, div = null) => {
    $('#summaryContent-1').html('<div class="d-flex px-4"><div><p class=" smat-box-title-large m-0 font-weight-bold text-dark ">23312</p><p class="pull-text-top m-0 smat-dash-title ">Tweets Arrived</p></div><div class="mx-2"><p class=" smat-box-title-large m-0 font-weight-bold text-dark ">4430</p><p class="pull-text-top m-0 smat-dash-title ">on 23 May 2020</p></div></div>')

}

const generateSentimentSummary = (data = null, div, range) => {
    $('#' + div).html('<div class="sentiSummaryDiv" id="sentiSummary' + range + '" ><div class="removeMarginMediaQuery"  > <div  id="sentiSummaryBar-' + range + '" ></div> </div><div> <div class="d-flex "><div><p class=" smat-box-title-large m-0 font-weight-bold text-dark ">23312</p><p class="pull-text-top m-0 smat-dash-title ">Positive</p></div><div class="mx-2"><p class=" smat-box-title-large m-0 font-weight-bold text-dark ">4430</p><p class="pull-text-top m-0 smat-dash-title ">Negative</p></div><div class="mx-2"><p class=" smat-box-title-large m-0 font-weight-bold text-dark ">4430</p><p class="pull-text-top m-0 smat-dash-title ">Neutral</p></div></div></div></div>');
    let dummyData = [2330, 1223, 999];
    generateSentimentSummaryBar(dummyData, "sentiSummaryBar-" + range, 'hour')
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


const generateBarChartSummary = (data = null, div, range) => {
    $('#' + div).html('<div class="d-flex"><div> </div><div class="removeMarginMediaQuery" ><button class="btn smat-btn smat-rounded"><span>Analyze Network</span></button></div><div><p class=" smat-box-title-large m-0 font-weight-bold text-dark ">43430</p><p class="pull-text-top m-0 smat-dash-title ">Total Entities</p> </div></div>');

}
