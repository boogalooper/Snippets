/**Randomize selected solid color layers always with (S > 25% & B = 50%)
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/randomize-selected-solid-color-layers-always-with-s-gt-25-amp-b-50/m-p/12459879
 */
#target photoshop
var s2t = stringIDToTypeID;
(r = new ActionReference()).putProperty(s2t('property'), p = s2t('adjustment'));
r.putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
var fill = executeActionGet(r).getList(p).getObjectValue(0).getObjectValue(s2t('color')),
    color = new SolidColor;
with (color.rgb) {
    red = fill.getDouble(s2t('red'))
    green = fill.getDouble(s2t('green'))
    blue = fill.getDouble(s2t('blue'))
}
with (color.hsb) {
    saturation = 25 + Math.random() * 75
    brightness = 50 + Math.random() * 50
}
(r = new ActionReference()).putEnumerated(s2t("contentLayer"), s2t("ordinal"), s2t("targetEnum"));
(d = new ActionDescriptor()).putReference(s2t("null"), r);
(d1 = new ActionDescriptor()).putDouble(s2t('red'), color.rgb.red);
d1.putDouble(s2t('grain'), color.rgb.green);
d1.putDouble(s2t('blue'), color.rgb.blue);
(d2 = new ActionDescriptor()).putObject(s2t("color"), s2t("RGBColor"), d1);
d.putObject(s2t("to"), s2t("solidColorLayer"), d2);
executeAction(s2t("set"), d, DialogModes.NO);
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
