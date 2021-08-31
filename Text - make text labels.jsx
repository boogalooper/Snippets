#target photoshop

var align = ['right', 'bottom'], // [x, y] x - right or left, y - top or bottom
    offset = [-20, -20], // [x, y] pixels
    mergeLayers = true, // merge txt with layer or not
    lr = new AM('layer');

if (textKey = lr.getProperty('textKey')) {
    lr.hideLayerByID(lr.getProperty('layerID'))
    var doc = new AM('document'),
        len = doc.getProperty('numberOfLayers'),
        lrs = [];

    for (i = 1; i <= len; i++) {
        var lrKind = lr.getProperty('layerKind', i, true)
        if (lrKind == 1 || lrKind == 5) {
            lrs.push({
                name: lr.getProperty('name', i, true),
                id: lr.getProperty('layerID', i, true),
                bounds: lr.getProperty('bounds')
            })
        }
    }

    len = lrs.length
    var txt = new AM('textLayer')
    for (i = 0; i < len; i++) {
        lr.selectLayerByIDList([lrs[i].id]);
        textKey.putString (stringIDToTypeID('textKey'), lrs[i].name)
        var l = textKey.getList(s2t('textStyleRange')),
        s = l.getObjectValue (l.count-1)
        s.putInteger (stringIDToTypeID('from'), 0)
        s.putInteger (stringIDToTypeID('to'), lrs[i].name.length)
        l.putObject (s2t('textStyleRange'), s)
        textKey.putList(s2t('textStyleRange'), l)
        var id = (lr.makeTextLayer(textKey)).getInteger(stringIDToTypeID('layerID'));
        //(d = new ActionDescriptor).putString(stringIDToTypeID('textKey'), lrs[i].name);
       // txt.setPropertyByDesc(d);
      // lr.setText(lrs[i].name)
        txt.moveLayer(layerOffset(lr.getProperty('bounds', lrs[i].id), lr.getProperty('bounds', id), align, offset))
        if (mergeLayers) { lr.selectLayerByIDList([lrs[i].id, id]); lr.mergeLayers() }
    }
}

function layerOffset(src, tgt, align, offset) {
    return [src.getInteger(stringIDToTypeID(align[0])) - tgt.getInteger(stringIDToTypeID(align[0])) + offset[0],
    src.getInteger(stringIDToTypeID(align[1])) - tgt.getInteger(stringIDToTypeID(align[1])) + offset[1]]
}

function AM(target) {
    var s2t = stringIDToTypeID,
        t2s = typeIDToStringID;

    target = s2t(target)

    this.getProperty = function (property, id, idxMode) {
        property = s2t(property);
        (r = new ActionReference()).putProperty(s2t('property'), property);
        id ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id))
            : r.putEnumerated(target, s2t('ordinal'), s2t('targetEnum'));
        return executeActionGet(r).hasKey(property) ? getDescValue(executeActionGet(r), property) : null
    }

    this.setPropertyByDesc = function (desc, id, idxMode) {
        var r = new ActionReference();
        id ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id))
            : r.putEnumerated(target, s2t('ordinal'), s2t('targetEnum'));
        (d = new ActionDescriptor).putReference(s2t('null'), r);
        d.putObject(s2t('to'), target, desc);
        executeAction(s2t('set'), d, DialogModes.NO);
    }

    switch (t2s(target)) {
        case 'layer':
        case 'textLayer':
            this.hideLayerByID = function (id) {
                (r = new ActionReference()).putIdentifier(s2t('layer'), id);
                (l = new ActionList()).putReference(r);
                (d = new ActionDescriptor()).putList(s2t('null'), l);
                executeAction(s2t('hide'), d, DialogModes.NO);
            }

            this.selectLayerByIDList = function (IDList) {
                var ref = new ActionReference()
                for (var i = 0; i < IDList.length; i++) {
                    ref.putIdentifier(s2t("layer"), IDList[i])
                }
                var desc = new ActionDescriptor()
                desc.putReference(s2t("null"), ref)
                executeAction(s2t("select"), desc, DialogModes.NO)
            }

            this.makeTextLayer = function (textKey) {
                (r = new ActionReference()).putClass(s2t('textLayer'));
                (d = new ActionDescriptor()).putReference(s2t('null'), r);
                d.putObject(s2t('using'), s2t('textLayer'), textKey);
                return executeAction(s2t('make'), d, DialogModes.NO);
            }
            
            this.moveLayer = function (offset) {
                (r = new ActionReference()).putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
                (d = new ActionDescriptor()).putReference(s2t('null'), r);
                (d1 = new ActionDescriptor()).putUnitDouble(s2t('horizontal'), s2t('pixelsUnit'), offset[0]);
                d1.putUnitDouble(s2t('vertical'), s2t('pixelsUnit'), offset[1]);
                d.putObject(s2t('to'), s2t('offset'), d1);
                executeAction(s2t('move'), d, DialogModes.NO);
            }

            this.mergeLayers = function () {
                executeAction(s2t("mergeLayers"), new ActionDescriptor(), DialogModes.NO);
            }
            break;
    }

    function getDescValue(d, p) {
        switch (d.getType(p)) {
            case DescValueType.OBJECTTYPE: return (d.getObjectValue(p));
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
            case DescValueType.ENUMERATEDTYPE: return [t2s(d.getEnumerationType(p)), t2s(d.getEnumerationValue(p))];
            default: break;
        };
    }
}





function checkDesc(d) {
    var c = d.count,
        str = '';
    for (var i = 0; i < c; i++) {
        str += t2s(d.getKey(i)) +
            ': ' + d.getType(d.getKey(i)) +
            ' = ' + getValues(d, i) + '\n';
    };
    $.writeln(str);
};


function getValues(d, keyNum) {
    var p = d.getKey(keyNum);
    switch (d.getType(p)) {
        case DescValueType.OBJECTTYPE:
            return (d.getObjectValue(p) +
                '_' + t2s(d.getObjectType(p)));
            break;
        case DescValueType.LISTTYPE:
            return d.getList(p);
            break;
        case DescValueType.REFERENCETYPE:
            return d.getReference(p);
            break;
        case DescValueType.BOOLEANTYPE:
            return d.getBoolean(p);
            break;
        case DescValueType.STRINGTYPE:
            return d.getString(p);
            break;
        case DescValueType.INTEGERTYPE:
            return d.getInteger(p);
            break;
        case DescValueType.LARGEINTEGERTYPE:
            return d.getLargeInteger(p);
            break;
        case DescValueType.DOUBLETYPE:
            return d.getDouble(p);
            break;
        case DescValueType.ALIASTYPE:
            return d.getPath(p);
            break;
        case DescValueType.CLASSTYPE:
            return d.getClass(p);
            break;
        case DescValueType.UNITDOUBLE:
            return (d.getUnitDoubleValue(p) +
                '_' + t2s(d.getUnitDoubleType(p)));
            break;
        case DescValueType.ENUMERATEDTYPE:
            return (t2s(d.getEnumerationValue(p)) +
                '_' + t2s(d.getEnumerationType(p)));
            break;
        case DescValueType.RAWTYPE:
            var tempStr = d.getData(p);
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

function s2t(s) { return stringIDToTypeID(s) }
function t2s(t) { if (!typeIDToStringID(t)) { return typeIDToCharID(t) } else { return typeIDToStringID(t) } }