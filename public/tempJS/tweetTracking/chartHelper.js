/*
------------IMPORTANT  NOTE---------------
------------------------------------------
PLEASE NOT THERE ARE TYPES::
1.retweet
3.replytweet
2.quotedtweet
*/
export const drawFreqDataForTweet = (data,div) => {
    // Create chart instance
    var chart = am4core.create(div, am4charts.XYChart);
    // Add data
    var dataTemp = [];
    for (const [key, freq] of Object.entries(data['data'])) {
        dataTemp.push({
            date: new Date(freq[0]),
            count: freq[1]
        });
    }
    chart.data = dataTemp;



    // Create axes
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.title.fontSize = 10;

    // var title = chart.titles.create();
    // title.fontSize = 12;
    // title.marginBottom = 10;
    // if (rangeType == 'day')
    //     title.text = "Per day distribution" + '  (Click on the bars for more)';
    // else if (rangeType == 'hour')
    //     title.text = "Per hour distribution for " + data['data'][0][0] + ' (Click on the bars for more)';

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


    // //Handling Click Events 
    // series.columns.template.events.on("hit", function (ev) {
    //     if (rangeType == 'day') {
    //         let datetime_obj = ev.target.dataItem.component.tooltipDataItem.dataContext;
    //         var date = getDateInFormat(datetime_obj['date'], 'Y-m-d');
    //         var startTime = getDateInFormat(datetime_obj['date'], 'HH:MM:SS');
    //         frequencyDistributionUA(query, 'hour', date, date, null, div, true);
    //         //ARGS format :: (query=null,rangeType,fromDate=null,toDate=null,toTime=null,div,appendArg=false)
    //     } else if (rangeType == 'hour') {
    //         let datetime_obj = ev.target.dataItem.component.tooltipDataItem.dataContext;
    //         let date = getDateInFormat(datetime_obj['date'], 'Y-m-d');
    //         let startTime = getDateInFormat(datetime_obj['date'], 'HH:MM:SS');
    //         let dateTimeTemp = date + ' ' + startTime;
    //         console.log(div);
    //         frequencyDistributionUA(query, '10sec', dateTimeTemp, dateTimeTemp, null, div, true);
    //         //ARGS format :: (query=null,rangeType,fromDate=null,toDate=null,toTime=null,div,appendArg=false)
    //     }
    // });
}