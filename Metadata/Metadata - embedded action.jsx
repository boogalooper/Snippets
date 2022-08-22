/** The script embedded the selected action in metadata of the document **/

#target photoshop


$.localize = true 
//$.locale = "ru"

var ver = "0.21",
GUID="0208d667-3679-4139-ab7f-fcef76081453",
strMessage = "Embedded action",
source = "http://forum.vinyetka.ru/",
customNamespace = "EmbeddedAction:",
customPrefix = "UTF-8"
strOkPut={ru: "Записать ATN в документ", en: "Write ATN to document"},
strOkGet={ru: "Загрузить ATN из документа", en: "Get ATN from document"},
strBrowse={ru: "Обзор...", en: "Browse..."},
strDelete ={ru: "Удалить", en: "Delete"},
errLoadInDoc ={ru: "Невозможно записать ATN в метаданные!", en: "Unable to write ATN in metadata!"},
errWriteInDoc ={ru: "Произошла ошибка при записи в документ!\n", en: "An error occurred while writting to the document!\n"},
strErr ={ru: "Ошибка!", en: "Error!"},
strSource ={ru: "Источник операций:", en: "Source of actions:"},
strAutoLoad ={ru: "Автозагрузка встроенных операций:", en: "Embedded actions autoload:"},
strOnOpen ={ru: "загружать операции при открытии документа", en: "load actions when opening a document"},
strOnClose ={ru: "удалять операции при закрытии документа", en: "delete actions when closing a document"},
strCancel ={ru: "Отмена", en: "Cancel"},
errLoadFromDoc ={ru: "Невозможно загрузить ATN из метаданных!", en: "Unable to load ATN from metadata!"},
strConfirm ={ru: "Такой набор операций уже есть на панели!\nЗагрузить его еще раз?", en: "Such set of actions is already on the panel!\nLoad it again?"},
strAlert ={ru: "Внимание!", en: "Alert!"},
errLoad ={ru: "Произошла ошибка при загрузке данных из документа!\n", en: "An error occurred while loading data from the document!\n"}
strSelect ={ru: "Выберите файл операций", en: "Select actions file"},
strFile  ={ru: "Выбранный файл не может быть загружен!", en: "The selected file could not be loaded!"},
errDelete ={ru: "В документе не найдены метаданные для удаления!", en: "No metadata to delete in this document!"}
strSuccess ={ru: "Операция выполнена успешно!", en: "Operation completed successfully!"}

var AM = new ActionManager,
XMP = new Metadata,
CFG = new Config,
event,
isCancelled = false

try {event = typeIDToStringID(arguments[1])} catch (e) {}

main ()
isCancelled ? 'cancel' : undefined

function main ()
{
    if (!app.playbackParameters.count) {
        // normal run
        AM.getScriptSettings(CFG)

        switch (event) {
            case "notify":
                CFG.options = ""
                AM.putScriptSettings(CFG)
                break;
            case "open":
                if (XMP.checkMetadata()) {
                    XMP.getATNFromDocument(true)
                    AM.putScriptSettings(CFG)
                }
                break;
            case "close":
    
                var temp = stringToObject(CFG.options)
                if (getObjectLength(temp) > 0) {
                    var docs = AM.getAllDocumentID()
                    for (var a in temp) {
                        var found = false
                        for (var i = 0; i <= docs.length; i++) {
                            if (temp[a] == docs[i]) {found = true; break;}
                        }
                        if (!found) {
                            AM.deleteSetByHash(a)
                            delete (temp[a])
                        } 
                    }
                    CFG.options = objectToString(temp)
                    AM.putScriptSettings(CFG)
                }
                break;
            default:
                var w = new buildWindow(), result = w.show()

                if (result == 2) { isCancelled = true; return } else  // if cancelled
                {
                    CFG.mode = result == 1 ? "add" : "delete"
                    AM.putScriptSettings(CFG)
                    AM.putScriptSettings(CFG, true)
                }
                break;
            // exit script  
        }
    }
    else {

        AM.getScriptSettings (CFG)
        AM.getScriptSettings (CFG, true)

        if (app.playbackDisplayDialogs == DialogModes.ALL) {
            //double click from action
            var w = buildWindow(true); var result = w.show()

            if (result == 2) { isCancelled = true; return } else // if cancelled
            {
                AM.putScriptSettings(CFG, true)
            }
        }

        if (app.playbackDisplayDialogs != DialogModes.ALL) {
            if (CFG.mode == "add") {
                try {
                    var infile = File(CFG.lastPath);
                    if (!infile.exists) throw strFile
                    infile.open("r");
                    infile.encoding = "binary";
                    var s = infile.read();
                    infile.close
                    if (XMP.writeMetadata(s.toSource()) == false) throw (errLoadInDoc)
                } catch (e) { alert(errWriteInDoc + e, strErr, true) }
            } else {
                if (!XMP.removeMetadata()) alert(errDelete, strErr, false) 
            }
        } //run by button "play" with saved in palette settings
    }    // next code  
}

