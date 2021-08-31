#target photoshop

s2t = stringIDToTypeID,
    t2s = typeIDToStringID;

try { var evt = arguments[0] } catch (e) { }

if (evt) {
    try {
        if (evt.hasKey(s2t('title'))) {
            if (evt.getString(s2t('title')) == 'Alert') {
                if (evt.hasKey(s2t('state'))) {
                    if (t2s(evt.getEnumerationValue(s2t('state'))) == 'exit') {

                        (r = new ActionReference()).putProperty(s2t('property'), p = s2t('tool'));
                        r.putEnumerated(s2t('application'), s2t('ordinal'), s2t('targetEnum'));
                        var tool = t2s(executeActionGet(r).getEnumerationType(s2t('tool')));

                        (r = new ActionReference()).putProperty(s2t('property'), p = s2t('layerKind'));
                        r.putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
                        var kind = executeActionGet(r).getInteger(p);

                        if (tool == 'paintbrushTool' && (kind == 2 || kind == 3 || kind == 5 || kind == 5)) {
                            (r = new ActionReference()).putClass(s2t("layer"));
                            (d = new ActionDescriptor()).putReference(s2t("null"), r);
                            executeAction(s2t("make"), d, DialogModes.NO);
                        }
                    }
                }
            }
        }
    } catch (e) { }
} else {
    app.notifiersEnabled = true
    var f = File($.fileName)
    app.notifiers.add('modalStateChanged', f)
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