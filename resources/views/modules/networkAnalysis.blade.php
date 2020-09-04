@extends('parent.app')
@section('content')

<style type="text/css">
    .networkDiv {
      width: 600px;
      height: 400px;
      border: 1px solid lightgray;
    }
  </style>

<div class="smat-mainHeading ">
    Network Analysis
</div>

<div id="test">
</div>
<div class="mb-3">
    <form id="naInputInputs">

        <div id="naInputPanel">
            <div class="form-group   my-0  mr-2  border smat-rounded d-flex px-2 py-1  bg-white">
                <input type="text" class="form-control" name="query" id="queryNA" placeholder="Query" style="border:0px;" autocomplete="OFF" required>
            </div>

            <div class="form-group  dateinputForm my-0  mr-2  border smat-rounded d-flex px-2 py-1  bg-white">
                <i class="far fa-calendar-alt mx-2 text-normal " style="margin-top:11px;"></i>
                <input type="text" class="form-control datepicker-here " name="fromDate" id="fromDateNA" placeholder="From Date" onkeydown="return false;" style="border:0px;" autocomplete="OFF" data-language='en' required>
            </div>
            <div class="form-group dateinputForm my-0  mr-2 border smat-rounded d-flex px-2 py-1  bg-white">
                <i class="far fa-calendar-alt mx-2 text-normal" style="margin-top:11px;"></i>
                <input type="text" class="form-control datepicker-here " name="toDate" id="toDateNA" placeholder="To Date" onkeydown="return false;" style="border:0px;" autocomplete="OFF" data-language='en' required>
            </div>
            <div class="form-group  my-0  mr-2 border dateinputForm  smat-rounded d-flex px-2 py-1  bg-white">
                <input type="number" class="form-control" name=" nodes" id="nodesNA" placeholder="Number of Nodes" style="border:0px;" autocomplete="OFF" required>
            </div>
            <div class="form-group  my-0  mr-2 border smat-rounded d-flex px-2 py-1  bg-white">

                <select class="form-control" name="NAType" id="typeNA">
                    <option>Hashtag-Hashtag </option>
                    <option>Hashtag-Mentions </option>
                    <option>Mention-Mentions </option>
                </select>
            </div>
            <div class="form-group  my-0  mr-2 border smat-rounded d-flex px-2 py-1  bg-white">
                <i class="fas fa-cog ml-2 text-normal" style="margin-top:11px;"></i>
                <select class="form-control" name="NAEngine" id="networkEngineNA">
                    <option>Network X </option>
                    <option>Spark</option>
                </select>
            </div>
            <div class="d-flex">
                <button class="btn smat-btn  smat-rounded  mx-1" id="submit-btn" type="submit"> <span>Search</span> </button>
                <div class="mt-3 mx-2"> OR </div>
                <button class="btn smat-btn  smat-rounded  mx-1" onclick="return false" id="importNA"> <span>Import</span> </button>
            </div>
            <!-- <button class="btn  text-normal smat-rounded  mx-1" id="showTableBtn" onclick="return false"> <span> Show Search History </span> </button> -->
        </div>

    </form>
</div>
<div class="my-2">
    <div class="row" id="naCards">


    </div>
