/**Cropping a photo using the built-in crop and straighten plugin
 * (silent mode)
 * @r-bin
 * https://community.adobe.com/t5/photoshop-ecosystem/how-to-cut-out-photos/td-p/12219003/page/2
 */
crop(true);
crop();
function crop(select_only) {
    try {
        var d = executeAction(stringIDToTypeID("CropPhotos0001"), undefined, DialogModes.NO);
        var l = d.getList(stringIDToTypeID("value"));
        var p = new Array();
        for (var i = 0; i < 8; i += 2) p.push([l.getDouble(i), l.getDouble(i + 1)]);
        if (select_only) { activeDocument.selection.select(p); return; }
        var d = new ActionDescriptor();
        var d1 = new ActionDescriptor();
        var d2 = new ActionDescriptor();
        d2.putUnitDouble(stringIDToTypeID("horizontal"), stringIDToTypeID("pixelsUnit"), 0);
        d2.putUnitDouble(stringIDToTypeID("vertical"), stringIDToTypeID("pixelsUnit"), 0);
        d1.putObject(stringIDToTypeID("center"), stringIDToTypeID("point"), d2);
        for (var i = 0; i < 4; i++) {
            var d3 = new ActionDescriptor();
            d3.putUnitDouble(stringIDToTypeID("horizontal"), stringIDToTypeID("pixelsUnit"), p[i][0]);
            d3.putUnitDouble(stringIDToTypeID("vertical"), stringIDToTypeID("pixelsUnit"), p[i][1]);
            d1.putObject(stringIDToTypeID("quadCorner" + i), stringIDToTypeID("offset"), d3);
        }
        d.putObject(stringIDToTypeID("to"), stringIDToTypeID("quadrilateral"), d1);
        executeAction(stringIDToTypeID("perspectiveCrop"), d, DialogModes.NO);
        return true;
    }
    catch (e) { alert(e); throw (e); }
}