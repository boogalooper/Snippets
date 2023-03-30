/**
 * Cycle through layer masks 
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/cycle-through-layer-masks/td-p/13689450
 */
const reverseOrder = false; // true - layers pass from top to bottom, false - from bottom to top
var s2t = stringIDToTypeID,
    layerMasks = [];
(r = new ActionReference()).putProperty(s2t('property'), p = s2t('hasBackgroundLayer'));
r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
var offset = executeActionGet(r).getBoolean(p) ? 1 : 0;
(r = new ActionReference()).putProperty(s2t('property'), p = s2t('numberOfLayers'));
r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
var to = executeActionGet(r).getInteger(p);
(r = new ActionReference()).putProperty(s2t('property'), p = s2t('itemIndex'));
r.putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
var activeLayer = executeActionGet(r).getInteger(p) - offset;
for (var i = 1; i <= to; i++) {
    (r = new ActionReference()).putProperty(s2t('property'), p = s2t('layerKind'));
    r.putIndex(s2t('layer'), i);
    if (executeActionGet(r).getInteger(p) != 13) {
        (r = new ActionReference()).putProperty(s2t('property'), p = s2t('hasUserMask'));
        r.putIndex(s2t('layer'), i);
        if (executeActionGet(r).getBoolean(p)) layerMasks.push(i)
    }
}
if (reverseOrder) layerMasks.reverse()
var i = 0;
if (layerMasks.length) {
    do {
        if (i == layerMasks.length) { i = 0; activeLayer = reverseOrder ? to + 1 : 0 }
        if (reverseOrder ? layerMasks[i] < activeLayer : layerMasks[i] > activeLayer) { activeLayer = layerMasks[i]; break; }
        i++
    } while (true)
    (r = new ActionReference()).putIndex(s2t("layer"), activeLayer);
    (d = new ActionDescriptor()).putReference(s2t("target"), r)
    executeAction(s2t("select"), d, DialogModes.NO);
    (r = new ActionReference()).putEnumerated(s2t("channel"), s2t('channel'), s2t('mask'));
    (d = new ActionDescriptor()).putReference(s2t('target'), r);
    executeAction(s2t('select'), d, DialogModes.NO);
}