/*getting the parameters of the descriptor*/

#target photoshop
s2t = stringIDToTypeID;

/*using json object*/
(r = new ActionReference()).putProperty(s2t('property'), p = s2t('textKey'));
r.putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
(d = new ActionDescriptor()).putObject(s2t('object'), s2t('object'), executeActionGet(r));
$.writeln(executeAction(s2t('convertJSONdescriptor'), d).getString(s2t('json')))

/*classic way*/
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
        case DescValueType.OBJECTTYPE: return (d.getObjectValue(p) + '_' + t2s(d.getObjectType(p)));
        case DescValueType.LISTTYPE: return d.getList(p);
        case DescValueType.REFERENCETYPE: return d.getReference(p);
        case DescValueType.BOOLEANTYPE: return d.getBoolean(p);
        case DescValueType.STRINGTYPE: return d.getSstring(p);
        case DescValueType.INTEGERTYPE: return d.getInteger(p);
        case DescValueType.LARGEINTEGERTYPE: return d.getLargeInteger(p);
        case DescValueType.DOUBLETYPE: return d.getDouble(p);
        case DescValueType.ALIASTYPE: return d.getPath(p);
        case DescValueType.CLASSTYPE: return d.getClass(p);
        case DescValueType.UNITDOUBLE: return (d.getUnitDoubleValue(p) + '_' + t2s(d.getUnitDoubleType(p)));
        case DescValueType.ENUMERATEDTYPE: return (t2s(d.getEnumerationValue(p)) + '_' + t2s(d.getEnumerationType(p)));
        case DescValueType.RAWTYPE:
            var tempStr = d.getData(p);
            var rawData = new Array();
            for (var tempi = 0; tempi < tempStr.length; tempi++) {
                rawData[tempi] = tempStr.charCodeAt(tempi);
            }
            return rawData;
        default:
            break;
    };
};

function s2t(s) { return stringIDToTypeID(s) }
function t2s(t) { if (!typeIDToStringID(t)) { return typeIDToCharID(t) } else { return typeIDToStringID(t) } }