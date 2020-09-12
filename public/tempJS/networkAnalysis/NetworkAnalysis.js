//void main


import {roshan} from './visualizer.js';
import {render_graph,union,intersection,exportnetwork,selected_graph_ids,render_centrality_graph,
       sparkUpload,get_network,writedelete,difference,shortestpaths,community_detection,centrality,linkprediction,
       render_linkprediction_graph,render_shortestpath_graph,render_community_graph1,draw_graph,update_view_graph_for_link_prediction,
       render_graph_community,render_union_graph,render_graph_union,render_intersection_diff_graph,render_intersection_difference} from './helper.js';

let totalQueries;
let searchRecords = [];
var cardIDdictionary = {};
var community_algo_option = "Async Fluidic";
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
        let id = searchRecords[index - 1].id;
        let filename = "filecode-"+id;
        showing_results_for(cardData);
        render_graph(filename,"networkDivid");

        //updating network summary information
       $(".subject").empty();
       $(".subject").text(searchRecords[index - 1].query);
       $(".from_date").empty();
       $(".from_date").text(searchRecords[index - 1].from);
       $(".to_date").empty();
       $(".to_date").text(searchRecords[index - 1].to);
    })

})

$("#lpTabNA").on('click',function(){
    var select_graph = selected_graph_ids();
    console.log(selected_graph_ids());
    let input = select_graph[0];
    render_graph(input,"networkDivid");
});

$("#spTab").on('click',function(){
    var select_graph = selected_graph_ids();
    console.log(selected_graph_ids());
    let input = select_graph[0];
    render_graph(input,"networkDivid");
});

$("#commTab").on('click',function(){
    var select_graph = selected_graph_ids();
    console.log(selected_graph_ids());
    let input = select_graph[0];
    render_graph(input,"networkDivid");
});


$("#importNA").on('click',function(){
    $("#myModal_file_upload").modal('show');
});

$('#upload_form').on('submit', function(event) {
    event.preventDefault();
    var unique_id = "a1";
    var n = new FormData(this);

    n.append("name", unique_id);
    $.ajax({
            url: 'na/fileupload',
            method: "POST",
            data: n,
            dataType: 'JSON',
            contentType: false,
            cache: false,
            processData: false,
            beforeSend: function() {

            },
            success: function(data) {

            }
        })
        .fail(function(res) {
            console.log("error");
            console.log(res);
        })
        
    $('#myModal_file_upload').modal('toggle');           
});


const generateCards = (id, query, fromDateTemp, toDateTemp, noOfNodesTemp, naTypeTemp, naEngine, div) => {
    let tempArr = [];
    tempArr = { 'id': id, 'query': query, 'from': fromDateTemp, 'to': toDateTemp, 'nodesNo': noOfNodesTemp, 'naType': naTypeTemp, 'naEngine': naEngine };
    searchRecords.push(tempArr);
    let cardID = "filecode-"+id;
    cardIDdictionary[id] = cardID;
    $('#'+div).append('<div class="col-md-2" value="'+id+'"><div class="card shadow p-0"><div class="card-body p-0"><div class="d-flex px-3 pt-3"><span class="pull-left"><i id="deleteCard" class="fa fa-window-close text-neg" aria-hidden="true"></i></span><div class="naCardNum text-center ml-auto mr-auto">'+padNumber(id)+'</div><span class="pull-right ml-auto"><input class="form-check-input position-static" type="checkbox" id='+cardID+'></span></div><div class="text-left networkCardDetails px-3 pb-3" style="border-radius:10px;" value="'+id+'" ><p class="font-weight-bold m-0" style="font-size:16px;" cardquery="'+query+'"> '+query+'</p><p class="  smat-dash-title " style="margin-top:-2px;margin-bottom:0px;"> From: '+fromDateTemp+' </p><p class="   smat-dash-title " style="margin-top:-2px;margin-bottom:0px;" > To:'+toDateTemp+' </p><p class=" smat-dash-title " style="margin-top:-2px;margin-bottom:0px;"> Nodes: '+noOfNodesTemp+'</p><p class="  smat-dash-title " style="margin-top:-2px;margin-bottom:0px;" > Type: '+naTypeTemp+'</p><p class=" smat-dash-title " style="margin-top:-2px;margin-bottom:0px;"> Status: Ready</p></div></div></div></div>');
    // $('#' + div).append('<div class="col-sm-2" ><div class="card shadow networkCardDetails" value="' + id + '"><div class="card-body "><div class="d-flex"><div class="" ><p class="m-0 naCardNum"> ' + id + ' </p></div><div class="text-left ml-1 "><p class="font-weight-bold mb-1">' + query + ' </p> <p class=" mb-1 pull-text-top smat-dash-title"> <span> From:</span>' + fromDateTemp + '</p> <p class="mb-1 pull-text-top smat-dash-title"> <span> To:</span> ' + toDateTemp + '</p> <p class="mb-1 pull-text-top smat-dash-title">' + naTypeTemp + '</p><p class="mb-1 pull-text-top smat-dash-title">' + noOfNodesTemp + ' Nodes</p> <p class="m-0 pull-text-top smat-dash-title text-success ">Ready  </div></div></div></div></div>');
}

