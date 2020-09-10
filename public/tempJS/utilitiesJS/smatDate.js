
/*
The Script contains the modules for logic related to Dates  of the Social Media Analysis tool 
developed at OSINT LAB , IIT-G

-----------------------------
IMPORTANT NOTE
-----------------------------
1.Use camelCase notations:)
2.PLEASE NOTE that the range types are :: 1. days , 2.hour , 3.10sec
3.Avoid using synchronous requests as XML-http-requests has been deprecated already.

-------------
Exception 
-------------
1.We are considering Local Time instead of UTC.  


Script written by : Mala Das(maladas601@gmail.com), Amitabh Boruah(amitabhyo@gmail.com)
*/


export const getCurrentDate = (format = 'Y-m-d', utc = false) => {
    var currentDate11;
    var d = new Date();
    currentDate11 = getDateInFormat(d, 'Y-m-d', utc);
  
    return currentDate11;
}

export const  dateProcessor = (date=null,operator,offset) => {
    var dateObj = new Date(date);
    if(operator==='+')
    dateObj.setDate(dateObj.getDate()+offset);
    else if(operator==='-')
    dateObj.setDate(dateObj.getDate()-offset);
     date = getDateInFormat(dateObj, 'Y-m-d');
    return date;
}

export const getDateRange = (startDate, stopDate) => {
    var startDate = new Date(startDate);
    var stopDate = new Date(stopDate);
    Date.prototype.addDays = function (days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push(getDateInFormat(currentDate, 'Y-m-d'));
        currentDate = currentDate.addDays(1);
    }
    return dateArray;
}

export const getRangeType = (from_date, to_date, to_time = null) => {
    var diff = (Date.parse(to_date) - Date.parse(from_date)) / 86400000;
    var range_type;
    if (diff < 0) {
        console.log('Invalid Dates')
        return 0;
    }
    else if (diff == 0) {
        if (to_time)
            range_type = "10sec";
        else
            range_type = "hour";
    }
    else if (diff >= 1) {
        range_type = "day";
    }
    return range_type;
}


export const  getDateInFormat = (javascript_date_obj, format = 'Y-m-d', utc = false, local = false)  => {
    var tmpDate;
    var year, month, day, hours, mins, seconds;
    if (utc) {
        year = javascript_date_obj.getUTCFullYear();
        month = javascript_date_obj.getUTCMonth() + 1;
        day = javascript_date_obj.getUTCDate();
        hours = javascript_date_obj.getUTCHours();
        mins = javascript_date_obj.getUTCMinutes();
        seconds = javascript_date_obj.getUTCSeconds();
    } else if (local) {
        year = javascript_date_obj.getFullYear();
        month = javascript_date_obj.getMonth() + 1;
        day = javascript_date_obj.getDate();
        hours = javascript_date_obj.getHours();
        mins = javascript_date_obj.getMinutes();
        seconds = javascript_date_obj.getSeconds();
    } else {
        year = javascript_date_obj.getFullYear();
        month = javascript_date_obj.getMonth() + 1;
        day = javascript_date_obj.getDate();
        hours = javascript_date_obj.getHours();
        mins = javascript_date_obj.getMinutes();
        seconds = javascript_date_obj.getSeconds();
    }

    if (format == 'Y-m-d') {
        tmpDate = year + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day;
    } else if (format == 'Y-m-d HH:MM:SS') {
        tmpDate = year + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day + ' ' + (hours < 10 ? '0' : '') + hours + ':' + (mins < 10 ? '0' : '') + mins + ':' + (seconds < 10 ? '0' : '') + seconds;
    } else if (format == 'HH:MM:SS') {
        tmpDate = (hours < 10 ? '0' : '') + hours + ':' + (mins < 10 ? '0' : '') + mins + ':' + (seconds < 10 ? '0' : '') + seconds;
    } else if (format == 'HH') {
        tmpDate = (hours < 10 ? '0' : '') + hours;
    } else if (format == 'Y-m-d HH') {
        tmpDate = year + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day + ' ' + (hours < 10 ? '0' : '') + hours;
    }
    return tmpDate;
}

