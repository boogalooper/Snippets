/**How to color the elements (texts and shapes)
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/how-to-color-the-elements-texts-and-shapes/td-p/12811653
 */
#target photoshop
var newColors = ['ff0000', '1200ff', '0f9505', 'c44500'],
    s2t = stringIDToTypeID;
(r = new ActionReference()).putProperty(s2t('property'), p = s2t('textKey'));
r.putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
if (executeActionGet(r).hasKey(p)) {
    var textKey = executeActionGet(r).getObjectValue(p),
        tList = textKey.getList(s2t('textStyleRange')),
        l = new ActionList(),
        styleSheet = [],
        lines = textKey.getString(s2t('textKey')).split('\r');
    for (var i = 0; i < tList.count; i++) {
        styleSheet.push({
            from: tList.getObjectValue(i).getInteger(s2t('from')),
            to: tList.getObjectValue(i).getInteger(s2t('to')),
            style: tList.getObjectValue(i).getObjectValue(s2t('textStyle'))
        })
    };
    var from = 0;
    for (var i = 0; i < lines.length; i++) {
        var to = from + lines[i].length + 1,
            cur = function (s, idx) { for (var i = 0; i < s.length; i++) if (s[i].from <= idx && s[i].to > idx) return s[i].style }(styleSheet, from),
            color = function (h) { var c = new SolidColor; c.rgb.hexValue = h; newColors.push(h); return c }(newColors.shift());
        var d = new ActionDescriptor();
        with (color.rgb) {
            d.putDouble(s2t('red'), red)
            d.putDouble(s2t('green'), green)
            d.putDouble(s2t('blue'), blue)
            cur.putObject(s2t('color'), s2t('RGBColor'), d)
        }
        d = new ActionDescriptor();
        d.putObject(s2t('textStyle'), s2t('textStyle'), cur)
        d.putInteger(s2t('from'), from)
        d.putInteger(s2t('to'), to)
        l.putObject(s2t('textStyleRange'), d)
        from = to
    }
    textKey.putList(s2t('textStyleRange'), l);
    (r = new ActionReference()).putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
    (d = new ActionDescriptor()).putReference(s2t('target'), r);
    d.putObject(s2t('to'), s2t('textLayer'), textKey);
    executeAction(s2t('set'), d, DialogModes.NO);
}