/*
The Script contains the modules to render charts in Modules namely Histrorical Analysis (Authunticated) , User Analysis (Authenticated) of  of the Social Media Analysis tool 
developed at OSINT LAB , IIT-G

-----------------------------
IMPORTANT NOTE
-----------------------------
1.Use camelCase notations:)
2.PLEASE NOTE that the range types are :: 1. day , 2.hour , 3.10sec
3.Avoid using synchronous requests as XML-http-requests has been deprecated already.


Script written by : Mala Das(maladas601@gmail.com), Amitabh Boruah(amitabhyo@gmail.com)
*/




// Imports from external source
import { getDateInFormat } from '../utilitiesJS/smatDate.js';
import { frequencyDistributionHA, sentimentDistributionHA } from '../historicalAnalysis/HistoricalAnalysis.js';
//Global Declaration


//Logic starts here 


//Functions for Freqeuncy Distribution chart :: contains --->  1. Bar chart , 2. Line chart
export const generateFreqDistBarChart = (query, data = null, rangeType, div) => {
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

    var title = chart.titles.create();
    title.fontSize = 12;
    title.marginBottom = 10;
    if (rangeType == 'day')
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
    } else if (rangeType == 'day') {
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
        if (rangeType == 'day') {
            let datetime_obj = ev.target.dataItem.component.tooltipDataItem.dataContext;
            var date = getDateInFormat(datetime_obj['date'], 'Y-m-d');
            var startTime = getDateInFormat(datetime_obj['date'], 'HH:MM:SS');
            frequencyDistributionHA(query, 'hour', date, date, null, div, true);
            //ARGS format :: (query=null,rangeType,fromDate=null,toDate=null,toTime=null,div,appendArg=false)
        } else if (rangeType == 'hour') {
            let datetime_obj = ev.target.dataItem.component.tooltipDataItem.dataContext;
            let date = getDateInFormat(datetime_obj['date'], 'Y-m-d');
            let startTime = getDateInFormat(datetime_obj['date'], 'HH:MM:SS');
            let dateTimeTemp = date + ' ' + startTime;
            console.log(div);
            frequencyDistributionHA(query, '10sec', dateTimeTemp, dateTimeTemp, null, div, true);
            //ARGS format :: (query=null,rangeType,fromDate=null,toDate=null,toTime=null,div,appendArg=false)
        }
    });
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
    var hour_for_title = String(parseInt(getDateInFormat(dataTemp[0]['date'], 'HH')) + 1);
    title.text = " Per 10sec Distribution For " + getDateInFormat(dataTemp[0]['date'], 'Y-m-d') + ' ' + hour_for_title + ':00:00' + '  (Zoom to Know More)';

    chart.data = dataTemp;
    console.log(chart.data);
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.title.text = "DateTime";
    dateAxis.tooltipDateFormat = "HH:mm:ss, d MMMM";
    dateAxis.baseInterval = {
        "timeUnit": "second",
        "count": 10
    }

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


