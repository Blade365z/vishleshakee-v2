
import { getTweetIDsFromController, getFreqDistData, getSentiDistData, getTopCooccurData } from './helper.js'
import { TweetsGenerator } from '../utilitiesJS/TweetGenerator.js'
import { forwardToHistoricalAnalysis, forwardToUserAnalysis } from '../utilitiesJS/redirectionScripts.js';
import { getCurrentDate } from '../utilitiesJS/smatDate.js';





var frequencyChartInt = null, sentimentChartInterval = null, barChartInterval = null;
export const clearChartIntervals = () => {
  clearInterval(frequencyChartInt);
  clearInterval(sentimentChartInterval);
  clearInterval(barChartInterval);
}


export const generateFrequencyChart = (data, query, div) => {
  clearChartIntervals();
  let finalTime;
  var chart = am4core.create(div, am4charts.XYChart);
  am4core.useTheme(am4themes_animated);
  // Themes end

  var dataTemp = [];
  for (const [key, freq] of Object.entries(data['data'])) {
    dataTemp.push({
      date: new Date(freq[0]),
      value1: freq[1],
      value2: freq[5],
      value3: freq[3],
      value4: freq[2],
      value5: freq[4],
    });
  }



  chart.data = dataTemp;
  freqSummary(chart.data);
  try {
    finalTime = data['data'][data['data'].length - 1][0];
    const updateFreqChart = function () {
      getFreqDistData(null, query, true, finalTime).then(response => {
        finalTime = response[0]['finalTime'];
        response = response[0]['data'];

        if (response['data'].length > 0) {
          chart.addData({
            "date": new Date(response['data'][0][0]),
            "value1": response['data'][0][1],
            "value2": response['data'][0][5],
            "value3": response['data'][0][3],
            "value4": response['data'][0][2],
            "value5": response['data'][0][4]

          }, 1);
        }
        freqSummary(chart.data);
      })
    }

    frequencyChartInt = setInterval(updateFreqChart, 10000);
  }
  catch (err) {
    console.log('Final Time couldnot be initialized', err);
  }


  // Create axes
  var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
  dateAxis.title.text = "DateTime";
  dateAxis.tooltipDateFormat = "HH:mm:ss, d MMMM";
  dateAxis.baseInterval = {
    "timeUnit": "second",
    "count": 10
  }

  var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

  // Create series
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


    getTweetIDsFromController(null, query, capturedDate, capturedDate).then(response => {
      let tweetIDs = response[0]['data']['data'];
      TweetsGenerator(tweetIDs, 4, 'tweets-modal-div');
      $('#tweetsModal').modal('show');
    });


  });
  //chart.scrollbarY = new am4core.Scrollbar();
  chart.scrollbarX = new am4core.Scrollbar();

  // end am4core.ready()

}


