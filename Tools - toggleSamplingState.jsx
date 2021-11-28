/**Toggle “Sample Current Layer” option of eyedroppper
 * https://community.adobe.com/t5/photoshop-ecosystem/toggle-sample-current-layer-option-of-eyedroppper/m-p/12238757
 */
#target photoshop
var s2t = stringIDToTypeID;

(ref = new ActionReference()).putProperty(s2t('property'), p = s2t('tool'));
ref.putEnumerated(s2t('application'), s2t('ordinal'), s2t('targetEnum'));
var cTool = executeActionGet(ref).getEnumerationType(p);

(selectTool = function (tool) {
    (r = new ActionReference()).putClass(tool);
    (d = new ActionDescriptor()).putReference(s2t('target'), r);
    executeAction(s2t('select'), d, DialogModes.NO);
})(s2t('eyedropperTool'));

(d = new ActionDescriptor()).putInteger(p = s2t('eyeDropperSampleSheet'),
    executeActionGet(ref).getObjectValue(s2t('currentToolOptions')).getInteger(p) ? 0 : 1);
(r = new ActionReference()).putClass(s2t('eyedropperTool'));
(d1 = new ActionDescriptor()).putReference(s2t('target'), r);
d1.putObject(s2t('to'), s2t('target'), d);
executeAction(s2t('set'), d1, DialogModes.NO);

selectTool(cTool)