$("#naCards").on("click","#deleteCard" ,function(){
    $(this).parent().parent().parent().parent().parent().remove();
});

const generateCards_deletion = (id,query,div) => {
    let tempArr = [];
    tempArr = { 'id': id, 'query': query};
    searchRecords.push(tempArr);
    let cardID = "filecode-"+id;
    cardIDdictionary[id] = cardID;
    $('#'+div).append('<div class="col-md-2" value="'+id+'"><div class="card shadow p-0"><div class="card-body p-0"><div class="d-flex px-3 pt-3"><span class="pull-left"><i class="fa fa-window-close text-neg" aria-hidden="true"></i></span><div class="naCardNum text-center ml-auto mr-auto">'+padNumber(id)+'</div><span class="pull-right ml-auto"><input class="form-check-input position-static" type="checkbox" id='+cardID+'></span></div><div class="text-left networkCardDetails px-3 pb-3" style="border-radius:10px;" value="'+id+'" ><p class="font-weight-bold m-0" style="font-size:16px;" cardquery="'+query+'"> '+query+'</p></div></div></div></div>');
}

function padNumber(d) {
    return (d < 10) ? d.toString() : d.toString();
    //return (d < 10) ? '0' + d.toString() : d.toString();
}

const  showing_results_for = (cardData) => {
    let data = cardData;
    $('#naShowingResForTitle').text(data['query']);

}

$("#centrality_exec").on('click', function(NAType,algo_option=$('#centrality_algo_choice').val()){
NAType = $("#networkEngineNA").val();
algo_option =$("input[name='centralityInlineRadioOptions']:checked").val();
var select_graph = selected_graph_ids();
console.log(selected_graph_ids());
let input = select_graph[0];
console.log("Centrality Scanner");
console.log(NAType);
console.log(algo_option);
var url;
var data = {};


if (NAType == 'networkx') {
    console.log("Got in");
    url = 'na/centrality';
    data = {
        input: input,
        algo_option: algo_option
    };
} else if (NAType == 'spark') {
    var query_list = [algo_option, input];
    var unique_name_timestamp = (new Date().getTime()).toString(); // create unique_name   
    url = 'na/requestToSparkandStoreResult';
    data = {
        query_list: query_list,
        rname: unique_name_timestamp
    };
    sparkUpload(selected_graph_ids());
} else {
}
//centrality(url,data,NAType);
centrality(url,data,NAType).then(response => {
        if(NAType == "networkx"){
            render_centrality_graph(data["input"], "networkDivid").then(response =>{
                $('.analysis_summary_div').empty();
                $('.analysis_summary_div').append('<table> <tr><th>Node</th><th>Score</th></tr>');
                for(var i=0; i<response["nodes"].length;i++){
                    $('.analysis_summary_div').append('<tr><td>'+response["nodes"][i]["label"]+'</td><td>'+response["nodes"][i]["size"]+'</td></tr>');
                }
                $('.analysis_summary_div').append('</table>');
                draw_graph(response,"networkDivid");
            });
        }else if(NAType == "spark"){
            render_centrality_graph(data["query_list"][1], "networkDivid").then(response =>{
                $('.analysis_summary_div').empty();
                $('.analysis_summary_div').append('<table> <tr><th>Node</th><th>Score</th></tr>');
                for(var i=0; i<response["nodes"].length;i++){
                    $('.analysis_summary_div').append('<tr><td>'+response["nodes"][i]["label"]+'</td><td>'+response["nodes"][i]["size"]+'</td></tr>');
                }
                $('.analysis_summary_div').append('</table>');
                draw_graph(response,"networkDivid");
            });
        }
});
});

