//void main
import { roshan } from './visualizer.js';
import {
    render_graph, union, intersection, exportnetwork, selected_graph_ids, render_centrality_graph,
    sparkUpload, get_network, writedelete, difference, shortestpaths, community_detection, centrality, linkprediction,
    render_linkprediction_graph, render_shortestpath_graph, render_community_graph1, draw_graph, update_view_graph_for_link_prediction,
    render_graph_community, render_union_graph, render_graph_union, render_intersection_diff_graph, render_intersection_difference,
    networkGeneration, storeResultofSparkFromController
} from './helper.js';
import { makeSuggestionsRead } from '../utilitiesJS/smatExtras.js'



let totalQueries;
let searchRecords = [];
var cardIDdictionary = {};
var currentNetworkEngine = 'networkx', currentlyShowing;
var community_algo_option = "Async Fluidic";

var SourceNode;
var DestinationNode;

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
    if(incoming){
        //TODO::Redirection 
        let filename = incoming + fromDateReceived + toDateReceived + 50 + 'Hashtag-Hashtag';
        networkGeneration('na/genNetwork', incoming, fromDateReceived, toDateReceived, 50 , 'Hashtag-Hashtag', filename).then(response => {
            $("#msg_displayer").empty();
            generateCards(totalQueries, incoming, fromDateReceived, toDateReceived, 50, 'Hashtag-Hashtag', currentNetworkEngine, filename, 'naCards');
        })
    }
    makeSuggestionsRead ('naQueryInputBox','top_hashtag',50);
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
            render_union_graph(files).then(response => {
                render_graph_union(response);
            });
        }else if(args[4] == "difference"){
            console.log(args[6]);
            let files = args[6].split("__");
            console.log(files);
            render_union_graph(files).then(response => {
                render_graph_union(response);
            });
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
        let fromDateTemp = $('#fromDateNA').val();
        let fromDateStripped = fromDateTemp;
        fromDateTemp = fromDateTemp + " 00:00:00";
        let toDateTemp = $('#toDateNA').val();
        let toDateStripped = toDateTemp;
        toDateTemp = toDateTemp + " 00:00:00";
        let noOfNodesTemp = $('#nodesNA').val().trim();
        let naTypeTemp = $('#typeNA').val();
        let netCategory = $("#net_category").val();
        let naEngine = $('#networkEngineNA').val();
        let filename = queryTemp + fromDateStripped + toDateStripped + noOfNodesTemp + naTypeTemp;
        console.log(queryTemp, naEngine);
        console.log('Submitted');
        networkGeneration('na/genNetwork', queryTemp, fromDateTemp, toDateTemp, noOfNodesTemp, naTypeTemp, filename).then(response => {
            $("#msg_displayer").empty();
            generateCards(totalQueries, queryTemp, fromDateStripped, toDateStripped, noOfNodesTemp, naTypeTemp, naEngine, filename, 'naCards');
        })
    });

    $('body').on('click', 'div .networkCardDetails', function () {
        console.log(searchRecords);
        let index = $(this).attr('value');
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

})





$("#lpTabNA").on('click', function () {
    var select_graph = selected_graph_ids();
    console.log(selected_graph_ids());
    let input = select_graph[0];
    render_graph(input, "networkDivid");
});

$("#spTab").on('click', function () {
    var select_graph = selected_graph_ids();
    console.log(selected_graph_ids());
    let input = select_graph[0];
    render_graph(input, "networkDivid");
});

$("#commTab").on('click', function () {
    var select_graph = selected_graph_ids();
    console.log(selected_graph_ids());
    let input = select_graph[0];
    render_graph(input, "networkDivid");
});


$("#importNA").on('click', function () {
    $("#myModal_file_upload").modal('show');
});


$('#upload_form').on('submit', function (event) {
    event.preventDefault();
    var unique_id = "a1";
    var n = new FormData(this);
    n.append("name", unique_id);
    $('#myModal_file_upload').modal('toggle');
    return output;

});


