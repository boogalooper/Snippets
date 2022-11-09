
/**
 * Dodge/Burn exposure setting - Shortcut Keys?
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/dodge-burn-exposure-setting-shortcut-keys/m-p/13309268#M681959
 */

/**
 * increase exposure value:
- regular launch +1%
- launch with the shift pressed + 10%
 */
#target photoshop;
var s2t = stringIDToTypeID,
    t2s = typeIDToStringID;
(r = new ActionReference()).putProperty(s2t('property'), p = s2t('tool'));
r.putEnumerated(s2t('application'), s2t('ordinal'), s2t('targetEnum'));
var tool = executeActionGet(r);
var t = t2s(tool.getEnumerationType(s2t('tool')));
if (t == 'burnInTool' || t == 'dodgeTool') {
    var cur = tool.getObjectValue(s2t('currentToolOptions')).getInteger(p = s2t('exposure'));;
    (d = new ActionDescriptor()).putInteger(p, ScriptUI.environment.keyboardState.shiftKey ? (cur + 10 > 100 ? 100 : cur + 10) : (cur + 1 > 100 ? 100 : cur + 1));
    d.putBoolean(s2t('useScatter'), tool.getObjectValue(s2t('currentToolOptions')).getBoolean(s2t('useScatter')));
    (r = new ActionReference()).putClass(s2t(t));
    (params = new ActionDescriptor()).putReference(s2t('target'), r);
    params.putObject(s2t('to'), s2t('target'), d);
    executeAction(s2t('set'), params, DialogModes.NO);
}


/**
 * decrease exposure value:
- regular launch -1%
- launch with the shift pressed -10%
 */
#target photoshop;
var s2t = stringIDToTypeID,
    t2s = typeIDToStringID;
(r = new ActionReference()).putProperty(s2t('property'), p = s2t('tool'));
r.putEnumerated(s2t('application'), s2t('ordinal'), s2t('targetEnum'));
var tool = executeActionGet(r);
var t = t2s(tool.getEnumerationType(s2t('tool')));
if (t == 'burnInTool' || t == 'dodgeTool') {
    var cur = tool.getObjectValue(s2t('currentToolOptions')).getInteger(p = s2t('exposure'));;
    (d = new ActionDescriptor()).putInteger(p, ScriptUI.environment.keyboardState.shiftKey ? (cur - 10 < 1 ? 1 : cur - 10) : (cur - 1 < 1 ? 1 : cur - 1));
    d.putBoolean(s2t('useScatter'), tool.getObjectValue(s2t('currentToolOptions')).getBoolean(s2t('useScatter')));
    (r = new ActionReference()).putClass(s2t(t));
    (params = new ActionDescriptor()).putReference(s2t('target'), r);
    params.putObject(s2t('to'), s2t('target'), d);
    executeAction(s2t('set'), params, DialogModes.NO);
}