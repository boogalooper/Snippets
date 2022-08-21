/**Rasterization of an object of type shape after the end of the drawing process (by pressing Enter)
 *
 * The script works with Photoshop's event subsystem, so
 * launching directly from the code editor is not possible - script
 * must be saved to disk. 
 * 
 * https://community.adobe.com/t5/photoshop/javascript-script-trigger-action-through-enter-key-of-path-deselection/m-p/11573965
 https://www.youtube.com/watch?v=s_VdcEk3eJw
 */
#target photoshop
s2t = stringIDToTypeID,
    t2s = typeIDToStringID;
try { var evt = arguments[0] } catch (e) { }
if (evt) {
    if (app.currentTool == "penTool") {
        app.activeDocument.activeLayer.rasterize(RasterizeType.ENTIRELAYER);
    }
} else {
    app.notifiersEnabled = true
    var f = File($.fileName)
    app.notifiers.add('slct', f, 'Path')
}