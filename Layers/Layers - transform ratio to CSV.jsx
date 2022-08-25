/**Get the scale of the transformation of all the smart objects of the document and save them as a table
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/script-to-export-all-smart-objects-layer-names-with-scale/m-p/12799010#M628167
 * https://youtu.be/MPk_P-Yfs44
 */
#target photoshop;
var s2t = stringIDToTypeID;
(r = new ActionReference()).putProperty(s2t('property'), p = s2t('numberOfLayers'));
r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
var len = executeActionGet(r).getInteger(p),
    div = ';'
csv = ['name' + div + 'scale']
for (var i = 1; i <= len; i++) {
    (r = new ActionReference()).putProperty(s2t('property'), p = s2t('layerKind'));
    r.putIndex(s2t('layer'), i);
    if (executeActionGet(r).getInteger(p) == 5) {
        (r = new ActionReference()).putProperty(s2t('property'), p = s2t('name'));
        r.putIndex(s2t('layer'), i);
        var n = executeActionGet(r).getString(p) + div;
        (r = new ActionReference()).putProperty(s2t('property'), p = s2t('smartObjectMore'));
        r.putIndex(s2t('layer'), i);
        var t = executeActionGet(r).getObjectValue(p).getList(s2t('transform'));
        csv.push(n + (Math.round((Math.sqrt(Math.pow(t.getDouble(0) - t.getDouble(2), 2) + Math.pow(t.getDouble(1) - t.getDouble(3), 2))) /
            executeActionGet(r).getObjectValue(p).getObjectValue(s2t('size')).getDouble(s2t('width')) * 10000) / 100) + '%')
    }
}
n = (new File(Folder.desktop + '/scale')).saveDlg('Save file', '*.csv');
if (n) {
    if (n.open('w', 'TEXT')) {
        n.write(csv.join('\n'))
        n.close()
    }
}