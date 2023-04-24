/**
 * Script to create groups and rename them with sequential numbers  
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/script-to-create-groups-and-rename-them-with-sequential-numbers/td-p/13734552
 * */

#target photoshop

try {
    var target = arguments[0],
        evt = typeIDToStringID(arguments[1]);
    if (evt == 'make')  checkName() 
} catch (e) { }
if (!target) {
    dialogWindow();
}
function dialogWindow() {
    var w = new Window("dialog {text: 'Rename groups',alignChildren:['fill','top']}"),
        bnNotifier = w.add("button {text: 'Enable new groups tracking'}"),
        bnOk = w.add("button {text:'Ok'}", undefined, undefined, { name: "ok" }),
        evt = new Events();

    bnNotifier.onClick = function () {
        if (evt.checkEvents()) evt.removeEvents() else evt.addEvents()
        setEnabledButtonValue();
    }

    w.onShow = function () { setEnabledButtonValue() }
    function setEnabledButtonValue() {
        var trackingEnabled = evt.checkEvents();
        bnNotifier.text = trackingEnabled ? 'Disable new groups tracking' : 'Enable new groups tracking'
        bnNotifier.graphics.foregroundColor = trackingEnabled ? bnNotifier.graphics.newPen(bnNotifier.graphics.PenType.SOLID_COLOR, [1, 0, 0, 1], 1) : bnNotifier.graphics.newPen(bnNotifier.graphics.PenType.SOLID_COLOR, [0, 0.8, 0, 1], 1)
    }
    w.show()
}
function checkName() {
    var doc = new AM('document'),
        lr = new AM('layer'),
        indexFrom = doc.getProperty('hasBackgroundLayer') ? 0 : 1,
        indexTo = doc.getProperty('numberOfLayers'),
        groups = {};
    for (var i = indexFrom; i <= indexTo; i++) {
        if (lr.getProperty('layerSection', i, true).value == 'layerSectionStart') {
            var cur = lr.getProperty('name', i, true).match(/(.+) (\d+$)/);
            if (cur && cur.length == 3) {
                var title = cur[1],
                    index = Number(cur[2]);

                if (title == localize('$$$/Actions/Class/LayerGroup')) break;
                groups[title] = groups[title] ? groups[title] : []
                groups[title].push(index)
            }
        }
    }

    var basename;
    for (var a in groups) {
        if (!basename) { basename = a; continue; }
        if (groups[basename].length < groups[a].length) basename = a;
    }

    if (basename) {
        groups[basename].sort(function (a, b) { return a > b; });
        activeDocument.suspendHistory('Rename group', 'lr.setLayerName(basename + " " + (groups[basename][groups[basename].length - 1] + 1))')
    }
}

function AM(target, order) {
    var s2t = stringIDToTypeID,
        t2s = typeIDToStringID;
    target = target ? s2t(target) : null;
    this.getProperty = function (property, id, idxMode) {
        property = s2t(property);
        (r = new ActionReference()).putProperty(s2t('property'), property);
        id != undefined ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id)) :
            r.putEnumerated(target, s2t('ordinal'), order ? s2t(order) : s2t('targetEnum'));
        return getDescValue(executeActionGet(r), property)
    }
    this.hasProperty = function (property, id, idxMode) {
        property = s2t(property);
        (r = new ActionReference()).putProperty(s2t('property'), property);
        id ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id))
            : r.putEnumerated(target, s2t('ordinal'), order ? s2t(order) : s2t('targetEnum'));
        return executeActionGet(r).hasKey(property)
    }
    this.setLayerName = function (s, id) {
        var r = new ActionReference();
        if (id) r.putIdentifier(s2t('layer'), id) else r.putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
        (d = new ActionDescriptor()).putReference(s2t('target'), r);
        (d1 = new ActionDescriptor()).putString(s2t('name'), s);
        d.putObject(s2t('to'), s2t('layer'), d1);
        executeAction(s2t('set'), d, DialogModes.NO);
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
        app.notifiers.add('Mk  ', f, 'layerSection')
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