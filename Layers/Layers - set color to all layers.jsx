/**
 * Target action in javascript to specific layer instead of current layer
 * https://community.adobe.com/t5/photoshop/target-action-in-javascript-to-specific-layer-instead-of-current-layer/m-p/11099899
 */
#target photoshop
s2t = stringIDToTypeID;
(ref = new ActionReference()).putProperty(s2t('property'), p = s2t('numberOfLayers'));
ref.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
var len = executeActionGet(ref).getInteger(p)
var ids = []
for (var i = 1; i <= len; i++) {
    (ref = new ActionReference()).putProperty(s2t('property'), p = s2t('layerID'));
    ref.putIndex(s2t('layer'), i);
    ids.push(executeActionGet(ref).getInteger(p))
}
selectLayerByIDList(ids)
setLayerLabelCol('violet')
function selectLayerByIDList(IDList) {
    var ref = new ActionReference()
    for (var i = 0; i < IDList.length; i++) { ref.putIdentifier(s2t('layer'), IDList[i]) }
    (desc = new ActionDescriptor()).putReference(s2t('null'), ref)
    desc.putEnumerated(s2t('selectionModifier'), s2t('addToSelectionContinuous'), s2t('addToSelection'))
    executeAction(s2t('select'), desc, DialogModes.NO)
}
function setLayerLabelCol(labelCol) {
    /*
        No Color = "none"
        Red = "red"
        Orange = "orange"
        Yellow = "yellowColor"
        Green = "green"
        Blue = "blue"
        Violet = "violet"
        Gray = "gray"
    */
    (ref = new ActionReference).putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
    (desc = new ActionDescriptor()).putReference(s2t('null'), ref);
    (desc1 = new ActionDescriptor()).putEnumerated(s2t('color'), s2t('color'), s2t(labelCol));
    desc.putObject(s2t('to'), s2t('layer'), desc1);
    executeAction(s2t('set'), desc, DialogModes.NO);
}