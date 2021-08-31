#target photoshop
main()

function main() {
    var lr = new AM('layer'),
        a = getObjectBounds(1, 1, true),
        b = getObjectBounds(2, 200),
        scale = (a.cornerPoints[1].x - a.cornerPoints[0].x) / (b.cornerPoints[1].x - b.cornerPoints[0].x) * 100;

    lr.transform(scale, b.angle - a.angle, b.center.x, b.center.y, a.center.x - b.center.x, a.center.y - b.center.y)
}

function getObjectBounds(idx, treshold, invert) {
    var lr = new AM('layer'),
        pth = new AM('path')

    lr.selectLayerByIndex(idx)
    lr.copyToLayer()

    lr.makeFillLayer()
    lr.moveLayerInPalette('previous')
    lr.selectLayerInPalette('forwardEnum')

    lr.threshold(treshold)
    if (invert) lr.invert()

    lr.selectLayerInPalette('backwardEnum', true)
    lr.merge()

    lr.selectPixels('allEnum')
    lr.copyPixels()

    lr.makeMask()
    lr.selectMaskChannel()
    lr.pastePixels()
    lr.selectionFromChannel()
    lr.deleteChannel()
    lr.deleteLayer()
    lr.makePathFromSelection(1)
    var pthObj = lr.convertToObject(pth.getProperty('pathContents').value, 'pathComponents')
    pth.deleteWorkPath()
    var points = getPoints(pthObj)
    return getBoundsFromPoits(points)
}

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

function getBoundsFromPoits(points) {
    var boundingBox = {
        left: points.sort(function (a, b) { return a.x > b.x ? 1 : -1 })[0].x,
        right: points.sort(function (a, b) { return a.x < b.x ? 1 : -1 })[0].x,
        top: points.sort(function (a, b) { return a.y > b.y ? 1 : -1 })[0].y,
        bottom: points.sort(function (a, b) { return a.y < b.y ? 1 : -1 })[0].y
    }

    var doc = new AM('document'),
        docW = doc.getProperty('width'),
        docH = doc.getProperty('height');

    with (boundingBox) {
        var reference = { x: left + (right - left) / 2, y: top + (bottom - top) / 2 };
    }
    var cornerPoints = [
        points.sort(function (a, b) { return getLineLength(0, a.x, 0, a.y) < getLineLength(0, b.x, 0, b.y) ? 0 : 1 }).shift(),
        points.sort(function (a, b) { return getLineLength(0, a.x, docW, a.y) < getLineLength(0, b.x, docW, b.y) ? 0 : 1 }).shift(),
        points.sort(function (a, b) { return getLineLength(docW, a.x, docH, a.y) < getLineLength(docW, b.x, docH, b.y) ? 0 : 1 }).shift(),
        points.sort(function (a, b) { return getLineLength(docW, a.x, 0, a.y) < getLineLength(docW, b.x, 0, b.y) ? 0 : 1 }).shift()
    ]

    with (boundingBox) {
        var reference = { x: left + (right - left) / 2, y: top + (bottom - top) / 2 };
    }

    cornerPoints.sort(function (a, b) {
        var aTanA = Math.atan2((a.y - reference.y), (a.x - reference.x));
        var aTanB = Math.atan2((b.y - reference.y), (b.x - reference.x));
        if (aTanA < aTanB) return -1;
        else if (aTanB < aTanA) return 1;
        return 0;
    });

    syncOrientation(cornerPoints)

    var center = intersect(cornerPoints[0].x, cornerPoints[0].y, cornerPoints[2].x, cornerPoints[2].y, cornerPoints[1].x, cornerPoints[1].y, cornerPoints[3].x, cornerPoints[3].y),
        angle = - Math.atan2(cornerPoints[2].y - cornerPoints[3].y, cornerPoints[2].x - cornerPoints[3].x) * 180 / Math.PI;

    return { cornerPoints: cornerPoints, center: center, angle: angle }

    function getLineLength(x1, x2, y1, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
    }

    function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {
        if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) return false

        var denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))
        if (denominator === 0) return false

        var ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator,
            ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;
        if (ua < 0 || ua > 1 || ub < 0 || ub > 1) return false
        var x = x1 + ua * (x2 - x1),
            y = y1 + ua * (y2 - y1);

        return { x: x, y: y };
    }

    function syncOrientation(cornerPoints) {
        do {
            cornerPoints.push(cornerPoints[0])
            var orientation = []
            for (var i = 0; i < 4; i++) {
                orientation.push(getLineLength(cornerPoints[i + 1].x, cornerPoints[i].x, cornerPoints[i + 1].y, cornerPoints[i].y))
            }

            var check = 0,
                init = orientation[0];
            for (var i = 1; i < 4; i++) {
                if (orientation[i] >= init) { init = orientation[i], check = i };
            }
            cornerPoints.pop();

            if (check == 2) break;
            cornerPoints.unshift(cornerPoints.pop())
        } while (true)
    }
}

