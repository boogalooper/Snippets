/**Remembering the current open document and then returning to it
 * (the script is designed to be written to the action, but can also be used standalone) 
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/how-to-change-the-order-of-open-documents-for-an-action/m-p/12438243
 * https://www.youtube.com/watch?v=az3XF_z7i-w
 */

#target photoshop
/*
<javascriptresource>
<name>Target document</name>
<eventid>a4a27371-cedc-4af8-a6d1-f25765eca0cb</eventid>
<enableinfo>true</enableinfo>
<terminology><![CDATA[<< /Version 1 
                         /Events << 
                          /a4a27371-cedc-4af8-a6d1-f25765eca0cb [(Target document)<<
                          /select [(Mode) /string]
                          >>] 
                         >> 
                      >> ]]></terminology>
</javascriptresource>
*/
var s2t = stringIDToTypeID,
    isCancelled = false,
    UUID = 'a4a27371-cedc-4af8-a6d1-f25765eca0cb',
    id = null;
const REMEMBER = 'remebmer current document',
    SELECT = "select remembered document";
try { d = getCustomOptions(UUID) } catch (e) { }
if (d != undefined) id = d.getInteger(s2t('documentID'))
if (!app.playbackParameters.count) {
    var w = buildWindow(), result = w.show()
    switch (result) {
        case 0: saveSettings(result, true, true); break;
        case 1: selectDocumentByID(id, true); saveSettings(result, false, true); break;
        default: isCancelled = true;
    }
}
else {
    var d = app.playbackParameters,
        mode = d.getString(s2t('select'));
    if (app.playbackDisplayDialogs == DialogModes.ALL) {
        var w = buildWindow(mode == SELECT), result = w.show()
        if (result == 2) { isCancelled = true } else {
            if (result) {
                selectDocumentByID(id)
                saveSettings(result, false, true)
            } else {
                saveSettings(result, true, true)
            }
        }
    }
    if (app.playbackDisplayDialogs != DialogModes.ALL) {
        if (mode == SELECT) selectDocumentByID(id) else {
            saveSettings(0, true, false)
        }
    }
}
isCancelled ? 'cancel' : undefined
function buildWindow(sel) {
    var u = undefined,
        d = new Window("dialog {text: 'Target document' }"),
        dl = d.add("dropdownlist", u, u, { items: [REMEMBER, SELECT] }),
        g = d.add("group{orientation : 'row'}"),
        bnOk = g.add("button {text:'Ok'}", u, u, { name: "ok" }),
        bnCancel = g.add("button {text : 'Cancel'}", u, u, { name: "cancel" });
    dl.selection = sel != undefined ? sel : 0;
    bnOk.onClick = function () { w.close(dl.selection.index) }
    return d;
}
function saveSettings(mode, renewId, renewMode) {
    if (renewId) putCustomOptions(UUID, getDocumentID(), false);
    if (renewMode) {
        (d = new ActionDescriptor()).putString(s2t('select'), mode ? SELECT : REMEMBER);
        playbackParameters = d;
    }
}
function selectDocumentByID(id, silentMode) {
    if (id) {
        (r = new ActionReference()).putIdentifier(s2t('document'), id);
        (d = new ActionDescriptor()).putReference(s2t('target'), r);
        try { executeAction(s2t('select'), d, DialogModes.NO) } catch (e) { if (!silentMode) alert('Remembered document is not avaliable!') }
    }
    else { alert('No remembered document!') }
}
function getDocumentID() {
    (r = new ActionReference()).putProperty(s2t('property'), p = s2t('documentID'));
    r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
    return executeActionGet(r);
}
