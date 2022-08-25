/**
 * Is there a way or script to change items in photoshop preferences.
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/photoshop-preferences/td-p/13155686
 */

var myFile = (new File()).openDlg();

try {
    (d = new ActionDescriptor()).putPath(stringIDToTypeID('null'), myFile);
    d.putBoolean(stringIDToTypeID('overrideOpen'), true);
    var d1 = new ActionDescriptor();
    d.putObject(stringIDToTypeID('as'), stringIDToTypeID('Adobe Camera Raw'), d1);
    executeAction(stringIDToTypeID('open'), d, DialogModes.ALL);
} catch (e) { }

var dngName = new RegExp(encodeURI(decodeURI(myFile.name).replace(/\.[0-9a-z]+$/, '')) + '.+?\.dng', 'i'),
    dngFile = (Folder(myFile.path)).getFiles(dngName);

if (dngFile.length) {
    app.open(dngFile[0])
    activeDocument.saveAs(File(dngFile[0]), function () { var o = new JPEGSaveOptions; o.quality = 12; return o }())
    activeDocument.close()
    dngFile[0].remove()
}