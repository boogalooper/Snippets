/**
 * Close Document event not firing when executed from an action
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/close-document-event-not-firing-when-executed-from-an-action/td-p/13403120
 */

#target photoshop
var s2t = stringIDToTypeID;
try { var evt = arguments[0] } catch (e) { }
if (evt) {
    var action = evt.getReference(s2t('target')).getName(),
        set = evt.getReference(s2t('target')).getContainer().getName();
    (r = new ActionReference()).putName(s2t('action'), action);
    r.putName(s2t('actionSet'), set);
    var numberOfChildren = executeActionGet(r).getInteger(s2t('numberOfChildren')),
        found = false;
    for (var i = 1; i <= numberOfChildren; i++) {
        (r = new ActionReference()).putIndex(s2t('command'), i),
            r.putName(s2t('action'), action);
        r.putName(s2t('actionSet'), set);
        if (executeActionGet(r).getString(s2t('name')) == localize("$$$/Actions/Event/Close")) {
            found = true;
            break;
        }
    }
    alert('Fired Set: ' + set + '\nAction: ' + action + (found ? '\n\n Close command found!' : '\n\n Close command not found!'))
} else {
    app.notifiers.add('Ply ', File($.fileName))
    app.notifiersEnabled = true
}