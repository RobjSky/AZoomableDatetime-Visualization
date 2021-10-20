(function () {

    if (!mstrmojo.plugins.AZoomableDateTime) {
        mstrmojo.plugins.AZoomableDateTime = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.vi.models.CustomVisDropZones",
        "mstrmojo.array"
    );

    var ZONE_ATTRIBUTES = 'Time Attribute (dd.mm.yy)',
        ZONE_METRIC = 'Metrics',
        ZONE_ANNOTATION = 'Attribute or Break-By';


    mstrmojo.plugins.AZoomableDateTime.AZoomableDateTimeDropZones = mstrmojo.declare(
        //Declare that this code extends CustomVisDropzones
        mstrmojo.vi.models.CustomVisDropZones,
        null, {
            // Define the JavaScript class that renders your visualization drop zones.
            scriptClass: 'mstrmojo.plugins.AZoomableDateTime.AZoomableDateTimeDropZones',
            getCustomDropZones: function getCustomDropZones() {
                var ENUM_ALLOW_DROP_TYPE = mstrmojo.vi.models.CustomVisDropZones.ENUM_ALLOW_DROP_TYPE;
                // Fill the zones� definition here.
                return [{
                    name: ZONE_ATTRIBUTES,
                    title: mstrmojo.desc(13828, 'Drag time attribute here'),
                    maxCapacity: 1,
                    allowObjectType: ENUM_ALLOW_DROP_TYPE.ATTRIBUTE
                }, {
                    name: ZONE_ANNOTATION,
                    title: mstrmojo.desc(13827, 'Drag attributes here'),
                    maxCapacity: 20,
                    allowObjectType: ENUM_ALLOW_DROP_TYPE.ATTRIBUTE,
                    //isColorBy: true
                }, {
                    name: ZONE_METRIC,
                    title: mstrmojo.desc(13828, 'Drag metrics here'),
                    maxCapacity: 20,
                    allowObjectType: ENUM_ALLOW_DROP_TYPE.METRIC
                }];
            },
            shouldAllowObjectsInDropZone: function shouldAllowObjectsInDropZone(zone, dragObjects, idx, edge, context) {
                var me = this;
                return {
                    allowedItems: mstrmojo.array.filter(dragObjects, function (object) {
                        return true;
                    })
                };
            }
        }
    );

}());