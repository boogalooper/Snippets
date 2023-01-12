/**How to get all Photoshop styles using photoshop scripting?
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/how-to-get-all-photoshop-styles-using-photoshop-scripting/td-p/13430141
 * https://youtu.be/sP1fykH3a8s
 */
activeDocument.suspendHistory('Apply random style', 'main()');

function main() {
    activeDocument.artLayers.add();
    var stylesIndexes = applyStyles();
    activeDocument.activeLayer.remove();
    applyStyles(stylesIndexes[Math.floor(Math.random() * stylesIndexes.length)])
}

function applyStyles(idx) {
    var s2t = stringIDToTypeID,
        err = 0,
        cur = 0,
        stylesIdx = [];
    do {
        (r = new ActionReference()).putIndex(s2t("style"), idx ? idx : cur);
        (d = new ActionDescriptor()).putReference(s2t("null"), r);
        (r1 = new ActionReference()).putEnumerated(s2t("layer"), s2t("ordinal"), s2t("targetEnum"));
        d.putReference(s2t("to"), r1);
        try {
            executeAction(s2t("applyStyle"), d, DialogModes.NO);
            if (idx) break;
            err = 0
            stylesIdx.push(cur)
        } catch (e) {
            err++
        }
        cur++
    } while (err < 5)
    return stylesIdx;
}
