/**Dynamicly calculating/updating masks through scripting
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/dynamicly-calculating-updating-masks-through-scripting/m-p/12441295
 */
#target photoshop
var lrs = getLayersCollection(),
    doc = new AM('document'),
    layers = [],
    masks = [],
    targetLayers = doc.getProperty('targetLayersIDs');
for (var i = 0; i < lrs.length; i++) {
    if (lrs[i].name.match(/mask/i)) {
        if (lrs[i].layerKind == 7) masks.push(lrs[i]) else layers.push(lrs[i])
    }
}
var lr = new AM('layer'),
    restoreSelection = [];
do {
    var cur = masks.shift();
    for (var i = 0; i < layers.length; i++) {
        if (layers[i].name.match(new RegExp(cur.name, 'i'))) {
            lr.selectLayerByIDList([cur.layerID])
            lr.duplicate()
            lr.merge()
            lr.threshold(2)
            lr.selectPixels('allEnum')
            lr.copyPixels()
            lr.delete()
            lr.selectLayerByIDList([layers[i].layerID])
            var mask = new AM('channel');
            try {
                mask.selectMaskChannel()
                mask.delete()
            } catch (e) { }
            lr.makeMask()
            mask.selectMaskChannel()
            lr.pastePixels()
            lr.selectRGBChannel()
            lr.selectPixels('none')
        }
    }
} while (masks.length)
for (var i = 0; i < targetLayers.count; i++) {
    restoreSelection.push(targetLayers.getReference(i).getIdentifier(stringIDToTypeID('layerID')))
}
lr.selectLayerByIDList(restoreSelection)
function getLayersCollection() {
    var doc = new AM('document'),
        lr = new AM('layer'),
        indexFrom = doc.getProperty('hasBackgroundLayer') ? 0 : 1,
        indexTo = doc.getProperty('numberOfLayers');
    return layersCollection(indexFrom, indexTo)
    function layersCollection(from, to, parentItem, group) {
        parentItem = parentItem ? parentItem : [];
        for (var i = from; i <= to; i++) {
            if (lr.getProperty('layerSection', i, true).value == 'layerSectionEnd') {
                i = layersCollection(i + 1, to, [], parentItem)
                continue;
            }
            var properties = {};
            properties.name = lr.getProperty('name', i, true)
            properties.layerID = lr.getProperty('layerID', i, true)
            properties.layerKind = lr.getProperty('layerKind', i, true)
            properties.visible = lr.getProperty('visible', i, true)
            if (lr.getProperty('layerSection', i, true).value == 'layerSectionStart') {
                for (o in properties) { parentItem[o] = properties[o] }
                group.push(parentItem);
                return i;
            } else {
                parentItem.push(properties)
            }
        }
        return parentItem
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
    this.duplicate = function () {
        (r = new ActionReference()).putEnumerated(s2t("layer"), s2t("ordinal"), s2t("targetEnum"));
        (d = new ActionDescriptor()).putReference(s2t("target"), r);
        executeAction(s2t("duplicate"), d, DialogModes.NO);
    }
    this.threshold = function (level) {
        (d = new ActionDescriptor()).putInteger(s2t('level'), level);
        executeAction(s2t('thresholdClassEvent'), d, DialogModes.NO);
    }
    this.merge = function () {
        executeAction(s2t("mergeLayers"), undefined, DialogModes.NO);
    }
    this.selectPixels = function (type) {
        (r = new ActionReference()).putProperty(s2t('channel'), s2t('selection'));
        (d = new ActionDescriptor()).putReference(s2t('target'), r);
        d.putEnumerated(s2t('to'), s2t('ordinal'), s2t(type));
        executeAction(s2t('set'), d, DialogModes.NO);
    }
    this.copyPixels = function () {
        executeAction(s2t('copyEvent'), undefined, DialogModes.NO);
    }
    this.selectMaskChannel = function () {
        (r = new ActionReference()).putEnumerated(target, s2t('channel'), s2t('mask'));
        (d = new ActionDescriptor()).putReference(s2t('target'), r);
        d.putBoolean(s2t('makeVisible'), true)
        executeAction(s2t('select'), d, DialogModes.NO);
    }
    this.delete = function () {
        (r = new ActionReference()).putEnumerated(target, s2t("ordinal"), s2t("targetEnum"));
        (d = new ActionDescriptor()).putReference(s2t("target"), r);
        executeAction(s2t("delete"), d, DialogModes.NO);
    }
    this.makeMask = function () {
        (d = new ActionDescriptor()).putClass(s2t("new"), s2t("channel"));
        (r = new ActionReference()).putEnumerated(s2t("channel"), s2t("channel"), s2t("mask"));
        d.putReference(s2t("at"), r);
        d.putEnumerated(s2t("using"), s2t("userMaskEnabled"), s2t("revealAll"));
        executeAction(s2t("make"), d, DialogModes.NO);
    }
    this.selectRGBChannel = function () {
        (r = new ActionReference()).putEnumerated(s2t('channel'), s2t('channel'), s2t('RGB'));
        (d = new ActionDescriptor()).putReference(s2t('target'), r);
        executeAction(s2t('select'), d, DialogModes.NO);
    }
    this.pastePixels = function () {
        (d = new ActionDescriptor()).putEnumerated(s2t('antiAlias'), s2t('antiAliasType'), s2t('antiAliasNone'));
        d.putClass(s2t('as'), s2t('pixel'));
        executeAction(s2t('paste'), d, DialogModes.NO);
    }
    this.selectLayerByIDList = function (IDList) {
        var ref = new ActionReference()
        for (var i = 0; i < IDList.length; i++) {
            ref.putIdentifier(s2t("layer"), IDList[i])
        }
        var desc = new ActionDescriptor()
        desc.putReference(s2t("target"), ref)
        executeAction(s2t("select"), desc, DialogModes.NO)
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