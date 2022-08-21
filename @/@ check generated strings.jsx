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

    var r = new ActionReference();
    r.putProperty(s2t('property'), s2t(keys[i]));
    r.putEnumerated(s2t('application'), s2t('ordinal'), s2t('targetEnum'));
    try {
        (d = new ActionDescriptor()).putObject(s2t('object'), s2t('object'), executeActionGet(r));
        logFile.writeln(executeAction(s2t('convertJSONdescriptor'), d).getString(s2t('json')));
        $.writeln((i + ': ' + keys[i]) + ' success');
    } catch (e) { $.writeln((i + ': ' + keys[i]) + ' error'); }
}
logFile.close();