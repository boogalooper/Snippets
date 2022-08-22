/**
*The script designed for recording and reading the notes hidden from the recipient of the notes in multilayer documents.
* The script uses several methods of recording data in the layers, as well as the body of the document itself, which allows
* In most cases, save the text of the note - it is not lost when copying/dragging any types of layers,
* preserving the document to other formats. Notes do not increase the file size, do not affect compatibility with old
* versions of Photoshop and other graphic editors (which, however, does not mean that they cannot be deleted
* random or special user actions).
* Access to notes is made using a 32-digit UID, which is generated at the first launch.
* When changing UID, access to previously saved notes is lost - therefore, it is recommended to copy it or save it to disk.
* The text of the notes is additionally encoded.
* https://www.youtube.com/watch?v=hv_mNlgyWSk
 */

#target photoshop

 /*
// BEGIN__HARVEST_EXCEPTION_ZSTRING
<javascriptresource>
<name>Steganograph</name>
<category>jazzy</category>
<enableinfo>true</enableinfo>
<eventid>12b85a97-98c7-471d-b80d-7270e8295902</eventid>
<terminology><![CDATA[<< /Version 1
                        /Events <<
                        /12b85a97-98c7-471d-b80d-7270e8295902 [(Steganograph) <<
                        /lastText [(Text) /string]
                        >>]
                         >>
                      >> ]]></terminology>
</javascriptresource>
// END__HARVEST_EXCEPTION_ZSTRING
*/ 

GUID="12b85a97-98c7-471d-b80d-7270e8295902"
strMessage = "Steganograph"
gMessage = s2t("message")
gProperty = s2t("property")
gNumberOfLayers = s2t("numberOfLayers")
gOrdinal = s2t("ordinal")
gDocument = s2t("document")
gTargetEnum = s2t("targetEnum")
var processBar = Number(app.version.split('.')[0])<16 ? false : true

var Base64 = {

    // private property
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode: function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },

    // public method for decoding
    decode: function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;

    },

    // private method for UTF-8 encoding
    _utf8_encode: function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode: function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }

}

var prefs = new Object
initExportInfo (prefs)

var isCancelled = false

main ()

isCancelled ? 'cancel' : undefined

function main ()
{
if (Number(app.version.split('.')[0])<11) {alert ("Скрипт не поддерживает работу в этой весрии photoshop","",1); return}   

if (!app.playbackParameters.count)  
    {  
   // normal run
    getScriptSettings (prefs)
    var w = buildWindow (); var result = w.show()
    
    if (result == 2) {isCancelled=true; return} else  // if cancelled
        {
            //try to search from menu with registry settings, aftter search put it to palette and registry
            putScriptSettings(prefs)
            putScriptSettings(prefs, true)
        }
    // exit script  
    }  
else  
    {  
   
    getScriptSettings (prefs, true)   
    
    if (app.playbackDisplayDialogs == DialogModes.ALL ) 
    {
        //double click from action
        prefs.lastTab = 1
        var w = buildWindow (true); var result = w.show()
        
        if (result == 2) {isCancelled=true; return} else // if cancelled
        {   
            putScriptSettings(prefs, true)
        }
    }

    if (app.playbackDisplayDialogs != DialogModes.ALL) {prefs.lastTab = 1; if (processBar) {app.doForcedProgress ("запись данных в документ","enumLayers()")} else {enumLayers()}} //run by button "play" with saved in palette settings
    // next code  
} 
}

