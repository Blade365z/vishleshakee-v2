//API CALLS
//API HEADERS for the http api requests
var HeadersForApi = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
};

import { getquerydictfilename } from './NetworkAnalysis.js';

// Render Graph  for view
var network_global;
var global_edges;
var deletedNodes = [];

function getmystoragedir(){
    let userInfoTemp = JSON.parse(localStorage.getItem('smat.me'));
    let userID = userInfoTemp['id'];
    return userID;
}

export const render_graph = async (url,input) => {
    let dir_name = getmystoragedir();
    let data = {
        input : input,
        dir_name: dir_name 
    }
    let response = await fetch(url,{
        method : 'post',
        headers : HeadersForApi,
        body : JSON.stringify(data),
    });
    
    let output = await response.json();
    return output;
}



export const networkGeneration = async (url,queryTemp,fromDateTemp,toDateTemp,noOfNodesTemp,naTypeTemp,filename) => {

    $("#messagebox").empty();
    $("#messagebox").append('<div class="card text-black m-2" style="background: #f8fa75" id="infopanel"><i id="deleteinfoCard" class="fa fa-window-close text-neg" aria-hidden="true"></i><div class="d-flex justify-content-center text-black font-weight-bold card-body"> Generating your requested network. Please, wait! </div></div>');
    let dir_name = getmystoragedir();
    let data = {
        token : queryTemp,
        fd : fromDateTemp,
        td : toDateTemp,
        noOfNodes : noOfNodesTemp,
        nettype : naTypeTemp,
        filename : filename,
        dir_name : dir_name
    };

    let response = await fetch(url,{
        method : 'post',
        headers : HeadersForApi,
        body : JSON.stringify(data),
    });
    let output = await response.json();
    return output;
}


export const linkprediction = async (url,data,NAType) =>{
    let response = await fetch(url,{
        method : 'post',
        headers: HeadersForApi,
        body : JSON.stringify(data),
    });
    let output = await response.json();
    return output;
}


export const render_linkprediction_graph = async (input,src) => {
    let dir_name = getmystoragedir();
    let source = src;
    let data = {
        input: input,
        src: source,
        dir_name: dir_name
    };
    let response = await fetch('na/link_prediction_data_formator',{
        method : 'post',
        headers: HeadersForApi,
        body : JSON.stringify(data),
    });
    let output = await response.json();
    return output;
}

export const update_view_graph_for_link_prediction = (res,src,k_value) => {

    console.log("LP");
    console.log(res);
    console.log(k_value);
    
    var query_index_label;
    for (var i = 0; (i < res.length); i++) {
        if (res[i].id == src) {
            query_index_label = i;
            network_global.body.data.nodes._data[res[i].id].color = "brown";
            network_global.body.data.nodes._data[res[i].id].size = 40;
        } else {
            network_global.body.data.nodes._data[res[i].id].color = "#ffa500";
            network_global.body.data.nodes._data[res[i].id].size = 40;
        }
    }

    var new_array = [];
    $.each(network_global.body.data.nodes._data, function(index, value) {
        new_array.push(value);
    });

    var new_array_e = [];
    $.each(network_global.body.data.edges._data, function(index, value) {
        new_array_e.push(value);
    });

    var ed = [];
    var edges = [];


    let linkcutoff = 0;
    for (var i = 0;((i < res.length)); i++) {
        if( linkcutoff < k_value){
            if (res[i].id != res[query_index_label].id) {
                ed.push({
                    from: res[query_index_label].id,
                    to: res[i].id,
                    width: 10,
                    dashes: true,
                    color: "red"
                });
                linkcutoff++;
            }
        }
    }


    $('.analysis_summary_div').empty();
    let j = 0;
    for (var i = 0; ((i < res.length) && (j < k_value)); i++) {
        if (src == res[i].id) {
            continue;
        }

        if(src.charAt(0) == "*"){
            src = src.substring(1); 
        }

        if(res[i].id.charAt(0) == "*"){
            res[i].id =  res[i].id.substring(1);
        }

        j++;
        $('.analysis_summary_div').append('<tr><td>'+'<a href="#target" class="click_events">'+ src +'</a>'+'</td><td>' + res[i].id + '</td></tr>');
    }
    $('.analysis_summary_div').append('</table>');

    network_global.body.data.nodes.update(new_array);
    network_global.body.data.edges.update(ed);
}

