@extends('parent.app')
@section('content')

<div class="row ">
    <div class="col-sm-9 ">
        <form class=" smat-search-form "  id="publicSearchForm" action="home" method="GET" role="search">
        
            <div id="naInputPanel">
                <div class="form-group  text-normal  border smat-rounded d-flex  mr-2 px-2 py-1  bg-white" id="uaSearchInput">
                    <i class="fa fa-search px-1 pt-2" aria-hidden="true" style="margin-top:5px"></i>
                    <input type="text" class="form-control" name="query" id="queryLM" placeholder="Search a Hashtag or Mention" style="border:0px;" autocomplete="OFF" required>
                </div>



                <div class="d-flex">
                    <button class="btn smat-btn  smat-rounded  mx-1 mb-3" id="submit-btn" type="submit"> <span>Search</span> </button>

                </div>
            </div>
        </form>

        <div class="dFlexBut">
                    <div class="mr-2 pt-2  text-muted ">
                       
                        Interval set to: 
                    </div>
                    <div id="interval-buttons-public-div">

                        <li class="btn  btn-outline interval-buttons-public  smat-rounded clickable mr-2" value="15" id="15minsBtn">15 Mins</li>
                        <li class="btn  btn-outline clickable  smat-rounded interval-buttons-public  mx-2" value="30">30 Mins</li>
                        <li class="btn  btn-outline clickable smat-rounded  interval-buttons-public  mx-2" value="45">45 Mins</li>
                        <li class="btn  btn-outline clickable smat-rounded  interval-buttons-public mx-2" value="1">1 Hour</li>
                        <li class="btn  btn-outline  clickable smat-rounded interval-buttons-public mx-2" value="5">5 Hours</li>

                    </div>
                </div>
        <div>
            <p class="smat-box-title-large m-0">Showing Results for <span class="smat-value font-weight-bold text-normal" id="publicCurrentQuery">  </span> </p>
        </div>
        
        <div class="card shadow mt-2" id="main-public-dash">
            <div class="card-body">
       
                <div class="row " id="analysis-panel-title">
                    <div class="col-sm-6">
                        <div class=" ">
                            <p class="smat-box-title-large m-0 font-weight-bold p-1" id="result-div-title"> </p>
                            <p class="pull-text-top smat-dash-title m-0 px-1" id="result-div-subtitle"> </p>
                        </div>
                    </div>
                    <div class="col-sm-6">

                        <div class="row">
                            <div class="col-sm-3 public-analysis-result " id="public-summary-1">

                            </div>
                            <div class="col-sm-9 public-analysis-result " id="public-summary-2">

                            </div>
                            <div class="dFlexBut public-analysis-result" id="public-summary-row">
                              
                            </div>
                        </div>


                    </div>

                </div>




                <div class="d-flex">
                    <div class="pull-left " id="analysis-panel-switches">
                        <ul class="p-0  text-left mt-4">
                            <li class="smat-list clickable public-analysis-tab   freq-public-tab  py-2 ">
                                <div class="text-center">
                                    <i class="fas dash_icons fa-chart-line active-buttons"></i>
                                    <p class="smat-dash-title m-0 "> Frequency </p>
                                </div>
                            </li>
                            <li class="smat-list clickable  public-analysis-tab   senti-public-tab py-2">
                                <div class="text-center">
                                    <i class="fas dash_icons fa-grin"></i>
                                    <p class="smat-dash-title  m-0"> Sentiment </p>
                                </div>
                            </li>
                            <li class="smat-list clickable public-analysis-tab    mentions-public-tab py-2 ">
                                <div class="text-center">
                                    <i class="fas dash_icons fa-at"></i>
                                    <p class="smat-dash-title m-0 ">Mentions </p>
                                </div>
                            </li>
                            <li class="smat-list clickable   public-analysis-tab topusers-public-tab py-2">
                                <div class="text-center">
                                    <i class="fas  fa-user-friends"></i>

                                    <p class="smat-dash-title  m-0">Top Users </p>
                                </div>
                            </li>
                            <li class="smat-list clickable   public-analysis-tab locations-public-tab py-2">
                                <div class="text-center">
                                    <i class="fas dash_icons fa-map-marker-alt"></i>
                                    <p class="smat-dash-title  m-0">Locations</p>
                                </div>
                            </li>
                            <li class="smat-list clickable   public-analysis-tab tweets-public-tab py-2">
                                <div class="text-center">
                                    <i class="fab dash_icons fa-twitter"></i>
                                    <p class="smat-dash-title m-0">Tweet Info.</p>
                                </div>
                            </li>
                        </ul>

                    </div>
                    <div class="pull-right   " id="analysis-panel-public">


                        <div class="public-analysis-result " id="result-div">




                        </div>
                        <div class="px-3">
                            <!-- <div class="mx-1">
                            <p class="smat-box-title m-1"> <span class="font-weight-bold text-dark"> #Coronavirus </span> includes</p>
                        </div>
                        <div class="d-flex ">
                            <span class="mx-2">
                                <p class="m-0 smat-box-title-large font-weight-bold text-normal">2309</p>
                                <p class="pull-text-top smat-dash-title ">Normal</p>
                            </span>
                            <span class="mx-2">
                                <p class="m-0 smat-box-title-large font-weight-bold text-sec">4309</p>
                                <p class="pull-text-top smat-dash-title ">Security</p>
                            </span>
                            <span class="mx-2">
                                <p class="m-0 smat-box-title-large font-weight-bold text-com">430</p>
                                <p class="pull-text-top smat-dash-title ">Communal</p>
                            </span>
                            <span class="mx-2">
                                <p class="m-0 smat-box-title-large font-weight-bold text-seccom">309</p>
                                <p class="pull-text-top smat-dash-title">Security & Communal</p>
                            </span>
                        </div> -->

                        </div>

                    </div>

                </div>
                <div class="row ">
                    <!-- <div class="col-sm-6  p-0">
                        <div class="mx-1">
                            <p class="smat-box-title m-1"> <span class="font-weight-bold text-dark"> #Coronavirus </span> includes</p>
                        </div>
                        <div class="d-flex ">
                            <span class="mx-2">
                                <p class="m-0 smat-box-title-large font-weight-bold text-normal">2309</p>
                                <p class="pull-text-top smat-dash-title ">Normal</p>
                            </span>
                            <span class="mx-2">
                                <p class="m-0 smat-box-title-large font-weight-bold text-sec">4309</p>
                                <p class="pull-text-top smat-dash-title ">Security</p>
                            </span>
                            <span class="mx-2">
                                <p class="m-0 smat-box-title-large font-weight-bold text-com">430</p>
                                <p class="pull-text-top smat-dash-title ">Communal</p>
                            </span>
                            <span class="mx-2">
                                <p class="m-0 smat-box-title-large font-weight-bold text-seccom">309</p>
                                <p class="pull-text-top smat-dash-title">Security & Communal</p>
                            </span>
                        </div>
                    </div> -->
                    <div class="col-sm-6">
                        <!-- <div class="d-flex pt-2 ">
                            <div class="mx-1">
                                <p class=" m-0 smat-dash-title "> <i class="fa fa-circle text-normal" aria-hidden="true"></i> Normal </p>
                                <p class="m-0 smat-dash-title "> <i class="fa fa-circle text-sec" aria-hidden="true"></i> Security </p>
                                <p class="m-0 smat-dash-title "> <i class="fa fa-circle text-com" aria-hidden="true"></i> Communal </p>
                                <p class="m-0 smat-dash-title"> <i class="fa fa-circle text-seccom" aria-hidden="true"></i> Security & Communal </p>
                            </div>
                            <div class="mx-2">
                                <p class="m-0 smat-dash-title "> <i class="fa fa-circle text-pos" aria-hidden="true"></i> Positive Tweet</p>
                                <p class="m-0 smat-dash-title "> <i class="fa fa-circle text-neg" aria-hidden="true"></i> Negative Tweet </p>
                                <p class="m-0 smat-dash-title"> <i class="fa fa-circle text-neu" aria-hidden="true"></i> Neutral Tweet </p>
                            </div>
                        </div> -->
                    </div>
                </div>
            </div>


        </div>
    </div>
    <div class="col-sm-3">
        <div class="card shadow px-3 py-2">
            <div>
                <p class="smat-box-title mb-1 font-weight-bold"> Alerts <i class="fa fa-exclamation-triangle mx-2  pulseBtn text-danger" aria-hidden="true"></i> </p>
            </div>
            <div class="card-body p-0">

                <div>
                    <p class="m-0 hashtags ">#SushantSinghRajput</p>
                </div>

                <div>
                    <p class="m-0 hashtags">#BanChineseApps</p>
                </div>
                <div>
                    <p class="m-0 hashtags">#Covid-19</p>
                </div>

            </div>
        </div>
        <div class="card shadow mt-4 px-3 py-2">
            <div class="d-flex ">
                <div>
                    <p class="smat-box-title mb-1 font-weight-bold"> Trending Now</p>
                </div>
                <div class="dropdown ml-auto ">
                    <button class="btn btn-white dropdown-toggle smat-rounded   py-0 px-2" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Filter 
                    </button>
                    <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                        <ul class=" px-2 ">
                        <li class="publicHashtagsFilter " value="all"> Show all</li>
                            <li class="publicHashtagsFilter" value="normal">Normal</li>
                            <li class="publicHashtagsFilter" value="sec">Security</li>
                            <li class="publicHashtagsFilter" value="com">Communal</li>
                            <li class="publicHashtagsFilter" value="seccom">Security & Communal</li>
                        </ul>
                    </div>
                </div>
            

            </div>
            <div class="pull-text-top">
      <small class="text-muted" > Updates every 1 minute </small>       


</div>
            
            <div class="card-body p-0">

                <div id="public-trending">


                </div>
                <div class="mt-4">
                    <div class="arrowBounce">
                        <i class="fa fa-arrow-down mx-2 " aria-hidden="true" id="down-arrow-animation"></i>

                    </div>
                </div>
            </div>
        </div>
    </div>

</div>
<script>
var incoming = {!! json_encode($query) !!}
</script>
<script type="module" src="public/amcharts4/core.js"></script>
<script type="module" src="public/amcharts4/charts.js"></script>
<script type="module" src="public/amcharts4/themes/animated.js"></script>
<script type="module" src="public/tempJS/home/Home.js"></script>


@endsection