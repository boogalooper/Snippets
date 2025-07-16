
/**
 * Script to Change Brush Blend Mode 
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/script-to-change-brush-blend-mode/td-p/15414719
 */

setPaintbrushBlendMode('color');

function setPaintbrushBlendMode(mode) {
    var s2t = stringIDToTypeID;
    (r = new ActionReference()).putProperty(s2t('property'), p = s2t('tool'));
    r.putEnumerated(s2t('application'), s2t('ordinal'), s2t('targetEnum'));
    if (executeActionGet(r).getEnumerationType(p) == s2t('paintbrushTool')) {
        var cto = executeActionGet(r).getObjectValue(s2t('currentToolOptions'));
        cto.putEnumerated(s2t('mode'), s2t('blendMode'), s2t(mode));
        (r = new ActionReference()).putClass(s2t('paintbrushTool'));
        (d1 = new ActionDescriptor()).putReference(s2t('target'), r);
        d1.putObject(s2t('to'), s2t('target'), cto);
        executeAction(s2t('set'), d1, DialogModes.NO);
    }
}