//** ---------------------------------------
//* Timeline Chart was created using amCharts 4.
//* Author: Bjoern Mueller, bjoernmueller@posteo.de 
//* Date: 18-11-2020
//* Version: 1.54
//* Documentation is available at: https://www.amcharts.com/docs/v4/
//* https: //codepen.io/team/amcharts/pen/PRdxvB?editors=0010
//* https://codepen.io/team/amcharts/pen/moyWJW/
//* ---------------------------------------

(function () {
    // Define this code as a plugin in the mstrmojo object
    if (!mstrmojo.plugins.AZoomableDateTime) {
        mstrmojo.plugins.AZoomableDateTime = {};
    }
    // All mojo visualizations require the CustomVisBase library to render
    mstrmojo.requiresCls("mstrmojo.CustomVisBase");
    var colors = []; //to maintain the color object for each metric
    var metricColors = [];
    /**
     * A visualization that integrates Microstrategy data with amcharts code
     * @extends mstrmojo.CustomVisBase
     */
    // Declare the visualization object
    mstrmojo.plugins.AZoomableDateTime.AZoomableDateTime = mstrmojo.declare(
        // Declare that this code extends CustomVisBase
        mstrmojo.CustomVisBase,
        null, {
            // Define the JavaScript class that renders your visualization as mstrmojo.plugins.{plugin name}.{js file name}
            scriptClass: 'mstrmojo.plugins.AZoomableDateTime.AZoomableDateTime',
            // Define the CSS class that will be appended to container div
            cssClass: "AZoomableDateTime",
            // Define the error message to be displayed if JavaScript errors prevent data from being displayed
            errorDetails: "This visualization requires one or more attributes and one metric. <br>Expected Date-Format: [dd.mm.yyyy]. <br>Expected Date-Time Format: [dd.mm.yyyy hh:mm:ss]",
            // Define the external libraries to be used - in this sample. the amcharts library
            externalLibraries: [{url: "//cdn.amcharts.com/lib/4/core.js"}, 
                                {url: "//cdn.amcharts.com/lib/4/charts.js"}, 
                                {url: "//cdn.amcharts.com/lib/4/themes/animated.js"}, 
                                {url: "//cdn.amcharts.com/lib/4/lang/en_US.js"},
                                {url: "//cdn.amcharts.com/lib/4/lang/de_DE.js"},
                                {url: "//cdn.amcharts.com/lib/4/plugins/rangeSelector.js"}],
            // Define whether a tooltip should be displayed with additional information
            useRichTooltip: true,
            // Define whether the DOM should be reused on data/layout change or reconstructed from scratch
            reuseDOMNode: false,
            getAllProperties: function () {
                var properties = this.getDefaultProperties();
                var setProp = ((this.model.data.vp.cvp) ? this.getProperties() : this.model.data.vp);
                var keys = Object.keys(properties);
                var size = keys.length;
                while (size) {
                    size--;
                    var k = keys[size];
                    if (setProp.hasOwnProperty(k)) {
                        properties[k] = setProp[k];
                    }
                }
                return properties;
            },

            plot: function () {
                var me = this;
                var domNode = this.domNode,
                    dp = this.dataInterface;
                var AttrIsDate = "false";
                var AttrCount = 0;
                var seriesToolTipFormat = "{dateX.formatDate('dd.MM.yyyy')}:\n {name}:\n [bold]{valueY}[/]";
                var oppositeValueAxisFlag;
                var diff;

                this.setDefaultPropertyValues({
                    behaviorWheelScroll: 'none', //new
                    showLegend: 'true',
                    positionLegend: 'top',
                    formatGerman: false,
                    colorLegendMetric: 'false',
                    displayXYCursor: 'true',
                    hideXYCursorLines: 'false',
                    showAxisTooltip: true,
                    fullWidthCursor: 'false',
                    enableRangeSelector: 'false',
                    enableDataGrouping: 'true',
                    displayWeekendFill: 'false',
                    hideYAxisLabels: 'false',
                    startAtZero: 'false',
                    enableStacked: 'false',
                    enableToggle: 'false',
                    vizAsSelect: 'false',
                    padLegend: 'false', //new
                    padLegendAmount: 10,
                    maxHeightLegend: 'false', //new
                    maxHeightLegendAmount: 150, //new
                    maxWidthLegend: 'false', //new
                    maxWidthLegendAmount: 150, //new
                    sizeMarkerLegend: 'false', //new
                    sizeMarkerLegendAmount: 150, //new
                    valuesLegend: 'false',
                    AxisTooltipFormat: "yyyy-MM-dd", //new
                    displayXYChartScrollbar: 'false', //new
                    singleTooltip: 'false', //new
                    combineTooltip: 'false', //new
                    amountStrokeXColor: {fillColor: "#ebebeb", fillAlpha: "100"},
                    amountStrokeYColor: {fillColor: "#ebebeb", fillAlpha: "100"},
                    axisXColor: {fillColor: "#ebebeb", fillAlpha: "100"},
                    axisYColor: {fillColor: "#ebebeb", fillAlpha: "100"},
                    fontColor: {fillColor: "#ababab", fillAlpha: "100"},
                    labelColor: {fillColor: "#ababab", fillAlpha: "100"},

                    selectorColor: {fillColor: "#6c6c6c", fillAlpha: "100"},
                    selectorBackground: {fillColor: "#f4f4f4", fillAlpha: "10"},
                    scrollbarBackgroundColor: {fillColor: "#dedede", fillAlpha: "10"},
                    scrollbarThumbColor: {fillColor: "#ababab", fillAlpha: "30"},
                    scrollbarUnselectedColor: {fillColor: "#dedede", fillAlpha: "10"},
                    placeholder: 'false',
                    //lineColor " + i
                    //oppositeAxis" + i
                    weekendFillColor: {fillColor: "#6C6C6C", fillAlpha: "15"},
                    aggregateValues: 'sum',
                    //metricFormat: "#,###.00",
                    minGridDist: 30,
                    displayFill: 'false', //new
                    amountFillOpacity: 10, //new
                    showItemLabels: false,
                    positionLabel: 'center',
                    positionVLabel: 'middle',
                    
                    dateTimeFormat: 'dd-mm-yyyy',
                    showDebugMsgs: 'false',
                    showDebugTbl: 'false',
                    // TODO format legend
                    /*
                        labelFontLegend: {
                            fontFamily: 'Open Sans',
                            fontWeight: false,
                            fontItalic: false,
                            fontSize: '14pt',
                            fontColor: "red"
                        },
                    */
                });
                
                var allProps = this.getAllProperties();
                //window.alert('allProps: ' + allProps["weekendFillColor"].fillColor + "\n" + allProps["weekendFillColor"].fillAlpha);
                //window.alert("getProps: " + am4core.color(me.getProperty("weekendFillColor").fillColor) + "\n" + am4core.color(me.getProperty("weekendFillColor").fillAlpha));


                (allProps["showDebugMsgs"] == 'true') ? window.alert('100: Version 1.54') : 0;

                am4core.useTheme(am4themes_animated);

                // Create chart instance
                var chart2 = am4core.create(this.domNode, am4charts.XYChart);

                chart2.hiddenState.properties.opacity = 0; // this creates initial fade-in
                chart2.dateFormatter.dateFormat = "yyyy-MM-dd hh:mm";
                chart2.dateFormatter.inputDateFormat = "yyyy-MM-dd HH:mm";
                chart2.mouseWheelBehavior = allProps["behaviorWheelScroll"]; // "panX", "zoomX", "selectX"
                if (allProps["formatGerman"] === 'true') {
                    chart2.language.locale = am4lang_de_DE;
                };
                
                
                // Export
                //chart.exporting.menu = new am4core.ExportMenu();

                // Add data
                var datapool = prepareData();





                /**REVIEW 8.4.22 start trying to replace the org dataset with this one to be able to get rawvalues as well as formatted values */
                //var datarows_adv = this.dataInterface.getRawData(mstrmojo.models.template.DataInterface.ENUM_RAW_DATA_FORMAT.ROWS_ADV);
                //datarows_adv.cols = datapool.cols;
                //datarows_adv.attrs = datapool.attrs;
//
                ////------------------ POPUP for Debugging INPUT ------------------//
                //var Say1 = 'DataPool: \n datapool.cols: ' + JSON.stringify(datapool.cols) + '\n datapool.attrs: ' + JSON.stringify(datapool.attrs);
                //var Say2 = "datapool.rows: " + JSON.stringify(datarows_adv);
                ////var Say2 = "datapool: " + JSON.stringify(datapool);
                ////var Say2 = "dataraw: " + JSON.stringify(dataraw);             
//
                //var myWindow3 = PopUp(Say1, Say2, datarows_adv);
                /**REVIEW 8.4.22 end*/







                // Set Default Colors
                chart2.colors.list = [
                    am4core.color("#eac566"),
                    am4core.color("#bf82a1"),
                    am4core.color("#7788aa"),
                    am4core.color("#03a678"),
                    am4core.color("#cc9955"),
                    am4core.color("#ffee99"),
                    am4core.color("#bb99bb"),
                    am4core.color("#99bbcc"),
                    am4core.color("#65a688")
                ];

                // Change Color if different Color-Property is set by user, Colors are set by Index not by Name
                datapool.cols.forEach((col, i) => {
                    if (me.getProperty("lineColor" + i)) {
                        metricColors[i] = me.getProperty("lineColor" + i);
                        chart2.colors.list[i] = am4core.color(me.getProperty("lineColor" + i).fillColor);
                    }
                });

                //chart2.data = datapool.rows;
                 if (datapool.attrs.length > 1 && datapool.cols.length < 2) {
                     chart2.data = datapool.transposedRows;
                 } else {
                     chart2.data = datapool.rows;
                 }

                // Create axes
                // Create Axis for either date-based X-Axis or category-based X-Axis
                //NOTE Create Axis --------------------------------//
                // category-based X-Axis:
                if (AttrIsDate == 'false') {
                    (allProps["showDebugMsgs"] == 'true') ? window.alert('101: category-based AttrIsDate = ' + AttrIsDate): 0;
                    var categoryAxis = chart2.xAxes.push(new am4charts.CategoryAxis());
                    categoryAxis.cursorTooltipEnabled = (allProps["showAxisTooltip"] === 'true'); //convert string (returned from getProperty) to boolean
                    categoryAxis.renderer.grid.template.stroke = am4core.color(allProps["amountStrokeXColor"].fillColor);
                    categoryAxis.renderer.grid.template.strokeOpacity = allProps["amountStrokeXColor"].fillAlpha * 0.01;
                    categoryAxis.renderer.labels.template.fill = am4core.color(allProps["fontColor"].fillColor);
                    //categoryAxis.renderer.line.strokeWidth = 2;
                    categoryAxis.renderer.line.stroke = am4core.color(allProps["axisXColor"].fillColor);
                    categoryAxis.renderer.line.strokeOpacity = allProps["axisXColor"].fillAlpha * 0.01;
                    var label = categoryAxis.renderer.labels.template;
                    //categoryAxis.renderer.labels.template.fill = XAxisColor;
                    label.truncate = true;
                    label.maxWidth = 150;
                    label.fill = am4core.color(allProps["fontColor"].fillColor);
                // date-based X-Axis:
                } else {
                    (allProps["showDebugMsgs"] == 'true') ? window.alert('102: date-based AttrIsDate = ' + AttrIsDate): 0;
                    var dateAxis = chart2.xAxes.push(new am4charts.DateAxis());
                    dateAxis.renderer.minGridDistance = allProps["minGridDist"];
                    dateAxis.cursorTooltipEnabled = (allProps["showAxisTooltip"] === 'true'); //convert string (returned from getProperty) to boolen

                    // Format dateAxis
                    // https://www.amcharts.com/docs/v4/concepts/axes/positioning-axis-elements/
                    //dateAxis.renderer.grid.template.location = 0.5;
                    //dateAxis.renderer.labels.template.location = 0;
                    //dateAxis.renderer.labels.template.location = 0.5;
                    //dateAxis.renderer.labels.template.location = 0.0001;

                    // Format dateAxis
                    dateAxis.renderer.grid.template.stroke = am4core.color(allProps["amountStrokeXColor"].fillColor);
                    dateAxis.renderer.grid.template.strokeOpacity = allProps["amountStrokeXColor"].fillAlpha * 0.01;
                    dateAxis.renderer.labels.template.fill = am4core.color(allProps["fontColor"].fillColor);
                    //dateAxis.renderer.line.strokeWidth = 2;
                    dateAxis.renderer.line.stroke = am4core.color(allProps["axisXColor"].fillColor);
                    dateAxis.renderer.line.strokeOpacity = allProps["axisXColor"].fillAlpha * 0.01;
                    // Set date label formatting (https://www.amcharts.com/docs/v4/concepts/axes/date-axis/#Setting_date_formats)
                    //                            https://www.amcharts.com/docs/v4/concepts/formatters/formatting-date-time/
                    
                    
                    
                    
                    
                    // TODO add mulitple choices for users
                    // TODO add axis-tooltip with more info (eg dd.mm.yyyy hh:mm) --> cursorTooltipEnabled
                    // https://www.amcharts.com/docs/v4/concepts/axes/axis-tooltips/#Tooltip_value_format
                    dateAxis.tooltip.background.fill = am4core.color(allProps["selectorColor"].fillColor);
                    dateAxis.tooltip.background.strokeWidth = 0;
                    dateAxis.tooltip.label.fill = am4core.color(allProps["selectorBackground"].fillColor);
                    dateAxis.tooltipDateFormat = allProps["AxisTooltipFormat"]; //"yyyy-MM-dd";
                    //dateAxis.dateFormats.setKey("day", "dd.MM.");
                    dateAxis.dateFormats.setKey("day", "d.M.");
                    dateAxis.dateFormats.setKey("week", "'KW'ww");
                
                
                    
                
                
                
                    dateAxis.periodChangeDateFormats.setKey("hour", "[bold]dd.MMM[/]\nEEE");
                    dateAxis.periodChangeDateFormats.setKey("day", "[bold]dd.MMM[/]");
                    dateAxis.periodChangeDateFormats.setKey("week", "[bold]'KW'ww[/]");
                    dateAxis.periodChangeDateFormats.setKey("month", "[bold]yyyy[/]");

                    // Data Grouping
                    // https://www.amcharts.com/docs/v4/concepts/axes/date-axis/#Enabling_grouping
                    dateAxis.groupData = (allProps["enableDataGrouping"] === 'true');
                    dateAxis.gridIntervals.pushAll([{timeUnit: "week", count: 1}
                                                  , {timeUnit: "week", count: 2}
                                                  , {timeUnit: "week", count: 3}
                                                  , {timeUnit: "week", count: 4}
                                                  , {timeUnit: "week", count: 5}]);

                    // force weeks to display
                    // dateAxis.groupInterval = {timeUnit: "week", count: 1 };


                    // Highlight Weekends
                    //https://www.amcharts.com/docs/v4/tutorials/using-fill-rules-on-a-date-axis/
                    //https://www.amcharts.com/docs/v4/concepts/axes/positioning-axis-elements/#Setting_the_density_of_the_the_grid_labels
                    //https://www.amcharts.com/docs/v4/concepts/axes/date-axis/#Axis_grid_granularity
                    if (allProps["displayWeekendFill"] === 'true') {
                        //window.alert(am4core.color(allProps["weekendFillColor"].fillColor));
                        //window.alert(am4core.color(me.getProperty("weekendFillColor").fillColor));
                        dateAxis.renderer.axisFills.template.disabled = false;
                        dateAxis.renderer.axisFills.template.fill = am4core.color(allProps["weekendFillColor"].fillColor);
                        dateAxis.renderer.axisFills.template.fillOpacity = allProps["weekendFillColor"].fillAlpha * 0.01;

                        dateAxis.fillRule = function (dataItem) {
                            var date = new Date(dataItem.value);
                            if ((date.getDay() == 0 || date.getDay() == 6) 
                                && (
                                    (dateAxis.gridInterval.timeUnit == "day" && dateAxis.gridInterval.count == 1) 
                                    ||
                                    (dateAxis.gridInterval.timeUnit == "hour")
                                )
                            ) {
                                dataItem.axisFill.visible = true;
                                /** Prep in case Highlight Thursdays and Fridays too but with half opacity
                                } else if ((date.getDay() == 4 || date.getDay() == 5) && dateAxis.gridInterval.timeUnit == "day" && dateAxis.gridInterval.count == 1) {
                                    dataItem.axisFill.visible = true;
                                    dataItem.axisFill.fillOpacity = allProps["weekendFillColor"].fillAlpha * 0.005;
                                    */
                            } else {
                                dataItem.axisFill.visible = false;
                            }
                        }
                    }

                    // Set up drill-down
                    if (allProps["enableClickToDrill"] === 'true') {
                        dateAxis.renderer.labels.template.events.on("hit", function (ev) {
                            var start = ev.target.dataItem.date;
                            var end = new Date(start);
                            end.setMonth(end.getMonth() + 1);
                            dateAxis.zoomToDates(start, end);
                        })
                    } else {
                        dateAxis.renderer.labels.template.events.disableType("hit");
                    };

                    //NOTE: Range selector
                    //FIXME if attr is not date is not triggered.
                    if (allProps["enableRangeSelector"] === 'true') {
                        if (AttrIsDate == 'false') {
                            window.alert('not possible without Date(Time)-Attribute');
                        } else {
                            var container = document.createElement('div');
                            var rangeselect = document.createElement('div');
                            //rangeselect.style.background = "#c0c0c0";
                            rangeselect.style.background = am4core.color(allProps["selectorBackground"].fillColor);
                            //rangeselect.style.color = "#000";
                            rangeselect.style.color = am4core.color(allProps["selectorColor"].fillColor);
                            rangeselect.style.position = "absolute";
                            rangeselect.style.bottom = "0px";
                            rangeselect.style.right = "0px";
                            rangeselect.style.height = "23px";
                            rangeselect.id = "rangeselect";

                            container.appendChild(rangeselect);
                            this.domNode.appendChild(container);

                            var selector = new am4plugins_rangeSelector.DateAxisRangeSelector();
                            selector.container = document.getElementById("rangeselect");
                            selector.axis = dateAxis;
                            selector.inputDateFormat = "yyyy-MM-dd";

                            //build bottons for Range Selector based on range of dates (max-min=diff)
                            //window.alert('diff2 = ' + diff + ' days');
                            if (diff < 28) {
                                selector.periods.length = 0; // empty Array
                                selector.periods.unshift({ name: "MAX", interval: "max" });
                                selector.periods.unshift({ name: "1W", interval: { timeUnit: "week", count: 1 }});
                                selector.periods.unshift({ name: "3d", interval: { timeUnit: "day", count: 3 }});
                                selector.periods.unshift({ name: "1d", interval: { timeUnit: "day", count: 1 }});
                            } else if (diff < 210){
                                selector.periods.length = 0; // empty Array
                                selector.periods.unshift({ name: "MAX", interval: "max" });
                                selector.periods.unshift({ name: "3M", interval: { timeUnit: "month", count: 3 }});
                                selector.periods.unshift({ name: "1M", interval: { timeUnit: "month", count: 1 }});
                                selector.periods.unshift({ name: "2W", interval: { timeUnit: "week", count: 2 }});
                                selector.periods.unshift({ name: "1W", interval: { timeUnit: "week", count: 1 }});
                            } else if (diff > 210) {
                                selector.periods.length = 0; // empty Array
                                selector.periods.unshift({ name: "MAX", interval: "max" });
                                selector.periods.unshift({ name: "YTD", interval: "ytd" });
                                selector.periods.unshift({ name: "1Y", interval: { timeUnit: "year", count: 1 }});
                                selector.periods.unshift({ name: "6M", interval: { timeUnit: "month", count: 6 }});
                                selector.periods.unshift({ name: "3M", interval: { timeUnit: "month", count: 3 }});
                                selector.periods.unshift({ name: "1M", interval: { timeUnit: "month", count: 1 }});
                                selector.periods.unshift({ name: "2W", interval: { timeUnit: "week", count: 2 }});
                            }
                        }
                    } ;
                };

                //NOTE oppositeAxis-Switches --------------------------------//
                // translate oppositeAxis-switches to Array, array is then in createSeries check to evaluate whether opposite axis is needed.
                var oppositeA = [];
                var ownA = [];
                datapool.cols.forEach((col, i) => {
                           if (me.getProperty("oppositeAxis" + i)) {
                               oppositeA[i] = me.getProperty("oppositeAxis" + i);
                           };
                           if (me.getProperty("ownAxis" + i)) {
                               ownA[i] = me.getProperty("ownAxis" + i);
                           }
                });

                // Default or "global" value axis
                var valueAxis = chart2.yAxes.push(new am4charts.ValueAxis());
                // Format valueAxis
                //valueAxis.renderer.labels.template.fill = YAxisColor;
                valueAxis.renderer.grid.template.stroke = am4core.color(allProps["amountStrokeYColor"].fillColor);
                valueAxis.renderer.grid.template.strokeOpacity = allProps["amountStrokeYColor"].fillAlpha * 0.01;
                valueAxis.renderer.labels.template.fill = am4core.color(allProps["fontColor"].fillColor);
                //valueAxis.renderer.line.strokeWidth = 2;
                valueAxis.renderer.line.stroke = am4core.color(allProps["axisYColor"].fillColor);
                valueAxis.renderer.line.strokeOpacity = allProps["axisYColor"].fillAlpha * 0.01;
                valueAxis.tooltip.background.fill = am4core.color(allProps["selectorColor"].fillColor);
                valueAxis.tooltip.background.strokeWidth = 0;
                valueAxis.tooltip.label.fill = am4core.color(allProps["selectorBackground"].fillColor);

                // Axis Metric Formatter
                if (me.getProperty("metricFormat" + 0) !== undefined) {
                    valueAxis.numberFormatter = new am4core.NumberFormatter();
                    valueAxis.numberFormatter.numberFormat = me.getProperty("metricFormat" + 0);
                }

                // Start Value Axis always at Zero
                if (allProps["startAtZero"] === 'true') {
                    valueAxis.min = 0;
                    valueAxis.strictMinMax = true;
                }

                if (allProps["hideYAxisLabels"] === 'true') {
                    valueAxis.renderer.labels.template.disabled = true;
                    valueAxis.cursorTooltipEnabled = false;
                } else {
                    valueAxis.renderer.labels.template.disabled = false;
                    valueAxis.cursorTooltipEnabled = (allProps["showAxisTooltip"] === 'true');
                }

                //NOTE createSeries() --------------------------------//
                function createSeries(field, name, index, hiddenInLegend) {
                    var series, bullet;
                            // extract the index i from field = "value+i"
                            //var j = Number(field.substring(field.length - 1, field.length));
                    (allProps["showDebugMsgs"] == 'true') ? window.alert('104: createSeries index set: ' + index): 0;

                    if (me.getProperty("metricFormat" + index) !== undefined) {
                        //get Metric Format
                        //er = "[#0f0]#,###.00[/]";    //er = "[/bold]#,##[/]";    //er = "??? #,###.00";
                        er = me.getProperty("metricFormat" + index).replace(/'/g, "");
                        valueYformat = "{valueY.formatNumber('" + er + "')}";
                    } else {
                        valueYformat = "{valueY}";
                    }

                    if (AttrIsDate == 'false') {
                        (allProps["showDebugMsgs"] == 'true') ? window.alert('105a: category-based AttrIsDate = ' + AttrIsDate): 0;
                        // None-Date-Block (to be executed if attribute is no date and therefore series must be created for values of attribute(Country: Italy, Germany, Spain))
                        categoryAxis.dataFields.category = "date";
                        categoryAxis.renderer.grid.template.location = 0 ;

                        var label = categoryAxis.renderer.labels.template;
                        label.wrap = true;
                        label.maxWidth = 120;

                        series = chart2.series.push(new am4charts.ColumnSeries());
                        series.name = name;
                        series.dataFields.valueY = field;
                        series.dataFields.categoryX = "date";
                        series.tooltipText = "{name}: " + valueYformat;

                        //show values inside chart
                        if (allProps["showItemLabels"] === "true" && allProps["valuesLegend"] === "false") {
                            let valueLabel = series.columns.template.createChild(am4core.Label);
                            //valueLabel.text = "{valueY}";
                            valueLabel.text = valueYformat;

                            //valueLabel.fontSize = 20;
                            valueLabel.align = allProps["positionLabel"]; // "left" | "center" | "right" | "none"
                            valueLabel.valign = allProps["positionVLabel"]; // "top" | "middle" | "bottom" | "none"
                            
                            valueLabel.fill = am4core.color(allProps["labelColor"].fillColor);
                            //valueLabel.dx = 10;
                            //valueLabel.locationY = 0.5; // 0 = Top, 1 = Bottom, 0.5 = Middle
                            valueLabel.strokeWidth = 0;
                            valueLabel.paddingTop = 3;
                            valueLabel.paddingBottom = 3;
                            // truncate and hideOversized: hide column labels when bigger than column, truncate false to prevent text cropping
                            valueLabel.truncate = false;
                            valueLabel.hideOversized = true;
                        };
                    } else {
                        // Date-Block
                        (allProps["showDebugMsgs"] == 'true') ? window.alert('105b: createSeries Date-Block AttrIsDate: ' + AttrIsDate): 0;
                        series = chart2.series.push(new am4charts.LineSeries());
                        series.name = name;
                        series.dataFields.valueY = field;
                        series.dataFields.dateX = "date";
                        series.groupFields.valueY = allProps["aggregateValues"];
                        series.minBulletDistance = 15;
                        series.tooltipText = seriesToolTipFormat;
                        //insert metric form in Tooltip
                        var tipParts = seriesToolTipFormat.split('{valueY}');
                        seriesToolTipFormatted = tipParts[0] + valueYformat + tipParts[1]
                        series.tooltipText = seriesToolTipFormatted;

                        bullet = series.bullets.push(new am4charts.CircleBullet());
                        bullet.circle.stroke = am4core.color("#fff");
                        bullet.circle.strokeWidth = 1;
                        bullet.circle.radius = 3;
                    }




























                    // Legend as radio buttons
                    // Create own Axis for toggle axis and disable global axis
                    // https://www.amcharts.com/docs/v4/tutorials/auto-hide-value-axes/
                    // https://www.amcharts.com/docs/v4/tutorials/allow-just-single-series-to-be-displayed-at-a-time/
                    // CodePen Home amCharts 4: Inversed legend behavior
                    // https://codepen.io/team/amcharts/pen/bGERoWo?editors=0010
                    // amCharts 4: Auto-hide value axis when related series is hidden
                    // https://codepen.io/team/amcharts/pen/KLYrww?editors=0010
                    if (allProps["enableToggle"] === "true") {
                        //window.alert('set toggle')
                        //disable global YAxis
                        valueAxis.disabled = true;
                        // Hide but first series
                        if (!index == 0) {
                            series.hidden = true;                            
                        }

                        //var valueAxis2 = chart2.yAxes.push(new am4charts.ValueAxis());
                        //window['valueAxisDistinct' + index] = chart2.yAxes.push(new am4charts.ValueAxis());
                        this['valueAxisDistinct' + index] = chart2.yAxes.push(new am4charts.ValueAxis());
                        valueAxis2 = this['valueAxisDistinct' + index];

                        valueAxis2.syncWithAxis = valueAxis;
                        valueAxis2.title.text = series.name + index;
                        //valueAxis2.name = series.name;
                        //valueAxis2.renderer.opposite = false;
                        valueAxis2.renderer.grid.template.stroke = am4core.color(allProps["amountStrokeYColor"].fillColor);
                        valueAxis2.renderer.grid.template.strokeOpacity = 0;
                        valueAxis2.renderer.labels.template.fill = am4core.color(allProps["fontColor"].fillColor);
                        //valueAxis2.renderer.line.strokeWidth = 2;
                        valueAxis2.renderer.line.stroke = am4core.color(allProps["axisYColor"].fillColor);
                        valueAxis2.renderer.line.strokeOpacity = allProps["axisYColor"].fillAlpha * 0.01;
                        valueAxis2.tooltip.background.fill = am4core.color(allProps["selectorColor"].fillColor);
                        valueAxis2.tooltip.background.strokeWidth = 0;
                        valueAxis2.tooltip.label.fill = am4core.color(allProps["selectorBackground"].fillColor);

                        // FIXME own Axis labels not working properly. most likely because this code is not binded to a metric but rather gets "random" assigned.
                        // Axis Metric Formatter
                        if (me.getProperty("metricFormat" + index) !== undefined) {
                            valueAxis2.numberFormatter = new am4core.NumberFormatter();
                            valueAxis2.numberFormatter.numberFormat = me.getProperty("metricFormat" + index);
                        }
                        // Start Value Axis always at Zero
                        if (allProps["startAtZero"] === 'true') {
                            valueAxis2.min = 0;
                            valueAxis2.strictMinMax = true;
                        }
                        if (allProps["hideYAxisLabels"] === 'true') {
                            valueAxis2.renderer.labels.template.disabled = true;
                            valueAxis2.cursorTooltipEnabled = false;
                        } else {
                            valueAxis2.renderer.labels.template.disabled = false;
                            valueAxis2.cursorTooltipEnabled = (allProps["showAxisTooltip"] === 'true');
                        }

                        series.events.on("hidden", toggleAxes);
                        series.events.on("shown", toggleAxes);
                        //window.alert('index: ' + index);
                        
                        // assign axis to current series
                        series.yAxis = valueAxis2;
                    };

                    






























                    //NOTE createSeries: Values in Legend --------------------------------//
                    if (allProps["valuesLegend"] === "true") {
                        // show values in legend //window.alert('metricFormat+index: ' + me.getProperty("metricFormat" + index) + ' // index = ' + index);
                        series.legendSettings.itemValueText = "[bold]" + valueYformat + "[/bold]";
                        series.tooltip.disabled = true;
                    }

                    //NOTE createSeries: stacked or non-stacked --------------------------------//
                    if (allProps["enableStacked"] === 'true') {
                        series.stacked = true;
                    } else {
                        series.stacked = false;
                    }

                    series.strokeWidth = 2;
                    if (allProps["displayFill"] === 'true') {
                        series.fillOpacity = allProps["amountFillOpacity"]/10;
                    }
                    if (hiddenInLegend) {
                        series.hiddenInLegend = true;
                    }

                    //NOTE createSeries: combined Tooltip --------------------------------//
                    if (allProps["combineTooltip"] === 'true' && allProps["singleTooltip"] === 'true') {
                        // Set up tooltip
                        series.adapter.add("tooltipText", function (ev) {
                            var text = "[bold]{dateX}[/]\n"
                            chart2.series.each(function (item) {
                                if (!item.isHidden) {
                                    text += "[" + item.stroke.hex + "]???[/] " + item.name + ": {" + item.dataFields.valueY + "}\n";
                                    //text += "[" + item.stroke.hex + "]???[/] " + item.name + ": {" + item.dataFields.valueY + ".formatNumber('" + er + "')}\n";                                    
                                }
                            });
                            return text;
                        });

                        series.tooltip.getFillFromObject = false;
                        series.tooltip.background.fill = am4core.color(allProps["selectorBackground"].fillColor);
                        series.tooltip.label.fill = am4core.color(allProps["fontColor"].fillColor);
                        // Prevent cross-fading of tooltips
                        series.tooltip.defaultState.transitionDuration = 0;
                        series.tooltip.hiddenState.transitionDuration = 0;
                    }

                    //NOTE createSeries: Opposite Axis --------------------------------//
                    // check whether oppositeA has a true at that index, if so create opposite Axis
                    if (oppositeA[index] == 'true') {
                        (allProps["showDebugMsgs"] == 'true') ? window.alert('107 Start oppositeA[index] == true'): 0;
                        // Create new ValueAxis
                        var valueAxis2 = chart2.yAxes.push(new am4charts.ValueAxis());
                        valueAxis2.syncWithAxis = valueAxis;
                        // Name Value Axis and set it to opposite
                        valueAxis2.title.text = series.name;
                        valueAxis2.renderer.opposite = true;
                        valueAxis2.renderer.grid.template.stroke = am4core.color(allProps["amountStrokeYColor"].fillColor);
                        valueAxis2.renderer.grid.template.strokeOpacity = 0;
                        //valueAxis2.renderer.line.strokeWidth = 2;
                        valueAxis2.renderer.line.stroke = am4core.color(allProps["axisYColor"].fillColor);
                        valueAxis2.renderer.line.strokeOpacity = allProps["axisYColor"].fillAlpha * 0.01;
                        
                        if (allProps["hideYAxisLabels"] === 'true') {
                            valueAxis2.renderer.labels.template.disabled = true;
                            valueAxis2.cursorTooltipEnabled = false;
                        } else {
                            valueAxis2.renderer.labels.template.disabled = false;
                            valueAxis2.renderer.labels.template.fill = am4core.color(allProps["fontColor"].fillColor);
                            valueAxis2.cursorTooltipEnabled = (allProps["showAxisTooltip"] === 'true');
                        }
                        // Axis Metric Formatter
                        if (me.getProperty("metricFormat" + index) !== undefined) {
                            valueAxis2.numberFormatter = new am4core.NumberFormatter();
                            valueAxis2.numberFormatter.numberFormat = me.getProperty("metricFormat" + index);
                        }


                        // assign axis to current series
                        series.yAxis = valueAxis2;
                        
                       {
                        /* ownAxis
                        var valueAxis2 = chart2.yAxes.push(new am4charts.ValueAxis());
                        //window.alert('index: ' + index + ' //oppositeA[index]: ' + oppositeA[index] + ' //ownA[index]: ' + ownA[index])
                        if (ownA[index] == 'true') {
                            //window.alert('1. own')
                            // Create new ValueAxis
                            let valueAxisOwn = chart2.yAxes.push(new am4charts.ValueAxis());
                            valueAxisOwn.syncWithAxis = valueAxis;
                            // Name Value Axis and set it to opposite
                            valueAxisOwn.title.text = series.name;
                            valueAxisOwn.renderer.opposite = true;
                            valueAxisOwn.renderer.grid.template.stroke = am4core.color(allProps["amountStrokeYColor"].fillColor);
                            valueAxisOwn.renderer.grid.template.strokeOpacity = allProps["amountStrokeYColor"].fillAlpha * 0.01;
                            valueAxisOwn.renderer.labels.template.fill = am4core.color(allProps["fontColor"].fillColor);
                            // Axis Metric Formatter
                            if (me.getProperty("metricFormat" + index) !== undefined) {
                                valueAxisOwn.numberFormatter = new am4core.NumberFormatter();
                                valueAxisOwn.numberFormatter.numberFormat = me.getProperty("metricFormat" + index);
                            }
                            // assign axis to current series
                            series.yAxis = valueAxisOwn;
                        //} else if (typeof (ownA[index]) == "undefined" || ownA[index] == 'false') {
                        } else {
                            //window.alert('2. NOT own')
                            if (oppositeValueAxisFlag == 1) {
                                //window.alert('3. jippie: ' + oppositeValueAxisFlag);
                                //valueAxis2.title.text += series.name;
                                series.yAxis = valueAxis2;
                            } else {
                                // Create new ValueAxis
                                //var valueAxis2 = chart2.yAxes.push(new am4charts.ValueAxis());
                                oppositeValueAxisFlag = 1;
                                //window.alert('4. set: ' + oppositeValueAxisFlag);

                                valueAxis2.syncWithAxis = valueAxis;
                                // Name Value Axis and set it to opposite
                                valueAxis2.title.text = series.name;
                                valueAxis2.renderer.opposite = true;
                                valueAxis2.renderer.grid.template.stroke = am4core.color(allProps["amountStrokeYColor"].fillColor);
                                valueAxis2.renderer.grid.template.strokeOpacity = allProps["amountStrokeYColor"]fillAlpha * 0.01;
                                valueAxis2.renderer.labels.template.fill = am4core.color(allProps["fontColor"].fillColor);
                                // Axis Metric Formatter
                                if (me.getProperty("metricFormat" + index) !== undefined) {
                                    valueAxis2.numberFormatter = new am4core.NumberFormatter();
                                    valueAxis2.numberFormatter.numberFormat = me.getProperty("metricFormat" + index);
                                }
                                // assign axis to current series
                                series.yAxis = valueAxis2;
                            }

                            

                        }
                        */
                       }
                        (allProps["showDebugMsgs"] == 'true') ? window.alert('108: While oppositeA[index] == true'): 0;
                    };

                    (allProps["showDebugMsgs"] == 'true') ? window.alert('109: After oppositeA[index] == true'): 0;
                    return series;
                    
                };
                (allProps["showDebugMsgs"] == 'true') ? window.alert('110: After function createSeries'): 0;

                let allSeries = [];

                //NOTE Call Series --------------------------------//
                // no Break-By
                if (datapool.attrs.length == 1) {
                    (allProps["showDebugMsgs"] == 'true') ? window.alert('111: no break-by'): 0;
                    datapool.cols.forEach((col, i) => {
                        var s = createSeries("values" + i, col, i);
                        allSeries.push(s);
                    })
                // Break-By
                //if (typeof datapool.transMetricNames !== "undefined")
                } else if (datapool.attrs.length > 1 && datapool.cols.length == 1) {
                    (allProps["showDebugMsgs"] == 'true') ? window.alert('112: break-by found'): 0;
                    datapool.transMetricNames.forEach((col, i) => {
                        var s = createSeries(col, col, 0); // 0 as index for breakby as there can only be one metric on breakby
                        allSeries.push(s);
                    })
                } else if (datapool.attrs.length > 1 && datapool.cols.length > 1) {
                    (allProps["showDebugMsgs"] == 'true') ? window.alert('113: break-by found with too many metrics!'): 0;
                    window.alert(datapool.attrs.length + ' Attributes and ' + datapool.cols.length + ' Metrics is too much for this Visualization to handle. Valid Combinations: \n1 (Time)Attribute and 1 or more Metrics OR 2 (Time)Attributes and 1 Metric')
                };


                // NOTE Legend and Cursor
                if (allProps["showLegend"] === 'true') {
                    (allProps["showDebugMsgs"] == 'true') ? window.alert('114: showLegend is true!'): 0;
                    chart2.legend = new am4charts.Legend();
                    chart2.legend.position = allProps["positionLegend"];
                    chart2.legend.margin(0, 5, 10, 5);
                    //chart2.legend.padding(5,5,5,5);
                    chart2.legend.scrollable = true;
                    chart2.legend.labels.template.fill = am4core.color(allProps["selectorColor"].fillColor);
                    // TODO Truncating labels
                    //chart2.legend.labels.template.maxWidth = 150;
                    //chart2.legend.labels.template.truncate = true;
                    //chart2.legend.itemContainers.template.tooltipText = "{category}";

                    chart2.legend.valueLabels.template.fill = am4core.color(allProps["selectorColor"].fillColor);
                    // TODO select valueLabel position
                    //chart2.legend.valueLabels.template.align = "left"; // left, right
                    //chart2.legend.valueLabels.template.textAlign = "end"; // start, end

                    /* TODO format legend
                    let lblFontLegend = allProps["labelFontLegend"];
                    chart2.legend.labels.template.fill = am4core.color(lblFontLegend.fontColor);
                    chart2.legend.fontFamily = lblFontLegend.fontFamily;
                    chart2.legend.fontSize = lblFontLegend.fontSize;
                    //fontWeight = "normal" | "bold" | "bolder" | "lighter" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900"
                    if (lblFontLegend.fontWeight == 'true') {
                        chart2.legend.fontWeight = "bold";
                    } else {
                        chart2.legend.fontWeight = "normal";
                    }
                    */
                    
                    if (allProps["padLegend"] === 'true') {
                        let paddingAmount = allProps["padLegendAmount"];
                        if (allProps["positionLegend"] === "top" || allProps["positionLegend"] === "bottom") {
                            chart2.legend.itemContainers.template.paddingLeft = allProps["padLegendAmount"] / 2;
                            chart2.legend.itemContainers.template.paddingRight = allProps["padLegendAmount"] / 2;
                        } else {
                            chart2.legend.itemContainers.template.paddingTop = allProps["padLegendAmount"] / 2;
                            chart2.legend.itemContainers.template.paddingBottom = allProps["padLegendAmount"] / 2;
                        };
                    };

                    if (allProps["maxHeightLegend"] === 'true') {
                        chart2.legend.maxHeight = allProps["maxHeightLegendAmount"]
                    };
                    if (allProps["maxWidthLegend"] === 'true') {
                        chart2.legend.maxWidth = allProps["maxWidthLegendAmount"];
                    };
                    if (allProps["sizeMarkerLegend"] === 'true') {
                        chart2.legend.markers.template.width = allProps["sizeMarkerLegendAmount"];
                        chart2.legend.markers.template.height = allProps["sizeMarkerLegendAmount"];
                    };
                    if (allProps["valuesLegend"] === "true") {
                        // show values in legend
                        chart2.legend.background.fill = am4core.color(allProps["selectorBackground"].fillColor);
                        chart2.legend.align = "center";
                    };
                    if (allProps["positionLegend"] === "top" || allProps["positionLegend"] === "bottom") {
                        chart2.legend.width = am4core.percent(80);
                    }



































                    // Legend as radio buttons
                    // TODO show just one series: switch metrics
                    // Problem: adjust Y-Axis to only shown series.
                    // https://www.amcharts.com/docs/v4/tutorials/toggling-multiple-series-with-a-single-legend-item/
                    //https://www.amcharts.com/docs/v4/tutorials/allow-just-single-series-to-be-displayed-at-a-time/
                    if (allProps["enableToggle"] === "true") {
                        // FIXME not working as Y-Axis is not updated properly
                        // Loop through all Metrics:
                        // datapool.cols.forEach((col, i) => {
                        //     /* here we need to create separate axis for each metric*/
                        // });
                        // create Second value axis
                        // var valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis());
                        // valueAxis2.title.text = "Units sold";
                        // Hide valueAxis:
                        // valueAxis2.disabled = false;
                        // Assign Series to valueAxis:
                        // series2.yAxis = valueAxis2;
                        chart2.legend.itemContainers.template.togglable = false;

                        chart2.legend.itemContainers.template.events.on("hit", function (event) {
                            var target = event.target;
                            target.isActive = false;
                            var currentSeries = target.dataItem.dataContext;
                            chart2.series.each(function (series) {
                                if (series != currentSeries) {
                                    series.hide();
                                    //valueAxis2[series.name].disabled = true;
                                }
                            })
                            currentSeries.show();
                        })
                    };
                };
                function toggleAxes(ev) {
                    var axis = ev.target.yAxis;
                    var disabled = true;
                    axis.series.each(function (series) {
                        if (!series.isHiding && !series.isHidden) {
                            disabled = false;
                        }
                    });
                    axis.disabled = disabled;
                    //axis.hidden = false;
                }












chart2.yAxes.each((axis) => {
    axis.dataItems.each((dataItem) => {
        dataItem.value = null;
    })
})


































                if (allProps["displayXYCursor"] === 'true') {
                    chart2.cursor = new am4charts.XYCursor();
                    chart2.cursor.lineY.disabled = (allProps["hideXYCursorLines"] === 'true');
                    chart2.cursor.lineX.disabled = (allProps["hideXYCursorLines"] === 'true');
                    chart2.zoomOutButton.background.fill = am4core.color(allProps["selectorBackground"].fillColor);
                    chart2.zoomOutButton.background.stroke = am4core.color(allProps["selectorColor"].fillColor);
                    chart2.zoomOutButton.background.strokeWidth = 1;
                    chart2.zoomOutButton.background.strokeOpacity = 1;
                    chart2.zoomOutButton.icon.stroke = am4core.color(allProps["selectorColor"].fillColor);
                    chart2.zoomOutButton.icon.strokeWidth = 2;
                    chart2.zoomOutButton.background.states.getKey("hover").properties.fill = am4core.color("#5A5F73");

                    if (allProps["fullWidthCursor"] === 'true') {
                        if (AttrIsDate == 'false') {
                            chart2.cursor.xAxis = categoryAxis;
                        } else {
                            chart2.cursor.xAxis = dateAxis;
                        }
                        chart2.cursor.fullWidthLineX = true;
                        //chart2.cursor.lineX.fill = am4core.color("#8F3985");
                        chart2.cursor.lineX.fill = am4core.color(allProps["scrollbarThumbColor"].fillColor);
                        //chart2.cursor.lineX.fillOpacity = 0.1;
                        chart2.cursor.lineX.fillOpacity = allProps["scrollbarThumbColor"].fillAlpha * 0.01;
                        chart2.cursor.lineY.disabled = true;
                    }
                    //chart2.cursor.fullWidthLineX = (allProps["hideXYCursorLines"] === 'true');
                    if (allProps["singleTooltip"] === 'true') {
                        chart2.cursor.maxTooltipDistance = 0;
                    };
                };

                // Create a horizontal scrollbar with preview and place it underneath the date axis
                if (allProps["displayXYChartScrollbar"] === 'true') {

                    allSeries[0].show(); // hardcoded reference for series1
                    chart2.scrollbarX = new am4charts.XYChartScrollbar();
                    chart2.scrollbarX.minHeight = 40;

                    // Customize scrollbar background, when hovered
                    chart2.scrollbarX.background.fill = am4core.color(allProps["scrollbarBackgroundColor"].fillColor);
                    chart2.scrollbarX.background.fillOpacity = allProps["scrollbarBackgroundColor"].fillAlpha * 0.01;
                    //chart2.scrollbarX.stroke = am4core.color("red");
                    //chart2.scrollbarX.background.filters.clear();

                    // Customize scrollbar background, when unhovered
                    chart2.scrollbarX.thumb.background.fill = am4core.color(allProps["scrollbarThumbColor"].fillColor);
                    chart2.scrollbarX.thumb.background.fillOpacity = allProps["scrollbarThumbColor"].fillAlpha * 0.01;
                    // Unselected area
                    chart2.scrollbarX.unselectedOverlay.fill = am4core.color(allProps["scrollbarUnselectedColor"].fillColor);
                    chart2.scrollbarX.unselectedOverlay.fillOpacity = allProps["scrollbarUnselectedColor"].fillAlpha * 0.01;

                    chart2.scrollbarX.series.push(allSeries[0]);
                    chart2.scrollbarX.parent = chart2.bottomAxesContainer;
                    chart2.scrollbarX.scrollbarChart.series.getIndex(0).fillOpacity = 0.5;
                    // Bullets remove only for line not bar chart
                    (AttrIsDate == 'true') ? chart2.scrollbarX.scrollbarChart.series.getIndex(0).bullets.getIndex(0).disabled = true : 0;                    
                    chart2.scrollbarX.scrollbarChart.plotContainer.filters.clear(); // remove desaturation
                    //chart2.scrollbarX.scrollbarChart.plotContainer.filters.DesaturateFilter.saturation = 0.5;
                    customizeGrip(chart2.scrollbarX.startGrip);
                    customizeGrip(chart2.scrollbarX.endGrip);
                }

                //NOTE customizeGrip() --------------------------------//
                // Style scrollbar
                function customizeGrip(grip) {
                    (allProps["showDebugMsgs"] == 'true') ? window.alert('115 customizeGrip(grip)'): 0;
                    // Remove default grip image
                    grip.icon.disabled = true;

                    // Disable background
                    grip.background.disabled = true;

                    // Add rotated rectangle as bi-di arrow
                    var img = grip.createChild(am4core.Circle);
                    img.width = 10;
                    img.height = 10;
                    img.fill = am4core.color("#999");
                    //img.rotation = 45;
                    img.align = "center";
                    img.valign = "middle";

                    // Add vertical bar
                    var line = grip.createChild(am4core.Rectangle);
                    line.height = 40;
                    line.width = 1;
                    line.fill = am4core.color("#999");
                    line.align = "center";
                    line.valign = "middle";
                }


                // ! ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                // ! NOTE: Visualisation as Selector
                // https://www.amcharts.com/docs/v4/tutorials/handling-axis-zoom-events-via-api/
                if (allProps["vizAsSelect"] === 'true') {
                    (allProps["showDebugMsgs"] == 'true') ? window.alert('116 Visualisation as Selector'): 0;
                    // ! Visualisation as Selector
                    this.addUseAsFilterMenuItem();

                    //For Debugging 1/4:
                    //var label = chart2.createChild(am4core.Label);
                    //label.fontSize = 16;
                    //label.align = "center";
                    var dataraw = this.dataInterface.getRawData(mstrmojo.models.template.DataInterface.ENUM_RAW_DATA_FORMAT.TREE, {
                        hasSelection: true
                    }).children;

                    // Date and DateTime-Axis as Selector:
                    if (!(AttrIsDate === 'false')) {
                        (allProps["showDebugMsgs"] == 'true') ? window.alert('117 Date and DateTime-Axis as Selector'): 0;
                        //dateAxis.events.on("selectionextremeschanged", dateAxisChanged); //Not fancy having two events? If you are using ValueAxis or DateAxis you can use a unified "selectionextremeschanged" event instead.
                        dateAxis.events.on("startendchanged", dateAxisChanged); //invokes too many times till final zoom state
                        //chart2.cursor.events.on('zoomended', dateAxisChanged); //works only for zoom not for panning
                        //chart2.cursor.events.on("selectended", dateAxisChanged); //works only for zoom not for panning

                        function dateAxisChanged(ev) {
                            var start = new Date(ev.target.minZoomed);
                            var end = new Date(ev.target.maxZoomed);

                            //Object used for the "use as a filter" functionality
                            var selectorData = [];
                            selectorData.length = 0; // empty Array

                            
                            // When selecting dates, set time to 00:00:00,000. Selecting 01.Jan.2021 03:50:00 becomes 01.Jan.2021 00:00:00 and therefore includes the 01.Jan in selection Date
                            if (AttrIsDate === "date") {
                                start.setHours(0, 0, 0, 0);
                            }

                            let attrlength = dp.getTotalRows();
                            for (i = 0; i < attrlength; i++) {
                                let dpdate = datapool.rows[i].date;
                                if (+start <= +dpdate && +dpdate <= +end) {
                                //        ^ serialisation steps (+); serialized dates or datetime can be easier compared than date objects. Much much easier.
                                selectorData.push(dataraw[i].attributeSelector)
                                } else if (+end < +dpdate) {
                                    break;
                                }
                            }

                            //For Debugging 2/4:
                            //label.text = "Start: " + start.toLocaleDateString('de-DE') + " t: " + start.toLocaleTimeString('de-DE') + " --//-- End: " + end.toLocaleDateString('de-DE') + " t: " + end.toLocaleTimeString('de-DE');

                            // apply array to filter visualisation
                            me.applySelection(selectorData);

                            //For Debugging:
                            //var Say1 = 'start.toISOString: ' + start.toISOString() + "\n" +
                            //        'end.toISOString: ' + end.toISOString() + '\n';
                            //var Say2 = 'attrlength: ' + JSON.stringify(attrlength) +
                            //        '\n selectordata: ';
                            //var myWindow2 = PopUp(Say1, Say2, selectorData);
                        }
                    // Catgory-Axis as Selector:
                    } else if (AttrIsDate === 'false'){
                        (allProps["showDebugMsgs"] == 'true') ? window.alert('118 Catgory-Axis as Selector'): 0;
                        //window.alert('looks like Category');
                        categoryAxis.events.on("startendchanged", categoryAxisZoomed); //invokes too many times till final zoom state

                        function categoryAxisZoomed(ev) {
                            let axis = ev.target;
                            let start = axis.getPositionLabel(axis.start);
                            let end = axis.getPositionLabel(axis.end);

                            //Object used for the "use as a filter" functionality
                            var selectorData = [];
                            selectorData.length = 0; // empty Array

                            let attrlength = dp.getTotalRows();
                            for (i = 0; i < attrlength; i++) {
                                let dpdate = datapool.rows[i].date;
                                //window.alert('start: ' + start + '\nend: ' + end + '\ndpdate: ' + dpdate)
                                if (start <= dpdate && dpdate <= end) {
                                    selectorData.push(dataraw[i].attributeSelector)
                                } else if (+end < +dpdate) {
                                    break;
                                }
                            }

                            //For Debugging 3/4:
                            //label.text = "Start: " + start + " --//-- End: " + end;

                            // apply array to filter visualisation
                            me.applySelection(selectorData);

                            //For Debugging 4/4:
                            //var Say1 = 'start: ' + start +
                            //        '\nend: ' + end;
                            //var Say2 = 'attrlength: ' + JSON.stringify(attrlength) +
                            //        '\nselectordata: ';
                            //var myWindow2 = PopUp(Say1, Say2, selectorData);
                        }
                    }
                }


// ! ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                // NOTE prepareData()
                // https://www2.microstrategy.com/producthelp/2020/VisSDK/Content/topics/HTML5/DataInterfaceAPI.htm
                // https://www2.microstrategy.com/producthelp/Current/VisSDK/Content/topics/HTML5/DataInterfaceAPI.htm#DataInterface
                // https://lw.microstrategy.com/msdz/MSDL/GARelease_Current/_GARelease_Archives/103/docs/projects/VisSDK_All/Default.htm#topics/HTML5/Data_Interface_API.htm
                function prepareData() {
                    // Create a new array (datapool) and push the objects datarecords to the new array. each datarecord is one single object in the array.
                    // additional a check on "how many attributes?" and "how many metrics are being used?" must be performed to derive the FOR-Indicators
                    // additional a check is needed to format the datetime attribute from MSTR to a datetime attibute in JS.
                    // datapool = {"cols" : [mtr1.Name, mtr2.Name],
                    //             "attrs" : [attr1.Name, attr2.Name],
                    //             "rows" : [{ "attr.Name" : attr.Value1,
                    //                         "mtr1.Name" : mtr1.Value1,
                    //                         "mtr2.Name" : mtr2.Value1 }, {"attr.Name" : attr.Value2, ...}, {...}], 
                    var datapool = {};


                    // if date then (Input dd.mm.yy)
                    let attrlength = dp.getRowHeaders(0).getHeader(0).getName().length;
                    let digitscount;
                    // count only digits (\d) from 0-9.
                    try {
                        digitscount = String(dp.getRowHeaders(0).getHeader(0).getName()).match(/\d/g).length;
                        //window.alert("Number of digits found: " + digitscount);
                    } catch (err) {
                        // no digits found -> no date(time) -> AttrCount must result in > 5
                        digitscount = -6;
                        //window.alert('Number of digits found: ' + digitscount + ' Error: ' + err.message);
                    };

                    switch (attrlength - digitscount) {
                        //Date: if attribute has length - digitcount = 2 then we assume a date
                        case 2:
                            AttrIsDate = "date";
                            AttrCount = 1;
                            break;
                        //Datetime: if attribute has length(19) - digitcount(14: mmddyyyyhhmmss) = 5 then we assume a datetime (3 date separator, space and 1 time)
                        case 4:
                            AttrIsDate = "datetime";
                            AttrCount = 1;
                            break;
                        case 5:
                            AttrIsDate = "datetime";
                            AttrCount = 1;
                            break;
                        default:
                            AttrIsDate = "false";
                            AttrCount = 0;
                    }

                    datapool.attrs = [];
                    // Attributes.Names: set attribute names ["attributename1","attributename2"]
                    for (var z = 0; z < dp.getRowTitles().size(); z++) {
                        datapool.attrs[z] = dp.getRowTitles(0).getTitle(z).getName();
                    }
                    datapool.cols = [];
                    // Metric.Names: set metric column names ["metricname1","metricname2"]
                    for (var z = 0; z < dp.getColumnHeaderCount(); z++) {
                        datapool.cols[z] = dp.getColHeaders(0).getHeader(z).getName();
                    }

                    //set rows data
                    var rows = [];
                    //window.alert('new be4 c.date: ' + JSON.stringify(dp.getRowHeaders(0).getHeader(0).getName()));
                    //go thru all rows
                    for (i = 0; i < dp.getTotalRows(); i++) {
                        var c = {}
                        // Attribute.Values: get date from data. date needs to be in the form of dd.mm.yyyy
                        c.date = dp.getRowHeaders(i).getHeader(0).getName();






                        /// NEW Approach
                        c.date = createDateTime(c.date);

                        function createDateTime(conv2Date) {
                            //if (startAttrIsDate === "datetime") {
                            //(i < 1) ? window.alert('conv2date b4: ' + conv2Date + '\nformat b4: ' + allProps["dateTimeFormat"] + '\nAttrIsDate: ' + AttrIsDate): 0;

                            if (AttrIsDate === "false") {
                                //(i < 1) ? window.alert('exit function'): 0;
                                return conv2Date;
                                //return;
                            }


                            var fragOfTime = conv2Date.split(/[\s,-/\\:]+/), // split by multiple chars ( \s = [whitespace] | ,-/ = [, - . /]Range charcode 44 to charcode 47 | \\ = [\] | : = [:] | []+ = 1 or more)
                                yyyy, mm, dd;
                            if (fragOfTime[2].length == 2) {
                                fragOfTime[2] = '20' + fragOfTime[2];
                            }
                            
                            //(i < 1) ? window.alert('AttrIsDate: ' + AttrIsDate + '\nfragOfTime length: ' + fragOfTime.length): 0;

                            switch (allProps["dateTimeFormat"]) {
                                case "dd-mm-yyyy":
                                    yyyy = fragOfTime[2];
                                    mm = fragOfTime[1];
                                    dd = fragOfTime[0];
                                    break;
                                case "mm-dd-yyyy":
                                    yyyy = fragOfTime[2];
                                    mm = fragOfTime[0];
                                    dd = fragOfTime[1];
                                    break;
                                case "yyyy-dd-mm":
                                    yyyy = fragOfTime[0];
                                    mm = fragOfTime[2];
                                    dd = fragOfTime[1];
                                    break;
                                case "yyyy-mm-dd":
                                    yyyy = fragOfTime[0];
                                    mm = fragOfTime[1];
                                    dd = fragOfTime[2];
                                    break;
                            };

                            //(i < 1) ? window.alert('y: ' + yyyy + ' _m: ' + mm + ' _d: ' + dd + '\nh: ' + fragOfTime[3] + ' : min: ' + fragOfTime[4]): 0;

                            //check if date (d,m,y) or datetime(d,m,y,h,m,s)
                            if (fragOfTime.length === 3) {
                                // Note: JavaScript counts months from 0 to 11. January is 0.
                                // convert to Datetime-Format yyyy-mm-ddTHH:mm:ss.000Z
                                conv2Date = new Date(yyyy, mm - 1, dd);
                                //seriesToolTipFormat = "{openDateX.formatDate('dd.MM.yyyy')} - {dateX.formatDate('dd.MM.yyyy ')}";
                                seriesToolTipFormat = "{dateX.formatDate('dd.MM.yyyy')}:\n {name}:\n [bold]{valueY}[/]"
                            } else if (fragOfTime.length === 6) {
                                conv2Date = new Date(yyyy, mm - 1, dd, fragOfTime[3], fragOfTime[4], fragOfTime[5]);
                                //seriesToolTipFormat = "{openDateX.formatDate('dd.MM.yyyy HH:mm')} - {dateX.formatDate('HH:mm')}";
                                seriesToolTipFormat = "{dateX.formatDate('dd.MM.yyyy HH:mm')}:\n {name}:\n [bold]{valueY}[/]"
                            }
                            return conv2Date;
                        }

                        /// NEW Approach










/*
                        switch (AttrIsDate) {
                            case "date":
                                if (i < 1) {
                                    (allProps["showDebugMsgs"] == 'true') ? window.alert('c.date before: ' + c.date): 0;
                                }
                                if (c.date.indexOf('.') > -1) {
                                    var parts = c.date.split('.');
                                    if (parts[2].length == 2) {
                                        parts[2] = '20' + parts[2];
                                    }
                                    // convert to Datetime-Format yyyy-mm-ddThh:mm:ss.000Z
                                    c.date = new Date(parts[2], parts[1] - 1, parts[0]);
                                } else if (c.date.indexOf('/') > -1) {
                                    var parts = c.date.split('/');
                                    if (parts[2].length == 2) {
                                        parts[2] = '20' + parts[2];
                                    }
                                    // Note: JavaScript counts months from 0 to 11. January is 0. December is 11.
                                    // convert to Datetime-Format yyyy-mm-ddThh:mm:ss.000Z
                                    c.date = new Date(parts[2], parts[0] - 1, parts[1]);
                                }
                                seriesToolTipFormat = "{dateX.formatDate('dd.MM.yyyy')}:\n {name}:\n [bold]{valueY}[/]"
                                break;
                            
                            case "datetime":
                                if (i < 1) {
                                    (allProps["showDebugMsgs"] == 'true') ? window.alert('c.datetime before: ' + c.date): 0;
                                }
                                var parts = c.date.split(' ');
                                //var dparts = parts[0].split('.');
                                var dparts = parts[0].split(/\.|\//); //split by dot(.) or forwardslash(/)
                                var tparts = parts[1].split(':');
                                c.date = new Date(dparts[2], dparts[1] - 1, dparts[0], tparts[0], tparts[1], tparts[2]);
                                seriesToolTipFormat = "{dateX.formatDate('dd.MM.yyyy HH:mm')}:\n {name}:\n [bold]{valueY}[/]"
                                if (i < 1 && allProps["showDebugMsgs"] == 'true') {
                                    //window.alert('dparts2(Y): ' + dparts[2] + ' //+// dparts0(M): ' + dparts[0] + ' //+// dparts1-1(D): ' + (dparts[1] - 1) + ' //+// dparts1: ' + dparts[1] + ' //+// tparts0: ' + tparts[0] + ' //+// tparts1: ' + tparts[1] + ' //+// tparts2: ' + tparts[2]);
                                    var newLine = "\r\n"
                                    var msg = 'c.datetime after: ' + c.date
                                    msg += newLine;
                                    msg += "c.toUTCString: " + c.date.toUTCString();
                                    msg += newLine;
                                    msg += 'c.toISOString: ' + c.date.toISOString();
                                    msg += newLine;
                                    msg += 'c.toLocaleTimeString: ' + c.date.toLocaleTimeString();
                                    msg += newLine;
                                    msg += 'c.toLocaleString: ' + c.date.toLocaleString();
                                    (allProps["showDebugMsgs"] == 'true') ? window.alert(msg): 0;
                                    alert(msg);
                                }
                                break;
                            default:
                                (allProps["showDebugMsgs"] == 'true') ? window.alert('default: Doesn??t look like a date to me: ' + c.date): 0;
                                break;
                        };
*/

                        c.attributes = [];
                        // Attribute.Values: get the attribute values. Z=AttrCount so the first iteration is skipped IF the first attribute is a date and therefore it should be in c.date
                        for (var z = AttrCount; z < dp.getRowTitles().size(); z++) {
                            c[dp.getRowTitles(0).getTitle(z).getName()] = dp.getRowHeaders(i).getHeader(z).getName()
                            //c['attri' + dp.getRowTitles(0).getTitle(z).getName()] = dp.getRowHeaders(i).getHeader(z).getName()
                        }

                        c.values = [];
                        // Metric.Values: get the metric values.
                        for (var z = 0; z < dp.getColumnHeaderCount(); z++) {
                            //https://www2.microstrategy.com/producthelp/Current/VisSDK/Content/topics/HTML5/DataInterfaceAPI.htm#MetricValue
                            //getMetricValue raw (with column-name = values[Count])
                            c['values' + z] = dp.getMetricValue(i, z).getRawValue()
                            //getMetricValue formatted (with column-name = values[Count])
                            //c['formvalues' + z] = dp.getMetricValue(i, z).getValue()
                            //getMetricValue raw (with column-name = metricname)
                            //c[dp.getColHeaders(0).getHeader(z).getName()] = dp.getMetricValue(i, z).getRawValue()
                            //getMetricValue formatted (with column-name = metricname)
                            //c[dp.getColHeaders(0).getHeader(z).getName()] = dp.getMetricValue(i, z).getValue()
                        }
                        // push c to current position in rows-Array. Meaning c.date and c.values, resulting in {"date" : "yyyy-mm-ddThh:mm:ss.000Z" , "values" : 123 , "values0" : 456}
                        rows[i] = c;
                    };
                    //window.alert('new after c.date: ' + JSON.stringify(rows[0]));
                    datapool.rows = rows;



                    // NOTE Break-By
                    // if there is more than one attribute and only one metric in the dataset, transpose the attribute so different series can be generated and the metric can be displayed against the attribute values
                    if (datapool.attrs.length > 1 && datapool.cols.length < 2) {
                        datapool.transMetricNames = [];
                        //set rows data
                        var transposedRows = [];
                        var source = datapool.rows;
                        var dates = {};
                        var data = [];
                        //go thru all rows
                        for (i = 0; i < dp.getTotalRows(); i++) {
                            var row = source[i];
                            if (dates[row.date] == undefined) {
                                dates[row.date] = {
                                    date: row.date
                                };
                                data.push(dates[row.date]);
                            }

                            var breakByName = datapool.attrs[1];
                            var value = 'values0'; //datapool.cols[0];
                            dates[row.date][source[i][breakByName]] = row[value];
                            //dates[row.date][source[i].device] = row.value;
                            // push the new metric name to a new object, check if metric name for the transposed values already exists, if not push
                            if (datapool.transMetricNames.indexOf(row[datapool.attrs[1]]) == -1) {
                                datapool.transMetricNames.push(row[datapool.attrs[1]]);
                            };
                        }
                        datapool.transposedRows = data;
                        //var Say1 = 'DataPool: \n datapool.cols: ' + JSON.stringify(datapool.cols) + '\n datapool.attrs: ' + JSON.stringify(datapool.attrs) +'\n datapool.transMetricNames: ' + JSON.stringify(datapool.transMetricNames);
                        //var Say2 = "datapool.transposedRows:";
                        //var myWindow2 = PopUp(Say1, Say2, datapool.transposedRows);
                    }


                    //Difference in Dates for Range-Selector-Buttons
                    //https://www.amcharts.com/docs/v4/tutorials/plugin-range-selector/#Predefined_periods
                    var mindatevalue = Math.min.apply(Math, datapool.rows.map(function (o) {
                        return o.date;
                    }));
                    var maxdatevalue = Math.max.apply(Math, datapool.rows.map(function (o) {
                        return o.date;
                    }));
                    //alert('Mindatevalue = ' + mindatevalue);
                    //var mindate = new Date(mindatevalue * 1000);
                    var mindate = new Date(mindatevalue);
                    //alert('Mindate = ' + mindate.toUTCString());
                    var maxdate = new Date(maxdatevalue);
                    diff = (maxdate - mindate) / (1000 * 60 * 60 * 24); //diff in days (millisec -> days)


                    //------------------ POPUP for Debugging INPUT ------------------//
                    //if (datapool.transMetricNames){
                    if (datapool.hasOwnProperty('transMetricNames')) {
                        //alert('jippie transmetric');
                        var Say1 = 'DataPool: \n datapool.cols: ' + JSON.stringify(datapool.cols) + '\n datapool.attrs: ' + JSON.stringify(datapool.attrs) + '\n datapool.transMetricNames: ' + JSON.stringify(datapool.transMetricNames) + '\n AttrIsDate: ' + AttrIsDate;
                    } else {
                        var Say1 = 'DataPool: \n datapool.cols: ' + JSON.stringify(datapool.cols) + '\n datapool.attrs: ' + JSON.stringify(datapool.attrs) + '\n AttrIsDate: ' + AttrIsDate;
                    };
                    //var Say1 = 'DataPool: \n datapool.cols: ' + JSON.stringify(datapool.cols) + '\n datapool.attrs: ' + JSON.stringify(datapool.attrs); // + '\n datapool.transMetricNames: ' + JSON.stringify(datapool.transMetricNames);
                    var Say2 = "datapool.rows:" + JSON.stringify(datapool.rows[1].values0);
                    
                    //var myWindow2 = PopUp(Say1, Say2, datapool.rows);
                    var myWindow2 = (allProps["showDebugMsgs"] == 'true') ? PopUp(Say1, Say2, datapool.rows) : 0;
                    var myWindow3 = (allProps["showDebugTbl"] == 'true') ? PopUp(Say1, Say2, datapool.rows) : 0;
                    

                    return datapool;
                 };

                 //------------------ POPUP for Debugging INPUT ------------------//
                 // For Debugging in Firefox --> Delete Cookies and Website Data then F12 --> Network Analysis --> Cache deactivate --> CTRL+Shift+R
                 // var Say1 = 'metricColors: <br>' + JSON.stringify(metricColors)
                 //   + ' <br> metricColors[0]: <br>' + JSON.stringify(metricColors[0]);
                 // var Say2 = 'allProps["lineColor0"]: <br>' + JSON.stringify(allProps["lineColor0"])
                 // var myWindow2 = PopUp(Say1, Say2);

                 // NOTE POPUP() for Debugging ------------------//
                 function PopUp(Say1, Say2, displaydata) {
                     var myWindow = window.open("", "", "width=600,height=500");

                     myWindow.document.write("<h1>Debugger Output:</h1>");

                     var p1 = document.createElement("P")
                     p1.style.color = "black";
                     p1.innerText = Say1;
                     myWindow.document.body.appendChild(p1)
                     var p2 = document.createElement("P")
                     p2.style.color = "blue";
                     p2.innerText = Say2;
                     myWindow.document.body.appendChild(p2)

                     tableFromJson(displaydata);

                     //NOTE tableFromJson() --------------------------------//
                     function tableFromJson(Json2Table) {
                         // Extract value from table header. 
                         var col = [];
                         for (var i = 0; i < Json2Table.length; i++) {
                             for (var key in Json2Table[i]) {
                                 if (col.indexOf(key) === -1) {
                                     col.push(key);
                                 }
                             }
                         }

                         // Create a table.
                         var table = document.createElement("table");
                         table.style.border = "solid 1px #ddd";
                         table.style.padding = "2px 3px";
                         table.style.borderCollapse = "collapse";

                         // Create table header row using the extracted headers above.
                         var tr = table.insertRow(-1); // table row.

                         for (var i = 0; i < col.length; i++) {
                             var th = document.createElement("th"); // table header.
                             th.style.border = "solid 1px #fc1616";
                             th.style.padding = "2px 3px";
                             th.style.borderCollapse = "collapse";
                             th.innerHTML = col[i];
                             tr.appendChild(th);
                         }

                         // add json data to the table as rows.
                         for (var i = 0; i < Json2Table.length; i++) {

                             tr = table.insertRow(-1);

                             for (var j = 0; j < col.length; j++) {
                                 var tabCell = tr.insertCell(-1);
                                 tabCell.style.border = "solid 1px #12ba28";
                                 tabCell.innerHTML = Json2Table[i][col[j]];
                             }
                         }
                         // Now, add the newly created table with json data, to a container.
                         myWindow.document.body.appendChild(table);
                        }
                 }
            }
        },
    );
}());