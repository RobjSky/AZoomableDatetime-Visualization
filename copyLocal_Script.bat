set "source=%~dp0\AZoomableDateTime"

set "destination=c:\Program Files\MicroStrategy\Workstation\Code\plugins\AZoomableDateTime"

robocopy /mir "%source%" "%destination%"

start "C:\Program Files\MicroStrategy\Workstation\Workstation.exe" "%~dp0CustomamChart.mstr"

exit /b