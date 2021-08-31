#target photoshop

s2t = stringIDToTypeID;

var len = getPropertyDesc('application', p = 'numberOfDocuments').getInteger(s2t(p)),
    result = { v: 0, h: 0 };

for (var i = 1; i <= len; i++) {
    var ratio = getPropertyDesc('document', p = 'width', i).getDouble(s2t(p)) >= getPropertyDesc('document', p = 'height', i).getDouble(s2t(p));
    result[ratio ? 'h' : 'v']++
}

alert(result['v'] + 'v' + result['h'] + 'h')

function getPropertyDesc(target, property, idx) {
    target = s2t(target);
    (r = new ActionReference()).putProperty(s2t('property'), s2t(property));
    idx ? r.putIndex(target, idx) : r.putEnumerated(target, s2t('ordinal'), s2t('targetEnum'));
    return executeActionGet(r);
}