function buildWindow ()
{
    var w = new Window("dialog");
    w.text = "Steganograph";
    w.orientation = "column";
    w.alignChildren = ["fill", "top"];
    w.spacing = 10;
    w.margins = 16;

    // G
    // =
    var g = w.add("group", undefined, { name: "g" });
    g.orientation = "row";
    g.alignChildren = ["left", "center"];
    g.spacing = 5;
    g.margins = 0;

    var st = g.add("statictext", undefined, undefined, { name: "st" });
    st.text = "UID:";

    var etUid = g.add('edittext {properties: {name: "etUid"}}');
    etUid.preferredSize.width = 300;

    var bnSave = g.add("button", undefined, undefined, { name: "bnSave" });
    bnSave.helpTip = "сохранить UID на диск";
    bnSave.text = "💾";
    bnSave.preferredSize.width = 40;

    var bnRefresh = g.add("button", undefined, undefined, { name: "bnRefresh" });
    bnRefresh.helpTip = "создать новый UID";
    bnRefresh.text = "↺";
    bnRefresh.preferredSize.width = 40;

    // W
    // =
    var st1 = w.add("group");
    st1.preferredSize.width = 300;
    st1.orientation = "column";
    st1.alignChildren = ["left", "center"];
    st1.spacing = 0;

    st1.add("statictext", undefined, "Перед началом работы скопируйте или сохраните UID на диск.", { name: "st1" });
    st1.add("statictext", undefined, "Это уникальный идентификатор, который позволяет", { name: "st1" });
    st1.add("statictext", undefined, "получить доступ к ранее сохраненным заметкам.", { name: "st1" });
    st1.preferredSize.width = 300;

    w.add("group");
    // PN
    // ==
    var pn = w.add("tabbedpanel", undefined, undefined, { name: "pn" });
    pn.alignChildren = "fill";
    pn.preferredSize.width = 429.25;
    pn.margins = 0;

    // TBREAD
    // ======
    var tbRead = pn.add("tab", undefined, undefined, { name: "tbRead" });
    tbRead.text = "Чтение";
    tbRead.orientation = "column";
    tbRead.alignChildren = ["left", "top"];
    tbRead.spacing = 10;
    tbRead.margins = 10;

    var st3 = tbRead.add("statictext", undefined, undefined, { name: "st3" });
    st3.text = "Сохраненные заметки:";

    var etRead = tbRead.add('edittext {properties: {name: "etRead", readonly: true, multiline: true, scrollable: true}}');
    etRead.preferredSize.height = 100;
    etRead.alignment = ["fill", "top"];

    
    var g2 = tbRead.add("group", undefined, { name: "g2" });
    g2.orientation = "row";
    g2.alignChildren = ["center", "top"];
    g2.spacing = 10;
    g2.margins = 0;
    g2.alignment = ["fill", "top"];

    var bnGet = g2.add("button", undefined, undefined, { name: "bnGet" });
    bnGet.text = "Получить данные из документа";

    // TBWRITE
    // =======
    var tbWrite = pn.add("tab", undefined, undefined, { name: "tbWrite" });
    tbWrite.text = "Запись";
    tbWrite.orientation = "column";
    tbWrite.alignChildren = ["left", "top"];
    tbWrite.spacing = 10;
    tbWrite.margins = 10;

    // PN
    // ==
    var st6 = tbWrite.add("statictext", undefined, undefined, { name: "st6" });
    st6.text = "Текст заметки:";

    var etWrite = tbWrite.add('edittext {properties: {name: "etWrite", multiline: true, scrollable: true}}');
    etWrite.preferredSize.height = 100;
    etWrite.alignment = ["fill", "top"];

    // G1
    // ==
    var g1 = tbWrite.add("group", undefined, { name: "g1" });
    g1.orientation = "row";
    g1.alignChildren = ["center", "top"];
    g1.spacing = 10;
    g1.margins = 0;
    g1.alignment = ["fill", "top"];

    var bnSet = g1.add("button", undefined, undefined, { name: "bnSet" });
    bnSet.text = "Записать данные в документ";

    // G2
    // ==
    var g2 = w.add("group", undefined, { name: "g2" });
    g2.orientation = "row";
    g2.alignChildren = ["center", "center"];
    g2.spacing = 10;
    g2.margins = 0;
    g2.alignment = ["fill", "top"];

    var bnOk = g2.add("button");
    bnOk.text = "Ок";

    var bnCancel = g2.add("button", undefined, undefined, { name: "cancel" });
    bnCancel.text = "Отмена";

    etWrite.onChanging = function () {prefs.lastText = this.text}

    etUid.onChanging = function () 
    {
        if (app.documents.length!=0) bnOk.enabled = bnSet.enabled = this.text == "" ? false : true
        prefs.uid = this.text
    }
    
    pn.onChange = function () {prefs.lastTab = this.selection == tbRead ? 0 : 1}
    
    bnRefresh.onClick = function () {etUid.text = generateUID (); etUid.onChanging ()}

    bnOk.onClick = function () {/*putScriptSettings(prefs)*/ w.close (1)}

    bnSet.onClick = function () 
    {
        if (processBar) {app.doForcedProgress ("запись данных в документ","enumLayers()")} else {enumLayers()}
        putScriptSettings(prefs)
    }

    bnGet.onClick = function () 
    {
        if (processBar) {app.doForcedProgress ("чтение данных из документа","enumLayers(etRead)")} else {enumLayers(etRead)}
        putScriptSettings(prefs)
    }

    bnSave.onClick = function ()
    {
        var fle = new File ("steganograph UID.txt")
        var pth = fle.saveDlg("Сохранить UID на диск","*.txt")
        try {
        if (pth)
            {
                pth.open( "w", "TEXT", "????" )
                pth.write(prefs.uid) 
                pth.close
            }
        } catch (e) {alert (e,"",1)}
    }
    
    w.onShow = function ()
    {
        if (app.documents.length==0) bnSet.enabled = bnGet.enabled = false
        etUid.text = prefs.uid == "" ? generateUID() : prefs.uid 
        etUid.onChanging ()
        etWrite.text = prefs.lastText
        pn.selection = prefs.lastTab
    }

    return w;
}

