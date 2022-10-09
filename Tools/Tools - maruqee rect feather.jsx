/**Where do I find tool properties/options?
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/where-do-i-find-tool-properties-options/td-p/13234771
 */
var s2t = stringIDToTypeID,
	c2t = charIDToTypeID;

currentTool = 'marqueeRectTool';

// see the names of all the tool options
(r = new ActionReference()).putProperty(s2t('property'), p = s2t('tool'));
r.putEnumerated(s2t('application'), s2t('ordinal'), s2t('targetEnum'));
(d = new ActionDescriptor()).putObject(s2t('object'), s2t('object'), executeActionGet(r));
eval('t = ' + executeAction(s2t('convertJSONdescriptor'), d).getString(s2t('json')));

alert(t.toSource());

// get only feather value
(r = new ActionReference()).putProperty(s2t('property'), p = s2t('tool'));
r.putEnumerated(s2t('application'), s2t('ordinal'), s2t('targetEnum'));
var feather = executeActionGet(r).getObjectValue(s2t('currentToolOptions')).getUnitDoubleValue(c2t('MrqF'));

alert (feather);

//  set a new feather value.
var newValue = 50;
(d = new ActionDescriptor()).putUnitDouble(c2t('MrqF'), s2t('pixelsUnit'), newValue);
(r = new ActionReference()).putClass(s2t(currentTool));
(d1 = new ActionDescriptor()).putReference(s2t('target'), r);
d1.putObject(s2t('to'), s2t('target'), d);
executeAction(s2t('set'), d1, DialogModes.NO);

