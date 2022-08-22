/**Any way to reset text box scale after transform or image resize?
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/any-way-to-reset-text-box-scale-after-transform-or-image-resize/m-p/12539377
 */
#target photoshop
var s2t = stringIDToTypeID;
(r = new ActionReference()).putProperty(s2t('property'), p = s2t('textKey'));
r.putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
if (executeActionGet(r).hasKey(p)) {
    var textKey = executeActionGet(r).getObjectValue(p),
        shape = textKey.getList(s2t('textShape')).getObjectValue(0),
        styles = textKey.getList(s2t('textStyleRange'));
    scale = 1 / textKey.getObjectValue(s2t('transform')).getDouble(s2t('xx'))
    var l = new ActionList();
    for (var i = 0; i < styles.count; i++) {
        var cur = styles.getObjectValue(i),
            textStyle = cur.getObjectValue(s2t('textStyle'));
        try {
            textStyle.putUnitDouble(s2t('impliedFontSize'), s2t('pointsUnit'), textStyle.getUnitDoubleValue(s2t('impliedFontSize')) * scale);
            textStyle.putUnitDouble(s2t('impliedLeading'), s2t('pointsUnit'), textStyle.getUnitDoubleValue(s2t('impliedLeading')) * scale);
        } catch (e) { }
        cur.putObject(s2t('textStyle'), s2t('textStyle'), textStyle);
        l.putObject(s2t('textStyleRange'), cur)
        $.writeln(l.getObjectValue(i).getObjectValue(s2t('textStyle')).getUnitDoubleValue(s2t('impliedFontSize')))
    }
    textKey.putList(s2t('textStyleRange'), l);
    (r = new ActionReference()).putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
    (d = new ActionDescriptor()).putReference(s2t('null'), r);
    d.putObject(s2t('to'), s2t('textLayer'), textKey);
    executeAction(s2t('set'), d, DialogModes.NO);
}
function objToDesc(o) {
    var d = new ActionDescriptor();
    for (var k in o) {
        var v = o[k];
        switch (typeof (v)) {
            case "number": d.putDouble(s2t(k), v); break;
        }
    }
    return d;
}