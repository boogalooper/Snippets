/*Is there an option that shows me a list with all smart objects paths?
https://community.adobe.com/t5/photoshop-ecosystem-ideas/is-there-an-option-that-shows-me-a-list-with-all-smart-objects-paths/idc-p/12689475#M13040
*/
/*
// BEGIN__HARVEST_EXCEPTION_ZSTRING
<javascriptresource>
<name>Relink smart objects</name>
<category>jazzy</category>
<enableinfo>true</enableinfo>
</javascriptresource>
// END__HARVEST_EXCEPTION_ZSTRING
*/
#target photoshop
const UUID = "03d4b7b6-58ed-4446-9ccd-e625b96fce39",
    apl = new AM('application'),
    doc = new AM('document'),
    lr = new AM('layer'),
    ico = {
        red: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x06\x00\x00\x00\u008D2\u00CF\u00BD\x00\x00\x00;IDAT\x18\u0095c\u00FCci\u00F3\u009F\u0081\b\u00C0\x02R\u00C2((\u0084W\u00E5\u00FF\u00F7\u00EF \n\u00C1\u0080\u0087\x17\u00BB\u00AA/\u009F\u00C1\x14\x131\u00D6\x0E\x15\u0085\b_C}\u0087W!(\u009C\u00F0\x02\x06\x06\x06\x00\x18\u00EF\fO\u0083\b\u00CC\u00FD\x00\x00\x00\x00IEND\u00AEB`\u0082",
        green: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x06\x00\x00\x00\u008D2\u00CF\u00BD\x00\x00\x00=IDAT\x18\u0095c\u00F4\u00DEo\u00F8\u009F\u0081\b\u00C0\x02R\"\u00C6\u00C9\u008FW\u00E5\u00AB\u00EF\x1F!\nA@\u0090\u009D\x1B\u00AB\u00A2\u00F7?\u00BF\u0082i&b\u00AC\x1D*\n\u00E1\u00BE\u0086\u00F9\x0E\u00AFBP8\u00E1\x05\f\f\f\x000\x1F\x0E\x05z4V\u0094\x00\x00\x00\x00IEND\u00AEB`\u0082",
        yellow: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x06\x00\x00\x00\u008D2\u00CF\u00BD\x00\x00\x00;IDAT\x18\u0095c\u00FCp@\u00ED?\x03\x11\u0080\x05\u00A4\u0084\u0089\u0093\x1B\u00AF\u00CA\x7F\u00DF\u00BFB\x14\u0082\x15\u00B3s`W\u00F4\u00F3\x07D\u009E\x18k\u0087\u008AB\u00B8\u00AFa\u00BE\u00C3\u00AB\x10\x14Nx\x01\x03\x03\x03\x00+\u00AA\x0E\u00CA*\u0090\u00C3\u00A2\x00\x00\x00\x00IEND\u00AEB`\u0082",
    }, undefined;
var allowedExtensions = function (s) { var t = {}; for (var i = 0; i < s.length; i++) t[s[i]] = true; return t }(["PSD", "PDD", "PSDT", "PSB", "BMP", "RLE", "DIB", "GIF", "EPS", "IFF", "TDI", "JPG", "JPEG", "JPE", "JPF", "JPX", "JP2", "J2C",
    "J2K", "JPC", "JPS", "MPO", "PCX", "PDF", "PDP", "PXR", "PNG", "SCT", "TGA", "VDA", "ICB", "VST", "TIFF", "PBM", "PGM", "PPM", "PNM", "PFM", "PAM",
    "DCM", "DC3", "DIC", "TIF", "CRW", "NEF", "RAF", "ORF", "MRW", "MOS", "SRF", "PEF", "DCR", "CR2", "DNG", "ERF", "X3F", "RAW", "ARW", "CR3", "KDC", "3FR",
    "MEF", "MFW", "NRW", "RWL", "RW2", "SRW", "GPR", "IIQ"])
if (apl.getProperty('numberOfDocuments')) {
    if (doc.hasProperty('numberOfLayers')) {
        var len = doc.getProperty('numberOfLayers'),
            documentFolder = doc.hasProperty('fileReference') ? doc.getProperty('fileReference').path : null,
            smartObjects = [];
        for (var i = 1; i <= len; i++) {
            if (lr.getProperty('layerSection', i, true).value == 'layerSectionEnd') continue;
            if (lr.getProperty('layerKind', i, true) == 5) {
                var smartObject = doc.descToObject(lr.getProperty('smartObject', i, true).value)
                if (smartObject.linked) {
                    if (smartObject.link.type == 'ccLibrariesElement') continue;
                    var cur =
                    {
                        layerID: [lr.getProperty('layerID', i, true)],
                        link: splitFilename(smartObject.link == '' ? smartObject.fileReference : File(smartObject.link)),
                        fileReference: smartObject.fileReference,
                        sameFolder: null,
                        missed: null,
                        relink: false,
                        collected: null
                    }
                    var copyOfLayer = false;
                    for (var x = 0; x < smartObjects.length; x++) {
                        if (decodeURI(cur.link).toUpperCase() == decodeURI(smartObjects[x].link).toUpperCase()) {
                            copyOfLayer = true
                            smartObjects[x].layerID.push(cur.layerID[0])
                            break;
                        }
                    }
                    if (!copyOfLayer) smartObjects.push(cur)
                    allowedExtensions[cur.link.extension.toUpperCase()] = true
                }
            }
        }
    }
    smartObjects.clone = function () {
        var o = []; for (var i = 0; i < this.length; i++) {
            var cur = {}; for (var a in this[i]) cur[a] = this[i][a]
            o.push(cur)
        }
        return o
    }
    if (smartObjects.reverse().length) {
        smartObjects = (showDialog(smartObjects.clone()))
        if (smartObjects.length) app.doProgress('Relink files', 'relinkFiles(smartObjects)')
    }
    function relinkFiles(fileList) {
        var toDo = [];
        for (var i = 0; i < fileList.length; i++) {
            if (fileList[i].relink && !fileList[i].missed) {
                toDo.push(fileList[i])
            }
        }
        if (toDo.length) {
            var targetLayers = doc.hasProperty('targetLayersIDs') ? doc.getProperty('targetLayersIDs') : null,
                selection = [];
            if (targetLayers) {
                for (var i = 0; i < targetLayers.count; i++) {
                    selection.push(targetLayers.getReference(i).getIdentifier(stringIDToTypeID('layerID')))
                }
            }
            do {
                var cur = toDo.pop()
                for (var i = 0; i < cur.layerID.length; i++) {
                    lr.selectLayerByIDList([cur.layerID[i]])
                    lr.relinkCurrentLayer(cur.link)
                }
            } while (toDo.length)
            if (selection.length) lr.selectLayerByIDList(selection)
        }
    }
}
function showDialog(fileList) {
    var w = new Window("dialog {text: 'Linked smart objects'}"),
        l = w.add("listbox", [0, 0, 600, 400], undefined, { multiselect: true }),
        gRelink = w.add("group{alignChildren: ['left','center'], alignment: ['fill','top']}"),
        rl = gRelink.add("button{text: 'Relink all', preferredSize: [170, -1]}"),
        dl = gRelink.add("dropdownlist", undefined, undefined, { items: ["change folder to current", "choose a new folder"] }),
        chMatch = gRelink.add("checkbox{text: 'match file extension', preferredSize: [150, -1]}"),
        gCollect = w.add("group{alignChildren: ['left','center'], alignment: ['fill','top']}"),
        chCollect = gCollect.add("checkbox{text: 'collect assets in subfolder:', preferredSize: [170, -1]}"),
        gSubCollect = gCollect.add("group{alignChildren: ['left','center'], alignment: ['fill','top']}"),
        et = gSubCollect.add("edittext{preferredSize: [100, -1]}"),
        chGroup = gSubCollect.add("checkbox{text: 'group by extension', preferredSize: [120, -1]}"),
        chMove = gSubCollect.add("checkbox{text: 'move files', preferredSize: [70, -1]}"),
        gButtons = w.add("group"),
        bnOk = gButtons.add("button {text:'Ok'}", undefined, undefined, { name: "ok" }),
        bnCancel = gButtons.add("button {text:'Cancel'}", undefined, undefined, { name: "cancel" }),
        cfg = (new AM()).getScriptSettings(),
        targetFolder = null;
    l.graphics.font = "dialog:12";
    l.fillLinksList = function (items) {
        var currentSelection = []
        if (this.selection) for (var i = 0; i < this.selection.length; i++) currentSelection.push((this.selection[i]).index)
        this.removeAll()
        for (var i = 0; i < items.length; i++) {
            this.add('item', fileList[i].link instanceof File ?
                ((items[i].relink ? ' ✎ ' : (items[i].missed ? ' ✖ ' : ' ✔ ')) + (items[i].link).fsName) :
                ((items[i].relink ? ' ✎ ' : (items[i].missed ? ' ✖ ' : ' ✔ ')) + items[i].link.filename + '.' + items[i].link.extension))
            this.items[i].image = items[i].missed ? ico.red : (items[i].sameFolder ? ico.green : ico.yellow)
        }
        if (currentSelection.length) this.selection = currentSelection
    }
    fileList.checkFiles = function () {
        for (var i = 0; i < this.length; i++) {
            with (this[i]) {
                if (this[i].link instanceof File) {
                    sameFolder = documentFolder != null ? (decodeURI(link).indexOf(decodeURI(documentFolder)) == 0 ? true : false) : null
                    missed = !link.exists
                    relink = (this[i].link.fsName != smartObjects[i].link.fsName)
                } else {
                    sameFolder = false
                    missed = true
                    relink = (this[i].link != smartObjects[i].link)
                }
            }
        }
        return this
    }
    l.onClick = function () {
        rl.text = l.selection != null ? 'Relink selected' + (l.selection.length > 1 ? ' (' + l.selection.length + ')' : '') : 'Relink all'
    }
    l.onDoubleClick = function () {
        if (l.selection != null) {
            if ((l.selection[0]).index >= 0) {
                var cur = fileList[(l.selection[0]).index].link instanceof File ? fileList[(l.selection[0]).index].link : new File;
                var f = splitFilename(cur.openDlg("Replace link for " + fileList[(l.selection[0]).index].fileReference, "", false))
                if (f && f.exists) {
                    if (allowedExtensions[f.extension.toUpperCase()]) {
                        fileList[(l.selection[0]).index].link = f
                        l.fillLinksList(fileList.checkFiles())
                    } else { alert('Relink operation cannot be performed!\n\n*.' + f.extension + ' files does not supported!', 'Error', 1) }
                }
            }
        }
    }
    rl.onClick = function (mode) {
        switch (dl.selection.index) {
            case 0:
                if (documentFolder) {
                    targetFolder = documentFolder;
                } else { alert('Relink operation cannot be performed!\n\n- active document has no path!', 'Error', 1) }
                break;
            case 1:
                var p = (new Folder(documentFolder ? documentFolder : null)).selectDlg()
                if (p) targetFolder = p;
                break;
        }
        if (!mode) {
            if (!mode) app.doProgress('Search files', 'findLinks(targetFolder, fileList, l.selection)')
            l.fillLinksList(fileList.checkFiles())
        }
    }
    chCollect.onClick = function () { gSubCollect.enabled = cfg.collect = this.value }
    chGroup.onClick = function () { cfg.groupByExtension = this.value }
    chMove.onClick = function () {
        cfg.move = this.value
        if (this.value) {
            if (!confirm('Function collect assets in specifed subfolder of target directory. How it works:\n1. Move all asset files from target folder to subfolder\n2. Copy all asset files from another folders to subfolder\n\nTo move files, script uses "copy" and then "delete" commands. This works fine in most cases, but be aware - deletes occurs without moving it to the system trash!\n\nUse at your own risk!\n\n\Enable option?', true, 'Warning!'))
                cfg.move = this.value = false
        }
    }
    bnOk.onClick = function () {
        if (targetFolder == null) { rl.onClick(true) }
        if (cfg.collect) { app.doProgress('Collect files', 'collectAssets(targetFolder, fileList)') }
        (new AM()).putScriptSettings(cfg)
        w.close()
    }
    bnCancel.onClick = function () { fileList = []; w.close() }
    chMatch.onClick = function () { cfg.matchExtension = this.value }
    dl.onChange = function () {
        cfg.relinkMode = chMatch.enabled = this.selection.index
    }
    w.onShow = function () {
        if (!documentFolder) { dl.items[0].enabled = false; cfg.relinkMode = 1 }
        dl.selection = cfg.relinkMode ? 1 : 0
        chMatch.value = cfg.matchExtension
        gSubCollect.enabled = chCollect.value = cfg.collect
        et.text = cfg.subfolder
        chGroup.value = cfg.groupByExtension
        chMove.value = cfg.move
        dl.size.width = w.size.width - rl.size.width - chMatch.size.width - 50
        et.size.width = w.size.width - chGroup.size.width - chCollect.size.width - chMove.size.width - 80
        w.layout.layout(true)
        l.fillLinksList(fileList.checkFiles())
    }
    function findLinks(parentFolder, files, selected) {
        var fileCache = {},
            toDo = {},
            len = selected ? selected.length : files.length;
        for (var i = 0; i < len; i++) {
            var index = selected ? (selected[i]).index : i
            toDo[index] = { file: files[index] }
        }
        for (var a in toDo) {
            var cur = toDo[a].file.link,
                folders = cur instanceof File ? (decodeURI(cur.path).split('/')) : [],
                link = findSimilarFiles(cur.filename, cur.extension, folders, documentFolder);
            if (link) {
                files[a].link = splitFilename(link)
                delete toDo[a]
            }
        }
        var len = function (o) { for (var a in o) { return true } }(toDo)
        if (len) {
            var c = 1;
            app.updateProgress(c++, len + 1)
            app.changeProgressText('Buld list of files')
            var allFiles = enumAllFiles(documentFolder)
            for (var a in toDo) {
                var cur = toDo[a].file
                app.updateProgress(c++, len + 1)
                app.changeProgressText(cur.fileReference)
                if (allFiles[cur.link.filename]) {
                    var cur = allFiles[cur.link.filename],
                        link = null;
                    for (var i = 0; i < cur.length; i++)
                        if (files[a].link.extension.toUpperCase() == cur[i].extension.toUpperCase()) {
                            link = cur[i]
                            break;
                        }
                    if (!link && !cfg.matchExtension) link = cur[0]
                    if (link) {
                        files[a].link = splitFilename(link)
                        delete toDo[a]
                    }
                }
            }
        }
        function findSimilarFiles(fle, ext, dir, parent) {
            var subPath = '',
                len = dir.length;
            for (var i = 0; i < len; i++) {
                if (dir[i] == '') continue;
                subPath = '/' + dir[i] + '/' + subPath
                var f = checkFile(fle, ext, parent + subPath)
                if (f) return f
            }
            var f = checkFile(fle, ext, parent)
            if (f) {
                return f
            };
            return null
            function checkFile(fle, ext, pth) {
                var f = new File(pth + '/' + fle + '.' + ext)
                if (f.exists) {
                    return f
                }
                else if (!cfg.matchExtension) {
                    fle = fle.toUpperCase()
                    var p = new Folder(pth)
                    if (p.exists) {
                        if (!fileCache[pth]) fileCache[pth] = p.getFiles()
                        var cur = fileCache[pth];
                        for (var i = 0; i < cur.length; i++) {
                            if (cur[i] instanceof File) {
                                var f = splitFilename(cur[i]);
                                if (f.filename.toUpperCase() == fle && allowedExtensions[f.extension.toUpperCase()]) return cur[i]
                            }
                        }
                    }
                }
                return null;
            }
        }
        function enumAllFiles(parent, listOfFiles) {
            listOfFiles = listOfFiles ? listOfFiles : {};
            var files = Folder(parent).getFiles();
            for (var i = 0; i < files.length; i++) {
                var cur = files[i];
                if (cur instanceof File) {
                    if (!cur.hidden) {
                        cur = splitFilename(cur)
                        if (allowedExtensions[cur.extension.toUpperCase()]) {
                            if (!listOfFiles[cur.filename]) {
                                listOfFiles[cur.filename] = [cur]
                            } else {
                                listOfFiles[cur.filename].push(cur)
                            }
                        }
                    }
                } else if (cur instanceof Folder) {
                    enumAllFiles(cur, listOfFiles, listOfFiles)
                }
            }
            return listOfFiles
        }
    }
    function collectAssets(parentFolder, files) {
        if (!parentFolder) return
        findEqualFiles(files)
        var subfolder = '/' + cfg.subfolder.replace(/[~#%&*{}:<>?|\"-]/g, "_") + '/'
        if (!subfolder.replace(/[\/ .]/g, "").length) subfolder = '/'
        for (var i = 0; i < files.length; i++) {
            if (files[i].missed) continue;
            var target = splitFilename(new File(parentFolder + subfolder + (cfg.groupByExtension ? '/' + files[i].link.extension.toUpperCase() + '/' : '') + files[i].link.filename + '.' + files[i].link.extension))
            if (target.exists && (decodeURI(target).toUpperCase() == decodeURI(files[i].link).toUpperCase())) {
                continue;
            } else {
                target = createUniqueFileName(target)
            }
            var c = 1
            app.updateProgress(c++, files.length)
            app.changeProgressText(files[i].fileReference)
            if (!(Folder(target.path).exists)) Folder(target.path).create()
            if (files[i].link.copy(target)) {
                files[i].collected = target
                files[i].relink = true
            }
        }
        for (var i = 0; i < files.length; i++) {
            if (cfg.move) {
                if (files[i].collected && files[i].sameFolder) {
                    files[i].link.remove()
                    var cur = Folder(files[i].link.path)
                    if (cur.getFiles().length == 0) {
                        cur.remove()
                        do {
                            cur = Folder(cur.path)
                            if (cur.getFiles().length) break;
                        } while (cur.remove())
                    }
                }
                files[i].link = files[i].collected
            }
        }
        function findEqualFiles(files) {
            var o = [], f = files.slice();
            do {
                var cur = f.shift()
                if (!cur.missed) {
                    for (var i = 0; i < f.length; i++) {
                        if (decodeURI(cur.link).toUpperCase() == decodeURI(f[i].link).toUpperCase()) {
                            if (!f[i].missed) cur.layerID.push(f[i].layerID[0])
                            f[i].missed = true
                        }
                    }
                    o.push(cur)
                }
            } while (f.length)
        }
        function createUniqueFileName(target) {
            var parent = decodeURI(target.path),
                f = target,
                c = 1;
            while (f.exists) {
                f = splitFilename(new File(parent + '/' + target.filename + " (" + c + ').' + target.extension))
                c++;
            }
            return f
        }
    }
    w.show()
    return (fileList)
}
function splitFilename(f) {
    var s;
    if (f) {
        if (f instanceof File) { s = decodeURI(f.name) }
        else {
            s = f
            f = {}
        }
        f.filename = s.substr(0, s.lastIndexOf('.'))
        f.extension = (s.substr(s.lastIndexOf('.') + 1, s.length))
    }
    return f
}
function AM(target) {
    var s2t = stringIDToTypeID,
        t2s = typeIDToStringID;
    target = target ? s2t(target) : null;
    this.getProperty = function (property, id, idxMode) {
        property = s2t(property);
        (r = new ActionReference()).putProperty(s2t('property'), property);
        id != undefined ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id)) :
            r.putEnumerated(target, s2t('ordinal'), s2t('targetEnum'));
        return getDescValue(executeActionGet(r), property)
    }
    this.hasProperty = function (property, id, idxMode) {
        property = s2t(property);
        (r = new ActionReference()).putProperty(s2t('property'), property);
        id ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id))
            : r.putEnumerated(target, s2t('ordinal'), s2t('targetEnum'));
        try { return executeActionGet(r).hasKey(property) } catch (e) { return false }
    }
    this.descToObject = function (d, o) {
        o = o ? o : {}
        for (var i = 0; i < d.count; i++) {
            var k = d.getKey(i)
            o[t2s(k)] = getDescValue(d, k)
        }
        return o
    }
    this.relinkCurrentLayer = function (pth) {
        (d = new ActionDescriptor()).putPath(s2t("target"), pth);
        executeAction(s2t("placedLayerRelinkToFile"), d, DialogModes.NO);
    }
    this.selectLayerByIDList = function (IDList) {
        var ref = new ActionReference()
        for (var i = 0; i < IDList.length; i++) {
            ref.putIdentifier(s2t("layer"), IDList[i])
        }
        var desc = new ActionDescriptor()
        desc.putReference(s2t("target"), ref)
        desc.putBoolean(s2t("makeVisible"), false)
        executeAction(s2t("select"), desc, DialogModes.NO)
    }
    function getDescValue(d, p) {
        switch (d.getType(p)) {
            case DescValueType.OBJECTTYPE: return { type: t2s(d.getObjectType(p)), value: d.getObjectValue(p) };
            case DescValueType.LISTTYPE: return d.getList(p);
            case DescValueType.REFERENCETYPE: return d.getReference(p);
            case DescValueType.BOOLEANTYPE: return d.getBoolean(p);
            case DescValueType.STRINGTYPE: return d.getString(p);
            case DescValueType.INTEGERTYPE: return d.getInteger(p);
            case DescValueType.LARGEINTEGERTYPE: return d.getLargeInteger(p);
            case DescValueType.DOUBLETYPE: return d.getDouble(p);
            case DescValueType.ALIASTYPE: return d.getPath(p);
            case DescValueType.CLASSTYPE: return d.getClass(p);
            case DescValueType.UNITDOUBLE: return (d.getUnitDoubleValue(p));
            case DescValueType.ENUMERATEDTYPE: return { type: t2s(d.getEnumerationType(p)), value: t2s(d.getEnumerationValue(p)) };
            default: break;
        };
    }
    this.getScriptSettings = function () {
        var d = null;
        try { d = getCustomOptions(UUID) } catch (e) { }
        return d ? this.descToObject(d, new Config()) : new Config();
    }
    this.putScriptSettings = function (o) {
        var d = objToDesc(o)
        putCustomOptions(UUID, d)
        function objToDesc(o) {
            var d = new ActionDescriptor;
            for (var i = 0; i < o.reflect.properties.length; i++) {
                var k = o.reflect.properties[i].toString();
                if (k == "__proto__" || k == "__count__" || k == "__class__" || k == "reflect") continue;
                var v = o[k];
                k = s2t(k);
                switch (typeof (v)) {
                    case "boolean": d.putBoolean(k, v); break;
                    case "number": d.putInteger(k, v); break;
                }
            }
            return d;
        }
    }
}
function Config() {
    this.relinkMode = 0
    this.matchExtension = false
    this.collect = false
    this.subfolder = 'assets'
    this.groupByExtension = true
    this.move = false
}