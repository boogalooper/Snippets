/**
 * Is it possible to use scripting to align layers to layers with the same outline?
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/is-it-possible-to-use-scripting-to-align-layers-to-layers-with-the-same-outline/td-p/15433652
 * https://youtu.be/8w7JdlMrWx4
 */
#target photoshop
const EXPAND_BY = 20, // expand selection from the opacity mask to minimize errors when separating objects
    WXHAccuracy = 100, // multiplier for converting WxH to integer (affects rounding accuracy)
    WXHTolerance = 1, // deviation from the proportion value, below which objects are still compared
    SCALE = 0.15;
var apl = new AM('application'),
    doc = new AM('document'),
    lr = new AM('layer'),
    pth = new AM('path');
if (apl.getProperty('numberOfDocuments')) {
    lr.selectLayer(id)
    lr.selectTransparency();
    lr.expandSelection(EXPAND_BY * SCALE);
    pth.workPathFromSelection(1);
    var pathComponents = (pth.getProperty('pathContents')).getList(stringIDToTypeID('pathComponents'));
    if (pathComponents.count > 1) {
        for (var i = pathComponents.count - 1; i >= 0; i--) {
            changeProgressText('Step 1/3: Split gray shapes to layers ' + Math.round((pathComponents.count - 1 - i) / (pathComponents.count - 1) * 100) + '%')
            pth.workPathFromDesc(pathComponents.getObjectValue(i));
            pth.selectionFromWorkPath();
            lr.selectLayer(id)
            if (lr.layerViaCut()) { result.push(describeLayer(lr.getProperty('layerID'))) }
        }
        pth.delete();
    } else { result.push(describeLayer(id)) }
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
    this.selectLayer = function (id, mode) {
        (r = new ActionReference()).putIdentifier(s2t('layer'), id);
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        d.putBoolean(s2t('makeVisible'), mode ? mode : false)
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
    this.removeSelection = function () {
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
    this.merge = function () {
        executeAction(s2t("mergeLayers"), new ActionDescriptor(), DialogModes.NO);
    }
    this.delete = function (id) {
        var r = new ActionReference();
        if (id) r.putIdentifier(target, id) else r.putEnumerated(target, s2t('ordinal'), s2t('targetEnum'));
        (d = new ActionDescriptor()).putReference(s2t("null"), r);
        executeAction(s2t("delete"), d, DialogModes.NO);
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
    this.transform = function (transform, dX, dY) {
        (r = new ActionReference()).putEnumerated(s2t("layer"), s2t("ordinal"), s2t("targetEnum"));
        (d = new ActionDescriptor()).putReference(s2t("null"), r);
        if (dX != undefined) {
            d.putEnumerated(s2t("freeTransformCenterState"), s2t("quadCenterState"), s2t("QCSIndependent"));
            (d1 = new ActionDescriptor()).putUnitDouble(s2t("horizontal"), s2t("pixelsUnit"), dX);
            d1.putUnitDouble(s2t("vertical"), s2t("pixelsUnit"), dY);
            d.putObject(s2t("position"), charIDToTypeID("Pnt "), d1);
            (d2 = new ActionDescriptor()).putUnitDouble(s2t("horizontal"), s2t("pixelsUnit"), 0);
            d2.putUnitDouble(s2t("vertical"), s2t("pixelsUnit"), 0);
            d.putObject(s2t("offset"), s2t("offset"), d2);
        } else {
            d.putEnumerated(s2t("freeTransformCenterState"), s2t("quadCenterState"), s2t("QCSAverage"));
        }
        d.putUnitDouble(s2t("width"), s2t("percentUnit"), transform[0]);
        d.putUnitDouble(s2t("height"), s2t("percentUnit"), transform[1]);
        d.putBoolean(s2t("linked"), true);
        d.putEnumerated(s2t("interpolation"), s2t("interpolationType"), s2t("bicubic"));
        executeAction(s2t("transform"), d, DialogModes.NO);
    }
    this.setScale = function (width) {
        (d = new ActionDescriptor()).putUnitDouble(s2t("width"), s2t("percentUnit"), width);
        d.putBoolean(s2t("scaleStyles"), true);
        d.putBoolean(s2t("constrainProportions"), true);
        d.putEnumerated(s2t("interpolation"), s2t("interpolationType"), s2t("bicubicSharper"));
        executeAction(s2t("imageSize"), d, DialogModes.NO);
    }
    this.setGlobalFxState = function (layerFXVisible) {
        (r = new ActionReference()).putProperty(s2t("property"), s2t("layerFXVisible"));
        r.putEnumerated(s2t("document"), s2t("ordinal"), s2t("targetEnum"));
        (d = new ActionDescriptor()).putReference(s2t("null"), r);
        (d1 = new ActionDescriptor()).putBoolean(s2t("layerFXVisible"), layerFXVisible);
        d.putObject(s2t("to"), s2t("layerFXVisible"), d1);
        executeAction(s2t("set"), d, DialogModes.NO);
    }
    this.setVisiblity = function (id, mode) {
        (r = new ActionReference()).putIdentifier(s2t('layer'), id);
        (d = new ActionDescriptor()).putReference(s2t('target'), r);
        executeAction(s2t(mode), d, DialogModes.NO);
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