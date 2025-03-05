/**Transform corners of irregular rectangle into 90 degrees
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/transform-corners-of-irregular-rectangle-into-90-degrees/m-p/12901163#M639196
 * https://youtu.be/jka7B1qOZTA
 * https://youtu.be/m9XSLjBl-oI
 */
#target photoshop
var lr = new AM('layer'),
    pth = new AM('path'),
    doc = new AM('document');
lr.makeSelection();
lr.createPath(1)
var pthObj = lr.convertToObject(pth.getProperty('pathContents').value, 'pathComponents'),
    sourceRect = getCornerPoints(getPoints(pthObj));
lr.deleteCurrentPath()
lr.perspectiveWarpTransform(sourceRect.bounds, sourceRect.corners, getTargetRect([doc.getProperty('width'), doc.getProperty('height')]))
function getPoints(pth) {
    var points = [];
    for (a in pth) {
        var pc = pth[a];
        if (pc.subpathListKey) {
            for (b in pc.subpathListKey) {
                var slk = pc.subpathListKey[b]
                if (slk.closedSubpath) {
                    var pts = slk.points
                    for (c in pts) {
                        points.push({ x: pts[c].anchor.horizontal._value, y: pts[c].anchor.vertical._value })
                    }
                }
            }
        }
    }
    return points;
}
function getCornerPoints(points) {
    var boundingBox = {
        left: points.sort(function (a, b) { return a.x > b.x ? 1 : -1 })[0].x,
        right: points.sort(function (a, b) { return a.x < b.x ? 1 : -1 })[0].x,
        top: points.sort(function (a, b) { return a.y > b.y ? 1 : -1 })[0].y,
        bottom: points.sort(function (a, b) { return a.y < b.y ? 1 : -1 })[0].y
    }
    var corners = [
        points.sort(function (a, b) { return getLineLength(boundingBox.left, a.x, boundingBox.top, a.y) < getLineLength(boundingBox.left, b.x, boundingBox.top, b.y) ? 0 : 1 }).shift(),
        points.sort(function (a, b) { return getLineLength(boundingBox.right, a.x, boundingBox.top, a.y) < getLineLength(boundingBox.right, b.x, boundingBox.top, b.y) ? 0 : 1 }).shift(),
        points.sort(function (a, b) { return getLineLength(boundingBox.right, a.x, boundingBox.bottom, a.y) < getLineLength(boundingBox.right, b.x, boundingBox.bottom, b.y) ? 0 : 1 }).shift(),
        points.sort(function (a, b) { return getLineLength(boundingBox.left, a.x, boundingBox.bottom, a.y) < getLineLength(boundingBox.left, b.x, boundingBox.bottom, b.y) ? 0 : 1 }).shift()
    ]
    return { corners: corners, bounds: boundingBox }
    function getLineLength(x1, x2, y1, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
    }
}
function getTargetRect(target) {
    return ([
        {
            x: 0,
            y: 0
        },
        {
            x: target[0],
            y: 0
        },
        {
            x: target[0],
            y: target[1],
        },
        {
            x: 0,
            y: target[1]
        }
    ]);
}
function AM(target, order) {
    var s2t = stringIDToTypeID,
        t2s = typeIDToStringID;
    target = s2t(target)
    this.getProperty = function (property, descMode, id, idxMode) {
        property = s2t(property);
        (r = new ActionReference()).putProperty(s2t('property'), property);
        id != undefined ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id)) :
            r.putEnumerated(target, s2t('ordinal'), order ? s2t(order) : s2t('targetEnum'));
        return descMode ? executeActionGet(r) : getDescValue(executeActionGet(r), property)
    }
    this.convertToObject = function (obj, key) {
        var d = new ActionDescriptor();
        switch (obj.typename) {
            case 'ActionList': d.putList(s2t(key), obj); break;
            case 'ActionDescriptor': d = obj; break;
        }
        (desc = new ActionDescriptor()).putObject(s2t('object'), s2t('json'), d);
        eval('var o = ' + executeAction(s2t('convertJSONdescriptor'), desc).getString(s2t('json')));
        return o[key]
    }
    this.makeSelection = function () {
        (r = new ActionReference()).putProperty(s2t('channel'), s2t('selection'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        r1 = new ActionReference();
        r1.putEnumerated(s2t('channel'), s2t('channel'), s2t('transparencyEnum'));
        d.putReference(s2t('to'), r1);
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
    this.perspectiveWarpTransform = function (referenceRect, corners, targetPoints) {
        (r = new ActionReference()).putEnumerated(s2t("layer"), s2t("ordinal"), s2t("targetEnum"));
        (d = new ActionDescriptor()).putReference(s2t("target"), r);
        d.putEnumerated(s2t("mode"), s2t("perspectiveWarpMode"), s2t("warp"));
        (d1 = new ActionDescriptor()).putUnitDouble(s2t("top"), s2t("pixelsUnit"), referenceRect.top);
        d1.putUnitDouble(s2t("left"), s2t("pixelsUnit"), referenceRect.left);
        d1.putUnitDouble(s2t("bottom"), s2t("pixelsUnit"), referenceRect.bottom);
        d1.putUnitDouble(s2t("right"), s2t("pixelsUnit"), referenceRect.right);
        d.putObject(s2t("referenceRect"), s2t("rectangle"), d1);
        var l = new ActionList();
        for (var i = 0; i < corners.length; i++) {
            var point = new ActionDescriptor();
            point.putUnitDouble(s2t("horizontal"), s2t("pixelsUnit"), corners[i].x);
            point.putUnitDouble(s2t("vertical"), s2t("pixelsUnit"), corners[i].y);
            l.putObject(s2t("point"), point);
        }
        d.putList(s2t("vertices"), l);
        var l = new ActionList(),
            l1 = new ActionList();
        for (var i = 0; i < targetPoints.length; i++) {
            var point = new ActionDescriptor();
            point.putUnitDouble(s2t("horizontal"), s2t("pixelsUnit"), targetPoints[i].x);
            point.putUnitDouble(s2t("vertical"), s2t("pixelsUnit"), targetPoints[i].y);
            l.putObject(s2t("point"), point);
            l1.putInteger(i);
        }
        d.putList(s2t("warpedVertices"), l);
        (d2 = new ActionDescriptor()).putList(s2t("indices"), l1);
        (l2 = new ActionList()).putObject(s2t("perspectiveWarpQuad"), d2);
        d.putList(s2t("quads"), l2);
        executeAction(s2t("perspectiveWarpTransform"), d, DialogModes.NO);
    }
    function getDescValue(d, p) {
        switch (d.getType(p)) {
            case DescValueType.OBJECTTYPE: return { type: t2s(d.getObjectType(p)), value: d.getObjectValue(p) };
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
            case DescValueType.ENUMERATEDTYPE: return { type: t2s(d.getEnumerationType(p)), value: t2s(d.getEnumerationValue(p)) };
            default: break;
        };
    }
}