export const centrality = async (url,data,NAType) =>{
    let response = await fetch(url,{
        method : 'post',
        headers: HeadersForApi,
        body : JSON.stringify(data),
    });

    let output = await response.json();
    return output;
}

export const render_centrality_graph = async (input,id_value,algo_option) =>{
    let dir_name = getmystoragedir();
    let data = {input : input, algo_option : algo_option, dir_name: dir_name};
    let response = await fetch('na/centrality_data_formator',{
        method : 'post',
        headers : HeadersForApi,
        body : JSON.stringify(data),
    });

    let res = await response.json();
    return res;
}

export const community_detection = async (url,data,NAType) =>{
    let response = await fetch(url,{
        method : 'post',
        headers: HeadersForApi,
        body : JSON.stringify(data),
    });

    let output = await response.json();
    return output;
}

export const render_community_graph1 = async (input) => {
    let dir_name = getmystoragedir();
    let data = {
        input : input,
        dir_name : dir_name
    };

    let response = await fetch('na/community_data_formator',{
        method : 'post',
        headers : HeadersForApi,
        body : JSON.stringify(data),
    });

    let output = await response.json();
    return output;
}

export const render_graph_community = (res,id_value) =>{
    var nodes_arr = res["nodes"];
    var edges_arr = res["edges"];

    $('.analysis_summary_div').empty();
    // $('.analysis_summary_div').append('<table> <tr><th>Node</th><th>Score</th></tr>');
    for(var i=0; i<res["groups"].length;i++){
        $('.analysis_summary_div').append('<tr><td>'+(i+1)+'</td><td>'+res["groups"][i]+'</td></tr>');
    }
    $('.analysis_summary_div').append('</table>');
    var nodes = new vis.DataSet();
    var edges = new vis.DataSet();

    // create a network
    var container = document.getElementById(id_value);
    var data = {
        nodes: nodes,
        edges: edges
    };

    network_global = new vis.Network(container, data, community_options);

    // to add node dynamically
    $.each(nodes_arr, function(index, value) {        
        nodes.add({
           "id": value.id,
           "label": value.label,
           "group": value.group,
           "size": 25,
           "font": { size: 25 }
        });
    });
    

    // to add edges dynamically
    setTimeout(function() {
        $.each(edges_arr, function(index, value) {
            setTimeout(function() {
                edges.add({
                    "from": value.from,
                    "to": value.to,
                    "label": value.label
                });
            }, 10);
        });
    }, 10000);
    
var scaleOption = {scale:0.3};
network_global.moveTo(scaleOption);

}

export const node_highlighting = async(input) =>{
    
    network_global.body.data.nodes._data[input].size = 100;
    $.each(network_global.body.data.nodes._data, function(index, value) {
        if (value.id == input) {
            network_global.body.data.nodes._data[input].size = 100;
            network_global.body.data.nodes._data[input].font.size = 150;
        } else {
            network_global.body.data.nodes._data[value.id].size = 25;
            network_global.body.data.nodes._data[value.id].font.size = 25;
        }

    });

    let new_array = [];
    $.each(network_global.body.data.nodes._data, function(index, value) {
        new_array.push(value);
    });
    network_global.body.data.nodes.update(new_array);
}

export const shortestpaths = async (url,data,NAType) =>{
    let response = await fetch(url,{
        method : 'post',
        headers: HeadersForApi,
        body : JSON.stringify(data),
    });

    let output = await response.json();
    return output;
}

