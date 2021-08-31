#target photoshop

var s2t = stringIDToTypeID;

(r = new ActionReference()).putProperty(s2t('property'), p = s2t('targetLayersIDs'));
r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
var lrs = executeActionGet(r).getList(p),
    colors = [];

for (var i = 0; i < lrs.count; i++) {
    (r = new ActionReference()).putProperty(s2t('property'), p = s2t('adjustment'))
    r.putIdentifier(s2t('contentLayer'), lrs.getReference(i).getIdentifier(s2t('layerID')));
    colors.push(executeActionGet(r).getList(p).getObjectValue(0))
}

for (var i = 0; i < lrs.count; i++) {
    (r = new ActionReference()).putIdentifier(s2t('contentLayer'), lrs.getReference(i).getIdentifier(s2t('layerID')));
    (d = new ActionDescriptor()).putReference(s2t('null'), r);
    d.putObject(s2t("to"), s2t("solidColorLayer"), colors.pop());
    executeAction(s2t("set"), d, DialogModes.NO);
}
