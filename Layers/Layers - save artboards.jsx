/**getting the structure of the document taking into account nested groups and layers  */
#target photoshop
var a = getLayersCollection(),
    lr = new AM('layer');
for (var i = 0; i < a.length; i++) {
    lr.layerVisibilityById(a[i].id, false)
}
var doc = app.activeDocument;
for (var i = 0; i < a.length; i++) {
    lr.layerVisibilityById(a[i].id, true)
    doc.saveAs(File(doc.path + '/' + a[i].name + '.psd'))
    lr.layerVisibilityById(a[i].id, false)
}
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
            properties.artboardEnabled = lr.getProperty('artboardEnabled', i, true)
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
    this.selectLayerByID = function (ID) {
        ref = new ActionReference();
        ref.putIdentifier(s2t("layer"), ID);
        var desc = new ActionDescriptor()
        desc.putReference(s2t("target"), ref)
        executeAction(s2t("select"), desc, DialogModes.NO)
    }
    this.layerVisibilityById = function (id, makeVisible) {
        makeVisible = makeVisible == 1 ? "show" : "hide"
        var desc = new ActionDescriptor()
        var ref = new ActionReference()
        ref.putIdentifier(s2t("layer"), id)
        desc.putReference(s2t("target"), ref)
        executeAction(s2t(makeVisible), desc, DialogModes.NO);
    }
}
