/**
 * Convert all notes/annotations to text layers in Photoshop scripting
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/convert-all-notes-annotations-to-text-layers-in-photoshop-scripting/td-p/13352760
 */
#target photoshop
var s2t = stringIDToTypeID,
    doc = new AM(),
    f = new File(Folder.temp.fsName + "/" + "annotations.psd");
if (doc.checkNotes()) {
    doc.duplicate('annotations', true);
    doc.setImageSize(1);
    activeDocument.xmpMetadata.rawData = '';
    doc.saveAs(f);
    doc.closeDocument();
    if (f) {
        f.open("r");
        f.encoding = "BINARY";
        var s = f.read();
        f.close();
        f.remove();
        i = s.indexOf('8BIMAnno')
        if (i) {
            var blockLength = hextoDec(toHex(s, i + 8, 4)),
                annotations = [];
            s = s.substr(i + 12, blockLength);
            do {
                var i = s.indexOf('txtC');
                if (i >= 0) {
                    blockLength = hextoDec(toHex(s, i + 4, 4)) - 2;
                    s = s.substr(i + 10);
                    if (blockLength) {
                        var content = '';
                        do {
                            content += String.fromCharCode(hextoDec(toHex(s, 0, 2)))
                            blockLength -= 2
                            s = s.substr(2)
                        } while (blockLength)
                        annotations.push(content);
                    }
                } else break;
            } while (true)
            for (var i = 0; i < annotations.length; i++) {
                activeDocument.artLayers.add()
                activeDocument.activeLayer.kind = LayerKind.TEXT
                activeDocument.activeLayer.textItem.contents = annotations[i]
            }
        }
    }
}
function toHex(s, from, bits) {
    s = s.substr(from, bits);
    var h = '';
    for (var i = 0; i < bits; i++) h += (('0' + s.charCodeAt(i).toString(16)).slice(-2));
    return h
}
function hextoDec(val) {
    var hex = val.split('').reverse().join(''),
        dec = 0;
    for (var i = 0; i < hex.length; i++) {
        dec += parseInt(hex[i], 16) * Math.pow(16, i);
    }
    return dec;
}
function AM() {
    var s2t = stringIDToTypeID;
    this.checkNotes = function () {
        try {
            (r = new ActionReference()).putEnumerated(s2t('annotation'), s2t('ordinal'), s2t('targetEnum'));
            (d = new ActionDescriptor()).putReference(s2t('null'), r);
            executeAction(s2t('delete'), d, DialogModes.NO);
            (r = new ActionReference()).putEnumerated(s2t('historyState'), s2t('ordinal'), s2t('previous'));
            (d = new ActionDescriptor()).putReference(s2t('null'), r);
            executeAction(s2t('select'), d, DialogModes.NO)
            return true
        } catch (e) {
            return false
        }
    }
    this.duplicate = function (title, merged) {
        (r = new ActionReference()).putEnumerated(s2t("document"), s2t("ordinal"), s2t("targetEnum"));
        (d = new ActionDescriptor()).putReference(s2t("target"), r);
        d.putString(s2t("name"), title);
        if (merged) d.putBoolean(s2t("merged"), merged);
        executeAction(s2t("duplicate"), d, DialogModes.NO);
    }
    this.setImageSize = function (width) {
        (d = new ActionDescriptor()).putUnitDouble(s2t("width"), s2t("pixelsUnit"), width);
        d.putBoolean(s2t("constrainProportions"), true);
        d.putEnumerated(s2t("interpolation"), s2t("interpolationType"), s2t("bilinear"));
        executeAction(s2t("imageSize"), d, DialogModes.NO);
    }
    this.saveAs = function (pth) {
        (d = new ActionDescriptor());
        (d1 = new ActionDescriptor()).putObject(s2t("as"), s2t("photoshop35Format"), d);
        d1.putPath(s2t("in"), pth);
        d1.putBoolean(s2t("embedProfiles"), false);
        executeAction(s2t("save"), d1, DialogModes.NO);
    }
    this.closeDocument = function () {
        (d = new ActionDescriptor()).putEnumerated(s2t('saving'), s2t('yesNo'), s2t('no'));
        executeAction(s2t('close'), d, DialogModes.NO)
    }
}