$("#link_prediction_exec").on('click',function(NAType=$("#networkEngineNA").val(),algo_option=""){
    var NAType=$("#networkEngineNA").val();
    algo_option =$("input[name='linkpredictionRadioOptions']:checked").val();
    var select_graph = selected_graph_ids();
    console.log(selected_graph_ids());
    let input = select_graph[0];
    console.log("Centrality Scanner");
    console.log(NAType);
    console.log(algo_option);
    var url;
    var data = {};

    if (NAType == 'networkx') {
        console.log("Got in");
        url = 'na/link_prediction';
        data = {
            input: input,
            src:$("#link_source_node").val(),
            k_value:$("#nos_links_to_be_predicted").val(),
            algo_option: algo_option
        };
        console.log(algo_option);
    } else if (NAType == 'spark') {
        let src = $("#link_source_node").val();
        var query_list = [algo_option, input, src ];
        var unique_name_timestamp = (new Date().getTime()).toString(); // create unique_name   
        url = 'na/requestToSparkandStoreResult';
        data = {
            query_list: query_list,
            rname: unique_name_timestamp
        };
        sparkUpload(selected_graph_ids());
    } else {
    }    
    linkprediction(url,data,NAType).then(response =>{
        if(NAType == "networkx"){
            render_linkprediction_graph(data["input"],data["src"]).then(response =>{       
                $('.analysis_summary_div').empty();
                $('.analysis_summary_div').append('<table> <tr><th>Node</th><th>Score</th></tr>');
                 for(var i=0; i<response.length;i++){
                    if(data["src"] == response[i].id){
                        continue;
                 }
                 $('.analysis_summary_div').append('<tr><td>'+data["src"]+'</td><td>'+response[i].id+'</td></tr>');
             }
             $('.analysis_summary_div').append('</table>');
             update_view_graph_for_link_prediction(response,data["src"]);
            });
        }else if(NAType == "spark"){
            render_linkprediction_graph(data["query_list"][1],data["query_list"][2]).then(response =>{
                alert();
            })
        }
    })
});

$("#sp_exec").on('click',function(NAType="networkx",algo_option=""){
    NAType = $("#networkEngineNA").val();
    var src = $("#sourceSp").val();
    var dst = $("#destSp").val();
    var algo_option = $("#spoption").val(); 
    var select_graph = selected_graph_ids();
    console.log(selected_graph_ids());
    var input = select_graph[0];

    var url;
    var data = {};


    if (NAType == 'networkx') {
        url = 'na/shortestpath';
        data = {
            input: input,
            src: src,
            dst: dst,
            algo_option: algo_option
        };


    } else if (NAType == 'spark') {
        var query_list = ['shortestpath', input, src, dst];
        var unique_name_timestamp = (new Date().getTime()).toString(); // create unique_name   
        url = 'na/requestToSparkandStoreResult';
        data = {
            query_list: query_list,
            rname: unique_name_timestamp
        };
        sparkUpload(selected_graph_ids());
    } else {
    }
    shortestpaths(url,data,NAType).then(response =>{
        if(NAType == "networkx"){
            render_shortestpath_graph(data["input"], data["src"], data["dst"]);
        }else if(NAType == "spark"){
            render_shortestpath_graph(data["query_list"][1], data["query_list"][2], data["query_list"][3]);
        }
    });
});

