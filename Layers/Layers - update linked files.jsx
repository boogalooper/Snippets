/**
 * Is there a way to alert when there's modified content like in InDesign? 
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/is-there-a-way-to-alert-when-there-s-modified-content-like-in-indesign/td-p/13678234
 */
#target photoshop
var apl = new AM('application'),
    doc = new AM('document'),
    lr = new AM('layer');
if (apl.getProperty('numberOfDocuments')) {
    if (doc.hasProperty('numberOfLayers')) {
        var len = doc.getProperty('numberOfLayers');
        linkedObjects = [];
        for (var i = 1; i <= len; i++) {
            if (lr.getProperty('layerSection', i, true).value == 'layerSectionEnd') continue;
            if (lr.getProperty('layerKind', i, true) == 5) {
                var smartObject = doc.descToObject(lr.getProperty('smartObject', i, true).value)
                if (smartObject.linked) {
                    if (smartObject.linkChanged) {
                        var cur =
                        {
                            layerID: lr.getProperty('layerID', i, true),
                            link: !(smartObject.link instanceof File) ? smartObject.fileReference : File(smartObject.link)
                        }
                        var copyOfLayer = false;
                        for (var x = 0; x < linkedObjects.length; x++) {
                            if (decodeURI(cur.link).toUpperCase() == decodeURI(linkedObjects[x].link).toUpperCase()) {
                                copyOfLayer = true
                                break;
                            }
                        }
                        if (!copyOfLayer) linkedObjects.push(cur)
                    }
                }
            }
        }
        if (linkedObjects.length) showDialog(linkedObjects)
    }
}
function showDialog(fileList) {
    var w = new Window("dialog {text: 'List of modified links'}"),
        bnNotifier = w.add("button {text: 'Enable modified links tracking'}"),
        l = w.add("listbox", [0, 0, 600, 400], undefined, { multiselect: true }),
        gButtons = w.add("group"),
        bnOk = gButtons.add("button {text:'Update all files'}", [0, 0, 150, -1], undefined, { name: "ok" }),
        bnCancel = gButtons.add("button {text:'Cancel'}", undefined, undefined, { name: "cancel" }),
        evt = new Events();
    l.graphics.font = "dialog:12";

    bnNotifier.onClick = function () {
        if (evt.checkEvents()) evt.removeEvents() else evt.addEvents()
        setEnabledButtonValue()
    }
    bnOk.onClick = function () {
        w.close();
        var ids = [];
        if (l.selection != null) {
            for (var i = 0; i < l.items.length; i++)
                if (l.items[i].selected) ids.push(fileList[i].layerID)
        }
        doc.updateLinks(ids)
    }
    l.onClick = function () {
        bnOk.text = 'Update ' + (l.selection == null ? 'all' : 'seleted (' + l.selection.length + ')')
    }
    w.onShow = function () {
        setEnabledButtonValue()
        for (var i = 0; i < fileList.length; i++) l.add('item', fileList[i].link instanceof File ? fileList[i].link.fsName : fileList[i].link)
    }
    
    w.show()
    function setEnabledButtonValue() {
        var enabled = evt.checkEvents()
        bnNotifier.text = enabled ? 'Disable adjustments tracking' : 'Enable adjustments tracking'
        bnNotifier.graphics.foregroundColor = enabled ? bnNotifier.graphics.newPen(bnNotifier.graphics.PenType.SOLID_COLOR, [1, 0.4, 0.4, 1], 1) : bnNotifier.graphics.newPen(bnNotifier.graphics.PenType.SOLID_COLOR, [0, 0.8, 0, 1], 1)
    }
}
function AM(target) {
    var s2t = stringIDToTypeID,
        t2s = typeIDToStringID;
    target = target ? s2t(target) : null;
    this.getProperty = function (property, id, idxMode) {
        property = s2t(property);
        (r = new ActionReference()).putProperty(s2t('property'), property);
        id != undefined ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id)) :
            r.putEnumerated(target, s2t('ordinal'), s2t('targetEnum'));
        return getDescValue(executeActionGet(r), property)
    }
    this.hasProperty = function (property, id, idxMode) {
        property = s2t(property);
        (r = new ActionReference()).putProperty(s2t('property'), property);
        id ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id))
            : r.putEnumerated(target, s2t('ordinal'), s2t('targetEnum'));
        try { return executeActionGet(r).hasKey(property) } catch (e) { return false }
    }
    this.descToObject = function (d, o) {
        o = o ? o : {}
        for (var i = 0; i < d.count; i++) {
            var k = d.getKey(i)
            o[t2s(k)] = getDescValue(d, k)
        }
        return o
    }
    this.selectLayerByIDList = function (IDList) {
        var ref = new ActionReference()
        for (var i = 0; i < IDList.length; i++) {
            ref.putIdentifier(s2t("layer"), IDList[i])
        }
        var desc = new ActionDescriptor()
        desc.putReference(s2t("target"), ref)
        desc.putBoolean(s2t("makeVisible"), false)
        executeAction(s2t("select"), desc, DialogModes.NO)
    }
    this.updateLinks = function (ids) {
        if (ids.length) {
            for (var i = 0; i < ids.length; i++) {
                var r = new ActionReference();
                r.putIdentifier(s2t('layer'), ids[i]);
                (d = new ActionDescriptor()).putReference(s2t('null'), r);
                executeAction(s2t('select'), d, DialogModes.NO);
                executeAction(s2t("placedLayerUpdateModified"), d, DialogModes.NO);
            }
        } else {
            executeAction(s2t("placedLayerUpdateAllModified"), new ActionDescriptor(), DialogModes.NO);
        }
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
function Events() {
    var f = File($.fileName);
    this.addEvents = function () {
        app.notifiersEnabled = true
        app.notifiers.add('Opn ', f)
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
