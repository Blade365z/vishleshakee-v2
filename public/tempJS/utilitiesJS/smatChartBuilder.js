//Utility script to render charts in Modules namely Histrorical Analysis (Authunticated) , User Analysis (Authenticated) of 
//Social Mediia Analysis Tool Vishleshakee developed at OSINT Lab ,IIT-G
//Written by :: Mala Das , Amitabh Boruah.

//Use camelCase please notations:)

//PLEASE NOTE that the range types are :: 1. days , 2.hour , 3.10sec


// Imports from external source
import { getDateInFormat } from '../utilitiesJS/smatDate.js';
import { frequencyDistributionUA } from '../userAnalysis/UserAnalysis.js';

//Global Declaration


//Logic starts here 


//Functions for Freqeuncy Distribution chart :: contains --->  1. Bar chart , 2. Line chart
export const generateFreqDistBarChart = (query, data = null, rangeType, div) => {
    // Create chart instance
    var chart = am4core.create(div, am4charts.XYChart);
    // Add data
    chart.data = generateChartDataForFrequecyDistribution(data['data'], rangeType);
    var title = chart.titles.create();
    title.fontSize = 12;
    title.marginBottom = 10;

    // Create axes
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.title.fontSize = 10;

    if (rangeType == 'days')
        title.text = "Per day distribution" + '  (Click on the bars for more)';
    else if (rangeType == 'hour')
        title.text = "Per hour distribution for " + data['data'][0][0] + ' (Click on the bars for more)';

    if (rangeType == 'hour') {
        dateAxis.title.text = "DateTime";
        dateAxis.tooltipDateFormat = "HH:mm:ss, d MMMM";
        dateAxis.baseInterval = {
            "timeUnit": "hour",
            "count": 1
        }
    } else if (rangeType == 'days') {
        dateAxis.title.text = "Date";
        dateAxis.tooltipDateFormat = "d MMMM yyyy";
    }

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "No. of tweets";
    valueAxis.title.fontSize = 10;
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "count";
    series.dataFields.dateX = "date";
    series.columns.template.fill = am4core.color("#4280B7");
    series.columns.template.strokeOpacity = 0;
    series.tooltipText = `[bold]{dateX}: {valueY} Tweets[/] 
      (click on bar to Know more)`;
    series.strokeWidth = 2;
    series.tooltip.autoTextColor = false;
    series.tooltip.label.fill = am4core.color("#141313");
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.cornerRadius = 20;
    series.tooltip.background.fillOpacity = 0.5;
    series.tooltip.label.padding(12, 12, 12, 12);
    series.columns.template.width = am4core.percent(50);
    series.columns.template.column.cornerRadiusTopLeft = 10;
    series.columns.template.column.cornerRadiusTopRight = 10;
    // Create scrollbars
    chart.cursor = new am4charts.XYCursor();
    chart.scrollbarX = new am4core.Scrollbar();
    chart.scrollbarX.background.fill = am4core.color("#4280B7");


    //Handling Click Events 
    series.columns.template.events.on("hit", function (ev) {
        if (rangeType == 'days') {
            let datetime_obj = ev.target.dataItem.component.tooltipDataItem.dataContext;
            var date = getDateInFormat(datetime_obj['date'], 'Y-m-d');
            var startTime = getDateInFormat(datetime_obj['date'], 'HH:MM:SS');
            frequencyDistributionUA(query, 'hour', date, null, null, div, true);
            //ARGS format :: (query=null,rangeType,fromDate=null,toDate=null,toTime=null,div,appendArg=false)
        } else if (rangeType == 'hour') {
            let datetime_obj = ev.target.dataItem.component.tooltipDataItem.dataContext;
            var date = getDateInFormat(datetime_obj['date'], 'Y-m-d');
            var startTime = getDateInFormat(datetime_obj['date'], 'HH:MM:SS');
            frequencyDistributionUA(query, '10sec', date, null, null, div, true);
            //ARGS format :: (query=null,rangeType,fromDate=null,toDate=null,toTime=null,div,appendArg=false)
        }
    });
}


function generateChartDataForFrequecyDistribution(chartDataArg) {
    var chartData = [];
    $.each(chartDataArg, function (index, value) {
        chartData.push({
            date: new Date(value[0]),
            count: value[1]
        });
    });
    return chartData;
}


export const generateFrequencyLineChart = (query, data = null, rangeType, div) => {
    var chart = am4core.create(div, am4charts.XYChart);
    var dataTemp = [];
    for (const [key, freq] of Object.entries(data['data'])) {
        dataTemp.push({
            date: new Date(freq[0]),
            value1: freq[1]
        });
    }


    var title = chart.titles.create();
    title.fontSize = 12;
    title.marginBottom = 10;
    var hour_for_title = String(parseInt(getDateInFormat(dataTemp[0]['date'],  'HH')) + 1);
    title.text =  " Per 10sec Distribution For " + getDateInFormat(dataTemp[0]['date'],  'Y-m-d') + ' ' + hour_for_title + ':00:00' + '  (Zoom to Know More)';





    chart.data = dataTemp;
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    var series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "value1";
    series.dataFields.dateX = "date";
    series.tooltipText = "{value1}"
    series.stroke = am4core.color("#297EB4");
    series.tooltip.pointerOrientation = "vertical";

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.snapToSeries = series;
    chart.cursor.xAxis = dateAxis;
    var circleBullet = series.bullets.push(new am4charts.CircleBullet());
    circleBullet.circle.fill = am4core.color("#297EB4");

    circleBullet.circle.strokeWidth = 0;

    circleBullet.events.on("hit", function (ev) {
        // $('#tweetsModal').modal('show');
        let datetime_obj = ev.target.dataItem.component.tooltipDataItem.dataContext;
        let time = (datetime_obj['date'].toLocaleTimeString('en-US', {
            hour12: false
        }));
        let month = datetime_obj['date'].getMonth() + 1;
        month = month < 10 ? '0' + month : '' + month;
        let capturedDate = (datetime_obj['date'].getFullYear() + '-' + month + '-' + datetime_obj['date'].getDate()) + ' ' + time;
        console.log(capturedDate);
        // let freqOnClickTweetData = getTweetIDsFromController(null, query, capturedDate, capturedDate);
        // let tweetIDs = freqOnClickTweetData[0]['data']['data'];
        // TweetsGenerator(tweetIDs, 4, 'tweets-modal-div');
        // $('#tweetsModal').modal('show');

    });
    chart.scrollbarX = new am4core.Scrollbar();
}



