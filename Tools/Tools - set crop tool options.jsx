/**Create Shape in Marquee Tool
 * https://community.adobe.com/t5/photoshop/create-shape-in-marquee-tool/m-p/12124188
 */
#target photoshop;
var s2t = stringIDToTypeID,
    options = {
        cropAspectRatioModeKey: ['cropAspectRatioModeClass', 'pureAspectRatio'],
        aspectHeight: 666,
        aspectWidth: 777
    };
(r = new ActionReference()).putClass(s2t("cropTool"));
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
            // case "object": d.putEnumerated(s2t(k), s2t(v[0]), s2t(v[1])); break;
        }
    }
    return d;
}
