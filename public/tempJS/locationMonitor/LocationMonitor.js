// import {wordCloudLM} from './chartHelper.js';
import { get_current_time, getTweetIdList, getHashtag,getTopHashtag} from './helper.js';
import { TweetsGenerator } from '../utilitiesJS/TweetGenerator.js';


var hashtag_info,global_tweetid_list;
var interval = 60;
var global_datetime = get_current_time(interval);
var markersList = document.getElementById('markersList');
L.MarkerCluster.include({
    spiderfy: function () {
        var childMarkers = this.getAllChildMarkers();
        this._group._unspiderfy();
        this._group._spiderfied = this;

        markersList.innerHTML = childMarkers
            .map((marker, index) => `<li class="litems">${marker._popup._content}</li>`)
            .join('');
        // Show the modal.
        modal.classList.add("show-modal");
    },
    unspiderfy: function () {
        this._group._spiderfied = null;
        // Hide the modal.
        modal.classList.remove("show-modal");
    }
});
var attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
var tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var tiles = L.tileLayer.grayscale(tileUrl, {
    attribution
});
var glow = new L.LayerGroup();
var WCmarker = new L.LayerGroup();


var LM_Map = L.map('lmMap', {
    fullscreenControl: true,
    fullscreenControlOptions: {
        position: 'topleft'
    },
    center: [21.1458, 79.0882],
    zoom: 5,
    layers: [tiles, WCmarker, glow]
});
var markerCluster = L.markerClusterGroup({
    iconCreateFunction: function (cluster) {
        return new L.DivIcon({
            html: '<div class="icon-wrapper"><b>' +
                cluster.getChildCount() +
                "</b></div>",
            className: "icon",
            iconSize: L.point(49, 49)
        });
    }
}),
    group1 = L.featureGroup.subGroup(markerCluster), // use `L.featureGroup.subGroup(parentGroup)` instead of `L.featureGroup()` or `L.layerGroup()`!    
    control = L.control.layers(null, null, {
        collapsed: false
    });
markerCluster.addTo(LM_Map);

var tweetIcon = L.icon({
    iconUrl: 'public/icons/twitter.png',
    iconSize: [35, 35] // size of the icon
});

var HashtagIcon = L.icon({
    iconUrl: 'public/icons/hash.png',
    iconSize: [65, 65] // size of the icon
});



var modal = document.querySelector(".modal_lm");
var closeButton = document.querySelector(".close-button");



closeButton.addEventListener("click", closeModal);

function closeModal() {
    // Use the unspiderfy method so that internal state is updated.
    markerCluster.unspiderfy();
}

function windowOnClick(event) {
    if (event.target === modal) {
        closeModal();
    }
}



jQuery(function () {




    trigger();

    $('#submit-btn').on('click', function (e) {
        trigger();
    });

    $('.nav-item ').removeClass('smat-nav-active');
    $('#nav-LM').addClass('smat-nav-active');

    $('#lmInputs').on('submit', function (e) {
        e.preventDefault();
        let LocTemp = $('#queryLM').val();
        $('.currentSearch').text(LocTemp);
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $("#lmPanel").offset().top
        }, 200);

    });

    $('#locationTweets').on('click', function () {
        ///Amitabh
        console.log(global_tweetid_list);
        let to = global_datetime[1];
         let from = global_datetime[0];
         let   place = "^" + $("#queryLM").val();
        $('#tweetsModal').modal('show');
        TweetsGenerator(global_tweetid_list, 6, 'tweets-modal-div', null, null, 'all');

    });

});




