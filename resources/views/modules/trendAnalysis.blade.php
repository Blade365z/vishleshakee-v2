@extends('parent.app')
@section('content')
    <div class="smat-mainHeading ">
        Trend Analysis
    </div>

    <div class="mb-3">
        <form id="taQueryInputs">

            <div id="haDateInput">
                <div class="form-group  dateinputForm my-0  mr-2  border smat-rounded d-flex px-2 py-1  bg-white">
                    <i class="far fa-calendar-alt mx-2 text-normal " style="margin-top:11px;"></i>
                    <input type="text" class="form-control datepicker-here " id="fromDateTA" placeholder="From Date"
                        style="border:0px;" autocomplete="OFF" data-language='en' required>
                </div>
                <div class="form-group dateinputForm my-0  mr-2 border smat-rounded d-flex px-2 py-1  bg-white">
                    <i class="far fa-calendar-alt mx-2 text-normal" style="margin-top:11px;"></i>
                    <input type="text" class="form-control datepicker-here " id="toDateTA" placeholder="To Date"
                        onkeydown="return false;" style="border:0px;" autocomplete="OFF" data-language='en' required>
                </div>
                <button class="btn smat-btn  smat-rounded  mx-1" id="submit-btn" type="submit"> <span> Search Trends </span>
                </button>
            </div>
        </form>
        <small class="text-muted">*Maximum range of 3 Days.</small>
    </div>
    <div>
   
        <div class="row">
            <div class="col-sm-4">
                <div class="card shadow mt-1">
                    <div class="card-body">
                        <div>
                            <p class="m-0  smat-box-title-large text-dark font-weight-bold">Top Hashtags <span
                                    class="mx-1  clickable text-dark "></span> </p>
                        </div>
                        <div class="taResults" id="taResultsHashtags">


                        </div>

                    </div>
                </div>
            </div>
            <div class="col-sm-4">
                <div class="card shadow mt-1">
                    <div class="card-body">
                        <div>
                            <p class="m-0 smat-box-title-large text-dark font-weight-bold">Top Mentions</p>
                        </div>
                        <div class="taResults" id="taResultsMentions">


                        </div>
                    </div>
                </div>
            </div>
            {{-- <div class="col-sm-4">
                <div class="card shadow mt-1">
                    <div class="card-body">
                        <div>
                            <p class="m-0 smat-box-title-large">Top Users</p>
                        </div>
                        <div class="taResults" id="taResultsUsers">


                        </div>
                    </div>
                </div>
            </div> --}}
            <div class="col-sm-4 pl-0">
                <div class="card shadow">
                    <div class="card-body p-3">
                        <div class="d-flex">
                            <h4> <i class="fas fa-fire-alt mr-4 mt-3  text-muted"></i></h4>
                                <div >
                                    <h2 class=" m-0 text-dark">3240 </h2>
                                    <p class=" m-0 pull-text-top  text-muted">Hashtags trending</p>
                                </div>
                                <div  class="ml-3">
                                    <h2 class=" m-0 text-dark">1140 </h2>
                                    <p class=" m-0 pull-text-top text-muted">Mentions trending</p>
                                </div>
        
                        </div>
                    </div>
                </div>
                <div class="card  shadow mt-2" >
                    <div class="card-body ">
                        <p class="m-0 font-weight-bold text-dark"> Tweet for <span class="text-normal" id="trendTweetsQuery"> </span> </p>
                        <div class="pr-3" id="trendTweets">
                        </div>

                    </div>
                </div>
        
            </div>
        </div>
    </div>

    <script type="module" src="public/tempJS/trendAnalysis/TrendAnalysis.js"></script>
@endsection
