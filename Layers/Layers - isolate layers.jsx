/**
 * Show only layer inside Layer type mode 
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/show-only-layer-inside-layer-type-mode/td-p/15413523
 */
#target photoshop
var s2t = stringIDToTypeID,
    t2s = typeIDToStringID,
    UUID = '2e4fad67-d0ca-4794-928c-6095afecff97',
    cfg = new Config;
try {
    var evt = t2s(arguments[1]),
        doc = new AM('document'),
        lr = new AM('layer'),
        ref = arguments[0].getList(s2t('null')).getReference(0),
        currentLayer = ref.getForm() == ReferenceFormType.NAME ? ref.getName() : lr.getProperty('layerID');
    if (evt == 'hide' && ScriptUI.environment.keyboardState.shiftKey) {
        var d = cfg.getScriptSettings();
        if (d.count && d.hasKey(doc.getProperty('documentID')) && d.getList(doc.getProperty('documentID')).count) {
            var layers = d.getList(doc.getProperty('documentID')),
                filteredLayers = new ActionList();
            d.putList(doc.getProperty('documentID'), new ActionList());
            cfg.putScriptSettings(d);
            for (var i = 0; i < layers.count; i++) {
                var cur = layers.getInteger(i);
                if (lr.hasProperty('layerID', cur) != null) filteredLayers.putInteger(cur)
            }
            doc.setLayersVisiblity(filteredLayers, 'show')
            doc.setLayerVisiblity(currentLayer, 'show');
        } else {
            var layers = getLayersVisiblity();
            d.putList(doc.getProperty('documentID'), layers);
            cfg.putScriptSettings(d);
            doc.setLayersVisiblity(layers, 'hide');
            doc.setLayerVisiblity(currentLayer, 'show');
            if (lr.hasProperty('parentLayerID', currentLayer) && lr.getProperty('parentLayerID', currentLayer) != -1) doc.setLayerVisiblity(lr.getProperty('parentLayerID', currentLayer), 'show');
        }
    }
} catch (e) { }
if (!evt) {
    dialogWindow();
}
function dialogWindow() {
    var w = new Window("dialog {text: 'Visiblity tracking',alignChildren:['fill','top']}"),
        bnNotifier = w.add("button {text: 'Enable visiblity tracking'}"),
        g = w.add("group {alignChildren:['center', 'center']}"),
        bnOk = g.add("button {text:'Ok'}", undefined, undefined, { name: "ok" }),
        evt = new Events();
    bnNotifier.onClick = function () {
        if (evt.checkEvents()) evt.removeEvents() else evt.addEvents()
        setEnabledButtonValue()
    }
    w.onShow = function () {
        setEnabledButtonValue()
    }
    function setEnabledButtonValue() {
        var enabled = evt.checkEvents()
        bnNotifier.text = enabled ? 'Disable visiblity tracking' : 'Enable visiblity tracking'
        bnNotifier.graphics.foregroundColor = enabled ? bnNotifier.graphics.newPen(bnNotifier.graphics.PenType.SOLID_COLOR, [1, 0, 0, 1], 1) : bnNotifier.graphics.newPen(bnNotifier.graphics.PenType.SOLID_COLOR, [0, 0.8, 0, 1], 1)
    }
    w.show()
}
function Events() {
    var f = File($.fileName);
    this.addEvents = function () {
        app.notifiersEnabled = true
        app.notifiers.add('Shw ', f)
        app.notifiers.add('Hd  ', f)
    }
    this.removeEvents = function () {
        for (var i = 0; i < app.notifiers.length; i++) {
            var ntf = app.notifiers[i]
            if (ntf.eventFile.name == f.name) { ntf.remove(); i--; }
        }
    }
    this.checkEvents = function () {
        for (var i = 0; i < app.notifiers.length; i++) {
            if (app.notifiers[i].eventFile.name == f.name) return true
        }
        return false
    }
}
function getLayersVisiblity() {
    var doc = new AM('document'),
        lr = new AM('layer'),
        len = doc.getProperty('numberOfLayers'),
        offset = doc.getProperty('hasBackgroundLayer') ? 0 : 1,
        layersList = new ActionList();
    for (var i = offset; i <= len; i++) {
        if (lr.getProperty('layerSection', i, true).value == 'layerSectionEnd') continue;
        if (lr.getProperty('visible', i, true)) layersList.putInteger(lr.getProperty('layerID', i, true))
    }
    return layersList;
}
function AM(target, order) {
    var s2t = stringIDToTypeID,
        t2s = typeIDToStringID;
    target = target ? s2t(target) : null;
    this.getProperty = function (property, id, idxMode) {
        property = s2t(property);
        (r = new ActionReference()).putProperty(s2t('property'), property);
        if (id == undefined) r.putEnumerated(target, s2t('ordinal'), order ? s2t(order) : s2t('targetEnum'));
        else if (typeof id == 'number') idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id);
        else r.putName(target, id)
        return getDescValue(executeActionGet(r), property)
    }
    this.hasProperty = function (property, id, idxMode) {
        try {
            property = s2t(property);
            (r = new ActionReference()).putProperty(s2t('property'), property);
            (r = new ActionReference()).putProperty(s2t('property'), property);
            if (id == undefined) r.putEnumerated(target, s2t('ordinal'), order ? s2t(order) : s2t('targetEnum'));
            else if (typeof id == 'number') idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id);
            else r.putName(target, id)
            return executeActionGet(r).hasKey(property)
        }
        catch (e) { return null }
    }
    this.descToObject = function (d) {
        var o = {}
        for (var i = 0; i < d.count; i++) {
            var k = d.getKey(i)
            o[t2s(k)] = getDescValue(d, k)
        }
        return o
    }
    this.objectToDesc = function (o) {
        var d = new ActionDescriptor();
        for (var k in o) {
            var v = o[k];
            switch (typeof (v)) {
                case 'boolean': d.putBoolean(s2t(k), v); break;
                case 'string': d.putString(s2t(k), v); break;
                case 'number': d.putInteger(s2t(k), v); break;
            }
        }
        return d;
    }
    this.setLayersVisiblity = function (layersState, visibility) {
        var r = new ActionReference();
        for (var i = 0; i < layersState.count; i++) r.putIdentifier(s2t('layer'), layersState.getInteger(i));
        (l = new ActionList()).putReference(r);
        (d = new ActionDescriptor()).putList(s2t("null"), l);
        executeAction(s2t(visibility), d, DialogModes.NO);
    }
    this.setLayerVisiblity = function (id, visibility) {
        var r = new ActionReference();
        typeof id == 'number' ? r.putIdentifier(s2t('layer'), id) : r.putName(s2t('layer'), id);
        (l = new ActionList()).putReference(r);
        (d = new ActionDescriptor()).putList(s2t("null"), l);
        executeAction(s2t(visibility), d, DialogModes.NO);
    }
    function getDescValue(d, p) {
        switch (d.getType(p)) {
            case DescValueType.OBJECTTYPE: return { type: t2s(d.getObjectType(p)), value: d.getObjectValue(p) };
            case DescValueType.LISTTYPE: return d.getList(p);
            case DescValueType.REFERENCETYPE: return d.getReference(p);
            case DescValueType.BOOLEANTYPE: return d.getBoolean(p);
            case DescValueType.STRINGTYPE: return d.getString(p);
            case DescValueType.INTEGERTYPE: return d.getInteger(p);
            case DescValueType.LARGEINTEGERTYPE: return d.getLargeInteger(p);
            case DescValueType.DOUBLETYPE: return d.getDouble(p);
            case DescValueType.ALIASTYPE: return d.getPath(p);
            case DescValueType.CLASSTYPE: return d.getClass(p);
            case DescValueType.UNITDOUBLE: return (d.getUnitDoubleValue(p));
            case DescValueType.ENUMERATEDTYPE: return { type: t2s(d.getEnumerationType(p)), value: t2s(d.getEnumerationValue(p)) };
            default: break;
        };
    }
}
function Config() {
    this.getScriptSettings = function () {
        var d = new ActionDescriptor();
        try { d = getCustomOptions(UUID) } catch (e) { }
        return d
    }
    this.putScriptSettings = function (d) {
        putCustomOptions(UUID, d, false);
    }
}