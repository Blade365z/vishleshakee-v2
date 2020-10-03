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




export const makeSuggestionsReady = async (div, limit) => {
    let date = getCurrentDate(); //TODO::Take current day here
    let gloabalArr;
    var suggestionsArr = [];
    gloabalArr = await getTopDataHA(date, date, 'top_hashtag', limit).then(response => {
        response = response.data;
      for (const [key, value] of Object.entries(response)) {
            suggestionsArr.push(key);
        }
        return suggestionsArr;
    });
    // gloabalArr = await getTopDataHA(date, date, 'top_mention', limit).then(response => {
    //     response = response.data;
    //   for (const [key, value] of Object.entries(response)) {
    //         suggestionsArr.push(key);
    //     }
    //     return suggestionsArr;
    // });
    makeDropDownReady(gloabalArr, div, 'suggestions');
    return gloabalArr;
}


export const makeDropDownReady = (array, div, name) => {
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
