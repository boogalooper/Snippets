#target photoshop

changeFill(255, 0, 0); // R, G, B values
function changeFill(red, green, blue) {
    s2t = stringIDToTypeID;

    (r = new ActionReference()).putProperty(s2t("property"), p = s2t("layerEffects"));
    r.putEnumerated(s2t("layer"), s2t("ordinal"), s2t("targetEnum"));
    var fx = executeActionGet(r).hasKey(p) ? executeActionGet(r).getObjectValue(p) : new ActionDescriptor(),
        currentFill = fx.hasKey(p = s2t("solidFill")) ? fx.getObjectValue(p) : new ActionDescriptor();
    if (fx.hasKey(p = s2t("solidFillMulti"))) fx.erase(p);

    (d = new ActionDescriptor()).putDouble(s2t("red"), red);
    d.putDouble(s2t("green"), green);
    d.putDouble(s2t("blue"), blue);
    currentFill.putObject(s2t("color"), s2t("RGBColor"), d);
    fx.putObject(s2t("solidFill"), s2t("solidFill"), currentFill);

    (d = new ActionDescriptor()).putReference(s2t("null"), r);
    d.putObject(s2t("to"), s2t("layerEffects"), fx);
    executeAction(s2t("set"), d, DialogModes.NO);
}

function checkDesc(d) {
    var s2t = stringIDToTypeID,
        t2s = typeIDToStringID;

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
    var s2t = stringIDToTypeID,
        t2s = typeIDToStringID;

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
