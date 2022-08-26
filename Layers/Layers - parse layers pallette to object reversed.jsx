/**
 * When a get layerSet id, any way to get all children layers id by ActionManager?
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/when-a-get-layerset-id-any-way-to-get-all-children-layers-id-by-actionmanager/td-p/13160515
 */
var doc = new AM('document'),
    lr = new AM('layer');

var layerSectionContent = getLayersCollection(lr.getProperty(('itemIndex'), lr.getProperty('layerID'))/*<- get active layer ID*/, true)
alert(layerSectionContent.toSource())

function getLayersCollection(idx, getLayerSectionContent) {
    var indexFrom = idx ? (doc.getProperty('hasBackgroundLayer') ? --idx : idx) : doc.getProperty('numberOfLayers'),
        indexTo = doc.getProperty('hasBackgroundLayer') ? 0 : 1;
    return enumLayers(indexFrom, indexTo, getLayerSectionContent);
    function enumLayers(from, to, currentSection, parentItem, group) {
        parentItem = parentItem ? parentItem : [];
        var isDirty = false;
        for (var i = from; i >= to; i--) {
            var layerSection = lr.getProperty('layerSection', i, true).value;
            if (layerSection == 'layerSectionStart') {
                i = enumLayers(i - 1, to, undefined, [], parentItem)
                isDirty = true;
                if (currentSection) return parentItem[0]
                continue;
            }
            if (currentSection && isDirty) return []
            var properties = {};
            //collect properties here
            properties.layerKind = lr.getProperty('name', i, true)
            properties.id = lr.getProperty('layerID', i, true)
            if (layerSection == 'layerSectionEnd') {
                for (o in properties) { parentItem[o] = properties[o] }
                group.push(parentItem);
                return i;
            } else {
                parentItem.push(properties)
                if (currentSection && !isDirty) return parentItem
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
    this.hasProperty = function (property, id, idxMode) {
        property = s2t(property);
        (r = new ActionReference()).putProperty(s2t('property'), property);
        id ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id))
            : r.putEnumerated(target, s2t('ordinal'), order ? s2t(order) : s2t('targetEnum'));
        return executeActionGet(r).hasKey(property)
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