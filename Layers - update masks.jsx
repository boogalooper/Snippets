/**Script that updates (Copy/Paste) masks on multiple layers
 * https://community.adobe.com/t5/photoshop-ecosystem/script-that-updates-copy-paste-masks-on-multiple-layers/m-p/12314515
 */
#target photoshop
var doc = new AM('document'),
    lr = new AM('layer'),
    indexFrom = doc.getProperty('hasBackgroundLayer') ? 0 : 1,
    indexTo = doc.getProperty('numberOfLayers'),
    layers = [],
    masks = [];
for (var i = indexFrom; i <= indexTo; i++) {
    if (lr.getProperty('layerSection', i, true).value == 'layerSectionEnd') continue;
    var nm = lr.getProperty('name', i, true),
        layerKind = lr.getProperty('layerKind', i, true),
        id = lr.getProperty('layerID', i, true)
    if (nm.match(/__Mask_/i) && layerKind == 1) masks.push({ name: nm.replace(/mask/i, '').replace(/_+/g, ' ').replace(/^ /, ''), id: id })
    else if (layerKind == 7) layers.push({ name: nm.replace(/\W+/g, ' ').replace(/^ /g, ''), id: id })
}
do {
    var cur = masks.shift();
    for (var i = 0; i < layers.length; i++) {
        var r = new RegExp(layers[i].name, 'i')
        if (cur.name.match(r)) {
            if (lr.getProperty('hasUserMask', layers[i].id)) {
                lr.selectLayer(layers[i].id)
                lr.removeChannel()
            }
            lr.selectLayer(cur.id)
            lr.selectPixels('allEnum')
            lr.copyPixels()
            lr.selectLayer(layers[i].id)
            lr.makeMask()
            lr.selectMaskChannel()
            lr.pastePixels()
            lr.selectRGBChannel()
            lr.selectPixels('none')
            continue;
        }
    }
} while (masks.length)
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
    this.removeChannel = function () {
        (r = new ActionReference()).putEnumerated(s2t('channel'), s2t('channel'), s2t('mask'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        executeAction(s2t('delete'), d, DialogModes.NO);
    }
    this.selectRGBChannel = function () {
        (r = new ActionReference()).putEnumerated(s2t('channel'), s2t('channel'), s2t('RGB'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        executeAction(s2t('select'), d, DialogModes.NO);
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
    this.selectMaskChannel = function () {
        (r = new ActionReference()).putEnumerated(s2t('channel'), s2t('ordinal'), s2t('targetEnum'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        d.putBoolean(s2t('makeVisible'), true)
        executeAction(s2t('select'), d, DialogModes.NO);
    }
    this.pastePixels = function () {
        (d = new ActionDescriptor()).putEnumerated(s2t('antiAlias'), s2t('antiAliasType'), s2t('antiAliasNone'));
        d.putClass(s2t('as'), s2t('pixel'));
        executeAction(s2t('paste'), d, DialogModes.NO);
    }
    this.selectLayer = function (id, makeVisible) {
        (r = new ActionReference()).putIdentifier(s2t('layer'), id);
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        executeAction(s2t('select'), d, DialogModes.NO);
    }
    this.makeMask = function () {
        (d = new ActionDescriptor()).putClass(s2t('new'), s2t('channel'));
        (r = new ActionReference()).putEnumerated(s2t('channel'), s2t('channel'), s2t('mask'));
        d.putReference(s2t('at'), r);
        d.putEnumerated(s2t('using'), s2t('userMask'), s2t('revealSelection'));
        executeAction(s2t('make'), d, DialogModes.NO);
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