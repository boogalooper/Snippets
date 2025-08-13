/**
 * How to get the state of Advanced Blending options of a layer? 
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/how-to-get-the-state-of-advanced-blending-options-of-a-layer/td-p/15456256
 */

s2t = stringIDToTypeID;
(r = new ActionReference()).putProperty(s2t("property"), s2t("json"));
r.putEnumerated(s2t("layer"), s2t("ordinal"), s2t("targetEnum"));
(d = new ActionDescriptor()).putReference(s2t("null"), r);
eval("var json=" + executeAction(s2t("get"), d, DialogModes.NO).getString(s2t("json")));
if (json.layers.length) {
    var cur = json.layers[0],
        blendOptions = { transparencyShapesLayer: true, layerMaskAsGlobalMask: false };
    if (cur.blendOptions) {
        if (cur.blendOptions.transparencyShapesLayer != undefined) blendOptions.transparencyShapesLayer = cur.blendOptions.transparencyShapesLayer
        if (cur.blendOptions.layerMaskAsGlobalMask != undefined) blendOptions.layerMaskAsGlobalMask = cur.blendOptions.layerMaskAsGlobalMask
    }
    alert(blendOptions.toSource())
}