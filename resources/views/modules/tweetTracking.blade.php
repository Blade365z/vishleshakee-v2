@extends('parent.app')
@section('content')
    <div class="smat-mainHeading ">
        Tweet Tracking
    </div>

    <div class="row mt-1">
        <div class="col-sm-5">
            <div class="  level-1" style="display:none">
                <div class="card shadow">
                    <div class="card-body tweetCard ">
                        <div class="text-center">
                            <span class=" bg-normal  p-2 smat-rounded" id="tweetTitle-1">

                            </span>
                        </div>
                        <div id="tweetDiv-1">

                        </div>
                    </div>
                </div>
            </div>
            <div class="  level-2" style="display:none">
                <svg height="50 ">
                    <line class="tweetBoxConnector" x1="275" y1="0" x2="275" y2="50" stroke="grey" stroke-width="2" />
                </svg>
                <div class="card  shadow" id="">
                    <div class="card-body  ">
                        <div class="text-center">
                            <span class=" bg-normal  p-2 smat-rounded" id="tweetTitle-2">

                            </span>
                        </div>
                        <div id="tweetDiv-2">

                        </div>
                    </div>
                </div>
            </div>

            <div class=" level-3" style="display:none">
                <svg height="50">
                    <line class="tweetBoxConnector" x1="275" y1="0" x2="275" y2="50" stroke="grey" stroke-width="2" />
                </svg>
                <div class="card shadow" id="">
                    <div class="card-body  ">
                        <div class="text-center">
                            <span class=" bg-normal  p-2 smat-rounded" id="tweetTitle-3">

                            </span>
                        </div>
                        <div id="tweetDiv-3">

                        </div>
                    </div>
                </div>
            </div>

        </div>
        <div class="col-sm-7">
            <div>
                <p class="smat-box-title-large "> Showing Analysis For The <span type="button"
                        class="sourceTweet font-weight-bold text-normal" id="analysisType"> </span>  </p>
            </div>
            <div id="date-divUA">
                <form id="ttDateForm">
                    <div class="d-flex mb-3">
                        <div class="form-group   my-0  mr-2  border smat-rounded d-flex px-2 py-1  bg-white">
                            <i class="far fa-calendar-alt mx-2 text-normal " style="margin-top:11px;"></i>
                            <input type="text" class="form-control datepicker-here  smat-from" name="fromDate"
                                id="fromDateTT" placeholder="From Date" onkeydown="return false;" style="border:0px;"
                                autocomplete="OFF" data-language='en' required>
                        </div>
                        <div class="form-group  my-0  mr-2 border smat-rounded d-flex px-2 py-1  bg-white">
                            <i class="far fa-calendar-alt mx-2 text-normal" style="margin-top:11px;"></i>
                            <input type="text" class="form-control datepicker-here smat-to " name="toDate" id="toDateTT"
                                placeholder="To Date" onkeydown="return false;" style="border:0px;" autocomplete="OFF"
                                data-language='en' required>
                        </div>

                        <button class="btn  btn-primary  " id="submit-btn" type="submit"
                            style="border-radius:50%;margin-top:5px;"> <span>Go </span> </button>

                    </div>
                </form>
            </div>
            <div>
                <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                    <li class="nav-item active">
                        <a class="nav-link active smat-rounded " id="retweetTab" data-toggle="pill"
                            href="#retweetContent" role="tab" aria-controls="mentionsContentUA"
                            aria-selected="true">Re-tweet Frequency</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link smat-rounded   " id="quotedTweetTab" data-toggle="pill"
                            href="#quotedtweetContent" role="tab" aria-controls="pills-profile"
                            aria-selected="false">Quoted-Tweet Frequency</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link smat-rounded   " id="replyTweetTab" data-toggle="pill"
                            href="#replytweetContent" role="tab" aria-controls="pills-profile"
                            aria-selected="false">Reply-Tweet Frequency</a>
                    </li>
                </ul>
            </div>
            <div class="card shadow" id="">
                <div class="card-body ">
                    <div class="tab-content" id="pills-tabContent">

                        <div class="tab-pane fade show active  TTtab" id="retweetContent" role="tabpanel"
                            aria-labelledby="retweetContent"></div>
                        <div class="tab-pane fade TTtab " id="quotedtweetContent" role="tabpanel"
                            aria-labelledby="quotedtweetContent"></div>
                        <div class="tab-pane fade TTtab " id="replytweetContent" role="tabpanel"
                            aria-labelledby="replytweetContent"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script>
        var tweetIDCaptured = @json($tweetID ?? '');

    </script>
    <script type="module" src="public/amcharts4/core.js"></script>
    <script type="module" src="public/amcharts4/charts.js"></script>
    <script type="module" src="public/amcharts4/themes/animated.js"></script>
   <script type="module" src="public/tempJS/tweetTracking/tweetTracking.js"></script>
@endsection
