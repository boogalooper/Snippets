/**Group text layers based on font size
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/group-text-layers-based-on-font-size/td-p/12769300
 */
#target photoshop
var s2t = stringIDToTypeID,
    fontSizeList = {};
(r = new ActionReference()).putProperty(s2t('property'), p = s2t('numberOfLayers'));
r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
var len = executeActionGet(r).getInteger(p);
for (var i = 1; i <= len; i++) {
    (r = new ActionReference()).putProperty(s2t('property'), p = s2t('textKey'));
    r.putIndex(s2t('layer'), i);
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
}
if (fontSizeList.toSource() != '({})') {
    var w = new Window("dialog {text: 'Group by font size'}"),
        dl = w.add("dropdownlist{preferredSize: [200,-1]}"),
        g = w.add("group"),
        ok = g.add("button", undefined, "Group", { name: "ok" }),
        cancel = g.add("button", undefined, "Cancel", { name: "cancel" });
    for (var a in fontSizeList) dl.add('item', a)
    dl.selection = 0
    ok.onClick = function () {
        var r = new ActionReference(),
            cur = fontSizeList[dl.selection.text];
        do { r.putIndex(s2t("layer"), cur.shift()) } while (cur.length)
        (d = new ActionDescriptor()).putReference(s2t("target"), r)
        executeAction(s2t("select"), d, DialogModes.NO);
        (r = new ActionReference()).putClass(s2t("layerSection"));
        (d = new ActionDescriptor()).putReference(s2t("target"), r);
        (r1 = new ActionReference()).putEnumerated(s2t("layer"), s2t("ordinal"), s2t("targetEnum"));
        d.putReference(s2t("from"), r1);
        (d1 = new ActionDescriptor()).putString(s2t("name"), dl.selection.text);
        d.putObject(s2t("using"), s2t("layerSection"), d1);
        executeAction(s2t("make"), d, DialogModes.NO);
        w.close()
    }
    w.show();
}