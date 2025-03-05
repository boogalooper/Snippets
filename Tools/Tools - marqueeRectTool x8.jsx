#target photoshop
var s2t = stringIDToTypeID,
    t2s = typeIDToStringID;
try { var target = t2s(arguments[1]) } catch (e) { }
try {
    if (target) {
        (r = new ActionReference()).putProperty(s2t('property'), p = s2t('tool'));
        r.putEnumerated(s2t('application'), s2t('ordinal'), s2t('targetEnum'));
        var tool = t2s(executeActionGet(r).getEnumerationType(s2t('tool')));
        if (tool == 'marqueeRectTool') {
            var doc = new AM('document');
            if (doc.hasProperty('selection')) {
                var b = doc.descToObject(doc.getProperty('selection')),
                    w = Math.round((b.right - b.left) / 8) * 8,
                    hst = Math.round((b.bottom - b.top) / 8) * 8;
                doc.makeSelection(b.top, b.left, b.top + hst, b.left + w);
                if (ExternalObject.AdobeXMPScript == undefined) ExternalObject.AdobeXMPScript = new ExternalObject('lib:AdobeXMPScript')
                const myCustomNamespace = 'Selection',
                    myCustomPrefix = 'SDHelper:';
                try { xmpMeta = new XMPMeta(app.activeDocument.xmpMetadata.rawData) } catch (e) { xmpMeta = new XMPMeta() }
                XMPMeta.registerNamespace(myCustomNamespace, myCustomPrefix);
                xmpMeta.setProperty(myCustomNamespace, 'top', b.top);
                xmpMeta.setProperty(myCustomNamespace, 'left', b.left);
                xmpMeta.setProperty(myCustomNamespace, 'bottom', (b.top + hst));
                xmpMeta.setProperty(myCustomNamespace, 'right', (b.left + w));
                app.activeDocument.xmpMetadata.rawData = xmpMeta.serialize();
            }
        }
    } else {
        dialogWindow();
    }
} catch (e) { alert(e) }
function dialogWindow() {
    var w = new Window("dialog {text: 'Selection tracking',alignChildren:['fill','top']}"),
        bnNotifier = w.add("button {text: 'Enable selection rect tracking'}"),
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
        bnNotifier.text = enabled ? 'Disable adjustments tracking' : 'Enable adjustments tracking'
        bnNotifier.graphics.foregroundColor = enabled ? bnNotifier.graphics.newPen(bnNotifier.graphics.PenType.SOLID_COLOR, [1, 0, 0, 1], 1) : bnNotifier.graphics.newPen(bnNotifier.graphics.PenType.SOLID_COLOR, [0, 0.8, 0, 1], 1)
    }
    w.show()
}
function Events() {
    var f = File($.fileName);
    this.addEvents = function () {
        app.notifiersEnabled = true
        app.notifiers.add('setd', f, 'Chnl')
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
function AM(target, order) {
    var s2t = stringIDToTypeID,
        t2s = typeIDToStringID;
    target = s2t(target)
    this.getProperty = function (property, descMode, id, idxMode) {
        property = s2t(property);
        (r = new ActionReference()).putProperty(s2t('property'), property);
        id != undefined ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id)) :
            r.putEnumerated(target, s2t('ordinal'), order ? s2t(order) : s2t('targetEnum'));
        return descMode ? executeActionGet(r) : getDescValue(executeActionGet(r), property)
    }
    this.hasProperty = function (property, id, idxMode) {
        property = s2t(property);
        (r = new ActionReference()).putProperty(s2t('property'), property);
        id ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id))
            : r.putEnumerated(target, s2t('ordinal'), s2t('targetEnum'));
        try { return executeActionGet(r).hasKey(property) } catch (e) { return false }
    }
    this.descToObject = function (d) {
        var o = {}
        for (var i = 0; i < d.count; i++) {
            var k = d.getKey(i)
            o[t2s(k)] = getDescValue(d, k)
        }
        return o
    }
    this.makeSelection = function (top, left, bottom, right) {
        (r = new ActionReference()).putProperty(s2t('channel'), s2t('selection'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        (d1 = new ActionDescriptor()).putUnitDouble(s2t('top'), s2t('pixelsUnit'), top);
        d1.putUnitDouble(s2t('left'), s2t('pixelsUnit'), left);
        d1.putUnitDouble(s2t('bottom'), s2t('pixelsUnit'), bottom);
        d1.putUnitDouble(s2t('right'), s2t('pixelsUnit'), right);
        d.putObject(s2t('to'), s2t('rectangle'), d1);
        executeAction(s2t('set'), d, DialogModes.NO);
    }
    function getDescValue(d, p) {
        switch (d.getType(p)) {
            case DescValueType.OBJECTTYPE: return (d.getObjectValue(p));
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
            case DescValueType.ENUMERATEDTYPE: return [t2s(d.getEnumerationType(p)), t2s(d.getEnumerationValue(p))];
            default: break;
        };
    }
}