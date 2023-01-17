/**
 * Script to expand all groups not working if group is empty
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/script-to-expand-all-groups-not-working-if-group-is-empty/td-p/13494495
 */

#target photoshop

activeDocument.suspendHistory('Expand all layerSets', 'openAllLayerSets()')

function openAllLayerSets() {
    var lr = new AM('layer'),
        doc = new AM('document'),
        currentSelection = doc.getProperty('targetLayersIDs'),
        layers = expandGroups(getLayersCollection());
    if (layers.length) {
        doc.selectLayers(layers)
        doc.deleteLayers(layers)
    }
    if (currentSelection.count) {
        var s = [];
        for (var i = 0; i < currentSelection.count; i++)
            s.push(currentSelection.getReference(i).getIdentifier())
        doc.selectLayers(s)
    } else doc.selectNoLayers()
    function expandGroups(layers, toDelete) {
        toDelete = toDelete ? toDelete : [];
        for (var a in layers) {
            if (layers[a].layerKind == 7) {
                if (layers[a].length) {
                    lr.selectLayers([layers[a][0].id])
                    expandGroups(layers[a], toDelete)
                }
                else {
                    lr.add()
                    lr.moveLayer(lr.getProperty('itemIndex', layers[a].id) - 2)
                    toDelete.push(lr.getProperty('layerID'))
                }
            }
        }
        return toDelete
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
                properties.id = lr.getProperty('layerID', i, true)
                properties.visible = lr.getProperty('visible', i, true)
                properties.layerKind = lr.getProperty('layerKind', i, true)
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
        this.selectLayers = function (IDList) {
            var r = new ActionReference()
            for (var i = 0; i < IDList.length; i++) {
                r.putIdentifier(s2t("layer"), IDList[i])
            }
            (d = new ActionDescriptor()).putReference(s2t("target"), r)
            d.putBoolean(s2t("makeVisible"), false)
            executeAction(s2t("select"), d, DialogModes.NO)
        }
        this.add = function () {
            (r = new ActionReference()).putClass(target);
            (d = new ActionDescriptor()).putReference(s2t("null"), r);
            executeAction(s2t("make"), d, DialogModes.NO);
        }
        this.moveLayer = function (to) {
            (r = new ActionReference()).putEnumerated(s2t("layer"), s2t('ordinal'), s2t('targetEnum'));
            (d = new ActionDescriptor()).putReference(s2t('null'), r);
            (r1 = new ActionReference()).putIndex(s2t('layer'), to);
            d.putReference(s2t('to'), r1);
            executeAction(s2t('move'), d, DialogModes.NO);
        }
        this.selectNoLayers = function () {
            (r = new ActionReference()).putEnumerated(s2t("layer"), s2t('ordinal'), s2t('targetEnum'));
            (d = new ActionDescriptor()).putReference(s2t('target'), r);
            executeAction(s2t('selectNoLayers'), d, DialogModes.NO);
        }
        this.deleteLayers = function (IDList) {
            var r = new ActionReference()
            for (var i = 0; i < IDList.length; i++) {
                r.putIdentifier(s2t("layer"), IDList[i])
            }
            (d = new ActionDescriptor()).putReference(s2t("target"), r)
            d.putBoolean(s2t("makeVisible"), false)
            executeAction(s2t("delete"), d, DialogModes.NO)
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
}