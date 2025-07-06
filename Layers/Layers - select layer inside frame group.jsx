/*
How to select the smart object layer in the frame
https://community.adobe.com/t5/photoshop-ecosystem-discussions/how-to-select-the-smart-object-layer-in-the-frame/td-p/15402861
*/
//activeDocument.activeLayer = activeDocument.activeLayer.layers[0]

s2t = stringIDToTypeID;
(r = new ActionReference()).putProperty(s2t('property'), p = s2t('framedGroup'));
r.putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
if (executeActionGet(r).hasKey(p)) {
    (r = new ActionReference()).putProperty(s2t('property'), p = s2t('itemIndex'));
    r.putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
    (r1 = new ActionReference()).putIndex(s2t("layer"), executeActionGet(r).getInteger(p) - 2);
    (d = new ActionDescriptor()).putReference(s2t("target"), r1);
    executeAction(s2t("select"), d, DialogModes.NO);
}