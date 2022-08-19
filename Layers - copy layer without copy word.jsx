/* How to remove word "copy" from duplicated layers in layerSets
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/how-to-remove-word-quot-copy-quot-from-duplicated-layers-in-layersets/td-p/13145427
 */

var s2t = stringIDToTypeID;
(r = new ActionReference()).putProperty(s2t("property"), p = s2t("addCopyToLayerNames"));
r.putClass(s2t("application"));
(d = new ActionDescriptor()).putReference(s2t("target"), r);
var addCopyToLayerNames = executeActionGet(r).getBoolean(p);
d.putBoolean(s2t("addCopyToLayerNames"), false)
executeAction(s2t("set"), d, DialogModes.NO);
executeAction(s2t("copyToLayer"), undefined, DialogModes.NO);
d.putBoolean(s2t("addCopyToLayerNames"), addCopyToLayerNames)
executeAction(s2t("set"), d, DialogModes.NO);