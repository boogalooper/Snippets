/**Automatic creation of a selection when a layer is activated 
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/choose-a-layer-and-make-it-a-selection/td-p/12795014
 * https://youtu.be/gBOgKLuQX8s
 */

#target photoshop

var s2t = stringIDToTypeID,
    t2s = typeIDToStringID;
try {
    var target = t2s(arguments[0].getReference(s2t('null')).getDesiredClass());
    if (target == 'layer' && (ScriptUI.environment.keyboardState.ctrlKey || ScriptUI.environment.keyboardState.metaKey)) {
        (d = new ActionDescriptor()).putReference(s2t('target'), (function () { (r = new ActionReference()).putProperty(t = s2t('channel'), s2t('selection')); return r }()));
        d.putReference(s2t('to'),  function(){(r = new ActionReference()).putEnumerated(t, t, s2t('transparencyEnum')); return r}());
        executeAction(s2t('set'), d, DialogModes.NO);
    }
} catch (e) { alert(e) }
if (!target) {
    var f = File($.fileName),
        del;
    for (var i = 0; i < app.notifiers.length; i++) {
        var ntf = app.notifiers[i]
        if (ntf.eventFile.name == f.name) { ntf.remove(); i--; del = true }
    }
    if (del) {
        alert('event listening disabled!')
    } else {
        app.notifiers.add('slct', f, 'Lyr ')
        alert('event listening enabled!')
    }
}
