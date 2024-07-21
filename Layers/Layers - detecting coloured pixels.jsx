/**
 * Detecting white/coloured pixels in a layer (and crop it without deleting the pixels) via script? 
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/detecting-white-coloured-pixels-in-a-layer-and-crop-it-without-deleting-the-pixels-via-script/td-p/14250571
 */
#target photoshop
const s2t = stringIDToTypeID;
var activeHistoryState = activeDocument.activeHistoryState;

// convert document to RGB
(d = new ActionDescriptor()).putClass(s2t('to'), s2t('RGBColorMode'));
executeAction(s2t('convertMode'), d, DialogModes.NO);

var RGB = [];

// calculating background fill color (based on histogram)
for (var i = 1; i <= 3; i++) {
    (r = new ActionReference()).putProperty(s2t('property'), p = s2t('histogram'));
    r.putIndex(s2t('channel'), i);
    var histogram = executeActionGet(r).getList(p),
        max = 0, value = 0;
    for (var n = 0; n < histogram.count; n++) {
        var cur = histogram.getInteger(n);
        if (cur > max) {
            max = cur;
            value = n;
        }
    }
    RGB.push(value);
}

// fill document with found color in difference mode
(d = new ActionDescriptor()).putEnumerated(s2t('using'), s2t('fillContents'), s2t('color'));
(d1 = new ActionDescriptor()).putDouble(s2t('red'), RGB[0]);
d1.putDouble(s2t('green'), RGB[1]);
d1.putDouble(s2t('blue'), RGB[2]);
d.putObject(s2t('color'), s2t('RGBColor'), d1);
d.putUnitDouble(s2t('opacity'), s2t('percentUnit'), 100);
d.putEnumerated(s2t('mode'), s2t('blendMode'), s2t('difference'));
executeAction(s2t('fill'), d, DialogModes.NO);

// make selection to RGB channel
(r = new ActionReference()).putProperty(s2t('channel'), s2t('selection'));
(d = new ActionDescriptor()).putReference(s2t('target'), r);
(r1 = new ActionReference()).putEnumerated(s2t('channel'), s2t('channel'), s2t('RGB'));
d.putReference(s2t('to'), r1);
executeAction(s2t('set'), d, DialogModes.NO);

//save selection to variable
(r = new ActionReference()).putProperty(s2t('property'), p = s2t('selection'));
r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
var selection = executeActionGet(r).getObjectValue(p);

// return initial state of document
activeDocument.activeHistoryState = activeHistoryState;

// crop to saved selection
(d = new ActionDescriptor()).putObject(s2t('to'), s2t('rectangle'), selection);
d.putUnitDouble(s2t('angle'), s2t('angle'), 0);
d.putBoolean(s2t('delete'), false);
executeAction(s2t('crop'), d, DialogModes.NO);
