/**Crop scans along borders without using CropAndStraighten
 * (excluding image rotation) 
 * https://community.adobe.com/t5/photoshop-ecosystem/how-to-cut-out-photos/m-p/12222294
 * https://www.youtube.com/watch?v=A1ajth43iSo
 */
#target photoshop
var lr = new AM('layer'),
    doc = new AM('document');
lr.copyToLayer(2)
lr.motionBlur(90, 2000)
lr.threshold(230)
var layerBounds = lr.descToObject(lr.getProperty('bounds')),
    objectBounds = {};
lr.selectOrdinalChannel()
lr.substractSelection(layerBounds.top, layerBounds.right / 2, layerBounds.bottom, layerBounds.right)
objectBounds.left = doc.hasProperty('selection') ? lr.descToObject(doc.getProperty('selection')).right : layerBounds.left
lr.selectOrdinalChannel()
lr.substractSelection(layerBounds.top, layerBounds.left, layerBounds.bottom, layerBounds.right / 2)
objectBounds.right = doc.hasProperty('selection') ? lr.descToObject(doc.getProperty('selection')).left : layerBounds.right
lr.deselect()
lr.deleteOrdinalLayer()
lr.motionBlur(0, 2000)
lr.threshold(230)
lr.selectOrdinalChannel()
lr.substractSelection(layerBounds.bottom / 2, layerBounds.left, layerBounds.bottom, layerBounds.right)
objectBounds.top = doc.hasProperty('selection') ? lr.descToObject(doc.getProperty('selection')).bottom : layerBounds.top
lr.selectOrdinalChannel()
lr.substractSelection(layerBounds.top, layerBounds.left, layerBounds.bottom / 2, layerBounds.right)
objectBounds.bottom = doc.hasProperty('selection') ? lr.descToObject(doc.getProperty('selection')).top : layerBounds.bottom
lr.deleteOrdinalLayer()
lr.makeSelection(objectBounds)
lr.crop()
with (objectBounds) {
    lr.substractSelection((bottom - top) * 0.015, (right - left) * 0.015, bottom - top - (bottom - top) * 0.015, (right - left) - (right - left) * 0.015)
}
lr.contentFill()
lr.deselect()
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
    this.copyToLayer = function (copies) {
        var i = copies ? copies : 1
        for (i = 0; i < copies; i++) executeAction(s2t('copyToLayer'), undefined, DialogModes.NO);
    }
    this.motionBlur = function (angle, distance) {
        (d = new ActionDescriptor()).putInteger(s2t('angle'), angle);
        d.putUnitDouble(s2t('distance'), s2t('pixelsUnit'), distance);
        executeAction(s2t('motionBlur'), d, DialogModes.NO);
    }
    this.deselect = function () {
        (r = new ActionReference()).putProperty(s2t('channel'), s2t('selection'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        d.putEnumerated(s2t('to'), s2t('ordinal'), s2t('none'));
        executeAction(s2t('set'), d, DialogModes.NO);
    }
    this.threshold = function (level) {
        (d = new ActionDescriptor()).putInteger(s2t('level'), level);
        executeAction(s2t('thresholdClassEvent'), d, DialogModes.NO);
    }
    this.selectOrdinalChannel = function () {
        (r = new ActionReference()).putProperty(s2t('channel'), s2t('selection'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        (r1 = new ActionReference()).putEnumerated(s2t('channel'), s2t('ordinal'), s2t('targetEnum'));
        d.putReference(s2t('to'), r1);
        executeAction(s2t('set'), d, DialogModes.NO);
    }
    this.substractSelection = function (top, left, bottom, right) {
        (r = new ActionReference()).putProperty(s2t('channel'), s2t('selection'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        (d1 = new ActionDescriptor()).putUnitDouble(s2t('top'), s2t('pixelsUnit'), top);
        d1.putUnitDouble(s2t('left'), s2t('pixelsUnit'), left);
        d1.putUnitDouble(s2t('bottom'), s2t('pixelsUnit'), bottom);
        d1.putUnitDouble(s2t('right'), s2t('pixelsUnit'), right);
        d.putObject(s2t('to'), s2t('rectangle'), d1);
        executeAction(s2t('subtractFrom'), d, DialogModes.NO);
    }
    this.makeSelection = function (bounds) {
        (r = new ActionReference()).putProperty(s2t('channel'), s2t('selection'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        (d1 = new ActionDescriptor()).putUnitDouble(s2t('top'), s2t('pixelsUnit'), bounds.top);
        d1.putUnitDouble(s2t('left'), s2t('pixelsUnit'), bounds.left);
        d1.putUnitDouble(s2t('bottom'), s2t('pixelsUnit'), bounds.bottom);
        d1.putUnitDouble(s2t('right'), s2t('pixelsUnit'), bounds.right);
        d.putObject(s2t('to'), s2t('rectangle'), d1);
        executeAction(s2t('set'), d, DialogModes.NO);
    }
    this.deleteOrdinalLayer = function () {
        (r = new ActionReference()).putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        executeAction(s2t('delete'), d, DialogModes.NO);
    }
    this.crop = function () {
        try {
            (d = new ActionDescriptor()).putBoolean(s2t('delete'), true);
            executeAction(s2t('crop'), d, DialogModes.NO);
        } catch (e) { }
    }
    this.contentFill = function () {
        (d = new ActionDescriptor()).putEnumerated(s2t('cafSamplingRegion'), s2t('cafSamplingRegion'), s2t('cafSamplingRegionAuto'));
        d.putBoolean(s2t('cafSampleAllLayers'), false);
        d.putEnumerated(s2t('cafColorAdaptationLevel'), s2t('cafColorAdaptationLevel'), s2t('cafColorAdaptationDefault'));
        d.putEnumerated(s2t('cafRotationAmount'), s2t('cafRotationAmount'), s2t('cafRotationAmountNone'));
        d.putBoolean(s2t('cafScale'), false);
        d.putBoolean(s2t('cafMirror'), false);
        d.putEnumerated(s2t('cafOutput'), s2t('cafOutput'), s2t('cafOutputToCurrentLayer'));
        executeAction(s2t('cafWorkspace'), d, DialogModes.NO);
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
