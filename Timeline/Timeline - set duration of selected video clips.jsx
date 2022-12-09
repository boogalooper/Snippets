/**
 * Timeline: how to set duration of each frame, at the same time?
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/timeline-how-to-set-duration-of-each-frame-at-the-same-time/td-p/13403018
 * https://www.youtube.com/watch?v=bqOcHfEHPMs
 */

#target photoshop
s2t = stringIDToTypeID;
(r = new ActionReference()).putProperty(s2t('property'), p = s2t('targetLayersIDs'));
r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
var selectedLayers = executeActionGet(r).getList(p),
    layers = [],
    frameRate;
(r = new ActionReference()).putProperty(s2t("property"), s2t("time"));
r.putClass(s2t("timeline"));
(d = new ActionDescriptor()).putReference(s2t("null"), r);
(d1 = new ActionDescriptor()).putInteger(s2t("seconds"), 0);
d1.putInteger(s2t("frame"), 0);
d.putObject(s2t("to"), s2t("timecode"), d1);
executeAction(s2t("set"), d, DialogModes.NO);
(r = new ActionReference()).putProperty(s2t('property'), p = s2t('frameRate'));
r.putClass(s2t('timeline'));
frameRate = executeActionGet(r).getDouble(p);
for (var i = 0; i < selectedLayers.count; i++) {
    (r = new ActionReference()).putIdentifier(s2t('layer'), selectedLayers.getReference(i).getIdentifier());
    (d = new ActionDescriptor()).putReference(s2t('null'), r);
    executeAction(s2t('select'), d, DialogModes.NO);
    (d1 = new ActionDescriptor()).putObject(s2t("resetTime"), s2t("timecode"), new ActionDescriptor());
    executeAction(s2t("moveOutTime"), d1, DialogModes.NO);
    (d = new ActionDescriptor()).putInteger(s2t("seconds"), 2);
    d.putInteger(s2t("frame"), -1);
    d.putDouble(s2t('frameRate'), frameRate);
    (d1 = new ActionDescriptor()).putObject(s2t("timeOffset"), s2t("timecode"), d);
    executeAction(s2t("moveOutTime"), d1, DialogModes.NO);
}
