//void main


import {roshan} from './visualizer.js';
import {render_graph} from './helper.js';

let totalQueries;
let searchRecords = [];
$(document).ready(function () {
    $('.nav-item ').removeClass('smat-nav-active');
    $('#nav-NA').addClass('smat-nav-active');
    totalQueries = 0;
    roshan(6,5);
    $('#naInputInputs').on('submit', function (e) {
        e.preventDefault();
        totalQueries += 1;
        let queryTemp = $('#queryNA').val().trim();
        let fromDateTemp = $('#fromDateNA').val();
        let toDateTemp = $('#toDateNA').val();
        let noOfNodesTemp = $('#nodesNA').val().trim();
        let naTypeTemp = $('#typeNA').val();
        let naEngine = $('#networkEngineNA').val();
        console.log('Submitted');
        generateCards(totalQueries, queryTemp, fromDateTemp, toDateTemp, noOfNodesTemp, naTypeTemp, naEngine, 'naCards');
    });

    $('body').on('click', 'div .networkCardDetails', function () {
        console.log(searchRecords);
        let index = $(this).attr('value');
        let cardData = searchRecords[index - 1];
        showing_results_for(cardData);
        console.log("Hello");
        render_graph("data","networkDiv");
    })

})


const generateCards = (id, query, fromDateTemp, toDateTemp, noOfNodesTemp, naTypeTemp, naEngine, div) => {
    let tempArr = [];
    tempArr = { 'id': id, 'query': query, 'from': fromDateTemp, 'to': toDateTemp, 'nodesNo': noOfNodesTemp, 'naType': naTypeTemp, 'naEngine': naEngine };
    searchRecords.push(tempArr);
    $('#'+div).append('<div class="col-md-2" value="'+id+'"><div class="card shadow p-0"><div class="card-body p-0"><div class="d-flex px-3 pt-3"><span class="pull-left"><i class="fa fa-window-close text-neg" aria-hidden="true"></i></span><div class="naCardNum text-center ml-auto mr-auto">'+padNumber(id)+'</div><span class="pull-right ml-auto"><input class="form-check-input position-static" type="checkbox" id="checkBoxId-'+id+'"></span></div><div class="text-left networkCardDetails px-3 pb-3" style="border-radius:10px;" value="'+id+'" ><p class="font-weight-bold m-0" style="font-size:16px;"> '+query+'</p><p class="  smat-dash-title " style="margin-top:-2px;margin-bottom:0px;"> From: '+fromDateTemp+' </p><p class="   smat-dash-title " style="margin-top:-2px;margin-bottom:0px;" > To:'+toDateTemp+' </p><p class=" smat-dash-title " style="margin-top:-2px;margin-bottom:0px;"> Nodes: '+noOfNodesTemp+'</p><p class="  smat-dash-title " style="margin-top:-2px;margin-bottom:0px;" > Type: '+naTypeTemp+'</p><p class=" smat-dash-title " style="margin-top:-2px;margin-bottom:0px;"> Status: Ready</p></div></div></div></div>');
    // $('#' + div).append('<div class="col-sm-2" ><div class="card shadow networkCardDetails" value="' + id + '"><div class="card-body "><div class="d-flex"><div class="" ><p class="m-0 naCardNum"> ' + id + ' </p></div><div class="text-left ml-1 "><p class="font-weight-bold mb-1">' + query + ' </p> <p class=" mb-1 pull-text-top smat-dash-title"> <span> From:</span>' + fromDateTemp + '</p> <p class="mb-1 pull-text-top smat-dash-title"> <span> To:</span> ' + toDateTemp + '</p> <p class="mb-1 pull-text-top smat-dash-title">' + naTypeTemp + '</p><p class="mb-1 pull-text-top smat-dash-title">' + noOfNodesTemp + ' Nodes</p> <p class="m-0 pull-text-top smat-dash-title text-success ">Ready  </div></div></div></div></div>');
}

function padNumber(d) {
    return (d < 10) ? '0' + d.toString() : d.toString();
}

const  showing_results_for = (cardData) => {
    let data = cardData;
    $('#naShowingResForTitle').text(data['query']);

}

const view_graph = () => {

}