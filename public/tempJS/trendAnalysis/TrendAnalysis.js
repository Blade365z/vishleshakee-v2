//imports 
import { dateProcessor, getCurrentDate } from '../utilitiesJS/smatDate.js';
import { getTrendingDataFromController } from './helper.js';

//Global variable definitions 
var fromDate, toDate;
const categoryColor = { 'normal': 'text-normal', 'com': 'text-com', 'sec': 'text-sec', 'com_sec': 'text-com_sec' }


jQuery(function () {
    /*
    IMPORTANT NOTE::
    As we have limitations in the resources the software is dependednt upon , we are limiting the user to query for 3 days only
    for now.
    So we are currently doing this via the date input boxes.
    Another level of limitation could be applied in the server side scripts as well (TODO)
    */
    // $("#fromDateTA").datepicker({
    //     onSelect: function(dateCaptured) {
    //         console.log(dateCaptured);
    //     }
    // }); 
    toDate = getCurrentDate()
    fromDate = dateProcessor(toDate, '-', 0);
    $("#fromDateTA").datepicker({
        onSelect: function (dateCaptured) {
            let minDateTemp = dateCaptured;
            let maxDateTemp = dateProcessor(dateCaptured, '+', 2);
            $('#toDateTA').datepicker({
                minDate: new Date(minDateTemp),
                maxDate: new Date(maxDateTemp)
            });
        }
    });
    $("#fromDateTA").val(fromDate);
    $('#toDateTA').datepicker({
        minDate: new Date(fromDate),
        maxDate: new Date(dateProcessor(fromDate, '+', 2)),
    }).val(fromDate);


    generateTrendingTokensForTA(fromDate, toDate, 'top_hashtag', 'taResultsHashtags', 'all');
    generateTrendingTokensForTA(fromDate, toDate, 'top_mention', 'taResultsMentions', 'all');
    generateTrendingTokensForTA(fromDate, toDate, 'top_user', 'taResultsUsers', 'all');



    $('#taQueryInputs').on('submit', function (e) {
        e.preventDefault();
        fromDate = $('#fromDateTA').val();
        toDate = $('#toDateTA').val();
        generateTrendingTokensForTA(fromDate, toDate, 'top_hashtag', 'taResultsHashtags', 'all');
        generateTrendingTokensForTA(fromDate, toDate, 'top_mention', 'taResultsMentions', 'all');
        generateTrendingTokensForTA(fromDate, toDate, 'top_user', 'taResultsUsers', 'all');
    })





});





const generateTrendingTokensForTA = (from, to, option, div = null, filterArgument = null) => {
    console.log('Trending data from : ', fromDate + ' to ' + toDate);
    $('#' + div).html('');
    $('#' + div).html('<div class="text-center pt-5  m-auto" ><i class="  m-auto fa fa-circle-o-notch donutSpinner" aria-hidden="true"></i></div>')
    getTrendingDataFromController(from, to, option, 50).then(response => {

        $('#' + div).html('');

        let dataArr = response.data;
        const arrayTemp = response.data;
        if (option === 'top_hashtag' || option === 'top_mention') {
            for (const [key, value] of Object.entries(arrayTemp)) {
                if (filterArgument !== 'all') {
                    if (value[1] !== filterArgument) {
                        continue;
                    }
                }
                let category = (value[1] == 'normal') ? 'Normal' : ((value[1] == 'sec') ? 'Security' : ((value[1] == 'com') ? 'Communal' : 'Communal & Security'));
                $('#' + div).append('<div class="mb-1 publicHashtag-' + value[1] + '"><p class="hashtags"><a class="text-dark" href="historicalAnalysis?query=' + encodeURIComponent(key) + '&from=' + encodeURIComponent(from) + '&to=' + encodeURIComponent(to) + '" target="_blank"  >' + key + '</a></p><p class=" m-0 smat-dash-title  text-dark "> <span>' + value[0] + '</span><span class="mx-1">Tweets</span><span class="mx-1"   title ="' + category + '" ><i class="fa fa-circle ' + categoryColor[value[1]] + ' " aria-hidden="true"></i> </span></p></div>');
            }
        } else {
            arrayTemp.forEach(element => {
                    $('#' + div).append('<div class="mb-1 "><p class="hashtags"><a class="text-dark" href="userAnalysis?query=' + encodeURIComponent(element.id) + '&from=' + encodeURIComponent(from) + '&to=' + encodeURIComponent(to) + '" target="_blank"  >' + element.author_name + '</a></p><p class=" m-0 smat-dash-title  text-dark "> <span>' + element.count + '</span><span class="mx-1">Tweets</span></p></div>');
                });
            // 
        }
    })
}
