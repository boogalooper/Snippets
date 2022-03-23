/*Mixing files from two different folders while maintaining the same file numbering
* (shooting staged shots with a fixed set of previously shot scenes mixed in) 
* 
* https://www.youtube.com/watch?v=lfjIUta8T8g
*/

#target photoshop
var cfg = new Config,
    GUID = '04f3bac3-e6ef-42e1-aef0-034a2c0bfe48',
    randomSource = [];
randomTarget = [];
{
    var d = new Window("dialog");
    d.text = "Shuffle files";
    d.orientation = "column";
    d.alignChildren = ["center", "top"];
    d.spacing = 10;
    d.margins = 16;
    var p1 = d.add("panel", undefined, undefined, { name: "p1" });
    p1.text = "Источник:";
    p1.orientation = "column";
    p1.alignChildren = ["left", "top"];
    p1.spacing = 10;
    p1.margins = 10;
    var g1 = p1.add("group", undefined, { name: "g1" });
    g1.orientation = "row";
    g1.alignChildren = ["left", "center"];
    g1.spacing = 10;
    g1.margins = 0;
    var etSource = g1.add('edittext {properties: {name: "etSource", readonly: true}}');
    etSource.preferredSize.width = 420;
    var bnSource = g1.add("button", undefined, undefined, { name: "bnSource" });
    bnSource.text = "Обзор";
    var stSource = p1.add("statictext", undefined, undefined, { name: "stSource" });
    stSource.preferredSize.width = 500;
    var g2 = p1.add("group", undefined, { name: "g2" });
    g2.orientation = "row";
    g2.alignChildren = ["left", "center"];
    g2.spacing = 10;
    g2.margins = 0;
    var stSourceRandom = g2.add("statictext", undefined, undefined, { name: "stSourceRandom" });
    stSourceRandom.preferredSize.width = 450;
    var bnRandomSource = g2.add("button", undefined, undefined, { name: "bnRandomSource" });
    bnRandomSource.text = "↻";
    var p2 = d.add("panel", undefined, undefined, { name: "p2" });
    p2.text = "Каталог назначения:";
    p2.orientation = "column";
    p2.alignChildren = ["left", "top"];
    p2.spacing = 10;
    p2.margins = 10;
    var g3 = p2.add("group", undefined, { name: "g3" });
    g3.orientation = "row";
    g3.alignChildren = ["left", "center"];
    g3.spacing = 10;
    g3.margins = 0;
    var etTarget = g3.add('edittext {properties: {name: "etTarget", readonly: true}}');
    etTarget.preferredSize.width = 420;
    var bnTarget = g3.add("button", undefined, undefined, { name: "bnTarget" });
    bnTarget.text = "Обзор";
    var stTarget = p2.add("statictext", undefined, undefined, { name: "stTarget" });
    stTarget.preferredSize.width = 500;
    var g4 = p2.add("group", undefined, { name: "g4" });
    g4.orientation = "row";
    g4.alignChildren = ["left", "center"];
    g4.spacing = 10;
    g4.margins = 0;
    var stTargetRandom = g4.add("statictext", undefined, undefined, { name: "stTargetRandom" });
    stTargetRandom.preferredSize.width = 450;
    var bnRandomTarget = g4.add("button", undefined, undefined, { name: "bnRandomTarget" });
    bnRandomTarget.text = "↻";
    var g4 = d.add("group", undefined, { name: "g4" });
    g4.orientation = "row";
    g4.alignChildren = ["left", "center"];
    g4.spacing = 10;
    g4.margins = 0;
    var ok = g4.add("button", undefined, undefined, { name: "ok" });
    ok.text = "Перемешать файлы";
    var cancel = g4.add("button", undefined, undefined, { name: "cancel" });
    cancel.text = "Отмена";
}
bnSource.onClick = function () {
    etSource.text = browseFolder(etSource);
    randomize()
    makeLabels()
}
bnTarget.onClick = function () {
    cfg.TargetPath = browseFolder(etTarget);
    randomize()
    makeLabels()
}
bnRandomTarget.onClick = function () {
    randomTarget = shuffleTarget(etTarget.path, randomSource.length)
    makeLabels()
}
bnRandomSource.onClick = function () {
    var cur = randomSource.length;
    randomSource = shuffleSource(etSource.path)
    if (randomSource.length != cur) randomTarget = shuffleTarget(etTarget.path, randomSource.length)
    makeLabels()
}
ok.onClick = function () {
    cfg.putScriptSettings(cfg);
    d.close();
    app.doForcedProgress("переименование файлов", "shuffleFiles()")
    alert("Готово!")
    function shuffleFiles() {
        if (randomSource.length && randomTarget.length) {
            init = decodeURI(etTarget.path[0].name).match(/([\D]*)(\d+)/);
            if (init != null) {
                var prefix = init[1],
                    numLength = init[2].length,
                    num = Number(init[2]),
                    counter = 0,
                    outputFiles = [];
                var ren = randomTarget.shift();
                for (var i = 0; i < etTarget.path.length; i++) {
                    if (i < ren || ren == undefined) {
                        outputFiles.push(decodeURI(etTarget.path[i].name).match(/\..*$/)[0])
                        etTarget.path[i].rename(prefix + ('0000' + (num + counter++)).slice(-4))
                    } else {
                        ren = randomTarget.shift();
                        var cop = randomSource.shift()
                        for (var z = 0; z < cop; z++) {
                            var cur = etSource.path.shift();
                            outputFiles.push(decodeURI(cur.name).match(/\..*$/)[0])
                            cur.copy(File(etTarget.text + '/' + (prefix + ('0000' + (num + counter++)).slice(-4))))
                        }
                        i--
                    }
                }
                var newFiles = []
                findAllFiles(etTarget.text, newFiles, false)
                for (var i = 0; i < newFiles.length; i++) {
                    newFiles[i].rename(decodeURI(newFiles[i].name) + outputFiles[i])
                }
            }
        }
    }
}
d.onShow = function () {
    cfg.getScriptSettings(cfg)
    etSource.text = Folder(cfg.sourcePath).exists ? cfg.sourcePath : ''
    etTarget.text = Folder(cfg.targetPath).exists ? cfg.targetPath : ''
    etSource.path = []; findAllFiles(etSource.text, etSource.path, false)
    etTarget.path = []; findAllFiles(etTarget.text, etTarget.path, false)
    randomize()
    makeLabels()
}
d.show();
function randomize() {
    randomSource = shuffleSource(etSource.path)
    randomTarget = shuffleTarget(etTarget.path, randomSource.length)
}
function shuffleSource(files) {
    var rnd = [];
    if (!files.length) return []
    var tmp = files.slice(0);
    do {
        var r = Math.round(Math.random());
        rnd.push(3 - r)
        tmp = tmp.slice(3 - r - 1, -1)
    } while (tmp.length > 2)
    if (tmp.length) rnd.push(tmp.length)
    return rnd
}
function shuffleTarget(files, len) {
    var rnd = []
    if (!files.length || !len) return [];
    var tmp = files.slice(0),
        k = tmp.length * 0.02, 
        div = parseInt(files.length / (len + 1)); 
    for (var i = 0; i < len; i++) {
        var r = Math.round(Math.random() * k * 0.5),
            shuffle = Math.round(Math.random()) ? Math.round(div + r) : Math.round(div - r);
        rnd.push(files.length - tmp.length + shuffle)
        tmp = tmp.slice(shuffle - 1, -1)
    }
    return rnd
}
function checkIntegrity() {
    ok.enabled = etSource.text && etTarget.text && randomTarget.length && randomSource.length;
    stSource.visible = etSource.text
    stTarget.visible = etTarget.text
    bnRandomSource.enabled = stSourceRandom.visible = randomSource.length;
    stTargetRandom.visible = bnRandomTarget.enabled = randomTarget.length
}
function makeLabels() {
    createCaption(stSource, stSourceRandom, etSource.path, randomSource, 'Группы файлов: ')
    createCaption(stTarget, stTargetRandom, etTarget.path, randomTarget, 'Вставка через: ')
    function createCaption(numberLabel, randomLabel, pathSource, random, cpt) {
        numberLabel.text = 'В каталоге ' + pathSource.length + ' файлов'
        randomLabel.text = cpt + random
    }
    checkIntegrity();
}
function findAllFiles(srcFolder, fileObj, useSubfolders) {
    if (!srcFolder) return
    var fileFolderArray = Folder(srcFolder).getFiles(),
        subfolderArray = [];
    for (var i = 0; i < fileFolderArray.length; i++) {
        var fileFoldObj = fileFolderArray[i];
        if (fileFoldObj instanceof File) {
            if (!fileFoldObj.hidden) fileObj.push(fileFoldObj)
        } else if (useSubfolders) {
            subfolderArray.push(fileFoldObj)
        }
    }
    if (useSubfolders) {
        for (var i = 0; i < subfolderArray.length; i++) findAllFiles(subfolderArray[i], fileObj, useSubfolders)
    }
}
function browseFolder(path) {
    var source = new Folder(path.text),
        fol = source.selectDlg()
    if (fol) {
        if (fol.exists) {
            path.text = fol.fsName.toString()
            path.path = [];
            findAllFiles(path.text, path.path, false)
            return path.text
        }
    }
}
function Config() {
    this.sourcePath = ""
    this.targetPath = ""
    this.getScriptSettings = function (settingsObj) {
        try { var d = app.getCustomOptions(GUID) } catch (e) { }
        if (d != undefined) descriptorToObject(settingsObj, d)
        function descriptorToObject(o, d) {
            var l = d.count;
            for (var i = 0; i < l; i++) {
                var k = d.getKey(i);
                var t = d.getType(k);
                strk = app.typeIDToStringID(k);
                switch (t) {
                    case DescValueType.BOOLEANTYPE: o[strk] = d.getBoolean(k); break;
                    case DescValueType.STRINGTYPE: o[strk] = d.getString(k); break;
                    case DescValueType.INTEGERTYPE: o[strk] = d.getDouble(k); break;
                }
            }
        }
    }
    this.putScriptSettings = function (settingsObj) {
        var d = objectToDescriptor(settingsObj, GUID)
        app.putCustomOptions(GUID, d)
        function objectToDescriptor(o) {
            var d = new ActionDescriptor;
            var l = o.reflect.properties.length;
            for (var i = 0; i < l; i++) {
                var k = o.reflect.properties[i].toString();
                if (k == "__proto__" || k == "__count__" || k == "__class__" || k == "reflect") continue;
                var v = o[k];
                k = app.stringIDToTypeID(k);
                switch (typeof (v)) {
                    case "boolean": d.putBoolean(k, v); break;
                    case "string": d.putString(k, v); break;
                    case "number": d.putInteger(k, v); break;
                }
            }
            return d;
        }
    }
    function s2t(s) { return stringIDToTypeID(s) }
    function t2s(t) { return typeIDToStringID(t) }
}