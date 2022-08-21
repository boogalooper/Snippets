/**Change the fill effect of the active layer 
 * https://community.adobe.com/t5/photoshop-ecosystem/modify-a-layereffects-object/m-p/12196380
 * https://youtu.be/m45ATepUvRw
 */
#target photoshop
changeFill(255, 0, 0); // R, G, B values
function changeFill(red, green, blue) {
    s2t = stringIDToTypeID;
    (r = new ActionReference()).putProperty(s2t("property"), p = s2t("layerEffects"));
    r.putEnumerated(s2t("layer"), s2t("ordinal"), s2t("targetEnum"));
    var fx = executeActionGet(r).hasKey(p) ? executeActionGet(r).getObjectValue(p) : new ActionDescriptor(),
        currentFill = fx.hasKey(p = s2t("solidFill")) ? fx.getObjectValue(p) : new ActionDescriptor();
    if (fx.hasKey(p = s2t("solidFillMulti"))) fx.erase(p);
    (d = new ActionDescriptor()).putDouble(s2t("red"), red);
    d.putDouble(s2t("green"), green);
    d.putDouble(s2t("blue"), blue);
    currentFill.putObject(s2t("color"), s2t("RGBColor"), d);
    fx.putObject(s2t("solidFill"), s2t("solidFill"), currentFill);
    (d = new ActionDescriptor()).putReference(s2t("null"), r);
    d.putObject(s2t("to"), s2t("layerEffects"), fx);
    executeAction(s2t("set"), d, DialogModes.NO);
}