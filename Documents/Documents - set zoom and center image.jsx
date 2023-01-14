/**
 * A script that replaces the ctr+0 hotkeys.
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/a-script-that-replaces-the-ctr-0-hotkeys/td-p/13490085
 */

#target photoshop
var s2t = stringIDToTypeID,
    zoom = 0.5;

(r = new ActionReference()).putProperty(s2t('property'), p = s2t('resolution'));
r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
var res = executeActionGet(r).getInteger(p);

(r = new ActionReference()).putProperty(s2t('property'), p = s2t('width'));
r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
var docW = executeActionGet(r).getDouble(p) * res / 72;

(r = new ActionReference()).putProperty(s2t('property'), p = s2t('height'));
r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
var docH = executeActionGet(r).getDouble(p) * res / 72;

(r = new ActionReference()).putProperty(s2t('property'), p = s2t('zoom'));
r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
(d = new ActionDescriptor()).putReference(s2t('null'), r);
(d1 = new ActionDescriptor()).putUnitDouble(s2t('zoom'), s2t('percentUnit'), zoom);
d.putObject(s2t('to'), p, d1);
executeAction(s2t('set'), d, DialogModes.NO);

(r = new ActionReference).putProperty(s2t('property'), s2t('center'));
r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
(d = new ActionDescriptor).putReference(s2t('target'), r);
(d1 = new ActionDescriptor()).putUnitDouble(s2t('horizontal'), s2t('distanceUnit'), docW * zoom / 2);
d1.putUnitDouble(s2t('vertical'), s2t('distanceUnit'), docH * zoom / 2);
d.putObject(s2t('to'), s2t('center'), d1);
executeAction(s2t('set'), d, DialogModes.NO);