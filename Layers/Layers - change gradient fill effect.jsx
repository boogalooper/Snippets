/**Changing the active layer's gradient fill effect
 * https://community.adobe.com/t5/photoshop-ecosystem/modify-a-layereffects-object/m-p/12196380#M567928
 * https://youtu.be/Ynj3IKhI5_k
 */
#target photoshop
changeFill([255, 0, 0], [0, 255, 0], [0, 0, 255]); // [R, G, B] values
function changeFill() {
    s2t = stringIDToTypeID;
    (r = new ActionReference()).putProperty(s2t('property'), p = s2t('layerEffects'));
    r.putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
    if (executeActionGet(r).hasKey(p)) var fx = executeActionGet(r).getObjectValue(p);
    if (fx && fx.hasKey(p = s2t('gradientFill'))) {
        var gradientFill = fx.getObjectValue(p),
            gradient = gradientFill.getObjectValue(s2t('gradient')),
            colors = gradient.getList(s2t('colors'));
        if (arguments.length == colors.count) {
            var newColors = new ActionList();
            for (var i = 0; i < colors.count; i++) {
                var currentColor = colors.getObjectValue(i);
                (d = new ActionDescriptor()).putDouble(s2t('red'), arguments[i][0]);
                d.putDouble(s2t('green'), arguments[i][1]);
                d.putDouble(s2t('blue'), arguments[i][2]);
                currentColor.putObject(s2t('color'), s2t('RGBColor'), d)
                newColors.putObject(s2t('colorStop'), currentColor)
            }
            gradient.putList(s2t('colors'), newColors)
            gradientFill.putObject(s2t('gradient'), s2t('gradientClassEvent'), gradient);
            fx.putObject(s2t('gradientFill'), s2t('gradientFill'), gradientFill);
            (d = new ActionDescriptor()).putReference(s2t('null'), r);
            d.putObject(s2t('to'), s2t('layerEffects'), fx);
            executeAction(s2t('set'), d, DialogModes.NO);
        }
    }
}
