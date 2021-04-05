//** ---------------------------------------
//* Timeline Chart was created using amCharts 4.
//* Author: Bjoern Mueller, bjoernmueller@posteo.de 
//* Date: 18-11-2020
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
            errorDetails: "This visualization requires one or more attributes and one metric. :-) Expected Date-Format: [dd.mm.yy](-:",
            // Define the external libraries to be used - in this sample. the amcharts library
            externalLibraries: [{url: "//cdn.amcharts.com/lib/4/core.js"}, {url: "//cdn.amcharts.com/lib/4/charts.js"}, {url: "//cdn.amcharts.com/lib/4/themes/animated.js"}, {url: "//cdn.amcharts.com/lib/4/plugins/rangeSelector.js"}],
            // Define whether a tooltip should be displayed with additional information
            useRichTooltip: true,
            // Define whether the DOM should be reused on data/layout change or reconstructed from scratch
            reuseDOMNode: false,



            plot: function () {
                var me = this;
                var domNode = this.domNode,
                     dp = this.dataInterface;
                var AttrIsDate = "false";
                var AttrCount = 0;
                // ! Visualisation as Selector
                this.addUseAsFilterMenuItem();

                this.setDefaultPropertyValues({
                    showLegend: 'true',
                    positionLegend: 'top',
                    displayXYCursor: 'true',
                    enableRangeSelector: 'false',
                    enableDataGrouping: 'true',
                    displayWeekendFill: 'false',
                    amountStrokeXColor: {fillColor: "#A3A3A3", fillAlpha: "100"},
                    amountStrokeYColor: {fillColor: "#A3A3A3", fillAlpha: "100"},
                    weekendFillColor: {fillColor: "#000000", fillAlpha: "20"},
                    minGridDist: 30,
                });

                am4core.useTheme(am4themes_animated);

                // Create chart instance
                var chart2 = am4core.create(this.domNode, am4charts.XYChart);
                if (me.getProperty("enableWheelScroll")) {
                    chart2.mouseWheelBehavior = "panX";
                };
                
                // Export
                //chart.exporting.menu = new am4core.ExportMenu();

                // Add data
                var datapool = prepareData();


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
                        chart2.colors.list[i] = am4core.color(me.getProperty("lineColor"+i).fillColor);
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
                    //window.alert('category-based AttrIsDate = ' + AttrIsDate)
                    var categoryAxis = chart2.xAxes.push(new am4charts.CategoryAxis());
                    var label = categoryAxis.renderer.labels.template;
                    label.truncate = true;
                    label.maxWidth = 150;
                // date-based X-Axis:
                } else {
                    //window.alert('date-based AttrIsDate = ' + AttrIsDate)
                    var dateAxis = chart2.xAxes.push(new am4charts.DateAxis());
                    dateAxis.renderer.grid.template.location = 0;
                    dateAxis.renderer.minGridDistance = me.getProperty("minGridDist");

                    // Format dateAxis
                    dateAxis.renderer.grid.template.stroke = am4core.color(me.getProperty("amountStrokeXColor").fillColor);
                    dateAxis.renderer.grid.template.strokeOpacity = me.getProperty("amountStrokeXColor").fillAlpha * 0.01;
                    // Set date label formatting (https://www.amcharts.com/docs/v4/concepts/axes/date-axis/#Setting_date_formats)
                    dateAxis.dateFormats.setKey("day", "dd.MM.");
                    dateAxis.dateFormats.setKey("week", "'KW'ww");
                    dateAxis.periodChangeDateFormats.setKey("day", "[bold]dd.MMM[/]");
                    dateAxis.periodChangeDateFormats.setKey("week", "[bold]'KW'ww[/]");
                    dateAxis.periodChangeDateFormats.setKey("month", "[bold]yyyy[/]");
                    
                    //Data Grouping
                    dateAxis.groupData = me.getProperty("enableDataGrouping");
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
                    if (me.getProperty("displayWeekendFill") === 'true') {
                        dateAxis.renderer.axisFills.template.disabled = false;
                        dateAxis.renderer.axisFills.template.fill = am4core.color(me.getProperty("weekendFillColor").fillColor);
                        dateAxis.renderer.axisFills.template.fillOpacity = me.getProperty("weekendFillColor").fillAlpha * 0.01;

                        dateAxis.fillRule = function (dataItem) {
                            var date = new Date(dataItem.value);
                            if ((date.getDay() == 0 || date.getDay() == 6) && dateAxis.gridInterval.timeUnit == "day" && dateAxis.gridInterval.count == 1) {
                                dataItem.axisFill.visible = true;
                                /** Prep in case Highlight Thursdays and Fridays too but with half opacity
                                } else if ((date.getDay() == 4 || date.getDay() == 5) && dateAxis.gridInterval.timeUnit == "day" && dateAxis.gridInterval.count == 1) {
                                    dataItem.axisFill.visible = true;
                                    dataItem.axisFill.fillOpacity = me.getProperty("weekendFillColor").fillAlpha * 0.005;
                                    */
                            } else {
                                dataItem.axisFill.visible = false;
                            }
                        }
                    }

                    // Set up drill-down
                    if (me.getProperty("enableClickToDrill") === 'true') {
                        dateAxis.renderer.labels.template.events.on("hit", function (ev) {
                            var start = ev.target.dataItem.date;
                            var end = new Date(start);
                            end.setMonth(end.getMonth() + 1);
                            dateAxis.zoomToDates(start, end);
                        })
                    } else {
                        dateAxis.renderer.labels.template.events.disableType("hit");
                    };

                    // activate Range selector
                    if (me.getProperty("enableRangeSelector") === 'true') {
                        var container = document.createElement('div');
                        var rangeselect = document.createElement('div');
                        rangeselect.style.background = "#c0c0c0";
                        rangeselect.style.color = "#000";
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
                        selector.periods.unshift({
                            name: "5W",
                            interval: {
                                timeUnit: "week",
                                count: 5
                            }
                        });
                    };
                }

                // translate oppositeAxis-switches to Array, array is then in createSeries check to evaluate whether opposite axis is needed.
                var oppositeA = []
                datapool.cols.forEach((col, i) => {
                           if (me.getProperty("oppositeAxis" + i)) {
                               oppositeA[i] = me.getProperty("oppositeAxis" + i);
                           }
                });

                // Default or "global" value axis
                var valueAxis = chart2.yAxes.push(new am4charts.ValueAxis());
                // Format valueAxis
                valueAxis.renderer.grid.template.stroke = am4core.color(me.getProperty("amountStrokeYColor").fillColor);
                valueAxis.renderer.grid.template.strokeOpacity = me.getProperty("amountStrokeYColor").fillAlpha * 0.01;




                //NOTE Create Series --------------------------------//
                function createSeries(field, name, hiddenInLegend) {
                    var series, bullet;

                    if (AttrIsDate == 'false') {
                        // None-Date-Block (to be executed if attribute is no date and therefore series must be created for values of attribute(Country: Italy,Germany,Spain))
                        categoryAxis.dataFields.category = "date";
                        categoryAxis.renderer.grid.template.location = 0;
                        categoryAxis.renderer.minGridDistance = 35;
                        

                        // Auto-rotating labels
                        categoryAxis.events.on("sizechanged", function (ev) {
                            var axis = ev.target;
                            var cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex);
                            if (cellWidth < axis.renderer.labels.template.maxWidth) {
                                axis.renderer.labels.template.rotation = -45;
                                axis.renderer.labels.template.horizontalCenter = "right";
                                axis.renderer.labels.template.verticalCenter = "middle";
                            } else {
                                axis.renderer.labels.template.rotation = 0;
                                axis.renderer.labels.template.horizontalCenter = "middle";
                                axis.renderer.labels.template.verticalCenter = "top";
                            }
                        });

                        // Selectively offsetting axis labels
                        categoryAxis.renderer.labels.template.adapter.add("dy", function (dy, target) {
                            if (target.dataItem && target.dataItem.index & 2 == 2) {
                                return dy + 25;
                            }
                            return dy;
                        });

                        series = chart2.series.push(new am4charts.ColumnSeries());
                        series.name = name;
                        series.dataFields.valueY = field;
                        series.dataFields.categoryX = "date";
                        series.tooltipText = "{name}\n{dateX}: {valueY}";
                        series.stacked = true;

                        bullet = series.bullets.push(new am4charts.LabelBullet());
                        bullet.dy = 15;
                        bullet.label.hideOversized = true;
                        bullet.label.text = '{valueY}';
                        bullet.label.fill = am4core.color('#ffffff');
                    } else {
                        // Date-Block
                        series = chart2.series.push(new am4charts.LineSeries());
                        series.name = name;
                        series.dataFields.valueY = field;
                        series.dataFields.dateX = "date";
                        series.groupFields.valueY = "sum";
                        series.tooltipText = "{dateX.formatDate('dd.MM.yyyy')}: {name}: [b]{valueY}[/]";

                        bullet = series.bullets.push(new am4charts.CircleBullet());
                        bullet.circle.stroke = am4core.color("#fff");
                        bullet.circle.strokeWidth = 2;
                    }

                    series.strokeWidth = 2;
                    if (me.getProperty("displayFill") === 'true') {
                        series.fillOpacity = me.getProperty("amountFillOpacity")/10;
                    }
                    if (hiddenInLegend) {
                        series.hiddenInLegend = true;
                    }

                    // extract the index from field = "value+i"
                    var j = Number(field.substring(field.length - 1, field.length))
                    // check whether oppositeA has a true at that index, if so create opposite Axis
                    if (oppositeA[j] == 'true') {
                        // Create new ValueAxis
                        var valueAxis2 = chart2.yAxes.push(new am4charts.ValueAxis());
                        valueAxis2.syncWithAxis = valueAxis;
                        // Name Value Axis and set it to opposite
                        valueAxis2.title.text = series.name;
                        valueAxis2.renderer.opposite = true;
                        // assign axis to current series
                        series.yAxis = valueAxis2;
                    }
                    return series;
                }

                let allSeries = [];

                //window.alert("Number of attri and metrics: " + datapool.attrs.length + " and " + datapool.cols.length);

                //NOTE Call Series --------------------------------//
                // no Break-By
                if        (datapool.attrs.length == 1) {
                    //window.alert('ah kein breakBy')
                    datapool.cols.forEach((col, i) => {
                        var s = createSeries("values" + i, col);
                        allSeries.push(s);
                    })
                // Break-By
                } else if (datapool.attrs.length > 1 && datapool.cols.length == 1) {
                    //window.alert('Guck mal ein breakBy')
                    datapool.transMetricNames.forEach((col, i) => {
                        var s = createSeries(col, col);
                        allSeries.push(s);
                    })
                } else if (datapool.attrs.length > 1 && datapool.cols.length > 1) {
                    window.alert(datapool.attrs.length + ' Attributes and ' + datapool.cols.length + ' Metrics is too much for this Visualization to handle.')
                };



                // And, for a good measure, let's add a legend and a cursor
                if (me.getProperty("showLegend") === 'true') {
                    chart2.legend = new am4charts.Legend();
                    chart2.legend.position = me.getProperty("positionLegend");
                }
                if (me.getProperty("displayXYCursor") === 'true') {
                    chart2.cursor = new am4charts.XYCursor();
                }

                // Create a horizontal scrollbar with preview and place it underneath the date axis
                if (me.getProperty("displayXYChartScrollbar") === 'true') {
                    allSeries[0].show(); // hardcoded reference for series1
                    chart2.scrollbarX = new am4charts.XYChartScrollbar();
                    chart2.scrollbarX.minHeight = 40;
                    chart2.scrollbarX.background.fill = am4core.color("#000000");
                    chart2.scrollbarX.background.fillOpacity = 0.2;
                    chart2.scrollbarX.series.push(allSeries[0]);
                    chart2.scrollbarX.parent = chart2.bottomAxesContainer;
                    chart2.scrollbarX.scrollbarChart.plotContainer.filters.clear(); // remove desaturation
                    //chart2.scrollbarX.scrollbarChart.plotContainer.filters.DesaturateFilter.saturation = 0.5;
                }

















// ! ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                // ! Visualisation as Selector
/**
                var label = chart2.createChild(am4core.Label);
                label.text = "Hello world!";
                label.fontSize = 16;
                label.align = "center";
                var dataraw = this.dataInterface.getRawData(mstrmojo.models.template.DataInterface.ENUM_RAW_DATA_FORMAT.TREE, {
                    hasSelection: true
                }).children;

                dateAxis.events.on("startendchanged", dateAxisChanged); //invokes too many times till final zoom state
                //dateAxis.events.on("endendchanged", dateAxisChanged); //invokes too many times till final zoom state
                //chart2.cursor.events.on('zoomended', dateAxisChanged); //works only for zoom not for panning
                //chart2.cursor.events.on("selectended", dateAxisChanged); //works only for zoom not for panning

                function dateAxisChanged(ev) {
                    var start = new Date(ev.target.minZoomed);
                    var end = new Date(ev.target.maxZoomed);
                    var findMe = new Date(2018,01,25);
                    //console.log("New final range: " + start + " -- " + end);
                    //window.alert("New final range: " + start + " -- " + end);

                    //Object used for the "use as a filter" functionality
                    var selectorData = [];
                    //selectorData.push(start);
                    //selectorData.push(end);
                    let attrlength = dp.getRowHeaders(0).getHeader(0).getName().length;

                    for (i = 0; i < attrlength; i++) {
                        let dpdate = datapool.rows[i].date;
                        if (+start < +dpdate && +dpdate < +end) {
                           //        ^ serialisation steps (+); serialized dates or datetime can be easier compared than date objects. Much much easier.
                           //selectorData.push(dpdate)
                           //selectorData.push(datapool.rows[i].attributeSelector)
                           selectorData.push(dataraw[i].attributeSelector)
                           // Debugging:

//                           window.alert('start: ' + start.toISOString() +
//                               ' \n dpdate: ' + dpdate.toISOString() +
//                               ' \n end:  ' + end.toISOString());

                           
                        } else if (+end < +dpdate) {
                            break;
                        }
                    }


                    label.text = "Start to End: " + start.toISOString() + " -- " + end.toISOString();
                    me.applySelection(selectorData);
                    // apply array to filter visualisation
                    //me.applySelection(dataraw[1].attributeSelector);
                    //CustomVisBase.prototype.applySelection(selectorData);



                var Say1 =
                    'start.toISOString: ' + start.toISOString() + '<br>' +
                    'findMe.toISOString: ' + findMe.toISOString() + '<br>';
                var Say2 =
                    '<br> attrlength: <br>' +
                    JSON.stringify(attrlength) +
                    '<br> selectordata: <br>' +
                    JSON.stringify(selectorData);
                //selectorData.join("<br>")
                //JSON.stringify(dataraw[2].attributeSelector)
                if (myWindow2) {
                        myWindow2.close(); // Closes the new window // make sure only the last window remains open.
                        window.alert('hooray.')
                };
                
                var myWindow2 = PopUp(Say1, Say2);




                } // end of function dateAxisChanged
*/
// ! ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////





























                // NOTE Prepare Data
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
                    // count only digits (\d)
                    try {
                        digitscount = String(dp.getRowHeaders(0).getHeader(0).getName()).match(/\d/g).length;
                        //window.alert("Number of digits found: " + digitscount);
                    } catch (err) {
                        digitscount = 0;
                        //window.alert('Number of digits found: ' + digitscount + ' Error: ' + err.message);
                    };

                    switch (attrlength - digitscount) {
                        //Date: if attribute has length - digitcount = 2 then we assume a date
                        case 2:
                            AttrIsDate = "date";
                            AttrCount = 1;
                            break;
                        //Datetime: if attribute has length(19) - digitcount(14) = 5 then we assume a datetime
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
                    //go thru all rows
                    for (i = 0; i < dp.getTotalRows(); i++) {
                        var c = {}
                        // Attribute.Values: get date from data. date needs to be in the form of dd.mm.yy
                        c.date = dp.getRowHeaders(i).getHeader(0).getName();

                        switch (AttrIsDate) {
                            case "date":
                                var parts = c.date.split('.');
                                // convert to Datetime-Format yyyy-mm-ddThh:mm:ss.000Z
                                c.date = new Date('20' + parts[2], parts[1] - 1, parts[0]);
                                break;
                            case "datetime":
                                var parts = c.date.split(' ');
                                var dparts = parts[0].split('.');
                                var tparts = parts[1].split(':');
                                c.date = new Date('20' + dparts[2], dparts[1] - 1, dparts[0], tparts[0], tparts[1], tparts[2]);
                                break;
                            default:
                                //window.alert('default: Doesn´t look like a date to me. Maybe try again. Good Luck.');
                                break;
                        }

                        c.attributes = [];
                        // Attribute.Values: get the attribute values. Z=AttrCount so the first iteration is skipped IF the first attribute is a date and therefore it should be in c.date
                        for (var z = AttrCount; z < dp.getRowTitles().size(); z++) {
                            c[dp.getRowTitles(0).getTitle(z).getName()] = dp.getRowHeaders(i).getHeader(z).getName()
                            //c['attri' + dp.getRowTitles(0).getTitle(z).getName()] = dp.getRowHeaders(i).getHeader(z).getName()
                        }


                        c.values = [];
                        // Metric.Values: get the metric values.
                        for (var z = 0; z < dp.getColumnHeaderCount(); z++) {
                            c['values' + z] = dp.getMetricValue(i, z).getRawValue()
                        }
                        // push c to current position in rows-Array. Meaning c.date and c.values, resulting in {"date" : "yyyy-mm-ddThh:mm:ss.000Z" , "values" : 123 , "values0" : 456}
                        rows[i] = c;
                    }
                    datapool.rows = rows;

 //window.alert("Number of attri and metrics: " + datapool.attrs.length + " and " + datapool.cols.length);

                    // TODO
                    
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
                            //window.alert('1' + JSON.stringify(row.date));
                            //window.alert('2' + JSON.stringify(data));
                            //window.alert('3 i: ' + i + ' - ' + JSON.stringify(row[datapool.attrs[1]]));



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

                




                    
                    



































                    //------------------ POPUP for Debugging INPUT ------------------//
                    //var Say1 = 'DataPool: \n datapool.cols: ' + JSON.stringify(datapool.cols) + '\n datapool.attrs: ' + JSON.stringify(datapool.attrs);
                    //var Say2 = "datapool.rows:";
                    //var myWindow2 = PopUp(Say1, Say2, datapool.rows);

                    return datapool;
                 };

                 //------------------ POPUP for Debugging INPUT ------------------//
                 // var Say1 = 'metricColors: <br>' + JSON.stringify(metricColors)
                 //   + ' <br> metricColors[0]: <br>' + JSON.stringify(metricColors[0]);
                 // var Say2 = 'me.getProperty("lineColor0"): <br>' + JSON.stringify(me.getProperty("lineColor0"))
                 // var myWindow2 = PopUp(Say1, Say2);

                 // NOTE POPUP for Debugging ------------------//
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