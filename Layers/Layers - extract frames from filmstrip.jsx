/**
 * Straighten multiple layers inside photoshop 
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/straighten-multiple-layers-inside-photoshop/m-p/15429999#M875741
 */
const BORDER_RIGHT_GAIN = 5,
    BORDER_LEFT_GAIN = 10,
    BORDER_THRESHOLD = 100,
    FRAME_OVERLAP = 0.8,
    PERFORATION_GAIN = 20,
    PERFORATION_OFFSET = 0.22,
    PERFORATION_THRESHOLD = 165,
    BORDER_OFFSET = 0.03;
var apl = new AM('application'),
    doc = new AM('document'),
    lr = new AM('layer');
try {
    if (apl.getProperty('numberOfDocuments')) activeDocument.suspendHistory('Save Frames', 'main()')
}
catch (e) { alert('An error has occurred! Too many things can go wrong') }
function main() {
    var hst = activeDocument.activeHistoryState;
    var bounds = getObjectBounds(BORDER_THRESHOLD);
    doc.makeSelection(bounds[0], bounds[1], bounds[2], bounds[3]);
    doc.crop()
    lr.duplicateLayer()
    lr.convertToSmartObject()
    lr.rotate(bounds[4])
    lr.revealAll();
    lr.selectLayer('backwardEnum')
    lr.fill('white')
    lr.selectLayer('forwardEnum')
    lr.flatten();
    var bounds = getObjectBounds(BORDER_THRESHOLD);
    doc.makeSelection(bounds[0], bounds[1], bounds[2], bounds[3]);
    doc.crop();
    var result = getFramesDimensions(PERFORATION_THRESHOLD);
    var docRes = doc.getProperty('resolution'),
        docW = doc.getProperty('width') * docRes / 72,
        docH = doc.getProperty('height') * docRes / 72,
        height = 0,
        title = doc.getProperty('title').replace(/\..+$/, ''),
        pth = doc.getProperty('fileReference').path;
    for (var i = 0; i < result.length - 2; i++) { height += result[i + 1][0] - result[i][0] }
    height += result[result.length - 1][0] - result[result.length - 2][0];
    height = height / (result.length - 1);
    var offset = (result[result.length - 1][0] + result[result.length - 1][1] / 2 + height) - docH,
        i = result.length - 1;
    if (offset < height - (height * FRAME_OVERLAP)) {
        doc.resizeCanvas(offset, 'top')
        var top = result[i][0] + result[i][1] / 2;
        doc.makeSelection(top, 0, top + height, docW)
        saveLayer(new File(pth + '/' + title + '_' + (0)))
    }
    for (i--; i >= 0; i--) {
        var top = result[i][0] + result[i][1] / 2;
        doc.makeSelection(top, 0, top + height, docW)
        saveLayer(new File(pth + '/' + title + '_' + (result.length - 1 - i)))
    }
    var offset = ((result[0][0] + result[0][1] / 2) - height);
    if (-offset < height - (height * FRAME_OVERLAP)) {
        doc.resizeCanvas(offset, 'bottomEnum')
        doc.makeSelection(0, 0, height, docW)
        saveLayer(new File(pth + '/' + title + '_' + (result.length - 1 - i)))
    }
    activeDocument.activeHistoryState = hst;
    return;
    function getObjectBounds(threshold) {
        var docRes = doc.getProperty('resolution'),
            docW = doc.getProperty('width') * docRes / 72,
            docH = doc.getProperty('height') * docRes / 72,
            hst = isolateLayer(threshold),
            line1 = getX(Math.ceil(docH * (BORDER_OFFSET)), hst),
            line2 = getX(Math.ceil(docH * (1 - BORDER_OFFSET)), hst);
        doc.close();
        doc.deleteLayer();
        return [0, Math.min(line1[0], line2[0]), docH, Math.max(line1[1], line2[1]), Math.atan2(line2[0] - line1[0], docH * (1 - BORDER_OFFSET) - docH * (BORDER_OFFSET)) * 180 / Math.PI]
        function getX(top, historyBackup) {
            lr.makeSelection(top, 0, top + 1, docW);
            doc.crop();
            var f = new File(Folder.temp + '/colors.raw');
            doc.saveToRAW(f)
            activeDocument.activeHistoryState = historyBackup;
            var colors = readStrip(f);
            f.remove();
            return [findCoordinate(colors, BORDER_LEFT_GAIN), docW - findCoordinate(colors.reverse(), BORDER_RIGHT_GAIN)];
        }
    }
    function getFramesDimensions(threshold) {
        var docRes = doc.getProperty('resolution'),
            docW = doc.getProperty('width') * docRes / 72,
            docH = doc.getProperty('height') * docRes / 72,
            hst = isolateLayer(threshold),
            sel = Math.ceil(docW * (PERFORATION_OFFSET));
        lr.makeSelection(0, sel, docH, sel + 1)
        doc.crop();
        var f = new File(Folder.temp + '/colors.raw');
        doc.saveToRAW(f)
        var colors = readStrip(f);
        f.remove();
        doc.close();
        lr.deleteLayer();
        return findPerforation(colors, PERFORATION_GAIN);
    }
    function isolateLayer(threshold) {
        lr.flatten();
        lr.duplicateLayer();
        lr.convertToSmartObject();
        lr.editSmartObject();
        lr.threshold(threshold);
        lr.convertToGrayscale();
        return activeDocument.activeHistoryState
    }
    function saveLayer(f) {
        lr.duplicateLayer()
        lr.convertToSmartObject()
        lr.editSmartObject();
        doc.saveACopyToTGA(24, f)
        doc.close()
        doc.deleteLayer()
    }
}
function readStrip(f) {
    var content = '';
    if (f.exists) {
        f.open('r');
        f.encoding = "BINARY";
        content = f.read();
        f.close();
        f.remove();
        var colors = function (s) {
            var m = 0, c = [];
            for (var i = 0; i < s.length; i++) {
                var k = s.charCodeAt(i); m += k; c.push(k)
            };
            return c
        }(content);
        return colors;
    }
}
function findCoordinate(s, threshold) {
    for (var i = 0; i < s.length; i++) {
        if (s[i] > 128) continue;
        if (readWithOffset(s.slice(i), threshold)) return i
    }
    return -1
    function readWithOffset(s, threshold) {
        for (var i = 0; i < s.length; i++) {
            if (i > threshold) return true
            if (s[i] > 128) return false;
        }
    }
}
function findPerforation(s, threshold) {
    s.reverse()
    for (var i = 0; i < s.length; i++) {
        if (s[i] > 128) { s[i] = 0; continue; }
        if (s[i] < 128) break;
    }
    s.reverse()
    for (var i = 0; i < s.length; i++) {
        if (s[i] > 128) continue;
        if (s[i] < 128) break;
    }
    var objects = [];
    for (var i; i < s.length; i++) {
        if (s[i] < 128) continue;
        var result = readWithOffset(s.slice(i));
        if (result > threshold) {
            i = i + result;
            objects.push([i - (result + 1), result])
        }
    }
    return objects
    function readWithOffset(s) {
        for (var i = 0; i < s.length; i++) {
            if (s[i] < 128) return i;
        }
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
    this.duplicateLayer = function () {
        executeAction(s2t("copyToLayer"), undefined, DialogModes.NO);
    }
    this.convertToSmartObject = function () {
        executeAction(s2t("newPlacedLayer"), undefined, DialogModes.NO);
    }
    this.editSmartObject = function () {
        executeAction(s2t("placedLayerEditContents"), new ActionDescriptor(), DialogModes.NO);
    }
    this.convertToGrayscale = function () {
        (d = new ActionDescriptor()).putClass(s2t("to"), s2t("grayscaleMode"));
        executeAction(s2t("convertMode"), d, DialogModes.NO);
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
    this.resizeCanvas = function (height, order) {
        (d = new ActionDescriptor()).putBoolean(s2t("relative"), true);
        d.putUnitDouble(s2t("height"), s2t("pixelsUnit"), height);
        d.putEnumerated(s2t("vertical"), s2t("verticalLocation"), s2t(order));
        d.putEnumerated(s2t("canvasExtensionColorType"), s2t("canvasExtensionColorType"), s2t("white"));
        executeAction(s2t("canvasSize"), d, DialogModes.NO);
    }
    this.saveACopyToTGA = function (bitDepth, pth) {
        (d1 = new ActionDescriptor()).putInteger(s2t("bitDepth"), bitDepth);
        (d = new ActionDescriptor()).putObject(s2t("as"), s2t("targaFormat"), d1);
        d.putPath(s2t("in"), pth);
        d.putBoolean(s2t("copy"), true);
        d.putEnumerated(s2t("saveStage"), s2t("saveStageType"), s2t("saveSucceeded"));
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