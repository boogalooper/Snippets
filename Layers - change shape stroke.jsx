/**Photoshop script to iterate through all layers and change shape stroke size!??!
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/photoshop-script-to-iterate-through-all-layers-and-change-shape-stroke-size/td-p/12689665
 */
#target photoshop

var s2t = stringIDToTypeID,
    delta = 10;

(r = new ActionReference()).putProperty(s2t('property'), p = s2t('numberOfLayers'));
r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
var len = executeActionGet(r).getInteger(p),
    lrs = [];

for (var i = 1; i <= len; i++) {
    (r = new ActionReference()).putProperty(s2t('property'), p = s2t('layerKind'));
    r.putIndex(s2t('layer'), i);
    if (executeActionGet(r).getInteger(p) == 4) {

        (r = new ActionReference()).putProperty(s2t('property'), p = s2t('layerID'));
        r.putIndex(s2t('layer'), i);
        lrs.push(executeActionGet(r).getInteger(p));
    }
}

if (lrs.length) {
    for (var i = 0; i < lrs.length; i++) {
        (r = new ActionReference()).putIdentifier(s2t('layer'), lrs[i]);
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        executeAction(s2t('select'), d, DialogModes.NO);

        (r = new ActionReference()).putProperty(s2t('property'), p = s2t('AGMStrokeStyleInfo'));
        r.putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
        var strokeSize = executeActionGet(r).getObjectValue(p).getUnitDoubleValue(s2t('strokeStyleLineWidth'));

        (r = new ActionReference()).putEnumerated(s2t("contentLayer"), s2t("ordinal"), s2t("targetEnum"));
        (d = new ActionDescriptor()).putReference(s2t("null"), r);
        (d1 = new ActionDescriptor()).putUnitDouble(s2t("strokeStyleLineWidth"), s2t("pixelsUnit"), strokeSize + delta);
        (d2 = new ActionDescriptor()).putObject(s2t("strokeStyle"), s2t("strokeStyle"), d1);
        d.putObject(s2t("to"), s2t("shapeStyle"), d2);
        executeAction(s2t("set"), d, DialogModes.NO);
    }
}