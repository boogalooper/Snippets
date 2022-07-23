/**Multiply as preset blending mode
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/multiply-as-preset-blending-mode/td-p/13061864
 * 
 */
/*
<javascriptresource>
<name>Default blend mode</name>
</javascriptresource>
*/
var s2t = stringIDToTypeID,
    t2s = typeIDToStringID,
    cfg = new Config();
blendModes = {
    normal: { label: localize("$$$/Menu/TransferMode/Normal=Normal"), idx: 0 },
    dissolve: { label: localize("$$$/Menu/TransferMode/Dissolve=Dissolve"), idx: 1 },
    darken: { label: localize("$$$/Menu/TransferMode/Darken=Darken"), idx: 2 },
    multiply: { label: localize("$$$/Menu/TransferMode/Multiply=Multiply"), idx: 3 },
    colorBurn: { label: localize("$$$/Menu/TransferMode/ColorBurn=Color Burn"), idx: 4 },
    linearBurn: { label: localize("$$$/Menu/TransferMode/LinearBurn=Linear Burn"), idx: 5 },
    darkerColor: { label: localize("$$$/Menu/TransferMode/DarkerColor=Darker Color"), idx: 6 },
    lighten: { label: localize("$$$/Menu/TransferMode/Lighten=Lighten"), idx: 7 },
    screen: { label: localize("$$$/Menu/TransferMode/Screen=Screen"), idx: 8 },
    colorDodge: { label: localize("$$$/Menu/TransferMode/ColorDodge=Color Dodge"), idx: 9 },
    linearDodge: { label: localize("$$$/Menu/TransferMode/LinearDodge=Linear Dodge (Add)").replace(/ ?\(.+\)/, ''), idx: 10 },
    lighterColor: { label: localize("$$$/Menu/TransferMode/LighterColor=Lighter Color"), idx: 11 },
    overlay: { label: localize("$$$/Menu/TransferMode/Overlay=Overlay"), idx: 12 },
    softLight: { label: localize("$$$/Menu/TransferMode/SoftLight=Soft Light"), idx: 13 },
    hardLight: { label: localize("$$$/Menu/TransferMode/HardLight=Hard Light"), idx: 14 },
    vividLight: { label: localize("$$$/Menu/TransferMode/VividLight=Vivid Light"), idx: 15 },
    linearLight: { label: localize("$$$/Menu/TransferMode/LinearLight=Linear Light"), idx: 16 },
    pinLight: { label: localize("$$$/Menu/TransferMode/PinLight=Pin Light"), idx: 17 },
    hardMix: { label: localize("$$$/Menu/TransferMode/HardMix=Hard Mix"), idx: 18 },
    difference: { label: localize("$$$/Menu/TransferMode/Difference=Difference"), idx: 19 },
    exclusion: { label: localize("$$$/Menu/TransferMode/Exclusion=Exclusion"), idx: 20 },
    blendSubtraction: { label: localize("$$$/Menu/TransferMode/Subtraction=Subtract"), idx: 21 },
    blendDivide: { label: localize("$$$/Menu/TransferMode/Division=Divide"), idx: 22 },
    hue: { label: localize("$$$/Menu/TransferMode/Hue=Hue"), idx: 23 },
    saturation: { label: localize("$$$/Menu/TransferMode/Saturation=Saturation"), idx: 24 },
    color: { label: localize("$$$/Menu/TransferMode/Color=Color"), idx: 25 },
    luminosity: { label: localize("$$$/Menu/TransferMode/Luminosity=Luminosity"), idx: 26 }
},
    layerKinds = {
        1: 'art layer',
        2: 'adjustment layer',
        3: 'text layer',
        4: 'vector object',
        5: 'smart object',
        6: 'video layer',
        7: 'layer group',
        8: '3D layer',
        9: 'gradient layer',
        10: 'pattern layer',
        11: 'solid color layer'
    };
