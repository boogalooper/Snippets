#target photoshop
/*
// BEGIN__HARVEST_EXCEPTION_ZSTRING
<javascriptresource>
<name>Relink files</name>
<category>jazzy</category>
<enableinfo>true</enableinfo>
</javascriptresource>
// END__HARVEST_EXCEPTION_ZSTRING
*/
$.localize = true
//$.locale = 'ru'
const UUID = 'a3e4d053-135c-4225-b741-39bcb6656fd0',
    apl = new AM('application'),
    doc = new AM('document'),
    lr = new AM('layer'),
    fn = new CommonFunctions(),
    str = new Locale(),
    ver = '0.2';
var allowedExtensions = function (s) { var t = {}; for (var i = 0; i < s.length; i++) t[s[i]] = true; return t }(['PSD', 'PDD', 'PSDT', 'PSB', 'BMP', 'RLE', 'DIB', 'GIF', 'EPS', 'IFF', 'TDI', 'JPG', 'JPEG', 'JPE', 'JPF', 'JPX', 'JP2', 'J2C',
    'J2K', 'JPC', 'JPS', 'MPO', 'PCX', 'PDF', 'PDP', 'PXR', 'PNG', 'SCT', 'TGA', 'VDA', 'ICB', 'VST', 'TIFF', 'PBM', 'PGM', 'PPM', 'PNM', 'PFM', 'PAM',
    'DCM', 'DC3', 'DIC', 'TIF', 'CRW', 'NEF', 'RAF', 'ORF', 'MRW', 'MOS', 'SRF', 'PEF', 'DCR', 'CR2', 'DNG', 'ERF', 'X3F', 'RAW', 'ARW', 'CR3', 'KDC', '3FR',
    'MEF', 'MFW', 'NRW', 'RWL', 'RW2', 'SRW', 'GPR', 'IIQ']),
    cfg = (new AM()).getScriptSettings();
