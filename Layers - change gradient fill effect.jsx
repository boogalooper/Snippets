/**Modify a “LayerEffects” object
 * https://community.adobe.com/t5/photoshop-ecosystem/modify-a-layereffects-object/m-p/12196380#M567928
 */
#target photoshop

changeFill([255, 0, 0], [0, 255, 0], [0, 0, 255]); // [R, G, B] values

function changeFill() {
    s2t = stringIDToTypeID;

    (r = new ActionReference()).putProperty(s2t('property'), p = s2t('layerEffects'));
    r.putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
    if (executeActionGet(r).hasKey(p)) var fx = executeActionGet(r).getObjectValue(p);

    if (fx && fx.hasKey(p = s2t('gradientFill'))) {
        var gradientFill = fx.getObjectValue(p),
            gradient = gradientFill.getObjectValue(s2t('gradient')),
            colors = gradient.getList(s2t('colors'));

        if (arguments.length == colors.count) {
            var newColors = new ActionList();
            for (var i = 0; i < colors.count; i++) {
                var currentColor = colors.getObjectValue(i);
                (d = new ActionDescriptor()).putDouble(s2t('red'), arguments[i][0]);
                d.putDouble(s2t('green'), arguments[i][1]);
                d.putDouble(s2t('blue'), arguments[i][2]);
                currentColor.putObject(s2t('color'), s2t('RGBColor'), d)
                newColors.putObject(s2t('colorStop'), currentColor)
            }

            gradient.putList(s2t('colors'), newColors)
            gradientFill.putObject(s2t('gradient'), s2t('gradientClassEvent'), gradient);
            fx.putObject(s2t('gradientFill'), s2t('gradientFill'), gradientFill);
            (d = new ActionDescriptor()).putReference(s2t('null'), r);
            d.putObject(s2t('to'), s2t('layerEffects'), fx);
            executeAction(s2t('set'), d, DialogModes.NO);
        }
    }
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
