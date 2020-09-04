//User Analysis Logic For Vishleshakee version 2.0 , Deployed by OSINT Lab ,IIT-G
//Witten By :: Mala Das , Amitabh Boruah 



//Imports
import { generateFreqDistChart, generateSentimentChart, generateBarChart } from './chartHelper.js';
import { formulateUserSearch } from '../utilitiesJS/userSearch.js'
import { getSuggestionsForUA ,getUserDetails} from './helper.js'


//Global Declaration
var suggestionPopularIDs = ['$18839785', '$1447949844', '$1346439824', '$405427035', '$3171712086', '$1153045459', '$24705126', '$131188226', '$2570829264', '$207809313', '$2584552812', '$336611577', '$841609973687762944', '$4743651972', '$2166444230', '$3314976162', '$627355202', '$295833852', '$97217966', '$478469228', '$2541363451', '$39240673'];

var suggestionPopularNewsHandleIDs = ['$19897138', '$16343974', '$39240673', '$240649814', '$42606652', '$321271735', '$372754427', '$6509832', '$6433472', '$36327407', '$37034483', '$20751449', '$112404600', '$438156528', '$739053070932287488', '$267158021', '$128555221', '$742143', '$759251', '$701725963', '$55186601', '$28785486'];
var SearchID;   //Global Variable to keep Track of current search












//Logic Implementation 
$(document).ready(function () {
    $('.nav-item ').removeClass('smat-nav-active');
    $('#nav-UA').addClass('smat-nav-active');
    generateSuggestions(suggestionPopularIDs, 'suggUsers','users')
    generateSuggestions(suggestionPopularNewsHandleIDs, 'suggNews','news')
    // generateSuggestions(null, 'suggNews')
    generateTweets('uaTweetsDiv')
    let tweetDivHeight = $('#userInfoDiv').height();
    generateFreqDistChart(null, 'freqContentUA');
    freqSummaryGenerator(null, null);
    $('#uaSearchForm').on('submit', function (e) {
        e.preventDefault();
        let tokenCapturedForSearch = $('#queryUASearch').val();
        tokenCapturedForSearch = tokenCapturedForSearch.trim();
        formulateUserSearch(tokenCapturedForSearch, 'userContainerList');
    });


    $('.suggHandles').on('click',function(){
        let capturedToken = $(this).attr('value');
        initateUserSearch(capturedToken);
    })


    $('#uaTweetsDiv').css('height', tweetDivHeight - 10 + 'px');
    $('#frqTabUA').on('click', function () {
        generateFreqDistChart(null, 'freqContentUA');
        freqSummaryGenerator(null, null);
    });
    $('#sentiTabUA').on('click', function () {
        generateSentimentChart(null, 'sentiContentUA');
        generateSentimentSummary(null, 'summaryContent-1', 'hour');
    });

    $('#mentionsTabUA').on('click', function () {
        generateBarChart(null, 'mentionsContentUA');
        generateBarChartSummary(null, 'summaryContent-1', 'hour');
    });
    let suggShowFLag = 0;
    $('#showUAsugg').on('click', function () {
        if (suggShowFLag == 0) {
            $('#suggDiv').css('display', 'flex');
            suggShowFLag = 1;
        } else {
            $('#suggDiv').css('display', 'none');
            suggShowFLag = 0;
        }

    });
});

const generateSuggestions = (userIDArray, div, type = null) => {
    let cookie = 'smat-'+type+'-suggestionJSON';
    let helperResult;
    if(localStorage.getItem(cookie)){
         helperResult = JSON.parse(localStorage.getItem(cookie));
    }else{
         helperResult = getSuggestionsForUA(userIDArray);
         localStorage.setItem(cookie,JSON.stringify(helperResult));
        }
    let counter = 0;
    let index = 1;
    helperResult.forEach(element => {
        counter++;
        if (counter === 12)
            index = 2
        $('#' + div + '-' + index).append('<div class="suggHandles" title="'+element[1]+'"  value="'+element[0]+'"> <img src="' + element[3] + '" class="profilePicSmall UAProfilePicture" /> </div>');
    });

}




const initateUserSearch = (id) => {
    SearchID = id
    let userDetals = getUserDetails(SearchID);
    
}










export const generateTweets = (div) => {
    $('#uaTweetsNav').html('<span class="text-dark mr-4" > Tweets posted by the user</span> <div class="btn-group"><button type="button" class="btn btn-white smat-rounded dropdown-toggle text-normal" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Filter Tweets</button><div class="dropdown-menu dropdown-menu-right"><li class="dropdown-item clickable filter-pos-tweets"><i class="fa fa-circle text-pos " aria-hidden="true"></i> Positive Tweets</li><li class="dropdown-item clickable filter-neg-tweets"><i class="fa fa-circle text-neg " aria-hidden="true"></i> Negative Tweets</li><li class="dropdown-item clickable filter-neu-tweets"> <i class="fa fa-circle text-neu" aria-hidden="true"></i> Neutral Tweets</li><li class="dropdown-item clickable filter-normal-tweets"> <i class="fa fa-circle text-normal" aria-hidden="true"></i> Normal Tweets</li><li class="dropdown-item clickable filter-com-tweets"> <i class="fa fa-circle text-com" aria-hidden="true"></i> Communal Tweets</li><li class="dropdown-item clickable filter-sec-tweets"> <i class="fa fa-circle text-sec" aria-hidden="true"></i> Security Tweets</li><li class="dropdown-item clickable filter-seccom-tweets"> <i class="fa fa-circle text-seccom" aria-hidden="true"></i> Communal and Security Tweets</li></div></div>');
    $('#' + div).html("");
    for (let i = 0; i < 7; i++) {
        $('#' + div).append('<div class="border p-2 "><div class="d-flex"><div class="profilePictureDiv p-1 text-center"><img src="public/img/amitabh.jpg" style="height:33px;border-radius:50%" /></div><div> <p class="pt-1 m-0 font-weight-bold"> Amitabh Baruah </p><p class="smat-dash-title pull-text-top m-0 "> @amitabh.baruah12 </p></div> <div class="px-1 pt-1" >  <i class="fa fa-circle text-sec" aria-hidden="true"></i>   <i class="fa fa-circle text-neg" aria-hidden="true"></i> </div></div><div style="width:80%;"><p class="smat-tweet-body-text mb-1">It is so sad indeed what happened recently at #GalwanValley . My sincere condolences to the bereaved families. It is time to teach china a lesson . #IndianArmy #JaiHind #ShameOnChina </p></div><div class="d-flex"><p class="m-0 smat-tweet-body-text font-weight-bold"> <span>  2020-03-12  &nbsp </span> <span> Guwahati, India</span> &nbsp  <span class="text-normal clickable"> Track Tweet</span>   </p> </div></div>');
    }


}