main();
function main() {
    try {
        var runMode = version.split('.')[0] < 21 ? false : true;
        if (!runMode) cfg.checkEmbedded = false;
        do {
            var currentSelection = fn.getSelectedLayersIds(),
                smartObjects = fn.buildSmartObjectsTree(),
                filesList = fn.buildFilesList(smartObjects);
            if (filesList.length) {
                if (fn.isDitry) app.refresh()
                var w = new mainWindow(filesList, runMode),
                    result = w.show();
                if (result == 1) {
                    activeDocument.suspendHistory(str.relink.toString(), 'fn.relink(filesList, smartObjects)')
                    if (currentSelection.length) doc.selectLayerByIDList(currentSelection)
                }
            } else {
                alert(str.errNoFiles, str.warning)
                result = 0
            }
            fn.isDitry = false
        } while (result == 3)
    } catch (e) {
        if (confirm(str.errGlobal, true, str.err)) fn.createReport(smartObjects, filesList, e);
    }
}
function AM(target) {
    var s2t = stringIDToTypeID,
        t2s = typeIDToStringID;
    target = target ? s2t(target) : null;
    this.getProperty = function (property, id, idxMode) {
        r = new ActionReference();
        if (property) {
            property = s2t(property);
            r.putProperty(s2t('property'), property);
        }
        id != undefined ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id)) :
            r.putEnumerated(target, s2t('ordinal'), s2t('targetEnum'));
        try { return property ? getDescValue(executeActionGet(r), property) : executeActionGet(r) } catch (e) { return null }
    }
    this.hasProperty = function (property, id, idxMode) {
        property = s2t(property);
        (r = new ActionReference()).putProperty(s2t('property'), property);
        id ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id))
            : r.putEnumerated(target, s2t('ordinal'), s2t('targetEnum'));
        try { return executeActionGet(r).hasKey(property) } catch (e) { return false }
    }
    this.descToObject = function (d, o) {
        if (d) {
            o = o ? o : {}
            for (var i = 0; i < d.count; i++) {
                var k = d.getKey(i)
                o[t2s(k)] = getDescValue(d, k)
            }
            return o
        }
    }
    this.relinkCurrentLayer = function (pth) {
        try {
            (d = new ActionDescriptor()).putPath(s2t('target'), pth);
            executeAction(s2t('placedLayerRelinkToFile'), d, DialogModes.NO);
            return true;
        } catch (e) { return false }
    }
    this.deleteCurrentHistoryState = function () {
        (r = new ActionReference()).putProperty(s2t('historyState'), s2t('currentHistoryState'));
        (d = new ActionDescriptor()).putReference(s2t('target'), r);
        try { executeAction(s2t('delete'), d, DialogModes.NO); } catch (e) { }
    }
    this.convertSmartObjectToLayers = function () {
        try { executeAction(s2t('placedLayerConvertToLayers'), undefined, DialogModes.NO); return true } catch (e) { return false }
    }
    this.selectLayerByIDList = function (IDList) {
        var ref = new ActionReference()
        for (var i = 0; i < IDList.length; i++) {
            ref.putIdentifier(s2t('layer'), IDList[i])
        }
        var desc = new ActionDescriptor()
        desc.putReference(s2t('target'), ref)
        desc.putBoolean(s2t('makeVisible'), false)
        executeAction(s2t('select'), desc, DialogModes.NO)
    }
    this.editSmartObject = function () {
        try {
            executeAction(s2t('placedLayerEditContents'), undefined, DialogModes.NO)
            return true
        } catch (e) { return false }
    }
    this.closeDocument = function (save) {
        save = save != true ? s2t('no') : s2t('yes');
        (d = new ActionDescriptor()).putEnumerated(s2t('saving'), s2t('yesNo'), save);
        executeAction(s2t('close'), d, DialogModes.NO)
    }
    this.applyLocking = function (desc, id, idxMode) {
        if (!desc) {
            desc = new ActionDescriptor();
            desc.putBoolean(s2t('protectNone'), true);
        }
        var r = new ActionReference();
        id ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id))
            : r.putEnumerated(target, s2t('ordinal'), s2t('targetEnum'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        d.putObject(s2t('layerLocking'), s2t('layerLocking'), desc);
        executeAction(s2t('applyLocking'), d, DialogModes.NO);
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
                if (k == '__proto__' || k == '__count__' || k == '__class__' || k == 'reflect') continue;
                var v = o[k];
                k = s2t(k);
                switch (typeof (v)) {
                    case 'boolean': d.putBoolean(k, v); break;
                    case 'number': d.putInteger(k, v); break;
                    case 'string': d.putString(k, v); break;
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
    this.checkEmbedded = true
}
function CommonFunctions() {
    this.getSelectedLayersIds = function () {
        if (!apl.getProperty('numberOfDocuments')) return []
        var targetLayers = doc.hasProperty('targetLayersIDs') ? doc.getProperty('targetLayersIDs') : [],
            selection = [];
        if (targetLayers) {
            for (var i = 0; i < targetLayers.count; i++) {
                selection.push(targetLayers.getReference(i).getIdentifier(stringIDToTypeID('layerID')))
            }
        }
        return selection;
    }
    this.buildSmartObjectsTree = function () {
        if (!apl.getProperty('numberOfDocuments')) return null
        var smartObjects = getSmartObjectsList(),
            len = 0;
        if (cfg.checkEmbedded) {
            for (var a in smartObjects) if (!lr.getProperty('smartObject', a).value.getBoolean(stringIDToTypeID('linked'))) len++
        }
        this.isDitry = Boolean(len)
        var progress = progressWindow(str.findEmbedded, '', len)
        if (len && cfg.checkEmbedded) progress.show()
        enumSmartObjects(smartObjects, len, progress)
        progress.close()
        return smartObjects.toSource() == '({})' ? null : smartObjects
    }
    this.buildFilesList = function (smartObjects) {
        var filesList = [];
        if (smartObjects != null) filesList = findEqualFiles(collectFiles(smartObjects));
        function collectFiles(so, filesList) {
            filesList = filesList ? filesList : []
            for (var a in so) {
                if (so[a].fileReference) filesList.push(describeFile(so[a], Number(a))) else collectFiles(so[a], filesList)
            }
            return filesList
        }
        function describeFile(o, id) {
            o.sameFolder = null
            o.missed = null
            o.relink = null
            o.collected = null
            o.relinked = null
            allowedExtensions[o.link.extension.toUpperCase()] = true
            return o
        }
        filesList.checkFiles = function () {
            for (var i = 0; i < this.length; i++) {
                with (this[i]) {
                    var cur = this[i].relink ? relink : link
                    if (cur instanceof File) {
                        sameFolder = fn.documentFolder != null ? (decodeURI(cur).toUpperCase().indexOf(decodeURI(fn.documentFolder).toUpperCase()) == 0 ? true : false) : null
                        missed = !cur.exists
                    } else {
                        sameFolder = false
                        missed = true
                    }
                }
            }
            return this
        }
        return filesList
    }
    this.splitFilename = function (f) {
        var s;
        if (f) {
            if (f instanceof File) { s = decodeURI(f.name) }
            else {
                s = f.filename ? f.filename : f
                f = {}
            }
            f.filename = s.substr(0, s.lastIndexOf('.'))
            f.extension = (s.substr(s.lastIndexOf('.') + 1, s.length))
        }
        return f
    }
    this.findLinks = function (parentFolder, files, selected) {
        var fileCache = {},
            toDo = {},
            len = selected ? selected.length : files.length;
        for (var i = 0; i < len; i++) {
            var index = selected ? (selected[i]).index : i
            toDo[index] = files[index]
        }
        if (len) {
            for (var a in toDo) {
                if (toDo[a].sameFolder) {
                    with (toDo[a]) {
                        var cur = relink ? relink : link,
                            folders = parentFolder != null && cur instanceof File ? (decodeURI(cur.path).replace(new RegExp(decodeURI(parentFolder), 'i'), '').split('/')) : [];
                    }
                    var link = findSimilarFiles(cur.filename, cur.extension, folders, parentFolder);
                    if (link) {
                        files[a].relink = decodeURI(link).toUpperCase() == decodeURI(toDo[a].link).toUpperCase() ? null : link;
                        delete toDo[a]
                    }
                }
            }
            {
                var len = getObjectLength(toDo)
                if (len) {
                    var c = 1;
                    app.updateProgress(c++, len + 1)
                    var allFiles = enumAllFiles(parentFolder)
                    for (var a in toDo) {
                        var cur = toDo[a]
                        app.changeProgressText(str.searchFile + cur.fileReference)
                        app.updateProgress(c++, len + 1)
                        var hash = stringIDToTypeID(cur.link.filename)
                        if (allFiles[hash]) {
                            var cur = allFiles[hash],
                                link = null;
                            for (var i = 0; i < cur.length; i++)
                                if (files[a].link.extension.toUpperCase() == cur[i].extension.toUpperCase()) {
                                    link = cur[i]
                                    break;
                                }
                            if (!link && !cfg.matchExtension) link = cur[0]
                            if (link) {
                                files[a].relink = decodeURI(link).toUpperCase() == decodeURI(toDo[a].link).toUpperCase() ? null : link
                                delete toDo[a]
                            }
                        }
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
            return f ? f : null
            function checkFile(fle, ext, pth) {
                var f = new File(pth + '/' + fle + '.' + ext)
                if (f.exists) {
                    return splitFilename(f)
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
                                if (f.filename.toUpperCase() == fle && allowedExtensions[f.extension.toUpperCase()]) return f
                            }
                        }
                    }
                }
                return null;
            }
        }
        function enumAllFiles(parent, listOfFiles) {
            app.changeProgressText(str.buildFileList + decodeURI(Folder(parent).name))
            listOfFiles = listOfFiles ? listOfFiles : {};
            var files = Folder(parent).getFiles();
            for (var i = 0; i < files.length; i++) {
                app.updateProgress(i + 1, files.length)
                var cur = files[i];
                if (cur instanceof File) {
                    if (!cur.hidden) {
                        cur = splitFilename(cur)
                        if (allowedExtensions[cur.extension.toUpperCase()]) {
                            var hash = stringIDToTypeID(cur.filename)
                            if (!listOfFiles[hash]) {
                                listOfFiles[hash] = [cur]
                            } else {
                                listOfFiles[hash].push(cur)
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
    this.collectAssets = function (parentFolder, files) {
        if (!parentFolder) return
        var subfolder = '/' + cfg.subfolder.replace(/[~#%&*{}:<>?|\'-]/g, '_') + '/'
        if (!subfolder.replace(/[\/ .]/g, '').length) subfolder = '/'
        var progress = new progressWindow(str.copyAssets, '', files.length);
        progress.show()
        for (var i = 0; i < files.length; i++) {
            progress.updateProgress(files[i].fileReference)
            if (files[i].missed) continue;
            var cur = files[i].relink ? files[i].relink : files[i].link,
                target = splitFilename(new File(parentFolder + subfolder + (cfg.groupByExtension ? '/' + cur.extension.toUpperCase() + '/' : '') + cur.filename + '.' + cur.extension));
            if (target.exists && (decodeURI(target).toUpperCase() == decodeURI(cur).toUpperCase())) {
                continue;
            } else {
                target = createUniqueFileName(target)
            }
            if (!(Folder(target.path).exists)) Folder(target.path).create()
            if (cur.copy(target)) {
                files[i].collected = cur
                files[i].relink = target
            }
        }
        progress.close()
        function createUniqueFileName(target) {
            var parent = decodeURI(target.path),
                f = target,
                c = 1;
            while (f.exists) {
                f = splitFilename(new File(parent + '/' + target.filename + ' (' + c + ').' + target.extension))
                c++;
            }
            return f
        }
    }
    this.relink = function (files, smartObjects) {
        var toRelink = [],
            linkedObjects = {},
            embeddedObjects = {},
            locked = unlockLayers();
        for (var i = 0; i < files.length; i++) if (files[i].relink) toRelink.push(files[i])
        for (var a in smartObjects) {
            if (smartObjects[a].link) { linkedObjects[a] = smartObjects[a] }
            else { embeddedObjects[a] = flattenObject(smartObjects[a]) }
        }
        if (toRelink.length) {
            var progress = new progressWindow(str.relink, '', toRelink.length)
            progress.show()
            for (var a in linkedObjects) {
                for (var i = 0; i < toRelink.length; i++) {
                    if (isEqualObject(linkedObjects[a].link, toRelink[i].link)) {
                        lr.selectLayerByIDList([Number(a)])
                        progress.updateProgress(lr.getProperty('name', Number(a)))
                        if (lr.relinkCurrentLayer(toRelink[i].relink)) toRelink[i].relinked = true;
                        break;
                    }
                }
            }
            for (var a in embeddedObjects) {
                var toDelete = [],
                    found = false;
                for (var i = 0; i < toRelink.length; i++) {
                    for (var x = 0; x < embeddedObjects[a].length; x++) {
                        if (isEqualObject(embeddedObjects[a][x].link, toRelink[i].link)) {
                            found = true;
                            break;
                        }
                        if (found) break;
                    }
                }
                if (found) {
                    for (var i = 0; i < embeddedObjects[a].length; i++) {
                        if (embeddedObjects[a][i].link instanceof File && embeddedObjects[a][i].link.exists) continue;
                        var f = createDumbFile(documentFolder, embeddedObjects[a][i].fileReference)
                        if (f) toDelete.push(f)
                    }
                    lr.selectLayerByIDList([Number(a)])
                    progress.updateProgress(lr.getProperty('name', Number(a)))
                    if (lr.editSmartObject()) {
                        relinkEmbedded(toRelink)
                        doc.closeDocument(true)
                    }
                    for (var i = 0; i < toDelete.length; i++) {
                        toDelete[i].remove()
                    }
                }
            }
            lockLayers(locked)
            progress.close()
            if (cfg.move && cfg.collect) {
                for (var i = 0; i < files.length; i++) {
                    if (files[i].collected && files[i].sameFolder && files[i].relinked) {
                        $.writeln('remove ' + files[i].collected.fsName)
                        if (files[i].relink.exists) {
                            files[i].collected.remove()
                            var cur = Folder(files[i].collected.path)
                            if (cur.getFiles().length == 0) {
                                cur.remove()
                                do {
                                    cur = Folder(cur.path)
                                    if (cur.getFiles().length) break;
                                } while (cur.remove())
                            }
                        }
                    }
                }
            }
        }
        function relinkEmbedded(files) {
            var len = doc.getProperty('numberOfLayers'),
                locked = unlockLayers();
            if (len) {
                for (var i = len; i >= 1; i--) {
                    if (lr.hasProperty('smartObject', i, true)) {
                        var id = lr.getProperty('layerID', i, true),
                            smartObject = lr.descToObject(lr.getProperty('smartObject', i, true).value);
                        if (smartObject.linked) {
                            for (var x = 0; x < files.length; x++) {
                                if (isEqualObject(splitFilename(smartObject.link), files[x].link)) {
                                    doc.selectLayerByIDList([id])
                                    if (lr.relinkCurrentLayer(files[x].relink)) files[x].relinked = true
                                    break;
                                }
                            }
                        } else {
                            doc.selectLayerByIDList([id])
                            if (doc.convertSmartObjectToLayers()) {
                                var cur = flattenObject(enumSmartObjects(getSmartObjectsList(lr.getProperty('itemIndex'), true)))
                                doc.deleteCurrentHistoryState()
                                var found = false;
                                do {
                                    var f = splitFilename((cur.shift()).link)
                                    for (var x = 0; x < files.length; x++) {
                                        if (isEqualObject(f, files[x].link)) {
                                            found = true
                                            break;
                                        }
                                    }
                                    if (found) break;
                                } while (cur.length)
                                if (true) {
                                    doc.selectLayerByIDList([id])
                                    if (lr.editSmartObject()) {
                                        relinkEmbedded(files)
                                        doc.closeDocument(true)
                                    }
                                }
                            }
                        }
                    }
                }
            }
            lockLayers(locked)
        }
        function flattenObject(o, output) {
            output = output ? output : [];
            for (var a in o) {
                if (o[a].link) {
                    output.push(o[a])
                } else {
                    flattenObject(o[a], output)
                }
            }
            return output
        }
        function isEqualObject(a, b) {
            for (var i in a) {
                if (stringIDToTypeID(a[i]) != stringIDToTypeID(b[i])) return false
            }
            return true
        }
    }
    this.createReport = function (smartObjects, filesList, err) {
        var report = [],
            s2t = stringIDToTypeID;
        report.push(new Date + '\nSend this report to jazz-y@ya.ru')
        if (err) report.push('Error:\n' + err.toSource())
        if (smartObjects) report.push('Smart objects:\n' + smartObjects.toSource())
        if (filesList) report.push('Files:\n' + filesList.toSource())
        report.push('Application:')
        try {
            (d = new ActionDescriptor()).putObject(s2t('object'), s2t('object'), apl.getProperty());
            report.push(executeAction(s2t('convertJSONdescriptor'), d).getString(s2t('json')))
        } catch (e) { report.push(e.toSource()) }
        report.push('Documents:')
        if (len = apl.getProperty('numberOfDocuments')) {
            try {
                for (var i = 1; i <= len; i++) {
                    (d = new ActionDescriptor()).putObject(s2t('object'), s2t('object'), doc.getProperty(null, i, true));
                    report.push(executeAction(s2t('convertJSONdescriptor'), d).getString(s2t('json')))
                }
            } catch (e) { report.push(e.toSource()) }
        }
        report.push('Layers of active document:')
        if (len = doc.getProperty('numberOfLayers')) {
            try {
                for (var i = 1; i <= len; i++) {
                    (d = new ActionDescriptor()).putObject(s2t('object'), s2t('object'), lr.getProperty(null, i, true));
                    report.push(executeAction(s2t('convertJSONdescriptor'), d).getString(s2t('json')))
                }
            } catch (e) { report.push(e.toSource()) }
        }
        var f = new File('~/desktop/' + str.scriptName + ' errorLog.txt');
        if (f.saveDlg(str.saveLog)) {
            f.open('w')
            f.write(report.join('\n\n'))
            f.close()
        }
    }
    function unlockLayers() {
        var len = doc.getProperty('numberOfLayers'),
            layers = {};
        if (len) {
            for (var i = len; i >= 1; i--) {
                if (lr.getProperty('layerSection', i, true).value == 'layerSectionEnd') continue;
                var locking = lr.getProperty('layerLocking', i, true).value
                if (checkLocking(locking)) {
                    layers[lr.getProperty('layerID', i, true)] = lr.getProperty('layerLocking', i, true).value;
                    lr.applyLocking(undefined, i, true)
                }
            }
        }
        return layers;
    }
    function lockLayers(o) {
        for (var a in o) {
            lr.applyLocking(o[a], a)
        }
    }
    function checkLocking(d) {
        var o = lr.descToObject(d);
        for (var a in o) if (o[a]) return true
        return false
    }
    function enumSmartObjects(ids, progressLength, w) {
        for (var a in ids) {
            var cur = doc.descToObject(lr.getProperty('smartObject', a).value)
            if (cur.linked && !checkLocking(lr.getProperty('layerLocking', a).value)) {
                if (cur.link.type == 'ccLibrariesElement') continue;
                ids[a] = describeSmartObject(cur)
            } else {
                if (cfg.checkEmbedded) {
                    if (progressLength) w.updateProgress(lr.getProperty('name', a))
                    doc.selectLayerByIDList([a])
                    if (doc.convertSmartObjectToLayers()) {
                        ids[a] = enumSmartObjects(getSmartObjectsList(lr.getProperty('itemIndex'), true))
                        doc.deleteCurrentHistoryState()
                    }
                }
                if (ids[a] == null || ids[a].toSource() == '({})') delete ids[a]
            }
        }
        return ids
        function describeSmartObject(o) {
            return {
                link: splitFilename(o.link == '' ? o.fileReference : File(o.link)),
                fileReference: o.fileReference,
            }
        }
    }
    function getSmartObjectsList(idx, mode) {
        var indexFrom = idx ? (doc.getProperty('hasBackgroundLayer') ? --idx : idx) : doc.getProperty('numberOfLayers'),
            indexTo = doc.getProperty('hasBackgroundLayer') ? 0 : 1;
        return buildSmartObjectsList(enumLayers(indexFrom, indexTo, mode))
        function enumLayers(from, to, currentSection, parentItem, group) {
            parentItem = parentItem ? parentItem : [];
            var isDirty = false;
            for (var i = from; i >= to; i--) {
                var layerSection = lr.getProperty('layerSection', i, true).value;
                if (layerSection == 'layerSectionStart') {
                    i = enumLayers(i - 1, to, undefined, [], parentItem)
                    isDirty = true;
                    if (currentSection) return parentItem[0]
                    continue;
                }
                if (currentSection && isDirty) return []
                var properties = {};
                properties.layerKind = lr.getProperty('layerKind', i, true)
                properties.id = lr.getProperty('layerID', i, true)
                properties.smartObject = lr.hasProperty('smartObject', i, true)
                if (layerSection == 'layerSectionEnd') {
                    for (o in properties) { parentItem[o] = properties[o] }
                    group.push(parentItem);
                    return i;
                } else {
                    parentItem.push(properties)
                    if (currentSection && !isDirty) return parentItem
                }
            }
            return parentItem
        }
        function buildSmartObjectsList(layers, list) {
            if (!list) list = {}
            for (var i = 0; i < layers.length; i++) {
                var cur = layers[i]
                if (cur.length) {
                    buildSmartObjectsList(cur, list)
                } else {
                    if (cur.smartObject && cur.layerKind == 5) list[cur.id] = null
                }
            }
            return list
        }
    }
    function getObjectLength(o) {
        var i = 0
        for (var a in o) i++
        return i
    }
    function findEqualFiles(files, relinkMode) {
        var o = [], f = files.slice();
        do {
            var cur = f.shift()
            if (cur) {
                for (var i = 0; i < f.length; i++) {
                    if (!relinkMode) {
                        if (f[i] && decodeURI(cur.link).toUpperCase() == decodeURI(f[i].link).toUpperCase()) f[i] = null
                    }
                    else {
                        if (f[i] && decodeURI(cur.relink).toUpperCase() == decodeURI(f[i].relink).toUpperCase()) f[i] = null
                    }
                }
                o.push(cur)
            }
        } while (f.length)
        return o
    }
    function createDumbFile(parent, reference) {
        var f = new File(parent + '/' + reference);
        if (f.exists) return null
        f.open('w')
        f.close()
        return f
    }
    function progressWindow(title, message, max) {
        var w = new Window('palette', title),
            bar = w.add('progressbar', undefined, 0, max),
            stProgress = w.add('statictext', undefined, message);
        stProgress.preferredSize = [350, 20]
        stProgress.alignment = 'left'
        bar.preferredSize = [350, 20]
        w.updateProgress = function (message) {
            bar.value++;
            if (message) stProgress.text = bar.value + '/' + max + ': ' + message
            w.update();
        }
        return w;
    }
    splitFilename = this.splitFilename;
    documentFolder = this.documentFolder = doc.hasProperty('fileReference') ? File(doc.getProperty('fileReference').fsName).path : null;
    isDitry = this.isDitry = false;
    targetFolder = this.targetFolder = null;
}
function Locale() {
    this.ico = {
        red: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x06\x00\x00\x00\u008D2\u00CF\u00BD\x00\x00\x00;IDAT\x18\u0095c\u00FCci\u00F3\u009F\u0081\b\u00C0\x02R\u00C2((\u0084W\u00E5\u00FF\u00F7\u00EF \n\u00C1\u0080\u0087\x17\u00BB\u00AA/\u009F\u00C1\x14\x131\u00D6\x0E\x15\u0085\b_C}\u0087W!(\u009C\u00F0\x02\x06\x06\x06\x00\x18\u00EF\fO\u0083\b\u00CC\u00FD\x00\x00\x00\x00IEND\u00AEB`\u0082",
        green: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x06\x00\x00\x00\u008D2\u00CF\u00BD\x00\x00\x00=IDAT\x18\u0095c\u00F4\u00DEo\u00F8\u009F\u0081\b\u00C0\x02R\"\u00C6\u00C9\u008FW\u00E5\u00AB\u00EF\x1F!\nA@\u0090\u009D\x1B\u00AB\u00A2\u00F7?\u00BF\u0082i&b\u00AC\x1D*\n\u00E1\u00BE\u0086\u00F9\x0E\u00AFBP8\u00E1\x05\f\f\f\x000\x1F\x0E\x05z4V\u0094\x00\x00\x00\x00IEND\u00AEB`\u0082",
        yellow: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x06\x00\x00\x00\u008D2\u00CF\u00BD\x00\x00\x00;IDAT\x18\u0095c\u00FCp@\u00ED?\x03\x11\u0080\x05\u00A4\u0084\u0089\u0093\x1B\u00AF\u00CA\x7F\u00DF\u00BFB\x14\u0082\x15\u00B3s`W\u00F4\u00F3\x07D\u009E\x18k\u0087\u008AB\u00B8\u00AFa\u00BE\u00C3\u00AB\x10\x14Nx\x01\x03\x03\x03\x00+\u00AA\x0E\u00CA*\u0090\u00C3\u00A2\x00\x00\x00\x00IEND\u00AEB`\u0082",
        all: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x06\x00\x00\x00\u008D2\u00CF\u00BD\x00\x00\x00\u00B5IDAT\x18\u0095\u008D\u0090K\n\u00840\x10D+C\u00FC\u00E5\x06\u00D9\u00B8\u00F7\n\"nt\u00E3\u0089\u00C5\u0095\u00E0!\u00B2\u00CC-\x14\u00F1\u0097\u00A1{\u00B0a\x10\u0086)(:\u00A4_WB\u00AB\u00BE\u00EF\x03\u00FE\u0090&\u00A4\u00AEk!\u0097e\u0081R\nY\u0096\u00C9\u00DD4M\x1F\u0090\u0094\u00A6)\u009Cs\u00F0\u00DE#I\x12\u00E4y\u008E\u00A2(x\x10w\"i]W\u0086\u00BA\u00AE\u00C3\u00BE\u00EF\x18\u00C7\x11\u00D6Z\u00C4q\u00CC\u00FD\u00D7\r\x1E\u00C7\u00C15\u008A\"N$x\u009Egy^\x12\u00E9_\u00D7ua\x18\x06i\u009E\u00E7)gI\f!0\u00DC\u00B6-\u009A\u00A6\u0091\u00E1G\u00A2\u00D6\u009A\u00BDm\x1B\x03dc\u00CC\x13\u00A4\u00C4\u00B2,\u00B9\u0092\u00AB\u00AA\u00E2M|\u0081\u00B4\u00A7\u009F\x02\u00F0\x06\x05\"C\u00AEZ\f\u00AC\x18\x00\x00\x00\x00IEND\u00AEB`\u0082"
    }
    this.scriptName = 'Relink layers'
    this.errNoFiles = { ru: 'Связананные слои не найдены!', en: 'Linked layers not found!' }
    this.findEmbedded = { ru: 'Поиск связанных файлов в смарт-объектах', en: 'Find linked files in smart objects' }
    this.searchFile = { ru: 'Поиск файла: ', en: 'Search file: ' }
    this.buildFileList = { ru: 'Обработка каталога: ', en: 'Build list of files: ' }
    this.copyAssets = { ru: 'Копирование ресурсов', en: 'Copy assets' }
    this.relink = { ru: 'Связать заново', en: 'Relink layers' }
    this.linkedFiles = { ru: 'Связанные файлы', en: 'Linked files' }
    this.findInEmbedded = { ru: 'поиск связанных файлов в смарт-объектах', en: 'find links in smart objects' }
    this.relinkAll = { ru: 'Связать заново', en: 'Relink all' }
    this.extension = { ru: 'учитывать расширение', en: 'match file extension' }
    this.subfolder = { ru: 'собрать ресурсы в папке:', en: 'collect assets in subfolder:' }
    this.groupByExt = { ru: 'группировать по типу', en: 'group by extension' }
    this.move = { ru: 'перемещать', en: 'move files' }
    this.cancel = { ru: 'Отмена', en: 'Cancel' }
    this.currentPath = { ru: 'папка открытого документа', en: 'current document path' }
    this.newPath = { ru: 'новая папка', en: 'new path' }
    this.relinkSelected = { ru: 'Связать выбранные', en: 'Relink selected' }
    this.replaceFor = { ru: 'Заменить связь для ', en: 'Replace link for ' }
    this.strRelinkErr1 = { ru: 'Замена связи не может быть выполнена!', en: 'Relink operation cannot be performed!' }
    this.strRelinkErr2 = { ru: ' тип файлов не поддерживается!', en: ' files does not supported!' }
    this.strRelinkErr3 = { ru: '- открытый документ не сохранен!', en: '- active document has no path!' }
    this.err = { ru: 'Ошибка', en: 'Error' }
    this.moveWrn = {
        ru: 'Эта функция собирает все связанные файлы из открытого документа в указанной папке.\nКак она работает:\n1. Перемещает все связанные файлы в случае если они находятся в том же каталоге, что и указанная папка\n2. Копирует все связанные файлы, если они расположены в других каталогах\n\nДля перемещения файлов скрипт использует сочетание команд "скоировать" и "удалить". Это прекрасно работает в большинстве случаев, однако будьте осторожны - удаление происходит напрямую с диска, минуя корзину!\n\nИспользуйте на собственный риск!\n\nВключить опцию?',
        en: 'This function collect all linked files of current document in specifed subfolder.\nHow it works:\n1. Moves all asset files if they are in the same folder as the specified directory\n2. Copy all asset files from another folders to the specified directory\n\nTo move files, script uses "copy" and then "delete" commands. This works fine in most cases, but be aware - deletes occurs without moving it to the system trash!\n\nUse at your own risk!\n\nEnable option?'
    }
    this.warning = { ru: 'Предупреждение', en: 'Warning' }
    this.errGlobal = { ru: 'Произошла ошибка во время выполнения скрипта. Создать файл отчета?', en: 'An error occurred while executing the script. Create a report file? ' }
    this.saveLog = { ru: 'Файл отчета', en: 'Report file' }
    this.select = { ru: 'Быстрый выбор:', en: 'Quick select:' }
}
function mainWindow(fileList, runMode) {
    var w = new Window("dialog {text: '" + str.linkedFiles + " " + ver + "'}"),
        gSelect = w.add("group{alignChildren: ['left','center'], alignment: ['fill','top']}"),
        stSelect = gSelect.add("statictext{text:'" + str.select + "'}"),
        iAll = gSelect.add("iconbutton", undefined, str.ico.all, { style: "toolbutton" }),
        iGreen = gSelect.add("iconbutton", undefined, str.ico.green, { style: "toolbutton" }),
        iYellow = gSelect.add("iconbutton", undefined, str.ico.yellow, { style: "toolbutton" }),
        iRed = gSelect.add("iconbutton", undefined, str.ico.red, { style: "toolbutton" }),
        l = w.add("listbox", [0, 0, 600, 400], undefined, { multiselect: true }),
        gEmbedded = w.add("group{alignChildren: ['left','center'], alignment: ['fill','top']}"),
        chEmbedded = gEmbedded.add("checkbox{text: '" + str.findInEmbedded + "', preferredSize: [70, -1]}"),
        pnRelink = w.add("panel{text: '" + str.linkedFiles + "', alignChildren: ['left','center'], alignment: ['fill','top'], margins:[10,20,10,10]}"),
        gRelink = pnRelink.add("group{alignChildren: ['left','center'], alignment: ['fill','top']}"),
        rl = gRelink.add("button{text: '" + str.relinkAll + "', preferredSize: [170, -1]}"),
        dl = gRelink.add("dropdownlist", undefined, undefined, { items: [str.currentPath, str.newPath] }),
        chMatch = gRelink.add("checkbox{text: '" + str.extension + "', preferredSize: [120, -1]}"),
        gCollect = w.add("group{alignChildren: ['left','center'], alignment: ['fill','top']}"),
        chCollect = gCollect.add("checkbox{text: '" + str.subfolder + "', preferredSize: [170, -1]}"),
        gSubCollect = gCollect.add("group{alignChildren: ['left','center'], alignment: ['fill','top']}"),
        et = gSubCollect.add("edittext{preferredSize: [100, -1]}"),
        chGroup = gSubCollect.add("checkbox{text: '" + str.groupByExt + "', preferredSize: [120, -1]}"),
        chMove = gSubCollect.add("checkbox{text: '" + str.move + "', preferredSize: [70, -1]}"),
        gButtons = w.add("group"),
        bnOk = gButtons.add("button {text:'Ok'}", undefined, undefined, { name: "ok" }),
        bnCancel = gButtons.add("button {text:'" + str.cancel + "'}", undefined, undefined, { name: "cancel" });
    l.graphics.font = "dialog:12";
    l.fillLinksList = function (items) {
        var currentSelection = []
        if (this.selection) for (var i = 0; i < this.selection.length; i++) currentSelection.push((this.selection[i]).index)
        this.removeAll()
        for (var i = 0; i < items.length; i++) {
            with (items[i]) {
                this.add('item', link instanceof File ?
                    ((relink ? ' ✎ ' : (missed ? ' ❌ ' : ' ✔ ')) + (relink ? (relink).fsName : link.fsName)) :
                    (' ❌ ' + items[i].fileReference));
                this.items[i].image = items[i].missed ? str.ico.red : (items[i].sameFolder ? str.ico.green : str.ico.yellow)
            }
        }
        if (currentSelection.length) this.selection = currentSelection
    }
    l.onClick = function () {
        rl.text = l.selection != null ? str.relinkSelected + (l.selection.length > 1 ? ' (' + l.selection.length + ')' : '') : str.relinkAll
    }
    l.onDoubleClick = function () {
        if (l.selection != null) {
            if ((l.selection[0]).index >= 0) {
                with (fileList[(l.selection[0]).index]) {
                    var cur = link instanceof File ? link : new File,
                        f = fn.splitFilename(cur.openDlg(str.replaceFor + (link instanceof File ? decodeURI(link.name) : fileReference), '', false));
                    if (f && f.exists) {
                        if (allowedExtensions[f.extension.toUpperCase()]) {
                            relink = decodeURI(link).toUpperCase() == decodeURI(f).toUpperCase() ? null : f;
                            l.fillLinksList(fileList.checkFiles())
                        } else { alert(str.strRelinkErr1 + '\n\n*.' + f.extension + str.strRelinkErr2, str.err, 1) }
                    }
                }
            }
        }
    }
    rl.onClick = function (mode) {
        switch (dl.selection.index) {
            case 0:
                if (fn.documentFolder) {
                    fn.targetFolder = fn.documentFolder;
                } else { alert(str.strRelinkErr1 + '\n\n' + str.strRelinkErr3, str.err, 1) }
                break;
            case 1:
                var p = (new Folder(fn.documentFolder ? fn.documentFolder : null)).selectDlg()
                if (p) { fn.targetFolder = p } else { mode = true }
                break;
        }
        bnOk.enabled = fn.targetFolder
        if (!mode) {
            app.doForcedProgress('', 'fn.findLinks(fn.targetFolder, fileList, l.selection)')
            l.fillLinksList(fileList.checkFiles())
        }
    }
    chCollect.onClick = function () { gSubCollect.enabled = cfg.collect = this.value }
    chGroup.onClick = function () { cfg.groupByExtension = this.value }
    chMove.onClick = function () {
        cfg.move = this.value
        if (this.value) {
            if (!confirm(str.moveWrn, true, 'Warning!'))
                cfg.move = this.value = false
        }
    }
    bnOk.onClick = function () {
        if (fn.targetFolder == null) { rl.onClick(true) }
        w.close(1);
        (new AM()).putScriptSettings(cfg);
        if (fn.targetFolder && cfg.collect) fn.collectAssets(fn.targetFolder, fileList)
    }
    chEmbedded.onClick = function () {
        cfg.checkEmbedded = this.value
        w.close(3)
    }
    et.onChange = function () {
        cfg.subfolder = this.text
    }
    bnCancel.onClick = function () { fileList = []; w.close(2) }
    chMatch.onClick = function () { cfg.matchExtension = this.value }
    dl.onChange = function () {
        cfg.relinkMode = this.selection.index
        bnOk.enabled = fn.targetFolder = cfg.relinkMode ? null : fn.documentFolder
    }
    iAll.onClick = function () { qickSelect(0) }
    iGreen.onClick = function () { qickSelect(1) }
    iYellow.onClick = function () { qickSelect(2) }
    iRed.onClick = function () { qickSelect(3) }
    w.onShow = function () {
        if (!fn.documentFolder) { dl.items[0].enabled = false; cfg.relinkMode = 1 }
        dl.selection = cfg.relinkMode ? 1 : 0
        chMatch.value = cfg.matchExtension
        gSubCollect.enabled = chCollect.value = cfg.collect
        et.text = cfg.subfolder
        chGroup.value = cfg.groupByExtension
        chMove.value = cfg.move
        chEmbedded.value = cfg.checkEmbedded
        dl.size.width = w.size.width - rl.size.width - chMatch.size.width - 90
        et.size.width = w.size.width - chGroup.size.width - chCollect.size.width - chMove.size.width - 80
        chEmbedded.enabled = runMode
        w.layout.layout(true)
        l.fillLinksList(fileList.checkFiles())
    }
    function qickSelect(mode) {
        var selection = [],
            len = fileList.length;
        l.selection = selection;
        switch (mode) {
            case 1: for (var i = 0; i < len; i++) if (fileList[i].sameFolder && !fileList[i].missed) selection.push(i); break;
            case 2: for (var i = 0; i < len; i++) if (!fileList[i].sameFolder && !fileList[i].missed) selection.push(i); break;
            case 3: for (var i = 0; i < len; i++) if (fileList[i].missed) selection.push(i); break;
            default: for (var i = 0; i < len; i++) selection.push(i);
        }
        l.selection = selection
        l.onClick()
    }
    return w
}