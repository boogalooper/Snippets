#target photoshop
s2t = stringIDToTypeID;


(r = new ActionReference()).putProperty(s2t('property'), p = s2t('numberOfDocuments'));
r.putEnumerated(s2t('application'), s2t('ordinal'), s2t('targetEnum'));
if (executeActionGet(r).getInteger(p)) {
    (r = new ActionReference()).putProperty(s2t('property'), p = s2t('targetLayersIDs'));
    r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
    var sel = executeActionGet(r).getList(p);

    (r = new ActionReference()).putProperty(s2t('property'), p = s2t('numberOfLayers'));
    r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
    var len = executeActionGet(r).getInteger(p);

    (r = new ActionReference()).putProperty(s2t('property'), p = s2t('hasBackgroundLayer'));
    r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
    var offset = executeActionGet(r).getInteger(p);

    (r = new ActionReference()).putIndex(s2t('layer'), 1 - offset);
    (d = new ActionDescriptor()).putReference(s2t('target'), r);
    executeAction(s2t('select'), d, DialogModes.NO);

    var lrs = { id: [], fx: [] };
    for (var i = 1 - offset; i <= len; i++) {
        (r = new ActionReference()).putProperty(s2t('property'), p = s2t('layerKind'));
        r.putIndex(s2t('layer'), i);
        var kind = executeActionGet(r).getInteger(p);
        if (kind == 5) {
            (r = new ActionReference()).putProperty(s2t('property'), p = s2t('layerID'));
            r.putIndex(s2t('layer'), i);
            lrs.id.push(executeActionGet(r).getInteger(p));

            (r = new ActionReference()).putProperty(s2t('property'), p = s2t('layerEffects'));
            r.putIndex(s2t('layer'), i);
            lrs.fx.push(executeActionGet(r).hasKey(p) ? executeActionGet(r).getObjectValue(p) : new ActionDescriptor());

            (d = new ActionDescriptor()).putReference(s2t('target'), r);
            (d1 = new ActionDescriptor()).putObject(s2t('outerGlow'), s2t('outerGlow'), new ActionDescriptor());
            d.putObject(s2t('to'), p, d1);
            executeAction(s2t('set'), d, DialogModes.NO);
        }
    }

    executeAction(s2t('collapseAllGroupsEvent'), new ActionDescriptor(), DialogModes.NO)

    for (var i = 0; i < lrs.id.length; i++) {
        if (lrs.fx[i].count) {
            (r = new ActionReference()).putIdentifier(s2t('layer'), lrs.id[i]);
            (d = new ActionDescriptor()).putReference(s2t('target'), r);
            executeAction(s2t('select'), d, DialogModes.NO);

            (r = new ActionReference()).putProperty(s2t('property'), p = s2t('layerEffects'));
            r.putIdentifier(s2t('layer'), lrs.id[i]);
            d.putObject(s2t('to'), p, lrs.fx[i]);
            executeAction(s2t('set'), d, DialogModes.NO);
        } else {
            (r = new ActionReference()).putIdentifier(s2t('layer'), lrs.id[i]);
            (d = new ActionDescriptor()).putReference(s2t('target'), r);
            executeAction(s2t('disableLayerFX'), d, DialogModes.NO);
        }
    }

    if (sel.count) {
        r = new ActionReference();
        for (var i = 0; i < sel.count; i++) { r.putIdentifier(s2t('layer'), sel.getReference(i).getIdentifier()) }
        (d = new ActionDescriptor()).putReference(s2t('target'), r);
        executeAction(s2t('select'), d, DialogModes.NO);
    }
}