/** Smudge tool "finger painting" option shortcut
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/smudge-tool-quot-finger-painting-quot-option-shortcut/m-p/12462498
*/
#target photoshop;

var s2t = stringIDToTypeID,
    t2s = typeIDToStringID,
    c2t = charIDToTypeID;

(r = new ActionReference()).putProperty(s2t('property'), p = s2t('tool'));
r.putEnumerated(s2t('application'), s2t('ordinal'), s2t('targetEnum'));
var tool = executeActionGet(r);
var t = t2s(tool.getEnumerationType(s2t('tool')));
if (t == 'smudgeTool') {
    (d = new ActionDescriptor()).putBoolean(c2t('SmdF'), !tool.getObjectValue(s2t('currentToolOptions')).getBoolean(c2t('SmdF')));
    d.putBoolean(s2t('useScatter'), tool.getObjectValue(s2t('currentToolOptions')).getBoolean(s2t('useScatter')));
        (r = new ActionReference()).putClass(s2t(t));
    (d1 = new ActionDescriptor()).putReference(s2t('target'), r);
    d1.putObject(s2t('to'), s2t('target'), d);
    executeAction(s2t('set'), d1, DialogModes.NO);
}