export const render_shortestpath_graph = (input, src_id, dst_id) => {
// Render Shortest Path Graph 
    let dir_name = getmystoragedir();
    $.ajax({
            url: 'na/shortest_path_data_formator',
            type: 'GET',
            dataType: 'JSON',
            data: {
                input: input,
                src: src_id,
                dst: dst_id,
                dir_name:dir_name
            }
        })
        .done(function(res) {
            update_sp_graph(res);
        })
        .fail(function(res) {
            console.log("error");
        })
    }

    export const update_sp_graph = (res) =>  {

        $('.analysis_summary_div').empty();
        for(var i=0; i<res["paths"].length;i++){
            $('.analysis_summary_div').append('<tr><td>'+(i+1)+'</td><td>'+res["paths"]+'</td></tr>');
        }
        $('.analysis_summary_div').append('</table>');




        // Bug exists in shortest path NEED to BE CHECKED 

         res["result"] = res["result"].filter(function (el) {
            return el != null;
          });

        for (var i = 1; i <= res["result"].length - 2; i++) {
            if ((res["result"][i] != res["result"][0]) && (res["result"][i] != res["result"][res["result"].length - 1]) && (res["result"][i] != null)) {
                network_global.body.data.nodes._data[res["result"][i]].color = "#ffa500";
                network_global.body.data.nodes._data[res["result"][i]].size = 100;
            } else {
                network_global.body.data.nodes._data[res["result"][i]].color = "#307CE9";
                network_global.body.data.nodes._data[res["result"][i]].size = 25;
            }
        }

        $.each(network_global.body.data.nodes._data, function(index, value) {
            if (!res["result"].includes(value.id)) {
                value.color = "#307CE9";
                value.size = 25;
            }
        });

        network_global.body.data.nodes._data[res["result"][res["result"].length - 1]].color = "brown";
        network_global.body.data.nodes._data[res["result"][res["result"].length - 1]].size = 100;

        network_global.body.data.nodes._data[res["result"][0]].color = "brown";
        network_global.body.data.nodes._data[res["result"][0]].size = 100;

        var new_array = [];
        $.each(network_global.body.data.nodes._data, function(index, value) {
            new_array.push(value);
        });

        var new_array_e = [];
        $.each(network_global.body.data.edges._data, function(index, value) {
            new_array_e.push(value);
        });

        // Set all edges witdhs to a normal
        for (var i = 0; i < new_array_e.length; i++) {
            var identity = new_array_e[i].id;
            for (var j = 0; j < res["result"].length; j++) {
                network_global.body.data.edges._data[identity].width = 0.5;
            }
        }

        // Update the width of path 
        for (var i = 0; i < new_array_e.length; i++) {
            var identity = new_array_e[i].id;
            for (j = 0; j < res["result"].length; j++) {
                if (((new_array_e[i].from == res["result"][j]) && (new_array_e[i].to == res["result"][j + 1])) || ((new_array_e[i].from == res["result"][j + 1]) && (new_array_e[i].to == res["result"][j]))) {
                    network_global.body.data.edges._data[identity].width = 35;
                }
            }

        }

        var new_array_e1 = [];
        $.each(network_global.body.data.edges._data, function(index, value) {
            new_array_e1.push(value);
        });

        network_global.body.data.nodes.update(new_array);
        network_global.body.data.edges.update(new_array_e1);

    var scaleOption = {scale:0.3};
    network_global.moveTo(scaleOption);

    }

export const expansion = (node,hops) => {
    $.ajax({
        // url: 'network_analysis/expansion',
        url: 'network_analysis/expansion_on_demand',
        type: 'POST',
        // dataType: 'JSON',
        dataType: 'JSON',
        data: {
            input: JSON.stringify(global_edges),
            uniqueid: unique_id,
            clicked_node: node_to_be_expanded[0],
            input: query,
            fromdate: fd,
            todate: td,
            network_choice: global_network_type_selected,
            hop_limit: hop_limit,
            hop_count: hop_count,
            limit: limit_value,
            select_framework_val: select_framework_val

        },
        beforeSend: function() {
        },
        success: function(data) {

       }
    })
    .fail(function(res) {
    })
}

