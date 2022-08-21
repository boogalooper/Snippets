/**Save an image so it's width & height are divisible by a required number?
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/save-an-image-so-it-s-width-amp-height-are-divisible-by-a-required-number/td-p/12819944
 */
#target photoshop;
var s2t = stringIDToTypeID,
    res = executeActionGet(getPropertyRef(p = s2t('resolution'))).getUnitDoubleValue(p),
    w = executeActionGet(getPropertyRef(p = s2t('width'))).getUnitDoubleValue(p) * res / 72,
    h = executeActionGet(getPropertyRef(p = s2t('height'))).getUnitDoubleValue(p) * res / 72;
(d = new ActionDescriptor()).putUnitDouble(s2t('width'), s2t('pixelsUnit'), (Math.ceil(w / 16)) * 16);
d.putUnitDouble(s2t('height'), s2t('pixelsUnit'), (Math.ceil(h / 16)) * 16);
d.putEnumerated(s2t('horizontal'), s2t('horizontalLocation'), s2t('center'));
d.putEnumerated(s2t('vertical'), s2t('verticalLocation'), s2t('center'));
executeAction(s2t('canvasSize'), d, DialogModes.NO);
function getPropertyRef(property) {
    (r = new ActionReference()).putProperty(s2t('property'), property);
    r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
    return r;
}