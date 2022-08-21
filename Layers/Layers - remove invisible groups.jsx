/**jsx script extremely slow
 * https://community.adobe.com/t5/photoshop-ecosystem/jsx-script-extremely-slow/m-p/12314061
 */
#target photoshop
$.hiresTimer
var lr = new AM(),
    namesOfGroupsFromTxtFile = ['test name 1', 'test name 2']
var lrs = getLayersCollection(),
    exceptionNames = {};
do { exceptionNames[namesOfGroupsFromTxtFile.shift()] = true } while (namesOfGroupsFromTxtFile.length)
selectAndDelete(lr, getNotNeededGroups(lrs, exceptionNames))
var lrs = getLayersCollection(),
    emptyTopLevelGroups = [];
for (var i = 0; i < lrs.length; i++) if (lrs[i].type == 7 && !lrs[i].length) emptyTopLevelGroups.push(lrs[i].id)
selectAndDelete(lr, emptyTopLevelGroups)
var end = $.hiresTimer
alert(end / 1000000)
function getLayersCollection() {
    var doc = new AM('document'),
        lr = new AM('layer'),
        indexFrom = doc.getProperty('hasBackgroundLayer') ? 0 : 1,
        indexTo = doc.getProperty('numberOfLayers');
    return layersCollection(indexFrom, indexTo)
    function layersCollection(from, to, parentItem, group) {
        parentItem = parentItem ? parentItem : [];
        for (var i = from; i <= to; i++) {
            var layerSectionType = lr.getProperty('layerSection', i, true).value;
            if (layerSectionType == 'layerSectionEnd') {
                i = layersCollection(i + 1, to, [], parentItem)
                continue;
            }
            var properties = {};
            properties.name = lr.getProperty('name', i, true)
            properties.id = lr.getProperty('layerID', i, true)
            properties.visible = lr.getProperty('visible', i, true)
            properties.type = lr.getProperty('layerKind', i, true)
            if (layerSectionType == 'layerSectionStart') {
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
function getNotNeededGroups(lrs, exceptionNames, output) {
    output = output ? output : []
    exceptionNames = exceptionNames ? exceptionNames : {}
    for (var i = 0; i < lrs.length; i++) {
        var cur = lrs[i];
        if (!exceptionNames[cur.name] && cur instanceof Array) {
            if (cur.length) {
                if (cur[0].type != 7) {
                    output.push(cur.id);
                } else {
                    if (cur.visible) continue;
                    getNotNeededGroups(cur, exceptionNames, output)
                }
            }
        }
    }
    return output
}
function selectAndDelete(lr, list) {
    if (list.length) {
        lr.deselect()
        lr.selectLayers(list)
        lr.removeLayer()
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
    this.removeLayer = function (list) {
        r = new ActionReference;
        if (list) { do { r.putIdentifier(s2t('layer'), list.shift()) } while (list.length) } else {
            r.putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'))
        }
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        executeAction(s2t('delete'), d);
    }
    this.deselect = function () {
        (r = new ActionReference()).putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        executeAction(s2t('selectNoLayers'), d, DialogModes.NO);
    }
    this.selectLayers = function (list) {
        var r = new ActionReference();
        do { r.putIdentifier(s2t('layer'), list.shift()) } while (list.length);
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        d.putEnumerated(s2t('selectionModifier'), s2t('addToSelectionContinuous'), s2t('addToSelection'));
        executeAction(s2t('select'), d, DialogModes.NO);
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