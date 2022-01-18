/*Is there an option that shows me a list with all smart objects paths?
https://community.adobe.com/t5/photoshop-ecosystem-ideas/is-there-an-option-that-shows-me-a-list-with-all-smart-objects-paths/idc-p/12689475#M13040
*/
#target photoshop

const UUID = "03d4b7b6-58ed-4446-9ccd-e625b96fce39",
    app = new AM('application'),
    doc = new AM('document'),
    lr = new AM('layer'),
    ico = {
        red: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x06\x00\x00\x00\u008D2\u00CF\u00BD\x00\x00\x00;IDAT\x18\u0095c\u00FCci\u00F3\u009F\u0081\b\u00C0\x02R\u00C2((\u0084W\u00E5\u00FF\u00F7\u00EF \n\u00C1\u0080\u0087\x17\u00BB\u00AA/\u009F\u00C1\x14\x131\u00D6\x0E\x15\u0085\b_C}\u0087W!(\u009C\u00F0\x02\x06\x06\x06\x00\x18\u00EF\fO\u0083\b\u00CC\u00FD\x00\x00\x00\x00IEND\u00AEB`\u0082",
        green: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x06\x00\x00\x00\u008D2\u00CF\u00BD\x00\x00\x00=IDAT\x18\u0095c\u00F4\u00DEo\u00F8\u009F\u0081\b\u00C0\x02R\"\u00C6\u00C9\u008FW\u00E5\u00AB\u00EF\x1F!\nA@\u0090\u009D\x1B\u00AB\u00A2\u00F7?\u00BF\u0082i&b\u00AC\x1D*\n\u00E1\u00BE\u0086\u00F9\x0E\u00AFBP8\u00E1\x05\f\f\f\x000\x1F\x0E\x05z4V\u0094\x00\x00\x00\x00IEND\u00AEB`\u0082",
        yellow: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x06\x00\x00\x00\u008D2\u00CF\u00BD\x00\x00\x00;IDAT\x18\u0095c\u00FCp@\u00ED?\x03\x11\u0080\x05\u00A4\u0084\u0089\u0093\x1B\u00AF\u00CA\x7F\u00DF\u00BFB\x14\u0082\x15\u00B3s`W\u00F4\u00F3\x07D\u009E\x18k\u0087\u008AB\u00B8\u00AFa\u00BE\u00C3\u00AB\x10\x14Nx\x01\x03\x03\x03\x00+\u00AA\x0E\u00CA*\u0090\u00C3\u00A2\x00\x00\x00\x00IEND\u00AEB`\u0082",
    }, u;

var allowedExtensions = function (s) { var t = {}; for (var i = 0; i < s.length; i++) t[s[i]] = true; return t }(["PSD", "PDD", "PSDT", "PSB", "BMP", "RLE", "DIB", "GIF", "EPS", "IFF", "TDI", "JPG", "JPEG", "JPE", "JPF", "JPX", "JP2", "J2C",
    "J2K", "JPC", "JPS", "MPO", "PCX", "PDF", "PDP", "PXR", "PNG", "SCT", "TGA", "VDA", "ICB", "VST", "TIFF", "PBM", "PGM", "PPM", "PNM", "PFM", "PAM",
    "DCM", "DC3", "DIC", "TIF", "CRW", "NEF", "RAF", "ORF", "MRW", "MOS", "SRF", "PEF", "DCR", "CR2", "DNG", "ERF", "X3F", "RAW", "ARW", "CR3", "KDC", "3FR",
    "MEF", "MFW", "NRW", "RWL", "RW2", "SRW", "GPR", "IIQ"])

if (app.getProperty('numberOfDocuments')) {
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
                        layerID: lr.getProperty('layerID', i, true),
                        link: splitFilename(smartObject.link == '' ? smartObject.fileReference : File(smartObject.link)),
                        fileReference: smartObject.fileReference,
                        sameFolder: null,
                        missed: null
                    }
                    smartObjects.push(cur)
                    allowedExtensions[cur.link.extension.toUpperCase()] = true
                }
            }
        }
    }

    smartObjects.clone = function () {
        var o = []; for (var i = 0; i < this.length; i++) {
            var cur = {}; for (a in this[i]) cur[a] = this[i][a]
            o.push(cur)
        }
        return o
    }

    if (smartObjects.reverse().length) {
        if ((fileList = showDialog(smartObjects.clone()))) {
            var toDo = [];
            for (var i = 0; i < fileList.length; i++) {
                if (fileList[i].link.fsName != smartObjects[i].link.fsName) {
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

                for (var i = 0; i < toDo.length; i++) {
                    lr.selectLayerByIDList([toDo[i].layerID])
                    lr.relinkCurrentLayer(toDo[i].link)
                }

                if (selection.length) lr.selectLayerByIDList(selection)
            }
        }
    }
}

