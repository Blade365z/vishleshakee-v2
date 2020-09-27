@extends('parent.app')
@section('content')
    <div class="smat-mainHeading ">
        Feedbacks
    </div>
    <div>
        <div id="date-divFeedback">
            <form id="feedbackDateForm">
                <div class="d-flex mb-3">
                    <div class="form-group   my-0  mr-2  border smat-rounded d-flex px-2 py-1  bg-white">
                        <i class="far fa-calendar-alt mx-2 text-normal " style="margin-top:11px;"></i>
                        <input type="text" class="form-control datepicker-here  smat-from" name="fromDate" id="fromDateFeedback"
                            placeholder="From Date" onkeydown="return false;" style="border:0px;"
                            autocomplete="OFF" data-language='en' required>
                    </div>
                    <div class="form-group  my-0  mr-2 border smat-rounded d-flex px-2 py-1  bg-white">
                        <i class="far fa-calendar-alt mx-2 text-normal" style="margin-top:11px;"></i>
                        <input type="text" class="form-control datepicker-here smat-to " name="toDate" id="toDateFeedback"
                            placeholder="To Date" onkeydown="return false;" style="border:0px;"
                            autocomplete="OFF" data-language='en' required>
                    </div>
                    <button class="btn  btn-primary smat-rounded " id="submit-btn" type="submit"> <span>Search </span> </button>

                </div>
            </form>
        </div>
        <div class="card shadow">
            <div class="card-body">
                <div class="row">
                    <div class="col-md-12 ">
                        <div class="py-3 px-2" id="feedbackDiv">
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th scope="col">ID</th>
                                        <th scope="col">User</th>
                                        <th scope="col">Tweet</th>
                                        <th scope="col">Category</th>
                                        <th scope="col">Original Tag</th>
                                        <th scope="col">Feedback Tag</th>
                                        <th scope="col">Created At</th>
                                    </tr>
                                </thead>
                                <tbody id="feedbackTable">
                                  
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {{-- <div class="col-md-0 border">
                        <div id="feedbackUsers">


                        </div>
                    </div> --}}
                </div>

            </div>
        </div>

    </div>
    <script type="module" src="public/tempJS/feedbackPortal/feedbackPortal.js"></script>
@endsection
