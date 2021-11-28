/**Configure mixer brush tool
 * https://community.adobe.com/t5/photoshop/configure-mixer-brush-tool/m-p/12022639
 */
#target photoshop;

var s2t = stringIDToTypeID,
    options = {
        flow: 99,
        wetness: 99,
        dryness: 99,
        mix: 99,
        smooth: 99,
        autoFill: true,
        autoClean: true,
        sampleAllLayers: true
    };

(r = new ActionReference()).putClass(s2t("wetBrushTool"));
(d = new ActionDescriptor()).putReference(s2t("target"), r);
d.putObject(s2t("to"), s2t("target"), objToDesc(options));
executeAction(s2t("set"), d, DialogModes.NO);


function objToDesc(o) {
    var d = new ActionDescriptor();
    for (var k in o) {
        var v = o[k];
        switch (typeof (v)) {
            case "boolean": d.putBoolean(s2t(k), v); break;
            case "string": d.putString(s2t(k), v); break;
            case "number": d.putInteger(s2t(k), v); break;
        }
    }
    return d;
}

