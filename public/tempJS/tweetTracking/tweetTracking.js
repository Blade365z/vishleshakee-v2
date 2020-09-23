/*
The Script contains the modules to render charts in Modules namely Tweet Tracking (Authunticated) of  of the Social Media Analysis tool 
developed at OSINT LAB , IIT-G

-----------------------------
IMPORTANT NOTE
-----------------------------
1.Use camelCase notations:)
2.Avoid using synchronous requests as XML-http-requests has been deprecated already.


Script written by : Mala Das(maladas601@gmail.com), Amitabh Boruah(amitabhyo@gmail.com)
*/


/*
Test ID's:
1. Retweet : 3257530106
2. Quoted : "1303260892776128512"
"1303260804653883397"
retweet,reply,tweet,quotedTweet
*/

import { get_tweets_info_AjaxRequest, generate_tweets_div } from '../utilitiesJS/TweetGenerator.js';
import { getTweetInfo,getTweetRAWTEMP } from './helper.js'
//Globals
var tweetDiv = 'tweetDiv';
var currentQuery;
var divOffsetFlag = 0; //As in offset 0 the currently searched Tweet would be printed;
//Logic
jQuery(function () {
    if (tweetIDCaptured) {
        currentQuery = tweetIDCaptured;
    } else {
        console.log('Nothing capt.')
    }
    findHistoryIDs(tweetIDCaptured);
});

let sourceArray = [];
//This function is currently performning in recurssion. Please check if there are other methods.!
const findHistoryIDs = (searhIDTemp) => {
    getTweetInfo(searhIDTemp).then(response => {
        let type = '', tempArr;
        if (response.type === 'Tweet') {
            type = 'Tweet';
            tempArr = { 'id': searhIDTemp, 'type': type, 'source': null }
            sourceArray.push(tempArr);
            printTweetOnDiv(response,3,type);

        } else if (response.type === 'retweet') {
            type = 'retweet';
            tempArr = { 'id': searhIDTemp, 'type': type, 'source': response.retweet_source_id }
            sourceArray.push(tempArr);
            let offset  = divOffsetFlag === 0 ? 1 : 2 ;
            printTweetOnDiv(response,offset,type);
            findHistoryIDs(response.retweet_source_id)
        } else if (response.type === "QuotedTweet") {
            type = 'QuotedTweet';
            tempArr = { 'id': searhIDTemp, 'type': type, 'source': response.quoted_source_id }
            sourceArray.push(tempArr);
            let offset  = divOffsetFlag === 0 ? 1 : 2 ;
            printTweetOnDiv(response,offset,type);
            findHistoryIDs(response.quoted_source_id)

        } else if (response.type === "Reply") {
            type = 'Reply';
            tempArr = { 'id': searhIDTemp, 'type': type, 'source': response.replyto_source_id }
            sourceArray.push(tempArr);
            let offset  = divOffsetFlag === 0 ? 1 : 2 ;
            printTweetOnDiv(response,offset,type);
            findHistoryIDs(response.replyto_source_id)

        }
    });

    console.log(sourceArray);
}


const printTweetOnDiv = (data,offset,type) => {
    divOffsetFlag=1; //TODO check left for source.
    $('.level'+'-'+offset).css('display','block');
    let divTemp =tweetDiv+'-'+offset;
    data = [data];
    getTweetRAWTEMP(data,divTemp,true);
}