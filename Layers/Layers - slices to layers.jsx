/**Divide my image to layers
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/divide-my-image-to-layers/m-p/12467520
 */
#target photoshop
var s2t = stringIDToTypeID,
    AR = ActionReference,
    AD = ActionDescriptor;
try {
    try {
        (r = new AR).putProperty(s2t('property'), p = s2t('layerID'));
        r.putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
        var id = executeActionGet(r).getInteger(p);
    }
    catch (e) { throw "No layer selected!\nOpen the document and select layer" }
    try {
        (r = new AR).putProperty(s2t('property'), p = s2t('slices'));
        r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
        var slices = executeActionGet(r).getObjectValue(p).getList(p);
    }
    catch (e) { throw "This version of photoshop does not have access to slices" }
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
        try { executeAction(s2t('copyToLayer'), undefined, DialogModes.NO) }
        catch (e) { throw "Script cannot create layer from empty space!\nMake sure that current layer contains pixels in all slices." }
    }
} catch (e) { alert(e) }