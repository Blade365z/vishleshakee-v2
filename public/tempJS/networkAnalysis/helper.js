//API CALLS

// Render Graph  for view
var network_global;
var global_edges;
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
    .done(function(res) {

        $('.analysis_summary_div').empty();
        $('.analysis_summary_div').append('<table> <tr><th>Node</th><th>Score</th></tr>');

        for(var i=0; i<res.length;i++){
            if(src == res[i].id){
                continue;
            }
            $('.analysis_summary_div').append('<tr><td>'+src+'</td><td>'+res[i].id+'</td></tr>');
        }
        $('.analysis_summary_div').append('</table>');

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

    for (var i = 0; i < res.length; i++) {
        if(query_index_label){
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
        }else{
            ed.push({
                from: src,
                to: res[i].id,
               // label: res[i].id,
                width: 10,
                dashes: true,
                color: "black"
            });
        }
    }

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
    console.log(url,data);
    $.ajax({
        url: url,
        type: 'GET',
       // dataType: 'JSON',
        data: data
    })
    .done(function(res) {
        render_community_graph1(data["input"]);
    })
    .fail(function(res) {
        console.log(res);
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

    $('.analysis_summary_div').empty();
    $('.analysis_summary_div').append('<table> <tr><th>Node</th><th>Score</th></tr>');
    for(var i=0; i<res["groups"].length;i++){
        console.log("Iterating");
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
network_global.moveTo(scaleOption);

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

        $('.analysis_summary_div').empty();
        $('.analysis_summary_div').append('<table> <tr><th>Node</th><th>Score</th></tr>');
        for(var i=0; i<res["paths"].length;i++){
            $('.analysis_summary_div').append('<tr><td>'+(i+1)+'</td><td>'+res["paths"]+'</td></tr>');
        }
        $('.analysis_summary_div').append('</table>');


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
        console.log(res);
        console.log("error");
    })
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

    network_global.on('doubleClick', function(properties) {
        if(properties.nodes[0] == null){
        
        }else{
            $("#delete_permission").modal('show');
            $("#permission_granted").click(function() {
               global_edges = delete_node(properties,data);
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

export const union = (url,data) => {
    console.log(data);
    console.log("Printing in the union");
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'JSON',
        data: data
    })
    .done(function(res) {
        console.log(res);
        render_union_graph(data["input"]);
        console.log("Success at php side");
    })
    .fail(function(res) {
        console.log(res);
        console.log("error");
    })
}

export const render_union_graph = (input) => {
    $.ajax({
        url: 'na/union_data_formator',
        type: 'GET',
        dataType: 'JSON',
        data: {
            input: input,
            option: "union",
            inputnetid: input
        }
    })
    .done(function(res) {
        console.log(res);
        render_graph_union(res);
    })
    .fail(function(res) {
        console.log(res);
        console.log("error");
    })
}

export const render_graph_union = (res) => {

    var nodes_arr = res["nodes"];
    var edges_arr = res["edges"];
    var querynodeinfo = res["querynode"];
    var major_array = res["major"];
    var opr_type = res["operation"];


    $('.analysis_summary_div').empty();
    $('.analysis_summary_div').append('<table> <tr><th>Sl. No.</th><th>Color Code</th><th>Network Size</th></tr>');
    console.log("SSS");
    console.log(querynodeinfo);
    for(var i=0; i<querynodeinfo.length;i++){
        let color_code = querynodeinfo[i]["color"];
        let count = i + 1;
        let size_of_each_network = major_array[i].length - 2;
        $('.analysis_summary_div').append('<tr><td>'+count+'</td><td style="background-color:'+querynodeinfo[i]["color"]+'"></td><td>'+size_of_each_network+'</td></tr>');
    }
    $('.analysis_summary_div').append('</table>');


    $('.analysis_summary_div').append('<table> <tr><th>Sl. No.</th><th>Node Name</th><th>Color Code</th></tr>');
    console.log("SSS");
    console.log(querynodeinfo);
    for(var i=0; i<nodes_arr.length;i++){
        let color_code = nodes_arr[i]["color"];
        let count = i + 1;
        $('.analysis_summary_div').append('<tr><td>'+count+'</td><td>'+nodes_arr[i]["id"]+'</td><td style="background-color:'+color_code+'"></td></tr>');
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
        console.log("Making an edge");
    });

    console.log("Check and Mate");
    console.log(network.body.data.nodes);

    var scaleOption = {scale:0.2};
    network_global.moveTo(scaleOption);
    
    //Adding control buttons
    
    network.addEventListener("load", () => {
        network_global.redraw();
    });
}

export const intersection = (url,data) => {
    console.log(data);
    console.log("Printing in the union");
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'JSON',
        data: data
    })
    .done(function(res) {
        console.log(res);
        render_intersection_diff_graph(data["input"],"intersection");
        console.log("Success at php side");
    })
    .fail(function(res) {
        console.log(res);
        console.log("error");
    })
}

export const difference = (url,data) => {
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'JSON',
        data: data
    })
    .done(function(res) {
        console.log(res);
        render_intersection_diff_graph(data["input"], "difference");
        console.log("Success at php side");
    })
    .fail(function(res) {
        console.log(res);
        console.log("error");
    })
}

export const render_intersection_diff_graph = (input,option) => {
    $.ajax({
        url: 'na/formator_inter_diff',
        type: 'GET',
        dataType: 'JSON',
        data: {
            input: input,
            option: option
        }
    })
    .done(function(res) {
        if(option == "intersection"){
            render_intersection_difference(res,"intersection_displayer","intersection");
        }else if(option == "difference"){
            render_intersection_difference(res,"difference_displayer","difference");
        }
    })
    .fail(function(res) {
        console.log(res);
        console.log("error");
    })
}

export const getEdges = () => {
    var edgesArray = []
    $.each(network_global.body.data.edges._data, function(key, val) {
        edgesArray.push(val);
    });
    console.log(edgesArray);
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
        console.log(csv_file);
    }

export const writedelete = (unique_id) => {
    $.ajax({
        url: 'na/writedelete',
        type: 'POST',
        // dataType: 'JSON',
        data: {
            input: JSON.stringify(global_edges),
            uniqueid: unique_id
        },
        beforeSend: function() {

        },
        success: function(data) {

        }
    })
    .fail(function(res) {
        console.log(res);
        console.log("error");
    })

}
 
export const render_intersection_difference = (res,id_value,option) => {
   
        var nodes_arr = res["nodes"];
        var edges_arr = res["edges"];
        var info = res["info"];
        var option = res["option"];
        var edges_to_be_used_while_saving = res["edges_to_be_used_while_saving"];  
  
        $('.analysis_summary_div').empty();
        if(info.length == 0){
            $('.analysis_summary_div').append('<b>No intersecting nodes.</b>');
        }else{
            $('.analysis_summary_div').append('<table> <tr><th>Sl. No.</th><th>Node Name</th><th>Color Code</th></tr>');
            console.log(info);
            if(option == "difference"){
                var color_code = "#5c2480";
            }else{
                var color_code = info[i]["color"];
            }
            for(var i=0; i<info.length;i++){
                let count = i + 1;
                $('.analysis_summary_div').append('<tr><td>'+count+'</td><td>'+ info[i]["nodes"] +'</td><td style="background-color:'+color_code+'"></td></tr>');
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
    
        var binary_ops_option_format = {};
        var network_global = new vis.Network(container, data, binary_ops_option_format);
        
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
    
        // to add edges dynamically
        console.log("Generating Edges Now");
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