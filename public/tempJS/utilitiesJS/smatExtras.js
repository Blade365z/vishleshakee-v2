import { smatFeedbackMain } from './smatFeedback.js';
import { getTopDataHA } from '../historicalAnalysis/helper.js';

export const makeSmatReady = () => {
    $('body').on('click', 'div .closeGraph', function () {
        let graphCaptured = $(this).attr('value');
        $('.' + graphCaptured).remove();
    });
    //For Feedback Please execute this function
    smatFeedbackMain();

}




export const makeSuggestionsRead = async (div, type, limit) => {
    let date = '2020-09-18'; //TODO::Take current day here
    let gloabalArr;
    gloabalArr = await getTopDataHA(date, date, type, limit).then(response => {
        response = response.data;
        var suggestionsArr = [];

        for (const [key, value] of Object.entries(response)) {
            suggestionsArr.push(key);
        }
        // constructs the suggestion engine
        var suggestions = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.whitespace,
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            // `states` is an array of state names defined in "The Basics"
            local: suggestionsArr
        });
        let divTemp = '#' + div + '  ' + '.typeahead';
        $(divTemp).typeahead({
            hint: true,
            highlight: true,
            minLength: 1
        },
            {
                name: 'suggestions',
                source: suggestions
            });
        return suggestionsArr;

    });
    return gloabalArr;
}
