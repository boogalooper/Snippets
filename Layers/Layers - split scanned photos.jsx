/**
 * Straighten photos and save photos in same directory. 
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/straighten-photos-and-save-photos-in-same-directory/td-p/15438965
 */

const RESIZE_TO = 400, // px
    LORES_EXPAND = 1, // px
    HIRES_EXPAND = 10, // px
    PATH_TOLERANCE = 6, //1-10
    OBJECT_THRESHOLD = 5, // %
    BORDER_OFFSET = 0.4, // w*const, h*const
    COLOR_DIFFERENCE = 20, // dE, CIE76, color diifference to detect border;
    LEVELS_NOISE_THRESHOLD = 50;
var apl = new AM('application'),
    doc = new AM('document'),
    lr = new AM('layer'),
    ch = new AM('channel'),
    pth = new AM('path'),
    pathComponents = new ActionList();
try {
    if (apl.getProperty('numberOfDocuments') && !doc.hasProperty('selection')) {
        var docRes = doc.getProperty('resolution'),
            docW = doc.getProperty('width') * docRes / 72,
            docH = doc.getProperty('height') * docRes / 72;
        activeDocument.suspendHistory('Get objects bounds', "fn1()");
        if (pathComponents.count) activeDocument.suspendHistory('Slice and save objects', "fn2()");
        function fn1() { app.doForcedProgress('Get objects bounds...', 'getBounds(docW, docH)') }
        function fn2() { doForcedProgress('Crop and save objects...', 'sliceObjects(pathComponents)') }
    }
}
catch (e) { alert('Sorry! An error has occurred!\n' + e) }
function getBounds(docW, docH) {
    lr.convertToSmartObject();
    doc.resizeImageToWidth(RESIZE_TO);
    doc.convertMode('labColorMode');
    doc.selectChannel('b');
    doc.makeSelection(0, 0, docW, docH);
    doc.copyPixes();
    doc.convertMode('RGBColorMode');
    doc.pastePixels();
    var levelsThreshold = findMinMax(ch.getProperty('histogram'));
    doc.levels(levelsThreshold[0], levelsThreshold[1]);
    doc.threshold(1);
    doc.makeSelectionFromChannel('RGB');
    doc.deleteLayer();
    doc.expandSelection(LORES_EXPAND);
    doc.workPathFromSelection(PATH_TOLERANCE);
    doc.resizeImageToWidth(docW);
    doc.flatten();
    largeObjects = (pth.getProperty('pathContents').value).getList(stringIDToTypeID('pathComponents'));
    for (var i = 0; i < largeObjects.count; i++) {
        pth.workPathFromDesc(largeObjects.getObjectValue(i));
        pth.selectionFromWorkPath();
        if (doc.hasProperty('selection')) {
            var bounds = doc.descToObject(doc.getProperty('selection').value),
                s = (bounds.right - bounds.left) * (bounds.bottom - bounds.top);
            if ((s / (docH * docW)) * 100 > OBJECT_THRESHOLD) pathComponents.putObject(stringIDToTypeID('pathComponent'), largeObjects.getObjectValue(i))
        }
        pth.delete();
    }
    function findMinMax(a) {
        var max = 0,
            min = 0,
            level = 0.
        for (var i = 255; i >= 0; i--) {
            var cur = a.getInteger(i)
            if (cur < LEVELS_NOISE_THRESHOLD) continue;
            if (checkPeak(a, cur, i, 10)) {
                max = cur;
                level = i;
                break;
            }
        }
        for (var i = level; i >= 0; i--) {
            if (a.getInteger(i - 1) > a.getInteger(i)) {
                min = i - 1
                break;
            }
        }
        for (var i = level; i < a.count; i++) {
            if (a.getInteger(i) == 0) {
                max = i
                break;
            }
        }
        return [min, max]
        function checkPeak(l, cur, from, steps) {
            for (var i = from; i > from - steps; i--) {
                if (l.getInteger(i) > cur) return false
            }
            return true
        }
    }
}
function sliceObjects(objects) {
    for (var i = 0; i < objects.count; i++) {
        pth.workPathFromDesc(objects.getObjectValue(i));
        pth.selectionFromWorkPath()
        var title = doc.getProperty('title').replace(/\..+$/, '') + ' ' + (i + 1),
            fld = doc.getProperty('fileReference').path;
        changeProgressText(title + '/' + objects.count)
        updateProgress((i + 1), objects.count)
        if (doc.hasProperty('selection')) {
            doc.expandSelection(HIRES_EXPAND);
            doc.duplicateLayer();
            doc.convertToSmartObject();
            doc.editSmartObject();
            pth.delete();
            var hst = activeDocument.activeHistoryState;
            doc.resizeImageToWidth(RESIZE_TO);
            var docRes = doc.getProperty('resolution'),
                tmpW = doc.getProperty('width') * docRes / 72,
                tmpH = doc.getProperty('height') * docRes / 72;
            if (tmpW < tmpH) {
                var coord1 = [tmpW - findCoordinate(getLine(tmpH * BORDER_OFFSET, 0, tmpH * BORDER_OFFSET + 1, tmpW), true), tmpH * BORDER_OFFSET],
                    coord2 = [tmpW - findCoordinate(getLine(tmpH * (1 - BORDER_OFFSET), 0, tmpH * (1 - BORDER_OFFSET) + 1, tmpW), true), (tmpH * (1 - BORDER_OFFSET))];
                activeDocument.activeHistoryState = hst;
                lr.rotate(Math.atan2(coord2[0] - coord1[0], coord2[1] - coord1[1]) * 180 / Math.PI);
            } else {
                var coord1 = [tmpW * BORDER_OFFSET, tmpH - findCoordinate(getLine(0, tmpW * BORDER_OFFSET, tmpH, tmpW * BORDER_OFFSET + 1), true)],
                    coord2 = [(tmpW * (1 - BORDER_OFFSET)), tmpH - findCoordinate(getLine(0, tmpW * (1 - BORDER_OFFSET), tmpH, tmpW * (1 - BORDER_OFFSET) + 1), true)];
                activeDocument.activeHistoryState = hst;
                lr.rotate(-(Math.atan2(coord2[1] - coord1[1], coord2[0] - coord1[0]) * 180 / Math.PI));
            }
            doc.revealAll();
            var hst = activeDocument.activeHistoryState;
            doc.resizeImageToWidth(RESIZE_TO);
            var lineX = getLine(tmpH * 0.5, 0, tmpH * 0.5 + 1, tmpW),
                left = findCoordinate(lineX),
                right = tmpW - findCoordinate(lineX, true),
                lineY = getLine(0, tmpW * 0.5, tmpH, tmpW * 0.5 + 1),
                top = findCoordinate(lineY),
                bottom = tmpH - findCoordinate(lineY, true);
            activeDocument.activeHistoryState = hst;
            var docRes = doc.getProperty('resolution'),
                docW = doc.getProperty('width') * docRes / 72,
                docH = doc.getProperty('height') * docRes / 72;
            var k = docH / tmpH;
            doc.makeSelection(top * k, left * k, bottom * k, right * k);
            doc.expandSelection(LORES_EXPAND);
            doc.crop();
            doc.flatten();
            doc.saveACopyToTIFF(new File(fld + '/' + title))
            doc.close();
            doc.deleteLayer();
        }
    }
    pth.delete();
    doc.deselect();
    function getLine(top, left, bottom, right) {
        var hst = activeDocument.activeHistoryState;
        doc.makeSelection(top, left, bottom, right);
        doc.crop();
        var f = new File(Folder.temp + '/colors.raw');
        doc.saveToRAW(f)
        activeDocument.activeHistoryState = hst;
        return readStrip(f);
        function readStrip(f) {
            var content = '';
            if (f.exists) {
                f.open('r');
                f.encoding = "BINARY";
                content = f.read();
                f.close();
                f.remove();
                return colors = function (s) {
                    var m = [],
                        offset = 0;
                    do {
                        var c = [];
                        for (var i = 0; i < 3; i++) {
                            var k = s.charCodeAt(offset + i);
                            c.push(k)
                        };
                        m.push(c)
                        offset += 3;
                    } while (offset < s.length)
                    return m;
                }(content);
            }
        }
    }
    function findCoordinate(colors, reverse) {
        if (reverse) colors.reverse();
        for (var i = 0; i < colors.length; i++) {
            if (colors[i][0] == 255 && colors[i][1] == 255 && colors[i][2] == 255) continue;
            break;
        }
        var base = colors[i];
        for (i; i < colors.length; i++) {
            if (dE(base, colors[i]) > COLOR_DIFFERENCE) return i
        }
        function dE(a, b) { return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2) + Math.pow(a[2] - b[2], 2)); }
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
    this.descToObject = function (d) {
        var o = {}
        for (var i = 0; i < d.count; i++) {
            var k = d.getKey(i)
            o[t2s(k)] = getDescValue(d, k)
        }
        return o
    }
    this.duplicateLayer = function () {
        executeAction(s2t("copyToLayer"), undefined, DialogModes.NO);
    }
    this.convertToSmartObject = function () {
        executeAction(s2t("newPlacedLayer"), undefined, DialogModes.NO);
    }
    this.editSmartObject = function () {
        executeAction(s2t("placedLayerEditContents"), new ActionDescriptor(), DialogModes.NO);
    }
    this.makeSelection = function (top, left, bottom, right) {
        (r = new ActionReference()).putProperty(s2t("channel"), s2t("selection"));
        (d = new ActionDescriptor()).putReference(s2t("null"), r);
        (d1 = new ActionDescriptor()).putUnitDouble(s2t("top"), s2t("pixelsUnit"), top);
        d1.putUnitDouble(s2t("left"), s2t("pixelsUnit"), left);
        d1.putUnitDouble(s2t("bottom"), s2t("pixelsUnit"), bottom);
        d1.putUnitDouble(s2t("right"), s2t("pixelsUnit"), right);
        d.putObject(s2t("to"), s2t("rectangle"), d1);
        executeAction(s2t("set"), d, DialogModes.NO);
    }
    this.flatten = function () {
        executeAction(s2t("flattenImage"), new ActionDescriptor(), DialogModes.NO);
    }
    this.threshold = function (level) {
        (d = new ActionDescriptor()).putInteger(s2t("level"), level);
        executeAction(s2t("thresholdClassEvent"), d, DialogModes.NO);
    }
    this.crop = function () {
        (d = new ActionDescriptor()).putBoolean(s2t("delete"), true);
        executeAction(s2t("crop"), d, DialogModes.NO);
    }
    this.saveToRAW = function (f) {
        (d = new ActionDescriptor()).putBoolean(s2t('copy'), true);
        (d1 = new ActionDescriptor()).putObject(s2t("as"), s2t("rawFormat"), d);
        d1.putPath(s2t("in"), f);
        executeAction(s2t("save"), d1, DialogModes.NO);
    }
    this.close = function (saving) {
        saving = saving ? saving : 'no';
        (d = new ActionDescriptor()).putEnumerated(s2t("saving"), s2t("yesNo"), s2t(saving));
        executeAction(s2t("close"), d, DialogModes.NO);
    }
    this.selectLayer = function (order) {
        (r = new ActionReference()).putEnumerated(s2t("layer"), s2t("ordinal"), s2t(order));
        (d = new ActionDescriptor()).putReference(s2t("null"), r);
        executeAction(s2t("select"), d, DialogModes.NO);
    }
    this.fill = function (color) {
        (d = new ActionDescriptor()).putEnumerated(s2t("using"), s2t("fillContents"), s2t(color));
        d.putEnumerated(s2t("mode"), s2t("blendMode"), s2t("normal"));
        executeAction(s2t("fill"), d, DialogModes.NO);
    }
    this.revealAll = function () {
        executeAction(s2t("revealAll"), new ActionDescriptor(), DialogModes.NO);
    }
    this.saveACopyToTIFF = function (pth) {
        (d1 = new ActionDescriptor()).putEnumerated(s2t("byteOrder"), s2t("platform"), s2t("IBMPC"));
        (d = new ActionDescriptor()).putObject(s2t("as"), s2t("TIFF"), d1);
        d.putPath(s2t("in"), pth);
        d.putBoolean(s2t("copy"), true);
        executeAction(s2t("save"), d, DialogModes.NO);
    }
    this.deleteLayer = function () {
        (r = new ActionReference()).putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
        (d = new ActionDescriptor()).putReference(s2t("null"), r);
        executeAction(s2t("delete"), d, DialogModes.NO);
    }
    this.rotate = function (angle) {
        (r = new ActionReference()).putEnumerated(s2t("layer"), s2t("ordinal"), s2t("targetEnum"));
        (d = new ActionDescriptor()).putReference(s2t("null"), r);
        d.putEnumerated(s2t("freeTransformCenterState"), s2t("quadCenterState"), s2t("QCSAverage"));
        d.putUnitDouble(s2t("angle"), s2t("angleUnit"), angle);
        d.putEnumerated(s2t("interfaceIconFrameDimmed"), s2t("interpolationType"), s2t("bicubic"));
        executeAction(s2t("transform"), d, DialogModes.NO);
    }
    this.resizeImageToWidth = function (width) {
        (d = new ActionDescriptor()).putUnitDouble(s2t("width"), s2t("pixelsUnit"), width);
        d.putBoolean(s2t("constrainProportions"), true);
        d.putEnumerated(s2t("interpolation"), s2t("interpolationType"), s2t("bicubicInterpolation"));
        executeAction(s2t("imageSize"), d, DialogModes.NO);
    }
    this.convertMode = function (mode) {
        (d = new ActionDescriptor()).putClass(s2t("to"), s2t(mode));
        d.putBoolean(s2t("merge"), false);
        d.putBoolean(s2t("rasterize"), false);
        executeAction(s2t("convertMode"), d, DialogModes.NO);
    }
    this.selectChannel = function (channel) {
        (r = new ActionReference()).putEnumerated(s2t("channel"), s2t("channel"), s2t(channel));
        (d = new ActionDescriptor()).putReference(s2t("null"), r);
        executeAction(s2t("select"), d, DialogModes.NO);
    }
    this.makeSelectionFromChannel = function (channel) {
        (r = new ActionReference()).putProperty(s2t("channel"), s2t("selection"));
        (d = new ActionDescriptor()).putReference(s2t("null"), r);
        (r1 = new ActionReference()).putEnumerated(s2t("channel"), s2t("channel"), s2t(channel));
        d.putReference(s2t("to"), r1);
        executeAction(s2t("set"), d, DialogModes.NO);
    }
    this.copyPixes = function () {
        (d = new ActionDescriptor()).putString(s2t("copyHint"), 'pixels');
        executeAction(s2t("copyEvent"), d, DialogModes.NO);
    }
    this.pastePixels = function () {
        ((d = new ActionDescriptor())).putClass(s2t("as"), s2t("pixel"));
        executeAction(s2t("paste"), d, DialogModes.NO);
    }
    this.levels = function (lo, hi) {
        (d = new ActionDescriptor()).putEnumerated(s2t("presetKind"), s2t("presetKindType"), s2t("presetKindCustom"));
        (r = new ActionReference()).putEnumerated(s2t("channel"), s2t("channel"), s2t("composite"));
        (d1 = new ActionDescriptor()).putReference(s2t("channel"), r);
        (l1 = new ActionList()).putInteger(lo);
        l1.putInteger(hi);
        d1.putList(s2t("input"), l1);
        (l = new ActionList()).putObject(s2t("levelsAdjustment"), d1);
        d.putList(s2t("adjustment"), l);
        executeAction(s2t("levels"), d, DialogModes.NO);
    }
    this.expandSelection = function (pixels) {
        (d = new ActionDescriptor()).putUnitDouble(s2t("by"), s2t("pixelsUnit"), pixels);
        d.putBoolean(s2t("selectionModifyEffectAtCanvasBounds"), false);
        executeAction(s2t("expand"), d, DialogModes.NO);
    }
    this.workPathFromSelection = function (tolerance) {
        (r = new ActionReference()).putClass(s2t("path"));
        (d = new ActionDescriptor()).putReference(s2t("null"), r);
        (r1 = new ActionReference()).putProperty(s2t("selectionClass"), s2t("selection"));
        d.putReference(s2t("from"), r1);
        d.putUnitDouble(s2t("tolerance"), s2t("pixelsUnit"), tolerance);
        executeAction(s2t("make"), d, DialogModes.NO);
    }
    this.selectionFromWorkPath = function () {
        (r = new ActionReference()).putProperty(s2t("channel"), s2t("selection"));
        (d = new ActionDescriptor()).putReference(s2t("null"), r);
        (r1 = new ActionReference()).putProperty(s2t("path"), s2t("workPath"));
        d.putReference(s2t("to"), r1);
        executeAction(s2t("set"), d, DialogModes.NO);
    }
    this.workPathFromDesc = function (desc) {
        (r = new ActionReference()).putProperty(s2t('path'), s2t('workPath'));
        (d = new ActionDescriptor()).putReference(s2t('target'), r);
        (l = new ActionList).putObject(s2t('pathComponent'), desc);
        d.putList(s2t('to'), l);
        executeAction(s2t('set'), d, DialogModes.NO);
    }
    this.delete = function () {
        (r = new ActionReference()).putEnumerated(target, s2t('ordinal'), s2t('targetEnum'));
        (d = new ActionDescriptor()).putReference(s2t("null"), r);
        executeAction(s2t("delete"), d, DialogModes.NO);
    }
    this.deselect = function () {
        (r = new ActionReference()).putProperty(s2t('channel'), s2t('selection'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        d.putEnumerated(s2t('to'), s2t('ordinal'), s2t('none'));
        executeAction(s2t('set'), d, DialogModes.NO);
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