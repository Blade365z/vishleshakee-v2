//void main
import { roshan } from './visualizer.js';
import {
    render_graph, union, intersection, exportnetwork, selected_graph_ids, render_centrality_graph,
    sparkUpload, get_network, writedelete, difference, shortestpaths, community_detection, centrality, linkprediction,
    render_linkprediction_graph, render_shortestpath_graph, render_community_graph1, draw_graph, update_view_graph_for_link_prediction,
    render_graph_community, render_union_graph, render_graph_union, render_intersection_diff_graph, render_intersection_difference,
    networkGeneration, storeResultofSparkFromController,getDeletedNodes,node_highlighting,selected_graph_query
} from './helper.js';
import { makeSuggestionsReady } from '../utilitiesJS/smatExtras.js'
import { formulateUserSearch } from '../utilitiesJS/userSearch.js';



let totalQueries;
let searchRecords = [];
var cardIDdictionary = {};
var queryDictionaryFilename = {};
var currentNetworkEngine = 'networkx', currentlyShowing;
var community_algo_option = "Async Fluidic";

var SourceNode;
var DestinationNode;

var currentviewingnetwork;
var currentOperation;
//globals for sparkStatus 
var checkSpartStatusInterval_centrality;
var userID;
if (localStorage.getItem('smat.me')) {
    let userInfoTemp = JSON.parse(localStorage.getItem('smat.me'));
    userID = userInfoTemp['id'];
} else {
    window.location.href = 'login';
}
jQuery(function () {
    // networkGeneration('na/genNetwork', queryTemp, fromDateTemp, toDateTemp, noOfNodesTemp, naTypeTemp, filename).then(response => {
    //     generateCards(totalQueries, queryTemp, fromDateStripped, toDateStripped, noOfNodesTemp, naTypeTemp, naEngine, filename, 'naCards',"normal");
    //     $("#msg_displayer").empty();
    // })

    if(incoming){
        console.log("Incoming");
        console.log(incoming);
        console.log("fromDate");
        console.log(fromDateReceived);
        console.log("toDate");
        console.log(toDateReceived);
        console.log("CRR NET ENGINE");
        console.log(currentNetworkEngine);
        console.log("Unique ID");
        //TODO::Redirection 
        let filename = incoming + fromDateReceived + toDateReceived + 50 + 'Hashtag-Hashtag';
        networkGeneration('na/genNetwork', incoming, fromDateReceived, toDateReceived, 50 , 'Hashtag-Hashtag', filename).then(response => {
            // generateCards(totalQueries, queryTemp, fromDateStripped, toDateStripped, noOfNodesTemp, naTypeTemp, naEngine, filename, 'naCards',"normal");

            generateCards(totalQueries+2, incoming, fromDateReceived, toDateReceived, 50, 'Hashtag-Hashtag', currentNetworkEngine, filename, 'naCards',"normal");
            
        })
    }
    makeSuggestionsReady ('naQueryInputBox',50);
    $('#networkEngineNA').on('change', function () {
        console.log('changed');
        let selected = $("#networkEngineNA").val();
        if (selected == "networkx") {
            currentNetworkEngine = selected;
            $("#resourceallocation").hide();
            $("#commonneighbors").hide();
            $("#async").show();
            $("#grivan").show();
            $("#btwncen").show();
            $("#evcen").show();

        } else if (selected == "spark") {
            currentNetworkEngine = selected;
            $("#resourceallocation").show();
            $("#commonneighbors").show();
            $("#async").hide();
            $("#grivan").hide();
            $("#btwncen").hide();
            $("#evcen").hide();
        }

    });


    $("#binaryopsnetworkselector").hide();

    $('body').on('click', 'div .showBtn', function () {
        let args = $(this).attr('value');
        args = args.split(/[|]/).filter(Boolean);
        console.log("I am printing your ARGS");
        console.log(args);

        if(args[4] == "ShortestPath"){
            render_shortestpath_graph(args[6],args[7],args[8]);
        }else if(args[4] == "communities"){
            render_community_graph1(args[6]).then(response => {
                render_graph_community(response,"networkDivid");
            });
        }else if(args[4] == "union"){
            console.log(args[6]);
            let files = args[6].split("__");
            render_union_graph(files).then(response => {
                render_graph_union(response);
            });
        }else if(args[4] == "intersection"){
            console.log(args[6]);
            let files = args[6].split("__");
            console.log(files);
            render_intersection_diff_graph(files, "intersection").then(response => {
                render_intersection_difference(response, "intersection_displayer", "intersection");
            });
        }else if(args[4] == "difference"){
            console.log(args[6]);
            let files = args[6].split("__");
            console.log(files);
            //let finalArray = files.reverse();
            render_intersection_diff_graph(files, "difference").then(response => {
                render_intersection_difference(response, "difference_displayer", "difference");
            });
        }else if(args[4] == "linkprediction"){
            render_linkprediction_graph(args[6],args[7]).then(response => {
                update_view_graph_for_link_prediction(response,args[7]);
            })
        }else{
            render_centrality_graph(args[6], args[2], args[5]).then(response => {
                console.log('RESPONSE', response);
                $('.analysis_summary_div').html('');
                $('.analysis_summary_div').append('<table class="table">  <thead> <tr><th>Node</th><th>Score</th></tr>  </thead> <tbody id="tableBody"> </tbody></table>');
                for (var i = 0; i < response["nodes"].length; i++) {
                    $('#tableBody').append('<tr><td>' + response["nodes"][i]["label"] + '</td><td>' + response["nodes"][i]["size"] + '</td></tr>');
                }
                draw_graph(response, "networkDivid");
            });
        }
    });


    /*
    TEMP AMITABH 


    */
    $('.nav-item ').removeClass('smat-nav-active');
    $('#nav-NA').addClass('smat-nav-active');
    totalQueries = 0;
    roshan(6, 5);
    $('#naInputInputs').on('submit', function (e) {
        e.preventDefault();
        totalQueries += 1;
        let queryTemp = $('#queryNA').val().trim();
        if(queryTemp.includes('#')||queryTemp.includes('@')){
            let fromDateTemp = $('#fromDateNA').val();
            let fromDateStripped = fromDateTemp;
            fromDateTemp = fromDateTemp + " 00:00:00";
            let toDateTemp = $('#toDateNA').val();
            let toDateStripped = toDateTemp;
            toDateTemp = toDateTemp + " 00:00:00";
            let noOfNodesTemp = $('#nodesNA').val().trim();
            // noOfNodesTemp = noOfNodesTemp - 1;
            let naTypeTemp = $('#typeNA').val();
            let netCategory = $("#net_category").val();
            let naEngine = $('#networkEngineNA').val();
            let filename = queryTemp + fromDateStripped + toDateStripped + noOfNodesTemp + naTypeTemp;
            console.log(queryTemp, naEngine);
            console.log('Submitted');
            networkGeneration('na/genNetwork', queryTemp, fromDateTemp, toDateTemp, noOfNodesTemp, naTypeTemp, filename).then(response => {
                generateCards(totalQueries, queryTemp, fromDateStripped, toDateStripped, noOfNodesTemp, naTypeTemp, naEngine, filename, 'naCards',"normal");
                $("#messagebox").empty();
                $("#messagebox").append('<div class="card text-black m-2" style="background: #BFFAC0" id="infopanel"><i id="deleteinfoCard" class="fa fa-window-close text-neg" aria-hidden="true"></i><div class="d-flex justify-content-center font-weight-bold card-body"> Network Generated Successfully </div></div>');
            })
        }else{
            formulateUserSearch(queryTemp, 'userContainerList');
        }
        // $("#messagebox").append('');
    });

    $('body').on('click', 'div .networkCardDetails', function () {
        console.log(searchRecords);
        let index = $(this).attr('value');
        currentviewingnetwork = index;
        let cardData = searchRecords[index - 1];
        let id = searchRecords[index - 1].id;
        currentlyShowing = id;
        let filename = cardIDdictionary[id];
        console.log("FILE");
        console.log(filename);
        showing_results_for(cardData);
        render_graph('na/graph_view_data_formator', filename).then(response => {
            draw_graph(response, "networkDivid");
        });

        //updating network summary information
        $(".subject").empty();
        $(".subject").text(searchRecords[index - 1].query);
        $(".from_date").empty();
        $(".from_date").text(searchRecords[index - 1].from);
        $(".to_date").empty();
        $(".to_date").text(searchRecords[index - 1].to);
    })

    $(".analysis_summary_div").on('click', ".click_events", function() {
        var input = $(this).text();
        node_highlighting(input);
    });
})

