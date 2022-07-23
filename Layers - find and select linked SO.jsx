/**ADD CODE TO LOOP OVER ALL LAYERS & PROCESS ONLY LINKED SO LAYERS!
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/how-to-relink-files-in-multiple-photoshop-files/td-p/13011537
 */
#target photoshop
s2t = stringIDToTypeID;
(r = new ActionReference()).putProperty(s2t('property'), p = s2t('numberOfLayers'));
r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
var len = executeActionGet(r).getInteger(p),
    linkedLayers = [];
for (var i = 1; i <= len; i++) {
    (r = new ActionReference()).putProperty(s2t('property'), p = s2t('layerSection'));
    r.putIndex(s2t('layer'), i);
    if (typeIDToStringID(executeActionGet(r).getEnumerationValue(p)) == 'layerSectionEnd') continue;
    (r = new ActionReference()).putProperty(s2t('property'), p = s2t('layerKind'));
    r.putIndex(s2t('layer'), i);
    if (executeActionGet(r).getInteger(p) == 5) {
        (r = new ActionReference()).putProperty(s2t('property'), p = s2t('smartObject'));
        r.putIndex(s2t('layer'), i);
        if (executeActionGet(r).getObjectValue(p).getBoolean(s2t('linked'))) {
            (r = new ActionReference()).putProperty(s2t('property'), p = s2t('layerID'));
            r.putIndex(s2t('layer'), i);
            linkedLayers.push(executeActionGet(r).getInteger(p))
        }
    };
}
alert('linkedLayersIDs:\n' + linkedLayers.toSource())
do {
    (r = new ActionReference()).putIdentifier(s2t("layer"), linkedLayers.shift());
    (d = new ActionDescriptor()).putReference(s2t("target"), r);
    executeAction(s2t("select"), d, DialogModes.NO);
    alert('linked layer ' + d.getReference(s2t('target')).getIdentifier(s2t('layer')) + ' selected!')
} while (linkedLayers.length)