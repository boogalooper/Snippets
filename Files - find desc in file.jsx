#target photoshop

var tmp = (new File()).openDlg()
if (tmp)
{
    tmp.open("r");
    tmp.encoding = "BINARY";
    var s = tmp.read()
    tmp.close()

    for (var i = 0; i < s.length; i++) {
        try {
            var x = s.substr(i);
            var d = new ActionDescriptor();
            d.fromStream(x);
            if (d.count) {
                i = i + d.toStream(d).length
                var n = new ActionDescriptor();
                n.putObject(s2t('null'), s2t('null'), d);
                var str = t2s(n.getObjectType(n.getKey(0))) + '\n';
                $.writeln(str += getJSON(d))
            }
        } catch (e) { }
    }}

function getJSON(desc) {
    var d = new ActionDescriptor()
    d.putObject(s2t('object'), s2t('object'), desc);
    return (executeAction(s2t('convertJSONdescriptor'), d).getString(s2t('json')))
}

function s2t(s) { return stringIDToTypeID(s) }
function t2s(t) { if (!typeIDToStringID(t)) { return typeIDToCharID(t) } else { return typeIDToStringID(t) } }