</div>
<div class="mt-2" id="naPanel">
    <div>
        <p class="smat-box-title-large m-0">Showing Results for <span class="smat-value font-weight-bold text-dark" id="naShowingResForTitle"> </span> </p>
    </div>

    <div class="smat-tabs">

        <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
            <li class="nav-item naTabs">
                <a class="nav-link active smat-rounded " id="netTabNA" data-toggle="pill" href="#netContentNA" role="tab" aria-controls="netContentNA" aria-selected="true">Network</a>
            </li>
            <li class="nav-item naTabs ">
                <a class="nav-link smat-rounded " id="unionTabNA" data-toggle="pill" href="#unionContentNA" role="tab" aria-controls="unionContentNA" aria-selected="false">Union</a>
            </li>
            <li class="nav-item naTabs ">
                <a class="nav-link smat-rounded " id="interSecTabNA" data-toggle="pill" href="#interSecContentNA" role="tab" aria-controls="interSecContentNA" aria-selected="false">Intersection</a>
            </li>
            <li class="nav-item naTabs ">
                <a class="nav-link smat-rounded " id="diffTabNA" data-toggle="pill" href="#diffContentNA" role="tab" aria-controls="diffContentNA" aria-selected="false">Difference</a>
            </li>

        </ul>

    </div>

    <div class="row">
        <div class="col-sm-3">
            <div class="card shadow">
                <div class="card-body">
                    <div>
                        <h4 class="m-0  font-weight-bold text-dark "> #coronavirus </h4>
                        <p class="m-0 text-dark "> From: <span class="font-weight-bold"> 2020-11-12</span> &nbsp To: <span class="font-weight-bold"> 2020-12-12</span> </p>
                        <p class="m-0  text-dark"> </p>


                    </div>
                    <div class="bg-smat mt-1">
                        <h1 class="m-0 text-dark "> 50</h1>
                        <p class="smat-normal-text" style="margin-top:-10px;margin-bottom:0px;"> Total number of Nodes </p>
                        <h1 class="m-0 text-dark "> 450</h1>
                        <p class="smat-normal-text" style="margin-top:-10px;margin-bottom:0px;"> Total number of Edges </p>

                    </div>
                </div>
            </div>
            <div class="card shadow mt-4">
                <div class="card-body" id='naSummary'>
                <div>
                        <h4 class="m-0  font-weight-bold text-dark ">  </h4>
                            //TODO::Summary comes here


                    </div>

                </div>
            </div>
        </div>
        <div class="col-sm-9">
            <div class="card shadow">
                <div class="card-body">
                    <div class="d-flex">
                        <div class="tab-content " id="pills-tabContent">

                            <div class="tab-pane fade show active " id="netContentNA" role="tabpanel" aria-labelledby="netContentNA">

                                <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                    <li class="nav-item naTabs-2">
                                        <a class="nav-link active smat-rounded " id="centralityTab" data-toggle="pill" href="#centralityContent" role="tab" aria-controls="centralityContent" aria-selected="true">Centrality</a>
                                    </li>
                                    <li class="nav-item naTabs-2 ">
                                        <a class="nav-link smat-rounded " id="communityTab" data-toggle="pill" href="#communityContent" role="tab" aria-controls="communityContent" aria-selected="false">Community Detection</a>
                                    </li>
                                    <li class="nav-item naTabs-2">
                                        <a class="nav-link smat-rounded " id="spTab" data-toggle="pill" href="#spContent" role="tab" aria-controls="spContent" aria-selected="false">Shortest Path</a>
                                    </li>
                                    <li class="nav-item naTabs-2 ">
                                        <a class="nav-link smat-rounded " id="lpTabNA" data-toggle="pill" href="#lpContent" role="tab" aria-controls="lpContent" aria-selected="false">Link Prediction</a>
                                    </li>

                                </ul>
                                <div class="tab-content " id="pills-tabContent">
                                    <div class="tab-pane fade show active " id="centralityContent" role="tabpanel" aria-labelledby="centralityContent">
                                        <div>
                                            <div class="text-dark mx-2">
                                                Select Centrality Algorithm Choice
                                            </div>
                                            <label class="radio-inline mx-2 "><input type="radio" name="optradio" checked>&nbsp Degree Centrality
                                            </label>
                                            <label class="radio-inline mx-2  "><input type="radio" name="optradio">&nbsp Page Rank Centrality
                                            </label>
                                            <label class="radio-inline mx-2  "><input type="radio" name="optradio">&nbsp Betweeness Centrality</label>
                                            <label class="radio-inline mx-2 "><input type="radio" name="optradio">&nbsp Eigen Value Centrality
                                            </label>
                                        </div>
                                    </div>
                                    <div class="tab-pane fade  p-1 " id="communityContent" role="tabpanel" aria-labelledby="communityContent">
                                        <div>
                                            <div class="text-dark mx-2">
                                                Select Community Algorithm Choice
                                            </div>
                                            <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                                <li class="nav-item naTabs-2 mx-2">
                                                    <a class="nav-link active smat-rounded " id="asyncFluidTab" data-toggle="pill" href="#asyncFluidContent" role="tab" aria-controls="asyncFluidContent" aria-selected="true">Async Fluidic
                                                    </a>
                                                </li>
                                                <li class="nav-item naTabs-2 mx-2 ">
                                                    <a class="nav-link  smat-rounded " id="labelPropTab" data-toggle="pill" href="#emptyContent" role="tab" aria-controls="emptyContent" aria-selected="true">Label Propagation
                                                    </a>
                                                </li>
                                                <li class="nav-item naTabs-2 mx-2">
                                                    <a class="nav-link  smat-rounded " id="grivanNewmanTab" data-toggle="pill" href="#emptyContent" role="tab" aria-controls="emptyContent" aria-selected="true">Grivan Newman
                                                    </a>
                                                </li>

                                                <ul>

                                        </div>

                                        <div class="tab-content " id="pills-tabContent">
                                            <div class="tab-pane fade show active " id="asyncFluidContent" role="tabpanel" aria-labelledby="asyncFluidContent">

                                                <form class="form-inline">
                                                    <div class="form-group   my-0  mr-2  border smat-rounded d-flex px-2   bg-white">

                                                        <input type="number" class="form-control smat-rounded  naInputs " id="noOfCommunities" placeholder="No. of Communities" style="border:0px;">
                                                    </div>

                                                    <button type="submit" class="btn btn-danger mt-1    mb-2 smat-rounded">Execute</button>
                                                </form>
                                            </div>
                                            <div class="tab-pane fade show active " id="emptyContent" role="tabpanel" aria-labelledby="emptyContent">


                                            </div>
                                        </div>
                                    </div>
                                    <div class="tab-pane fade  p-1 " id="spContent" role="tabpanel" aria-labelledby="spContent">
                                        <div class="d-flex">


                                            <div class="form-group pull-left mx-1">
                                                <label for="sourceSp">Source</label>
                                                <div class="border smat-rounded">
                                                    <input type="text" class="form-control  naInputs smat-rounded " id="sourceSp" placeholder="Enter source" style="border:0px;">
                                                </div>
                                            </div>
                                            <div class="form-group  mx-1">
                                                <label for="destSp">Destination</label>
                                                <div class="border smat-rounded">
                                                    <input type="text" class="form-control  naInputs smat-rounded " id="destSp" placeholder="Enter Destination" style="border:0px;">
                                                </div>
                                            </div>
                                            <div class="form-group mx-1">
                                                <label for="sourceSp">Select Algorithm</label>
                                                <select class="form-control border smat-rounded " name="NAEngine" id="networkEngineNA">
                                                    <option>
                                                        Shortest Path

                                                    </option>
                                                    <option>

                                                        K Possible Shortest Path/Depth

                                                    </option>
                                                    <option>All Possible Shortest Path</option>
                                                </select>
                                            </div>
                                            <div class="form-group mx-1">
                                                <button type="submit" class="btn btn-danger smat-rounded " style="margin-top:30px;">Execute</button>
                                            </div>
                                        </div>

                                        <div class="tab-content " id="pills-tabContent">
                                            <div class="tab-pane fade show  " id="kspContent" role="tabpanel" aria-labelledby="kspContent">
                                                Hello

                                            </div>
                                            <div class="tab-pane fade show  active " id="emptyContentSP" role="tabpanel" aria-labelledby="emptyContentSP">


                                            </div>
                                        </div>

                                    </div>
                                    <div class="tab-pane fade  p-1 " id="lpContent" role="tabpanel" aria-labelledby="lpContent">
                                        <div>
                                            <div class="text-dark mx-2">
                                                Select Link Prediction Algorithm
                                            </div>
                                            <label class="radio-inline mx-2 "><input type="radio" name="optradio" checked>&nbsp Adamic Adar
                                            </label>
                                            <label class="radio-inline mx-2  "><input type="radio" name="optradio">&nbsp Jaccard Coefficient
                                            </label>

                                        </div>
                                        <div>
                                            <div class="d-flex">


                                                <div class="form-group pull-left mx-1">

                                                    <div class="border smat-rounded">
                                                        <input type="text" class="form-control  naInputs smat-rounded " id="sourceSp" placeholder="Enter source" style="border:0px;">
                                                    </div>
                                                </div>
                                                <div class="form-group  mx-1">

                                                    <div class="border smat-rounded">
                                                        <input type="text" class="form-control  naInputs smat-rounded " id="destSp" placeholder="No. of links to be predicted" style="border:0px;">
                                                    </div>
                                                </div>

                                                <div class="form-group mx-1">
                                                    <button type="submit" class="btn btn-danger smat-rounded ">Execute</button>
                                                </div>
                                            </div>



                                        </div>
                                    </div>
                                </div>
                                <div class="networkDiv">
                                    //TODO:: Viz. Network Comes here
                                </div>
                            </div>
                            <div class="tab-pane fade text-center p-1    " id="unionContentNA" role="tabpanel" aria-labelledby="unionContentNA ">Union Content NA </div>
                            <div class="tab-pane fade  " id="interSecContentNA" role="tabpanel" aria-labelledby="interSecContentNA">interSecContentNA Tab</div>
                            <div class="tab-pane fade " id="diffContentNA" role="tabpanel" aria-labelledby="diffContentNA">Active Users Tab</div>

                        </div>
                        <div class="pull-right ml-auto">
                            <Button class="btn smat-btn smat-rounded"><span>Use Network</span></Button> <br/> <br/>
                            <Button class="btn smat-btn smat-rounded"><span>Expand Network</span></Button> <br/> <br/>
                            <Button class="btn smat-btn smat-rounded"><span>Export Network</span></Button> <br/> <br/>
                        </div>
                    </div>












                </div>
            </div>
        </div>
    </div>
</div>

<link href="public/tempCSS/vis.css" rel="stylesheet" />
<script type="text/javascript" src="public/tempJS/networkAnalysis/vis.js"></script>
<script type="module" src="public/tempJS/networkAnalysis/NetworkAnalysis.js"></script>
@endsection