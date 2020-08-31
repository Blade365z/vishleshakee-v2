
let  Tempdata = [{ 'token': '#SushantSinghRajput', 'count': 2344, 'color': '#297EB4' },
    { 'token': '#coronavirus', 'count': 1244, 'color': '#ff0061' },
    { 'token': '#bantiktok', 'count': 4544, 'color': '#297EB4' },
    { 'token': '#iitguwahati', 'count': 1244, 'color': '#3D3D3D' },
    { 'token': '#covid19', 'count': 4244, 'color': '#FF00FF' },
    { 'token': '#IndiaWantsCBIInvestigation', 'count': 3344, 'color': '#3D3D3D' },
    { 'token': '#hello123', 'count': 832, 'color': '#FF00FF' },
    { 'token': '#python', 'count': 1232, 'color': '#ff0061' },
    { 'token': '#indiavschina', 'count': 1111, 'color': '#3D3D3D' },
    ,{ 'token': '#iitguwahati', 'count': 2244, 'color': '#3D3D3D' },
    { 'token': '#TIKTOK', 'count': 2211, 'color': '#FF00FF' },
    { 'token': '#SSR', 'count': 2013, 'color': '#3D3D3D' },
    { 'token': '#galwanValley', 'count': 832, 'color': '#ff0061' },
    { 'token': '#IndianArmy', 'count': 1922, 'color': '#3D3D3D' },
    { 'token': '#indiaVSchinaarmy', 'count': 1711, 'color': '#ff0061' },
    ];

    let  TempdataMentions = [{ 'token': '@SushantSinghRajput', 'count': 2344, 'color': '#297EB4' },
    { 'token': '@amitshah', 'count': 1244, 'color': '#ff0061' },
    { 'token': '#@narendramodi', 'count': 4544, 'color': '#297EB4' },
    { 'token': '@amaitabhboruah', 'count': 1244, 'color': '#3D3D3D' },
    { 'token': '@sanjaydutt', 'count': 4244, 'color': '#FF00FF' },
    { 'token': '@shashitharoor', 'count': 3344, 'color': '#3D3D3D' },
    { 'token': '@donaldtrump', 'count': 832, 'color': '#FF00FF' },
    { 'token': '@jsconf', 'count': 1232, 'color': '#ff0061' },
    { 'token': '@boat', 'count': 1111, 'color': '#3D3D3D' },
    ,{ 'token': '@xiaomi_ind', 'count': 2244, 'color': '#3D3D3D' },
    { 'token': '@republic', 'count': 2211, 'color': '#FF00FF' },
    { 'token': '@hindustantimes', 'count': 2013, 'color': '#3D3D3D' },
    { 'token': '@mha', 'count': 832, 'color': '#ff0061' },
    { 'token': '@himantabiswasarma', 'count': 1922, 'color': '#3D3D3D' },
    { 'token': '@ndtc', 'count': 1711, 'color': '#ff0061' },
    ];


    let  TempdataKeywords = [{ 'token': 'SushantSinghRajput', 'count': 2344, 'color': '#297EB4' },
    { 'token': 'coronavirus', 'count': 1244, 'color': '#ff0061' },
    { 'token': 'bantiktok', 'count': 4544, 'color': '#297EB4' },
    { 'token': 'iitguwahati', 'count': 1244, 'color': '#3D3D3D' },
    { 'token': 'covid19', 'count': 4244, 'color': '#FF00FF' },
    { 'token': 'IndiaWantsCBIInvestigation', 'count': 3344, 'color': '#3D3D3D' },
    { 'token': 'hello123', 'count': 832, 'color': '#FF00FF' },
    { 'token': 'python', 'count': 1232, 'color': '#ff0061' },
    { 'token': 'indiavschina', 'count': 1111, 'color': '#3D3D3D' },
    ,{ 'token': 'iitguwahati', 'count': 2244, 'color': '#3D3D3D' },
    { 'token': 'TIKTOK', 'count': 2211, 'color': '#FF00FF' },
    { 'token': 'SSR', 'count': 2013, 'color': '#3D3D3D' },
    { 'token': 'galwanValley', 'count': 832, 'color': '#ff0061' },
    { 'token': 'IndianArmy', 'count': 1922, 'color': '#3D3D3D' },
    { 'token': 'indiaVSchinaarmy', 'count': 1711, 'color': '#ff0061' },
    ];

$(document).ready(function(){
    $('.nav-item ').removeClass('smat-nav-active');
    $('#nav-TA').addClass('smat-nav-active');
    Tempdata.forEach(element => {
        $('#taTopHashtags').append('<div class="mb-1"><p class=hashtags font-weight-bold ">'+element['token']+'</p><p class=" m-0 smat-dash-title text-muted"> <span>12366</span><span class="mx-1">Tweets</span><span class="mx-1" > <i class="fa fa-circle text-sec" aria-hidden="true" style="color:'+element['color']+'"></i> </span></p></div>');
    });
    TempdataMentions.forEach(element => {
        $('#taResultsMentions').append('<div class="mb-1"><p class=hashtags font-weight-bold ">'+element['token']+'</p><p class=" m-0 smat-dash-title text-muted"> <span>12366</span><span class="mx-1">Tweets</span></p></div>');
    });
    TempdataKeywords.forEach(element => {
        $('#taResultsKeywords').append('<div class="mb-1"><p class=hashtags font-weight-bold ">'+element['token']+'</p><p class=" m-0 smat-dash-title text-muted"> <span>12366</span><span class="mx-1">Tweets</span></p></div>');
    });
})