/**
 * Is it possible to use scripting to align layers to layers with the same outline? 
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/is-it-possible-to-use-scripting-to-align-layers-to-layers-with-the-same-outline/td-p/15433652
 */
#target photoshop
const GRAY_TOLERANCE = 5, // max color difference between CMY or RGB to detect gray layers
    EXPAND_BY = 20; // expand selection from the opacity mask to minimize errors when separating objects
var apl = new AM('application'),
    doc = new AM('document'),
    lr = new AM('layer'),
    ch = new AM('channel'),
    pth = new AM('path');
if (apl.getProperty('numberOfDocuments')) {
    var hst = activeDocument.activeHistoryState,
        layers = [];
    try {
        activeDocument.suspendHistory('Check layers', 'a()');
        activeDocument.activeHistoryState = hst;
        if (layers.frames.length == layers.objects.length) activeDocument.suspendHistory('Align layers', 'b()');
    } catch (e) { activeDocument.activeHistoryState = hst; alert(e) }
    function a() {
        layers = findPixelLayers();
        if (layers.frames.length) {
            layers.frames = grayFramesToLayers(layers.frames);
            if (layers.frames.length == layers.objects.length) {
                for (var i = 0; i < layers.objects.length; i++) layers.objects[i] = describeLayer(layers.objects[i].id);
            } else throw new Error('The number of gray shapes found does not match the number of objects found!\nMake sure that the layers do not overlap each other')
        } else throw new Error('No shape layers found!\nUse only pixel layers')
    }
    function b() {
        var result = alignLayers(layers.frames, layers.objects);
        for (var i = 0; i < result.length; i++) lr.transform(checkOrientation(result[i]));
    }
}
function findPixelLayers() {
    var offset = doc.getProperty('hasBackgroundLayer') ? 0 : 1,
        len = doc.getProperty('numberOfLayers'),
        layers = [];
    for (var i = offset; i <= len; i++) {
        if (lr.getProperty('layerKind', i, true) == 1) {
            lr.selectLayer(i, true)
            lr.selectTransparency();
            layers.push({
                id: lr.getProperty('layerID', i, true),
                color: getAverageColor([ch.getProperty('histogram', 1, true), ch.getProperty('histogram', 2, true), ch.getProperty('histogram', 3, true)])
            })
        }
    }
    var result = {};
    result.frames = [];
    result.objects = [];
    for (var a in layers) if (isGray(layers[a].color)) result.frames.push(layers[a]) else result.objects.push(layers[a]);
    return result;
}
function alignLayers(a, b) {
    var result = [];
    do {
        var cur = b.shift();
        lr.selectLayer(cur.id)
        for (var i = 0; i < a.length; i++) {
            if (cur.center[0] > a[i].bounds.left && cur.center[0] < a[i].bounds.right) {
                lr.move(a[i].center[0] - cur.center[0], a[i].center[1] - cur.center[1])
                result.push({ id: cur.id, bounds: a[i].bounds })
            }
        }
    } while (b.length)
    return result;
}
function checkOrientation(o) {
    lr.selectLayer(o.id)
    lr.setBlendingMode('subtract')
    doc.makeSelection(o.bounds)
    var a = getAverageColor([doc.getProperty('histogram')])
    lr.deselect()
    lr.transform(-100)
    doc.makeSelection(o.bounds)
    var b = getAverageColor([doc.getProperty('histogram')])
    lr.transform(-100)
    lr.setBlendingMode('normal')
    lr.deselect();
    return a >= b ? 100 : -100
}
function grayFramesToLayers(l) {
    var result = [];
    for (var a in l) isolateLayers(l[a].id, lr.getProperty('name', l[a].id), result)
    return result;
    function isolateLayers(id, title, result) {
        lr.selectLayer(id)
        lr.selectTransparency();
        lr.expandSelection(EXPAND_BY);
        pth.workPathFromSelection(1);
        var pathComponents = (pth.getProperty('pathContents')).getList(stringIDToTypeID('pathComponents'));
        if (pathComponents.count > 1) {
            for (var i = pathComponents.count - 1; i >= 0; i--) {
                pth.workPathFromDesc(pathComponents.getObjectValue(i));
                pth.selectionFromWorkPath();
                lr.selectLayer(id)
                if (lr.layerViaCut()) {
                    lr.setLayerName(title + ' - ' + (i + 1))
                    result.push(describeLayer(lr.getProperty('layerID')))
                }
            }
            doc.deselect();
            pth.delete();
            lr.selectLayer(id);
            lr.delete();
        } else { result.push(describeLayer(id)) }
    }
}
function describeLayer(id) {
    var o = {},
        bounds = lr.descToObject(lr.getProperty('bounds', id));
    o.id = id;
    o.width = bounds.right - bounds.left
    o.heigth = bounds.bottom - bounds.top
    o.bounds = bounds
    o.center = [bounds.left + o.width / 2, bounds.top + o.heigth / 2]
    return o
}
function getAverageColor(h) {
    var median = [];
    for (var i = 0; i < h.length; i++) {
        var n = p = 0,
            cur = h[i];
        for (var x = 0; x < cur.count; x++) {
            n += cur.getInteger(x)
            p += cur.getInteger(x) * x
        }
        median.push(Math.round(p / n))
    }
    return median
}
function isGray(c) {
    var sum = 0;
    for (var i = 0; i < c.length; i++)  sum += c[i];
    sum = sum / c.length;
    for (var i = 0; i < c.length; i++) if (Math.abs(c[i] - sum) > GRAY_TOLERANCE) return false;
    return true
}
function AM(target) {
    var s2t = stringIDToTypeID,
        t2s = typeIDToStringID;
    target = s2t(target)
    this.getProperty = function (property, id, idxMode) {
        property = s2t(property);
        (r = new ActionReference()).putProperty(s2t('property'), property);
        id ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id))
            : r.putEnumerated(target, s2t('ordinal'), s2t('targetEnum'));
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
        var o = {};
        for (var i = 0; i < d.count; i++) {
            var k = d.getKey(i)
            o[t2s(k)] = getDescValue(d, k)
        }
        return o
    }
    this.selectLayer = function (id, idxMode) {
        var r = new ActionReference();
        idxMode ? r.putIndex(s2t('layer'), id) : r.putIdentifier(s2t('layer'), id);
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        executeAction(s2t('select'), d, DialogModes.NO);
    }
    this.selectTransparency = function () {
        (r = new ActionReference()).putProperty(s2t('channel'), s2t('selection'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        r1 = new ActionReference();
        r1.putEnumerated(s2t('channel'), s2t('channel'), s2t('transparencyEnum'));
        d.putReference(s2t('to'), r1);
        executeAction(s2t('set'), d, DialogModes.NO);
    }
    this.layerViaCut = function () {
        try {
            executeAction(s2t("copyToLayer"), d, DialogModes.NO);
        } catch (e) { return false }
        return true;
    }
    this.expandSelection = function (pixels) {
        (d = new ActionDescriptor()).putUnitDouble(s2t("by"), s2t("pixelsUnit"), pixels);
        d.putBoolean(s2t("selectionModifyEffectAtCanvasBounds"), false);
        executeAction(s2t("expand"), d, DialogModes.NO);
    }
    this.deselect = function () {
        (r = new ActionReference()).putProperty(s2t('channel'), s2t('selection'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        d.putEnumerated(s2t('to'), s2t('ordinal'), s2t('none'));
        executeAction(s2t('set'), d, DialogModes.NO);
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
    this.setLayerName = function (title) {
        (r = new ActionReference()).putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
        (d = new ActionDescriptor()).putReference(s2t('target'), r);
        (d1 = new ActionDescriptor()).putString(s2t('name'), title);
        d.putObject(s2t('to'), s2t('layer'), d1);
        executeAction(s2t('set'), d, DialogModes.NO);
    }
    this.move = function (dX, dY) {
        (r = new ActionReference()).putEnumerated(s2t("layer"), s2t("ordinal"), s2t("targetEnum"));
        (d = new ActionDescriptor()).putReference(s2t("null"), r);
        (d1 = new ActionDescriptor()).putUnitDouble(s2t("horizontal"), s2t("pixelsUnit"), dX);
        d1.putUnitDouble(s2t("vertical"), s2t("pixelsUnit"), dY);
        d.putObject(s2t("to"), s2t("offset"), d1);
        executeAction(s2t("move"), d, DialogModes.NO);
    }
    this.setBlendingMode = function (mode) {
        (r = new ActionReference()).putEnumerated(s2t("layer"), s2t("ordinal"), s2t("targetEnum"));
        (d = new ActionDescriptor()).putReference(s2t("null"), r);
        (d1 = new ActionDescriptor()).putEnumerated(s2t("mode"), s2t("blendMode"), s2t(mode));
        d.putObject(s2t("to"), s2t("layer"), d1);
        executeAction(s2t("set"), d, DialogModes.NO);
    }
    this.makeSelection = function (bounds) {
        (r = new ActionReference()).putProperty(s2t("channel"), s2t("selection"));
        (d = new ActionDescriptor()).putReference(s2t("null"), r);
        (d1 = new ActionDescriptor()).putUnitDouble(s2t("top"), s2t("pixelsUnit"), bounds.top);
        d1.putUnitDouble(s2t("left"), s2t("pixelsUnit"), bounds.left);
        d1.putUnitDouble(s2t("bottom"), s2t("pixelsUnit"), bounds.bottom);
        d1.putUnitDouble(s2t("right"), s2t("pixelsUnit"), bounds.right);
        d.putObject(s2t("to"), s2t("rectangle"), d1);
        executeAction(s2t("set"), d, DialogModes.NO);
    }
    this.transform = function (vertical) {
        (r = new ActionReference()).putEnumerated(s2t("layer"), s2t("ordinal"), s2t("targetEnum"));
        (d = new ActionDescriptor()).putReference(s2t("null"), r);
        d.putEnumerated(s2t("freeTransformCenterState"), s2t("quadCenterState"), s2t("QCSAverage"));
        d.putUnitDouble(s2t("height"), s2t("percentUnit"), vertical);
        d.putEnumerated(s2t("interpolation"), s2t("interpolationType"), s2t("bicubic"));
        executeAction(s2t("transform"), d, DialogModes.NO);
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
            case DescValueType.ENUMERATEDTYPE: return t2s(d.getEnumerationValue(p));
            default: break;
        };
    }
}