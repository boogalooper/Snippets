#target photoshop
var s2t = stringIDToTypeID;

(r = new ActionReference()).putProperty(s2t('property'), p = s2t('targetLayersIDs'));
r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
var lrs = executeActionGet(r).getList(p);

(r = new ActionReference()).putEnumerated(s2t('action'), s2t('ordinal'), s2t('targetEnum'));
try {
    try {
        var atn = executeActionGet(r).getString(s2t('name')),
            set = executeActionGet(r).getString(s2t('parentName'));
    }
    catch (e) { throw 'Before start select any action from actions palette!' }

    for (var i = 0; i < lrs.count; i++) {
        (r = new ActionReference()).putIdentifier(s2t('layer'), lrs.getReference(i).getIdentifier(s2t('layerID')));
        (d = new ActionDescriptor()).putReference(s2t('target'), r);
        try { executeAction(s2t('select'), d, DialogModes.NO); } catch (e) { throw e + '\nCannot select layer!' }
        (r = new ActionReference()).putName(s2t('action'), atn);
        r.putName(s2t('actionSet'), set);
        (d = new ActionDescriptor()).putReference(s2t('target'), r);
        try { executeAction(s2t('play'), d) } catch (e) { throw e + '\nCannot play action "' + atn + '" from set "' + set + '"' }
    }
} catch (e) { alert(e) }