/**I would like to create a Batch Action from an Action that changes a photo's HUE value by 1. So that I can create 360 different PNG files.
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/file-automate-batch/td-p/13187162
 */
var s2t = stringIDToTypeID,
	saveOptions;
try {
	(d = new ActionDescriptor()).putObject(s2t("as"), s2t("PNGFormat"), new ActionDescriptor());
	var saveOptions = executeAction(s2t("save"), d, DialogModes.ALL);
} catch (e) { }
if (saveOptions) {
	var savePath = saveOptions.getPath(s2t('in')).path,
		saveName = saveOptions.getPath(s2t('in')).name.replace(/\.[0-9a-z]+$/, '');
	doProgress('', 'saveToPng()');
	function saveToPng() {
		(r = new ActionReference()).putClass(s2t("adjustmentLayer"));
		(d = new ActionDescriptor()).putReference(s2t("null"), r);
		(d2 = new ActionDescriptor()).putObject(s2t("type"), s2t("hueSaturation"), new ActionDescriptor());
		d.putObject(s2t("using"), s2t("adjustmentLayer"), d2);
		executeAction(s2t("make"), d, DialogModes.NO);
		for (var i = 0; i <= 360; i++) {
			updateProgress(i, 360);
			(r = new ActionReference()).putEnumerated(s2t("adjustmentLayer"), s2t("ordinal"), s2t("targetEnum"));
			(d = new ActionDescriptor()).putReference(s2t("null"), r);
			(d1 = new ActionDescriptor()).putEnumerated(s2t("presetKind"), s2t("presetKindType"), s2t("presetKindCustom"));
			(d2 = new ActionDescriptor()).putInteger(s2t("hue"), -180 + i);
			d2.putInteger(s2t("saturation"), 0);
			d2.putInteger(s2t("lightness"), 0);
			(l = new ActionList()).putObject(s2t("hueSatAdjustmentV2"), d2);
			d1.putList(s2t("adjustment"), l);
			d.putObject(s2t("to"), s2t("hueSaturation"), d1);
			executeAction(s2t("set"), d, DialogModes.NO);
			changeProgressText('saving file: ' + saveName + ' ' + -180 + i + '.png');
			saveOptions.putPath(s2t('in'), new File(savePath + '/' + saveName + ' ' + (- 180 + i) + '.png'))
			executeAction(s2t("save"), saveOptions, DialogModes.NO);
		}
		(r = new ActionReference()).putEnumerated(s2t("layer"), s2t("ordinal"), s2t("targetEnum"));
		(d = new ActionDescriptor()).putReference(s2t("null"), r);
		executeAction(s2t("delete"), d, DialogModes.NO);
	}
}
