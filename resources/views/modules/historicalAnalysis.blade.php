@extends('parent.app')
@section('content')

<div class="smat-mainHeading ">
    Historical Analysis
</div>
<div class="mb-3">
    <form id="haQueryInputs">
        <div id="queryinputDivParent">
            <div id="queryInputDiv">
                <div class="form-group   border smat-rounded d-flex px-2 py-1  bg-white" id="haQueryInputBox">
                    <input type="text" class="form-control typeahead " id="queryToken" placeholder="Query" style="border:0px;" autocomplete="OFF" required>
                </div>
            </div>

            <div class="d-flex">
                <div>
                    <button class="btn btn-neg smat-rounded mx-1 mt-2 " id="removeField" onclick="return false" style="display:none;"> <i class="fa fa-minus" aria-hidden="true"></i></button>
                </div>
                <div>
                    <button class="btn btn-primary smat-rounded mx-1 mt-2 " id="addQueryButton" onclick="return false"><i class="fa fa-plus" aria-hidden="true"></i></button>
                </div>
            </div>

        </div>
        <div id="haDateInput">
            <div class="form-group  dateinputForm my-0  mr-2  border smat-rounded d-flex px-2 py-1  bg-white">
                <i class="far fa-calendar-alt mx-2 text-normal " style="margin-top:11px;"></i>
                <input type="text" class="form-control datepicker-here  smat-from " id="fromDateHA" placeholder="From Date" onkeydown="return false;" style="border:0px;" autocomplete="OFF" data-language='en' required>
            </div>
            <div class="form-group dateinputForm my-0  mr-2 border smat-rounded d-flex px-2 py-1  bg-white">
                <i class="far fa-calendar-alt mx-2 text-normal" style="margin-top:11px;"></i>
                <input type="text" class="form-control datepicker-here  smat-to " id="toDateHA" placeholder="To Date" onkeydown="return false;" style="border:0px;" autocomplete="OFF" data-language='en' required>
            </div>
            <button class="btn smat-btn  smat-rounded  mx-1" id="submit-btn" type="submit"> <span> Search Result </span> </button>
            <button class="btn  text-normal smat-rounded  mx-1" id="showTableBtn" onclick="return false"> <span> Show Search History </span> </button>
        </div>
    </form>
</div>



<div class="my-3" id="searchTable" style="display:none;">
    <div class="card">
        <div class="card-body">
            <div>
                <p class="m-0 smat-box-title"> Recent Searches</p>
            </div>
            <div class="table-responsive ">
                <table class="table  table-bordered">
                    <thead>
                        <tr>
                            <th class="py-1 px-3 text-dark" scope="col">ID</th>
                            <th class="py-1 px-3 text-dark " scope="col">Query</th>
                            <th class="py-1 px-3 text-dark " scope="col">From </th>
                            <th class="py-1 px-3 text-dark " scope="col">To </th>
                            <th class="py-1 px-3 text-dark " scope="col"> Status</th>
                            <th class="py-1 px-3 text-dark" scope="col"> Options</th>
                        </tr>
                    </thead>
                    <tbody id="haStatusTable">

                    </tbody>
                </table>
                <div id="tableInitialTitle">
                    <p class="m-0 text-center text-hint" disabled> Submit a query to perform analysis upon. </p>
                </div>
            </div>
        </div>
    </div>
</div>



<div class="my-2" id="analysisPanelHA" style="display:none;">
<div>
<p class="smat-box-title-large m-0">Showing Results for <span class="smat-value font-weight-bold text-normal" id="currentlySearchedQuery"> </span> </p>

</div>

    

            <div class="card shadow">
                <div class="card-body">
                    
<div>

<ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active smat-rounded" id="frqTabHA" data-toggle="pill" href="#freqContentHA" role="tab" aria-controls="freqContentHA" aria-selected="true">Frequency</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link smat-rounded " id="sentiTabHA" data-toggle="pill" href="#sentiContentHA" role="tab" aria-controls="pills-profile" aria-selected="false">Sentiment</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link smat-rounded " id="mentionsTabHA" data-toggle="pill" href="#mentionsContentHA" role="tab" aria-controls="pills-contact" aria-selected="false">Top Mention</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link smat-rounded " id="usersTabHA" data-toggle="pill" href="#usersContentHA" role="tab" aria-controls="pills-contact" aria-selected="false">Top Active-Users</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link smat-rounded " id="hashtagsTabHA" data-toggle="pill" href="#hashtagsContentTab" role="tab" aria-controls="pills-contact" aria-selected="false">Top Hashtags</a>
                        </li>
                        {{-- <li class="nav-item">
                            <a class="nav-link smat-rounded" id="sensitivityTabHA" data-toggle="pill" href="#sensitivityContentHA" role="tab" aria-controls="pills-contact" aria-selected="false">Sensitivity</a>
                        </li> --}}
                        <li class="nav-item">
                            <a class="nav-link smat-rounded" id="locationTabHA" data-toggle="pill" href="#locationContentHA" role="tab" aria-controls="pills-contact" aria-selected="false">Locations</a>
                        </li>
                    </ul>

</div>
   
                    <div class="tab-content" id="pills-tabContent">
                        <div class="" id="summaryContent-1">

                        </div>
                        <div class="tab-pane fade show active haTab" id="freqContentHA" role="tabpanel" aria-labelledby="freqContentHA"> </div>
                        <div class="tab-pane fade haTab " id="sentiContentHA" role="tabpanel" aria-labelledby="sentiContentHA"> </div>
                        <div class="tab-pane fade haTab barGraphTab" id="mentionsContentHA" role="tabpanel" aria-labelledby="mentionsContentHA"></div>
                        <div class="tab-pane fade haTab barGraphTab" id="usersContentHA" role="tabpanel" aria-labelledby="usersContentHA"></div>
                        <div class="tab-pane fade haTab barGraphTab " id="hashtagsContentTab" role="tabpanel" aria-labelledby="hashtagsContentTab"></div>
                        <div class="tab-pane fade haTab " id="tweetsContentHA" role="tabpanel" aria-labelledby="tweetsContentHA">tweetsContentHA </div>
                        <div class="tab-pane fade haTab " id="sensitivityContentHA" role="tabpanel" aria-labelledby="sensitivityContentHA">sensitivityContentHA </div>
                        <div class="tab-pane fade haTab " id="locationContentHA" role="tabpanel" aria-labelledby="locationContentHA">locationContentHA </div>
                        
                    </div>


                </div>
            </div>
     
  

</div>
<script type="module" src="public/amcharts4/core.js"></script>
<script type="module" src="public/amcharts4/charts.js"></script>
<script type="module" src="public/tempJS/historicalAnalysis/HistoricalAnalysis.js"></script>

@endsection