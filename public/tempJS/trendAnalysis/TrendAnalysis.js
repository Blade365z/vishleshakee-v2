import { getTweetIDsForHA } from '../historicalAnalysis/helper.js';
import { forwardToUserAnalysis ,forwardToHistoricalAnalysis} from '../utilitiesJS/redirectionScripts.js';
//imports 
import { dateProcessor, getCurrentDate } from '../utilitiesJS/smatDate.js';
import { makeSmatReady } from '../utilitiesJS/smatExtras.js';
import { TweetsGenerator } from '../utilitiesJS/TweetGenerator.js';
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
    makeSmatReady();
    $('.nav-item ').removeClass('smat-nav-active');
    $('#nav-TA').addClass('smat-nav-active');
    toDate = getCurrentDate()
    fromDate = dateProcessor(toDate, '-', 0);
    $("#fromDateTA").datepicker({
        onSelect: function (dateCaptured) {
            $("#toDateTA").val('');
            let minDateTemp = dateCaptured;
            let maxDateTemp = dateProcessor(dateCaptured, '+', 2);
            $('#toDateTA').datepicker({
                minDate: new Date(minDateTemp),
                maxDate: new Date(maxDateTemp)
            });
        }
    });
    $("#toDateTA").datepicker({
        onSelect: function (dateCaptured) {
            $("#fromDateTA").val('');
            let minDateTemp = dateCaptured;
            let maxDateTemp = dateProcessor(dateCaptured, '-', 2);
            $('#fromDateTA').datepicker({
                minDate: new Date(maxDateTemp),
                maxDate: new Date(minDateTemp)
            });
        }
    });
    $("#fromDateTA").val(fromDate);
    $('#toDateTA').datepicker({
        minDate: new Date(fromDate),
        maxDate: new Date(dateProcessor(fromDate, '+', 2)),
    }).val(fromDate);

    $('#trendTweets').html('<div class="text-center smat-loader " ><i class="fa fa-circle-o-notch donutSpinner mt-5" aria-hidden="true"></i></div>');
    generateTrendingTokensForTA(fromDate, toDate, 'top_hashtag', 'taResultsHashtags', 'all').then(queryTemp => {
        getTrendTweets(queryTemp,fromDate,toDate,'trendTweets');
    });
    generateTrendingTokensForTA(fromDate, toDate, 'top_mention', 'taResultsMentions', 'all');
    // generateTrendingTokensForTA(fromDate, toDate, 'top_user', 'taResultsUsers', 'all');



    $('#taQueryInputs').on('submit', function (e) {
        e.preventDefault();
        fromDate = $('#fromDateTA').val();
        toDate = $('#toDateTA').val();
        generateTrendingTokensForTA(fromDate, toDate, 'top_hashtag', 'taResultsHashtags', 'all').then(queryTemp => {
            getTrendTweets(queryTemp,fromDate,toDate,'trendTweets');
        });
        generateTrendingTokensForTA(fromDate, toDate, 'top_mention', 'taResultsMentions', 'all');
        // generateTrendingTokensForTA(fromDate, toDate, 'top_user', 'taResultsUsers', 'all');
    })
    $('body').on('click', 'div .username', function () {
        let queryCaptured = '$' + $(this).attr('value');
        forwardToUserAnalysis(queryCaptured,fromDate,toDate);
        console.log(queryCaptured);
      });
      $('body').on('click','div .query ',function(){
        let queryCaptured = $(this).text().trim();
        forwardToHistoricalAnalysis(queryCaptured,fromDate,toDate); 
    });
    $('body').on('click', 'div .trendTweets', function () {
        let queryCaptured = $(this).attr('value');
        getTrendTweets(queryCaptured,fromDate,toDate,'trendTweets')
    })


});





const generateTrendingTokensForTA = async (from, to, option, div = null, filterArgument = null) => {
    console.log('Trending data from : ', fromDate + ' to ' + toDate);
    $('#' + div).html('');
    $('#totalHashtags').html('<div class="text-center p-0 " ><i class="fa fa-circle-o-notch donutSpinner " aria-hidden="true"></i></div>')
    $('#totalMentions').html('<div class="text-center  p-0 " ><i class="fa fa-circle-o-notch donutSpinner " aria-hidden="true"></i></div>')
    $('#' + div).html('<div class="text-center pt-5  m-auto" ><i class="  m-auto fa fa-circle-o-notch donutSpinner" aria-hidden="true"></i></div>')

    let first = await getTrendingDataFromController(from, to, option, 50).then(response => {

        $('#' + div).html('');
        if(option==='top_hashtag'){
            $('#totalHashtags').text(response.nodes);
        }else if(option==='top_mention'){
            $('#totalMentions').text(response.nodes);
        }

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
                $('#' + div).append('<div class="mb-1  px-2 py-1 publicHashtag-' + value[1] + '"><button type="button" class="btn  bg-transparent  m-0 p-0  hashtags " data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' + key + '</button><div class="dropdown-menu  dropdown-menu-right"> <li class="dropdown-item clickable filter-pos-tweets filterTweets p-0 d-flex trendTweets"  value="' + key + '"> <span class="ml-2 "> Show Posts</span></li><li class="dropdown-item clickable filter-pos-tweets filterTweets p-0 d-flex" ><a class="w-100 ml-2 " href="historicalAnalysis?query=' + encodeURIComponent(key) + '&from=' + encodeURIComponent(from) + '&to=' + encodeURIComponent(to) + '" target="_blank"  > Analyse More </a></li> </div><p class=" m-0 smat-dash-title  text-dark "> <span>' + value[0] + '</span><span class="mx-1">Tweets</span><span class="mx-1"   title ="' + category + '" ><i class="fa fa-circle ' + categoryColor[value[1]] + ' " aria-hidden="true"></i> </span></p></div>');
            }
        } else {
            arrayTemp.forEach(element => {
                $('#' + div).append('<div class="mb-1 "><p class="hashtags"><a class="text-dark" href="userAnalysis?query=' + encodeURIComponent(element.id) + '&from=' + encodeURIComponent(from) + '&to=' + encodeURIComponent(to) + '" target="_blank"  >' + element.author_name + '</a></p><p class=" m-0 smat-dash-title  text-dark "> <span>' + element.count + '</span><span class="mx-1">Tweets</span></p></div>');
            });
            // 
        }
        return Object.keys(arrayTemp)[0]
    })
    return first;
}


const getTrendTweets = (query,fromDate,toDate,div) =>{ 
    $('#trendTweets').html('<div class="text-center smat-loader " ><i class="fa fa-circle-o-notch donutSpinner mt-5" aria-hidden="true"></i></div>')
    getTweetIDsForHA(query, fromDate, toDate).then(response => {
        $('#trendTweets').html('');
        $('#trendTweetsQuery').text(query);
        TweetsGenerator(response.data, 6, div, fromDate, toDate, false);
    })
} 

// {/* <a class="text-dark" href="historicalAnalysis?query=' + encodeURIComponent(key) + '&from=' + encodeURIComponent(from) + '&to=' + encodeURIComponent(to) + '" target="_blank"  > */} </a>