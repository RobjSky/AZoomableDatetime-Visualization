aktueller Stand: reine Kopie und Umbenennung

Done:
- Position of Legend
- Colors for Attributes globally https://lw.microstrategy.com/msdz/MSDL/GARelease_Current/docs/projects/VisSDK/Content/topics/HTML5/ColorPaletteAPI.htm
- switch left right Axis
	https://www2.microstrategy.com/producthelp/10.4/AdvancedReportingGuide/WebHelp/Lang_1033/Content/AdvancedReporting/Formatting_the_axes_on_a_graph.htm
	https://www2.microstrategy.com/producthelp/10.4/AdvancedReportingGuide/WebHelp/Lang_1033/Content/AdvancedReporting/Bar.htm
- Multiple Value Axis https://www.amcharts.com/demos/multiple-value-axes/
- Sync Value Axis https://www.amcharts.com/docs/v4/concepts/axes/value-axis/#Synchronizing_grid
- Panning Cursor / Horizontal Scrollbar / Vertical Scrollbar https://www.amcharts.com/demos/date-based-data/
- Gridlines On/Off
- Gridlines transparent grey
- Zoom to month by clicking on a DateAxis label
	https://www.amcharts.com/docs/v4/tutorials/zoom-to-month-by-clicking-on-a-dateaxis-label/
- how to highlight weekends on a Date Axis
	https://www.amcharts.com/docs/v4/tutorials/using-fill-rules-on-a-date-axis/
	https://www.amcharts.com/docs/v4/tutorials/using-axis-ranges-to-highlight-weekends/

ToDo:
- Multiple Date Axes
	(https://www.amcharts.com/demos/multiple-date-axes/)
- Group Data (groupData)
	https://www.amcharts.com/docs/v4/reference/dateaxis/#Properties
	https://www.amcharts.com/docs/v4/concepts/axes/date-axis/#Dynamic_data_item_grouping
- Plugin: Range Selector (Zoombuttons)
	https://www.amcharts.com/docs/v4/tutorials/plugin-range-selector/

+---------------------------------------------------------------------------+
- New Chart: Radar
https://www.amcharts.com/demos/radar-chart-visualizing-yearly-activities/
https://www.amcharts.com/demos/radar-timeline/

Gantt für Spielplan
https://www.amcharts.com/demos/bent-gantt-chart/
https://www.amcharts.com/demos/gantt-chart/
https://www.amcharts.com/demos/gantt-chart-dates/

+---------------------------------------------------------------------------+
Hello, for a custom Visualization i am looking for a way to identify whether and attribute coming through the Data Interface API is in fact a date, time, datetime or "something else". Maybe by using getFormType()? If so, how?

kann ich abfragen welchen Typ das Attribut hat (standard, geo, datetime entspricht den Icons im dossiereditor)
Kann ich auch bei attributen die Werte als RAW beziehen und wenn ja wird dann ein Datetime zurückgegeben?
Kann ich das "Zahlenformat" abfragen?

// Attribute.Values
this.dataInterface.getRowHeaders(i).getHeader(0).getName()