export const draw_graph = (res,id_value) => {
    var nodes_arr = res["nodes"];
    var edges_arr = res["edges"];



    // update in network information division
    $(".nos_of_nodes").empty();
    $(".nos_of_nodes").text(nodes_arr.length);
    $(".nos_of_edges").empty();
    $(".nos_of_edges").text(edges_arr.length);

    $('.analysis_summary_div').html('');
    $('.analysis_summary_div').append('<table class="table">  <thead> <tr><th>Node</th></tr>  </thead> <tbody id="tableBody"> </tbody></table>');
    for (var i = 0; i < nodes_arr.length; i++) {
        $('#tableBody').append('<tr><td>'+'<a href="#target" class="click_events">'+ nodes_arr[i].label +'</a>'+ '</td></tr>');
    }


    var nodes = new vis.DataSet();
    var edges = new vis.DataSet();

    // create a network
    //var container = document.getElementsByClassName(id_value);
    var container = document.getElementById(id_value);

    var data = {
        nodes: nodes,
        edges: edges
    };

    network_global = new vis.Network(container, data, global_options);
    

    network_global.focus(1, {
        scale: 1
    });

    // number of nodes

    // to add node dynamically
    $.each(nodes_arr, function(index, value) {
        nodes.add({
            "id": value.id,
            "label": value.label,
            "shape": value.shape,
            "image": value.image,
            "size": value.size,
            "borderWidth": value.borderwidth,
            "border": value.border,
            "color":{
                background: '#FFFFFF'
            },
            "font": {
                "size": 30
            }
        });
    });


    // to add edges dynamically
    $.each(edges_arr, function(index, value) {
        setTimeout(function() {
            edges.add({
                "from": value.from,
                "to": value.to,
                "label": value.label
            });

        }, 10);
    });

    network_global.on('doubleClick', function(properties) {
        if(properties.nodes[0] == null){
        
        }else{
            $("#delete_permission").modal('show');
            $("#permission_granted").click(function() {
               global_edges = delete_node(properties,data);
               if(!deletedNodes.includes(properties.nodes[0])){
                deletedNodes.push(properties.nodes[0]);
               }
            });
        }
    });

    var scaleOption = {scale:0.3};
    network_global.moveTo(scaleOption);
}

export const delete_node = (properties, data) => {

    let selected_node = properties.nodes[0];
    data.nodes.remove([selected_node]);

    var nodesArray = [];
    var edgesArray = [];
    var updated_edges = [];

    $.each(data.nodes._data, function(key, val) {
        nodesArray.push(val["id"]);
    });

    $.each(network_global.body.data.edges._data, function(key, val) {
        edgesArray.push(val);
    });

    for (var i = 0; i < nodesArray.length; i++) {
        if (edgesArray[i].from != selected_node && edgesArray.to != selected_node) {
            updated_edges.push(edgesArray[i]);
        }
    }
    return updated_edges;
}

export const selected_graph_ids = () => {
    var ids_arr = [];
    ids_arr = $( $('#naCards .col-md-2 .form-check-input:checked')).map(function(){
        return this.id;
    }).get()
    return ids_arr;
}

export const selected_graph_query = () => {
    var ids_arr = [];
    ids_arr = $( $('#naCards .col-md-2 .form-check-input:checked')).map(function(){
        return this.query;
    }).get()
    return ids_arr;
}

export const union = async (url,data,NAType) => {
    let response = await fetch(url,{
        method : 'post',
        headers : HeadersForApi,
        body : JSON.stringify(data),
    });

    let output = await response.json();
    return output;
}

export const render_union_graph = async (input) => {
    let dir_name = getmystoragedir();
    let data = {
        input: input,
        option: "union",
        inputnetid: input,
        dir_name : dir_name
    }
    let response = await fetch('na/union_data_formator',{
        method : 'post',
        headers : HeadersForApi,
        body: JSON.stringify(data),
    });

    let output = await response.json();
    return output;
}

export const getDeletedNodes = async () => {
    let sentence;
    for(let i=0; i<deletedNodes.length; i++){
        if(i==0){
            sentence = deletedNodes[i];
        }else{
            sentence = sentence +","+ deletedNodes[i];
        }
    }
    return sentence;
}

