/**Renaming a layer after the name of the brush used to paint on it 
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/javascript-get-current-brush-shape-name/td-p/12783812
 * https://youtu.be/kc9qTR5ms2c
 * 
 * Script renames current layer to brush preset's name
 * Usage:
 * - save script in file
 * - first run: event listener enabled
 * - next run: event listener disabled
 */
#target photoshop
var s2t = stringIDToTypeID,
    t2s = typeIDToStringID;
try {
    var target = t2s(arguments[0].getReference(s2t('null')).getDesiredClass());
    if (target == 'brush') {
        (r = new ActionReference()).putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
        (d = new ActionDescriptor()).putReference(s2t('target'), r);
        (d1 = new ActionDescriptor()).putString(s2t('name'), arguments[0].getReference(s2t('null')).getName());
        d.putObject(s2t('to'), s2t('layer'), d1);
        executeAction(s2t('set'), d, DialogModes.NO);
    }
} catch (e) { }
if (!target) {
    app.notifiersEnabled = true
    var f = File($.fileName),
        deleted;
    for (var i = 0; i < app.notifiers.length; i++) {
        var ntf = app.notifiers[i]
        if (ntf.eventFile.name == f.name) { ntf.remove(); i--; deleted = true }
    }
    if (deleted) {
        alert('event listening disabled!')
    } else {
        app.notifiers.add('slct', f)
        alert('event listening enabled!')
    }
}
