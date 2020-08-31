@extends('parent.app')
@section('content')
<div class="smat-mainHeading ">
    User Analysis
</div>
<div class="mb-3">
    <form id="naInputInputs">

        <div id="naInputPanel">
            <div class="form-group  text-normal  border smat-rounded d-flex  mr-2 px-2 py-1  bg-white" id="uaSearchInput">
                <i class="fa fa-search px-1 pt-2" aria-hidden="true" style="margin-top:5px"></i>
                <input type="text" class="form-control" name="query" id="queryNA" placeholder="Query" style="border:0px;" autocomplete="OFF" required>
            </div>



            <div class="d-flex">
                <button class="btn smat-btn  smat-rounded  mx-1 mb-3" id="submit-btn" type="submit"> <span>Search User</span> </button>
                <button class="btn text-normal smat-rounded  mx-1 mb-3 " onclick="return false;" id="showUAsugg"> Show Suggestions </button>
            </div>
            <!-- <button class="btn  text-normal smat-rounded  mx-1" id="showTableBtn" onclick="return false"> <span> Show Search History </span> </button> -->
        </div>

    </form>
</div>

<div class="row" id="suggDiv" style="display:none;">
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
<div class="mt-3">
    <p class="smat-box-title-large m-0">Showing Results for <span class="smat-value font-weight-bold text-dark"> Amitabh Boruah</span> </p>
    <form id="uaDateForm">
        <div class="d-flex">
            <div class="form-group  dateinputForm my-0  mr-2  border smat-rounded d-flex px-2 py-1  bg-white">
                <i class="far fa-calendar-alt mx-2 text-normal " style="margin-top:11px;"></i>
                <input type="text" class="form-control datepicker-here " name="fromDate" id="fromDateNA" placeholder="From Date" onkeydown="return false;" style="border:0px;" autocomplete="OFF" data-language='en' required>
            </div>
            <div class="form-group dateinputForm my-0  mr-2 border smat-rounded d-flex px-2 py-1  bg-white">
                <i class="far fa-calendar-alt mx-2 text-normal" style="margin-top:11px;"></i>
                <input type="text" class="form-control datepicker-here " name="toDate" id="toDateNA" placeholder="To Date" onkeydown="return false;" style="border:0px;" autocomplete="OFF" data-language='en' required>
            </div>

            <button class="btn  btn-primary  " id="submit-btn" type="submit" style="border-radius:50%;margin-top:5px;"> <span>Go </span> </button>

        </div>
    </form>
    <div>

    </div>
</div>
<div class="row mt-3">
    <div class="col-md-5">
        <div class="card shadow">
            <div class="card-body">
                <div class="dFlexBut">
                    <div class="text-center">
                        <img src="public/img/amitabh.jpg" class="profilePicLarge" />
                    </div>
                    <div class="mt-2">
                        <p class="userNameLarge mx-2 mb-0 text-dark">Amitabh Boruah</p>
                        <p class="userHandleLarge mx-2 mb-0 text-dark">@blade365z</p>
                    </div>


                </div>
                <div class="mt-3 table-responsive-xl" id="uaTable">
                    <table class="table table-borderless">

                        <tbody>
                            <tr>
                                <th class="py-0 px-3 text-dark" scope="row">User ID:</th>
                                <td class="p-0 text-dark ">321009</td>

                            </tr>
                            <tr>
                                <th class="py-0 px-3 text-dark " scope="row">Joined_On:</th>
                                <td class="p-0 text-dark ">Mon Marh 2016 15:21 +0000 2009</td>

                            </tr>
                            <tr>
                                <th class="py-0 px-3 text-dark" scope="row">Location:</th>
                                <td class="p-0 text-dark ">Guwahati,Assam</td>

                            </tr>
                            <tr>
                                <th class="py-0 px-3 text-dark" scope="row">Bio:</th>
                                <td class="p-0 text-dark ">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. </td>

                            </tr>
                            <tr>
                                <th class="py-0 px-3 text-dark" scope="row">Followers:</th>
                                <td class="p-0 text-dark ">631252 </td>

                            </tr>
                            <tr>
                                <th class="py-0 px-3 text-dark" scope="row">Following:</th>
                                <td class="p-0 text-dark ">11 </td>

                            </tr>
                            <tr>
                                <th class="py-0 px-3 text-dark" scope="row">Tweets:</th>
                                <td class="p-0 text-dark ">1122 </td>

                            </tr>
                            <tr>
                                <th class="py-0 px-3 text-dark" scope="row">URL:</th>
                                <td class="p-0 text-dark ">https://t.co/Qwkca100 </td>

                            </tr>
                        </tbody>
                    </table>

                </div>

            </div>
        </div>
    </div>
    <div class="col-md-7">
        <div class="card shadow">
            <div class="card-body">
                <div id="uaTweetsNav">


                </div>
                <div id="uaTweetsDiv">


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
                        <a class="nav-link active smat-rounded" id="frqTabUA" data-toggle="pill" href="#freqContentUA" role="tab" aria-controls="freqContentUA" aria-selected="true">Frequency</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link smat-rounded " id="sentiTabUA" data-toggle="pill" href="#sentiContentUA" role="tab" aria-controls="pills-profile" aria-selected="false">Sentiment</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link smat-rounded " id="mentionsTabUA" data-toggle="pill" href="#mentionsContentUA" role="tab" aria-controls="pills-contact" aria-selected="false">Top Mention</a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link smat-rounded " id="hashtagsTabUA" data-toggle="pill" href="#hashtagsContentTab" role="tab" aria-controls="pills-contact" aria-selected="false">Top Hashtags</a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link smat-rounded" id="locationTabUA" data-toggle="pill" href="#locationContentUA" role="tab" aria-controls="pills-contact" aria-selected="false">Locations</a>
                    </li>
                </ul>

            </div>
            <div class="tab-content" id="pills-tabContent">
                <div class="" id="summaryContent-1">

                </div>
                <div class="tab-pane fade show active haTab" id="freqContentUA" role="tabpanel" aria-labelledby="freqContentUA"> </div>
                <div class="tab-pane fade haTab " id="sentiContentUA" role="tabpanel" aria-labelledby="sentiContentUA">Sentiment </div>
                <div class="tab-pane fade haTab" id="mentionsContentUA" role="tabpanel" aria-labelledby="mentionsContentUA">Mentions Tab</div>
                <div class="tab-pane fade haTab" id="usersContentUA" role="tabpanel" aria-labelledby="usersContentUA">Active Users Tab</div>
                <div class="tab-pane fade haTab " id="hashtagsContentTab" role="tabpanel" aria-labelledby="hashtagsContentTab">hashtagsContentTab</div>
                <div class="tab-pane fade haTab " id="tweetsContentUA" role="tabpanel" aria-labelledby="tweetsContentUA">tweetsContentUA </div>
                <div class="tab-pane fade haTab " id="sensitivityContentUA" role="tabpanel" aria-labelledby="sensitivityContentUA">sensitivityContentUA </div>
                <div class="tab-pane fade haTab " id="locationContentUA" role="tabpanel" aria-labelledby="locationContentUA">locationContentUA </div>

            </div>


        </div>
    </div>



</div>
<script type="module" src="public/amcharts4/core.js"></script>
<script type="module" src="public/amcharts4/charts.js"></script>
<script type="module" src="public/tempJS/userAnalysis/UserAnalysis.js"></script>
@endsection