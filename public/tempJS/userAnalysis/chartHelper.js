
export const generateFreqDistChart = (data = null, div) => {
    var chart = am4core.create(div, am4charts.XYChart);
    chart.scrollbarX = new am4core.Scrollbar();

    // Add data
    chart.data = [{
        "date": "13-05-2020",
        "count": 3025
    }, {
        "date": "14-05-2020",
        "count": 1882
    }, {
        "date": "15-05-2020",
        "count": 1809

    }, {
        "date": "16-05-2020",
        "count": 1322
    }, {
        "date": "17-05-2020",
        "count": 1122
    }, {
        "date": "18-05-2020",
        "count": 1114
    }, {
        "date": "19-05-2020",
        "count": 2984
    }, {
        "date": "20-05-2020",
        "count": 1111
    }, {
        "date": "21-05-2020",
        "count": 2450
    }, {
        "date": "22-05-2020",
        "count": 475
    }, {
        "date": "23-05-2020",
        "count": 4430
    }, {
        "date": "24-05-2020",
        "count": 3451
    }
        , {
        "date": "25-05-2020",
        "count": 1420
    }
        , {
        "date": "26-05-2020",
        "count": 1248
    }
        , {
        "date": "27-05-2020",
        "count": 400 
    }];

    chart.colors.list = [
        am4core.color("#297EB4"),
      ];
  
    // Create axes
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = "date";
    categoryAxis.renderer.minGridDistance = 70;

    categoryAxis.renderer.grid.template.disabled = true;

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.minWidth = 50;

    // Create series
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.sequencedInterpolation = true;
    series.dataFields.valueY = "count";
    series.dataFields.categoryX = "date";
    series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
    series.columns.template.strokeWidth = 0;

    series.tooltip.pointerOrientation = "vertical";

    series.columns.template.column.cornerRadiusTopLeft = 10;
    series.columns.template.column.cornerRadiusTopRight = 10;


    // on hover, make corner radiuses bigger
    var hoverState = series.columns.template.column.states.create("hover");
    hoverState.properties.cornerRadiusTopLeft = 0;
    hoverState.properties.cornerRadiusTopRight = 0;
    hoverState.properties.fillOpacity = 1;

  
    // Cursor
    chart.cursor = new am4charts.XYCursor();

}



