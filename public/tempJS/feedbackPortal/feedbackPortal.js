//Imports
import { getCurrentDate, getRangeType, dateProcessor } from '../utilitiesJS/smatDate.js';
import {getFeedbackData,getUserName} from './helper.js';

//Global Definitions
var fromDate,toDate;
//Logic
jQuery(function () {
    toDate = getCurrentDate();
    fromDate = dateProcessor(toDate, '-', 30);
    $('#fromDateFeedback').val(fromDate);
    $('#toDateFeedback').val(toDate);
    populateAllFeedbacks(fromDate,toDate);
    $('#feedbackDateForm').on('submit',function(e){
        e.preventDefault();
        fromDate=$('#fromDateFeedback').val();
        toDate=$('#toDateFeedback').val();
        populateAllFeedbacks(fromDate,toDate);
    })
});

const populateAllFeedbacks = (fromDate,toDate,userFilter=null,categoryFilter=null) => {
    getFeedbackData(fromDate,toDate).then(response=>{
       plotFeedbacks(response);
    console.log(response);
    })
}

const tagsToTitleDict = {0:'Positive',1:'Negative',2:'Neutral','normal':'Normal','sec':'Security','com':'Communal','com_sec':'Communal & Security'};
const plotFeedbacks= (response)=>{
    let category='';
    $('#feedbackTable').html('');
   response.forEach(element => {
    $('#feedbackTable').append('<tr><th scope="row">'+element['id']+'</th><td class="'+element['userID']+'-uname">'+userIDtoUser(element['userID'])+'</td><td>'+element['tweetID']+'</td><td>'+element['feedbackType']+'</td><td>'+tagsToTitleDict[element['originalTag']]+'</td><td>'+tagsToTitleDict[element['feedbackTag']]+'</td><td>'+element['created_at']+'</td></tr>');
   });
 
}

const userIDtoUser = (id) => {
    getUserName(id).then(response=>{
        $('.'+id+'-uname').text(response)
    })
}