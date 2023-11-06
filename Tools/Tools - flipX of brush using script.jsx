/**
 * FlipX of brush using script
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/flipx-of-brush-using-script/td-p/13324062
 */

var s2t = stringIDToTypeID;

(r = new ActionReference()).putProperty(s2t('property'), p = s2t('currentToolOptions'));
r.putEnumerated(s2t('application'), s2t('ordinal'), s2t('targetEnum'));
var tool = executeActionGet(r).getObjectValue(p);

if (tool.hasKey(s2t('brush'))) {
    var brush = tool.getObjectValue(s2t('brush'));

    brush.putBoolean(s2t('flipX'), true);

    (r = new ActionReference()).putClass(s2t(currentTool));
    (d = new ActionDescriptor()).putReference(s2t("target"), r);
    d.putObject(s2t("to"), s2t("target"), tool);
    executeAction(s2t("set"), d, DialogModes.NO);
}