$("#unionTabNA").on('click', function(){
    currentOperation = "union";
    $("#binaryopsnetworkselector").show();
});

$("#interSecTabNA").on('click',function(){
    $("#binaryopsnetworkselector").show();
});

$("#diffTabNA").on('click',function(){
    $("#binaryopsnetworkselector").show();
});

$("#netTabNA").on('click',function(){
    $("#binaryopsnetworkselector").hide();
});

$("#lpTabNA").on('click', function () {
    var select_graph = selected_graph_ids();
    console.log(selected_graph_ids());
    let input = select_graph[0];
    render_graph('na/graph_view_data_formator', input).then(response => {
        draw_graph(response, "networkDivid");
    });
});

$("#centralityTab").on('click', function () {
    var select_graph = selected_graph_ids();
    console.log(selected_graph_ids());
    let input = select_graph[0];
    render_graph('na/graph_view_data_formator', input).then(response => {
        draw_graph(response, "networkDivid");
    });
});

$("#spTab").on('click', function () {
    var select_graph = selected_graph_ids();
    console.log(selected_graph_ids());
    let input = select_graph[0];
    render_graph('na/graph_view_data_formator', input).then(response => {
        draw_graph(response, "networkDivid");
    });
});

$("#commTab").on('click', function () {
    var select_graph = selected_graph_ids();
    console.log(selected_graph_ids());
    let input = select_graph[0];
    render_graph('na/graph_view_data_formator', input).then(response => {
        draw_graph(response, "networkDivid");
    });
});


$("#importNA").on('click', function () {
    $("#myModal_file_upload").modal('show');
});


$('#upload_form').on('submit', function (event) {
    event.preventDefault();
    var unique_id = "a11";
    var n = new FormData(this);
    n.append("name", unique_id);

    let userInfoTemp = JSON.parse(localStorage.getItem('smat.me'));
    let dir_name = userInfoTemp['id'];

    n.append("dir_name",dir_name);
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
            console.log("All Okay to go");
            totalQueries = totalQueries + 1;
            generateCards(totalQueries, $("#cardnamefileupload").val(), "fromDateStripped", "toDateStripped", "noOfNodesTemp", "naTypeTemp", "naEngine", unique_id, 'naCards',"fileupload");
        }
    })
    .fail(function(res) {
        console.log(res);
    })
    $('#myModal_file_upload').modal('toggle');
});