function buildWindow() {
// W
// =
var w = new Window("dialog"); 
w.text = strMessage + " " + ver 
w.orientation = "column"; 
w.alignChildren = ["fill","top"]; 
w.spacing = 10; 
w.margins = 16; 

// PNSOURCE
// ========
var pnSource = w.add("panel"); 
pnSource.text = strSource; 
pnSource.orientation = "column"; 
pnSource.alignChildren = ["left","top"]; 
pnSource.spacing = 10; 
pnSource.margins = 10; 

// grSource
// ======
var grSource = pnSource.add("group"); 
grSource.orientation = "row"; 
grSource.alignChildren = ["left","center"]; 
grSource.spacing = 10; 
grSource.margins = 0; 

var etSource = grSource.add('edittext {properties: {readonly: true}}'); 
etSource.preferredSize.width = 300; 

var bnBrowse = grSource.add("button"); 
bnBrowse.text = strBrowse

// PNLOAD
// ======
var pnLoad = w.add("panel"); 
pnLoad.text = strAutoLoad
pnLoad.orientation = "column"; 
pnLoad.alignChildren = ["left","top"]; 
pnLoad.spacing = 10; 
pnLoad.margins = [10,15,10,10]; 

var chAuloLoad = pnLoad.add("checkbox"); 
    chAuloLoad.text = strOnOpen

var chDel = pnLoad.add("checkbox"); 
    chDel.text = strOnClose

// GRBN
// ====
var grBn = w.add("group"); 
grBn.orientation = "row"; 
grBn.alignChildren = ["center","center"]; 
grBn.spacing = 10; 
grBn.margins = 0; 

var ok = grBn.add("button", undefined, undefined, {name: "ok"}); 
ok.text = strOkPut

var cancel = grBn.add("button", undefined, undefined, {name: "cancel"}); 
cancel.text = strCancel

bnBrowse.onClick = function (){
    switch (ok.text) {
        case localize(strOkPut):
            var fle = new File
            if ($.os.match(/win/i) != null) {
                fle = File.openDialog(strSelect, "*.atn", false)
            } else {
                fle = File.openDialog(strSelect, function (f) {
                    return f.fsName.match(/\.(atn)$/i);
                }, true);
                if (fle.length>0) fle = fle[0]
            }
            
            if (fle) {
                if (fle.exists) {
                    etSource.enabled = true
                    ok.enabled = true
                    etSource.enabled = true
                    etSource.text = fle.fsName
                    CFG.lastPath = etSource.text
                } else {
                    alert(strFile, strErr, true)
                    etSource.text = ""
                }
            }
            break;
        default:
            if (XMP.removeMetadata()) {
                alert(strSuccess, strMessage, false) 
                w.close(0)
            } else { alert(errDelete, strErr, false); }
            break;
    }    
    
}

chDel.onClick = function () {CFG.onClose = this.value; addEvt()}
chAuloLoad.onClick = function () {CFG.onOpen = this.value; chDel.enabled = this.value; addEvt()}

    ok.onClick = function (){
        switch (ok.text)
        {
            case localize(strOkPut):
                try {
                    var infile = File (CFG.lastPath);
                    if (!infile.exists) throw (strFile)
                    infile.open ("r");
                    infile.encoding = "binary";
                    var s = infile.read();
                    infile.close
                    if (XMP.writeMetadata(s.toSource()) == false) throw (errLoadInDoc)   
                    alert(strSuccess, strMessage, false)                
                    w.close (1)
                } catch (e) {alert (errWriteInDoc + e , strErr, true); w.close (2)}
            break;
            default:
                if (XMP.getATNFromDocument(CFG.onClose)) {
                    w.close(2)
                }
            break;
        }
    }

    w.onShow = function (){
        chAuloLoad.value = CFG.onOpen
        chDel.value = CFG.onClose
        chDel.enabled = CFG.onOpen
        addEvt ()

        switch (XMP.checkMetadata()) {
            case true:
                ok.text = strOkGet
                bnBrowse.text = strDelete
                etSource.text = strMessage + ": " + AM.getDocumentName ()
                break;
            case false:
                    ok.text = strOkPut  
                    bnBrowse.text = strBrowse
                    etSource.text = CFG.lastPath
                    if (CFG.lastPath == "") ok.enabled = false
                    if (!File(CFG.lastPath).exists) {ok.enabled = false; etSource.enabled =false}
                    if (AM.getDocumentsNumber()==0) {bnBrowse.enabled = false; ok.enabled = false, etSource.enabled = false}
                break;
        }
    }
    return w
}