export const generateSentimentChart = (data, query, div) => {
  clearChartIntervals();
  let finalTime;
  var chart = am4core.create(div, am4charts.XYChart);
  am4core.useTheme(am4themes_animated);
  // Themes end

  chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

  var dataTemp = [];
  for (const [key, senti] of Object.entries(data['data'])) {
    dataTemp.push({
      date: new Date(senti[0]),
      value1: parseInt(senti[1]),
      value2: parseInt(senti[2]),
      value3: parseInt(senti[3])
    });
  }



  chart.data = dataTemp;
  sentiSummaryTotalFinder(chart.data);
  chart.colors.list = [
    am4core.color("#33CCCC"), //pos
    am4core.color("#FFC060"), //neg
    am4core.color("#F75E4E") //neu
  ];
  try {
    finalTime = data['data'][data['data'].length - 1][0];
    const updateSentiChart = () => {
      getSentiDistData(null, query, true, finalTime).then(response => {
        finalTime = response[0]['finalTime'];
        response = response[0]['data'];
        if (response['data'].length > 0) {
          chart.addData({
            "date": new Date(response['data'][0][0]),
            "value1": response['data'][0][1],
            "value2": response['data'][0][2],
            "value3": response['data'][0][3]
          });
          chart.invalidateRawData();
          sentiSummaryTotalFinder(chart.data);
        }
      })
    }
    sentimentChartInterval = setInterval(updateSentiChart, 10000);
  }
  catch (err) {
    console.log('Final Time couldnot be initialized', err);
  }






  // Create axes
  var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
  dateAxis.title.text = "DateTime";
  dateAxis.tooltipDateFormat = "HH:mm:ss, d MMMM";
  dateAxis.baseInterval = {
    "timeUnit": "second",
    "count": 10
  }
  var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
  valueAxis.min = 0;
  valueAxis.max = 100;
  valueAxis.strictMinMax = true;
  valueAxis.calculateTotals = true;
  valueAxis.renderer.minWidth = 50;

  var series1 = chart.series.push(new am4charts.ColumnSeries());
  series1.columns.template.width = am4core.percent(80);
  series1.columns.template.tooltipText =
    "{name}: {valueY.totalPercent.formatNumber('#.00')}%";
  series1.name = "Positive";
  series1.dataFields.dateX = "date";
  series1.dataFields.valueY = "value1";
  series1.dataFields.valueYShow = "totalPercent";
  series1.dataItems.template.locations.categoryX = 0.5;
  series1.stacked = true;
  series1.tooltip.pointerOrientation = "vertical";


  var series2 = chart.series.push(new am4charts.ColumnSeries());
  series2.columns.template.width = am4core.percent(80);
  series2.columns.template.tooltipText =
    "{name}: {valueY.totalPercent.formatNumber('#.00')}%";
  series2.name = "Neutral";
  series2.dataFields.dateX = "date";
  series2.dataFields.valueY = "value2";
  series2.dataFields.valueYShow = "totalPercent";
  series2.dataItems.template.locations.categoryX = 0.5;
  series2.stacked = true;
  series2.tooltip.pointerOrientation = "vertical";



  var series3 = chart.series.push(new am4charts.ColumnSeries());
  series3.columns.template.width = am4core.percent(80);
  series3.columns.template.tooltipText =
    "{name}: {valueY.totalPercent.formatNumber('#.00')}%";
  series3.name = "Negative";
  series3.dataFields.dateX = "date";
  series3.dataFields.valueY = "value3";
  series3.dataFields.valueYShow = "totalPercent";
  series3.dataItems.template.locations.categoryX = 0.5;
  series3.stacked = true;
  series3.tooltip.pointerOrientation = "vertical";


  chart.scrollbarX = new am4core.Scrollbar();
  chart.cursor = new am4charts.XYCursor();


};



