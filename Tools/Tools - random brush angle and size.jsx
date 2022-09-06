/**rotate
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/rotate/td-p/13179295
 */

 var s2t = stringIDToTypeID,
 minAngle = -90, maxAngle = 180,
 minDiameter = 10, maxDiameter = 200;

(r = new ActionReference()).putProperty(s2t('property'), p = s2t('currentToolOptions'));
r.putEnumerated(s2t('application'), s2t('ordinal'), s2t('targetEnum'));
var tool = executeActionGet(r).getObjectValue(p),
 brush = tool.getObjectValue(s2t('brush'));

brush.putInteger(s2t('angle'), minAngle + Math.random() * (maxAngle - minAngle));
brush.putUnitDouble(s2t("diameter"), s2t("pixelsUnit"), minDiameter + Math.random() * (maxDiameter - minDiameter))
tool.putObject(s2t('brush'), s2t('computedBrush'), brush);

(r = new ActionReference()).putClass(s2t(currentTool));
(d = new ActionDescriptor()).putReference(s2t("target"), r);
d.putObject(s2t("to"), s2t("target"), tool);
executeAction(s2t("set"), d, DialogModes.NO);
