/** Reselect layers, preserve the visibility of the layer (even if it was changed during the script).
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/script-to-expand-all-groups-not-working-if-group-is-empty/m-p/13502749#M700116
 */

var currentLayersState = getLayersVisiblity();
// some code here
setLayersVisiblity(currentLayersState)

function getLayersVisiblity() {
    var s2t = stringIDToTypeID,
        t2s = typeIDToStringID;
    (r = new ActionReference()).putProperty(s2t('property'), p = s2t('targetLayersIDs'));
    r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
    var targetLayers = executeActionGet(r).getList(p),
        seletion = [],
        visiblity = {};
    for (var i = 0; i < targetLayers.count; i++) seletion.push(targetLayers.getReference(i).getIdentifier());
    (r = new ActionReference()).putProperty(s2t('property'), p = s2t('numberOfLayers'));
    r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
    var len = executeActionGet(r).getInteger(p);
    for (var i = 1; i <= len; i++) {
        (r = new ActionReference()).putProperty(s2t('property'), p = s2t('layerSection'));
        r.putIndex(s2t('layer'), i);
        if (t2s(executeActionGet(r).getEnumerationValue(p)) == 'layerSectionEnd') continue;
        (r = new ActionReference()).putProperty(s2t('property'), p = s2t('layerID'));
        r.putIndex(s2t('layer'), i);
        var id = executeActionGet(r).getInteger(p);
        (r = new ActionReference()).putProperty(s2t('property'), p = s2t('visible'));
        r.putIndex(s2t('layer'), i);
        var visible = executeActionGet(r).getBoolean(p);
        visiblity[id] = visible;
    }
    return { selection: seletion, visiblity: visiblity }
}
function setLayersVisiblity(layersStateObject) {
    var s2t = stringIDToTypeID;
    for (var a in layersStateObject.visiblity) {
        makeVisible = layersStateObject.visiblity[a] ? "show" : "hide";
        (r = new ActionReference()).putIdentifier(s2t('layer'), a);
        (d = new ActionDescriptor()).putReference(s2t('target'), r);
        executeAction(s2t(makeVisible), d, DialogModes.NO);
    }
    if (layersStateObject.selection.length) {
        var r = new ActionReference()
        for (var i = 0; i < layersStateObject.selection.length; i++)
            r.putIdentifier(s2t("layer"), layersStateObject.selection[i]);
        (d = new ActionDescriptor()).putReference(s2t("target"), r);
        d.putBoolean(s2t("makeVisible"), false);
        executeAction(s2t("select"), d, DialogModes.NO);
    } else {
        (r = new ActionReference()).putEnumerated(s2t("layer"), s2t('ordinal'), s2t('targetEnum'));
        (d = new ActionDescriptor()).putReference(s2t('target'), r);
        executeAction(s2t('selectNoLayers'), d, DialogModes.NO);
    }
}