function showDialog(fileList) {
    var w = new Window("dialog {text: 'Linked smart objects'}"),
        l = w.add("listbox", [0, 0, 600, 400], u, { multiselect: true }),
        gRelink = w.add("group{alignChildren: ['left','center'], alignment: ['fill','top']}"),
        rl = gRelink.add("button{text: 'Relink all', preferredSize: [150, -1]}"),
        dl = gRelink.add("dropdownlist", u, u, { items: ["specify each link manually", "change folder to current", "choose a new folder"] }),
        ch = gRelink.add("checkbox{text: 'match file extension'}"),
        gButtons = w.add("group"),
        bnOk = gButtons.add("button {text:'Ok'}", u, u, { name: "ok" }),
        bnCancel = gButtons.add("button {text:'Cancel'}", u, u, { name: "cancel" }),
        cfg = (new AM()).getScriptSettings(),
        relink = false;

    l.fillLinksList = function (items) {
        var currentSelection = []
        if (this.selection) for (var i = 0; i < this.selection.length; i++) currentSelection.push((this.selection[i]).index)

        this.removeAll()
        for (var i = 0; i < items.length; i++) {
            this.add('item', fileList[i].link instanceof File ?
                ((items[i].link.fsName != smartObjects[i].link.fsName ? ' ✎ ' : (items[i].missed ? ' ✖ ' : ' ✔ ')) + (items[i].link).fsName) :
                ((items[i].link != smartObjects[i].link ? ' ✎ ' : (items[i].missed ? ' ✖ ' : ' ✔ ')) + items[i].link.filename + '.' + items[i].link.extension))
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
                } else {
                    sameFolder = false
                    missed = true
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

    rl.onClick = function () {
        switch (dl.selection.index) {
            case 0:
                var len = l.selection ? l.selection.length : fileList.length,
                    currentSelection = [];
                if (l.selection) for (var i = 0; i < l.selection.length; i++) currentSelection.push((l.selection[i]).index)

                for (var i = 0; i < len; i++) {
                    l.selection = null
                    l.selection = [currentSelection.length ? currentSelection[i] : i]
                    l.onDoubleClick()
                    $.sleep(200)
                }

                if (currentSelection.length) l.selection = currentSelection
                break;
            case 1:
                if (documentFolder) {
                    findLinks(null, fileList, l.selection);
                } else { alert('Relink operation cannot be performed!\n\n- active document has no path!', 'Error', 1) }
                break;
            case 2:
                var p = (new Folder(documentFolder ? documentFolder : null)).selectDlg()
                if (p) {
                    findLinks(p, fileList, l.selection);
                }
                break;
        }

        l.fillLinksList(fileList.checkFiles())
    }

    bnOk.onClick = function () {
        (new AM()).putScriptSettings(cfg)
        relink = true;
        w.close()
    }

    ch.onClick = function () { cfg.matchExtension = this.value }
    dl.onChange = function () {
        cfg.relinkMode = ch.enabled = this.selection.index
    }

    w.onShow = function () {
        if (!documentFolder) { dl.items[1].enabled = false; cfg.relinkMode = 0 }
        dl.selection = cfg.relinkMode
        ch.value = cfg.matchExtension
        dl.size.width = w.size.width - rl.size.width - ch.size.width - 50
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
                link = findSimilarFiles(cur.filename, cur.extension, folders, parentFolder ? parentFolder : documentFolder)
            if (link) {
                files[a].link = splitFilename(link)
                delete toDo[a]
            }
        }

        if (function (o) { for (var a in o) { return true } }(toDo)) {
            var allFiles = enumAllFiles(parentFolder ? parentFolder : documentFolder)

            for (var a in toDo) {
                var cur = toDo[a].file
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

    w.show()
    if (relink) return fileList
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

    this.descToObject = function (d) {
        var o = {}
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
        var d = null
        try { d = getCustomOptions(UUID) } catch (e) { }
        return d ? this.descToObject(d) : new Config()
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
    this.matchExtension = true
}