function trigger() {
    var from_datetime,
        to_datetime,
        refresh_type = $("#lmTefreshType").val(),
        timeLimit = $("#lmInterval :selected").val(),
        place = "^" + $("#queryLM").val();

    localStorage.setItem("lmTefreshType", "manual");

    if (timeLimit == "1 Minute") {
        interval = 60;
    }

    else if (timeLimit == "15 Minutes") {
        interval = 900;
    }

    else if (timeLimit == "1 Hour") {
        interval = 3600;
    }

    // console.log(interval+"   "+place+"  ");    

    // console.log(global_datetime);
    to_datetime = global_datetime[1];
    from_datetime = global_datetime[0];

    if (refresh_type == "Manual Refresh") {
        for (var i = 0; i < 10000; i++) {
            clearInterval(i);
        }

        getTweetIdList(from_datetime, to_datetime, place,"tweet_id").then(response => {
            global_tweetid_list = response;
            console.log(global_tweetid_list);
            
        });

        

        getTopHashtag(from_datetime, to_datetime, place).then(response_2 => {
            // console.log(response_2["top_data_with_cat_by_location"]);
            getHashtag(from_datetime, to_datetime, place).then(response =>{
                plotHashtags(response,response_2["top_data_with_cat_by_location"]);
                
            });
            
        });
        
        getTweetIdList(from_datetime, to_datetime, place,"tweet_info").then(response => {
            rander_map(response);
        });

        
    }

    else if (refresh_type == "Auto Refresh") {
        for (var i = 0; i < 10000; i++) {
            clearInterval(i);
        }
        setInterval(function () {
            var interval_,

                from_datetime_,
                to_datetime_,

                timeLimit_ = $("#lmInterval :selected").val(),
                place_ = "^" + $("#queryLM").val();



            if (timeLimit_ == "1 Minute") {
                interval_ = 60;
            }

            else if (timeLimit_ == "15 Minutes") {
                interval_ = 900;
            }

            else if (timeLimit_ == "1 Hour") {
                interval_ = 3600;
            }


            global_datetime_ = get_current_time(interval_);

            to_datetime_ = global_datetime_[1];
            from_datetime_ = global_datetime_[0];

            getTweetIdList(from_datetime, to_datetime, place,"tweet_id").then(response => {
                global_tweetid_list = response;});
    
            getHashtag(from_datetime, to_datetime, place).then(response =>{
                plotHashtags(response);});
            
            getTweetIdList(from_datetime, to_datetime, place,"tweet_info").then(response => {
                rander_map(response);});
        }, 60000);

    }
}


const rander_map = (data) => {
    group1.clearLayers();
    
    if (data.length == 0) {
        alert("Can't find the location");
    }

    if (data[0]["sentiment"]["value"] == "2") {
        LM_Map.setView([parseFloat(data[0]["Latitude"]), parseFloat(data[0]["Longitude"])], 4);
    } else if (data[0]["sentiment"]["value"] == "1") {
        LM_Map.setView([parseFloat(data[0]["Latitude"]), parseFloat(data[0]["Longitude"])], 6);
    } else if (data[0]["sentiment"]["value"] == "0") {
        LM_Map.setView([parseFloat(data[0]["Latitude"]), parseFloat(data[0]["Longitude"])], 9);
    }

    for (var i = 0; i < data.length; i++) {
        //   var dat = { lat: op[i].Latitude , lng: op[i].Longitude , count: 1};
        //   heatmapLayer.addData(dat);
        if (data[i]["Latitude"] != null) {


            var senti = data[i]["sentiment"]["value"];
            if (senti == "0") {

                L.marker([parseFloat(data[i]["Latitude"]), parseFloat(data[i]["Longitude"])], {
                    icon: tweetIcon
                }).bindPopup("<div class='border-bottom'><b>" + data[i]["author"] + "</b> : @" + data[i]["author_screen_name"] + " " + "<img style= 'border-radius: 50%; width:10px;height:10px;' src='public/icons/yellow.png'> <br>" + data[i]["tweet"] + "</div>").addTo(group1);
            } else if (senti == "1") {

                L.marker([parseFloat(data[i]["Latitude"]), parseFloat(data[i]["Longitude"])], {
                    icon: tweetIcon
                }).bindPopup("<div class='border-bottom'><b>" + data[i]["author"] + "</b> : @" + data[i]["author_screen_name"] + " " + "<img style= 'border-radius: 50%; width:10px;height:10px;' src='public/icons/red.png'> <br>" + data[i]["tweet"] + "</div>").addTo(group1);
            } else if (senti == "2") {

                L.marker([parseFloat(data[i]["Latitude"]), parseFloat(data[i]["Longitude"])], {
                    icon: tweetIcon
                }).bindPopup("<div class='border-bottom'><b>" + data[i]["author"] + "</b> : @" + data[i]["author_screen_name"] + " " + "<img style= 'border-radius: 50%; width:10px;height:10px;' src='public/icons/green.png'> <br>" + data[i]["tweet"] + "</div>").addTo(group1);
            }
            group1.addTo(LM_Map);
        }
    }







}