export const render_graph_union = (res) => {
    var nodes_arr = res["nodes"];
    var edges_arr = res["edges"];
    var querynodeinfo = res["querynode"];
    var major_array = res["major"];
    var opr_type = res["operation"];

    $(".nos_of_nodes").empty();
    $(".nos_of_nodes").text(nodes_arr.length);
    $(".nos_of_edges").empty();
    $(".nos_of_edges").text(edges_arr.length);


    let wellformedquery; 
    let selectedGraphs = selected_graph_ids();
    let querydictfilename = getquerydictfilename();

    $('.analysis_summary_div').empty();
    $('.analysis_summary_div').append('<table> <tr><th>Network Name</th><th>Network Size</th><th>Color Code</th></tr>');
    for(var i=0; i<querynodeinfo.length;i++){
        let color_code = querynodeinfo[i]["color"];
        let count = i + 1;
        let size_of_each_network = major_array[i].length - 2;
        $('.analysis_summary_div').append('<tr><td>'+ querydictfilename[selectedGraphs[i]] +'</td><td>'+size_of_each_network+'</td><td style="background-color:'+querynodeinfo[i]["color"]+';width:100%"></td></tr>');
    }
    $('.analysis_summary_div').append('</table>');


    $('.analysis_summary_div').append('<table> <tr><th>Node Name</th><th>Color Code</th></tr>');
    for(var i=0; i<nodes_arr.length;i++){
        let color_code = nodes_arr[i]["color"];
        let count = i + 1;
        $('.analysis_summary_div').append('<tr><td>'+'<a href="#target" class="click_events">'+nodes_arr[i]["id"]+'</a>'+'</td><td style="background-color:'+color_code+';width:100%"></td></tr>');
    }
    $('.analysis_summary_div').append('</table>');



    // Roshan Testing here 

    var nodes = new vis.DataSet();
    var edges = new vis.DataSet();

    // create a network
    var container = document.getElementById("union_displayer");
    var data = {
        nodes: nodes,
        edges: edges
    };

    network_global = new vis.Network(container, data, global_options);
    // network_global_union = network;


    network_global.focus(1, {
        scale: 1
    });


    // to add node dynamically
    $.each(nodes_arr, function(index, value) {    
        nodes.add({
            "id": value.id,
            "label": value.label,
            "group": value.group,
            "color": value.color,
            "size": 25,
            "font": { "size": 25 }
         });
    });

    // to add edges dynamically
    $.each(edges_arr, function(index, value) {
        setTimeout(function() {
            edges.add({
                "from": value.from,
                "to": value.to,
                "label": value.label
            });

        }, 10);
    });

    global_edges = edges_arr;
    
    var scaleOption = {scale:0.2};
    network_global.moveTo(scaleOption);
    
    //Adding control buttons
}

export const intersection = async (url,data,NAType) => {
    let response = await fetch(url,{
        method : 'post',
        headers : HeadersForApi,
        body : JSON.stringify(data),
    });
    let output = await response.json();
    return output;
}

export const getUserDetailsNA = async (id) => {
    let response = await fetch('UA/getUserDetailsTemp', {
        method: 'post',
        headers: HeadersForApi,
        body: JSON.stringify({
            userID: id
        })
    });
    let data = await response.json()
    return data;
}

export const difference = async (url,data,NAType) => {
    let response = await fetch(url,{
        method : 'post',
        headers : HeadersForApi,
        body : JSON.stringify(data),
    });
    let output = await response.json();
    return output;
}

export const render_intersection_diff_graph = async (input,option) => {
    let dir_name = getmystoragedir();
    let data = {
        input : input,
        option : option,
        dir_name : dir_name
    }

    let response = await fetch('na/formator_inter_diff',{
        method : 'post',
        headers : HeadersForApi,
        body: JSON.stringify(data),
    });

    let output = await response.json();
    return output;
}

export const getEdges = () => {
    var edgesArray = []
    $.each(network_global.body.data.edges._data, function(key, val) {
        edgesArray.push(val);
    });
    return edgesArray;
}

export const exportnetwork = () => {
        global_edges = getEdges();
        let csvContent = "data:text/csv;charset=utf-8,";
        var csv_file = 'from,to,count\n';
        var universalBOM = "\uFEFF";
        if (!global_edges) {
            return;
        }
    
        global_edges.forEach(function(rowArray) {
            var fruits = [];
            fruits.push(rowArray.from);
            fruits.push(rowArray.to);
            fruits.push(rowArray.label);
            let row = fruits.join(",");
            csv_file += row + "\r\n";
        });
    
        var encodedUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(universalBOM + csv_file);
        window.open(encodedUri);
    }

export const writedelete = (unique_id) => {
    let dir_name = getmystoragedir();
    $.ajax({
        url: 'na/writedelete',
        type: 'POST',
        dataType: 'JSON',
        data: {
            input: JSON.stringify(global_edges),
            uniqueid: unique_id,
            dir_name : dir_name
        },
        beforeSend: function() {

        },
        success: function(data) {

        }
    })
    .fail(function(res) {
        console.log(res);
    })

}

export const sparkUpload = (filename_arr) =>{
    let dir_name = getmystoragedir();
        $.ajax({
                url: 'na/fileUploadRequest',
                type: 'GET',
                dataType: 'JSON',
                data: {
                    filename_arr: filename_arr,
                    dir_name : dir_name
                }
            })
            .done(function(res) {
            })
}

