/* getting event notifier parameters */
#target photoshop

s2t = stringIDToTypeID;
t2s = typeIDToStringID;

try {
    (d = new ActionDescriptor()).putObject(s2t('object'), s2t('object'), arguments[0]);
    eval('textKey = ' + executeAction(s2t('convertJSONdescriptor'), d).getString(s2t('json')));
    $.writeln('event ' + t2s(arguments[1]) + '\n' + executeAction(s2t('convertJSONdescriptor'), d).getString(s2t('json')))
} catch (e) { $.writeln(e) }