export const generateSentiDistBarChart = (data, query, rangeType, div) => {

    var chart = am4core.create(div, am4charts.XYChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    var dataTemp = [];
    for (const [key, senti] of Object.entries(data['data'])) {
        dataTemp.push({
            date: new Date(senti[0]),
            pos: parseInt(senti[1]),
            neg: parseInt(senti[2]),
            neu: parseInt(senti[3])
        });
    }
    chart.data = dataTemp;

    // chart.colors.step = 2;

    chart.legend = new am4charts.Legend();
    chart.colors.list = [
        am4core.color("#33CCCC"), //pos
        am4core.color("#FC5F4F"), //neg
        am4core.color("#FFC060") //neu
    ];
    chart.responsive.enabled = true;


    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 50;
    // dateAxis.renderer.grid.template.location = 0;
    var title = chart.titles.create();
    title.fontSize = 12;
    title.marginBottom = 10;
    if (rangeType == 'day')
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
    } else if (rangeType == 'day') {
        dateAxis.title.text = "Date";
        dateAxis.tooltipDateFormat = "d MMMM yyyy";
    }


    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    // if (option == 0)
    valueAxis.title.text = "% of tweets";
    valueAxis.min = 0;
    valueAxis.max = 100;
    valueAxis.strictMinMax = true;
    valueAxis.calculateTotals = true;
    valueAxis.renderer.minWidth = 50;

    // Create series
    function createAxisAndSeries(field, name, option) {
        var series1 = chart.series.push(new am4charts.ColumnSeries());
        series1.columns.template.width = am4core.percent(20);
        series1.columns.template.tooltipText =
            `[bold]{dateX}: {valueY} Tweets ({valueY.totalPercent.formatNumber('#.00')}%)[/]
              (click on bar to Know more)`;
        series1.name = name;
        series1.dataFields.dateX = "date";
        series1.dataFields.valueY = field;
        series1.dataFields.valueYShow = "totalPercent";
        series1.dataItems.template.locations.dateX = 0.5;
        series1.stacked = true;
        series1.yAxis = valueAxis;
        series1.name = name;
        series1.tooltip.pointerOrientation = "down";
        series1.tooltip.label.fill = am4core.color("#141313");
        series1.tensionX = 0.2;
        series1.columns.template.width = am4core.percent(80);
        series1.strokeWidth = 2;
        // do not show tooltip for zero-value column
        series1.tooltip.label.adapter.add("text", function (text, target) {
            if (target.dataItem && target.dataItem.valueY == 0) {
                return "";
            } else {
                return text;
            }
        });

        if ((rangeType == 'hour') || (rangeType == 'day')) {
            series1.columns.template.events.on("hit", function (ev) {
                if (rangeType == 'hour') {
                    let datetime_obj = ev.target.dataItem.component.tooltipDataItem.dataContext;
                    var date = getDateInFormat(datetime_obj['date'], 'Y-m-d');
                    var startTime = getDateInFormat(datetime_obj['date'], 'HH:MM:SS');
                    let dateTimeTemp = date + ' ' + startTime;
                    sentimentDistributionHA(query, '10sec', dateTimeTemp, dateTimeTemp, null, div, true);
                } else if (rangeType == 'day') {
                    let datetime_obj = ev.target.dataItem.component.tooltipDataItem.dataContext;
                    var date = getDateInFormat(datetime_obj['date'], 'Y-m-d');
                    var startTime = getDateInFormat(datetime_obj['date'], 'HH:MM:SS');

                    sentimentDistributionHA(query, 'hour', date, date, null, div, true);
                }
            });
        }
    }

    createAxisAndSeries("pos", "Positive", 0);
    createAxisAndSeries("neg", "Negative", 1);
    createAxisAndSeries("neu", "Neutral", 2);

    // Add cursor
    chart.cursor = new am4charts.XYCursor();
    chart.scrollbarX = new am4core.Scrollbar();
};