cfg.getScriptSettings();
try {
    var target = arguments[0];
    if (target) {
        lr = new AM('layer');
        alert(lr.getProperty('layerKind'))
        if (cfg.layerKind[lr.getProperty('layerKind') - 1]) {
            for (var k in blendModes) if (blendModes[k].idx == cfg.currentMode) break;
            if (lr.getProperty('mode').value != k) activeDocument.suspendHistory('Set blending mode', 'lr.setBlendMode(k)')
        }
    }
} catch (e) { }
if (!target) {
    dialogWindow();
}
function dialogWindow() {
    var w = new Window("dialog {text: 'Set default blend mode',alignChildren:['fill','top']}"),
        bnNotifier = w.add("button {text: 'Enable default blend mode'}"),
        dl = w.add("dropdownlist"),
        gTypes = w.add("panel {orientation:'column', alignChildren:['left', 'center'], text: 'Apply to: ', margins:[10,15,10,10]}"),
        gButtons = w.add("group {alignChildren:['center', 'center']}"),
        bnOk = gButtons.add("button {text:'Save settings'}", undefined, undefined, { name: "ok" }),
        bnCancel = gButtons.add("button {text:'Cancel'}", undefined, undefined, { name: "cancel" }),
        evt = new Events(),
        modesList = [];
    for (var k in blendModes) modesList[blendModes[k].idx] = blendModes[k].label;
    var i = 0;
    for (var k in layerKinds) {
        var ch = gTypes.add("checkbox{text:'" + layerKinds[k] + "'}")
        ch.value = cfg.layerKind[i];
        ch.itemIndex = i++;
        ch.onClick = function () { cfg.layerKind[this.itemIndex] = this.value; };
    }
    bnNotifier.onClick = function () {
        cfg.enabled = !cfg.enabled
        setEnabledButtonValue()
    }
    bnOk.onClick = function () {
        cfg.putScriptSettings()
        evt.removeEvents()
        if (cfg.enabled) evt.addEvents()
        w.close()
    }
    dl.onChange = function () {
        if (w.visible) cfg.currentMode = this.selection.index
    }
    w.onShow = function () {
        fillList()
        cfg.enabled = evt.checkEvents();
        setEnabledButtonValue()
    }
    function fillList(selection) {
        dl.removeAll()
        for (var i = 0; i < modesList.length; i++) dl.add('item', ' ' + modesList[i])
        dl.selection = cfg.currentMode
    }
    function setEnabledButtonValue() {
        bnNotifier.text = cfg.enabled ? 'Disable default blend mode' : 'Enable default blend mode'
        bnNotifier.graphics.foregroundColor = cfg.enabled ? bnNotifier.graphics.newPen(bnNotifier.graphics.PenType.SOLID_COLOR, [1, 0, 0, 1], 1) : bnNotifier.graphics.newPen(bnNotifier.graphics.PenType.SOLID_COLOR, [0, 0.8, 0, 1], 1)
    }
    w.show()
}
function AM(target) {
    var s2t = stringIDToTypeID,
        t2s = typeIDToStringID;
    target = target ? s2t(target) : null;
    this.getProperty = function (property, id, idxMode) {
        r = new ActionReference();
        if (property) {
            property = s2t(property);
            r.putProperty(s2t('property'), property);
        }
        id != undefined ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id)) :
            r.putEnumerated(target, s2t('ordinal'), s2t('targetEnum'));
        try { return property ? getDescValue(executeActionGet(r), property) : executeActionGet(r) } catch (e) { return null }
    }
    this.hasProperty = function (property, id, idxMode) {
        property = s2t(property);
        (r = new ActionReference()).putProperty(s2t('property'), property);
        id ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id))
            : r.putEnumerated(target, s2t('ordinal'), s2t('targetEnum'));
        try { return executeActionGet(r).hasKey(property) } catch (e) { return false }
    }
    this.setBlendMode = function (mode) {
        (r = new ActionReference()).putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
        (d = new ActionDescriptor()).putReference(s2t('target'), r);
        (d1 = new ActionDescriptor()).putEnumerated(s2t('mode'), s2t('blendMode'), s2t(mode));
        d.putObject(s2t('to'), s2t('layer'), d1);
        try { executeAction(s2t('set'), d, DialogModes.NO) } catch (e) { };
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
    var f = new File(app.preferencesFolder + '/DefaultBlendMode.desc');
    this.enabled = false
    this.currentMode = 0
    this.layerKind = [true, false, false, false, false, false, false, false, false, false, false]
    this.getScriptSettings = function () {
        var d = null;
        try {
            var d = new ActionDescriptor();
            if (f.exists) {
                f.open('r')
                f.encoding = 'BINARY'
                var s = f.read()
                f.close();
                d.fromStream(s);
            }
        } catch (e) { }
        if (d) {
            for (var i = 0; i < d.count; i++) {
                k = d.getKey(i);
                switch (d.getType(k)) {
                    case DescValueType.BOOLEANTYPE: this[t2s(k)] = d.getBoolean(k); break;
                    case DescValueType.INTEGERTYPE: this[t2s(k)] = d.getInteger(k); break;
                    case DescValueType.LISTTYPE:
                        var l = d.getList(k),
                            result = [];
                        for (var x = 0; x < l.count; x++) {
                            switch (l.getType(x)) {
                                case DescValueType.BOOLEANTYPE: result.push(l.getBoolean(x)) break;
                            }
                        }
                        this[t2s(k)] = result;
                        break;
                }
            }
        }
    }
    this.putScriptSettings = function () {
        var d = new ActionDescriptor;
        for (var i = 0; i < this.reflect.properties.length; i++) {
            var k = this.reflect.properties[i].toString();
            if (k == '__proto__' || k == '__count__' || k == '__class__' || k == 'reflect') continue;
            var v = this[k];
            k = s2t(k);
            switch (typeof (v)) {
                case 'boolean': d.putBoolean(k, v); break;
                case 'number': d.putInteger(k, v); break;
                case 'object':
                    if (v instanceof Array) {
                        var l = new ActionList();
                        for (var x = 0; x < v.length; x++) {
                            switch (typeof (v[x])) {
                                case 'boolean': l.putBoolean(v[x]); break;
                            }
                        }
                        d.putList(k, l)
                    }
                    break;
            }
        }
        try {
            f.open('w')
            f.encoding = 'BINARY'
            f.write(d.toStream())
            f.close()
        } catch (e) { }
    }
}
function Events() {
    var f = File($.fileName);
    this.addEvents = function () {
        app.notifiersEnabled = true
        if (cfg.layerKind[0]) { app.notifiers.add('Mk  ', f, 'Lyr '); app.notifiers.add('Mk  ', f, 'Dcmn') }
        if (cfg.layerKind[1]) app.notifiers.add('Mk  ', f, 'AdjL')
        if (cfg.layerKind[2]) app.notifiers.add('Mk  ', f, 'TxLr')
        if (cfg.layerKind[3] || cfg.layerKind[8] || cfg.layerKind[9] || cfg.layerKind[10]) app.notifiers.add('Mk  ', f, 'contentLayer')
        if (cfg.layerKind[4] || cfg.layerKind[5] || cfg.layerKind[7]) { app.notifiers.add('newPlacedLayer', f); app.notifiers.add('placeEvent', f) }
        if (cfg.layerKind[6]) app.notifiers.add('Mk  ', f, 'layerSection')
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