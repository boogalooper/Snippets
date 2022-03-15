/**Растеризовать все смарт объекты, кроме тех которые имеют смарт-эффекты
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/rasterize-all-smart-objects-except-the-ones-with-smart-filters-script/td-p/12775611
 * https://youtu.be/tIgbQESzBaQ
 */
#target photoshop
s2t = stringIDToTypeID;
(r = new ActionReference()).putProperty(s2t('property'), p = s2t('numberOfLayers'));
r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
var len = executeActionGet(r).getInteger(p), lrs = [];
for (var i = 1; i <= len; i++) {
    (r = new ActionReference()).putProperty(s2t('property'), p = s2t('layerKind'));
    r.putIndex(s2t('layer'), i);
    if (executeActionGet(r).getInteger(p) == 5) {
        (r = new ActionReference()).putProperty(s2t('property'), p = s2t('smartObject'));
        r.putIndex(s2t('layer'), i);
        if (!executeActionGet(r).getObjectValue(p).hasKey(s2t('filterFX'))) lrs.push(i)
    }
}
if (lrs.length) {
    var r = new ActionReference()
    for (var i = 0; i < lrs.length; i++) r.putIndex(s2t('layer'), lrs[i]);
    (d = new ActionDescriptor()).putReference(s2t('target'), r);
    executeAction(s2t('select'), d, DialogModes.NO);
    (r = new ActionReference()).putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
    (d = new ActionDescriptor()).putReference(s2t('target'), r);
    executeAction(s2t('rasterizeLayer'), d, DialogModes.NO);
}