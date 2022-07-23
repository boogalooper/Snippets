/**Clicking on a type layer in the layers palette selects the layer mask by default
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/clicking-on-a-type-layer-in-the-layers-palette-selects-the-layer-mask-by-default/td-p/12992297
 * https://youtu.be/9InXfjoNGuA
 */
#target photoshop
var s2t = stringIDToTypeID,
    t2s = typeIDToStringID;
try {
    var target = t2s(arguments[0].getReference(s2t('null')).getDesiredClass());
    if (target == 'layer') {
        var id = arguments[0].getInteger(s2t('layerID'));
        (r = new ActionReference()).putProperty(s2t('property'), p = s2t('layerKind'));
        r.putIdentifier(s2t("layer"), id);
        if (executeActionGet(r).getInteger(p) == 3) {
            (r = new ActionReference()).putProperty(s2t('property'), p = s2t('hasUserMask'));
            r.putIdentifier(s2t("layer"), id);
            if (executeActionGet(r).getBoolean(p)) {
                (r = new ActionReference()).putEnumerated(s2t("channel"), s2t("channel"), s2t('RGB'));
                (d = new ActionDescriptor).putReference(s2t("null"), r);
                executeAction(s2t("select"), d, DialogModes.NO);
            }
        }
    }
} catch (e) { }
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
