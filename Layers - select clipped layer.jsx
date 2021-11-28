/**Go to the top-most layer in a set of clipping masked-layers 
 * https://community.adobe.com/t5/photoshop-ecosystem/go-to-the-top-most-layer-in-a-set-of-clipping-masked-layers/m-p/12230092
*/
#target photoshop

s2t = stringIDToTypeID;

var idx = getTagetLayerIndex() + (isGrouped() ? 0 : 1);

if (isGrouped(idx)) {
    while (isGrouped(++idx)) { }
    selectLayerByIndex(idx - 2)
    addLayer(true)
}

function isGrouped(index) {
    (r = new ActionReference()).putProperty(s2t('property'), p = s2t('group'));
    index != undefined ? r.putIndex(s2t('layer'), index)
        : r.putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
    try { return executeActionGet(r).getBoolean(p) } catch (e) { return null }
}

function getTagetLayerIndex() {
    (r = new ActionReference()).putProperty(s2t('property'), p = s2t('itemIndex'));
    r.putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
    var idx = executeActionGet(r).getInteger(p);
    (r = new ActionReference()).putProperty(s2t('property'), p = s2t('hasBackgroundLayer'));
    r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
    return idx - (executeActionGet(r).getBoolean(p) ? 1 : 0);
}

function selectLayerByIndex(index) {
    (r = new ActionReference()).putIndex(s2t('layer'), index);
    (d = new ActionDescriptor()).putReference(s2t('null'), r);
    executeAction(s2t('select'), d, DialogModes.NO)
}

function addLayer(group) {
    group = group == undefined ? false : true;
    (r = new ActionReference()).putClass(s2t('layer'));
    (d = new ActionDescriptor()).putReference(s2t('null'), r);
    (d1 = new ActionDescriptor()).putBoolean(s2t('group'), group);
    d.putObject(s2t('using'), s2t('layer'), d1);
    executeAction(s2t('make'), d, DialogModes.NO);
}