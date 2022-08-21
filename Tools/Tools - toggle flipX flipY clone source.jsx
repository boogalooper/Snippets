#target photoshop
var s2t = stringIDToTypeID;
if (currentTool == 'cloneStampTool') {
    //currentTool = 'magicStampTool';
    (ref = new ActionReference()).putProperty(s2t('property'), p = s2t('currentToolOptions'));
    ref.putEnumerated(s2t('application'), s2t('ordinal'), s2t('targetEnum'));
    var cto = executeActionGet(ref).getObjectValue(s2t('currentToolOptions'));
    d = new ActionDescriptor();
    d.putBoolean(x = s2t("flipX"), !cto.getBoolean(x));
    d.putBoolean(y = s2t("flipY"), !cto.getBoolean(y));
    (r = new ActionReference()).putClass(s2t('magicStampTool'));
    (d1 = new ActionDescriptor()).putReference(s2t('target'), r);
    d1.putObject(s2t('to'), s2t('target'), d);
    executeAction(s2t('set'), d1, DialogModes.NO);
}
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