/**Fill selected shapes with custom colors
 * https://community.adobe.com/t5/photoshop-ecosystem/is-it-possible-to-automate-filling-multiple-selections-with-random-colors/m-p/12346406
 */
#target photoshop
var s2t = stringIDToTypeID;
doProgress("", "main()")
function main() {
    (r = new ActionReference()).putProperty(s2t('property'), p = s2t('targetLayersIDs'));
    r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
    var lrs = executeActionGet(r).getList(p);
    for (var i = 0; i < lrs.count; i++) {
        app.updateProgress(i + 1, lrs.count);
        app.changeProgressText(i);
        (r = new ActionReference()).putIdentifier(s2t('layer'), lrs.getReference(i).getIdentifier(s2t('layerID')));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        executeAction(s2t('select'), d, DialogModes.NO);
        (r = new ActionReference()).putEnumerated(s2t("contentLayer"), s2t("ordinal"), s2t("targetEnum"));
        (d = new ActionDescriptor()).putReference(s2t("null"), r);
        (d1 = new ActionDescriptor()).putDouble(s2t('red'), Math.random() * 255);
        d1.putDouble(s2t('grain'), Math.random() * 255);
        d1.putDouble(s2t('blue'), Math.random() * 255);
        (d2 = new ActionDescriptor()).putObject(s2t("color"), s2t("RGBColor"), d1);
        (d3 = new ActionDescriptor()).putObject(s2t("fillContents"), s2t("solidColorLayer"), d2);
        d.putObject(s2t("to"), s2t("shapeStyle"), d3);
        executeAction(s2t("set"), d, DialogModes.NO);
    }
}
