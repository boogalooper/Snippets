/** Script restores the initial names of files overwritten using Batch Rename or other scripts
 * https://www.youtube.com/watch?v=vF8TSsqQPr0
 */

/*
<javascriptresource>
<category>jazzy</category>
</javascriptresource>
*/

var PF = new PreservedFilename
if (ExternalObject.AdobeXMPScript == undefined) ExternalObject.AdobeXMPScript = new ExternalObject("lib:AdobeXMPScript")

switch (BridgeTalk.appName) {
    case "photoshop":
        PF.photoshop()
        break;
    case "bridge":
        PF.bridge()
        break;
}


function PreservedFilename() {

    this.bridge = function () {
        var toolMenu = MenuElement.create("command", "Get back preserved filenames", "at the end of Tools")
        toolMenu.onSelect = function () {
            var sel = app.document.selections
            for (var i = 0; i < sel.length; i++) {
                if (sel[i].type == "file") {
                    var m = sel[i].synchronousMetadata
                    m.namespace = "http://ns.adobe.com/xap/1.0/mm/"
                    if (m.PreservedFileName != "") {
                        renameFile(File(sel[i].spec), m.PreservedFileName)
                    }
                }
            }
        }
    }

    this.photoshop = function () {

        var fol = new Folder,
            selectedFolder = fol.selectDlg()

        app.doForcedProgress("", "renameFilesFromFolder(selectedFolder)")

        function renameFilesFromFolder(folder) {
            var allFiles = { PSD: [], PDD: [], PSDT: [], PSB: [], BMP: [], RLE: [], DIB: [], GIF: [], EPS: [], IFF: [], TDI: [], JPG: [], JPEG: [], JPE: [], JPF: [], JPX: [], JP2: [], J2C: [], J2K: [], JPC: [], JPS: [], MPO: [], PCX: [], PDF: [], PDP: [], RAW: [], PXR: [], PNG: [], SCT: [], TGA: [], VDA: [], ICB: [], VST: [], TIF: [], TIFF: [], PBM: [], PGM: [], PPM: [], PNM: [], PFM: [], PAM: [], DCM: [], DC3: [], DIC: [], CRW: [], NEF: [], RAF: [], ORF: [], MRW: [], DCR: [], MOS: [], SRF: [], PEF: [], CR2: [], DNG: [], ERF: [], X3F: [] }
            if (folder) {
                findAllFiles(folder, allFiles)

                for (var a in allFiles) {
                    if (allFiles[a].length > 0) {
                        var len = allFiles[a].length
                        for (var i = 0; i < len; i++) {
                            app.updateProgress(i + 1, len)
                            app.changeProgressText(allFiles[a][i].fsName)
                            var xmpFile = new XMPFile(allFiles[a][i].fsName, XMPConst.UNKNOWN, XMPConst.OPEN_FOR_READ),
                                xmp = xmpFile.getXMP();
                            if (xmp.doesPropertyExist(XMPConst.NS_XMP_MM, "PreservedFileName")) {
                                renameFile(allFiles[a][i], xmp.getProperty(XMPConst.NS_XMP_MM, "PreservedFileName"))
                            }
                        }
                    }
                }
            }
        }

        function findAllFiles(srcFolder, destObj) {
            var fileFolderArray = Folder(srcFolder).getFiles();

            for (var i = 0; i < fileFolderArray.length; i++) {
                var fileFoldObj = fileFolderArray[i];

                if (fileFoldObj instanceof File) {
                    if (!fileFoldObj.hidden) putFileToOject(fileFoldObj, destObj)
                } else if (useSubfolders) {
                    findAllFiles(subfolderArray[i], destObj)
                }
            }
        }

        function putFileToOject(fileName, fileObj) {
            var fle = decodeURI(fileName.name).toUpperCase()
            var lastDot = fle.lastIndexOf(".")
            if (lastDot == -1) return false
            var ext = fle.substr(lastDot + 1, fle.length - lastDot)
            if (fileObj.hasOwnProperty(ext)) { fileObj[ext].push(fileName); return true }
            return false
        }
    }

    function renameFile(oldFile, newName) {
        var oldFileName = decodeURI(oldFile.name),
            newFileName = decodeURI(newName).replace(/\.[^\.]+$/, ''),
            newFileExt = oldFileName.match(/[^\.]+$/),
            newFile = File(oldFile.parent + '/' + newFileName + "." + newFileExt)

        if (oldFile.exists) {
            if (oldFile.rename(createUniqueFileName(newFile))) {
                if (newFile.exists) {
                    try {
                        if (ExternalObject.AdobeXMPScript == undefined) ExternalObject.AdobeXMPScript = new ExternalObject("lib:AdobeXMPScript")
                        var xmpFile = new XMPFile(newFile.fsName, XMPConst.UNKNOWN, XMPConst.OPEN_FOR_UPDATE)
                        var xmp = xmpFile.getXMP()
                        xmp.setProperty(XMPConst.NS_XMP_MM, "PreservedFileName", oldFileName)
                        if (xmpFile.canPutXMP(xmp)) xmpFile.putXMP(xmp)
                        xmpFile.closeFile(XMPConst.CLOSE_UPDATE_SAFELY)
                    } catch (e) { }
                }
            }
        }
        return null
    }

    function createUniqueFileName(file) {
        var inParentPath = decodeURI(file.parent),
            inFileName = decodeURI(file.name.replace(/\.[^\.]+$/, '')),
            inFileExt = decodeURI(file.name.match(/[^\.]+$/)),
            uniqueFileName = File(inParentPath + '/' + inFileName + '.' + inFileExt),
            fileNumber = 1

        while (uniqueFileName.exists) {
            uniqueFileName = File(inParentPath + '/' + inFileName + " (" + fileNumber + ').' + inFileExt)
            fileNumber++;
        }
        return decodeURI(uniqueFileName.name)
    }
}