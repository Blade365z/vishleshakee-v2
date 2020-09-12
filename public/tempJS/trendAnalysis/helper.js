

//API HEADERS for the http api requests
var HeadersForApi = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
};

export const getTrendingDataFromController = async (from, to, option, limit) => {
    let dataArgs = JSON.stringify({
        from, to, option, limit
    });
    let response = await fetch('TA/getTopTrending', {
        method: 'post',
        headers: HeadersForApi,
        body: dataArgs
    })
    let data = await response.json();
    return data;
}