// Setting community detection algo option
$("#async").on("click",function(){
    community_algo_option = $("#async").text();
});

$("#lpa").on("click",function(){
    community_algo_option = $("#lpa").text();
});

$("#grivan").on("click",function(){
    community_algo_option = $("#grivan").text();
});

$("#comm_exec").on('click',function(NAType=$("#NAEngine").val(),algo_option=""){
    NAType = $("#networkEngineNA").val();
    if(community_algo_option == "Async Fluidic"){
        algo_option = "async";
    }else if (community_algo_option == "Label Propagation"){
        algo_option = "lpa";
    }else if(community_algo_option == "Grivan Newman"){
        algo_option = "grivan";
    }
    console.log(algo_option);
    var select_graph = selected_graph_ids();
    console.log(selected_graph_ids());
    var input = select_graph[0];
    var k_value = $("#noOfCommunities").val();
    var url;
    var data = {};

    if (NAType == 'networkx') {
        url = 'na/communitydetection';
        data = {
            input: input,
            k: k_value,
            iterations: 1000,
            algo_option: algo_option
        };
    } else if (NAType == 'spark') {

        var query_list = ['lpa'];
        query_list.push(input);

        // for (i = 0; i < input_array.length; i++) {
        //     query_list.push(input_array[i]);
        // }

        var unique_name_timestamp = (new Date().getTime()).toString(); // create unique_name   
        url = 'na/requestToSparkandStoreResult';
        data = {
            query_list: query_list,
            rname: unique_name_timestamp
        };
        sparkUpload(selected_graph_ids());
    } else {
    }
    community_detection(url,data,NAType).then(response => {
        if(NAType == "networkx"){
            render_community_graph1(data["input"]).then(response =>{
                render_graph_community(response,"networkDivid");
            });
        }else if(NAType == "spark"){
            render_community_graph1(data["query_list"][1]).then(response =>{
                render_graph_community(response,"networkDivid");
            });
        }
    })
});

$("#union_exec").on('click',function(NAType="networkx"){
    NAType = $("#networkEngineNA").val();
    var url;
    var data = {};
    var input_arr = selected_graph_ids();
    if (NAType == 'networkx') {
        url = 'na/union';
        data = {
            input: input_arr
        };
    } else if (NAType == 'spark') {
        var query_list = ['union'];

        for (var i = 0; i < input_arr.length; i++) {
            query_list.push(input_arr[i]);
        }

        var unique_name_timestamp = (new Date().getTime()).toString(); // create unique_name   
        url = 'na/requestToSparkandStoreResult';
        data = {
            query_list: query_list,
            rname: unique_name_timestamp
        };
        sparkUpload(selected_graph_ids());
    } else {
        console.log("OO");
    }
    union(url,data,NAType).then(response =>{
        if(NAType == "networkx"){
            render_union_graph(data["input"]).then(response =>{
                render_graph_union(response);
            });
        }else if(NAType == "spark"){
            var arr1 = data["query_list"];
            var arr12 = arr1.reverse();
            arr12.pop();
            var finalArray = arr12.reverse();
            render_union_graph(finalArray).then(response =>{
                render_graph_union(response);
            });
        }
    });
});


