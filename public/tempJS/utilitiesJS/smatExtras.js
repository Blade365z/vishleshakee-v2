import { smatFeedbackMain } from './smatFeedback.js';
import { getTopDataHA } from '../historicalAnalysis/helper.js';
import { getCurrentDate } from '../utilitiesJS/smatDate.js';

export const makeSmatReady = () => {
    $('body').on('click', 'div .closeGraph', function () {
        let graphCaptured = $(this).attr('value');
        $('.' + graphCaptured).remove();
    });
    //For Feedback Please execute this function
    smatFeedbackMain();

}




export const makeSuggestionsRead = async (div, type, limit ) => {
    let date =getCurrentDate(); //TODO::Take current day here
    let gloabalArr;
    gloabalArr = await getTopDataHA(date, date, type, limit).then(response => {
        response = response.data;
        var suggestionsArr = [];

        for (const [key, value] of Object.entries(response)) {
            suggestionsArr.push(key);
        }
        makeDropDownReady(suggestionsArr,div,'suggestions');
        return suggestionsArr;

    });
    return gloabalArr;
}


export const makeDropDownReady = (array,div,name) =>{
            // constructs the suggestion engine
            var suggestions = new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.whitespace,
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                // `states` is an array of state names defined in "The Basics"
                local: array
            });
            let divTemp = '#' + div + '  ' + '.typeahead';
            $(divTemp).typeahead({
                hint: true,
                highlight: true,
                minLength: 1
            },
                {
                    name: name,
                    source: suggestions
                });
}
