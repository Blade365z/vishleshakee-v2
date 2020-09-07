<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>TEST DOMAIN</title>
    <script src="public/js/app.js" ></script>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link href="public/css/app.css" rel="stylesheet">
    <link href="public/datepicker/datepicker-min.css" rel="stylesheet">
    <link href="public/tempCSS/smat.css" rel="stylesheet">
    <link href="public/font-awesome/css/all.css" rel="stylesheet">
    </style>
</head>

<body>
<div class="container" id="main-wrapper">
        @include("inc.navbar")
        @include('inc.publicTweets')
        @include('inc.userSearchModal')
        @yield('content')
    </div>
    @include("inc.footer")
</body>


</html>
<script type="module" src="public/bootpag/bootpag-min.js"></script>
<script src="public/datepicker/datepicker-min.js"></script>
<script src="public/datepicker/datepicker-en.js"></script>