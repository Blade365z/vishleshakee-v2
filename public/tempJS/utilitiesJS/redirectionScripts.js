 export const forwardToNetworkAnalysis = (argsArr) => {
    console.log(argsArr);
    window.open('networkAnalysis?query='+argsArr[0]+'&from='+argsArr[2]+'&to='+argsArr[1]+'&uniqueID='+argsArr[4]+'&relation='+argsArr[3]+'&user='+argsArr[5],'_blank');
 }