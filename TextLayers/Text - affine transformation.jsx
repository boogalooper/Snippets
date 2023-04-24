/**How to get text transform box boundary?
 * @r-bin
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/how-to-get-text-transform-box-boundary/m-p/11159325
 */
try {
    function show_points(p1, p2) {
        try {
            var d = new ActionDescriptor();
            var r = new ActionReference();
            r.putProperty(stringIDToTypeID("path"), stringIDToTypeID("workPath"));
            d.putReference(stringIDToTypeID("null"), r);
            var list = new ActionList();
            var d1 = new ActionDescriptor();
            d1.putEnumerated(stringIDToTypeID("shapeOperation"), stringIDToTypeID("shapeOperation"), stringIDToTypeID("add"));
            var list1 = new ActionList();
            var d2 = new ActionDescriptor();
            d2.putBoolean(stringIDToTypeID("closedSubpath"), true);
            var list2 = new ActionList();
            for (var i = 0; i < 4; i++) {
                var d3 = new ActionDescriptor();
                var d4 = new ActionDescriptor();
                d4.putUnitDouble(stringIDToTypeID("horizontal"), stringIDToTypeID("pixelsUnit"), p1[i][0]);
                d4.putUnitDouble(stringIDToTypeID("vertical"), stringIDToTypeID("pixelsUnit"), p1[i][1]);
                d3.putObject(stringIDToTypeID("anchor"), stringIDToTypeID("point"), d4);
                list2.putObject(stringIDToTypeID("pathPoint"), d3);
            }
            d2.putList(stringIDToTypeID("points"), list2);
            list1.putObject(stringIDToTypeID("subpathsList"), d2);
            d1.putList(stringIDToTypeID("subpathListKey"), list1);
            list.putObject(stringIDToTypeID("pathComponent"), d1);
            var d11 = new ActionDescriptor();
            d11.putEnumerated(stringIDToTypeID("shapeOperation"), stringIDToTypeID("shapeOperation"), stringIDToTypeID("add"));
            var list3 = new ActionList();
            var d12 = new ActionDescriptor();
            d12.putBoolean(stringIDToTypeID("closedSubpath"), true);
            var list4 = new ActionList();
            for (var i = 0; i < 4; i++) {
                var d3 = new ActionDescriptor();
                var d4 = new ActionDescriptor();
                d4.putUnitDouble(stringIDToTypeID("horizontal"), stringIDToTypeID("pixelsUnit"), p2[i][0]);
                d4.putUnitDouble(stringIDToTypeID("vertical"), stringIDToTypeID("pixelsUnit"), p2[i][1]);
                d3.putObject(stringIDToTypeID("anchor"), stringIDToTypeID("point"), d4);
                list4.putObject(stringIDToTypeID("pathPoint"), d3);
            }
            d12.putList(stringIDToTypeID("points"), list4);
            list3.putObject(stringIDToTypeID("subpathsList"), d12);
            d11.putList(stringIDToTypeID("subpathListKey"), list3);
            list.putObject(stringIDToTypeID("pathComponent"), d11);
            d.putList(stringIDToTypeID("to"), list);
            executeAction(stringIDToTypeID("set"), d, DialogModes.NO);
        }
        catch (e) { throw (e); }
    }
    function tranform(p, xx, xy, yx, yy, tx, ty) {
        try {
            var x = p[0];
            var y = p[1];
            p[0] = xx * x + yx * y + tx;
            p[1] = xy * x + yy * y + ty;
        }
        catch (e) { alert(e); }
    }
    var doc = app.activeDocument;
    var r = new ActionReference();
    r.putProperty(stringIDToTypeID("property"), stringIDToTypeID("width"));
    r.putEnumerated(stringIDToTypeID("document"), stringIDToTypeID("ordinal"), stringIDToTypeID("targetEnum"));
    var w = executeActionGet(r).getUnitDoubleValue(stringIDToTypeID("width"));
    var r = new ActionReference();
    r.putProperty(stringIDToTypeID("property"), stringIDToTypeID("height"));
    r.putEnumerated(stringIDToTypeID("document"), stringIDToTypeID("ordinal"), stringIDToTypeID("targetEnum"));
    var h = executeActionGet(r).getUnitDoubleValue(stringIDToTypeID("height"));
    var r = new ActionReference();
    r.putProperty(stringIDToTypeID("property"), stringIDToTypeID("textKey"));
    r.putEnumerated(stringIDToTypeID("layer"), stringIDToTypeID("ordinal"), stringIDToTypeID("targetEnum"));
    var tkey = executeActionGet(r).getObjectValue(stringIDToTypeID("textKey"));
    var xx = 1;
    var xy = 0;
    var yx = 0;
    var yy = 1;
    var tx = 0;
    var ty = 0;
    if (tkey.hasKey(stringIDToTypeID("transform"))) {
        xx = tkey.getObjectValue(stringIDToTypeID("transform")).getDouble(stringIDToTypeID("xx"));
        xy = tkey.getObjectValue(stringIDToTypeID("transform")).getDouble(stringIDToTypeID("xy"));
        yx = tkey.getObjectValue(stringIDToTypeID("transform")).getDouble(stringIDToTypeID("yx"));
        yy = tkey.getObjectValue(stringIDToTypeID("transform")).getDouble(stringIDToTypeID("yy"));
        tx = tkey.getObjectValue(stringIDToTypeID("transform")).getDouble(stringIDToTypeID("tx")); // not used
        ty = tkey.getObjectValue(stringIDToTypeID("transform")).getDouble(stringIDToTypeID("ty")); // not used
    }
    var x0 = tkey.getObjectValue(stringIDToTypeID("bounds")).getUnitDoubleValue(stringIDToTypeID("left"));
    var y0 = tkey.getObjectValue(stringIDToTypeID("bounds")).getUnitDoubleValue(stringIDToTypeID("top"));
    var x1 = tkey.getObjectValue(stringIDToTypeID("bounds")).getUnitDoubleValue(stringIDToTypeID("right"));
    var y1 = tkey.getObjectValue(stringIDToTypeID("bounds")).getUnitDoubleValue(stringIDToTypeID("bottom"));
    var p1 = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
    var ch = tkey.getObjectValue(stringIDToTypeID("textClickPoint")).getUnitDoubleValue(stringIDToTypeID("horizontal"));
    var cv = tkey.getObjectValue(stringIDToTypeID("textClickPoint")).getUnitDoubleValue(stringIDToTypeID("vertical"));
    tx += w * ch / 100;
    ty += h * cv / 100;
    tranform(p1[0], xx, xy, yx, yy, tx, ty);
    tranform(p1[1], xx, xy, yx, yy, tx, ty);
    tranform(p1[2], xx, xy, yx, yy, tx, ty);
    tranform(p1[3], xx, xy, yx, yy, tx, ty);
    var l = Math.min(p1[0][0], p1[1][0], p1[2][0], p1[3][0]);
    var t = Math.min(p1[0][1], p1[1][1], p1[2][1], p1[3][1]);
    var r = Math.max(p1[0][0], p1[1][0], p1[2][0], p1[3][0]);
    var b = Math.max(p1[0][1], p1[1][1], p1[2][1], p1[3][1]);
    var p2 = [[l, t], [r, t], [r, b], [l, b]];
    show_points(p1, p2);
}
catch (e) { alert(e); }