function enumLayers(textObject) {

    var ref = new ActionReference()
    ref.putProperty(gProperty, gNumberOfLayers)
    ref.putEnumerated(gDocument, gOrdinal, gTargetEnum)
    var total = executeActionGet(ref).getInteger(gNumberOfLayers)
    var current = 0

    var mode = prefs.lastTab
    var title = app.activeDocument.name

    var doc = app.activeDocument
    var lr = doc.artLayers
    var len = lr.length
    var set = doc.layerSets
    var output = []

    for (var i = 0; i < len; i++) 
    {
        if (processBar) app.updateProgress(current++, total)
        output.push(processMetadata(mode, lr[i], title))
    }

    len = set.length
    if (len > 0) {
        for (var i = 0; i < len; i++) {
            collectLayersInGroups(set[i], output)
        }
    }

    function collectLayersInGroups(parent, output) {

        output.push(processMetadata(mode, parent, title))

        if (processBar) app.updateProgress(current++, total)
        current++ 

        var lr = parent.artLayers
        var len = lr.length

        if (len > 0) {
            for (var i = 0; i < len; i++) {
                if (processBar) app.updateProgress(current++, total)
                output.push(processMetadata(mode, lr[i], title))
            }
        }

        var len = parent.layerSets.length
        if (len > 0) {
            for (var i = 0; i < len; i++) {
                collectLayersInGroups(parent.layerSets[i], output)
            }
        }
    }
/* */
    output.push(documentMetadata (mode, "", title))
/* */
    if (mode == 0) {
        textObject.text = ""
        var result = []
        result.push (output[0].split('|-|'))
    
        for (var i=1; i< output.length; i++)
            {
                var tmp = output[i].split('|-|')
    
                for (var x = 0; x<result.length; x++)
                {
                    if (tmp[3]!="")
                    {
                     if (tmp[3]!=result[x][3] || tmp[0]!=result[x][0]) 
                     {
                         var isAny = false
                         for (var n=0; n<result.length; n++)
                         {
                            if (tmp[3]==result[n][3] && tmp[0]==result[n][0]) {isAny=true; break;}
                         }
                        
                        if (!isAny) result.push(tmp)
                     }
                    }
                }
            }

        for (var i=0; i<result.length; i++)
        {
            if (result[i][0]!="")
            {
                textObject.text += result[i][0] + '\n' + result[i][2] + '\n'+result[i][3] + '\n\n'
            }
        }
    }
}

function processMetadata (mode, lr, title)
{
    if (lr.isBackgroundLayer) {if (app.activeDocument.layers.length==1) return ""}

    try {
        if (ExternalObject.AdobeXMPScript == undefined) {
            ExternalObject.AdobeXMPScript = new ExternalObject('lib:AdobeXMPScript')
        }

        var customNamespace = prefs.uid
        var customPrefix = strMessage

        var xmpMeta = undefined
        try {
            xmpMeta = new XMPMeta(lr.xmpMetadata.rawData)
        } catch (e) {
            xmpMeta = new XMPMeta()
        }

        if (mode == 1) 
        {
            var s = ""
            s += title + "|-|"
            s += lr + "|-|"
            s += new Date() + "|-|"
            s += prefs.lastText
            s = Base64.encode(s)   
            
            XMPMeta.registerNamespace(customNamespace, customPrefix)
            xmpMeta.setProperty(customNamespace,strMessage, s)
            lr.xmpMetadata.rawData = xmpMeta.serialize()
            return ""
        } else
        {  
            var data =xmpMeta.getProperty(customNamespace, strMessage)
            return data == undefined ? "" : Base64.decode(data.value)
        }
    } catch (e) {return ""}
}

