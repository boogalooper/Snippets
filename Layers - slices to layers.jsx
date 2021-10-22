#target photoshop
var s2t = stringIDToTypeID,
    AR = ActionReference,
    AD = ActionDescriptor;

(r = new AR).putProperty(s2t('property'), p = s2t('layerID'));
r.putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
var id = executeActionGet(r).getInteger(p);

(r = new AR).putProperty(s2t('property'), p = s2t('slices'));
r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
var slices = executeActionGet(r).getObjectValue(p).getList(p);

for (var i = 0; i < slices.count - 1; i++) {
    (r = new AR).putIdentifier(s2t('layer'), id);
    (d = new AD).putReference(s2t('target'), r);
    executeAction(s2t('select'), d, DialogModes.NO);
    (r = new AR).putProperty(s2t('channel'), s2t('selection'));
    (d = new AD).putReference(s2t('target'), r);
    d.putObject(s2t('to'), s2t('rectangle'),
        function (b, d) {
            for (var i = 0; i < b.count; i++)
                d.putUnitDouble(k = (b.getKey(i)), s2t('pixelsUnit'), b.getInteger(k))
            return d;
        }(slices.getObjectValue(i).getObjectValue(s2t('bounds')), new AD)
    );
    executeAction(s2t('set'), d, DialogModes.NO);

    executeAction(s2t('copyToLayer'), undefined, DialogModes.NO)
}