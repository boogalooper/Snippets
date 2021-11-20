#target photoshop

s2t = stringIDToTypeID;

renameGroup('Cover', 'Cover Group')

function renameGroup(from, to) {
    (ref = new ActionReference()).putProperty(s2t('property'), p = s2t('numberOfLayers'));
    ref.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
    var len = executeActionGet(ref).getInteger(p);
    for (var i = 1; i <= len; i++) {
        (r = new ActionReference()).putProperty(s2t('property'), p = s2t('layerSection'));
        r.putIndex(s2t('layer'), i);
        if (typeIDToStringID(executeActionGet(r).getEnumerationValue(p)) == 'layerSectionEnd') continue;

        (r = new ActionReference()).putProperty(s2t('property'), p = s2t('layerKind'));
        r.putIndex(s2t('layer'), i);
        if (executeActionGet(r).getInteger(p) != 7) continue;

        (ref = new ActionReference()).putProperty(s2t('property'), p = s2t('name'));
        ref.putIndex(s2t('layer'), i);
        if (executeActionGet(ref).getString(p).match(new RegExp(from, 'i'))) {
            (r = new ActionReference()).putIndex(s2t('layer'), i);
            (d = new ActionDescriptor()).putReference(s2t('null'), r);
            (d1 = new ActionDescriptor()).putString(s2t('name'), to);
            d.putObject(s2t('to'), s2t('layer'), d1);
            executeAction(s2t('set'), d, DialogModes.NO);
        }
    }
}