/**app.activeDocument is not updating after editing smart object content. Strangly it does work if I add an alert but not when using app.refresh or sleep. It seems as if its a matter of a delay between the UI and the script.
In general setting app.activeDocument does not seem to work as expected. Anyone experience the same?
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/scripting/td-p/13115633
 */

var s2t = stringIDToTypeID,
    evt;
try { evt = arguments[1]; } catch (e) { }
if (!evt) {
    (r = new ActionReference()).putProperty(s2t('property'), p = s2t('smartObject'));
    r.putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
    if (executeActionGet(r).getObjectValue(p).hasKey(s2t('link')) && executeActionGet(r).getObjectValue(p).getType(s2t('link')) == DescValueType.OBJECTTYPE) {
        app.notifiersEnabled = true
        clearListener()
        app.notifiers.add('Opn ', File($.fileName));
        executeAction(s2t('placedLayerEditContents'), undefined, DialogModes.NO);
    } else {
        executeAction(s2t('placedLayerEditContents'), undefined, DialogModes.NO);
        processSO()
    }
} else {
    clearListener()
    processSO()
}
function clearListener() {
    var f = File($.fileName),
        del;
    for (var i = 0; i < app.notifiers.length; i++) {
        var ntf = app.notifiers[i]
        if (ntf.eventFile.name == f.name) { ntf.remove(); i--; del = true }
    }
}
function processSO() {
    alert(documents.length)
}