const generateCards = (id, query, fromDateTemp, toDateTemp, noOfNodesTemp, naTypeTemp, naEngine, filename, div,status) => {
    let tempArr = [];
    tempArr = { 'id': id, 'query': query, 'from': fromDateTemp, 'to': toDateTemp, 'nodesNo': noOfNodesTemp, 'naType': naTypeTemp, 'filename': filename, 'naEngine': naEngine };
    searchRecords.push(tempArr);
    cardIDdictionary[id] = filename;
    queryDictionaryFilename[filename] = query;
    console.log("Checker", queryDictionaryFilename);
    console.log(cardIDdictionary, filename);
    if(status == "normal"){
        $('#' + div).append('<div class="col-md-2" value="' + id + '"><div class="card shadow p-0"><div class="card-body p-0"><div class="d-flex px-3 pt-3"><span class="pull-left"><i id="deleteCard" class="fa fa-window-close text-neg" aria-hidden="true"></i></span><div class="naCardNum text-center ml-auto mr-auto">' + padNumber(id) + '</div><span class="pull-right ml-auto"><input class="form-check-input position-static" type="checkbox" id=' + filename + '></span></div><div class="text-left networkCardDetails px-3 pb-3" style="border-radius:10px;" value="' + id + '" ><p class="font-weight-bold m-0" style="font-size:16px;" cardquery="' + query + '"> ' + query + '</p><p class="  smat-dash-title " style="margin-top:-2px;margin-bottom:0px;"> From: ' + fromDateTemp + ' </p><p class="   smat-dash-title " style="margin-top:-2px;margin-bottom:0px;" > To:' + toDateTemp + ' </p><p class=" smat-dash-title " style="margin-top:-2px;margin-bottom:0px;"> Nodes: ' + noOfNodesTemp + '</p><p class="  smat-dash-title " style="margin-top:-2px;margin-bottom:0px;" > Type: ' + naTypeTemp + '</p><p class=" smat-dash-title " style="margin-top:-2px;margin-bottom:0px;"> Status: Ready</p></div></div></div></div>');
    }else if(status == "afterdeletion"){
        $('#' + div).append('<div class="col-md-2" value="' + id + '"><div class="card shadow p-0"><div class="card-body p-0"><div class="d-flex px-3 pt-3"><span class="pull-left"><i id="deleteCard" class="fa fa-window-close text-neg" aria-hidden="true"></i></span><div class="naCardNum text-center ml-auto mr-auto">' + padNumber(id) + '</div><span class="pull-right ml-auto"><input class="form-check-input position-static" type="checkbox" id=' + filename + '></span></div><div class="text-left networkCardDetails px-3 pb-3" style="border-radius:10px;" value="' + id + '" ><p class="font-weight-bold m-0" style="font-size:16px;" cardquery="' + query + '"> ' + query + '</p></div>');
    }else if(status == "fileupload"){
        $('#' + div).append('<div class="col-md-2" value="' + id + '"><div class="card shadow p-0"><div class="card-body p-0"><div class="d-flex px-3 pt-3"><span class="pull-left"><i id="deleteCard" class="fa fa-window-close text-neg" aria-hidden="true"></i></span><div class="naCardNum text-center ml-auto mr-auto">' + padNumber(id) + '</div><span class="pull-right ml-auto"><input class="form-check-input position-static" type="checkbox" id=' + filename + '></span></div><div class="text-left networkCardDetails px-3 pb-3" style="border-radius:10px;" value="' + id + '" ><p class="font-weight-bold m-0" style="font-size:16px;" cardquery="' + query + '"> ' + query + '</p></div>');
    }
}

$("#naCards").on("click", "#deleteCard", function () {
    $(this).parent().parent().parent().parent().parent().remove();
});

$("#messagebox").on("click","#infopanel #deleteinfoCard", function () {
    $(this).parent().remove();
});

function padNumber(d) {
    return (d < 10) ? d.toString() : d.toString();
    //return (d < 10) ? '0' + d.toString() : d.toString();
}

const showing_results_for = (cardData) => {
    let data = cardData;
    $('#naShowingResForTitle').text(data['query']);

}

