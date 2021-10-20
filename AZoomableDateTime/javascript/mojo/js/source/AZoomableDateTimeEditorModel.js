(function () {
    // Define this code as a plugin in the mstrmojo object
    if (!mstrmojo.plugins.AZoomableDateTime) {
        mstrmojo.plugins.AZoomableDateTime = {};
    }
    // Import the necessary library
    mstrmojo.requiresCls(
        "mstrmojo.vi.models.editors.CustomVisEditorModel"
    );
    //variable that represent the enum of all the widget type
    var $WT = mstrmojo.vi.models.editors.CustomVisEditorModel.WIDGET_TYPE;
    /**

     */
    mstrmojo.plugins.AZoomableDateTime.AZoomableDateTimeEditorModel = mstrmojo.declare(
        mstrmojo.vi.models.editors.CustomVisEditorModel,
        null,
        {
            // Define the JavaScript class that renders your visualization properties
            scriptClass: 'mstrmojo.plugins.AZoomableDateTime.AZoomableDateTimeEditorModel',
            getCustomProperty: function getCustomProperty() {
                var myViz = this.getHost();

                var numOfMetrics = myViz.zonesModel.getDropZones().zones[2].items.length;
                if (myViz.zonesModel.getDropZones().zones[1].items.length == 1 && myViz.zonesModel.getDropZones().zones[2].items.length == 1) {
                    var numOfBreakBys = myViz.zonesModel.getDropZones().zones[1].items.length;
                };
                var allowHtmlFlag;
                var totalsFlag, lineFlag;
                // Fill the property data here

                return [
                    // NOTE Tab amCharts Timeline Options
                    {
                        name: 'amCharts Timeline Options',
                        value: [
                            {
                                style: $WT.EDITORGROUP,
                                items: [{
                                        style: $WT.LABEL,
                                        labelText: "amCharts Timeline Options"
                                    },
                                    // Legend
                                    {
                                        style: $WT.CHECKBOXANDLABEL,
                                        propertyName: "showLegend",
                                        labelText: "Show Legend"
                                    }, {
                                        style: $WT.TWOCOLUMN,
                                        disabled: this.getHost().getProperty('showLegend') === "false",
                                        items: [{
                                                style: $WT.LABEL,
                                                width: "30%",
                                                labelText: "Position"
                                            },
                                            {
                                                style: $WT.PULLDOWN,
                                                width: "70%",
                                                disabled: this.getHost().getProperty('showLegend') === "false",
                                                propertyName: "positionLegend",
                                                items: [{
                                                        name: "left",
                                                        value: "left"
                                                    },
                                                    {   name: "right",
                                                        value: "right"
                                                    },
                                                    {   name: "top",
                                                        value: "top"
                                                    },
                                                    {   name: "bottom",
                                                        value: "bottom"
                                                    }
                                                ]
                                            }
                                        ]
                                    }, {
                                        style: $WT.TWOCOLUMN,
                                        items: [{
                                                style: $WT.CHECKBOXANDLABEL,
                                                disabled: this.getHost().getProperty('showLegend') === "false",
                                                propertyName: "padLegend",
                                                labelText: "Legend Padding",
                                                width: "70%"
                                            },
                                            {
                                                style: $WT.STEPPER,
                                                disabled: this.getHost().getProperty('showLegend') === "false" || this.getHost().getProperty('padLegend') === "false",
                                                propertyName: "padLegendAmount",
                                                min: 0,
                                                max: 10,
                                                width: "30%"
                                            }
                                        ]
                                    }, {
                                        style: $WT.TWOCOLUMN,
                                        items: [{
                                                style: $WT.CHECKBOXANDLABEL,
                                                disabled: this.getHost().getProperty('showLegend') === "false",
                                                propertyName: "maxHeightLegend",
                                                labelText: "Legend max Height",
                                                width: "70%"
                                            },
                                            {
                                                style: $WT.STEPPER,
                                                disabled: this.getHost().getProperty('showLegend') === "false" || this.getHost().getProperty('maxHeightLegend') === "false",
                                                propertyName: "maxHeightLegendAmount",
                                                min: 0,
                                                max: 1000,
                                                width: "30%"
                                            }
                                        ]
                                    }, {
                                        style: $WT.TWOCOLUMN,
                                        items: [{
                                                style: $WT.CHECKBOXANDLABEL,
                                                disabled: this.getHost().getProperty('showLegend') === "false",
                                                propertyName: "maxWidthLegend",
                                                labelText: "Legend max Width",
                                                width: "70%"
                                            },
                                            {
                                                style: $WT.STEPPER,
                                                disabled: this.getHost().getProperty('showLegend') === "false" || this.getHost().getProperty('maxWidthLegend') === "false",
                                                propertyName: "maxWidthLegendAmount",
                                                min: 0,
                                                max: 1000,
                                                width: "30%"
                                            }
                                        ]
                                    }, {
                                        style: $WT.TWOCOLUMN,
                                        items: [{
                                                style: $WT.CHECKBOXANDLABEL,
                                                disabled: this.getHost().getProperty('showLegend') === "false",
                                                propertyName: "sizeMarkerLegend",
                                                labelText: "Marker Size",
                                                width: "70%"
                                            },
                                            {
                                                style: $WT.STEPPER,
                                                disabled: this.getHost().getProperty('showLegend') === "false" || this.getHost().getProperty('sizeMarkerLegend') === "false",
                                                propertyName: "sizeMarkerLegendAmount",
                                                min: 0,
                                                max: 1000,
                                                width: "30%"
                                            }
                                        ]
                                     }, {
                                         style: $WT.CHECKBOXANDLABEL,
                                         disabled: this.getHost().getProperty('showLegend') === "false",
                                         propertyName: "valuesLegend",
                                         labelText: "Values in Legend",
                                         width: "70%"
                                     }
                                ]
                            },
                            // Options Group
                            {
                                style: $WT.EDITORGROUP,
                                items: [
                                    {
                                        style: $WT.LABEL,
                                        labelText: "Options"
                                    }, {
                                        style: $WT.CHECKBOXANDLABEL,
                                        propertyName: "displayXYCursor",
                                        labelText: "Show XY-Cursor (enables Zoom)"
                                    }, {
                                        style: $WT.CHECKBOXANDLABEL,
                                        disabled: this.getHost().getProperty('displayXYCursor') === "false",
                                        propertyName: "hideXYCursorLines",
                                        labelText: "Hide Cursor Lines"
                                    }, {
                                        style: $WT.CHECKBOXANDLABEL,
                                        disabled: this.getHost().getProperty('displayXYCursor') === "false",
                                        propertyName: "displayXYCursorTips",
                                        labelText: "Show Axis Tooltip"
                                    }, {
                                        style: $WT.CHECKBOXANDLABEL,
                                        disabled: this.getHost().getProperty('displayXYCursor') === "false",
                                        propertyName: "fullWidthCursor",
                                        labelText: "Full Width Cursor"
                                    }, {
                                        style: $WT.CHECKBOXANDLABEL,
                                        propertyName: "displayXYChartScrollbar",
                                        labelText: "Show XYChartScrollbar"
                                    }, {
                                        style: $WT.CHECKBOXANDLABEL,
                                        propertyName: "enableRangeSelector",
                                        labelText: "Show Selector"
                                    }, {
                                        style: $WT.CHECKBOXANDLABEL,
                                        propertyName: "hideYAxisLabels",
                                        labelText: "Hide Y-Axis-Labels"
                                    }, {
                                        style: $WT.CHECKBOXANDLABEL,
                                        propertyName: "enableClickToDrill",
                                        labelText: "Drill on Click (X-Axis)"
                                    }, {
                                        style: $WT.CHECKBOXANDLABEL,
                                        disabled: this.getHost().getProperty('displayXYCursor') === "false",
                                        propertyName: "singleTooltip",
                                        labelText: "single Tooltip"
                                    }, {
                                        style: $WT.CHECKBOXANDLABEL,
                                        disabled: this.getHost().getProperty('singleTooltip') === "false" || this.getHost().getProperty('displayXYCursor') === "false",
                                        propertyName: "combineTooltip",
                                        labelText: "combine Tooltip"
                                    }, {
                                        style: $WT.CHECKBOXANDLABEL,
                                        propertyName: "vizAsSelect",
                                        labelText: "Visualization as Selector"
                                    }, {
                                        style: $WT.CHECKBOXANDLABEL,
                                        propertyName: "startAtZero",
                                        labelText: "Baseline (Y=0)"
                                    }, {
                                        style: $WT.CHECKBOXANDLABEL,
                                        propertyName: "enableStacked",
                                        labelText: "stacked Series"
                                    }, {
                                        style: $WT.CHECKBOXANDLABEL,
                                        propertyName: "enableDataGrouping",
                                        labelText: "Enable Data Grouping"
                                    }, {
                                        style: $WT.TWOCOLUMN,
                                        items: [{
                                            style: $WT.LABEL,
                                            width: "40%",
                                            labelText: "Aggregation (X-Axis)"
                                            }, {
                                                style: $WT.PULLDOWN,
                                                width: "60%",
                                                propertyName: "aggregateValues",
                                                items: [{
                                                        name: "average",
                                                        value: "average"
                                                    }, {
                                                        name: "sum",
                                                        value: "sum"
                                                    }, {
                                                        name: "open",
                                                        value: "open"
                                                    }, {
                                                        name: "close",
                                                        value: "close"
                                                    }, {
                                                        name: "min",
                                                        value: "min"
                                                    }, {
                                                        name: "max",
                                                        value: "max"
                                                    }]
                                            }]
                                    }, {
                                        style: $WT.TWOCOLUMN,
                                        items: [{
                                            style: $WT.LABEL,
                                            disabled: this.getHost().getProperty('displayXYCursor') === "false",
                                            width: "40%",
                                            labelText: "Wheel Scroll"
                                        }, {
                                            style: $WT.PULLDOWN,
                                            disabled: this.getHost().getProperty('displayXYCursor') === "false",
                                            width: "60%",
                                            propertyName: "behaviorWheelScroll",
                                            items: [{
                                                name: "none",
                                                value: "none"
                                            }, {
                                                name: "zoom",
                                                value: "zoomX"
                                            }, {
                                                name: "pan",
                                                value: "panX"
                                            }]
                                        }]
                                    }
                                ]},
                                    //Show Item Labels
                                    {
                                        style: $WT.EDITORGROUP,
                                        items: [{
                                            style: $WT.CHECKBOXANDLABEL,
                                            disabled: this.getHost().getProperty('valuesLegend') === "true",
                                            propertyName: "showItemLabels",
                                            labelText: "Show Item Labels"
                                            }, {
                                                style: $WT.TWOCOLUMN,
                                                disabled: this.getHost().getProperty('showItemLabels') === "false",
                                                items: [{
                                                        style: $WT.LABEL,
                                                        width: "50%",
                                                        labelText: "horizontal"
                                                    },
                                                    {
                                                        style: $WT.PULLDOWN,
                                                        width: "50%",
                                                        disabled: this.getHost().getProperty('showItemLabels') === "false",
                                                        propertyName: "positionLabel",
                                                        items: [{
                                                            name: "left",
                                                            value: "left"
                                                        }, {
                                                            name: "right",
                                                            value: "right"
                                                        }, {
                                                            name: "center",
                                                            value: "center"
                                                        }, {
                                                            name: "none",
                                                            value: "none"
                                                        }]
                                                    }
                                                ]
                                            }, {
                                                style: $WT.TWOCOLUMN,
                                                disabled: this.getHost().getProperty('showItemLabels') === "false",
                                                items: [{
                                                        style: $WT.LABEL,
                                                        width: "50%",
                                                        labelText: "vertical"
                                                    },
                                                    {
                                                        style: $WT.PULLDOWN,
                                                        width: "50%",
                                                        disabled: this.getHost().getProperty('showItemLabels') === "false",
                                                        propertyName: "positionVLabel",
                                                        items: [{
                                                            name: "top",
                                                            value: "top"
                                                        }, {
                                                            name: "middle",
                                                            value: "middle"
                                                        }, {
                                                            name: "bottom",
                                                            value: "bottom"
                                                        }, {
                                                            name: "none",
                                                            value: "none"
                                                        }]
                                                    }
                                                ]
                                            }
                                ]
                            },
                            
                            //Weekendhighlights
                            {
                                style: $WT.EDITORGROUP,
                                items: [{
                                        style: $WT.CHECKBOXANDLABEL,
                                            propertyName: "displayWeekendFill",
                                            labelText: "Show Weekend",
                                    },
                                    {
                                        style: $WT.TWOCOLUMN,
                                        items: [{
                                                style: $WT.LABEL,
                                                width: "30%",
                                                labelText: "Fill"
                                            },
                                            {
                                                style: $WT.FILLGROUP,
                                                width: "70%",
                                                propertyName: "weekendFillColor",
                                            }
                                        ]
                                    },
                                ]
                            },
                            // minGridDistance
                            {
                                style: $WT.EDITORGROUP,
                                items: [{
                                        style: $WT.LABEL,
                                        labelText: "minGridDistance (DEV)"
                                    },
                                    {
                                        style: $WT.STEPPER,
                                        propertyName: "minGridDist",
                                        min: 0,
                                        max: 100,
                                        width: "100%"
                                    }]
                            },
                        ]
                    },
                    // NOTE Tab amCharts Timeline Format
                    {
                        name: 'amCharts Timeline Format',
                        value: [
                             // Customizing Fills, displayFill
                            {
                                style: $WT.EDITORGROUP,
                                items: [{
                                            style: $WT.LABEL,
                                            labelText: "Customizing fills"
                                        },
                                        {
                                            style: $WT.TWOCOLUMN,
                                            disabled: this.getHost().getProperty('displayGridlines') === "false",
                                            items: [{
                                                    style: $WT.CHECKBOXANDLABEL,
                                                    propertyName: "displayFill",
                                                    labelText: "Show Fill",
                                                    width: "70%"
                                                },
                                                {
                                                    style: $WT.STEPPER,
                                                    disabled: this.getHost().getProperty('displayFill') === "false",
                                                    propertyName: "amountFillOpacity",
                                                    min: 0,
                                                    max: 10,
                                                    width: "30%"
                                                }
                                            ]
                                }]
                            },
                            //Fonts and Colors
                            {
                                style: $WT.EDITORGROUP,
                                items: [
                                    {
                                        style: $WT.LABEL,
                                        labelText: "Fonts and Colors"
                                    },
                                    //Grid Lines
                                    {
                                        style: $WT.TWOCOLUMN,
                                        items: [{
                                                style: $WT.LABEL,
                                                width: "30%",
                                                labelText: "Gridline-X"
                                            },
                                            {
                                                style: $WT.FILLGROUP,
                                                width: "70%",
                                                propertyName: "amountStrokeXColor",
                                            }
                                        ]
                                    },
                                    {
                                        style: $WT.TWOCOLUMN,
                                        items: [{
                                                style: $WT.LABEL,
                                                width: "30%",
                                                labelText: "Gridline-Y"
                                            },
                                            {
                                                style: $WT.FILLGROUP,
                                                width: "70%",
                                                propertyName: "amountStrokeYColor",
                                            }
                                        ]
                                    },
                                    //Axis Lines
                                    {
                                        style: $WT.TWOCOLUMN,
                                        items: [{
                                                style: $WT.LABEL,
                                                width: "30%",
                                                labelText: "Axisline-X"
                                            },
                                            {
                                                style: $WT.FILLGROUP,
                                                width: "70%",
                                                propertyName: "axisXColor",
                                            }
                                        ]
                                    }, {
                                        style: $WT.TWOCOLUMN,
                                        items: [{
                                                style: $WT.LABEL,
                                                width: "30%",
                                                labelText: "Axisline-Y"
                                            },
                                            {
                                                style: $WT.FILLGROUP,
                                                width: "70%",
                                                propertyName: "axisYColor",
                                            }
                                        ]
                                    },
                                    //Axis Font
                                    {
                                        style: $WT.TWOCOLUMN,
                                        items: [{
                                                style: $WT.LABEL,
                                                width: "30%",
                                                labelText: "Axis font"
                                            },
                                            {
                                                style: $WT.FILLGROUP,
                                                width: "70%",
                                                propertyName: "fontColor",
                                            }
                                        ]
                                    },
                                    //Label Font
                                    {
                                        style: $WT.TWOCOLUMN,
                                        items: [{
                                                style: $WT.LABEL,
                                                width: "30%",
                                                labelText: "Label font"
                                            },
                                            {
                                                style: $WT.FILLGROUP,
                                                width: "70%",
                                                propertyName: "labelColor",
                                            }
                                        ]
                                    },
                                    //Selector Font and Background
                                    {
                                        style: $WT.TWOCOLUMN,
                                        items: [{
                                                style: $WT.LABEL,
                                                width: "30%",
                                                labelText: "Selector font"
                                            },
                                            {
                                                style: $WT.FILLGROUP,
                                                width: "70%",
                                                propertyName: "selectorColor",
                                            }
                                        ]
                                    }, {
                                        style: $WT.TWOCOLUMN,
                                        items: [{
                                                style: $WT.LABEL,
                                                width: "30%",
                                                labelText: "Selector Background"
                                            },
                                            {
                                                style: $WT.FILLGROUP,
                                                width: "70%",
                                                propertyName: "selectorBackground",
                                            }
                                        ]
                                    },
                                    // Scrollbar Font and Background
                                    {
                                        style: $WT.TWOCOLUMN,
                                        disabled: this.getHost().getProperty('displayXYChartScrollbar') === "false",
                                        items: [{
                                                style: $WT.LABEL,
                                                width: "30%",
                                                labelText: "Scrollbar Bkgrd"
                                            },
                                            {
                                                style: $WT.FILLGROUP,
                                                width: "70%",
                                                propertyName: "scrollbarBackgroundColor",
                                            }
                                        ]
                                    }, {
                                        style: $WT.TWOCOLUMN,
                                        disabled: this.getHost().getProperty('displayXYChartScrollbar') === "false",
                                        items: [{
                                                style: $WT.LABEL,
                                                width: "30%",
                                                labelText: "Scrollbar thumb"
                                            },
                                            {
                                                style: $WT.FILLGROUP,
                                                width: "70%",
                                                propertyName: "scrollbarThumbColor",
                                            }
                                        ]
                                    }, {
                                        style: $WT.TWOCOLUMN,
                                        disabled: this.getHost().getProperty('displayXYChartScrollbar') === "false",
                                        items: [{
                                                style: $WT.LABEL,
                                                width: "30%",
                                                labelText: "Scrollbar unselected"
                                            },
                                            {
                                                style: $WT.FILLGROUP,
                                                width: "70%",
                                                propertyName: "scrollbarUnselectedColor",
                                            }
                                        ]
                                    }, 

                                    /**
                                     * 
                                     * 
                                     * 
                                     * 
                                     * 
                                     */


                                ]
                            },
                            /*
                            //axis lables
                            {
                                style: $WT.EDITORGROUP,
                                items: []
                            },
                            //Selector Format
                            {
                                style: $WT.EDITORGROUP,
                                items: [
                                ]
                            },

                            //Scrollbar Format
                            {
                                style: $WT.EDITORGROUP,
                                items: [
                                ]
                            },
                            */
                            // Options Group
                            {
                                style: $WT.EDITORGROUP,
                                items: [{
                                        style: $WT.LABEL,
                                        labelText: "Options"
                                    },
                                    {
                                        style: $WT.CHECKBOXANDLABEL,
                                        disabled: this.getHost().getProperty('displayXYCursor') === "false",
                                        propertyName: "placeholder",
                                        labelText: "Place Holder"
                                    }
                                ]
                            },
                        ]
                    },
                    // NOTE Tab Metric Options
                    {
                        name: 'Metric Options',
                        value: [
                            //Metric Colors and Axis (Colors of Metrics and switch for opposite Axis)
                            {
                                style: $WT.EDITORGROUP,
                                items: (function () {
                                    var x = [{
                                        style: $WT.LABEL,
                                        labelText: "Metric Colors and Axis"
                                    }];
                                    for (var i = 0; i < numOfMetrics; i++) {
                                        var color;
                                        x.push({
                                                style: $WT.EDITORGROUP,
                                                items: [
                                                    {
                                                    style: $WT.LABEL,
                                                    labelText: '----------------------'
                                                    }, {
                                                    style: $WT.LABEL,
                                                    labelText: myViz.zonesModel.getDropZones().zones[2].items[i].n
                                                    }, {
                                                    style: $WT.FILLGROUP,
                                                    propertyName: "lineColor" + i
                                                    }, {
                                                    style: $WT.TWOCOLUMN,
                                                    items: [{
                                                        style: $WT.LABEL,
                                                        width: "40%",
                                                        labelText: "Metric Form"
                                                        }, {
                                                        style: $WT.PULLDOWN,
                                                        width: "60%",
                                                        propertyName: "metricFormat" + i,
                                                        items: [
                                                            {
                                                            name: "default",
                                                            value: "#,###.00"
                                                            }, {
                                                            name: "Euro",
                                                            //value: "€ #,###.00"
                                                            value: "'€' #,###.00"
                                                            }, {
                                                            name: "Dollar",
                                                            //value: "$ #,###.00"
                                                            value: "'$' #,###.00"
                                                            }, {
                                                            name: "Percentage (Dec)",
                                                            value: "#,###.00%"
                                                            }, {
                                                            name: "Percentage (Int)",
                                                            value: "#,###.00  %"
                                                            }, {
                                                            name: "integer",
                                                            value: "#."
                                                            }, {
                                                            name: "thousand delimiter",
                                                            value: "#,###.##"
                                                            }, {
                                                            name: "big numbers",
                                                            value: "#.0a"
                                                            }
                                                        ]
                                                    }]
                                                }, {
                                                    style: $WT.CHECKBOXANDLABEL,
                                                    propertyName: "oppositeAxis" + i,
                                                    labelText: "opposite Axis"
                                                }, 
                                                /*
                                                {
                                                    style: $WT.CHECKBOXANDLABEL,
                                                    propertyName: "ownAxis" + i,
                                                    labelText: "own Axis"
                                                },
                                                */
                                                ]
                                        });
                                    }
                                    return x;
                                })()
                            },
                        ]
                    },
                    // NOTE Tab amCharts Help and Notes
                        {
                            name: 'Help and Notes',
                            value: [
                            {
                                style: $WT.EDITORGROUP,
                                items: [
                                    {
                                        style: $WT.LABEL,
                                        labelText: "Version 1.059 (GitHub:RobjSky)"
                                    }, {
                                        style: $WT.CHECKBOXANDLABEL,
                                        propertyName: "showDebugMsgs",
                                        labelText: "Show Msg"
                                    }, {
                                        style: $WT.LABEL,
                                        labelText: "Things to look out for: Date(dd.MM.yyyy) and DateTime(dd.MM.yyyy HH:mm) // The Time Attribute for DateTime needs to be sorted ASC."
                                        +"/n AMCharts(Aug2021):"
                                        +"\n Horizontal scrolling of legends is not(yet) supported."
                                    },
                                ]
                            },
                        ]
                    }
                ];
            }
        }
    );
}());