/** Shuffle layers positions
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/shuffle-layers-positions/td-p/13148352
 * https://www.youtube.com/watch?v=ekZlKqB_Qs4
 */
#target photoshop
activeDocument.suspendHistory('Shuffle layers', 'shuffleLayers()');
function shuffleLayers() {
    var doc = new AM('document'),
        lr = new AM('layer');
    if (!doc.hasProperty('selection')) {
        var selectedLayers = doc.getProperty('targetLayersIDs'),
            layers = [];
        for (var i = 0; i < selectedLayers.count; i++) {
            var id = selectedLayers.getReference(i).getIdentifier(),
                bounds = lr.descToObject(lr.getProperty('bounds', id).value);
            layers.push({ id: id, center: { x: bounds.left + (bounds.right - bounds.left) / 2, y: bounds.top + (bounds.bottom - bounds.top) / 2 } });
        }
    }
    do {
        var source = layers.shift(),
            len = layers.length;
        if (!len) break;
        var target = layers.splice((Math.random() * (len - 1)) | 0, 1).shift();
        lr.selectLayers([source.id])
        lr.move(source, target, false)
        lr.selectLayers([target.id])
        lr.move(target, source, true)
        if (layers.length == 1) layers.push(target);
    } while (true)
    var layers = [];
    for (var i = 0; i < selectedLayers.count; i++) layers.push(selectedLayers.getReference(i).getIdentifier());
    lr.selectLayers(layers)
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
    this.descToObject = function (d) {
        var o = {}
        for (var i = 0; i < d.count; i++) {
            var k = d.getKey(i)
            o[t2s(k)] = getDescValue(d, k)
        }
        return o
    }
    this.selectLayers = function (list) {
        var r = new ActionReference();
        do { r.putIdentifier(s2t('layer'), list.shift()) } while (list.length);
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        executeAction(s2t('select'), d, DialogModes.NO);
    }
    this.move = function (source, target, updateCenter) {
        (r = new ActionReference()).putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        (d1 = new ActionDescriptor()).putUnitDouble(s2t('horizontal'), s2t('pixelsUnit'), target.center.x - source.center.x);
        d1.putUnitDouble(s2t('vertical'), s2t('pixelsUnit'), target.center.y - source.center.y);
        d.putObject(s2t('to'), s2t('offset'), d1);
        executeAction(s2t('move'), d, DialogModes.NO);
        if (updateCenter) {
            source.center.x += target.center.x - source.center.x
            source.center.y += target.center.y - source.center.y
        }
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