export const generateBarChart = (data = null, query, div, type) => {
  clearChartIntervals();
  $('#' + div).html('<div class="col-lg" id="bar_chart"></div> ');
  // Themes begin

  am4core.useTheme(am4themes_animated);
  // Themes end

  var chart = am4core.create('bar_chart', am4charts.XYChart);
  let dataCaptured = data[0]['data'];
  let totalNumberOfNodes = data[0]['nodes'];
  chart.data = generateChartData(dataCaptured, type);
  function generateChartData(data, type) {
    var chartData = [];
    data.forEach(element => {
      if (type == 'hashtag') {
        chartData.push({
          "token": element['hashtag'],
          "count": element['count'],
        });
      }
      else if (type == 'mention') {
        chartData.push({
          "token": element['handle'],
          "count": element['count'],
        });
      }
      else if (type === 'user') {
        chartData.push({
          "token": element['handle'],
          "count": element['count'],
          'id': element['id'],
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
  let finalTime = data[0]['finalTime'];
  console.log(finalTime);
  const updateBarChart = () => {
    // getTopCooccurData async (interval = null, query, option, isRealTime = false, fromTime = null)
    getTopCooccurData(null, query, type, true, finalTime).then(response => {
      finalTime = response[0]['finalTime'];
      response = response[0]['data'];

      let dataTemp = response;

      if (dataTemp.length > 1) {
        let lenofTempData = Object.keys(dataTemp).length - 1;
        if (lenofTempData > 1) {
          for (let i = 0; i <= lenofTempData; i++) {
            let flag = false;
            for (let j = 0; j <= chart.data.length - 1; j++) {
              if (type === 'hashtag') {
                if (dataTemp[i]['hashtag'] == chart.data[j]['token']) {
                  chart.data[j]['count'] += dataTemp[i]["count"];
                  chart.invalidateRawData();
                  flag = false;
                  break;
                } else {
                  flag = true;
                }
              } else {
                if (dataTemp[i]['handle'] == chart.data[j]['token']) {
                  chart.data[j]['count'] += dataTemp[i]["count"];
                  chart.invalidateRawData();
                  flag = false;
                  break;
                } else {
                  flag = true;
                }
              }

            }
            if (flag == true) {
              if (type == 'hashtag') {
                chart.addData({
                  "token": dataTemp[i]['hashtag'],
                  "count": dataTemp[i]['count']
                });
              }
              else if (type == 'mention') {
                chart.addData({
                  "token": dataTemp[i]['handle'],
                  "count": dataTemp[i]['count']
                });
              } else if (type == 'user') {
                chart.addData({
                  "token": dataTemp[i]['handle'],
                  "count": dataTemp[i]['count'],
                  "id": dataTemp[i]['id']
                });
              }
            }
          }
        } else {

          let flag = false;
          for (let j = 0; j <= chart.data.length - 1; j++) {
            if (typee == 'hashtag') {
              if (dataTemp['hashtag'] == chart.data[j]['token']) {
                chart.data[j]['count'] += dataTemp["count"];
                chart.invalidateRawData();
                flag = false;
                break;
              } else {
                flag = true;
              }
            } else {
              if (dataTemp['handle'] == chart.data[j]['token']) {
                chart.data[j]['count'] += dataTemp["count"];
                chart.invalidateRawData();
                flag = false;
                break;
              } else {
                flag = true;
              }
            }

          }
          if (flag == true) {
            if (type == 'hashtag') {
              chart.addData({
                "token": dataTemp[i]['hashtag'],
                "count": dataTemp[i]['count']
              });
            }
            else if (type == 'mention') {
              chart.addData({
                "token": dataTemp[i]['handle'],
                "count": dataTemp[i]['count']
              });
            } else if (type == 'user') {
              chart.addData({
                "token": dataTemp[i]['handle'],
                "count": dataTemp[i]['count'],
                "id": dataTemp[i]['id']
              });
            }

          }
        }
      }
    })
  }
  barChartInterval = setInterval(updateBarChart, 10000)


  categoryAxis.sortBySeries = series;
  chart.cursor = new am4charts.XYCursor();
  series.columns.template.events.on("hit", function (ev) {
    console.log(type);
    if (type === 'mention' || type === 'hashtag') {
      var item = ev.target.dataItem.dataContext.token;
      if (localStorage.getItem('smat.me')) {
        let queryFinal ='(' +query + '&' + item+')';
        let date = getCurrentDate();
        forwardToHistoricalAnalysis(queryFinal, date, date);
      } else {
        forwardToHistoricalAnalysis(item);
      }
    } else {
      var item = ev.target.dataItem.dataContext.id;
      if (localStorage.getItem('smat.me')) {
        let date = getCurrentDate();
        forwardToUserAnalysis(item, date, date);
      }
    }
  });

}



const freqSummary = (data) => {

  let freqTotal = 0, totalNormal = 0, totalSec = 0, totalCom = 0, totalcom_sec = 0;
  data.forEach(element => {
    freqTotal += element['value1'];
    totalNormal += element['value2'];
    totalSec += element['value3'];
    totalCom += element['value4'];
    totalcom_sec += element['value5'];

  });

  $('#freqTotalPublic').text(freqTotal);
  $('#publicNormalTotal').text(totalNormal);
  $('#publicSecTotal').text(totalSec);
  $('#publicComTotal').text(totalCom);
  $('#publiccom_secTotal').text(totalcom_sec);




}



const sentiSummaryTotalFinder = (data) => {
  let totalPos = 0, totalNeg = 0, totalNeu = 0;
  data.forEach(element => {
    totalPos += element['value1'],
      totalNeu += element['value2'],
      totalNeg += element['value3']
  });
  let sentiTotalArray = [totalPos, totalNeu, totalNeg];
  generateSentimentSummaryBar(sentiTotalArray);
}

const generateSentimentSummaryBar = (sentiTotalArray) => {

  let total_pos = sentiTotalArray[0];
  let total_neu = sentiTotalArray[1];
  let total_neg = sentiTotalArray[2];;
  $('#publicPosTotal').text(total_pos);
  $('#publicNegTotal').text(total_neg);
  $('#publicNeuTotal').text(total_neu);


  var total = total_pos + total_neg + total_neu;


  var pos = Math.ceil((total_pos / total) * 100);
  var neg = Math.ceil((total_neg / total) * 100);
  var neu = Math.ceil((total_neu / total) * 100);


  $('#publicPosBar').css('width', pos + 'px');
  $('#publicNegBar').css('width', neg + 'px');
  $('#publicNeuBar').css('width', neu + 'px');

  $('#publicPosValue').css('margin-left', (pos / 4) + 'px');
  $('#publicNegValue').css('margin-left', (neg / 4) + 5 + 'px');
  $('#publicNeuValue').css('margin-left', (neu / 4) + 5 + 'px');


  $('#publicPosValue').text(pos + '%');
  $('#publicNegValue').text(neg + '%');
  $('#publicNeuValue').text(neu + '%');





}

