export const forwardToNetworkAnalysis = (argsArr) => {
  window.open('networkAnalysis?query=' + argsArr[0] + '&from=' + argsArr[2] + '&to=' + argsArr[1] + '&uniqueID=' + argsArr[4] + '&relation=' + argsArr[3] + '&user=' + argsArr[5], '_blank');
}

export const forwardToHistoricalAnalysis = (query, from=null, to=null) => {
  let isLoggedIn = false;
  if(localStorage.getItem('smat.me')){
    isLoggedIn=true;
  }
  if (!isLoggedIn) {
    let urlTemp = encodeURIComponent(query);
    urlTemp = 'home?query=' + urlTemp;
    window.open(urlTemp, '_blank');
  } else {
    let urlTemp = encodeURIComponent(query) + '&from=' + encodeURIComponent(from) + '&to=' + encodeURIComponent(to);
    urlTemp = 'historicalAnalysis?query=' + urlTemp;
    window.open(urlTemp, '_blank');
  }
}

export const forwardToUserAnalysis = (query, from, to) => {
  query = encodeURIComponent(query);
  let redirectURL = 'userAnalysis' + '?query=' + query + '&from=' + from + '&to=' + to;
  window.open(redirectURL, '_blank');
}

