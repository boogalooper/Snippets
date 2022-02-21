#target photoshop
const apl = new AM('application'),
    doc = new AM('document'),
    lr = new AM('layer');

if (apl.getProperty('numberOfDocuments')) {
    if (doc.hasProperty('numberOfLayers')) {
        var len = doc.getProperty('numberOfLayers'),
            kind = lr.getProperty('layerKind'),
            layers = [];

        for (var i = 1; i <= len; i++) {
            if (lr.getProperty('layerSection', i, true).value == 'layerSectionEnd') continue;
            if ((k = lr.getProperty('layerKind', i, true)) == kind) layers.push(lr.getProperty('layerID', i, true))
        }
    }

    if (layers.length) doc.selectLayerByIDList(layers)
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
        try { return executeActionGet(r).hasKey(property) } catch (e) { return false }
    }
    this.descToObject = function (d, o) {
        o = o ? o : {}
        for (var i = 0; i < d.count; i++) {
            var k = d.getKey(i)
            o[t2s(k)] = getDescValue(d, k)
        }
        return o
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