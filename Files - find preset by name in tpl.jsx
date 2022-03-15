#target photoshop
var tmp = new File(Folder.temp.fsName + "/" + "TPFL");

newPreset('TEST_STRING')
saveCurrentPresets(tmp)

tmp.open("r");
tmp.encoding = "BINARY";
var s = tmp.read()
tmp.remove()

var a = 'TEST_STRING',
    c = [];
for (var i = 0; i < a.length; i++) c.push(String.fromCharCode(a.charCodeAt(i)));
str = c.join(String.fromCharCode(0));
var from = s.indexOf(str) + str.length + 2;

var d = new ActionDescriptor();
d.fromStream(s.substr(from));
if (d.count) {
    var n = new ActionDescriptor();
    n.putObject(s2t('null'), s2t('null'), d);
    var str = t2s(n.getObjectType(n.getKey(0))) + '\n';
    alert(str += checkDesc(d))
}

function deletePresets() {
    var index = 1;
    do {
        try {
            (r = new ActionReference()).putIndex(s2t("toolPreset"), index++);
            (l = new ActionList()).putReference(r);
            (d = new ActionDescriptor()).putList(s2t("null"), l);
            executeAction(s2t("delete"), d, DialogModes.NO);
        }
        catch (e) { break; }
    } while (true)

}

function saveCurrentPresets(pth) {
    (d = new ActionDescriptor()).putPath(s2t("null"), pth);
    (r = new ActionReference()).putProperty(s2t("property"), s2t("toolPreset"));
    r.putEnumerated(s2t("application"), s2t("ordinal"), s2t("targetEnum"));
    d.putReference(s2t("to"), r);
    executeAction(s2t("set"), d, DialogModes.NO);
}

function newPreset(nm) {
    (r = new ActionReference()).putClass(s2t("toolPreset"));
    (d = new ActionDescriptor()).putReference(s2t("null"), r);
    (r1 = new ActionReference()).putProperty(s2t("property"), s2t("currentToolOptions"));
    r1.putEnumerated(s2t("application"), s2t("ordinal"), s2t("targetEnum"));
    d.putReference(s2t("using"), r1);
    d.putString(s2t("name"), nm);
    executeAction(s2t("make"), d, DialogModes.NO);
}

function s2t(s) { return stringIDToTypeID(s) }
function t2s(t) { if (!typeIDToStringID(t)) { return typeIDToCharID(t) } else { return typeIDToStringID(t) } }

function getJSON(desc) {
    var d = new ActionDescriptor()
    d.putObject(s2t('object'), s2t('object'), desc);
    return (executeAction(s2t('convertJSONdescriptor'), d).getString(s2t('json')))
}