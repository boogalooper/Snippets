///////////////////////////////////////////////////////////////////////////////
// Document ancestors remover ver. 0.3
// jazz-y@ya.ru
///////////////////////////////////////////////////////////////////////////////

/*
<javascriptresource>
<category>jazzy</category>
<enableinfo>true</enableinfo>
</javascriptresource>
*/

switch (BridgeTalk.appName) {
    case "photoshop":
        if (app.documents.length) {
            if (ExternalObject.AdobeXMPScript == undefined) ExternalObject.AdobeXMPScript = new ExternalObject("lib:AdobeXMPScript")
            var xmp = new XMPMeta(app.activeDocument.xmpMetadata.rawData)
            if (xmp.doesPropertyExist(XMPConst.NS_PHOTOSHOP, "DocumentAncestors")) {
                xmp.deleteProperty(XMPConst.NS_PHOTOSHOP, "DocumentAncestors")
                app.activeDocument.xmpMetadata.rawData = xmp.serialize()
            }
        }
        break;
    case "bridge":
        var toolMenu = MenuElement.create("command", "Delete document ancestors", "at the end of Tools")

        toolMenu.onSelect = function () {
            if (ExternalObject.AdobeXMPScript == undefined) ExternalObject.AdobeXMPScript = new ExternalObject("lib:AdobeXMPScript")
            var sel = app.document.selections, names = [], shift, counter = 0;

            for (var i = 0; i < sel.length; i++) {
                if (sel[i].type == "file") {
                    var xmpFile = new XMPFile(sel[i].path, XMPConst.UNKNOWN, XMPConst.OPEN_FOR_READ)
                    var xmp = xmpFile.getXMP()
                    if (xmp.doesPropertyExist(XMPConst.NS_PHOTOSHOP, "DocumentAncestors")) {
                        shift = 1;
                        do {
                            if (!xmp.doesArrayItemExist(XMPConst.NS_PHOTOSHOP, "DocumentAncestors", shift)) break;
                            shift++
                        } while (true)
                        names.push(sel[i].name)
                        counter += shift
                    }
                }
            }

            if (names.length > 0) {
                var msg = names.length > 20 ? "Найдено " + names.length + " документов." : "Найдены следующие документы:\n" + names.join('\n')
                if (confirm(msg + "\n\nОбщее количество записей document ancestors: " + counter + "\nПримерный размер метаданных: " + Number (counter / 10000 * 0.7).toFixed(4) + " МБ\n\nУдалить их?")) {
                    for (var i = 0; i < sel.length; i++) {
                        if (sel[i].type == "file") {
                            var xmpFile = new XMPFile(sel[i].path, XMPConst.UNKNOWN, XMPConst.OPEN_FOR_UPDATE)
                            var xmp = xmpFile.getXMP()
                            if (xmp.doesPropertyExist(XMPConst.NS_PHOTOSHOP, "DocumentAncestors")) {
                                xmp.deleteProperty(XMPConst.NS_PHOTOSHOP, "DocumentAncestors")
                                if (xmpFile.canPutXMP(xmp)) xmpFile.putXMP(xmp)
                            }
                            xmpFile.closeFile(XMPConst.CLOSE_UPDATE_SAFELY)
                        }
                    }
                }
            } else { alert("В выбранных документах не найдены данные document ancestors!") }
        }
        break;
}