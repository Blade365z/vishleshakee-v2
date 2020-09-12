import {wordCloudLM} from './chartHelper.js';
import {get_current_time,getTweetIdList} from './helper.js';

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


    var LM_Map = L.map('lmMap', {
        fullscreenControl: true,
        fullscreenControlOptions: {
          position: 'topleft'
        },
        center: [21.1458, 79.0882],
        zoom: 5,
        layers: [tiles, glow]
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

   

    $(document).ready(function(){
    
        
        
        
        trigger();
        
        $('#submit-btn').on('click', function(e) {
            trigger();            
        });
        
        $('.nav-item ').removeClass('smat-nav-active');
        $('#nav-LM').addClass('smat-nav-active');
        wordCloudLM('trendingLM');
        $('#lmInputs').on('submit',function(e){
            e.preventDefault();
            let LocTemp = $('#queryLM').val();
            $('.currentSearch').text(LocTemp);
            e.preventDefault();
            $('html, body').animate({
                scrollTop: $("#lmPanel").offset().top
            }, 200);
    
        });
    });


    
    
    function trigger()
    {
        var interval,
            global_datetime,
            from_datetime,
            to_datetime,
            refresh_type = $("#lmTefreshType").val(),
            timeLimit = $("#lmInterval :selected").val(),
            place = "^"+$("#queryLM").val();

        localStorage.setItem("lmTefreshType", "manual");
        if(timeLimit=="1 Minute"){
            interval = 60;
    
        }
        else if(timeLimit=="15 Minutes"){
            interval = 900;
        }
        else if(timeLimit=="1 Hour"){
            interval = 3600;
        }
        console.log(interval+"   "+place+"  ");    
        global_datetime = get_current_time(interval);
        console.log(global_datetime);
        to_datetime = global_datetime[1];
        from_datetime = global_datetime[0];
        rander_map(getTweetIdList(from_datetime,to_datetime,place));
    }


    function rander_map(data) {
        group1.clearLayers();
        data = JSON.parse(data);
        if (data.length == 0) {
            alert("Can't find the location");
        }
        console.log(data.length);
        // if (typeof request1 !== "undefined") {
        //     clearInterval(request1);
        // }        
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