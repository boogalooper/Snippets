#target photoshop

var oldColor = [255, 0, 0], // [R,G,B]
    newColor = [0, 255, 0], // [R,G,B]
    s2t = stringIDToTypeID,
    t2s = typeIDToStringID;

(r = new ActionReference()).putProperty(s2t('property'), p = s2t('numberOfLayers'));
r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
var len = executeActionGet(r).getInteger(p);

for (var i = 1; i <= len; i++) {
    (r = new ActionReference()).putProperty(s2t('property'), p = s2t('textKey'));
    r.putIndex(s2t('layer'), i);
    if (executeActionGet(r).hasKey(p)) {
        var textKey = executeActionGet(r).getObjectValue(p),
            sList = textKey.getList(s2t('textStyleRange')),
            pList = textKey.getList(s2t('paragraphStyleRange')),
            defaultStyle = (p = pList.getObjectValue(0).getObjectValue(s2t('paragraphStyle'))).hasKey(s2t('defaultStyle')) ?
                p.getObjectValue(s2t('defaultStyle')) : new ActionDescriptor(),
            l = new ActionList(),
            d = new ActionDescriptor();
            
        for (var x = 0; x < sList.count; x++) {
            k = sList.getObjectValue(x)
            if (k.getObjectValue(s2t('textStyle')).hasKey(s2t('color'))) {
                s = copyDesc(defaultStyle, k.getObjectValue(s2t('textStyle')))
                c = s.getObjectValue(s2t('color'))
                if ((c.getInteger(s2t('red')) == oldColor[0] && c.getInteger(s2t('grain')) == oldColor[1] && c.getInteger(s2t('blue')) == oldColor[2])) {
                    var d = new ActionDescriptor();
                    d.putDouble(s2t('red'), newColor[0])
                    d.putDouble(s2t('grain'), newColor[1])
                    d.putDouble(s2t('blue'), newColor[2])
                    s.putObject(s2t('color'), s2t('RGBColor'), d)
                }
                k.putObject(s2t('textStyle'), s2t('textStyle'), s)
            }
            l.putObject(s2t('textStyleRange'), k)
        }
        if (d.count) {
            textKey.putList(s2t('textStyleRange'), l)
            var d = new ActionDescriptor();
            (r = new ActionReference()).putIndex(s2t('layer'), i);
            d.putReference(s2t('null'), r);
            d.putObject(s2t('to'), s2t('textLayer'), textKey);
            executeAction(s2t('set'), d, DialogModes.NO);
        }
    }
}

function copyDesc(from, to) {
    for (var i = 0; i < from.count; i++) {
        var k = from.getKey(i);
        if (to.hasKey(k)) continue;
        switch (from.getType(k)) {
            case DescValueType.ALIASTYPE: to.putPath(k, from.getPath(k)); break;
            case DescValueType.BOOLEANTYPE: to.putBoolean(k, from.getBoolean(k)); break;
            case DescValueType.CLASSTYPE: to.putClass(k, from.getClass(k)); break;
            case DescValueType.DOUBLETYPE: to.putDouble(k, from.getDouble(k)); break;
            case DescValueType.INTEGERTYPE: to.putInteger(k, from.getInteger(k)); break;
            case DescValueType.LISTTYPE: to.putList(k, from.getList(k)); break;
            case DescValueType.RAWTYPE: to.putData(k, from.getData(k)); break;
            case DescValueType.STRINGTYPE: to.putString(k, from.getString(k)); break;
            case DescValueType.LARGEINTEGERTYPE: to.putLargeInteger(k, from.getLargeInteger(k)); break;
            case DescValueType.REFERENCETYPE: to.putReference(k, from.getReference(k)); break;
            case DescValueType.OBJECTTYPE: to.putObject(k, from.getObjectType(k), from.getObjectValue(k)); break;
            case DescValueType.ENUMERATEDTYPE: to.putEnumerated(k, from.getEnumerationType(k), from.getEnumerationValue(k)); break;
            case DescValueType.UNITDOUBLE: to.putUnitDouble(k, from.getUnitDoubleType(k), from.getUnitDoubleValue(k)); break;
        }
    }
    return to
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


function getValues(d, kNum) {
    var p = d.getKey(kNum);
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
