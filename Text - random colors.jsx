/**Can you automatically give every subsequent letter a different color for a batch of text designs
 * https://community.adobe.com/t5/photoshop-ecosystem/can-you-automatically-give-every-subsequent-letter-a-different-color-for-a-batch-of-text-designs/m-p/12325550
 */

#target photoshop

var s2t = stringIDToTypeID;

(r = new ActionReference()).putProperty(s2t('property'), p = s2t('targetLayersIDs'));
r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
var lrs = executeActionGet(r).getList(p);

for (var i = 0; i < lrs.count; i++) {
    (r = new ActionReference()).putProperty(s2t('property'), p = s2t('textKey'));
    r.putIdentifier(s2t('layer'), lrs.getReference(i).getIdentifier(s2t('layerID')));

    if (executeActionGet(r).hasKey(p)) {
        var textKey = executeActionGet(r).getObjectValue(p),
            style = textKey.getList(s2t('textStyleRange')).getObjectValue(0),
            text = textKey.getString(p),
            l = new ActionList(),
            hueDifference = 0;

        for (var x = 0; x < text.length; x++) {
            var k = copyDesc(style, new ActionDescriptor()),
                s = k.getObjectValue(s2t('textStyle'));

            k.putInteger(s2t('from'), x)
            k.putInteger(s2t('to'), x + 1)

            var saturation = 70,
                lightness = 50,
                hue = 0;

            do { hue = Math.random() * 360 } while (Math.abs(hueDifference - hue) < 20);
            hueDifference = hue

            var RGB = hslToRgb(hue, saturation, lightness)

            var d = new ActionDescriptor();
            d.putDouble(s2t('red'), RGB[0])
            d.putDouble(s2t('grain'), RGB[1])
            d.putDouble(s2t('blue'), RGB[2])
            s.putObject(s2t('color'), s2t('RGBColor'), d)
            k.putObject(s2t('textStyle'), s2t('textStyle'), s)
            l.putObject(s2t('textStyleRange'), k)
        }
        if (l.count) {
            textKey.putList(s2t('textStyleRange'), l)
            var d = new ActionDescriptor();
            (r = new ActionReference()).putIdentifier(s2t('layer'), lrs.getReference(i).getIdentifier(s2t('layerID')));
            d.putReference(s2t('null'), r);
            d.putObject(s2t('to'), s2t('textLayer'), textKey);
            executeAction(s2t('set'), d, DialogModes.NO);
        }
    }

}

function copyDesc(from, to) {
    for (var i = 0; i < from.count; i++) {
        var k = from.getKey(i);
        if (to.hasKey(k)) continue;
        switch (from.getType(k)) {
            case DescValueType.ALIASTYPE: to.putPath(k, from.getPath(k)); break;
            case DescValueType.BOOLEANTYPE: to.putBoolean(k, from.getBoolean(k)); break;
            case DescValueType.CLASSTYPE: to.putClass(k, from.getClass(k)); break;
            case DescValueType.DOUBLETYPE: to.putDouble(k, from.getDouble(k)); break;
            case DescValueType.INTEGERTYPE: to.putInteger(k, from.getInteger(k)); break;
            case DescValueType.LISTTYPE: to.putList(k, from.getList(k)); break;
            case DescValueType.RAWTYPE: to.putData(k, from.getData(k)); break;
            case DescValueType.STRINGTYPE: to.putString(k, from.getString(k)); break;
            case DescValueType.LARGEINTEGERTYPE: to.putLargeInteger(k, from.getLargeInteger(k)); break;
            case DescValueType.REFERENCETYPE: to.putReference(k, from.getReference(k)); break;
            case DescValueType.OBJECTTYPE: to.putObject(k, from.getObjectType(k), from.getObjectValue(k)); break;
            case DescValueType.ENUMERATEDTYPE: to.putEnumerated(k, from.getEnumerationType(k), from.getEnumerationValue(k)); break;
            case DescValueType.UNITDOUBLE: to.putUnitDouble(k, from.getUnitDoubleType(k), from.getUnitDoubleValue(k)); break;
        }
    }
    return to
}

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