export const generateSentimentChart = (data = null, div) => {
    var chart = am4core.create(div, am4charts.XYChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
  
    chart.data = [
      {
        category: "05:20:10",
        value1: 1,
        value2: 5,
        value3: 3
      },
      {
        category: "05:20:20",
        value1: 2,
        value2: 5,
        value3: 3
      },
      {
        category: "05:20:30",
        value1: 3,
        value2: 5,
        value3: 4
      },
      {
        category: "05:20:40",
        value1: 4,
        value2: 5,
        value3: 6
      },
      {
        category: "05:20:50",
        value1: 3,
        value2: 5,
        value3: 4
      },
      {
        category: "05:30:00",
        value1: 2,
        value2: 13,
        value3: 1
      },
      {
        category: "05:30:10",
        value1: 21,
        value2: 13,
        value3: 1
      }
      ,
      {
        category: "05:30:20",
        value1: 12,
        value2: 3,
        value3: 1
      },
      {
        category: "05:30:30",
        value1: 7,
        value2: 1,
        value3: 5
      },
      {
        category: "05:30:40",
        value1: 9,
        value2: 1,
        value3: 12
      },
      {
        category: "05:30:50",
        value1: 2,
        value2: 1,
        value3: 13
      },
      {
        category: "05:40:00",
        value1: 2,
        value2: 1,
        value3: 1
      },
      {
        category: "05:40:10",
        value1: 3,
        value2: 5,
        value3: 8
      },
      {
        category: "05:40:20",
        value1: 4,
        value2: 1,
        value3: 1
      },
      {
        category: "05:40:30",
        value1: 12,
        value2: 11,
        value3: 2
      },
      {
        category: "05:40:40",
        value1: 2,
        value2: 12,
        value3: 9
      },
      {
        category: "05:40:50",
        value1: 11,
        value2: 1,
        value3: 1
      },
      {
        category: "05:50:00",
        value1: 1,
        value2: 1,
        value3: 12
      },
      {
        category: "05:50:10",
        value1: 12,
        value2: 33,
        value3: 6
      },
      {
        category: "05:50:20",
        value1: 1,
        value2: 1,
        value3: 22
      }
      ,
      {
        category: "05:50:30",
        value1: 12,
        value2: 1,
        value3: 2
      },
      {
        category: "05:50:40",
        value1: 11,
        value2: 11,
        value3: 11
      },
      {
        category: "05:50:50",
        value1: 12,
        value2: 1,
        value3: 22
      }
    ];
  
  
    chart.colors.list = [
      am4core.color("#33CCCC"), //pos
      am4core.color("#FFC060"), //neg
      am4core.color("#F75E4E") //neu
    ];
  
  
  
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "category";
    categoryAxis.renderer.grid.template.location = 0;
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
    series1.name = "Series 1";
    series1.dataFields.categoryX = "category";
    series1.dataFields.valueY = "value1";
    series1.dataFields.valueYShow = "totalPercent";
    series1.dataItems.template.locations.categoryX = 0.5;
    series1.stacked = true;
    series1.tooltip.pointerOrientation = "vertical";
  
  
    var series2 = chart.series.push(new am4charts.ColumnSeries());
    series2.columns.template.width = am4core.percent(80);
    series2.columns.template.tooltipText =
      "{name}: {valueY.totalPercent.formatNumber('#.00')}%";
    series2.name = "Series 2";
    series2.dataFields.categoryX = "category";
    series2.dataFields.valueY = "value2";
    series2.dataFields.valueYShow = "totalPercent";
    series2.dataItems.template.locations.categoryX = 0.5;
    series2.stacked = true;
    series2.tooltip.pointerOrientation = "vertical";
  
  
  
    var series3 = chart.series.push(new am4charts.ColumnSeries());
    series3.columns.template.width = am4core.percent(80);
    series3.columns.template.tooltipText =
      "{name}: {valueY.totalPercent.formatNumber('#.00')}%";
    series3.name = "Series 3";
    series3.dataFields.categoryX = "category";
    series3.dataFields.valueY = "value3";
    series3.dataFields.valueYShow = "totalPercent";
    series3.dataItems.template.locations.categoryX = 0.5;
    series3.stacked = true;
    series3.tooltip.pointerOrientation = "vertical";
  
  
    chart.scrollbarX = new am4core.Scrollbar();
    chart.cursor = new am4charts.XYCursor();
  
  
  };
  

  export const generateBarChart = (data = null, div) => {

    $('#' + div).html('<div class="col-lg" id="bar_chart"></div> ');
    // Themes begin
  
    // am4core.useTheme(am4themes_animated);
    // Themes end
  
    var chart = am4core.create('bar_chart', am4charts.XYChart);
  
  
    chart.data = [{
      "token": "@ndtv",
      "count": 2025
    }, {
      "token": "@amitabhbaruah",
      "count": 1882
    }, {
      "token": "@narendramodi",
      "count": 1809
    }, {
      "token": "@amitshah",
      "count": 1322
    }, {
      "token": "@akshaykumar",
      "count": 1122
    }, {
      "token": "@aajtak",
      "count": 1114
    }, {
      "token": "@iamsrk",
      "count": 984
    }, {
      "token": "@arvindkejriwal",
      "count": 711
    }, {
      "token": "@republic",
      "count": 665
    }, {
      "token": "@thehindu",
      "count": 580
    }, {
      "token": "@shashitharoor",
      "count": 443
    }, {
      "token": "@hindustantimes",
      "count": 441
    }];
  
  
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
    series.columns.template.width = am4core.percent(70);

  
    categoryAxis.sortBySeries = series;
    chart.cursor = new am4charts.XYCursor();
  
  
  }