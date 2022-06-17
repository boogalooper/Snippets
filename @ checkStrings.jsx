
/** Iterating over descriptor parameters based on data from strings.txt */
#target photoshop

var f = File(File($.fileName).path + '/strings.txt'),
    s2t = stringIDToTypeID,
    t2s = typeIDToStringID;

if (f.exists) {
    f.open('r')
    var keys = f.read().split('\n')
    f.close()
    $.writeln(keys.length + ' keys loaded')
}

len = keys.length;

logFile = File(Folder.desktop.fsName + "/" + "checkEvents.log");

logFile.open("a");

for (var i = 0; i < len; i++) {
    $.writeln((i + ': ' + keys[i]));

    for (var x = 0; x < len; x++) {
        var r = new ActionReference();
        r.putProperty(s2t('property'), s2t(keys[x]));
        // r.putEnumerated(s2t('application'), s2t('ordinal'), s2t('targetEnum'));
        r.putClass(s2t(keys[i]));
        try {
            var d = new ActionDescriptor();
            d.putObject(s2t('object'), s2t('object'), executeActionGet(r));
            logFile.writeln('Class ' + keys[i] + ' : ' + keys[x]);
            logFile.writeln(executeAction(s2t('convertJSONdescriptor'), d).getString(s2t('json')));
        } catch (e) { /*$.writeln('err') */ }
    }
    /*
    try {
        (d = new ActionDescriptor()).putObject(s2t('object'), s2t('object'), executeAction(s2t(keys[i]), undefined, DialogModes.NO));
        logFile.writeln(executeAction(s2t('convertJSONdescriptor'), d).getString(s2t('json')));
    } catch (e) { }*/
}
logFile.close();