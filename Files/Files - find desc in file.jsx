﻿#target photoshop
var f = (new File()).openDlg()
if (f) {
    f.open("r");
    f.encoding = "BINARY";
    // tmp.seek(tmp.length - 1024 * 1024 * 3)
    var s = f.read()
    f.close()
    i = 0;
    i = s.indexOf(String.fromCharCode(04, 08)) //0x0408
    $.writeln(i)
    for (i; i < s.length; i++) {
        try {
            //  if (i > 3000) break;
            var x = s.substr(i);
            var d = new ActionDescriptor();
            d.fromStream(x);
            if (d.count) {
                $.writeln(i)
                i = i + d.toStream(d).length
                var n = new ActionDescriptor();
                n.putObject(s2t('null'), s2t('null'), d);
                var str = t2s(n.getObjectType(n.getKey(0))) + '\n';
                $.writeln(str += getJSON(d))
                $.writeln('line ' + i)
                //   break;
            }
        } catch (e) { }
    }
}
function getJSON(desc) {
    var d = new ActionDescriptor()
    d.putObject(s2t('object'), s2t('object'), desc);
    return (executeAction(s2t('convertJSONdescriptor'), d).getString(s2t('json')))
}
function s2t(s) { return stringIDToTypeID(s) }
function t2s(t) { if (!typeIDToStringID(t)) { return typeIDToCharID(t) } else { return typeIDToStringID(t) } }