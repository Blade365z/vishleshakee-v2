//API CALLS

// Render Graph  for view
export const render_graph = (input,id_value) => {
        alert("In render graph")
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

export const draw_graph = (res,id_value) => {
    console.log(id_value);
    var nodes_arr = res["nodes"];
    var edges_arr = res["edges"];


    console.log(nodes_arr.length);
    console.log(edges_arr.length);



    var nodes = new vis.DataSet();
    var edges = new vis.DataSet();

    // create a network
    //var container = document.getElementsByClassName(id_value);
    var container = document.getElementById("test");

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





    