//API CALLS

// Render Graph  for view
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
    $.ajax({
        url: 'na/link_prediction',
        type: 'GET',
        // dataType: 'JSON',
        data: data
    })
    .done(function(res) {
        console.log(res);
        msg = "SUCCESS: Links Predicted";

        render_linkprediction_graph(input, src_id);
        console.log("Success at php side");
    })
    .fail(function(res) {
        console.log(res);
        console.log("error");
    })
}

export const render_linkprediction_graph = () => {
    $.ajax({
        url: 'na/link_prediction_data_formator',
        type: 'GET',
        dataType: 'JSON',
        data: {
            input: input,
            src: src_id,
        }
    })
    .done(function(res) {
        console.log(res);
        update_view_graph_for_link_prediction(res);
    })
    .fail(function(res) {
        console.log(res);
        console.log("error");
    })
}

export const update_view_graph_for_link_prediction = () => {
    var query_index_label;
    for (i = 0; i < res.length; i++) {
        console.log(res[i].id);
        if (res[i].id == src_id) {
            query_index_label = i;
            network_global.body.data.nodes._data[res[i].id].color = "brown";
            network_global.body.data.nodes._data[res[i].id].size = 40;
        } else {
            console.log("Getting in");
            console.log(res[i]);
            console.log(i);
            network_global.body.data.nodes._data[res[i].id].color = "#ffa500";
            network_global.body.data.nodes._data[res[i].id].size = 40;
        }
    }

    new_array = [];
    $.each(network_global.body.data.nodes._data, function(index, value) {
        new_array.push(value);
    });

    new_array_e = [];
    $.each(network_global.body.data.edges._data, function(index, value) {
        new_array_e.push(value);
    });

    console.log("Printing new array push");
    console.log(new_array_e);

    console.log("PRINTING EDGE");
    console.log(network_global);

    ed = [];
    edges = [];

    for (i = 0; i < res.length; i++) {
        if (res[i].id != res[query_index_label].id) {
            ed.push({
                from: res[query_index_label].id,
                to: res[i].id,
                label: res[i].id,
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

    var network_global = new vis.Network(container, data, global_options);

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



    