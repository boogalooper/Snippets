﻿#target photoshop
s2t = stringIDToTypeID;

(r = new ActionReference());//.putProperty(s2t('property'), p = s2t('textKey'));
r.putEnumerated(s2t('application'), s2t('ordinal'), s2t('targetEnum'));
(d = new ActionDescriptor()).putObject(s2t('object'), s2t('object'), executeActionGet(r));
$.writeln(executeAction(s2t('convertJSONdescriptor'), d).getString(s2t('json')));

//app.putCustomOptions('test', executeActionGet(r))