/**
 * Is there another property that can be used to differentiate all of these layerSets?
 * Group = layerSet
 * Artboard = layerSet
 * Frame = layerSet
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/custom-script-for-renaming-artboards-with-multiple-elements/m-p/13502457#M700099
 */

var s2t = stringIDToTypeID,
    t2s = typeIDToStringID;
(r = new ActionReference()).putProperty(s2t('property'), p = s2t('numberOfLayers'));
r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
var len = executeActionGet(r).getInteger(p),
    result = [];
for (var i = 1; i <= len; i++) {
    (r = new ActionReference()).putProperty(s2t('property'), p = s2t('layerSection'));
    r.putIndex(s2t('layer'), i);
    if (t2s(executeActionGet(r).getEnumerationValue(p)) == 'layerSectionEnd') continue;
    (r = new ActionReference()).putProperty(s2t('property'), p = s2t('layerKind'));
    r.putIndex(s2t('layer'), i);
    if (executeActionGet(r).getInteger(p) == 7) {
        (r = new ActionReference()).putProperty(s2t('property'), p = s2t('name'));
        r.putIndex(s2t('layer'), i);
        var title = executeActionGet(r).getString(p);
        (r = new ActionReference()).putProperty(s2t('property'), p = s2t('layerID'));
        r.putIndex(s2t('layer'), i);
        var id = executeActionGet(r).getInteger(p);
        var kind = '';
        (r = new ActionReference()).putProperty(s2t('property'), p = s2t('artboardEnabled'));
        r.putIndex(s2t('layer'), i);
        if (executeActionGet(r).hasKey(p) && executeActionGet(r).getBoolean(p)) kind = 'artboard';
        (r = new ActionReference()).putProperty(s2t('property'), p = s2t('framedGroup'));
        r.putIndex(s2t('layer'), i);
        if (executeActionGet(r).hasKey(p)) kind = 'frame layer'
        if (kind=='') kind = 'layer section'
        result.push('Layer "' + title + '" with id ' + id + ' is ' + kind)
    }
}
alert(result.join('\n'))