export const checkStatus = (id,unique_name_timestamp) =>{
        let dir_name = getmystoragedir();
        $.ajax({
                url: 'na/getStatusFromSpark',
                type: 'GET',
                data: {
                    id: id,
                    dir_name : dir_name
                },
                dataType: 'json'
            })
            .done(function(res) {
                // when the status is not "success" or "dead" , check status until it would become "success", when it success write the json file
                if ((res['status'] != 'success') && (res['status'] != 'dead')) {
                    setTimeout(function() {
                        checkStatus(res['id'], unique_name_timestamp);
                    }, 30000);
                } else if (res['status'] == 'success') {
                    getOuputFromSparkAndStoreAsJSON(res['id'], unique_name_timestamp);
                }
            });
}

export const getOuputFromSparkAndStoreAsJSON = (id,unique_name_timestamp) =>{
    let dir_name = getmystoragedir();
    $.ajax({
        url: 'na/getOuputFromSparkAndStoreAsJSON',
        type: 'GET',
        data: {
            id: id,
            filename: unique_name_timestamp,
            dir_name : dir_name
        },
        dataType: 'json'
    })
    .done(function(res) {
    });
}


export const render_intersection_difference = (res,id_value,option) => {
   
        var nodes_arr = res["nodes"];
        var edges_arr = res["edges"];
        var info = res["info"];
        var option = res["option"];
        var edges_to_be_used_while_saving = res["edges_to_be_used_while_saving"];  

        console.log(edges_arr);

        var filteredEdges = [];

        let informationARR = [];
        $.each(info, function(index,value){
            informationARR.push(value.nodes);
        })

        $.each(edges_arr, function(index, value) {
            if(informationARR.includes(value.from) && informationARR.includes(value.to)){
                filteredEdges.push({
                    "from": value.from,
                    "to": value.to,
                    "label": value.label
                })
            }
        });

        global_edges = filteredEdges;
        console.log("INFO");
        console.log(info);

        console.log("GLOBAL");
        console.log(global_edges);
        

        $(".nos_of_nodes").empty();
        $(".nos_of_nodes").text(nodes_arr.length);
        $(".nos_of_edges").empty();
        $(".nos_of_edges").text(edges_arr.length);
  
        $('.analysis_summary_div').empty();
        if(info.length == 0){
            $('.analysis_summary_div').append('<b>No intersecting nodes.</b>');
        }else{
            $('.analysis_summary_div').append('<table> <tr><th>Node Name</th><th>Color Code</th></tr>');
            if(option == "difference"){
                var color_code = "#5c2480";
            }else{
                var color_code = "#F20000";
            }
            for(var i=0; i<info.length;i++){
                let count = i + 1;
                $('.analysis_summary_div').append('<tr><td>'+'<a href="#target" class="click_events">'+ info[i]["nodes"] +'</a>'+'</td><td style="background-color:'+color_code+';width:100%"></td></tr>');
            }
            $('.analysis_summary_div').append('</table>');
        }      
    
        var nodes = new vis.DataSet();
        var edges = new vis.DataSet();
    
        // create a network
        var container = document.getElementById(id_value);
        var data = {
            nodes: nodes,
            edges: edges
        };
    
        network_global = new vis.Network(container, data, binary_ops_option_format);
        
        network_global.focus(1, {
            scale: 1
        });
    
        // to add node dynamically
        $.each(nodes_arr, function(index, value) {  
                    nodes.add({
                    "id": value.id,
                    "label": value.label,
                    "group": value.group,
                    "color": value.color,
                    "shape": "dot",
                    "size": 25,
                    "font": { "size": 25 }
                });
        });
    
        $.each(edges_arr, function(index, value) {
            setTimeout(function() {
                edges.add({
                    "from": value.from,
                    "to": value.to,
                    "label": value.label
                });
    
            }, 10);
        });
    
    
        // assigning edges to global_edges:
        // global_edges = edges;
        function on_stabilize_hide_loader() {
            $("#network_loader_id").empty();
        }
    
        // clear user_defined_sequence
        
        var scaleOption = {scale:0.2};
        network_global.moveTo(scaleOption);
    
    }

    export const get_network = () => {
        return network_global;
    }
    
    /*********************OPTIONS FOR NETWORKS******************** */
    /*                                                            */
    /*********************************************************** */

    // Options format for binary operations:
