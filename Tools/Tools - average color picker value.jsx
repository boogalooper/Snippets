/**
 * Extendscript Color Picker Information - Average Value? 
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/extendscript-color-picker-information-average-value/td-p/13687858
 */

const AVERAGE_AREA = 51;
var startRulerUnits = app.preferences.rulerUnits,
    startTypeUnits = app.preferences.typeUnits;

app.preferences.rulerUnits = Units.PIXELS
app.preferences.typeUnits = TypeUnits.PIXELS

var doc = activeDocument,
    colorSampler = activeDocument.colorSamplers[0],

    x = colorSampler.position[0].value,
    y = colorSampler.position[1].value;

var selRegion = [
    [x - AVERAGE_AREA / 2, y - AVERAGE_AREA / 2],
    [x + AVERAGE_AREA / 2, y - AVERAGE_AREA / 2],
    [x + AVERAGE_AREA / 2, y + AVERAGE_AREA / 2],
    [x - AVERAGE_AREA / 2, y + AVERAGE_AREA / 2]
]

doc.selection.select(selRegion)
var median = [],
    color = new SolidColor;

for (var i = 0; i < doc.channels.length; i++) {
    var n = p = 0,
        cur = doc.channels[i].histogram;
    for (var x = 0; x < cur.length; x++) {
        n += cur[x]
        p += cur[x] * x
    }
    median.push(p / n)
}
doc.selection.deselect()

with (color.rgb) { red = median[0]; green = median[1]; blue = median[2]; };

var readColorHue = Math.round(color.hsb.hue)
var readColorSaturation = Math.round(color.hsb.saturation)
var readColorBrightness = Math.round(color.hsb.brightness)

alert('H ' + readColorHue + ' S ' + readColorSaturation + ' B ' + readColorBrightness)

app.preferences.rulerUnits = startRulerUnits
app.preferences.typeUnits = startTypeUnits