function AM(target) {
    var s2t = stringIDToTypeID,
        t2s = typeIDToStringID;

    target = target ? s2t(target) : null;

    this.getProperty = function (property, id, idxMode) {
        property = s2t(property);
        (r = new ActionReference()).putProperty(s2t('property'), property);
        id != undefined ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id)) :
            r.putEnumerated(target, s2t('ordinal'), s2t('targetEnum'));
        return getDescValue(executeActionGet(r), property)
    }

    this.hasProperty = function (property, id, idxMode) {
        property = s2t(property);
        (r = new ActionReference()).putProperty(s2t('property'), property);
        id ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id))
            : r.putEnumerated(target, s2t('ordinal'), s2t('targetEnum'));
        return executeActionGet(r).hasKey(property)
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

    this.copyToLayer = function () {
        executeAction(s2t('copyToLayer'), undefined, DialogModes.NO);
    }

    this.threshold = function (level) {
        (d = new ActionDescriptor()).putInteger(s2t('level'), level);
        executeAction(s2t('thresholdClassEvent'), d, DialogModes.NO);
    }

    this.invert = function () {
        executeAction(s2t("invert"), undefined, DialogModes.NO);
    }

    this.selectPixels = function (type) {
        (r = new ActionReference()).putProperty(s2t('channel'), s2t('selection'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        d.putEnumerated(s2t('to'), s2t('ordinal'), s2t(type));
        executeAction(s2t('set'), d, DialogModes.NO);
    }

    this.copyPixels = function () {
        executeAction(s2t('copyEvent'), undefined, DialogModes.NO);
    }

    this.autoCutout = function (sampleAllLayers) {
        (d = new ActionDescriptor()).putBoolean(s2t('sampleAllLayers'), sampleAllLayers);
        executeAction(s2t('autoCutout'), d, DialogModes.NO);
    }

    this.selectLayerByIndex = function (idx) {
        (r = new ActionReference()).putIndex(s2t('layer'), idx);
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        executeAction(s2t('select'), d, DialogModes.NO);
    }

    this.selectLayerInPalette = function (mode, addToSelection) {
        (r = new ActionReference()).putEnumerated(s2t("layer"), s2t("ordinal"), s2t(mode));
        (d = new ActionDescriptor()).putReference(s2t("null"), r);
        if (addToSelection) d.putEnumerated(s2t("selectionModifier"), s2t("selectionModifierType"), s2t("addToSelection"));
        executeAction(s2t("select"), d, DialogModes.NO);
    }

    this.makeFillLayer = function () {
        (r = new ActionReference()).putClass(s2t("contentLayer"));
        d.putReference(s2t("null"), r);
        (d3 = new ActionDescriptor()).putDouble(s2t("red"), 0);
        d3.putDouble(s2t("green"), 0);
        d3.putDouble(s2t("blue"), 0);
        (d2 = new ActionDescriptor()).putObject(s2t("color"), s2t("RGBColor"), d3);
        (d1 = new ActionDescriptor()).putObject(s2t("type"), s2t("solidColorLayer"), d2);
        d.putObject(s2t("using"), s2t("contentLayer"), d1);
        executeAction(s2t("make"), d, DialogModes.NO);
    }

    this.moveLayerInPalette = function (mode) {
        (r = new ActionReference()).putEnumerated(s2t("layer"), s2t("ordinal"), s2t("targetEnum"));
        (d = new ActionDescriptor()).putReference(s2t("null"), r);
        (r1 = new ActionReference()).putEnumerated(s2t("layer"), s2t("ordinal"), s2t(mode));
        d.putReference(s2t("to"), r1);
        executeAction(s2t("move"), d, DialogModes.NO);

    }

    this.makePathFromSelection = function (tolerance) {
        (r = new ActionReference()).putClass(s2t('path'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        (r1 = new ActionReference()).putProperty(s2t('selectionClass'), s2t('selection'));
        d.putReference(s2t('from'), r1);
        d.putUnitDouble(s2t('tolerance'), s2t('pixelsUnit'), tolerance);
        executeAction(s2t('make'), d, DialogModes.NO);
    }

    this.pastePixels = function () {
        (d = new ActionDescriptor()).putEnumerated(s2t('antiAlias'), s2t('antiAliasType'), s2t('antiAliasNone'));
        d.putClass(s2t('as'), s2t('pixel'));
        executeAction(s2t('paste'), d, DialogModes.NO);
    }

    this.makeMask = function () {
        (d = new ActionDescriptor()).putClass(s2t('new'), s2t('channel'));
        (r = new ActionReference()).putEnumerated(s2t('channel'), s2t('channel'), s2t('mask'));
        d.putReference(s2t('at'), r);
        d.putEnumerated(s2t('using'), s2t('userMask'), s2t('hideAll'));
        executeAction(s2t('make'), d, DialogModes.NO);
    }

    this.selectMaskChannel = function () {
        (r = new ActionReference()).putEnumerated(s2t('channel'), s2t('ordinal'), s2t('targetEnum'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        d.putBoolean(s2t('makeVisible'), true)
        executeAction(s2t('select'), d, DialogModes.NO);
    }

    this.selectionFromChannel = function () {
        (r = new ActionReference()).putProperty(s2t("channel"), s2t("selection"));
        (d = new ActionDescriptor()).putReference(s2t("null"), r);
        (r1 = new ActionReference()).putEnumerated(s2t("channel"), s2t("ordinal"), s2t("targetEnum"));
        d.putReference(s2t("to"), r1);
        executeAction(s2t("set"), d, DialogModes.NO);
    }

    this.merge = function () {
        executeAction(s2t("mergeLayers"), new ActionDescriptor(), DialogModes.NO);
    }

    this.deleteChannel = function () {
        (r = new ActionReference()).putEnumerated(s2t('channel'), s2t('channel'), s2t('mask'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        executeAction(s2t('delete'), d, DialogModes.NO);
    }

    this.deleteWorkPath = function () {
        (r = new ActionReference()).putProperty(s2t('path'), s2t('workPath'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        executeAction(s2t('delete'), d, DialogModes.NO);

    }

    this.deleteLayer = function () {
        (r = new ActionReference()).putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        executeAction(s2t('delete'), d, DialogModes.NO);
    }

    this.transform = function (scale, angle, x, y, dX, dY) {
        (r = new ActionReference()).putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        d.putEnumerated(s2t('freeTransformCenterState'), s2t('quadCenterState'), s2t('QCSIndependent'));
        (d1 = new ActionDescriptor()).putUnitDouble(s2t('horizontal'), s2t('distanceUnit'), x);
        d1.putUnitDouble(s2t('vertical'), s2t('distanceUnit'), y);
        d.putObject(s2t('position'), s2t('paint'), d1);
        (d2 = new ActionDescriptor()).putUnitDouble(s2t('horizontal'), s2t('distanceUnit'), dX);
        d2.putUnitDouble(s2t('vertical'), s2t('distanceUnit'), dY);
        d.putObject(s2t('offset'), s2t('offset'), d2);
        d.putUnitDouble(s2t('width'), s2t('percentUnit'), scale);
        d.putUnitDouble(s2t('height'), s2t('percentUnit'), scale);
        d.putUnitDouble(s2t('angle'), s2t('angleUnit'), angle);
        d.putEnumerated(s2t('interfaceIconFrameDimmed'), s2t('interpolationType'), s2t('bicubic'));
        executeAction(s2t('transform'), d, DialogModes.NO);
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