$("#intersection_exec").on('click',function(NAType="networkx"){
    NAType = $("#networkEngineNA").val();
    var url;
    var data = {};
    var input_arr = selected_graph_ids();
    if (NAType == 'networkx') {
        url = 'na/intersection';
        data = {
            input: input_arr
        };
    } else if (NAType == 'spark') {
        var query_list = ['intersection'];

        for (var i = 0; i < input_arr.length; i++) {
            query_list.push(input_arr[i]);
        }

        var unique_name_timestamp = (new Date().getTime()).toString(); // create unique_name   
        url = 'na/requestToSparkandStoreResult';
        data = {
            query_list: query_list,
            rname: unique_name_timestamp
        };
        sparkUpload(selected_graph_ids());
    } else {
    }
    intersection(url,data,NAType).then(response => {
        if(NAType == "networkx"){
            render_intersection_diff_graph(data["input"],"intersection").then(response =>{
                render_intersection_difference(response,"intersection_displayer","intersection");
            });
        }else if(NAType == "spark"){
            var arr1 = data["query_list"];
            var arr12 = arr1.reverse();
            arr12.pop();
            var finalArray = arr12.reverse();
            render_intersection_diff_graph(finalArray,"intersection").then(response =>{
            render_intersection_difference(response,"intersection_displayer","intersection");
            });
        }
    });
});

$("#expansionTabNA").on('click',function(NAType="networkx"){
    alert();
    var select_graph = selected_graph_ids();
    console.log(selected_graph_ids());
    let input = select_graph[0];
    render_graph(input,"expansion_displayer");
});

$("expansion_exec").on('click',function(NAType="networkx"){
    var node_to_be_expanded = $("#node_to_be_expanded").val();
    var hops = $("#hops").val();
    expansion(node_to_be_expanded,hops);
});

$("#export").on('click',function(NAType="networkx"){
    exportnetwork();
});

$("#difference_exec").on('click',function(NAType="networkx"){
    var  NAType = $("#networkEngineNA").val();
    var url;
    var data = {};
    var input_arr = [];
    let sequence = $("#difference_sequence").val().split('-');
    for(let i=0;i<sequence.length;i++){
        input_arr.push(cardIDdictionary[sequence[i]]);
    }

    if (NAType == 'networkx') {
        url = 'na/difference';
        data = {
            input: input_arr,
        };
    } else if (NAType == 'spark') {
        var query_list = ['difference'];

        for (let i = 0; i < input_arr.length; i++) {
            query_list.push(input_arr[i]);
        }

        var unique_name_timestamp = (new Date().getTime()).toString(); // create unique_name   
        url = 'na/requestToSparkandStoreResult';
        data = {
            query_list: query_list,
            rname: unique_name_timestamp
        };
        sparkUpload(selected_graph_ids());
    } else {
        console.log("OO");
    }
    difference(url,data,NAType).then(response =>{
        if(NAType == "networkx"){
            render_intersection_diff_graph(data["input"],"difference").then(response =>{
                render_intersection_difference(response,"difference_displayer","difference");
            });
        }else if(NAType == "spark"){
            var arr1 = data["query_list"];
            var arr12 = arr1.reverse();
            arr12.pop();
            var finalArray = arr12.reverse();
            render_intersection_diff_graph(finalArray,"difference").then(response =>{
            render_intersection_difference(response,"difference_displayer","difference");
            });
        }
    });
});




$("#usenetwork").on('click',function(){
    var generator = new IDGenerator();
    var unique_id = generator.generate();
    writedelete(unique_id)
    generateCards_deletion(totalQueries+1,"deletion","naCards");

});

function IDGenerator() {
    this.length = 8;
    this.timestamp = +new Date;
    var _getRandomInt = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    this.generate = function() {
        var ts = this.timestamp.toString();
        var parts = ts.split("").reverse();
        var id = "";
        for (var i = 0; i < this.length; ++i) {
            var index = _getRandomInt(0, parts.length - 1);
            id += parts[index];
        }
        return id;
    }
}