function documentMetadata (mode, lr, title)
{
    try {
        if (ExternalObject.AdobeXMPScript == undefined) {
            ExternalObject.AdobeXMPScript = new ExternalObject('lib:AdobeXMPScript')
        }

        var customNamespace = reverse(prefs.uid)
        var customPrefix = "photoshop:"

        var xmpMeta = undefined
        try {
            xmpMeta = new XMPMeta(app.activeDocument.xmpMetadata.rawData)
          //  alert (xmpMeta.serialize())
        } catch (e) {
            xmpMeta = new XMPMeta()
        }

        if (mode == 1) 
        {
            var s = ""
            s += title + "|-|"
            s += lr.name + "|-|"
            s += new Date() + "|-|"
            s += prefs.lastText
            s = Base64.encode(s)   
            
            XMPMeta.registerNamespace(XMPConst.NS_PHOTOSHOP, customPrefix)
            xmpMeta.setProperty(XMPConst.NS_PHOTOSHOP,customNamespace, s)
            app.activeDocument.xmpMetadata.rawData = xmpMeta.serialize()
            return ""
        } else
        {  
            var data =xmpMeta.getProperty(XMPConst.NS_PHOTOSHOP, customNamespace)
            return data == undefined ? "" : Base64.decode(data.value)
        }
    } catch (e) {return ""}
}

function reverse (s)
{
 s=s.split('-')

 for (var i=0; i<s.length; i++)
 {
    s[i] = reverseString (s[i])
 }

 s = s.join ('-')
 s = s.replace(/[^A-Z]/ig, "")

 return s
 function reverseString (s)
 {
    var tmp = ""

    for (var i=s.length-1; i>=0; i--)
    {
        tmp += s.substr (i,1)
    }

    return tmp
 }

}

function selectLayerById (ID)
{
   var ref = new ActionReference();
   ref.putIdentifier(charIDToTypeID('Lyr '), ID);
   var desc = new ActionDescriptor();
   desc.putReference(charIDToTypeID('null'), ref);
   executeAction(charIDToTypeID('slct'), desc, DialogModes.NO);
}

function generateUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0;
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

function getScriptSettings (settingsObj, mode)
{
    try {var d = app.getCustomOptions(GUID);
    if (d!=undefined) descriptorToObject(settingsObj, d, strMessage)} catch (e) {} 
    
    if (mode)
    {
        try {var d = app.playbackParameters
        if (d!=undefined) descriptorToObject(settingsObj, d, strMessage)} catch (e) {}
    }

    function descriptorToObject (o, d, s) 
    {
        var l = d.count;
        if (l) {
            if ( d.hasKey(gMessage) && ( s != d.getString(gMessage) )) return;
        }
        for (var i = 0; i < l; i++ ) {
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

function putScriptSettings (settingsObj, mode)
{
    var d = objectToDescriptor(settingsObj, strMessage)
    if (mode) {app.playbackParameters = d; return}
    app.putCustomOptions(GUID, d)

    function objectToDescriptor (o, s) 
    {
        var d = new ActionDescriptor;
        var l = o.reflect.properties.length;
        d.putString(gMessage, s);
        for (var i = 0; i < l; i++ ) {
            var k = o.reflect.properties[i].toString();
            if (k == "__proto__" || k == "__count__" || k == "__class__" || k == "reflect") continue;
            var v = o[ k ];
            k = app.stringIDToTypeID(k);
            switch ( typeof(v) ) {
                case "boolean": d.putBoolean(k, v); break;
                case "string": d.putString(k, v); break;
                case "number": d.putInteger(k, v); break;
            }
        }
        return d;
    }    
}

function initExportInfo (s) 
{
  s.uid=""
  s.lastText = ""
  s.lastTab = 0
}

function s2t(s) {return stringIDToTypeID(s)}
function t2s(s) {return typeIDToStringID(s)}