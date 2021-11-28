/**Scripting the "zoom to layers bounds" feature...
 * https://community.adobe.com/t5/photoshop/scripting-the-quot-zoom-to-layers-bounds-quot-feature/m-p/11289176
 */
#target photoshop;

$.hiresTimer    
zoomToLayer (app.activeDocument.activeLayer.id,0.5)
$.writeln ($.hiresTimer)


function zoomToLayer(layerID, zoom) {
    var s2t = stringIDToTypeID,
        t2s = typeIDToStringID,
        lrBounds = getProperty('layer', 'bounds', layerID),
        x = lrBounds.getUnitDoubleValue(s2t('left')) + lrBounds.getUnitDoubleValue(s2t('width')) / 2,
        y = lrBounds.getUnitDoubleValue(s2t('top')) + lrBounds.getUnitDoubleValue(s2t('height')) / 2,
        w = lrBounds.getUnitDoubleValue(s2t('width')),
        h = lrBounds.getUnitDoubleValue(s2t('height'));

    var activeView = getProperty('document', 'viewInfo').getObjectValue(s2t('activeView')).getObjectValue(s2t('globalBounds'));
        docW = activeView.getDouble(s2t('right')) - activeView.getDouble(s2t('left')),
        docH = activeView.getDouble(s2t('bottom')) - activeView.getDouble(s2t('top')),
        k = Math.min(docW / w, docH / h) * (zoom ? zoom : 1);

    (d = new ActionDescriptor()).putUnitDouble(s2t('zoom'), s2t('percentUnit'), k);
    setProperty('document', 'zoom', d);

    (d = new ActionDescriptor()).putUnitDouble(s2t('horizontal'), s2t('distanceUnit'), x * k);
    d.putUnitDouble(s2t('vertical'), s2t('distanceUnit'), y * k);
    setProperty('document', 'center', d);

    function getProperty(object, property, id) {
        (r = new ActionReference()).putProperty(s2t('property'), p = s2t(property));
        id ? r.putIdentifier(s2t(object), id) : r.putEnumerated(s2t(object), s2t('ordinal'), s2t('targetEnum'));
        return getValue(executeActionGet(r), p)

        function getValue(d, id) {
            switch (d.getType(id)) {
                case DescValueType.OBJECTTYPE: return d.getObjectValue(id);
                case DescValueType.LISTTYPE: return d.getList(id);
                case DescValueType.REFERENCETYPE: return d.getReference(id);
                case DescValueType.BOOLEANTYPE: return d.getBoolean(id);
                case DescValueType.STRINGTYPE: return d.getString(id);
                case DescValueType.INTEGERTYPE: return d.getInteger(id);
                case DescValueType.LARGEINTEGERTYPE: return d.getLargeInteger(id);
                case DescValueType.DOUBLETYPE: return d.getDouble(id);
                case DescValueType.ALIASTYPE: return d.getPath(id);
                case DescValueType.CLASSTYPE: return d.getClass(id);
                case DescValueType.UNITDOUBLE: return { value: d.getUnitDoubleValue(id), type: t2s(d.getUnitDoubleType(id)) };
                case DescValueType.ENUMERATEDTYPE: return { value: t2s(d.getEnumerationValue(id)), type: t2s(d.getEnumerationType(id)) };
            }
        }
    }

    function setProperty(target, property, desc) {
        (r = new ActionReference()).putProperty(s2t('property'), p = s2t(property));
        r.putEnumerated(s2t(target), s2t('ordinal'), s2t('targetEnum'));
        (d = new ActionDescriptor).putReference(s2t('null'), r);
        d.putObject(s2t('to'), p, desc);
        executeAction(s2t('set'), d, DialogModes.NO);
    }
}

function checkDesc(desc) {
    var c = desc.count,
        str = '';
    for (var i = 0; i < c; i++) {
        str += t2s(desc.getKey(i)) +
            ': ' + desc.getType(desc.getKey(i)) +
            ' = ' + getValues(desc, i) + '\n';
    };
    $.writeln(str);
};


function getValues(desc, keyNum) {
    var kTypeID = desc.getKey(keyNum);
    switch (desc.getType(kTypeID)) {
        case DescValueType.OBJECTTYPE:
            return (desc.getObjectValue(kTypeID) +
                '_' + t2s(desc.getObjectType(kTypeID)));
            break;
        case DescValueType.LISTTYPE:
            return desc.getList(kTypeID);
            break;
        case DescValueType.REFERENCETYPE:
            return desc.getReference(kTypeID);
            break;
        case DescValueType.BOOLEANTYPE:
            return desc.getBoolean(kTypeID);
            break;
        case DescValueType.STRINGTYPE:
            return desc.getString(kTypeID);
            break;
        case DescValueType.INTEGERTYPE:
            return desc.getInteger(kTypeID);
            break;
        case DescValueType.LARGEINTEGERTYPE:
            return desc.getLargeInteger(kTypeID);
            break;
        case DescValueType.DOUBLETYPE:
            return desc.getDouble(kTypeID);
            break;
        case DescValueType.ALIASTYPE:
            return desc.getPath(kTypeID);
            break;
        case DescValueType.CLASSTYPE:
            return desc.getClass(kTypeID);
            break;
        case DescValueType.UNITDOUBLE:
            return (desc.getUnitDoubleValue(kTypeID) +
                '_' + t2s(desc.getUnitDoubleType(kTypeID)));
            break;
        case DescValueType.ENUMERATEDTYPE:
            return (t2s(desc.getEnumerationValue(kTypeID)) +
                '_' + t2s(desc.getEnumerationType(kTypeID)));
            break;
        case DescValueType.RAWTYPE:
            var tempStr = desc.getData(kTypeID);
            var rawData = new Array();
            for (var tempi = 0; tempi < tempStr.length; tempi++) {
                rawData[tempi] = tempStr.charCodeAt(tempi);
            }
            return rawData;
            break;
        default:
            break;
    };
};
