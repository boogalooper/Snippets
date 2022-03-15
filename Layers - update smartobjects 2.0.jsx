/** Обновление линкованных объектов внутри смарт-объектов документа* */

#target photoshop
var doc = new AM('document'),
    lr = new AM('layer'),
    lrs = [],
    docIdx = 1;
if (len = doc.getProperty('numberOfLayers')) {
    docIdx = doc.getProperty('itemIndex')
    for (var i = 1; i <= len; i++) {
        if (lr.getProperty('layerSection', i, true).value != 'layerSectionContent') continue;
        if (lr.hasProperty('smartObject', i, true)) {
            var cur = lr.descToObject(lr.getProperty('smartObject', i, true))
            if (!cur.linked) lrs.push(lr.getProperty('layerID', i, true))
        }
    }
    do {
        for (var i = 0; i < lrs.length; i++) {
            lr.select(lrs.shift())
            if (lr.editSmartObject()) {
                if (lr.updateAllModified()) {
                    doc.closeDocument(true)
                }
                else {
                    doc.select(docIdx, true)
                }
            }
        }
    } while (lrs.length)
}

function AM(target) {
    var s2t = stringIDToTypeID,
        t2s = typeIDToStringID;
    target = target ? s2t(target) : null;
    this.getProperty = function (property, id, idxMode) {
        r = new ActionReference();
        if (property) {
            property = s2t(property);
            r.putProperty(s2t('property'), property);
        }
        id != undefined ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id)) :
            r.putEnumerated(target, s2t('ordinal'), s2t('targetEnum'));
        try { return property ? getDescValue(executeActionGet(r), property) : executeActionGet(r) } catch (e) { return null }
    }
    this.hasProperty = function (property, id, idxMode) {
        property = s2t(property);
        (r = new ActionReference()).putProperty(s2t('property'), property);
        id ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id))
            : r.putEnumerated(target, s2t('ordinal'), s2t('targetEnum'));
        try { return executeActionGet(r).hasKey(property) } catch (e) { return false }
    }
    this.descToObject = function (d, o) {
        if (d) {
            o = o ? o : {}
            for (var i = 0; i < d.count; i++) {
                var k = d.getKey(i)
                o[t2s(k)] = getDescValue(d, k)
            }
            return o
        }
    }
    this.select = function (id, idxMode) {
        var ref = new ActionReference();
        if (idxMode) { ref.putIndex(target, id) } else { ref.putIdentifier(target, id) }
        var desc = new ActionDescriptor()
        desc.putReference(s2t('target'), ref)
        desc.putBoolean(s2t('makeVisible'), false)
        executeAction(s2t('select'), desc, DialogModes.NO)
    }
    this.editSmartObject = function () {
        try {
            executeAction(s2t('placedLayerEditContents'), undefined, DialogModes.NO)
            return true
        } catch (e) { return false }
    }
    this.updateAllModified = function () {
        try {
            executeAction(s2t('placedLayerUpdateAllModified'), undefined, DialogModes.NO)
            return true
        } catch (e) { return false }
    }
    this.closeDocument = function (save) {
        save = save != true ? s2t('no') : s2t('yes');
        (d = new ActionDescriptor()).putEnumerated(s2t('saving'), s2t('yesNo'), save);
        executeAction(s2t('close'), d, DialogModes.NO)
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