const freqSummaryGenerator = (data = null, div = null) => {
    $('#summaryContent-1').html('<div class="d-flex px-4"><div><p class=" smat-box-title-large m-0 font-weight-bold text-dark ">23312</p><p class="pull-text-top m-0 smat-dash-title ">Tweets Arrived</p></div><div class="mx-2"><p class=" smat-box-title-large m-0 font-weight-bold text-dark ">4430</p><p class="pull-text-top m-0 smat-dash-title ">on 23 May 2020</p></div></div>')

}

const generateSentimentSummary = (data = null, div, range) => {
    $('#' + div).html('<div class="sentiSummaryDiv" id="sentiSummary' + range + '" ><div class="removeMarginMediaQuery"  > <div  id="sentiSummaryBar-' + range + '" ></div> </div><div> <div class="d-flex "><div><p class=" smat-box-title-large m-0 font-weight-bold text-dark ">23312</p><p class="pull-text-top m-0 smat-dash-title ">Positive</p></div><div class="mx-2"><p class=" smat-box-title-large m-0 font-weight-bold text-dark ">4430</p><p class="pull-text-top m-0 smat-dash-title ">Negative</p></div><div class="mx-2"><p class=" smat-box-title-large m-0 font-weight-bold text-dark ">4430</p><p class="pull-text-top m-0 smat-dash-title ">Neutral</p></div></div></div></div>');
    let dummyData = [2330, 1223, 999];
    generateSentimentSummaryBar(dummyData, "sentiSummaryBar-" + range, 'hour')
}


const generateSentimentSummaryBar = (sentiTotalArray, div, range_type) => {

    let total_pos = sentiTotalArray[0];
    let total_neg = sentiTotalArray[1];
    let total_neu = sentiTotalArray[2];

    $('#' + div).html('<div class="row  p-1"> <span style="display: inline-block;"><div class=" sentiment_bar_summary border sentiment_bar_pos" id="' + div + '_bar_' + range_type + '_pos" data-toggle="popover"  data-content="' + total_pos + ' Positive Tweets posted"></div> </span> <span style=" display: inline-block;"><div class="  sentiment_bar_summary border sentiment_bar_neu "  id="' + div + '_bar_' + range_type + '_neu" data-toggle="popover" data-content="' + total_neu + ' Neutral Tweets posted"></div>  </span> <span style=" display: inline-block;"><div class=" sentiment_value_neg sentiment_bar_summary border sentiment_bar_neg"  id="' + div + '_bar_' + range_type + '_neg"data-toggle="popover"  data-content="' + total_neg + ' Negative Tweets posted"></div></span></div ><div class="row"><span>  <a class="senti_summary_bar_text"  id="' + div + '_value_' + range_type + '_pos" >23%</a>  </span><span> <a  class="senti_summary_bar_text"  id="' + div + '_value_' + range_type + '_neu" >48%</a>   </span> <span><a class="senti_summary_bar_text"  id="' + div + '_value_' + range_type + '_neg" >29%</a></span>');

    var total = total_pos + total_neg + total_neu;


    var pos = Math.round((total_pos / total) * 100);
    var neg = Math.round((total_neg / total) * 100);
    var neu = Math.round((total_neu / total) * 100);


    $('#' + div + '_bar_' + range_type + '_pos').css('width', pos + 'px');
    $('#' + div + '_bar_' + range_type + '_neg').css('width', neg + 'px');
    $('#' + div + '_bar_' + range_type + '_neu').css('width', neu + 'px');

    $('#' + div + '_value_' + range_type + '_pos').css('margin-left', (pos / 4) + 'px');
    $('#' + div + '_value_' + range_type + '_neg').css('margin-left', (neg / 4) + 5 + 'px');
    $('#' + div + '_value_' + range_type + '_neu').css('margin-left', (neu / 4) + 5 + 'px');


    $('#' + div + '_value_' + range_type + '_pos').text(pos + '%');
    $('#' + div + '_value_' + range_type + '_neg').text(neg + '%');
    $('#' + div + '_value_' + range_type + '_neu').text(neu + '%');


}


const generateBarChartSummary = (data = null, div, range) => {
    $('#' + div).html('<div class="d-flex"><div> </div><div class="removeMarginMediaQuery" ><button class="btn smat-btn smat-rounded"><span>Analyze Network</span></button></div><div><p class=" smat-box-title-large m-0 font-weight-bold text-dark ">43430</p><p class="pull-text-top m-0 smat-dash-title ">Total Entities</p> </div></div>');

}
