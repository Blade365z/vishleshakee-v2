//API CALLS

// Render Graph  for view
var network_global;
export const render_graph = (input,id_value) => {
        
        $.ajax({
            url: 'na/graph_view_data_formator',
            type: 'GET',
            dataType: 'JSON',
            async:true,
            timeout:0,
            data: {
                input: input
            }
        })
        .done(function(res) {
            console.log(res);
            draw_graph(res, id_value);
        })
        .fail(function(res) {
            console.log(res);
            console.log("error");
        })
}

export const linkprediction = (url,data) => {
    console.log("LOGS");
    console.log(data);
    $.ajax({
        url: url,
        type: 'GET',
        data: data
    })
    .done(function(res) {    
        render_linkprediction_graph(data["input"], data["src"]);
    })
    .fail(function(res) {
        console.log("error");
    })
}

export const render_linkprediction_graph = (input,src) => {
    var source = src;
    $.ajax({
        url: 'na/link_prediction_data_formator',
        type: 'GET',
        dataType: 'JSON',
        data: {
            input: input,
            src: source,
        }
    })
    .done(function(res,source) {
        update_view_graph_for_link_prediction(res,src);
    })
    .fail(function(res) {
        console.log(res);
        console.log("error");
    })
}

export const update_view_graph_for_link_prediction = (res,src) => {
    var query_index_label;
    for (var i = 0; i < res.length; i++) {
        console.log(res[i].id);
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

    console.log("Printing new array push");
    console.log(new_array_e);

    console.log("PRINTING EDGE");
    console.log(network_global);

    var ed = [];
    var edges = [];

    console.log(src,query_index_label);
    console.log(src);
    console.log(query_index_label);
    for (var i = 0; i < res.length; i++) {
        if (res[i].id != res[query_index_label].id) {
            ed.push({
                from: res[query_index_label].id,
                to: res[i].id,
               // label: res[i].id,
                width: 10,
                dashes: true,
                color: "black"
            });
        }
    }

    console.log(new_array);
    console.log("Updating new Array");

    network_global.body.data.nodes.update(new_array);
    network_global.body.data.edges.update(ed);
}

export const centrality = (url,data) =>{
    console.log("Printing input and algo_option");
    console.log(url);
    console.log(data);
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'JSON',
        data: data
    })
    .done(function(res) {        
        console.log(res);
        render_centrality_graph(data["input"], "networkDivid");
    })
    .fail(function(res) {
        console.log(res);
        console.log("error");
    })
}

export const render_centrality_graph = (input,id_value) =>{
    $.ajax({
        url: 'na/centrality_data_formator',
        type: 'GET',
        dataType: 'JSON',
        data: {
            input: input
        }
    })
    .done(function(res) {
        console.log(res);
        $('.analysis_summary_div').empty();
        $('.analysis_summary_div').append('<table> <tr><th>Node</th><th>Score</th></tr>');
        for(var i=0; i<res["nodes"].length;i++){
            $('.analysis_summary_div').append('<tr><td>'+res["nodes"][i]["label"]+'</td><td>'+res["nodes"][i]["size"]+'</td></tr>');
        }
        $('.analysis_summary_div').append('</table>');
        draw_graph(res,id_value);
    })
    .fail(function(res) {
        console.log(res);
        console.log("error");
    })
}

export const community_detection = (url,data) =>{
    $.ajax({
        url: url,
        type: 'GET',
        // dataType: 'JSON',
        data: data
    })
    .done(function(res) {
        render_community_graph1(res);
    })
    .fail(function() {
        console.log("error");
    })
} 

export const render_community_graph1 = (input) => {
    $.ajax({
        url: 'na/community_data_formator',
        type: 'GET',
        dataType: 'JSON',
        data: {
            input: input
        }
    })
    .done(function(res) {
        operation_performed = true;
        render_graph_community(res, "networkDivid");
    })
    .fail(function(res) {
        console.log(res);
        console.log("error");
    })
}