export const generateSentiDistLineChart = (query, data = null, rangeType, div) => {
    am4core.ready(function () {
        var chart = am4core.create(div, am4charts.XYChart);
        // Increase contrast by taking evey second color
        chart.colors.list = [
            am4core.color("#33CCCC"), //pos
            am4core.color("#FC5F4F"), //neg
            am4core.color("#FFC060") //neu
        ];

        // Add dataclearInterval(interval_for_freq_dis_trend_analysis);
        var dataTemp = [];
        for (const [key, senti] of Object.entries(data['data'])) {
            dataTemp.push({
                date: new Date(senti[0]),
                pos: parseInt(senti[1]),
                neg: parseInt(senti[2]),
                neu: parseInt(senti[3])
            });
        }
        chart.data = dataTemp;

        chart.responsive.enabled = true;

        // Create axes
        var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.minGridDistance = 50;
        if (rangeType == 'hour') {
            dateAxis.title.text = "DateTime";
            dateAxis.tooltipDateFormat = "HH:mm:ss, d MMMM";
            dateAxis.baseInterval = {
                "timeUnit": "hour",
                "count": 1
            }
        } else if (rangeType == 'day') {
            dateAxis.title.text = "Date";
            dateAxis.tooltipDateFormat = "d MMMM yyyy";
        } else if (rangeType == '10sec') {
            dateAxis.tooltipDateFormat = "HH:mm:ss, d MMMM";
            dateAxis.baseInterval = {
                "timeUnit": "second",
                "count": 10
            }
        }


        // after adding data chart should validated to update........
        chart.events.on("datavalidated", function () {
            dateAxis.zoom({
                start: 1 / 15,
                end: 1.2
            }, false, true);
        });
        dateAxis.interpolationDuration = 100;
        dateAxis.rangeChangeDuration = 500;
        // .........................................................


        // Create series
        function createAxisAndSeries(field, name, opposite, option) {
            var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            if (option == 0)
                valueAxis.title.text = "No. of tweets";
            var series = chart.series.push(new am4charts.LineSeries());
            series.dataFields.valueY = field;
            series.dataFields.dateX = "date";
            series.strokeWidth = 2;
            series.yAxis = valueAxis;
            series.name = name;
            // series.tooltipText = "{name}: [bold]{valueY}[/]";
            series.tooltipText = `[bold]{dateX.formatDate('yyyy-MMM-dd HH:mm:ss')}: {valueY} Tweets [\]
                (click on circle to Know more)`;
            series.tooltip.autoTextColor = false;
            series.tooltip.label.fill = am4core.color("#141313");
            // series.tensionX = 0.8;

            // all the below is optional, makes some fancy effects.......
            // gradient fill of the series
            series.fillOpacity = 1;
            var gradient = new am4core.LinearGradient();
            gradient.addColor(chart.colors.getIndex(option), 0.2);
            gradient.addColor(chart.colors.getIndex(option), 0);
            series.fill = gradient;
            //............................................................

            var interfaceColors = new am4core.InterfaceColorSet();
            valueAxis.renderer.line.strokeOpacity = 1;
            valueAxis.renderer.line.strokeWidth = 2;
            valueAxis.renderer.line.stroke = series.stroke;
            valueAxis.renderer.labels.template.fill = series.stroke;
            valueAxis.renderer.opposite = opposite;
            valueAxis.renderer.grid.template.disabled = true;

            // Add simple bullet
            var bullet = series.bullets.push(new am4charts.Bullet());
            var image = bullet.createChild(am4core.Circle);
            // image.href = "https://www.amcharts.com/lib/images/star.svg";
            image.width = 6;
            image.height = 6;
            image.horizontalCenter = "middle";
            image.verticalCenter = "middle";
            var hoverState = bullet.states.create("hover");
            hoverState.properties.scale = 3;
        }
        createAxisAndSeries("pos", "Positive", false, 0);
        createAxisAndSeries("neg", "Negative", true, 1);
        createAxisAndSeries("neu", "Neutral", true, 2);

        chart.legend = new am4charts.Legend();

        // Add cursor
        chart.cursor = new am4charts.XYCursor();
        chart.scrollbarX = new am4core.Scrollbar();
    });
};


export const generateBarChartForCooccur = (query, data = null, div, option) => {
    var chart = am4core.create(div, am4charts.XYChart);

    chart.padding(0, 0, 0, 0); 
    chart.data = generateChartData(data, option);
    function generateChartData(data, option) {
        var chartData = [];
        data.forEach(element => {
            if (option === 'hashtag') {
                chartData.push({
                    "token": element['hashtag'],
                    "count": element['count'],

                });
            } else if (option === 'mention') {
                chartData.push({
                    "token": element['handle'],
                    "count": element['count'],

                });
            } else if (option === 'user') {
                chartData.push({
                    "token": element['handle'],
                    "count": element['count'],
                    "id":element['id']

                });
            }
        });

        return chartData;
    }





    //create category axis for names
    var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.id = "category_Axis";

    categoryAxis.dataFields.category = "token";

    categoryAxis.renderer.inversed = true;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 10;

    //create value axis for count and expenses
    var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.opposite = true;


    //create columns
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryY = "token";
    series.dataFields.valueX = "count";
    categoryAxis.renderer.cellStartLocation = 0.2;
    categoryAxis.renderer.cellEndLocation = 1.1;

    var cellSize = 30;
    chart.events.on("datavalidated", function (ev) {

        // Get objects of interest
        var chart = ev.target;
        var categoryAxis = chart.yAxes.getIndex(0);

        // Calculate how we need to adjust chart height
        var adjustHeight = chart.data.length * cellSize - categoryAxis.pixelHeight;

        // get current chart height
        var targetHeight = chart.pixelHeight + adjustHeight;

        // Set it on chart's container
        chart.svgContainer.htmlElement.style.height = targetHeight + "px";
    });
    series.columns.template.fillOpacity = 10;
    series.columns.template.fill = am4core.color("#4280B7");
    series.columns.template.strokeOpacity = 10;
    series.tooltipText = " {categoryY}: {valueX.value}" + "(Click to Know More)";
    series.columns.template.width = am4core.percent(50);

    categoryAxis.sortBySeries = series;
    chart.cursor = new am4charts.XYCursor();

}