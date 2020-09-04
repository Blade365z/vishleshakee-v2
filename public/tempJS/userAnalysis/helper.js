export const getSuggestionsForUA = (userIDArray) => {
    let userSuggestionRes;
     $.ajax({
        type: "GET",
        url: 'UA/getSuggestedUsers',
        contentType: "application/json",
        data: {userIDArray},
        dataType: "json",
        async:false,
        success: function (response) {
            userSuggestionRes = response;    
            }
    });
return userSuggestionRes;
}


export const getUserDetails= (id) => {
    
}