export const render_graph_community = (res,id_value) =>{
    var nodes_arr = res["nodes"];
    var edges_arr = res["edges"];
    var groups_arr = res["groups"];


    var newele = $();

    var nodes = new vis.DataSet();
    var edges = new vis.DataSet();

    // create a network
    var container = document.getElementById(id_value);
    var data = {
        nodes: nodes,
        edges: edges
    };

    network = new vis.Network(container, data, community_options);

    network_global_community = network;

    // Community node selection activated 

    network.on('selectNode', function(properties) {

        node_to_be_expanded = properties.nodes;

        var len1 = properties.nodes.length;
        if (len1 >= 2) {
            $("#src_id").val(properties.nodes[len1 - 2]);
            $("#dst_id").val(properties.nodes[len1 - 1]);
        } else {
            $("#src_id").val(properties.nodes[len1 - 1]);
            $("#src_lp_id").val(properties.nodes[len1 - 1]);
        }
    });

    console.log("00000");

    network.focus(1, {
        scale: 1
    });

    // number of nodes
    console.log(nodes_arr.length);
    console.log("Generating Nodes Now");
    console.log(nodes_arr);

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
    
    console.log("Printing the nodes array of COMMUNITY");
    console.log(nodes);

    // to add edges dynamically
    setTimeout(function() {
        console.log("Generating Edges Now");
        $.each(edges_arr, function(index, value) {
            setTimeout(function() {
                edges.add({
                    "from": value.from,
                    "to": value.to,
                    "label": value.label
                });
                console.log("Making an edge");
            }, 10);
        });
    }, 10000);
    
var scaleOption = {scale:0.3};
network.moveTo(scaleOption);

}

export const shortestpaths = (url,data) =>{
console.log("Laila");
console.log(data);
    $.ajax({
        url: url,
        type: 'GET',
        // dataType: 'JSON',
        data: data
    })
    .done(function(res) {
        console.log(res);
        render_shortestpath_graph(data["input"], data["src"], data["dst"]);
   })
    .fail(function(res) {
        console.log(res);
        console.log("error");       
    })
}

export const render_shortestpath_graph = (input, src_id, dst_id) => {
// Render Shortest Path Graph 
    $.ajax({
            url: 'na/shortest_path_data_formator',
            type: 'GET',
            dataType: 'JSON',
            data: {
                input: input,
                src: src_id,
                dst: dst_id
            }
        })
        .done(function(res) {
            console.log("I am printing from update_view_graph");
            console.log(res);
            update_sp_graph(res);
        })
        .fail(function(res) {
            console.log(res);
            console.log("error");
        })
    }

    export const update_sp_graph = (res) =>  {

        console.log(network_global.body.data.nodes._data)


        // Bug exists in shortest path NEED to BE CHECKED 

        for (var i = 1; i <= res["result"].length - 2; i++) {
            if ((res["result"][i] != res["result"][0]) && (res["result"][i] != res["result"][res["result"].length - 1])) {
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


export const draw_graph = (res,id_value) => {
    console.log(id_value);
    var nodes_arr = res["nodes"];
    var edges_arr = res["edges"];


    console.log(nodes_arr.length);
    console.log(edges_arr.length);

    // update in network information division
    $(".nos_of_nodes").empty();
    $(".nos_of_nodes").text(nodes_arr.length);
    $(".nos_of_edges").empty();
    $(".nos_of_edges").text(nodes_arr.length);

    


    var nodes = new vis.DataSet();
    var edges = new vis.DataSet();

    // create a network
    //var container = document.getElementsByClassName(id_value);
    var container = document.getElementById(id_value);

    console.log(container);
    var data = {
        nodes: nodes,
        edges: edges
    };

    var global_options= {};

     network_global = new vis.Network(container, data, global_options);

    console.log(network_global);

    network_global.focus(1, {
        scale: 1
    });

    // number of nodes
    console.log(nodes_arr.length);
    console.log("Generating Nodes Now LOL");


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
        console.log("Making an edge");
    });
    
}



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

export const selected_graph_ids = () => {
    var ids_arr = [];
    ids_arr = $( $('#naCards .col-md-2 .form-check-input:checked')).map(function(){
        return this.id;
    }).get()
    return ids_arr;
}



    