/**How to get text transform box boundary?
 * @r-bin
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/how-to-get-text-transform-box-boundary/m-p/11159325
 */
#target photoshop;
s2t = stringIDToTypeID;
(r = new ActionReference()).putProperty(s2t('property'), p = s2t('resolution'));
r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
var docRes = executeActionGet(r).getUnitDoubleValue(p);
(r = new ActionReference()).putProperty(s2t('property'), p = s2t('unitsPrefs'));
r.putEnumerated(s2t("application"), s2t("ordinal"), s2t("targetEnum"));
var exactPoints = executeActionGet(r).getObjectValue(p).getBoolean(s2t('exactPoints')) ? 72.27 : 72;
(d = new ActionDescriptor()).putUnitDouble(s2t('resolution'), s2t('densityUnit'), exactPoints);
executeAction(s2t("imageSize"), d, DialogModes.NO);
(r = new ActionReference()).putProperty(s2t('property'), p = s2t('height'))
r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
var docHeight = executeActionGet(r).getUnitDoubleValue(p);
(r = new ActionReference()).putProperty(s2t('property'), p = s2t('width'))
r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
var docWidth = executeActionGet(r).getUnitDoubleValue(p);
(r = new ActionReference()).putProperty(s2t('property'), p = s2t('textKey'))
r.putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
var textKey = executeActionGet(r).getObjectValue(p);
var clickPointH = textKey.getObjectValue(s2t('textClickPoint')).getUnitDoubleValue(s2t('horizontal')),
    clickPointV = textKey.getObjectValue(s2t('textClickPoint')).getUnitDoubleValue(s2t('vertical')),
    clickPointHPx = Math.round(clickPointH / 100 * docWidth),
    clickPointVPx = Math.round(clickPointV / 100 * docHeight);
makeGuide(clickPointHPx, 'vertical')
makeGuide(clickPointVPx, 'horizontal')
if (typeIDToStringID(textKey.getList(s2t('textShape')).getObjectValue(0).getEnumerationValue(s2t('textType'))) != 'box') {
    var bounds = textKey.getObjectValue(s2t('bounds')),
        left = bounds.getUnitDoubleValue(s2t('left')),
        top = bounds.getUnitDoubleValue(s2t('top')),
        right = bounds.getUnitDoubleValue(s2t('right')),
        bottom = bounds.getUnitDoubleValue(s2t('bottom')),
        transform = textKey.hasKey(s2t('transform')) ? textKey.getObjectValue(s2t('transform')) : null,
        xx = transform != null ? transform.getDouble(s2t('xx')) : 1,
        yy = transform != null ? transform.getDouble(s2t('yy')) : 1,
        xy = transform != null ? transform.getDouble(s2t('xy')) : 1,
        yx = transform != null ? transform.getDouble(s2t('xy')) : 1;
    checkDesc(transform)
    makeGuide(left * xx + clickPointHPx, 'vertical');
    makeGuide(top * yy + clickPointVPx, 'horizontal');
    makeGuide(right * xx + clickPointHPx, 'vertical');
    makeGuide(bottom * yy + clickPointVPx, 'horizontal');
}
/*
(d = new ActionDescriptor()).putUnitDouble(s2t('resolution'), s2t('densityUnit'), docRes);
executeAction(s2t("imageSize"), d, DialogModes.NO);*/
function makeGuide(position, orientation) {
    (d1 = new ActionDescriptor()).putUnitDouble(s2t("position"), s2t("pixelsUnit"), position);
    d1.putEnumerated(s2t("orientation"), s2t("orientation"), s2t(orientation));
    d1.putEnumerated(s2t("kind"), s2t("kind"), s2t("document"));
    (d = new ActionDescriptor()).putObject(s2t("new"), s2t("guide"), d1);
    (r = new ActionReference()).putClass(s2t("guide"));
    d.putReference(s2t("null"), r);
    executeAction(s2t("make"), d, DialogModes.NO);
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
                "_" + t2s(desc.getObjectType(kTypeID)));
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
                "_" + t2s(desc.getUnitDoubleType(kTypeID)));
            break;
        case DescValueType.ENUMERATEDTYPE:
            return (t2s(desc.getEnumerationValue(kTypeID)) +
                "_" + t2s(desc.getEnumerationType(kTypeID)));
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
function s2t(s) { return stringIDToTypeID(s) }
function t2s(t) { return typeIDToStringID(t) }