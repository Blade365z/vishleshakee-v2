@extends('parent.app')
@section('content')
<div class="smat-mainHeading ">
   Tweet Tracking
</div>

    <div class="row mt-1">
        <div class="col-sm-5">

            <div class="card">
                <div class="card-body">
                    <div id="tweetDiv-1">

                    </div>
                </div>
            </div>
            <div class="secondLevelCard  level-2" style="display:none">
                <svg height="100">
                    <line x1="275" y1="0" x2="275" y2="100" stroke="grey" stroke-width="2" />
                </svg>
                <div class="card " id="">
                    <div class="card-body">
                        <div class="text-center" id="secondTweetType">
                            <span class=" bg-normal  p-2 smat-rounded">
                                Re-Tweet
                            </span>
                        </div>
                        <div id="tweetDiv-2">

                        </div>
                    </div>
                </div>
            </div>

            <div class="thirdLevelCard level-3" style="display:none">
                <svg height="100">
                    <line x1="275" y1="0" x2="275" y2="100" stroke="grey" stroke-width="2" />
                </svg>
                <div class="card " id="">
                    <div class="card-body">
                        <div class="text-center" id="secondTweetType">
                            <span class=" bg-normal  p-2 smat-rounded">
                                Source-Tweet
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
                <p class="smat-box-title-large "> Showing Analysis For The <span type="button" class="sourceTweet font-weight-bold text-normal"> Source</span> Tweet </p>
            </div>
            <div class="card " id="">
                <div class="card-body">

                </div>
            </div>
        </div>
    </div>
    <script>
        var tweetIDCaptured = @json($tweetID ?? '');

    </script>
    <script type="module" src="public/tempJS/tweetTracking/tweetTracking.js"></script>
@endsection