const plotHashtags = (data,data_2) => {

    glow.clearLayers();

    var hashtag_data = data;
    // console.log(data);

    var normalIcon = L.icon.pulse({
        iconSize: [10, 10],
        color: '#297eb4',
        fillColor: '#297eb4'
    });
    var SecurityIcon = L.icon.pulse({
        iconSize: [10, 10],
        color: '#3d3d3d',
        fillColor: '#3d3d3d'
    });
    var CommunalIcon = L.icon.pulse({
        iconSize: [10, 10],
        color: '#ff0055',
        fillColor: '#ff0055'
    });
    var SCIcon = L.icon.pulse({
        iconSize: [10, 10],
        color: '#2e7eb4',
        fillColor: '#2e7eb4'
    });
    wordCloudLM(hashtag_data["hash_lat_lng_total_cat_info_arr"], 'trendingLM',data_2);

    $.each(hashtag_data['lat_lng_hash_arr'], function (v, c) {
        var lat = v.split("_")[0],
            lng = v.split("_")[1];

        var category_array = [],
            mainIcon,
            l_str = '',
            hashtags_div = '',
            country = hashtag_data['lat_lng_info_arr'][v][0].split("^")[1],
            state = hashtag_data['lat_lng_info_arr'][v][1].split("^")[1],
            city = hashtag_data['lat_lng_info_arr'][v][2].split("^")[1];

        if (state != 'dummy state') {
            l_str += '<button type="button" class="button1 border-right"  id="location_button" value="' + state + '">' + state + '</button>';
        }

        if (city != 'dummy city') {
            l_str += '<button type="button" class="button1 border-right"  id="location_button" value="' + city + '">' + city + '</button>';
        }

        if (country != 'dummy country') {
            l_str += '<button type="button" class="button1 border-right"  id="location_button" value="' + country + '">' + country + '</country>';
        }


        hashtag_data["lat_lng_hash_arr"][v].forEach(function (f) {

            var hashtag_color,
                l = hashtag_data["hash_lat_lng_total_cat_info_arr"][f][v].slice(1);
            category_array.push(l);
            const indexOfMax = l.indexOf(Math.max(...l));
            if (indexOfMax == 0) { hashtag_color = '#ff0055'; }
            else if (indexOfMax == 1) { hashtag_color = '#3d3d3d'; }
            else if (indexOfMax == 2) { hashtag_color = '#2e7eb4'; }
            else if (indexOfMax == 3) { hashtag_color = '#297eb4'; }
            hashtags_div += '<button class="sensitive_class border-right" style="color:' + hashtag_color + '; background: none; border: none;">' + f + '</button>';

        });

        var result = category_array.reduce((r, a) => a.map((b, i) => (r[i] || 0) + b), []);

        const mainIconValue = result.indexOf(Math.max(...result));
        if (mainIconValue == 0) { mainIcon = CommunalIcon; }
        else if (mainIconValue == 1) { mainIcon = SecurityIcon; }
        else if (mainIconValue == 2) { mainIcon = SCIcon; }
        else if (mainIconValue == 3) { mainIcon = normalIcon; }


        hashtags_div += "</p>";


        var div_style = `<div class="row">
                                <div class="col">
                                    <div class="row">
                                        <div class="row" style=" display: inline-block; position: relative; margin-left: 5px; margin-right: 5px;" >
                                        `+ hashtags_div;

        div_style += `</div>
                                    </div>
                                    <div class="row">
                                        <div class="col">
                                            ` + l_str + `
                                        </div>
                                    </div>
                                </div>
                            </div>`;

        L.marker([lat, lng], {
            'icon': mainIcon
        }).bindPopup(div_style).addTo(glow).openTooltip();
    });



}

