/**Quick get the full structure of document layers (including nested groups)
 * as an array of objects. Parameters that you need to specify yourself
 * (in the example, the script gets the name, id, type, visibility, three types of layer borders)
*/
#target photoshop
var a = getLayersCollection()
function getLayersCollection() {
    var doc = new AM('document'),
        lr = new AM('layer'),
        indexFrom = doc.getProperty('hasBackgroundLayer') ? 0 : 1,
        indexTo = doc.getProperty('numberOfLayers');
    return layersCollection(indexFrom, indexTo)
    function layersCollection(from, to, parentItem, group) {
        parentItem = parentItem ? parentItem : [];
        for (var i = from; i <= to; i++) {
            var layerSection = lr.getProperty('layerSection', i, true).value;
            if (layerSection == 'layerSectionEnd') {
                i = layersCollection(i + 1, to, [], parentItem)
                continue;
            }
            var properties = {};
            properties.name = lr.getProperty('name', i, true)
            properties.id = lr.getProperty('layerID', i, true)
            properties.type = lr.getProperty('layerKind', i, true)
            properties.visible = lr.getProperty('visible', i, true)
            properties.bounds = lr.descToObject(lr.getProperty('bounds', i, true).value)
            properties.boundsNoEffects = lr.descToObject(lr.getProperty('boundsNoEffects', i, true).value)
            properties.boundsNoMask = lr.descToObject(lr.getProperty('boundsNoMask', i, true).value)
            if (layerSection == 'layerSectionStart') {
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