/**work with path components */
#target photoshop;

var s2t = stringIDToTypeID,
t2s = typeIDToStringID;
(r = new ActionReference()).putProperty(s2t('property'), p = s2t('numberOfPaths'));
r.putEnumerated(s2t("document"), s2t("ordinal"), s2t("targetEnum"));
var len = executeActionGet(r).getInteger(p)

var lines = []
for (var i = 1; i <= len; i++) {
    (r = new ActionReference()).putProperty(s2t('property'), p = s2t('pathContents'));
    r.putIndex(s2t("path"), i);
    pointsList = executeActionGet(r).getObjectValue(p).getList(s2t('pathComponents')).getObjectValue(0)
        .getList(s2t('subpathListKey')).getObjectValue(0).getList(s2t('points'));

    lines.push({
        x1: c = pointsList.getObjectValue(0).getObjectValue(s2t('anchor')).getUnitDoubleValue(s2t('horizontal')),
        y1: pointsList.getObjectValue(0).getObjectValue(s2t('anchor')).getUnitDoubleValue(s2t('vertical')),
        x2: c = pointsList.getObjectValue(1).getObjectValue(s2t('anchor')).getUnitDoubleValue(s2t('horizontal')),
        y2: pointsList.getObjectValue(1).getObjectValue(s2t('anchor')).getUnitDoubleValue(s2t('vertical'))
    });
}

var z = getRulerUnits()
setRulerUnits('rulerPixels')
var v = getParallelVector(lines)
show_points(v)
select(1)
transform(v.vx, v.vy)
setRulerUnits(z)


function getParallelVector(l) {
    var x1 = l[1].x1,
        x2 = l[1].x2,
        y1 = l[1].y1,
        y2 = l[1].y2,
        x3 = (l[0].x2 + l[0].x1) / 2,
        y3 = (l[0].y2 + l[0].y1) / 2;

    var x4 = ((x2 - x1) * (y2 - y1) * (y3 - y1) + x1 * Math.pow(y2 - y1, 2) + x3 * Math.pow(x2 - x1, 2)) / (Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2)),
        y4 = (y2 - y1) * (x4 - x1) / (x2 - x1) + y1;

    return { x1: x3, y1: y3, x2: x4, y2: y4, vx: x4 - x3, vy: y4 - y3 }
}

function show_points(p) {

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


    var d3 = new ActionDescriptor();
    var d4 = new ActionDescriptor();
    d4.putUnitDouble(stringIDToTypeID("horizontal"), stringIDToTypeID("pixelsUnit"), p.x1);
    d4.putUnitDouble(stringIDToTypeID("vertical"), stringIDToTypeID("pixelsUnit"), p.y1);
    d3.putObject(stringIDToTypeID("anchor"), stringIDToTypeID("point"), d4);
    list2.putObject(stringIDToTypeID("pathPoint"), d3);

    var d3 = new ActionDescriptor();
    var d4 = new ActionDescriptor();
    d4.putUnitDouble(stringIDToTypeID("horizontal"), stringIDToTypeID("pixelsUnit"), p.x2);
    d4.putUnitDouble(stringIDToTypeID("vertical"), stringIDToTypeID("pixelsUnit"), p.y2);
    d3.putObject(stringIDToTypeID("anchor"), stringIDToTypeID("point"), d4);
    list2.putObject(stringIDToTypeID("pathPoint"), d3);

    d2.putList(stringIDToTypeID("points"), list2);


    list1.putObject(stringIDToTypeID("subpathsList"), d2);
    d1.putList(stringIDToTypeID("subpathListKey"), list1);
    list.putObject(stringIDToTypeID("pathComponent"), d1);
    d.putList(stringIDToTypeID("to"), list);
    executeAction(stringIDToTypeID("set"), d, DialogModes.NO);
}

function select(idx) {
    var descriptor = new ActionDescriptor();
    var reference = new ActionReference();

    reference.putIndex(s2t("path"), idx);
    descriptor.putReference(s2t("null"), reference);
    executeAction(s2t("select"), descriptor, DialogModes.NO);
}

function transform(horizontal, vertical) {
    var descriptor = new ActionDescriptor();
    var descriptor2 = new ActionDescriptor();
    var reference = new ActionReference();

    reference.putEnumerated(s2t("path"), s2t("ordinal"), s2t("targetEnum"));
    descriptor.putReference(s2t("null"), reference);
    descriptor.putEnumerated(s2t("freeTransformCenterState"), s2t("quadCenterState"), s2t("QCSAverage"));
    descriptor2.putUnitDouble(s2t("horizontal"), s2t("pixelsUnit"), horizontal);
    descriptor2.putUnitDouble(s2t("vertical"), s2t("pixelsUnit"), vertical);
    descriptor.putObject(s2t("offset"), s2t("offset"), descriptor2);
    executeAction(s2t("transform"), descriptor, DialogModes.NO);
}

function getRulerUnits() {
    (r = new ActionReference()).putProperty(s2t('property'), p = s2t('rulerUnits'))
    r.putEnumerated(s2t("application"), s2t("ordinal"), s2t("targetEnum"));
    return t2s(executeActionGet(r).getEnumerationValue(p));
}

function setRulerUnits(units) {
    (r = new ActionReference()).putProperty(s2t("property"), s2t("unitsPrefs"));
    r.putEnumerated(s2t('application'), s2t('ordinal'), s2t('targetEnum'));
    (d = new ActionDescriptor).putReference(s2t('target'), r);
    (d1 = new ActionDescriptor).putEnumerated(s2t('rulerUnits'), s2t('rulerUnits'), s2t(units));
    d.putObject(s2t('to'), s2t('unitsPrefs'), d1);
    executeAction(s2t('set'), d, DialogModes.NO);
}

