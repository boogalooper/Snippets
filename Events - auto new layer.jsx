/**Automatic creation of a new layer when trying to paint with a brush on smart object, custom or text layer
 * The script works with Photoshop's event subsystem, so launching directly from the code editor is not possible - script must be saved to disk. 
 * https://www.youtube.com/watch?v=-vD3xAXAS1w
*/
#target photoshop
var s2t = stringIDToTypeID,
    t2s = typeIDToStringID;
try { var evt = arguments[0] } catch (e) { }
if (evt) {
    try {
        if (evt.hasKey(s2t('title'))) {
            if (evt.getString(s2t('title')) == 'Alert') {
                if (evt.hasKey(s2t('state'))) {
                    if (t2s(evt.getEnumerationValue(s2t('state'))) == 'exit') {
                        (r = new ActionReference()).putProperty(s2t('property'), p = s2t('tool'));
                        r.putEnumerated(s2t('application'), s2t('ordinal'), s2t('targetEnum'));
                        var tool = t2s(executeActionGet(r).getEnumerationType(s2t('tool')));
                        (r = new ActionReference()).putProperty(s2t('property'), p = s2t('layerKind'));
                        r.putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
                        var kind = executeActionGet(r).getInteger(p);
                        if (tool == 'paintbrushTool' && (kind == 2 || kind == 3 || kind == 5)) {
                            (r = new ActionReference()).putClass(s2t("layer"));
                            (d = new ActionDescriptor()).putReference(s2t("null"), r);
                            executeAction(s2t("make"), d, DialogModes.NO);
                        }
                    }
                }
            }
        }
    } catch (e) { }
} else {
    app.notifiersEnabled = true
    var f = File($.fileName)
    app.notifiers.add('modalStateChanged', f)
}