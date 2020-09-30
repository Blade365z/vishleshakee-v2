@extends('parent.app')
@section('content')

<link rel="stylesheet" href="public/leaflet/markerCluster/MarkerCluster.css">
<link rel="stylesheet" href="public/leaflet/leaflet.css">

    <div class="smat-mainHeading ">
        User Analysis
    </div>
    <div class="mb-3">
        <form id="uaSearchForm">

            <div id="naInputPanel">
                <div class="form-group  text-normal  border smat-rounded d-flex  mr-2 px-2 py-1  bg-white"
                    id="uaSearchInput">
                    <i class="fa fa-search px-1 pt-2" aria-hidden="true" style="margin-top:5px"></i>
                    <input type="text" class="form-control" name="query" id="queryUASearch" placeholder="Query"
                        style="border:0px;" autocomplete="OFF" required>
                </div>



                <div class="d-flex">
                    <button class="btn smat-btn  smat-rounded  mx-1 mb-3" id="submit-btn" type="submit"> <span>Search
                            User</span> </button>
                    <button class="btn text-normal smat-rounded  mx-1 mb-3 " onclick="return false;" id="showUAsugg"> <span
                            id="suggestionCurrentStatus">Hide</span> Suggestions </button>
                </div>
                <!-- <button class="btn  text-normal smat-rounded  mx-1" id="showTableBtn" onclick="return false"> <span> Show Search History </span> </button> -->
            </div>

        </form>
    </div>

    <div class="row" id="suggDiv">
        <div class="col-md-6">
            <div class="card shadow mb-2">
                <div class="card-body">
                    <div class="text-center">
                        <h6 class="text-dark "> Popular Users </h6>
                    </div>
                    <div class="d-flex justify-content-center" id="suggUsers-1">

                    </div>
                    <div class="d-flex  justify-content-center mt-2" id="suggUsers-2">

                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-6">
            <div class="card shadow mb-2">
                <div class="card-body">
                    <div class="text-center">
                        <h6 class="text-dark "> Popular News Handles </h6>
                    </div>
                    <div class="d-flex justify-content-center " id="suggNews-1">

                    </div>
                    <div class="d-flex justify-content-center mt-2 " id="suggNews-2">

                    </div>
                </div>
            </div>
        </div>

    </div>


    <div id="UAAnalysisDiv" style="display:none">

        <div class="row mt-3">
            <div class="col-md-5">
                <div id="ua-leftDiv">
                    <div class="my-3 ">
                        <p class="smat-box-title-large m-0">Showing results for <span
                                class="smat-value font-weight-bold text-normal" id="showingResultsFor"> </span> </p>
                    </div>
                    <div id="date-divUA">
                        <form id="uaDateForm">
                            <div class="d-flex mb-3">
                                <div class="form-group   my-0  mr-2  border smat-rounded d-flex px-2 py-1  bg-white">
                                    <i class="far fa-calendar-alt mx-2 text-normal " style="margin-top:11px;"></i>
                                    <input type="text" class="form-control datepicker-here  smat-from" name="fromDate" id="fromDateUA"
                                        placeholder="From Date" onkeydown="return false;" style="border:0px;"
                                        autocomplete="OFF" data-language='en' required>
                                </div>
                                <div class="form-group  my-0  mr-2 border smat-rounded d-flex px-2 py-1  bg-white">
                                    <i class="far fa-calendar-alt mx-2 text-normal" style="margin-top:11px;"></i>
                                    <input type="text" class="form-control datepicker-here smat-to " name="toDate" id="toDateUA"
                                        placeholder="To Date" onkeydown="return false;" style="border:0px;"
                                        autocomplete="OFF" data-language='en' required>
                                </div>

                                <button class="btn  btn-primary  " id="submit-btn" type="submit"
                                    style="border-radius:50%;margin-top:5px;"> <span>Go </span> </button>

                            </div>
                        </form>
                    </div>
                    <div class="card shadow" id="userInfoDiv">
                        <div class="card-body">
                            <div class="dFlexBut">
                                <div class="text-center">
                                    <img class="profilePicLarge" id="currentUAProfilePic" />
                                </div>
                                <div class="mt-2">
                                    <div>
                                        <span class="userNameLarge mx-2 mb-1 text-dark" id="currentUAUserName"> </span><span
                                            id="currentUAVerified"> </span>
                                    </div>
                                    <p class="userHandleLarge mx-2 mb-0 text-dark" id="currentUAUserHandle"></p>
                                </div>


                            </div>
                            <div class="mt-3 table-responsive-xl" id="uaTable">
                                <table class="table table-borderless" id="uaUserInfo">

                                    <tbody>
                                        <tr>
                                            <th class="py-0 px-3 text-dark" scope="row">User ID:</th>
                                            <td class="p-0 text-dark " id="userDetailsID"></td>

                                        </tr>
                                        <tr>
                                            <th class="py-0 px-3 text-dark " scope="row">Joined_On:</th>
                                            <td class="p-0 text-dark " id="userDetailsJOINEDON"> </td>

                                        </tr>
                                        <tr>
                                            <th class="py-0 px-3 text-dark" scope="row">Location:</th>
                                            <td class="p-0 text-dark " id="userDetailsLOCATION"></td>

                                        </tr>
                                        <tr>
                                            <th class="py-0 px-3 text-dark" scope="row">Bio:</th>
                                            <td class="p-0 text-dark " id="userDetailsBIO"></td>

                                        </tr>


                                        <tr>
                                            <th class="py-0 px-3 text-dark" scope="row">URL:</th>
                                            <td class="p-0 text-dark " id="userDetailsURL"> </td>

                                        </tr>
                                    </tbody>
                                </table>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-7">
                <div class="card shadow" id="userTweetDiv">
                    <div class="card-body">
                        <div>
                            <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                <li class="nav-item active">
                                    <a class="nav-link active smat-rounded " id="hashtagsTabUA" data-toggle="pill"
                                        href="#hashtagsContentTab" role="tab" aria-controls="mentionsContentUA"
                                        aria-selected="true">Top Hashtags</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link smat-rounded   " id="mentionsTabUA" data-toggle="pill"
                                        href="#mentionsContentUA" role="tab" aria-controls="pills-profile"
                                        aria-selected="false">Top Mentions</a>
                                </li>
                            </ul>
                        </div>

                        <div class="tab-content" id="pills-tabContent">

                            <div class="tab-pane fade show active uaTabTopRight" id="hashtagsContentTab" role="tabpanel"
                                aria-labelledby="hashtagsContentTab">hashtagsContentTab</div>
                            <div class="tab-pane fade uaTabTopRight" id="mentionsContentUA" role="tabpanel"
                                aria-labelledby="mentionsContentUA">Mentions Tab</div>





                        </div>



                    </div>
                </div>
            </div>
        </div>


        <div class="my-4" id="analysisPanelUA">





            <div class="card shadow">
                <div class="card-body">

                    <div>

                        <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                            <li class="nav-item">
                                <a class="nav-link active smat-rounded uaNav" id="frqTabUA" data-toggle="pill"
                                    href="#freqContentUA" role="tab" aria-controls="freqContentUA"
                                    aria-selected="true">Frequency</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link smat-rounded  uaNav " id="sentiTabUA" data-toggle="pill"
                                    href="#sentiContentUA" role="tab" aria-controls="pills-profile"
                                    aria-selected="false">Sentiment</a>
                            </li>




                            <li class="nav-item">
                                <a class="nav-link smat-rounded uaNav" id="locationTabUA" data-toggle="pill"
                                    href="#locationContentUA" role="tab" aria-controls="pills-contact"
                                    aria-selected="false">Locations</a>
                            </li>
                        </ul>

                    </div>
                    <div class="tab-content" id="pills-tabContent">

                        <div class="tab-pane fade show active " id="freqContentUA" role="tabpanel"
                            aria-labelledby="freqContentUA">
                        </div>
                        <div class="tab-pane fade  " id="sentiContentUA" role="tabpanel"
                            aria-labelledby="sentiContentUA"> </div>

                        <div class="tab-pane fade  " id="locationContentUA" role="tabpanel"
                            aria-labelledby="locationContentUA"></div>

                    </div>


                </div>
            </div>



        </div>
    </div>
    <script>
        var incoming =   @json($query ?? '');
        var fromDateReceived =   @json($from ?? '');
        var toDateReceived=  @json($to ?? '');
    </script>
    
    <script type="module" src="public/amcharts4/core.js"></script>
    <script type="module" src="public/amcharts4/charts.js"></script>
    <script type="module" src="public/amcharts4/themes/animated.js"></script>
    <script type="module" src="public/tempJS/userAnalysis/UserAnalysis.js"></script>

    <script src="public/leaflet/leaflet.js"></script>
    <script src="public/leaflet/TileLayer.Grayscale.js"></script>
    <script src="public/leaflet/markerCluster/leaflet.markercluster-src.js"></script>
    <script src="public/leaflet/subgroup/leaflet.featuregroup.subgroup.js"></script>
@endsection