function ActionManager () {
    var gClassActionSet = s2t("actionSet"),
        gClassAction = s2t("action"),
        gName = s2t("name"),
        gKeyNumberOfChildren = s2t("numberOfChildren"),
        gDelete = s2t("delete"),
        gTarget = s2t("target"),
        gMessage = s2t("message"),
        gProperty = s2t("property"),
        gCommand = s2t("command"),
        gApplication = s2t("application"),
        gNumberOfDocuments = s2t("numberOfDocuments"),
        gOrdinal = s2t("ordinal"),
        gTargetEnum = s2t("targetEnum"),
        gDocument = s2t("document"),
        gTitle = s2t("title")
        gDocumentID = s2t("documentID")

    this.getDocumentsNumber = function (){
        try {
            var ref = new ActionReference()
            ref.putProperty(gProperty, gNumberOfDocuments)
            ref.putEnumerated(gApplication, gOrdinal, gTargetEnum)
            return executeActionGet(ref).getInteger (gNumberOfDocuments)
        } catch (e) { return 0 }
    }

    this.getDocumentName = function () {
            var ref = new ActionReference()
            ref.putProperty(gProperty, gTitle)
            ref.putEnumerated(gDocument, gOrdinal, gTargetEnum)
            return executeActionGet(ref).getString (gTitle)
    }

    this.getDocumentID = function () {
        var ref = new ActionReference()
        ref.putProperty(gProperty, gDocumentID)
        ref.putEnumerated(gDocument, gOrdinal, gTargetEnum)
        return String (executeActionGet(ref).getInteger (gDocumentID))
}
    
    this.getAllDocumentID = function () {
        var output = [],
        len = this.getDocumentsNumber()

        for (var i=1; i<=len; i++)
        {
                var ref = new ActionReference()
                ref.putProperty(gProperty, gDocumentID)
                ref.putIndex(gDocument, i)      
                output.push (String (executeActionGet(ref).getInteger(gDocumentID))) 
        }
        return output
    }

    this.getActionSetNumber = function () {
        var setCounter = 1;
        while (true) {
            var ref = new ActionReference()
            ref.putProperty(gProperty, gName)
            ref.putIndex(gClassActionSet, setCounter)
            try { executeActionGet(ref).getString(gName) } catch (e) { break; }
            setCounter++
        }
        return setCounter-1
    }

    this.getActionSetHash = function (idx) {

        var ref = new ActionReference()
        ref.putIndex(gClassActionSet, idx)
        var nm = executeActionGet(ref).getString(gName),
        numberChildren = executeActionGet(ref).getInteger(gKeyNumberOfChildren)

        return String (hash(nm + getActions(idx, numberChildren)))

        function getActions(setIndex, len) {
            var current = ""
            for (var i = 1; i <= len; i++) {
                var ref = new ActionReference()
                ref.putIndex(gClassAction, i)
                ref.putIndex(gClassActionSet, setIndex)
                current += executeActionGet(ref).getString(gName)
                var num = executeActionGet(ref).getString(gKeyNumberOfChildren)
                if (numberChildren>0) current += getCommands(setIndex, i, num)
            }
            return current
        }

        function getCommands (setIndex, actionIndex, len)
        {
            var current = ""
            for (var i = 1; i <= len; i++) {
                var ref = new ActionReference()
                ref.putProperty (gProperty, gName)
                ref.putIndex(gCommand, i)
                ref.putIndex(gClassAction, actionIndex)
                ref.putIndex(gClassActionSet, setIndex)
                current += executeActionGet(ref).getString(gName)
            }
            return current
        }
    }

    this.deleteSetbyIndex = function (idx) {
        var desc = new ActionDescriptor();
        var ref = new ActionReference();

        ref.putIndex(gClassActionSet, idx);
        desc.putReference(gTarget, ref);

        try {
            executeAction(gDelete, desc)
            return true
        }
        catch (e) {
            return false
        }
    }

    this.deleteSetByHash = function (hash) {
        var len = this.getActionSetNumber()

        for (var i=len; i>=1; i--)
        {
            if (this.getActionSetHash(i) == hash) 
            {
                this.deleteSetbyIndex(i)
                return true
            }
        }
        
        return false
    }

    this.getScriptSettings = function (settingsObj, fromAction) {
        if (fromAction) {
            var d = app.playbackParameters
        } else {
            try { var d = app.getCustomOptions(GUID) } catch (e) { }
        }

        if (d != undefined) descriptorToObject(settingsObj, d, strMessage)

        function descriptorToObject(o, d, s) {
            var l = d.count;
            if (l) {
                if (d.hasKey(gMessage) && (s != d.getString(gMessage))) return;
            }
            for (var i = 0; i < l; i++) {
                var k = d.getKey(i);
                var t = d.getType(k);
                strk = app.typeIDToStringID(k);
                switch (t) {
                    case DescValueType.BOOLEANTYPE:
                        o[strk] = d.getBoolean(k);
                        break;
                    case DescValueType.STRINGTYPE:
                        o[strk] = d.getString(k);
                        break;
                    case DescValueType.INTEGERTYPE:
                        o[strk] = d.getDouble(k);
                        break;
                }
            }
        }

    }

    this.putScriptSettings = function (settingsObj, toAction) {
        
        var d = objectToDescriptor(settingsObj, strMessage)

        if (toAction) {app.playbackParameters = d}
        else {app.putCustomOptions(GUID, d)}

        function objectToDescriptor(o, s) {
            var d = new ActionDescriptor;
            var l = o.reflect.properties.length;
            d.putString(gMessage, s);
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

    
    function hash(str) {
        var hash = 0;
        var str = String(str);
        if (str.length == 0) return hash;
        for (i = 0; i < str.length; i++) {
            ch = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + ch;
            hash = hash & hash;
        }
        return hash;
    }

    function s2t(s) {return stringIDToTypeID(s)}
}

function Metadata () {

    this.writeMetadata = function (s) {
        try {
            if (ExternalObject.AdobeXMPScript == undefined) {
                ExternalObject.AdobeXMPScript = new ExternalObject('lib:AdobeXMPScript')
            }
            var xmpMeta = undefined
            try {
                xmpMeta = new XMPMeta(app.activeDocument.xmpMetadata.rawData)
            } catch (e) {
                xmpMeta = new XMPMeta()
            }
            XMPMeta.registerNamespace(source, customNamespace)
            xmpMeta.setProperty(source, customPrefix, s)
            app.activeDocument.xmpMetadata.rawData = xmpMeta.serialize()
            return true
        } catch (e) { return false }
    }   

    this.readMetadata = function () {
        try {
            if (ExternalObject.AdobeXMPScript == undefined) {
                ExternalObject.AdobeXMPScript = new ExternalObject('lib:AdobeXMPScript')
            }
            var xmpMeta = undefined
            try {
                xmpMeta = new XMPMeta(app.activeDocument.xmpMetadata.rawData)
            } catch (e) {
                xmpMeta = new XMPMeta()
            }
            if (xmpMeta.doesPropertyExist(source, customPrefix)){
                return xmpMeta.getProperty(source, customPrefix).toString()
            }
        } catch (e) { return false }
    }  

    this.removeMetadata = function () {
        try {
            if (ExternalObject.AdobeXMPScript == undefined) {
                ExternalObject.AdobeXMPScript = new ExternalObject('lib:AdobeXMPScript')
            }
            var xmpMeta = undefined
            try {
                xmpMeta = new XMPMeta(app.activeDocument.xmpMetadata.rawData)
            } catch (e) {
                xmpMeta = new XMPMeta()
            }
            if (xmpMeta.doesPropertyExist(source, customPrefix)){
                xmpMeta.deleteProperty(source, customPrefix)
                app.activeDocument.xmpMetadata.rawData = xmpMeta.serialize()
                return true
            }
        } catch (e) { return false }
    } 

    this.checkMetadata = function () {
        try {
            if (ExternalObject.AdobeXMPScript == undefined) {
                ExternalObject.AdobeXMPScript = new ExternalObject('lib:AdobeXMPScript')
            }
            var xmpMeta = undefined
            try {
                xmpMeta = new XMPMeta(app.activeDocument.xmpMetadata.rawData)
            } catch (e) {
                xmpMeta = new XMPMeta()
            }

            if (xmpMeta.doesPropertyExist(source, customPrefix)) return true
        } catch (e) { return false }
        return false
    }

    this.getATNFromDocument = function (writeToOptions) {

        try {
            var outfile = File(Folder.temp + "/" + generateUUID ()+ ".atn");

            outfile.open("w");
            outfile.encoding = "binary";
            outfile.write(eval(XMP.readMetadata()));
            outfile.close();

            var b = AM.getActionSetNumber()
            app.load(outfile)
            outfile.remove()
            var a = AM.getActionSetNumber()

            if (a == b) throw (errLoadFromDoc)
            var hash = AM.getActionSetHash(a)

            for (var i = b; i >= 1; i--) {
                if (hash == AM.getActionSetHash(i)) {
                    if (!confirm(strConfirm, true, strAlert)) {
                        AM.deleteSetbyIndex(a)
                        break; 
                    } else {break;}
                }
            }
            
            if (writeToOptions) {
                var temp = stringToObject (CFG.options)
                temp[hash] = AM.getDocumentID()
                CFG.options = objectToString(temp)
                AM.putScriptSettings(CFG)
            }
        } catch (e) { alert(errLoad + e, strErr, true); return false}

        return true
    }

    function generateUUID () {
        var id =  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g, function ( c ) {
               var r = Math.random() * 16 | 0;
               return ( c == 'x' ? r : ( r & 0x3 | 0x8 ) ).toString( 16 );
           } );
        return id
       }
}

function Config() {
    this.mode = "add"
    this.lastPath = ""
    this.options = {}
    this.options = String (this.options.toSource())
    this.onOpen = false
    this.onClose = false
}

function addEvt ()
{
    AM.putScriptSettings (CFG)

    delEvt()
    app.notifiersEnabled = true
    
    if (CFG.onOpen)
    {
        var handlerFile = File($.fileName)
        app.notifiers.add('Ntfy', handlerFile)
        if (CFG.onOpen ) app.notifiers.add('Opn ', handlerFile)
        if (CFG.onClose) app.notifiers.add('Cls ', handlerFile)
    }
}

function delEvt()
{
    try {
        var len = app.notifiers.length,
            cur = File($.fileName).name

        for (var i = 0; i < len; i++) {
            var ntf = app.notifiers[i]
            if (ntf.eventFile.name == cur) { ntf.remove(); i-- }
        }
    } catch (e) { }
}

function getObjectLength (obj){
    var len = 0
    for (var a in obj) {len++}
    return len
}

function stringToObject (s) {
    line = s.split('\n')
    line = s == "" ? [] : line
    var output = {}
    for (i = 0; i < line.length; i++) {
        var cur = line[i].split('\t')
        output[cur[0]] = cur[1]
    }
 return output
}

function objectToString (o) 
{
    var output = []
    for (a in o) {
        var cur = a + '\t' + o[a]
        output.push(cur)
    }
    return output.join ('\n')
}