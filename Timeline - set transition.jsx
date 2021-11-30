/**How to use JSX to move the timeline and define keyframe positions
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/how-to-use-jsx-to-move-the-timeline-and-define-keyframe-positions/td-p/12559622
 */
/** How to use JSX to move the timeline and define keyframe positions
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/how-to-use-jsx-to-move-the-timeline-and-define-keyframe-positions/td-p/12559622
 */
 #target photoshop
var s2t = stringIDToTypeID,
    duration = 5,
    len = 100;

try {
    setCurrentTime(0)
    enableTracking()
    setMoveOutTime(len * duration)
    makeKeyFrame()
    for (i = 1; i <= len; i++) {
        setCurrentTime(i * duration)
        move(50 * i, 50 * i * i);
    }
} catch (e) { alert(e) }

function setCurrentTime(seconds) {
    (r = new ActionReference()).putProperty(s2t('property'), s2t('time'));
    r.putClass(s2t('timeline'));
    (d = new ActionDescriptor()).putReference(s2t('target'), r);
    (d1 = new ActionDescriptor()).putInteger(s2t('seconds'), seconds);
    d.putObject(s2t('to'), s2t('timecode'), d1);
    executeAction(s2t('set'), d, DialogModes.NO);
}

function enableTracking() {
    (r = new ActionReference()).putEnumerated(s2t('animationTrack'), s2t('stdTrackID'), s2t('sheetPositionTrack'));
    (d = new ActionDescriptor()).putReference(s2t('null'), r);
    executeAction(s2t('enable'), d, DialogModes.NO);
}

function setMoveOutTime(seconds) {
    (d = new ActionDescriptor()).putInteger(s2t('seconds'), seconds);
    (d1 = new ActionDescriptor()).putObject(s2t('timeOffset'), s2t('timecode'), d);
    executeAction(s2t('moveOutTime'), d1, DialogModes.NO);
}

function makeKeyFrame() {
    (r = new ActionReference()).putClass(s2t('animationKey'));
    r.putEnumerated(s2t('animationTrack'), s2t('stdTrackID'), s2t('sheetPositionTrack'));
    (d = new ActionDescriptor()).putReference(s2t('target'), r);
    executeAction(s2t('make'), d, DialogModes.NO);
}

function move(dh, dv) {
    (r = new ActionReference()).putEnumerated(s2t("layer"), s2t("ordinal"), s2t("targetEnum"));
    (d = new ActionDescriptor()).putReference(s2t("null"), r);
    (d1 = new ActionDescriptor()).putUnitDouble(s2t("horizontal"), s2t("pixelsUnit"), dh);
    d1.putUnitDouble(s2t("vertical"), s2t("pixelsUnit"), dv);
    d.putObject(s2t("to"), s2t("offset"), d1);
    executeAction(s2t("move"), d, DialogModes.NO);
}