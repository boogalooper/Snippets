/**
 * Script to move each selected area to new layer 
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/script-to-move-each-selected-area-to-new-layer/td-p/13674714
 */

#target photoshop
activeDocument.suspendHistory('Divide by selection', 'main()')

function main() {
    var doc = new AM('document'),
        lr = new AM('layer'),
        pth = new AM('path'),
        targetLayer = lr.getProperty('layerID');

    if (doc.hasProperty('selection')) lr.makePathFromSelection(2);

    if (doc.getProperty('numberOfPaths')) {
        var pathContents = pth.getProperty('pathContents').value.getList(stringIDToTypeID('pathComponents'))
        for (var i = 0; i < pathContents.count; i++) {
            pth.makePathFromSubpath(pathContents.getObjectValue(i))
            pth.makeSelectionFromPath()
            lr.select(targetLayer);
            lr.cutToLayer();
        }
        lr.select(targetLayer)
        lr.clearSelection()
        pth.delete()
    }
}

function AM(target, order) {
    var s2t = stringIDToTypeID,
        t2s = typeIDToStringID;
    target = target ? s2t(target) : null;
    this.getProperty = function (property, id, idxMode) {
        property = s2t(property);
        (r = new ActionReference()).putProperty(s2t('property'), property);
        id != undefined ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id)) :
            r.putEnumerated(target, s2t('ordinal'), order ? s2t(order) : s2t('targetEnum'));
        return getDescValue(executeActionGet(r), property)
    }
    this.hasProperty = function (property, id, idxMode) {
        property = s2t(property);
        (r = new ActionReference()).putProperty(s2t('property'), property);
        id ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id))
            : r.putEnumerated(target, s2t('ordinal'), order ? s2t(order) : s2t('targetEnum'));
        return executeActionGet(r).hasKey(property)
    }
    this.select = function (id) {
        var r = new ActionReference();
        if (typeof id == 'number') r.putIdentifier(target, id) else r.putName(target, id);
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        executeAction(s2t('select'), d, DialogModes.NO);
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
    this.makePathFromSelection = function (tolerance) {
        tolerance = tolerance ? tolerance : 10;
        (r = new ActionReference()).putClass(s2t('path'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        (r1 = new ActionReference()).putProperty(s2t('selectionClass'), s2t('selection'));
        d.putReference(s2t('from'), r1);
        d.putUnitDouble(s2t('tolerance'), s2t('pixelsUnit'), tolerance);
        executeAction(s2t('make'), d, DialogModes.NO);
    }
    this.makePathFromSubpath = function (pth) {
        (r = new ActionReference()).putProperty(stringIDToTypeID("path"), stringIDToTypeID("workPath"));
        (d = new ActionDescriptor()).putReference(stringIDToTypeID("null"), r);
        (l = new ActionList()).putObject(stringIDToTypeID("pathComponent"), pth);
        d.putList(stringIDToTypeID("to"), l);
        executeAction(stringIDToTypeID("set"), d, DialogModes.NO);
    }
    this.clearSelection = function () {
        (r = new ActionReference()).putProperty(s2t('channel'), s2t('selection'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        d.putEnumerated(s2t('to'), s2t('ordinal'), s2t('none'));
        executeAction(s2t('set'), d, DialogModes.NO);
    }
    this.delete = function (name) {
        var r = new ActionReference();
        if (name) r.putName(target, name) else r.putEnumerated(target, s2t('ordinal'), s2t('targetEnum'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        executeAction(s2t('delete'), d, DialogModes.NO);
    }
    this.cutToLayer = function () {
        executeAction(s2t('cutToLayer'), undefined, DialogModes.NO);
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