const generateCards = (id, query, fromDateTemp, toDateTemp, noOfNodesTemp, naTypeTemp, naEngine, filename, div) => {
    let tempArr = [];
    tempArr = { 'id': id, 'query': query, 'from': fromDateTemp, 'to': toDateTemp, 'nodesNo': noOfNodesTemp, 'naType': naTypeTemp, 'filename': filename, 'naEngine': naEngine };
    searchRecords.push(tempArr);
    cardIDdictionary[id] = filename;
    console.log(cardIDdictionary, filename);
    $('#' + div).append('<div class="col-md-2" value="' + id + '"><div class="card shadow p-0"><div class="card-body p-0"><div class="d-flex px-3 pt-3"><span class="pull-left"><i id="deleteCard" class="fa fa-window-close text-neg" aria-hidden="true"></i></span><div class="naCardNum text-center ml-auto mr-auto">' + padNumber(id) + '</div><span class="pull-right ml-auto"><input class="form-check-input position-static" type="checkbox" id=' + filename + '></span></div><div class="text-left networkCardDetails px-3 pb-3" style="border-radius:10px;" value="' + id + '" ><p class="font-weight-bold m-0" style="font-size:16px;" cardquery="' + query + '"> ' + query + '</p><p class="  smat-dash-title " style="margin-top:-2px;margin-bottom:0px;"> From: ' + fromDateTemp + ' </p><p class="   smat-dash-title " style="margin-top:-2px;margin-bottom:0px;" > To:' + toDateTemp + ' </p><p class=" smat-dash-title " style="margin-top:-2px;margin-bottom:0px;"> Nodes: ' + noOfNodesTemp + '</p><p class="  smat-dash-title " style="margin-top:-2px;margin-bottom:0px;" > Type: ' + naTypeTemp + '</p><p class=" smat-dash-title " style="margin-top:-2px;margin-bottom:0px;"> Status: Ready</p></div></div></div></div>');
    // $('#' + div).append('<div class="col-sm-2" ><div class="card shadow networkCardDetails" value="' + id + '"><div class="card-body "><div class="d-flex"><div class="" ><p class="m-0 naCardNum"> ' + id + ' </p></div><div class="text-left ml-1 "><p class="font-weight-bold mb-1">' + query + ' </p> <p class=" mb-1 pull-text-top smat-dash-title"> <span> From:</span>' + fromDateTemp + '</p> <p class="mb-1 pull-text-top smat-dash-title"> <span> To:</span> ' + toDateTemp + '</p> <p class="mb-1 pull-text-top smat-dash-title">' + naTypeTemp + '</p><p class="mb-1 pull-text-top smat-dash-title">' + noOfNodesTemp + ' Nodes</p> <p class="m-0 pull-text-top smat-dash-title text-success ">Ready  </div></div></div></div></div>');
}

$("#naCards").on("click", "#deleteCard", function () {
    $(this).parent().parent().parent().parent().parent().remove();
});

const generateCards_deletion = (id, query, div) => {
    let tempArr = [];
    tempArr = { 'id': id, 'query': query };
    searchRecords.push(tempArr);
    let cardID = "filecode-" + id;
    cardIDdictionary[id] = cardID;
    $('#' + div).append('<div class="col-md-2" value="' + id + '"><div class="card shadow p-0"><div class="card-body p-0"><div class="d-flex px-3 pt-3"><span class="pull-left"><i class="fa fa-window-close text-neg" aria-hidden="true"></i></span><div class="naCardNum text-center ml-auto mr-auto">' + padNumber(id) + '</div><span class="pull-right ml-auto"><input class="form-check-input position-static" type="checkbox" id=' + cardID + '></span></div><div class="text-left networkCardDetails px-3 pb-3" style="border-radius:10px;" value="' + id + '" ><p class="font-weight-bold m-0" style="font-size:16px;" cardquery="' + query + '"> ' + query + '</p></div></div></div></div>');
}

function padNumber(d) {
    return (d < 10) ? d.toString() : d.toString();
    //return (d < 10) ? '0' + d.toString() : d.toString();
}

const showing_results_for = (cardData) => {
    let data = cardData;
    $('#naShowingResForTitle').text(data['query']);

}

