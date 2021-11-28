/**Layer Selections based on parts of the layername
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/layer-selections-based-on-parts-of-the-layername/m-p/11116345
 */
#target photoshop

s2t = stringIDToTypeID;

(ref = new ActionReference()).putProperty(s2t('property'), p = s2t('numberOfLayers'));
ref.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
var len = executeActionGet(ref).getInteger(p);

var lrs = {}
for (var i = 1; i <= len; i++) {
    (ref = new ActionReference()).putProperty(s2t('property'), p = s2t('name'));
    ref.putIndex(s2t('layer'), i);
    n = executeActionGet(ref).getString(p).split('_');

    if (n.length > 1) {
        (ref = new ActionReference()).putProperty(s2t('property'), p = s2t('layerID'));
        ref.putIndex(s2t('layer'), i);
        var id = executeActionGet(ref).getInteger(p),
            tag = n[n.length - 2]
        if (lrs[tag]) lrs[tag].push(id) else lrs[tag] = [id]
    }
}

for (a in lrs) {
    selectLayerByIDList(lrs[a])
    groupSelectedLrs(a)
}

function selectLayerByIDList(IDList) {
    var ref = new ActionReference()
    for (var i = 0; i < IDList.length; i++) {
        ref.putIdentifier(s2t("layer"), IDList[i])
    }
    var desc = new ActionDescriptor()
    desc.putReference(s2t("null"), ref)
    executeAction(s2t("select"), desc, DialogModes.NO)
}

function groupSelectedLrs(tag) {
    (ref = new ActionReference()).putClass(s2t("layerSection"));
    (desc = new ActionDescriptor()).putReference(s2t("null"), ref);
    (ref1 = new ActionReference()).putEnumerated(s2t("layer"), s2t("ordinal"), s2t("targetEnum"));
    desc.putReference(s2t("from"), ref1);
    (desc1 = new ActionDescriptor()).putString(s2t("name"), tag);
    desc.putObject(s2t("using"), s2t("layerSection"), desc1);
    executeAction(s2t("make"), desc, DialogModes.NO);
}