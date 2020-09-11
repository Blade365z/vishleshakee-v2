export const get_current_time = () =>{
    var from_to_datetime;
    $.ajax({
        type: "GET",
        url: 'LM/getTime',
        async: false,
        success: function (response) {
            from_to_datetime = response;
            

                
        }
    });
    return from_to_datetime;
}


export const getLocationMonitorMap = (id) => {

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


    var LM_Map = L.map(id, {
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

    L.marker([28.7041,77.1025],{ icon: tweetIcon}).bindPopup('<div class="border-bottom"><b>आलोक</b> : @alok1088 <img style="border-radius: 50%; width:10px;height:10px;" src="public/icons/red.png"> <br>#IndiaForKangana अगले चुनाव मे मैडम का एक टिकट तो बनता है कौन सी पार्टी टिकट देगी🤔🤔🤔</div>').addTo(group1);
    L.marker([28.7041,77.1025],{ icon: tweetIcon}).bindPopup('<div class="border-bottom"><b>आलोक</b> : @alok1088 <img style="border-radius: 50%; width:10px;height:10px;" src="public/icons/yellow.png"> <br>#IndiaForKangana अगले चुनाव मे मैडम का एक टिकट तो बनता है कौन सी पार्टी टिकट देगी🤔🤔🤔</div>').addTo(group1);
    L.marker([28.7041,77.1025],{ icon: tweetIcon}).bindPopup('<div class="border-bottom"><b>आलोक</b> : @alok1088 <img style="border-radius: 50%; width:10px;height:10px;" src="public/icons/green.png"> <br>#IndiaForKangana अगले चुनाव मे मैडम का एक टिकट तो बनता है कौन सी पार्टी टिकट देगी🤔🤔🤔</div>').addTo(group1);
    L.marker([28.7041,77.1025],{ icon: tweetIcon}).bindPopup('<div class="border-bottom"><b>आलोक</b> : @alok1088 <img style="border-radius: 50%; width:10px;height:10px;" src="public/icons/red.png"> <br>#IndiaForKangana अगले चुनाव मे मैडम का एक टिकट तो बनता है कौन सी पार्टी टिकट देगी🤔🤔🤔</div>').addTo(group1);
    L.marker([26.1445, 91.7362],{ icon: tweetIcon}).bindPopup('<div class="border-bottom"><b>आलोक</b> : @alok1088 <img style="border-radius: 50%; width:10px;height:10px;" src="public/icons/green.png"> <br>#IndiaForKangana अगले चुनाव मे मैडम का एक टिकट तो बनता है कौन सी पार्टी टिकट देगी🤔🤔🤔</div>').addTo(group1);

    group1.addTo(LM_Map);

    
}