$("#centrality_exec").on('click', function (NAType, algo_option = $('#centrality_algo_choice').val()) {
    algo_option = $("input[name='centralityInlineRadioOptions']:checked").val();
    var select_graph = selected_graph_ids();
    // console.log(selected_graph_ids());
    let input = select_graph[0];
    // console.log("Centrality Scanner");
    // console.log(NAType);
    // console.log(algo_option);
    var url;
    var data = {};


    if (currentNetworkEngine == 'networkx') {

        url = 'na/centrality';
        data = {
            input: input,
            algo_option: algo_option
        };
        console.log('Data args for centrality', data);
    } else if (currentNetworkEngine == 'spark') {
        sparkUpload(selected_graph_ids());
        let input = select_graph[0];
        var query_list = [algo_option, input];
        var rname = (new Date().getTime()).toString() + '-spark';   // create unique_name   
        url = 'na/requestToSpark';
        data = {
            query_list, rname
        }
        
    }
    centrality(url, data, currentNetworkEngine).then(response => {
        console.log('ID alloted:', response);
        if (currentNetworkEngine == "networkx") {
            render_centrality_graph(data["input"], "networkDivid", data["algo_option"]).then(response => {
                $('.analysis_summary_div').html('');
                $('.analysis_summary_div').append('<table class="table">  <thead> <tr><th>Node</th><th>Score</th></tr>  </thead> <tbody id="tableBody"> </tbody></table>');
                for (var i = 0; i < response["nodes"].length; i++) {
                    $('#tableBody').append('<tr><td>' + response["nodes"][i]["label"] + '</td><td>' + response["nodes"][i]["size"] + '</td></tr>');
                }
                $('.analysis_summary_div').append('</table>');
                draw_graph(response, "networkDivid");
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

            // render_centrality_graph(data["query_list"][1], "networkDivid", data["query_list"][0]).then(response => {
            //     console.log('RESPONSE', response);
            //     $('.analysis_summary_div').empty();
            //     $('.analysis_summary_div').append('<table> <tr><th>Node</th><th>Score</th></tr>');
            //     for (var i = 0; i < response["nodes"].length; i++) {
            //         $('.analysis_summary_div').append('<tr><td>' + response["nodes"][i]["label"] + '</td><td>' + response["nodes"][i]["size"] + '</td></tr>');
            //     }
            //     $('.analysis_summary_div').append('</table>');
            //     draw_graph(response, "networkDivid");
            // });
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

    if (NAType == 'networkx') {
        console.log("Got in");
        url = 'na/link_prediction';
        data = {
            input: input,
            src: $("#link_source_node").val(),
            k_value: $("#nos_links_to_be_predicted").val(),
            algo_option: algo_option
        };
        console.log(algo_option);
    } else if (NAType == 'spark') {
        let src = $("#link_source_node").val();
        SourceNode = src;
        var query_list = [algo_option, input, src];
        var unique_name_timestamp = (new Date().getTime()).toString(); // create unique_name   
        url = 'na/requestToSparkandStoreResult';
        data = {
            query_list: query_list,
            rname: unique_name_timestamp
        };
        sparkUpload(selected_graph_ids());
    } else {
    }
    linkprediction(url, data, NAType).then(response => {
        if (NAType == "networkx") {
            render_linkprediction_graph(data["input"], data["src"]).then(response => {
                $('.analysis_summary_div').empty();
                $('.analysis_summary_div').append('<table> <tr><th>Node</th><th>Score</th></tr>');
                for (var i = 0; i < response.length; i++) {
                    if (data["src"] == response[i].id) {
                        continue;
                    }
                    $('.analysis_summary_div').append('<tr><td>' + data["src"] + '</td><td>' + response[i].id + '</td></tr>');
                }
                $('.analysis_summary_div').append('</table>');
                update_view_graph_for_link_prediction(response, data["src"]), k_value;
            });
        } else if (NAType == "spark") {

            let sparkID = response.id;
            //TODO::tobealtered!
            let queryMetaData = searchRecords[currentlyShowing - 1];

            transferQueryToStatusTable(queryMetaData, 'linkprediction', algo_option, sparkID);
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




            let k_value = $("#nos_links_to_be_predicted").val();
            render_linkprediction_graph(data["query_list"][1], data["query_list"][2]).then(response => {
                console.log("LP");
                console.log(response);
                update_view_graph_for_link_prediction(response, data["query_list"][2], k_value);
            })
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

    if (currentNetworkEngine == 'networkx') {
        url = 'na/shortestpath';
        data = {
            input: input,
            src: src,
            dst: dst,
            algo_option: algo_option
        };

    } else if (currentNetworkEngine == 'spark') {
        sparkUpload(selected_graph_ids());
        var query_list = ['ShortestPath', input, src, dst];
        SourceNode = src;
        DestinationNode = dst;
        var rname = (new Date().getTime()).toString() + '-spark';   // create unique_name   
        url = 'na/requestToSpark';
        data = {
            query_list: query_list,
            rname: rname
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

           // render_shortestpath_graph(data["query_list"][1], data["query_list"][2], data["query_list"][3]);
        }
    });
});

// Setting community detection algo option
$("#async").on("click", function () {
    community_algo_option = $("#async").text();
});

$("#lpa").on("click", function () {
    community_algo_option = $("#lpa").text();
});

$("#grivan").on("click", function () {
    community_algo_option = $("#grivan").text();
});

$("#comm_exec").on('click', function (NAType = $("#NAEngine").val(), algo_option = "") {
    NAType = $("#networkEngineNA").val();
    if (community_algo_option == "Async Fluidic") {
        algo_option = "async";
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

    if (NAType == 'networkx') {
        url = 'na/communitydetection';
        data = {
            input: input,
            k: k_value,
            iterations: 1000,
            algo_option: algo_option
        };
    } else if (currentNetworkEngine == 'spark') {

        sparkUpload(selected_graph_ids());
        let input = select_graph[0];
        var query_list = [algo_option, input];
        var rname = (new Date().getTime()).toString() + '-spark'; 

        var query_list = ['lpa'];
        query_list.push(input);

        url = 'na/requestToSpark';
        data = {
            query_list: query_list,
            rname: rname
        };
    } else {
    }
    community_detection(url, data, NAType).then(response => {
        if (currentNetworkEngine == "networkx") {
            render_community_graph1(data["input"]).then(response => {
                render_graph_community(response, "networkDivid");
            });
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





            // render_community_graph1(data["query_list"][1]).then(response => {
            //     render_graph_community(response, "networkDivid");
            // });
        }
    })
});

$("#union_exec").on('click', function () {
    var url;
    var data = {};
    var input_arr = selected_graph_ids();
    if (currentNetworkEngine == 'networkx') {
        url = 'na/union';
        data = {
            input: input_arr
        };
    } else if (currentNetworkEngine == 'spark') {
        var query_list = ['union'];

        for (var i = 0; i < input_arr.length; i++) {
            query_list.push(input_arr[i]);
        }

        sparkUpload(selected_graph_ids());
        var rname = (new Date().getTime()).toString() + '-spark';   // create unique_name   
        url = 'na/requestToSpark';
        data = {
            query_list, rname
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

            // var arr1 = data["query_list"];
            // var arr12 = arr1.reverse();
            // arr12.pop();
            // var finalArray = arr12.reverse();
            // render_union_graph(finalArray).then(response => {
            //     render_graph_union(response);
            // });
        }
    });
});


$("#intersection_exec").on('click', function (NAType = "networkx") {
    NAType = $("#networkEngineNA").val();
    var url;
    var data = {};
    var input_arr = selected_graph_ids();
    if (NAType == 'networkx') {
        url = 'na/intersection';
        data = {
            input: input_arr
        };
    } else if (currentNetworkEngine == 'spark') {
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
    intersection(url, data, NAType).then(response => {
        if (NAType == "networkx") {
            render_intersection_diff_graph(data["input"], "intersection").then(response => {
                render_intersection_difference(response, "intersection_displayer", "intersection");
            });
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

            // var arr1 = data["query_list"];
            // var arr12 = arr1.reverse();
            // arr12.pop();
            // var finalArray = arr12.reverse();
            // render_intersection_diff_graph(finalArray, "intersection").then(response => {
            //     render_intersection_difference(response, "intersection_displayer", "intersection");
            // });
        }
    });
});

$("#expansionTabNA").on('click', function (NAType = "networkx") {
    alert();
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
    var NAType = $("#networkEngineNA").val();
    var url;
    var data = {};
    var input_arr = [];
    let sequence = $("#difference_sequence").val().split('-');
    for (let i = 0; i < sequence.length; i++) {
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
    difference(url, data, NAType).then(response => {
        if (NAType == "networkx") {
            render_intersection_diff_graph(data["input"], "difference").then(response => {
                render_intersection_difference(response, "difference_displayer", "difference");
            });
        } else if (NAType == "spark") {
            var arr1 = data["query_list"];
            var arr12 = arr1.reverse();
            arr12.pop();
            var finalArray = arr12.reverse();
            render_intersection_diff_graph(finalArray, "difference").then(response => {
                render_intersection_difference(response, "difference_displayer", "difference");
            });
        }
    });
});

$("#usenetwork").on('click', function () {
    var generator = new IDGenerator();
    var unique_id = generator.generate();
    writedelete(unique_id)
    generateCards_deletion(totalQueries + 1, "deletion", "naCards");

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