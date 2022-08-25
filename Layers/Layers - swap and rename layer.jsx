/**transfer of the selected layer to another document  */
/*
<javascriptresource>
    <category>jazzy</category>
    <enableinfo>true</enableinfo>
    <eventid>2d22904d-cba0-48ca-aabb-cb5a91ab10a8</eventid>
</javascriptresource>
*/
var doc = app.activeDocument
var hs = doc.activeHistoryState
var ungr = false
var nm = ""
var tmplr
try {
    var desc = new ActionDescriptor()
    var ref = new ActionReference()
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), stringIDToTypeID("hidden"))
    desc.putReference(charIDToTypeID("null"), ref)
    executeAction(charIDToTypeID("Dlt "), desc, DialogModes.NO)
} catch (e) { }
var lrs = doc.layers
var num = lrs.length
for (var i = 0; i < num; i++) {
    if (lrs[i].grouped && lrs[i].visible) { if (nm != "") { var lr = lrs[i]; break } else { if (!tmplr) tmplr = lrs[i] } }
    if (lrs[i].kind == "LayerKind.TEXT" && nm == "" && lrs[i].visible) nm = lrs[i].textItem.contents
}
if (nm == "") lr = tmplr; if (!lr) { lr = lrs[num - 1]; ungr = true }
if (num > 1) {
    var desc2 = new ActionDescriptor()
    var ref2 = new ActionReference()
    ref2.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"))
    desc2.putReference(charIDToTypeID("null"), ref2)
    executeAction(stringIDToTypeID("selectAllLayers"), desc2, DialogModes.NO)
}
executeAction(stringIDToTypeID("newPlacedLayer"), undefined, DialogModes.NO)
if (nm != "") doc.activeLayer.name = nm
executeAction(charIDToTypeID("copy"), undefined, DialogModes.NO)
var desc3 = new ActionDescriptor()
var ref3 = new ActionReference()
ref3.putOffset(charIDToTypeID("Dcmn"), -1);
desc3.putReference(charIDToTypeID("null"), ref3)
desc3.putInteger(charIDToTypeID("DocI"), 0)
executeAction(charIDToTypeID("slct"), desc3, DialogModes.NO)
executeAction(charIDToTypeID("past"), undefined, DialogModes.NO)
app.activeDocument = doc
doc.activeHistoryState = hs
try {
    if (lr) {
        lrs = doc.layers; num = lrs.length; lr.visible = false
        if ((num - lr.itemIndex) > 0) { lr = doc.layers[doc.layers.length - lr.itemIndex - 1]; if (lr.grouped || ungr) doc.activeLayer = lr }
    }
} catch (e) { }