//API HEADERS for the http api requests
var HeadersForApi = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
};

export const getFeedbackData = async (from = null, to = null, userFilter = null, categoryFilter = null) => {
    let dataArgs = JSON.stringify({
        from,to
    })
    console.log(dataArgs)
    let response = await fetch('extractFeedbacks', {
        method: 'post',
        headers: HeadersForApi,
        body: dataArgs
    });
    let data = await response.json()
    return data;
}
export const getUserName = async(id) => {
    let dataArgs = JSON.stringify({
        id
    })
    let response = await fetch('smat/getUserNameFromID', {
        method: 'post',
        headers: HeadersForApi,
        body: dataArgs
    });
    let data = await response.json()
        return data.data;
}