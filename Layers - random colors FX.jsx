/**Создание эффекта заливки с использованием случайных цветов для выделенных слоев 
 * (параметры цвета задаются в HSL. S и L постоянны, меняется Hue)
 * https://community.adobe.com/t5/photoshop-ecosystem/can-you-automatically-give-every-subsequent-letter-a-different-color-for-a-batch-of-text-designs/m-p/12325550
 */
#target photoshop

var s2t = stringIDToTypeID;

(r = new ActionReference()).putProperty(s2t('property'), p = s2t('targetLayersIDs'));
r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
var lrs = executeActionGet(r).getList(p),
    hueDifference = 0;

for (var i = 0; i < lrs.count; i++) {
    (d = new ActionDescriptor()).putReference(s2t('null'), lrs.getReference(i));
    executeAction(s2t('select'), d, DialogModes.NO);

    (r = new ActionReference()).putProperty(s2t("property"), p = s2t("layerEffects"));
    r.putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));

    var fx = executeActionGet(r).hasKey(p) ? executeActionGet(r).getObjectValue(p) : new ActionDescriptor(),
        currentFill = fx.hasKey(p = s2t("solidFill")) ? fx.getObjectValue(p) : new ActionDescriptor();
    if (fx.hasKey(p = s2t("solidFillMulti"))) fx.erase(p);

    var saturation = 100,
        lightness = 50,
        hue = 0;

    do { hue = Math.random() * 360 } while (Math.abs(hueDifference - hue) < 60);
    hueDifference = hue

    var RGB = hslToRgb(hue, saturation, lightness)

    var d = new ActionDescriptor();
    d.putDouble(s2t('red'), RGB[0])
    d.putDouble(s2t('grain'), RGB[1])
    d.putDouble(s2t('blue'), RGB[2])
    currentFill.putObject(s2t("color"), s2t("RGBColor"), d);
    fx.putObject(s2t("solidFill"), s2t("solidFill"), currentFill);

    (d = new ActionDescriptor()).putReference(s2t("null"), r);
    d.putObject(s2t("to"), s2t("layerEffects"), fx);
    executeAction(s2t("set"), d, DialogModes.NO);
}

var r = new ActionReference();
for (var i = 0; i < lrs.count; i++) { r.putIdentifier(s2t('layer'), lrs.getReference(i).getIdentifier(s2t('layerID'))) }
(d = new ActionDescriptor()).putReference(s2t('null'), r);
executeAction(s2t('select'), d, DialogModes.NO);

function hslToRgb(h, s, l) {
    s /= 100;
    l /= 100;

    var c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - c / 2,
        r = 0,
        g = 0,
        b = 0;

    if (0 <= h && h < 60) {
        r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
    }

    return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)]
}