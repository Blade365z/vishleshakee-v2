import {wordCloudLM} from './chartHelper.js';
$(document).ready(function(){
    $('.nav-item ').removeClass('smat-nav-active');
    $('#nav-LM').addClass('smat-nav-active');
    wordCloudLM('trendingLM');
    $('#lmInputs').on('submit',function(e){
        e.preventDefault();
        let LocTemp = $('#queryLM').val();
        $('.currentSearch').text(LocTemp);
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $("#lmPanel").offset().top
        }, 200);

    });
});