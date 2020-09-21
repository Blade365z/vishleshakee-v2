@extends('parent.app')
@section('content')
    <link rel="stylesheet" href="public/leaflet/markerCluster/MarkerCluster.css">
    <link rel="stylesheet" href="public/leaflet/markerCluster/MarkerCluster.Default.css">
    <link rel="stylesheet" href="public/leaflet/leaflet.css">
    <link rel="stylesheet" href="public/leaflet/leaflet_modal.css">



    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel"></h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    Location Doest Not Exist!
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>

                </div>
            </div>
        </div>
    </div>


    <div class="smat-mainHeading ">
        Location Monitor
    </div>
    <div class="mb-3">
        <form id="lmInputs">

            <div id="naInputPanel">
                <div class="form-group  text-normal  border smat-rounded d-flex  mr-2 px-2 py-1  bg-white"
                    id="uaSearchInput">
                    <i class="fa fa-search px-1 pt-2" aria-hidden="true" style="margin-top:5px"></i>
                    <input type="text" class="form-control" value="india" name="query" id="queryLM"
                        placeholder="Search a location" style="border:0px;" autocomplete="OFF" required>
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
                <div>
                    <button class="btn smat-btn  smat-rounded  mx-1" id="submit-btn" type="submit"> <span>Search
                            Location</span> </button>


                </div>
                <div class="pt-2 smat-rounded  ml-auto  ">
                    <h5>
                        <span class="mx-3 clickable text-dark" id="locationTweets"><i class="fab fa-twitter locationOptions"
                                title="See Tweets"></i></span>
                        <span class="mx-3 clickable text-dark "><i class="fas fa-redo-alt locationOptions "
                                title="Refresh"></i></span>

                        <span class="mx-3 clickable text-dark">
                            <div class="btn-group"> <i class="fas fa-filter locationOptions"  class="smat-rounded text-normal" data-toggle="dropdown"
                                aria-haspopup="true" 
                                        title="Filter"></i> 
                                <div class="dropdown-menu dropdown-menu-right">
                                    <li class="dropdown-item clickable filter-hashtags" value="all">Show All</li>
                                    <li class="dropdown-item clickable filter-hashtags" value="normal"> <i
                                            class="fa fa-circle text-normal" aria-hidden="true"></i> Normal Hashtags</li>
                                    <li class="dropdown-item clickable filter-hashtags" value="com"> <i
                                            class="fa fa-circle text-com" aria-hidden="true"></i> Communal Hashtags</li>
                                    <li class="dropdown-item clickable filter-hashtags" value="sec"> <i
                                            class="fa fa-circle text-sec" aria-hidden="true"></i> Security Hashtags</li>
                                    <li class="dropdown-item clickable filter-hashtags" value="com_sec"> <i
                                            class="fa fa-circle text-com_sec" aria-hidden="true"></i> Communal and Security
                                            Hashtags</li>
                                </div>
                            </div>





                        </span>
                        <span class="mx-3 clickable text-dark"> <i class="fas fa-hashtag locationOptions "
                                id="currentlyTrendingLocBtn" title="Hide trending hashtags"></i> </span>
                    </h5>

                </div>
                <!-- <button class="btn  text-normal smat-rounded  mx-1" id="showTableBtn" onclick="return false"> <span> Show Search History </span> </button> -->
            </div>

        </form>
    </div>


    <div id="lmPanel">
        <div class="d-flex">
            <div class="p-1" id="lmMap">

            </div>

            <div class="modal_lm">
                <div class="modal-content">
                    <span class="close-button">&times;</span>
                    <ul id="markersList"></ul>
                </div>
            </div>
            <div class="mx-3" id="currentlyTrendingParentLoc">
                <div id="currentlyTrendingLocTitle">

                </div>
                <div id="currentlyTrendingLocDiv">


                </div>

            </div>
        </div>



    </div>


    {{-- <div id="lmPanel">
        <div class="card shadow">
            <div class="card-body">
                <div class="dFlexBut">
                    <div>
                        <p class="smat-box-title-large m-0">Showing Results for <span
                                class="smat-value font-weight-bold text-dark currentSearch" id=""> </span> </p>
                    </div>
                    <div class="ml-auto mr-3">
                        <h5>
                            <span class="mx-3 clickable text-dark" id="locationTweets"><i
                                    class="fab fa-twitter locationOptions" title="See Tweets"></i></span>
                            <span class="mx-3 clickable text-dark "><i class="fas fa-redo-alt locationOptions "
                                    title="Refresh"></i></span>
                            <span class="mx-3 clickable text-dark "><i class="fa fa-expand locationOptions "
                                    title="Full Screen"></i></span>
                            <span class="mx-3 clickable text-dark"><i class="fas fa-filter locationOptions"
                                    title="Filter"></i></span>
                            <span class="mx-3 clickable text-dark"> <i class="fas fa-hashtag locationOptions "
                                    id="currentlyTrendingLocBtn" title="Hide trending hashtags"></i> </span>
                        </h5>
                    </div>

                </div>
                <div class="d-flex">
                    <div class="p-1" id="lmMap">

                    </div>

                    <div class="modal_lm">
                        <div class="modal-content">
                            <span class="close-button">&times;</span>
                            <ul id="markersList"></ul>
                        </div>
                    </div>
                    <div id="currentlyTrendingParentLoc">
                        <div id="currentlyTrendingLocTitle">

                        </div>
                        <div id="currentlyTrendingLocDiv">


                        </div>

                    </div>
                </div>


            </div>
        </div>

    </div>
    <div class="mt-3">

    </div> --}}


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

    <script src="public/leaflet/pulse/L.Icon.Pulse.js"></script>
    <link rel="stylesheet" href="public/leaflet/pulse/L.Icon.Pulse.css">





@endsection