const wordcloudPlot = (data_, hashtag) => {

    WCmarker.clearLayers();
    $.each(data_[hashtag], function (v, c) {
        var lat = v.split("_")[0],
            lng = v.split("_")[1];
        console.log(lat);

        L.marker([lat, lng], {
            'icon': HashtagIcon
        }).addTo(WCmarker);

    });
}

const wordCloudLM = (hashtag_latlng, div,response) => {
    am4core.useTheme(am4themes_animated);
    // Themes end

    var chart = am4core.create(div, am4plugins_wordCloud.WordCloud);
    chart.fontFamily = "Courier New";
    var series = chart.series.push(new am4plugins_wordCloud.WordCloudSeries());
    series.randomness = 0.1;
    series.rotationThreshold = 0.5;

    var data = [{ 'token': '#50DaysForSRKDay', 'count': 2344, 'color': '#297EB4' },
    { 'token': '#SushantSinghRajput', 'count': 2344, 'color': '#297EB4' },
    { 'token': '#coronavirus', 'count': 1244, 'color': '#FF00FF' },
    { 'token': '#bantiktok', 'count': 4544, 'color': '#297EB4' },
    { 'token': '#iitguwahati', 'count': 1244, 'color': '#3D3D3D' },
    { 'token': '#covid19', 'count': 4244, 'color': '#FF00FF' },
    { 'token': '#IndiaWantsCBIInvestigation', 'count': 3344, 'color': '#3D3D3D' },
    { 'token': '#hello123', 'count': 832, 'color': '#FF00FF' },
    { 'token': '#python', 'count': 1232, 'color': '#3D3D3D' },
    { 'token': '#indiavschina', 'count': 1111, 'color': '#3D3D3D' },
        , { 'token': '#iitguwahati', 'count': 2244, 'color': '#3D3D3D' },
    { 'token': '#TIKTOK', 'count': 2211, 'color': '#FF00FF' },
    { 'token': '#SSR', 'count': 2013, 'color': '#3D3D3D' },
    { 'token': '#galwanValley', 'count': 832, 'color': '#FF00FF' },
    { 'token': '#IndianArmy', 'count': 1922, 'color': '#3D3D3D' },
    { 'token': '#indiavschina', 'count': 1711, 'color': '#3D3D3D' },
    ]


    var dataformat = [];
    $.each(response, function (v, c) {
        console.log(v);
        console.log(c[0]);
        let token = v;
        let count = c[0];
        let color;
        if(c[1]=='normal'){color ="#2e7eb4" }
        else if(c[1]=='com'){color ="#f30155" }
        else if(c[1]=='sec'){color = "#3d3d3d"}
        else if(c[1]=='com_sec'){color = "#2e7eb4"}
        
        dataformat.push({
            tag: token,
            count: count,
            "color": am4core.color(color)
        })

    });

    // data.forEach(element => {
    //     dataformat.push({
    //         tag: element['token'],
    //         count: element['count'],
    //         "color": am4core.color(element['color'])
    //     })

    // });


    series.data = dataformat;

    series.dataFields.word = "tag";
    series.dataFields.value = "count";

    series.colors = new am4core.ColorSet();
    series.colors.passOptions = {};

    series.labels.template.propertyFields.fill = "color";

    // series.labels.template.url = "https://stackoverflow.com/questions/tagged/{word}";
    // series.labels.template.urlTarget = "_blank";
    // series.labels.template.tooltipText = "{word}: {value}";

    var hoverState = series.labels.template.states.create("hover");
    hoverState.properties.fill = am4core.color("#FF0000");

    series.labels.template.events.on("over", function (ev) {

        var item = ev.target.tooltipDataItem.dataContext;
        var token = item['tag'];
        console.log(token);

        wordcloudPlot(hashtag_latlng, token);
        // plotEventOnMap(token, only_hashtag_place_data);
    });

    // var subtitle = chart.titles.create();
    // subtitle.text = "(click to open)";

    // var title = chart.titles.create();
    // title.text = "Most Popular Tags @ StackOverflow";
    // title.fontSize = 20;
    // title.fontWeight = "800";
}

