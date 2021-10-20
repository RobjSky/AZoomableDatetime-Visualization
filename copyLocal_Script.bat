set "source=u:\MyDocuments\00_MyStuff\MSTR Visualizations\Development\AZoomableDateTime (custom amchart)\AZoomableDateTime"

set "destination=c:\Program Files\MicroStrategy\Workstation\Code\plugins\AZoomableDateTime"

robocopy /mir "%source%" "%destination%"

start "C:\Program Files\MicroStrategy\Workstation\Workstation.exe" "u:\MyDocuments\00_MyStuff\MSTR Visualizations\Development\AZoomableDateTime (custom amchart)\CustomamChart.mstr"

exit /b