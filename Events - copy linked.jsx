/**Контроль видимости связанных слоев при создании дубликатов
 * https://community.adobe.com/t5/photoshop-ecosystem-bugs/p-hidden-layers-linked-layer-made-visible-when-duplicated/idc-p/12802559
 * https://www.youtube.com/watch?v=q_9uocqy2Gw
 */

#target photoshop;
var UUID = '7c9fb9b1-890c-49ee-91cc-aab4cc85efc2',
    s2t = stringIDToTypeID,
    t2s = typeIDToStringID,
    layerID = s2t('layerID'),
    visible = s2t('visible'),
    layer = s2t('layer');
try {
    var evt = t2s(arguments[1]),
        tgt = t2s(arguments[0].getReference(s2t('null')).getDesiredClass());
    if (evt && (tgt.indexOf('ayer') > 0 || tgt == 'layerSection')) {
        var lrs = getLayers();
        if (evt == 'select' || evt == 'make') {
            putCustomOptions(UUID, (function (l) { (d = new ActionDescriptor()).putList(layer, l); return d })(findSelectedLayers(lrs.selection.reverse(), lrs.layers)), false)
        } else if (evt == 'duplicate') {
            var a = findSelectedLayers(lrs.selection.reverse(), lrs.layers);
            try { var d = getCustomOptions(UUID) } catch (e) { }
            if (d && a.count == (b = d.getList(layer)).count) {
                var ids = []
                for (var i = 0; i < a.count; i++) {
                    if (a.getObjectValue(i).getBoolean(visible) != b.getObjectValue(i).getInteger(visible))
                        ids.push(a.getObjectValue(i).getInteger(layerID))
                }
                if (ids.length) hideLayers(ids)
            }
        }
    }
} catch (e) { }
if (!evt) {
    var f = File($.fileName),
        del;
    for (var i = 0; i < app.notifiers.length; i++) {
        var ntf = app.notifiers[i]
        if (ntf.eventFile.name == f.name) { ntf.remove(); i--; del = true }
    }
    if (del) {
        alert('event listening disabled!')
    } else {
        app.notifiers.add('slct', f, 'Lyr ')
        app.notifiers.add('Dplc', f, 'Lyr ')
        app.notifiers.add('Mk  ', f)
        alert('event listening enabled!')
    }
}
function getLayers() {
    (r = new ActionReference()).putProperty(s2t("property"), s2t("json"));
    r.putEnumerated(s2t("document"), s2t("ordinal"), s2t("targetEnum"));
    (d = new ActionDescriptor()).putReference(s2t("null"), r);
    eval("var a=" + executeAction(s2t("get"), d, DialogModes.NO).getString(s2t("json")));
    return a;
}
function findSelectedLayers(idx, lrs, result, collect) {
    if (!result) result = new ActionList();
    for (var a in lrs) {
        if (!idx.length && !collect) return result
        if (equal = lrs[a].index == idx[0] || collect) {
            if (equal) idx.shift();
            var d = new ActionDescriptor();
            d.putInteger(layerID, lrs[a].id);
            d.putBoolean(visible, lrs[a].visible)
            result.putObject(layer, d)
            if (lrs[a].type == 'layerSection') findSelectedLayers(idx, lrs[a].layers, result, true)
        }
        if (lrs[a].type == 'layerSection') findSelectedLayers(idx, lrs[a].layers, result)
    }
    return result;
}
function hideLayers(ids) {
    r = new ActionReference();
    do { r.putIdentifier(s2t('layer'), ids.shift()) } while (ids.length)
    (l = new ActionList()).putReference(r);
    (d = new ActionDescriptor()).putList(s2t("target"), l);
    executeAction(s2t('hide'), d, DialogModes.NO);
}