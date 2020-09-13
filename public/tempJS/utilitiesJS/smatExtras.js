import {smatFeedbackMain} from './smatFeedback.js';


export const makeSmatReady = () => {
    $('body').on('click', 'div .closeGraph', function () {
        let graphCaptured = $(this).attr('value');
        $('.' + graphCaptured).remove();
    });
    //For Feedback Please execute this function
    smatFeedbackMain();
    $('body').on('click','div .username',function(){ 
        let queryCaptured=  '$'+$(this).attr('value');
        queryCaptured=encodeURIComponent(queryCaptured);
        let redirectURL = 'userAnalysis'+'?query='+queryCaptured;
        window.open(redirectURL, '_blank');
    })




}




export const makeSuggestionsRead = (array,div) => {
    var suggestionsArr=[];
 
    for (const [key, value] of Object.entries(array)) {
        suggestionsArr.push(key);
    }
    console.log(suggestionsArr);
    // constructs the suggestion engine
    var suggestions = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.whitespace,
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        // `states` is an array of state names defined in "The Basics"
        local: suggestionsArr
    });
    let divTemp = '#'+div+'  '+'.typeahead';
    $(divTemp).typeahead({
        hint: true,
        highlight: true,
        minLength: 1
    },
        {
            name: 'suggestions',
            source: suggestions
        });
}
