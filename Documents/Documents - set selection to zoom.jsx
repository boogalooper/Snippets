/**
 * Finding Hot Key or Trick to select portion of window (description in post)
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/finding-hot-key-or-trick-to-select-portion-of-window-description-in-post/td-p/13450667
 * https://youtu.be/WQg5rkqCVBw
 */
#target photoshop
s2t = stringIDToTypeID;
(r = new ActionReference()).putProperty(s2t('property'), p = s2t('resolution'));
r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
var res = executeActionGet(r).getInteger(p);
(r = new ActionReference()).putProperty(s2t('property'), p = s2t('width'));
r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
var docW = executeActionGet(r).getInteger(p) * res / 72;
(r = new ActionReference()).putProperty(s2t('property'), p = s2t('height'));
r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
var docH = executeActionGet(r).getInteger(p) * res / 72;    
(r = new ActionReference()).putProperty(s2t('property'), p = s2t('viewTransform'));
r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
var viewTransform = executeActionGet(r).getList(p),
    zoom = viewTransform.getDouble(0),
    offsetLeft = viewTransform.getDouble(4),
    offsetTop = viewTransform.getDouble(5);
(r = new ActionReference()).putProperty(s2t('property'), p = s2t('viewInfo'));
r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
var activeView = executeActionGet(r).getObjectValue(p).getObjectValue(s2t('activeView')).getObjectValue(s2t('globalBounds')),
    viewW = activeView.getDouble(s2t('right')) - activeView.getDouble(s2t('left')),
    viewH = activeView.getDouble(s2t('bottom')) - activeView.getDouble(s2t('top'));
makeSelection(offsetTop < 0 ? 0 : offsetTop,
    offsetLeft < 0 ? 0 : offsetLeft,
    viewH * zoom + offsetTop > docH ? docH : viewH * zoom + offsetTop,
    viewW * zoom + offsetLeft > docW ? docW : viewW * zoom + offsetLeft
)
function makeSelection(top, left, bottom, right) {
    var d = new ActionDescriptor();
    var d1 = new ActionDescriptor();
    var r = new ActionReference();
    r.putProperty(s2t("channel"), s2t("selection"));
    d.putReference(s2t("null"), r);
    d1.putUnitDouble(s2t("top"), s2t("pixelsUnit"), top);
    d1.putUnitDouble(s2t("left"), s2t("pixelsUnit"), left);
    d1.putUnitDouble(s2t("bottom"), s2t("pixelsUnit"), bottom);
    d1.putUnitDouble(s2t("right"), s2t("pixelsUnit"), right);
    d.putObject(s2t("to"), s2t("rectangle"), d1);
    executeAction(s2t("set"), d, DialogModes.NO);
}