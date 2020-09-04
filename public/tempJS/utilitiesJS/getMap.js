export const getCompleteMap = (id,query,interval) => {
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
    var History_Map = L.map(id, {
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
    markerCluster.addTo(History_Map);
    // var modal = document.querySelector(".modal_main_map");
    // var closeButton = document.querySelector(".close-button");
    // closeButton.addEventListener("click", closeModal);
    // window.addEventListener("click", windowOnClick);
    var tweetIcon = L.icon({
        iconUrl: 'public/icons/twitter.png',
        iconSize: [35, 35] // size of the icon
    });

    var tweet_details;

    $.ajax({
        type: "GET",
        url: 'LM/mapTweet',
        data:{interval,query},
        async: false,
        success: function (response) {
                tweet_details = response;
                
        }
    });
    console.log(JSON.parse(tweet_details));
    var op = JSON.parse(tweet_details);
    for (var i = 0; i < op.length; i++) {
        if (op[i].Latitude != null) {
            var senti = op[i].sentiment.value;
            if (senti == "0") {
                L.marker([parseFloat(op[i].Latitude), parseFloat(op[i].Longitude)], {
                    icon: tweetIcon
                }).bindPopup("<div style='background: rgba(238, 180, 98, 0.5)'><b>" + op[i].author + "</b> : @" + op[i].author_screen_name + " <br>" + op[i].tweet + "</div>").addTo(group1);
            } else if (senti == "1") {
                L.marker([parseFloat(op[i].Latitude), parseFloat(op[i].Longitude)], {
                    icon: tweetIcon
                }).bindPopup("<div style='background: rgba(205, 118, 114, 0.5)'><b>" + op[i].author + "</b> : @" + op[i].author_screen_name + " <br>" + op[i].tweet + "</div>").addTo(group1);
            } else if (senti == "2") {
                L.marker([parseFloat(op[i].Latitude), parseFloat(op[i].Longitude)], {
                    icon: tweetIcon
                }).bindPopup("<div style='background: rgba(118, 186, 27, 0.5)'><b>" + op[i].author + "</b> : @" + op[i].author_screen_name + " <br>" + op[i].tweet + "</div>").addTo(group1);
            }
            group1.addTo(History_Map);
        }
    }
    
    
}