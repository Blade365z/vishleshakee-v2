@extends('parent.app')
@section('content')
<link rel="stylesheet" href="public/leaflet/markerCluster/MarkerCluster.css">
<link rel="stylesheet" href="public/leaflet/markerCluster/MarkerCluster.Default.css">
<link rel="stylesheet" href="public/leaflet/leaflet.css">
<link rel="stylesheet" href="public/leaflet/leaflet_modal.css">


<div class="smat-mainHeading ">
    Location Monitor
</div>
<div class="mb-3">
    <form id="lmInputs">

        <div id="naInputPanel">
            <div class="form-group  text-normal  border smat-rounded d-flex  mr-2 px-2 py-1  bg-white" id="uaSearchInput">
                <i class="fa fa-search px-1 pt-2" aria-hidden="true" style="margin-top:5px"></i>
                <input type="text" class="form-control" value="india" name="query" id="queryLM" placeholder="Search a location" style="border:0px;" autocomplete="OFF" required>
            </div>

            <div class="form-group   border smat-rounded d-flex px-2 py-1  bg-white">
                <i class="far fa-clock text-normal ml-1" style="margin-top:11px;"></i>
                <select class="form-control" name="LMinterval" id="lmInterval">
                    <option>1 Minute </option>
                    <option>15 Minutes </option>
                    <option>1 Hour</option>
                </select>
            </div>
            <div class="form-group   border smat-rounded d-flex px-2 py-1  bg-white mx-2">
                <i class="fa fa-sync text-normal ml-1" aria-hidden="true" style="margin-top:11px;"></i>
                <select class="form-control" name="LMRefreshType" id="lmTefreshType">
                    <option>Manual Refresh </option>
                    <option>Auto Refresh </option>

                </select>
            </div>
            <div class="d-flex">
                <button class="btn smat-btn  smat-rounded  mx-1 mb-3" id="submit-btn" type="submit"> <span>Search Location</span> </button>

            </div>
            <!-- <button class="btn  text-normal smat-rounded  mx-1" id="showTableBtn" onclick="return false"> <span> Show Search History </span> </button> -->
        </div>

    </form>
</div>


<div id="lmPanel">
    <div class="card shadow">
        <div class="card-body">
            <div class="dFlexBut">
                <div>
                <p class="smat-box-title-large m-0">Showing Results for <span class="smat-value font-weight-bold text-dark currentSearch" id=""> </span> </p>
                </div>
                <div class="ml-auto mr-3">
                    <h5>
                        <span class="mx-3 clickable text-dark"><i class="fab fa-twitter" title="See Tweets"></i></span>
                        <span class="mx-3 clickable text-dark "><i class="fas fa-redo-alt" title="Refresh"></i></span>
                        <span class="mx-3 clickable text-dark "><i class="fa fa-expand" title="Full Screen"></i></span>
                        <span class="mx-3 clickable text-dark"><i class="fas fa-filter" title="Filter"></i></span>
                    </h5>
                </div>

            </div>
            <div class="p-1 " id="lmMap">

            </div>
            
            <div class="modal_lm">
                <div class="modal-content">
                  <span class="close-button">&times;</span>
                  <ul id="markersList"></ul>
                </div>
            </div>

        </div>
    </div>

</div>
<div class="mt-3">
    <div class="card shadow">
        <div class="card-body">
            <div>
                <p class="m-0 text-dark smat-box-title-large"> Trending from <span class="font-weight-bold currentSearch" >  </span> <span class="mx-3 clickable text-dark"><i class="fas fa-info-circle " title="See Tweets"></i></span> </p>
            </div>
            <div id="trendingLM">


            </div>
        </div>
    </div>
</div>


<script type="module" src="public/amcharts4/core.js"></script>
<script type="module" src="public/amcharts4/plugins/wordCloud.js"></script>
<script type="module" src="public/amcharts4/themes/animated.js"></script>
<script type="module" src="public/tempJS/locationMonitor/LocationMonitor.js"></script>

<script src="public/leaflet/leaflet.js"></script>
<script src="public/leaflet/TileLayer.Grayscale.js"></script>
<script src="public/leaflet/markerCluster/leaflet.markercluster-src.js"></script>
<script src="public/leaflet/subgroup/leaflet.featuregroup.subgroup.js"></script>


<link rel="stylesheet" href="public/leaflet/fullscreen/Control.FullScreen.css" />
<script src="public/leaflet/fullscreen/Control.FullScreen.js"></script>





@endsection