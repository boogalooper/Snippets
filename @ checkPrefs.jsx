#target photoshop

var f = File(File($.fileName).path + '/PIStringTerminology.h'),
    s2t = stringIDToTypeID,
    t2s = typeIDToStringID;

var keys = []

if (f.exists) {
    f.open('r')
    while (!f.eof) {
        var l = f.readln().match(/#define \w+ \"(\w+)\"/)
        if (l) {
            keys.push(s2t(l[1]))
        }
    }
    f.close()
    $.writeln(keys.length + ' keys loaded')
}

len = keys.length;

logFile = File(Folder.desktop.fsName + "/" + "checkClasses.log");

logFile.open("a");

for (var i = 0; i < len; i++) {
    //   logFile.writeln ((i + ': ' + t2s(keys[i])));
    $.writeln((i + ': ' + t2s(keys[i])));
    //    for (var n = 0; n < len; n++) {
    var r = new ActionReference();
    //r.putIndex(keys[i], 1)
    r.putProperty(s2t('property'), keys[i]);
      r.putClass(s2t('timeline'))
  //  r.putEnumerated(s2t('action'), s2t('targetEnum'), s2t('ordinal'));
    try {
        executeActionGet(r);
        logFile.writeln(t2s(keys[i]))
    } catch (e) { }
    //   }
}
logFile.close();