$("#centrality_exec").on('click', function (NAType, algo_option = $('#centrality_algo_choice').val()) {

    if(selected_graph_ids().length > 1){
        $("#messagebox").empty();
        $("#messagebox").append('<div class="card text-black m-2" style="background: white" id="infopanel"><i id="deleteinfoCard" class="fa fa-window-close text-neg" aria-hidden="true"></i><div class="d-flex justify-content-center text-black font-weight-bold card-body"> Please, Select a Single Network </div></div>');
        return;
    }else if(selected_graph_ids().length == 0){
        $("#messagebox").empty();
        $("#messagebox").append('<div class="card text-black m-2" style="background: white" id="infopanel"><i id="deleteinfoCard" class="fa fa-window-close text-neg" aria-hidden="true"></i><div class="d-flex justify-content-center text-black font-weight-bold card-body"> Please, Select a Network </div></div>');
        return;
    }

    algo_option = $("input[name='centralityInlineRadioOptions']:checked").val();
    var select_graph = selected_graph_ids();
    let input = select_graph[0];
    var url;
    var data = {};

    let userInfoTemp = JSON.parse(localStorage.getItem('smat.me'));
    let dir_name = userInfoTemp['id'];

    if (currentNetworkEngine == 'networkx') {
        url = 'na/centrality';
        data = {
            input: input,
            algo_option: algo_option,
            dir_name : dir_name
        };
        console.log('Data args for centrality', data);
    } else if (currentNetworkEngine == 'spark') {
        sparkUpload(selected_graph_ids());
        let input = select_graph[0];
        var query_list = [algo_option, input];
        var rname = (new Date().getTime()).toString() + '-spark';   // create unique_name   
        url = 'na/requestToSpark';
        let userInfoTemp = JSON.parse(localStorage.getItem('smat.me'));
        let dir_name = userInfoTemp['id'];
        data = {
            query_list, rname, dir_name
        }
        
    }
    centrality(url, data, currentNetworkEngine).then(response => {
        console.log('ID alloted:', response);
        if (currentNetworkEngine == "networkx") {
            render_centrality_graph(data["input"], "networkDivid", data["algo_option"]).then(response => {
                $('.analysis_summary_div').html('');
                $('.analysis_summary_div').append('<table class="table">  <thead> <tr><th>Node</th><th>Score</th></tr>  </thead> <tbody id="tableBody"> </tbody></table>');
                for (var i = 0; i < response["nodes"].length; i++) {
                    $('#tableBody').append('<tr><td>'+'<a href="#target" class="click_events">'+ response["nodes"][i]["label"] +'</a>'+ '</td><td>' + response["nodes"][i]["size"] + '</td></tr>');
                }
                $('.analysis_summary_div').append('</table>');
                draw_graph(response, "networkDivid");
                $("#messagebox").empty();
                $("#messagebox").append('<div class="card text-black m-2" style="background: white" id="infopanel"><i id="deleteinfoCard" class="fa fa-window-close text-neg" aria-hidden="true"></i><div class="d-flex justify-content-center text-black font-weight-bold card-body"> Centrality Successfully Calculated </div></div>');
            });
        } else if (currentNetworkEngine == "spark") {
            let sparkID = response.id;
            //TODO::tobealtered!
            let queryMetaData = searchRecords[currentlyShowing - 1];

            transferQueryToStatusTable(queryMetaData, 'Centrality', algo_option, sparkID);
            function checkSparkStatus() {
                fetch('na/getsparkstatus/' + sparkID, {
                    method: 'get'
                }).then(response => response.json())
                    .then(response => {
                        console.log(response);
                        if (response.state === 'success') {
                            let query_list = [algo_option, input];
                            storeResultofSparkFromController(sparkID, query_list, userID).then(response => {
                                makeShowBtnReadyAfterSuccess(sparkID, response.filename, 'centrality', algo_option,data["query_list"][1] );
                                window.clearInterval(checkSpartStatusInterval_centrality);
                            })

                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
            checkSpartStatusInterval_centrality = setInterval(checkSparkStatus, 5000);

            $("#messagebox").empty();
            $("#messagebox").append('<div class="card text-black m-2" style="background: white" id="infopanel"><i id="deleteinfoCard" class="fa fa-window-close text-neg" aria-hidden="true"></i><div class="d-flex justify-content-center text-black font-weight-bold card-body"> Centrality Successfully Calculated </div></div>');
        }
    });

});


$("#link_prediction_exec").on('click', function (NAType = $("#networkEngineNA").val(), algo_option = "") {
    var NAType = $("#networkEngineNA").val();
    algo_option = $("input[name='linkpredictionRadioOptions']:checked").val();
    var select_graph = selected_graph_ids();
    console.log(selected_graph_ids());
    let input = select_graph[0];
    console.log("Link Prediction Scanner");
    console.log(NAType);
    console.log(algo_option);

    var url;
    var data = {};
    let userInfoTemp = JSON.parse(localStorage.getItem('smat.me'));
    let dir_name = userInfoTemp['id'];

    if (currentNetworkEngine == 'networkx') {
        console.log("Got in");
        url = 'na/link_prediction';
        data = {
            input: input,
            src: $("#link_source_node").val(),
            k_value: $("#nos_links_to_be_predicted").val(),
            algo_option: algo_option,
            dir_name : dir_name
        };
        console.log(algo_option);
    } else if (currentNetworkEngine == 'spark') {
        sparkUpload(selected_graph_ids());
        let src = $("#link_source_node").val();
        SourceNode = src;
        var query_list = [algo_option, input, src];
        var rname = (new Date().getTime()).toString() + '-spark';   // create unique_name   
        url = 'na/requestToSpark';
        let userInfoTemp = JSON.parse(localStorage.getItem('smat.me'));
        let dir_name = userInfoTemp['id'];
        data = {
            query_list, rname,dir_name
        }
    } else {
    }
    linkprediction(url, data, NAType).then(response => {
        if (currentNetworkEngine == "networkx") {
            render_linkprediction_graph(data["input"], data["src"]).then(response => {
                $('.analysis_summary_div').empty();
                $('.analysis_summary_div').append('<table> <tr><th>Node</th><th>Score</th></tr>');
                for (var i = 0; i < response.length; i++) {
                    if (data["src"] == response[i].id) {
                        continue;
                    }
                    $('.analysis_summary_div').append('<tr><td>'+'<a href="#target" class="click_events">'+ data["src"] +'</a>'+'</td><td>' + response[i].id + '</td></tr>');
                }
                $('.analysis_summary_div').append('</table>');
                update_view_graph_for_link_prediction(response, data["src"]);
            });
        } else if (currentNetworkEngine == "spark") {

            let sparkID = response.id;
            //TODO::tobealtered!
            let queryMetaData = searchRecords[currentlyShowing - 1];

            transferQueryToStatusTable(queryMetaData, 'Link Prediction', algo_option, sparkID);
            function checkSparkStatus() {
                fetch('na/getsparkstatus/' + sparkID, {
                    method: 'get'
                }).then(response => response.json())
                    .then(response => {
                        console.log(response);
                        if (response.state === 'success') {
                            let query_list = [algo_option, input];
                            storeResultofSparkFromController(sparkID, query_list, userID).then(response => {
                                makeShowBtnReadyAfterSuccess(sparkID, response.filename, 'linkprediction', algo_option,data["query_list"][1] );
                                window.clearInterval(checkSpartStatusInterval_centrality);
                            })
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
            checkSpartStatusInterval_centrality = setInterval(checkSparkStatus, 5000);
        }
    })
});

$("#sp_exec").on('click', function (NAType = "networkx", algo_option = "") {
    NAType = $("#networkEngineNA").val();
    var src = $("#sourceSp").val();
    var dst = $("#destSp").val();
    var algo_option = $("#spoption").val();
    var select_graph = selected_graph_ids();
    console.log(selected_graph_ids());
    var input = select_graph[0];

    var url;
    var data = {};

    let userInfoTemp = JSON.parse(localStorage.getItem('smat.me'));
    let dir_name = userInfoTemp['id'];

    if (currentNetworkEngine == 'networkx') {
        url = 'na/shortestpath';
        data = {
            input: input,
            src: src,
            dst: dst,
            algo_option: algo_option,
            dir_name : dir_name
        };

    } else if (currentNetworkEngine == 'spark') {
        sparkUpload(selected_graph_ids());
        var query_list = ['ShortestPath', input, src, dst];
        SourceNode = src;
        DestinationNode = dst;
        var rname = (new Date().getTime()).toString() + '-spark';   // create unique_name   
        url = 'na/requestToSpark';
        let userInfoTemp = JSON.parse(localStorage.getItem('smat.me'));
        let dir_name = userInfoTemp['id'];
        data = {
            query_list: query_list,
            rname: rname,
            dir_name : dir_name
        };
    } else {
    }
    shortestpaths(url, data, currentNetworkEngine).then(response => {
        if (currentNetworkEngine == "networkx") {
            render_shortestpath_graph(data["input"], data["src"], data["dst"]);
        } else if (currentNetworkEngine == "spark") {
            let sparkID = response.id;
            // Hardcoding the Shortest Path
            let algo_option = "ShortestPath"; 

            console.log("I am logging Logger");
            console.log(response);

            //TODO::tobealtered!
            let queryMetaData = searchRecords[currentlyShowing - 1];

            transferQueryToStatusTable(queryMetaData, 'ShortestPath', algo_option, sparkID);
            function checkSparkStatus() {
                fetch('na/getsparkstatus/' + sparkID, {
                    method: 'get'
                }).then(response => response.json())
                    .then(response => {
                        console.log(response);
                        if (response.state === 'success') {
                            let query_list = [algo_option, input];
                            storeResultofSparkFromController(sparkID, query_list, userID).then(response => {
                                console.log("I am printing your response filename");
                                console.log(response.filename);
                                makeShowBtnReadyAfterSuccess(sparkID, response.filename, 'ShortestPath', algo_option,data["query_list"][1] );
                                window.clearInterval(checkSpartStatusInterval_centrality);
                            })
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
            checkSpartStatusInterval_centrality = setInterval(checkSparkStatus, 5000);
        }
    });
});

// Setting community detection algo option
$("#async").on("click", function () {
    $("#noOfCommunities").show();
    community_algo_option = $("#async").text();
});

$("#lpa").on("click", function () {
    community_algo_option = $("#lpa").text();
    $("#noOfCommunities").hide();
});

$("#grivan").on("click", function () {
    community_algo_option = $("#grivan").text();
    $("#noOfCommunities").hide();
});

$("#comm_exec").on('click', function (NAType = $("#NAEngine").val(), algo_option = "") {
    if(selected_graph_ids().length > 1){
        $("#messagebox").empty();
        $("#messagebox").append('<div class="card text-black m-2" style="background: white" id="infopanel"><i id="deleteinfoCard" class="fa fa-window-close text-neg" aria-hidden="true"></i><div class="d-flex justify-content-center text-black font-weight-bold card-body"> Please, Select a Single Network </div></div>');
        return;
    }else if(selected_graph_ids().length == 0){
        $("#messagebox").empty();
        $("#messagebox").append('<div class="card text-black m-2" style="background: white" id="infopanel"><i id="deleteinfoCard" class="fa fa-window-close text-neg" aria-hidden="true"></i><div class="d-flex justify-content-center text-black font-weight-bold card-body"> Please, Select a Network </div></div>');
        return;
    }
    NAType = $("#networkEngineNA").val();
    if (community_algo_option == "Async Fluidic") {
        algo_option = "async";
        if(!$("#noOfCommunities").val()){
            $("#messagebox").empty();
            $("#messagebox").append('<div class="card text-black m-2" style="background: white" id="infopanel"><i id="deleteinfoCard" class="fa fa-window-close text-neg" aria-hidden="true"></i><div class="d-flex justify-content-center text-black font-weight-bold card-body"> Please, enter number of communities </div></div>');
            return;        
        }
    } else if (community_algo_option == "Label Propagation") {
        algo_option = "lpa";
    } else if (community_algo_option == "Grivan Newman") {
        algo_option = "grivan";
    }
    console.log(algo_option);
    var select_graph = selected_graph_ids();
    console.log(selected_graph_ids());
    var input = select_graph[0];
    var k_value = $("#noOfCommunities").val();
    var url;
    var data = {};

    let userInfoTemp = JSON.parse(localStorage.getItem('smat.me'));
    let dir_name = userInfoTemp['id'];

    if (NAType == 'networkx') {
        url = 'na/communitydetection';
        data = {
            input: input,
            k: k_value,
            iterations: 1000,
            algo_option: algo_option,
            dir_name : dir_name
        };
    } else if (currentNetworkEngine == 'spark') {
        let userInfoTemp = JSON.parse(localStorage.getItem('smat.me'));
        let dir_name = userInfoTemp['id'];
        sparkUpload(selected_graph_ids());
        let input = select_graph[0];
        var query_list = [algo_option, input];
        var rname = (new Date().getTime()).toString() + '-spark'; 

        var query_list = ['lpa'];
        query_list.push(input);

        url = 'na/requestToSpark';
        data = {
            query_list: query_list,
            rname: rname,
            dir_name : dir_name
        };
    } else {
    }
    community_detection(url, data, NAType).then(response => {
        if (currentNetworkEngine == "networkx") {
            render_community_graph1(data["input"]).then(response => {
                render_graph_community(response, "networkDivid");
            });

            $("#messagebox").empty();
            $("#messagebox").append('<div class="card text-black m-2" style="background: white" id="infopanel"><i id="deleteinfoCard" class="fa fa-window-close text-neg" aria-hidden="true"></i><div class="d-flex justify-content-center text-black font-weight-bold card-body"> Community Detection Performed Successfully </div></div>');

        } else if (currentNetworkEngine == "spark") {

            let sparkID = response.id;
            //TODO::tobealtered!
            let queryMetaData = searchRecords[currentlyShowing - 1];

            transferQueryToStatusTable(queryMetaData, 'communities', algo_option, sparkID);
            function checkSparkStatus() {
                fetch('na/getsparkstatus/' + sparkID, {
                    method: 'get'
                }).then(response => response.json())
                    .then(response => {
                        console.log(response);
                        if (response.state === 'success') {
                            let query_list = [algo_option, input];
                            storeResultofSparkFromController(sparkID, query_list, userID).then(response => {
                                makeShowBtnReadyAfterSuccess(sparkID, response.filename, 'communities', algo_option,data["query_list"][1] );
                                window.clearInterval(checkSpartStatusInterval_centrality);
                            })
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
            checkSpartStatusInterval_centrality = setInterval(checkSparkStatus, 5000);

            $("#messagebox").empty();
            $("#messagebox").append('<div class="card text-black m-2" style="background: white" id="infopanel"><i id="deleteinfoCard" class="fa fa-window-close text-neg" aria-hidden="true"></i><div class="d-flex justify-content-center text-black font-weight-bold card-body"> Community Detection Performed Successfully </div></div>');
        }
    })
});

$("#union_exec").on('click', function () {
    if((selected_graph_ids().length == 0) || (selected_graph_ids().length == 1)){
        $("#messagebox").empty();
        $("#messagebox").append('<div class="card text-black m-2" style="background: white" id="infopanel"><i id="deleteinfoCard" class="fa fa-window-close text-neg" aria-hidden="true"></i><div class="d-flex justify-content-center text-black font-weight-bold card-body"> Please, select at least 2 Networks </div></div>');
        return;
    }

    let wellformedquery; 
    let selectedGraphs = selected_graph_ids();

    for(let i=0; i<selected_graph_ids().length; i++){
        if(i==0){
            wellformedquery = queryDictionaryFilename[selectedGraphs[i]];
        }else{
            wellformedquery = wellformedquery + " U " + queryDictionaryFilename[selectedGraphs[i]];
        }
    }

    console.log(wellformedquery);
   
    var url;
    var data = {};
    var input_arr = selected_graph_ids();
    let userInfoTemp = JSON.parse(localStorage.getItem('smat.me'));
    let dir_name = userInfoTemp['id'];
    if (currentNetworkEngine == 'networkx') {
        url = 'na/union';
        data = {
            input: input_arr,
            dir_name : dir_name
        };
    } else if (currentNetworkEngine == 'spark') {
        var query_list = ['union'];

        for (var i = 0; i < input_arr.length; i++) {
            query_list.push(input_arr[i]);
        }

        sparkUpload(selected_graph_ids());
        var rname = (new Date().getTime()).toString() + '-spark';   // create unique_name   
        url = 'na/requestToSpark';
        let userInfoTemp = JSON.parse(localStorage.getItem('smat.me'));
        let dir_name = userInfoTemp['id'];
        data = {
            query_list, rname,dir_name
        }
    } else {
        console.log("OO");
    }
    union(url, data, currentNetworkEngine).then(response => {
        if (currentNetworkEngine == "networkx") {
            render_union_graph(data["input"]).then(response => {
                render_graph_union(response);
            });
        } else if (currentNetworkEngine == "spark") {

            let sparkID = response.id;
            //TODO::tobealtered!
            let queryMetaData = searchRecords[currentlyShowing - 1];

            let algo_option = "union";

            transferQueryToStatusTable(queryMetaData, 'union',algo_option, sparkID);
            function checkSparkStatus() {
                fetch('na/getsparkstatus/' + sparkID, {
                    method: 'get'
                }).then(response => response.json())
                    .then(response => {
                        console.log(response);
                        if (response.state === 'success') {
                            let query_list = [algo_option];
                            let conc;
                            for(let i=0; i<input_arr.length; i++){
                                query_list.push(input_arr[i]);
                                if(i == 0){
                                    conc = input_arr[i];
                                }else{
                                    conc = conc+"__"+input_arr[i];
                                }
                            }
                            storeResultofSparkFromController(sparkID, query_list, userID).then(response => {
                                console.log("I have received this as your filename");
                                console.log(response.filename);
                                makeShowBtnReadyAfterSuccess(sparkID, response.filename, 'union', algo_option,conc);
                                window.clearInterval(checkSpartStatusInterval_centrality);
                            })
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
            checkSpartStatusInterval_centrality = setInterval(checkSparkStatus, 5000);
        }
    });
});


$("#intersection_exec").on('click', function (NAType = "networkx") {

    if((selected_graph_ids().length == 0) || (selected_graph_ids().length == 1)){
        $("#messagebox").empty();
        $("#messagebox").append('<div class="card text-black m-2" style="background: white" id="infopanel"><i id="deleteinfoCard" class="fa fa-window-close text-neg" aria-hidden="true"></i><div class="d-flex justify-content-center text-black font-weight-bold card-body"> Please, select at least 2 Networks </div></div>');
        return;
    }

    NAType = $("#networkEngineNA").val();
    var url;
    var data = {};
    var input_arr = selected_graph_ids();
    let userInfoTemp = JSON.parse(localStorage.getItem('smat.me'));
    let dir_name = userInfoTemp['id'];
    if (NAType == 'networkx') {
        url = 'na/intersection';
        data = {
            input: input_arr,
            dir_name : dir_name
        };
    } else if (currentNetworkEngine == 'spark') {
        var query_list = ['intersection'];

        for (var i = 0; i < input_arr.length; i++) {
            query_list.push(input_arr[i]);
        }
        sparkUpload(selected_graph_ids());
        var rname = (new Date().getTime()).toString() + '-spark';   // create unique_name   
        url = 'na/requestToSpark';
        let userInfoTemp = JSON.parse(localStorage.getItem('smat.me'));
        let dir_name = userInfoTemp['id'];
        data = {
            query_list, rname, dir_name
        }
    } else {
    }
    intersection(url, data, NAType).then(response => {
        if (NAType == "networkx") {
            render_intersection_diff_graph(data["input"], "intersection").then(response => {
                render_intersection_difference(response, "intersection_displayer", "intersection");
            });
            $("#messagebox").empty();
            $("#messagebox").append('<div class="card text-black m-2" style="background: white" id="infopanel"><i id="deleteinfoCard" class="fa fa-window-close text-neg" aria-hidden="true"></i><div class="d-flex justify-content-center text-black font-weight-bold card-body"> Intersection Operation Performed Successfully </div></div>');
            return;
        } else if (currentNetworkEngine == "spark") {

            let sparkID = response.id;
            //TODO::tobealtered!
            let queryMetaData = searchRecords[currentlyShowing - 1];
            let algo_option = "intersection";

            transferQueryToStatusTable(queryMetaData, 'intersection',algo_option, sparkID);
          
            function checkSparkStatus() {
                fetch('na/getsparkstatus/' + sparkID, {
                    method: 'get'
                }).then(response => response.json())
                    .then(response => {
                        console.log(response);
                        if (response.state === 'success') {
                            let query_list = [algo_option];
                            let conc;
                            for(let i=0; i<input_arr.length; i++){
                                query_list.push(input_arr[i]);
                                if(i == 0){
                                    conc = input_arr[i];
                                }else{
                                    conc = conc+"__"+input_arr[i];
                                }
                            }
                            storeResultofSparkFromController(sparkID, query_list, userID).then(response => {
                                console.log("I have received this as your filename");
                                console.log(response.filename);
                                makeShowBtnReadyAfterSuccess(sparkID, response.filename, 'intersection', algo_option,conc);
                                window.clearInterval(checkSpartStatusInterval_centrality);
                            })
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
            checkSpartStatusInterval_centrality = setInterval(checkSparkStatus, 5000);

            $("#messagebox").empty();
            $("#messagebox").append('<div class="card text-black m-2" style="background: white" id="infopanel"><i id="deleteinfoCard" class="fa fa-window-close text-neg" aria-hidden="true"></i><div class="d-flex justify-content-center text-black font-weight-bold card-body"> Intersection Operation Performed Successfully </div></div>');
            return;
        }
    });
});

$("#expansionTabNA").on('click', function (NAType = "networkx") {
    var select_graph = selected_graph_ids();
    console.log(selected_graph_ids());
    let input = select_graph[0];
    render_graph(input, "expansion_displayer");
});

$("expansion_exec").on('click', function (NAType = "networkx") {
    var node_to_be_expanded = $("#node_to_be_expanded").val();
    var hops = $("#hops").val();
    expansion(node_to_be_expanded, hops);
});

$("#export").on('click', function (NAType = "networkx") {
    exportnetwork();
});

$("#difference_exec").on('click', function (NAType = "networkx") {

    if((selected_graph_ids().length == 0) || (selected_graph_ids().length == 1)){
        $("#messagebox").empty();
        $("#messagebox").append('<div class="card text-black m-2" style="background: white" id="infopanel"><i id="deleteinfoCard" class="fa fa-window-close text-neg" aria-hidden="true"></i><div class="d-flex justify-content-center text-black font-weight-bold card-body"> Please, select at least 2 Networks </div></div>');
        return;
    }

    var NAType = $("#networkEngineNA").val();
    var url;
    var data = {};
    var input_arr = [];
    let sequence = $("#difference_sequence").val().split(',');
    for (let i = 0; i < sequence.length; i++) {
        input_arr.push(cardIDdictionary[sequence[i]]);
    }

    let userInfoTemp = JSON.parse(localStorage.getItem('smat.me'));
    let dir_name = userInfoTemp['id'];

    if (currentNetworkEngine == 'networkx') {
        url = 'na/difference';
        data = {
            input: input_arr, dir_name : dir_name
        };
    } else if (currentNetworkEngine == 'spark') {
        var query_list = ['difference'];

        for (let i = 0; i < input_arr.length; i++) {
            query_list.push(input_arr[i]);
        }

        sparkUpload(selected_graph_ids());
        var rname = (new Date().getTime()).toString() + '-spark';   // create unique_name   
        url = 'na/requestToSpark';
        let userInfoTemp = JSON.parse(localStorage.getItem('smat.me'));
        let dir_name = userInfoTemp['id'];
        data = {
            query_list, rname, dir_name
        }

    } else {
        console.log("OO");
    }
    difference(url, data, currentNetworkEngine).then(response => {
        if (currentNetworkEngine == "networkx") {
            render_intersection_diff_graph(data["input"], "difference").then(response => {
                render_intersection_difference(response, "difference_displayer", "difference");
            });
            $("#messagebox").empty();
            $("#messagebox").append('<div class="card text-black m-2" style="background: white" id="infopanel"><i id="deleteinfoCard" class="fa fa-window-close text-neg" aria-hidden="true"></i><div class="d-flex justify-content-center text-black font-weight-bold card-body"> Difference Operation Performed Successfully </div></div>');
            return;
        } else if (currentNetworkEngine == "spark") {


            let sparkID = response.id;
            //TODO::tobealtered!
            let queryMetaData = searchRecords[currentlyShowing - 1];
            let algo_option = "difference";

            transferQueryToStatusTable(queryMetaData, 'difference',algo_option, sparkID);
          
            function checkSparkStatus() {
                fetch('na/getsparkstatus/' + sparkID, {
                    method: 'get'
                }).then(response => response.json())
                    .then(response => {
                        console.log(response);
                        if (response.state === 'success') {
                            let query_list = [algo_option];
                            let conc;
                            for(let i=0; i<input_arr.length; i++){
                                query_list.push(input_arr[i]);
                                if(i == 0){
                                    conc = input_arr[i];
                                }else{
                                    conc = conc+"__"+input_arr[i];
                                }
                            }
                            storeResultofSparkFromController(sparkID, query_list, userID).then(response => {
                                console.log("I have received this as your filename");
                                console.log(response.filename);
                                makeShowBtnReadyAfterSuccess(sparkID, response.filename, 'difference', algo_option,conc);
                                window.clearInterval(checkSpartStatusInterval_centrality);
                            })
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
            checkSpartStatusInterval_centrality = setInterval(checkSparkStatus, 5000);

            $("#messagebox").empty();
            $("#messagebox").append('<div class="card text-black m-2" style="background: white" id="infopanel"><i id="deleteinfoCard" class="fa fa-window-close text-neg" aria-hidden="true"></i><div class="d-flex justify-content-center text-black font-weight-bold card-body"> Difference Operation Performed Successfully </div></div>');
            return;
        }
    });
});

$("#usenetwork").on('click', function () {
    var generator = new IDGenerator();
    var unique_id = generator.generate();

    if(currentOperation == "union"){
        writedelete(unique_id);
        generateCards(totalQueries, "Network  after deleting"+ +"", "", "", "", "", "", unique_id, 'naCards',"afterdeletion");

    }else if(currentOperation == "deletion"){
        writedelete(unique_id);
        let sentence;
        getDeletedNodes().then(response => {
            sentence = response;
            totalQueries = totalQueries + 1;
            generateCards(totalQueries, "Network "+currentviewingnetwork+" after deleting "+ sentence +"", "", "", "", "", "", unique_id, 'naCards',"afterdeletion");
        });
    }
});

function IDGenerator() {
    this.length = 8;
    this.timestamp = +new Date;
    var _getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    this.generate = function () {
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

const algoDict = { "degcen": 'Degree Centrality', "pgcen": "Page Rank Centrality" };
const transferQueryToStatusTable = (data, operation, algo, sparkID = 123, renderDivID = 'networkDivid') => {
    $('#searchTable').css('display', 'block');
    let algoTitle = algoDict[algo];
    $('#naStatusTable').append('<tr><th scope="row">' + data.id + '</th><td>' + data.query + '</td><td>' + operation + ' (' + algoTitle + ')' + '</td><td>' + data.from + '</td><td>' + data.to + '</td><td  id="' + sparkID + 'Status">Running...</td><td><button class="btn btn-secondary smat-rounded mx-1 showBtn" value="' + data.id + '|' + sparkID + '|' + renderDivID + '"  id="' + sparkID + 'Btn" disabled > Show </button><button class="btn btn-neg mx-1  smat-rounded"> Delete </button></td></tr>');
}

const makeShowBtnReadyAfterSuccess = (sparkID, filename, mode, algo = null, originalFile) => {
    $('#' + sparkID + 'Btn').prop("disabled", false);
    let btnValue = $('#' + sparkID + 'Btn').attr('value');
    $('#' + sparkID + 'Btn').removeClass('btn-secondary');
    $('#' + sparkID + 'Btn').addClass('btn-primary');
    algo = algo == null ? '' : algo;
    btnValue = btnValue + '|' + filename + '|' + mode + '|' + algo + '|' + originalFile + '|' + SourceNode + '|' + DestinationNode;
    $('#' + sparkID + 'Btn').attr('value', btnValue);
    $('#' + sparkID + 'Status').text('Success');
}