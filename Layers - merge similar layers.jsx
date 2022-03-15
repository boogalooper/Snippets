/**Объединяем слои с одинаковыми именами
 * https://community.adobe.com/t5/photoshop/need-a-script-for-merging-layers-with-the-same-names/m-p/11468541
 */
#target photoshop
s2t = stringIDToTypeID;
(r = new ActionReference()).putProperty(s2t('property'), p = s2t('numberOfLayers'));
r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
var len = executeActionGet(r).getInteger(p),
    lrs = {};
for (var i = 1; i <= len; i++) {
    (r = new ActionReference()).putProperty(s2t('property'), p = s2t('layerSection'));
    r.putIndex(s2t('layer'), i);
    if (typeIDToStringID(executeActionGet(r).getEnumerationValue(p)) == 'layerSectionEnd') continue;
    (r = new ActionReference()).putProperty(s2t('property'), p = s2t('name'));
    r.putIndex(s2t('layer'), i);
    var n = executeActionGet(r).getString(p);
    (r = new ActionReference()).putProperty(s2t('property'), p = s2t('layerID'));
    r.putIndex(s2t('layer'), i);
    var id = executeActionGet(r).getInteger(p);
    lrs[n].push(id) 
}
for (a in lrs) {
    if (lrs[a].length > 1) {
        selectLayerByIDList(lrs[a])
        executeAction(s2t("mergeLayersNew"), new ActionDescriptor(), DialogModes.NO);
    }
}
function selectLayerByIDList(IDList) {
    var r = new ActionReference()
    for (var i = 0; i < IDList.length; i++) {
        r.putIdentifier(s2t("layer"), IDList[i])
    }
    var d = new ActionDescriptor()
    d.putReference(s2t("null"), r)
    executeAction(s2t("select"), d, DialogModes.NO)
}