/**lines into selection
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/lines-into-selection/td-p/13224775
 * https://youtu.be/K2eZ9o7S9So
 */

var s2t = stringIDToTypeID,
    t2s = typeIDToStringID,
    lr = new AM('layer'),
    pth = new AM('path'),
    originalRulerUnits = app.preferences.rulerUnits;
app.preferences.rulerUnits = Units.PIXELS;
lr.selectTransparency();
lr.createPath(1);
var pathContents = pth.getProperty('pathContents'),
    points = [];
for (var i = 0; i < pathContents.getList(s2t('pathComponents')).count; i++) {
    var currentPath = pathContents.getList(s2t('pathComponents')).getObjectValue(i);
    for (var x = 0; x < currentPath.getList(s2t('subpathListKey')).count; x++) {
        var pathPoints = currentPath.getList(s2t('subpathListKey')).getObjectValue(x).getList(s2t('points'));
        for (var y = 0; y < pathPoints.count; y++) {
            var cur = pathPoints.getObjectValue(y).getObjectValue(s2t('anchor'))
            points.push({ 'x': cur.getUnitDoubleValue(s2t('horizontal')), 'y': cur.getUnitDoubleValue(s2t('vertical')) })
        }
    }
}
lr.deleteCurrentPath();
pth.showPoints(graham(points));
pth.makeSelectionFromPath();
lr.deleteCurrentPath();
app.showColorPicker();
lr.createLayer(lr.getProperty('name') + ' fill');
lr.moveToPrevious();
lr.fillLayer();
lr.deselect();
app.preferences.rulerUnits = originalRulerUnits;
function graham(pathPoints) {
    var minI = 0;
    var min = pathPoints[0].x;
    var ch = [];
    for (var i = 0; i < pathPoints.length; i++) {
        ch[i] = i;
        if (pathPoints[i].x < min) {
            min = pathPoints[i].x;
            minI = i;
        }
    }
    ch[0] = minI;
    ch[minI] = 0;
    for (var i = 1; i < ch.length - 1; i++) {
        for (var j = i + 1; j < ch.length; j++) {
            var cl = classify({
                'x1': pathPoints[ch[0]].x,
                'y1': pathPoints[ch[0]].y,
                'x2': pathPoints[ch[i]].x,
                'y2': pathPoints[ch[i]].y
            }, pathPoints[ch[j]].x, pathPoints[ch[j]].y)
            if (cl < 0) {
                temp = ch[i];
                ch[i] = ch[j];
                ch[j] = temp;
            }
        }
    }
    h = [];
    h[0] = ch[0];
    h[1] = ch[1];
    for (var i = 2; i < ch.length; i++) {
        while (classify({
            'x1': pathPoints[h[h.length - 2]].x,
            'y1': pathPoints[h[h.length - 2]].y,
            'x2': pathPoints[h[h.length - 1]].x,
            'y2': pathPoints[h[h.length - 1]].y
        }, pathPoints[ch[i]].x, pathPoints[ch[i]].y) < 0) {
            h.pop();
        }
        h.push(ch[i]);
    }
    var result = [];
    for (var i = 0; i < h.length; i++) {
        result.push(pathPoints[h[i]])
    }
    return result;
    function classify(vector, x1, y1) {
        return pr = (vector.x2 - vector.x1) * (y1 - vector.y1) - (vector.y2 - vector.y1) * (x1 - vector.x1);
    }
}
function AM(target, order) {
    target = s2t(target)
    this.getProperty = function (property, descMode, id, idxMode) {
        property = s2t(property);
        (r = new ActionReference()).putProperty(s2t('property'), property);
        id != undefined ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id)) :
            r.putEnumerated(target, s2t('ordinal'), order ? s2t(order) : s2t('targetEnum'));
        return descMode ? executeActionGet(r) : getDescValue(executeActionGet(r), property)
    }
    this.hasProperty = function (property, id, idxMode) {
        property = s2t(property);
        (r = new ActionReference()).putProperty(s2t('property'), property);
        id ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id))
            : r.putEnumerated(target, s2t('ordinal'), order ? s2t(order) : s2t('targetEnum'));
        return executeActionGet(r).hasKey(property)
    }
    this.descToObject = function (d) {
        var o = {}
        for (var i = 0; i < d.count; i++) {
            var k = d.getKey(i)
            o[t2s(k)] = getDescValue(d, k)
        }
        return o
    }
    this.selectTransparency = function () {
        (r = new ActionReference()).putProperty(s2t('channel'), s2t('selection'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        r1 = new ActionReference();
        r1.putEnumerated(s2t('channel'), s2t('channel'), s2t('transparencyEnum'));
        d.putReference(s2t('to'), r1);
        executeAction(s2t('set'), d, DialogModes.NO);
    }
    this.makeSelectionFromPath = function () {
        (r = new ActionReference()).putProperty(s2t('channel'), s2t('selection'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        (r1 = new ActionReference()).putProperty(s2t('path'), s2t('workPath'));
        d.putReference(s2t('to'), r1);
        d.putBoolean(s2t('vectorMaskParams'), true);
        executeAction(s2t('set'), d, DialogModes.NO);
    }
    this.deleteCurrentPath = function () {
        (r = new ActionReference()).putProperty(s2t('path'), s2t('workPath'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        executeAction(s2t('delete'), d, DialogModes.NO);
    }
    this.createPath = function (tolerance) {
        tolerance = tolerance ? tolerance : 10;
        (r = new ActionReference()).putClass(s2t('path'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        (r1 = new ActionReference()).putProperty(s2t('selectionClass'), s2t('selection'));
        d.putReference(s2t('from'), r1);
        d.putUnitDouble(s2t('tolerance'), s2t('pixelsUnit'), tolerance);
        executeAction(s2t('make'), d, DialogModes.NO);
    }
    this.showPoints = function (p) {
        (r = new ActionReference()).putProperty(stringIDToTypeID("path"), stringIDToTypeID("workPath"));
        (d = new ActionDescriptor()).putReference(stringIDToTypeID("null"), r);
        (d1 = new ActionDescriptor()).putEnumerated(stringIDToTypeID("shapeOperation"), stringIDToTypeID("shapeOperation"), stringIDToTypeID("add"));
        (d2 = new ActionDescriptor()).putBoolean(stringIDToTypeID("closedSubpath"), true);
        var l2 = new ActionList();
        for (var i = 0; i < p.length; i++) {
            var d3 = new ActionDescriptor();
            var d4 = new ActionDescriptor();
            d4.putUnitDouble(stringIDToTypeID("horizontal"), stringIDToTypeID("pixelsUnit"), p[i].x);
            d4.putUnitDouble(stringIDToTypeID("vertical"), stringIDToTypeID("pixelsUnit"), p[i].y);
            d3.putObject(stringIDToTypeID("anchor"), stringIDToTypeID("point"), d4);
            l2.putObject(stringIDToTypeID("pathPoint"), d3);
        }
        d2.putList(stringIDToTypeID("points"), l2);
        (l1 = new ActionList()).putObject(stringIDToTypeID("subpathsList"), d2);
        d1.putList(stringIDToTypeID("subpathListKey"), l1);
        (l = new ActionList()).putObject(stringIDToTypeID("pathComponent"), d1);
        d.putList(stringIDToTypeID("to"), l);
        executeAction(stringIDToTypeID("set"), d, DialogModes.NO);
    }
    this.createLayer = function (name) {
        (r = new ActionReference()).putClass(s2t("layer"));
        (d = new ActionDescriptor()).putReference(s2t("null"), r);
        (d1 = new ActionDescriptor()).putString(s2t("name"), name);
        d.putObject(s2t("using"), s2t("layer"), d1);
        executeAction(s2t("make"), d, DialogModes.NO);
    }
    this.moveToPrevious = function () {
        (r = new ActionReference()).putEnumerated(s2t("layer"), s2t("ordinal"), s2t("targetEnum"));
        (d = new ActionDescriptor()).putReference(s2t("null"), r);
        (r1 = new ActionReference()).putEnumerated(s2t("layer"), s2t("ordinal"), s2t("previous"));
        d.putReference(s2t("to"), r1);
        executeAction(s2t("move"), d, DialogModes.NO);
    }
    this.fillLayer = function () {
        (d = new ActionDescriptor()).putEnumerated(s2t("using"), s2t("fillContents"), s2t("foregroundColor"));
        d.putUnitDouble(s2t("opacity"), s2t("percentUnit"), 100);
        d.putEnumerated(s2t("mode"), s2t("blendMode"), s2t("normal"));
        executeAction(s2t("fill"), d, DialogModes.NO);
    }
    this.deselect = function () {
        (r = new ActionReference()).putProperty(s2t('channel'), s2t('selection'));
        (d = new ActionDescriptor()).putReference(s2t('target'), r);
        d.putEnumerated(s2t('to'), s2t('ordinal'), s2t('none'));
        executeAction(s2t('set'), d, DialogModes.NO);
    }
    function getDescValue(d, p) {
        switch (d.getType(p)) {
            case DescValueType.OBJECTTYPE: return (d.getObjectValue(p));
            case DescValueType.LISTTYPE: return d.getList(p);
            case DescValueType.REFERENCETYPE: return d.getReference(p);
            case DescValueType.BOOLEANTYPE: return d.getBoolean(p);
            case DescValueType.STRINGTYPE: return d.getString(p);
            case DescValueType.INTEGERTYPE: return d.getInteger(p);
            case DescValueType.LARGEINTEGERTYPE: return d.getLargeInteger(p);
            case DescValueType.DOUBLETYPE: return d.getDouble(p);
            case DescValueType.ALIASTYPE: return d.getPath(p);
            case DescValueType.CLASSTYPE: return d.getClass(p);
            case DescValueType.UNITDOUBLE: return (d.getUnitDoubleValue(p));
            case DescValueType.ENUMERATEDTYPE: return [t2s(d.getEnumerationType(p)), t2s(d.getEnumerationValue(p))];
            default: break;
        };
    }
}
