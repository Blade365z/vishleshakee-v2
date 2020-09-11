import {wordCloudLM} from './chartHelper.js';
import {getLocationMonitorMap,get_current_time} from './helper.js';


$(document).ready(function(){
    
    
    
    var global_datetime,
        from_datetime,
        to_datetime;
    global_datetime = get_current_time();
    from_datetime = global_datetime[1];
    to_datetime = global_datetime[0];
    

    



    getLocationMonitorMap('lmMap');

    var timeLimit = parseInt($("#lmInterval :selected").val());
    var place = $("#queryLM").val();
    localStorage.setItem("lmTefreshType", "manual");

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
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