/** Iterating over descriptor parameters based on data from PIStringTerminology.h */
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
    $.writeln((i + ': ' + t2s(keys[i])));

    (r = new ActionReference()).putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
    (d = new ActionDescriptor()).putReference(s2t('target'), r);
    (d1 = new ActionDescriptor()).putBoolean(keys[i], true);
    d.putObject(s2t('to'), s2t('layer'), d1);
    // try { executeAction(s2t('set'), d, DialogModes.NO) } catch (e) { };

    //  for (var n = 0; n < len; n++) {
    //    var r = new ActionReference();

    //r.putIndex(keys[i], 1)

    // r.putProperty(s2t('property'), keys[i]);
    //r.putClass(s2t('layer'));
    //  r.putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
    try {
        //   var k = executeActionGet(r);
        //         logFile.writeln('Class ' /*+ t2s(keys[n]) */+ ' : ' + t2s(keys[i]));
        executeAction(s2t('set'), d, DialogModes.NO)
            (z = new ActionDescriptor()).putObject(s2t('object'), s2t('object'), d);
        logFile.writeln(executeAction(s2t('convertJSONdescriptor'), z).getString(s2t('json')));
    } catch (e) { }
    //   }
}
logFile.close();