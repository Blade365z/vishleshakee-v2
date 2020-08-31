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
                <input type="text" class="form-control datepicker-here " id="fromDateTA" placeholder="From Date" onkeydown="return false;" style="border:0px;" autocomplete="OFF" data-language='en' required>
            </div>
            <div class="form-group dateinputForm my-0  mr-2 border smat-rounded d-flex px-2 py-1  bg-white">
                <i class="far fa-calendar-alt mx-2 text-normal" style="margin-top:11px;"></i>
                <input type="text" class="form-control datepicker-here " id="toDateTA" placeholder="To Date" onkeydown="return false;" style="border:0px;" autocomplete="OFF" data-language='en' required>
            </div>
            <button class="btn smat-btn  smat-rounded  mx-1" id="submit-btn" type="submit"> <span> Search Trends </span> </button>
        </div>
    </form>
</div>
<div>

    <div class="row">
        <div class="col-sm-4">
            <div class="card shadow mt-1">
                <div class="card-body">
                    <div>
                        <p class="m-0  smat-box-title-large">Top Hashtags <span class="mx-1  clickable text-dark "><i class="fas fa-info-circle " title="See Tweets"></i></span> </p>
                    </div>
                    <div class="taResults" id="taTopHashtags">


                    </div>

                </div>
            </div>
        </div>
        <div class="col-sm-4">
            <div class="card shadow mt-1">
                <div class="card-body">
                    <div>
                        <p class="m-0 smat-box-title-large">Top Mentions</p>
                    </div>
                    <div class="taResults" id="taResultsMentions">


                    </div>
                </div>
            </div>
        </div>
        <div class="col-sm-4">
            <div class="card shadow mt-1">
                <div class="card-body">
                    <div>
                        <p class="m-0 smat-box-title-large">Top Keywords</p>
                    </div>
                    <div class="taResults" id="taResultsKeywords">


                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script type="module" src="public/tempJS/trendAnalysis/TrendAnalysis.js"></script>
@endsection