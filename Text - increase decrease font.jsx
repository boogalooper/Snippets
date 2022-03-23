/**Change text size without transform tool
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/change-text-size-without-transform-tool/td-p/12821631/page/2
 * https://youtu.be/XZr2HluMMWc
 */
#target photoshop

аvar w = new Window('dialog{orientation:"column"}'),
    g1 = w.add("group"),
    st = g1.add('statictext{text:"base:"}');
dl = g1.add("dropdownlist{preferredSize: [120,-1]}"),
    g2 = w.add("group"),
    bnInc = g2.add('button{text:"+"}'),
    bnDec = g2.add('button{text:"-"}'),
    et = g2.add('edittext{preferredSize: [40,-1]}');
g1.add('statictext{text:"pt"}');
g2.add('statictext{text:"pt"}');
et.text = $.getenv('size') ? $.getenv('size') : 50
et.onChange = function () { $.setenv('size', this.text) }
bnDec.onClick = bnInc.onClick = function () {
    var base = Number(dl.selection.text),
        scale = this.text == '+' ? (base + Number(et.text)) / base : (base - Number(et.text)) / base;
    if (scale >= 0) {
        changeFontSize(scale)
        w.onShow();
        try { app.refresh() } catch (e) { w.close() }
    }
}
dl.onChange = function () { $.setenv('base', this.selection.index) }
w.onShow = function () {
    var o = getFontSize();
    dl.removeAll()
    for (a in o) { dl.add('item', a) }
    dl.selection = $.getenv('base') && Number($.getenv('base')) < dl.items.length ? Number($.getenv('base')) : 0
}
w.show();
function changeFontSize(scale) {
    var s2t = stringIDToTypeID;
    (r = new ActionReference()).putProperty(s2t('property'), p = s2t('textKey'));
    r.putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
    if (executeActionGet(r).hasKey(p)) {
        var textKey = executeActionGet(r).getObjectValue(p),
            styles = textKey.getList(s2t('textStyleRange'));
        var l = new ActionList();
        for (var i = 0; i < styles.count; i++) {
            var cur = styles.getObjectValue(i),
                textStyle = cur.getObjectValue(s2t('textStyle'));
            var curSize = textStyle.getUnitDoubleValue(s2t('impliedFontSize')),
                curLeading = textStyle.hasKey(s2t('impliedLeading')) ? textStyle.getUnitDoubleValue(s2t('impliedLeading')) : null;
            textStyle.putUnitDouble(s2t('impliedFontSize'), s2t('pointsUnit'), curSize * scale);
            if (curLeading) textStyle.putUnitDouble(s2t('impliedLeading'), s2t('pointsUnit'), curLeading * scale);
            cur.putObject(s2t('textStyle'), s2t('textStyle'), textStyle);
            l.putObject(s2t('textStyleRange'), cur)
        }
        textKey.putList(s2t('textStyleRange'), l);
        (r = new ActionReference()).putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        d.putObject(s2t('to'), s2t('textLayer'), textKey);
        executeAction(s2t('set'), d, DialogModes.NO);
    }
}
function getFontSize() {
    var s2t = stringIDToTypeID,
        fontSizeList = {};
    (r = new ActionReference()).putProperty(s2t('property'), p = s2t('textKey'));
    r.putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
    if (executeActionGet(r).hasKey(p)) {
        var sList = executeActionGet(r).getObjectValue(p).getList(s2t('textStyleRange'));
        for (var x = 0; x < sList.count; x++) {
            var k = sList.getObjectValue(x).getObjectValue(s2t('textStyle'))
            if (k.hasKey(s2t('impliedFontSize'))) {
                var size = Math.round(k.getUnitDoubleValue(s2t('impliedFontSize')) * 100) / 100
                if (fontSizeList[size]) fontSizeList[size].push(i) else fontSizeList[size] = [i]
            }
        }
    }
    return (fontSizeList)
}