var binary_ops_option_format = {
    nodes: {
        shape: 'dot',
        size: 25,
        scaling: {
            min: 10,
            max: 30
        },
        font: {
            size: 10
        },
        borderWidth: 1,
    },
    edges: {
        color: {
            inherit: true,
            color: '#fcba03'
        },
        length: 2000,
        width: 0.15,
        smooth: {
            type: 'continuous'
        }
    },
    interaction: {
        hideEdgesOnDrag: true,
        tooltipDelay: 200,
        navigationButtons: true,
        keyboard: true
    },
    physics: true,
    layout: {
        improvedLayout: false,
        randomSeed: 191006
    }

};


// Option format for global edges
var global_options = {
    nodes: {
        shape: 'dot',
        color: '',
        size: 30,
        scaling: {
            min: 10,
            max: 30
        },
        font: {
            size: 30,
            face: 'courier'
        },
        borderWidth: 1,
        // shadow: true
    },
    edges: {
        color: '#97C2FC',
        length: 700,
        width: 0.15,
        smooth: {
            type: 'continuous'
        },
        hoverWidth: 10
            // shadow: true
    },
    interaction: {
        hideEdgesOnDrag: true,
        hover: true,
        tooltipDelay: 100,
        multiselect: true,
        navigationButtons: true,
        keyboard: true
    },
    physics: true,
    layout: {
        improvedLayout: false,
        randomSeed: 191006
    }
};

// Options format for link prediction and shortest path 
var options_link_shortestpath = {
    edges: {
        length: 500,
        chosen: false,
        font: {
            size: 25,

        },
        color: {
            color: 'green',
            highlight: '#FF5733',
            hover: 'blue',
            inherit: 'to',
            opacity: 1.0
        }
    },
    nodes: {
        shape: 'dot',
        color: '#ED5565',
        fixed: false,
        size: 50,

        font: {
            size: 18,
            color: '#2C3E50',
            align: 'center'
        },
        borderWidth: 2
    },
};

// Option format for centrality:
var centrality_options = {
    nodes: {
        shape: 'dot',
        color: '#307CE9',
        scaling: {
            min: 10,
            max: 30
        },
        font: {
            size: 30,
            face: 'courier'
        },
        borderWidth: 1,
        shadow: true
    },
    edges: {
        color: {
            inherit: true,
            color: '#e5e4e2',
            highlight: '#9B59B6',
        },
        font: {
            size: 10
        },
        length: 1500,
        width: 0.15,
        smooth: {
            type: 'continuous'
        },
        hoverWidth: 10
    },
    interaction: {
        hideEdgesOnDrag: true,
        hover: true,
        tooltipDelay: 100,
        navigationButtons: true,
        keyboard: true
    },

    physics: true,

    layout: {
        improvedLayout: false,
        randomSeed: 191006
    }

};
/** Option for community detection */
var community_options = {
    nodes: {
        shape: 'dot',
        scaling: {
            min: 10,
            max: 30
        },
        font: {
            size: 30,
            face: 'courier'
        },
        borderWidth: 1,
        // shadow: true
    },

    // This groups section is being added by Roshan
    // for community detection
    groups: {
        1: {
            color: 'red',
        },
        2: {
            color: 'yellow',
        },
        3: {
            color: 'green',
        },
        4: {
            color: 'brown',
        },
        5: {
            color: 'black',
        },
        6: {
            color: 'blue',
        },
        7: {
            color: 'pink',
        },
        8: {
            color: 'purple',
        },
        9: {
            color: 'orange'
        }
    },
    edges: {
        color: '#CBC8C8',
        length: 1500,
        width: 0.15,
        smooth: {
            type: 'continuous'
        },
        hoverWidth: 10
    },
    interaction: {
        hideEdgesOnDrag: true,
        hover: true,
        tooltipDelay: 100,
        navigationButtons: true,
        keyboard: true
    },

    physics: true,

    layout: {
        improvedLayout: false,
        randomSeed: 191006
    }

};



export const storeResultofSparkFromController = async (sparkID, query_list ,userID) => {
    let dir_name = getmystoragedir();
    let dataArgs = JSON.stringify({
        id: sparkID,
        dir_name : dir_name,
        query_list,
        userID
    });

    let response = await fetch('na/getFromSparkAndStore', {
        method: 'post',
        headers: HeadersForApi,
        body: dataArgs,
    });
    let output = await response.json();
    return output;
}
