set "source=u:\MyDocuments\00_MyStuff\MSTR Visualizations\Development\AZoomableDateTime (custom amchart)\AZoomableDateTime"

set "destination=\\10DAW12SV23\webapps_9030\MicroStrategy\plugins\AZoomableDateTime"

robocopy /mir "%source%" "%destination%"

set "destination=\\10DAW12SV23\webapps_9030\MicroStrategyMobile\plugins\AZoomableDateTime"

robocopy /mir "%source%" "%destination%"

set "destination=\\10DAW12SV23\webapps_9030\MicroStrategyLibrary\plugins\AZoomableDateTime"

robocopy /mir "%source%" "%destination%"

pause

exit /b