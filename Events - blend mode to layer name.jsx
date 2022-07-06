/**Option to automatically name /color code layers based on the layer's blending mode
 * https://community.adobe.com/t5/photoshop-ecosystem-ideas/option-to-automatically-name-color-code-layers-based-on-the-layer-s-blending-mode/idi-p/13027957
 * https://www.youtube.com/watch?v=q_8pu5QlTxU
 */
/*
<javascriptresource>
<name>Blending mode labels</name>
</javascriptresource>
*/
var UUID = 'b7fae3e4-9edd-4a67-888a-349bda8dfa3c',
    s2t = stringIDToTypeID,
    t2s = typeIDToStringID,
    cfg = new Config();
const colorLabels = {
    none: { img: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x06\x00\x00\x00\u008D2\u00CF\u00BD\x00\x00\x00\u00CEIDAT\x18\u0095\u008D\u0090A\x0BE@\x14\u0085\u00CFLS\u00A2,D6~\u0083R\u00CAF\u00E4WS\u0094\u0094\u00C8N\u00F9\x19R\u00D6\x12^s\u00DF3\u00CF\u00EA\u00F5NM3\u00E7\u00CE\u0099\u00B9_\u0097\x15Eq\u00E1\x0F\t\x19\t\u0082\x00\u00D7uA\bA\u00FBS\u00D2\u008F\u00E3\b\u008E\u008F\x19\u0086\x01\u0086a\u00C0u]Z\u009A\u00A6\u00A1\u00EB:\u00F5\u0090\u0082\u009CsDQ\u0084\u00B2,\u00B1m\x1B\u00D6uE]\u00D7H\u0092\x04\u008C1\nRk)\u00CF\u00F3\u00E0\u00FB>\u00F2<'\x1F\u00C71\x1C\u00C7\u00C1<\u00CF\u00DF\x1Fo\u0099\u00A6\u00A9\u00CE\x12\u00E3)\u00C5\u00B8,\x0B\u00FA\u00BEG\u009A\u00A6\b\u00C3\x10UU\x11\u00C2-j-9\u00DA\u00B6E\u0096e\u00B0,\x0B\u00B6mC\u00D7u4MC\b\u00F2\u009E\u0082\u00C7qPa\u00DFw\u00C5ts\u009E\u00E7\u00F9\x1E\u009D,L\u00D3\u00F4{\u00E2\x00^\u00D6\u0089Tf\u00E31\u0087\u00CC\x00\x00\x00\x00IEND\u00AEB`\u0082", label: localize("$$$/Menu/Buzzwords/LayerColorNone=No Color") },
    red: { img: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x06\x00\x00\x00\u008D2\u00CF\u00BD\x00\x00\x00;IDAT\x18\u0095c\u00FCci\u00F3\u009F\u0081\b\u00C0\x02R\u00C2((\u0084W\u00E5\u00FF\u00F7\u00EF \n\u00C1\u0080\u0087\x17\u00BB\u00AA/\u009F\u00C1\x14\x131\u00D6\x0E\x15\u0085\b_C}\u0087W!(\u009C\u00F0\x02\x06\x06\x06\x00\x18\u00EF\fO\u0083\b\u00CC\u00FD\x00\x00\x00\x00IEND\u00AEB`\u0082", label: localize("$$$/Menu/Buzzwords/LayerColorRed=Red") },
    orange: { img: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x06\x00\x00\x00\u008D2\u00CF\u00BD\x00\x00\x00=IDAT\x18\u0095c\u00FC\u00D2\u00A1\u00FA\u009F\u0081\b\u00C0\x02R\u00C2$\u00C8\u008DW\u00E5\u00BF\u00F7_!\nA\u0080\u0091\u0097\x03\u00AB\u00A2\u00FF\u009F\x7F\u0080i&b\u00AC\x1D*\n\u00E1\u00BE\u0086\u00F9\x0E\u00AFBP8\u00E1\x05\f\f\f\x00\u00D6!\x0E\u0088\x06d\u00F3\x07\x00\x00\x00\x00IEND\u00AEB`\u0082", label: localize("$$$/Menu/Buzzwords/LayerColorOrange=Orange") },
    yellowColor: { img: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x06\x00\x00\x00\u008D2\u00CF\u00BD\x00\x00\x00;IDAT\x18\u0095c\u00FCp@\u00ED?\x03\x11\u0080\x05\u00A4\u0084\u0089\u0093\x1B\u00AF\u00CA\x7F\u00DF\u00BFB\x14\u0082\x15\u00B3s`W\u00F4\u00F3\x07D\u009E\x18k\u0087\u008AB\u00B8\u00AFa\u00BE\u00C3\u00AB\x10\x14Nx\x01\x03\x03\x03\x00+\u00AA\x0E\u00CA*\u0090\u00C3\u00A2\x00\x00\x00\x00IEND\u00AEB`\u0082", label: localize("$$$/Menu/Buzzwords/LayerColorYellow=Yellow") },
    green: { img: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x06\x00\x00\x00\u008D2\u00CF\u00BD\x00\x00\x00=IDAT\x18\u0095c\u00F4\u00DEo\u00F8\u009F\u0081\b\u00C0\x02R\"\u00C6\u00C9\u008FW\u00E5\u00AB\u00EF\x1F!\nA@\u0090\u009D\x1B\u00AB\u00A2\u00F7?\u00BF\u0082i&b\u00AC\x1D*\n\u00E1\u00BE\u0086\u00F9\x0E\u00AFBP8\u00E1\x05\f\f\f\x000\x1F\x0E\x05z4V\u0094\x00\x00\x00\x00IEND\u00AEB`\u0082", label: localize("$$$/Menu/Buzzwords/LayerColorGreen=Green") },
    blue: { img: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x06\x00\x00\x00\u008D2\u00CF\u00BD\x00\x00\x00=IDAT\x18\u0095c4\u0099\u00F7\u00E1?\x03\x11\u0080\x05\u00A4D\u0080\u009F\t\u00AF\u00CA\x0F\x1F\u00FFA\x14\u0082\x007\x17v\u00C5_\u00BF\u00FD\x03\u00D3\u00F8\u008DB\x02CA!\u00DC\u00D70\u00DF\u00E1U\b\n'\u00BC\u0080\u0081\u0081\x01\x00\b\u00DD\x0E\u00A5\x7F\u00E7e\u008B\x00\x00\x00\x00IEND\u00AEB`\u0082", label: localize("$$$/Menu/Buzzwords/LayerColorBlue=Blue") },
    violet: { img: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x06\x00\x00\x00\u008D2\u00CF\u00BD\x00\x00\x00=IDAT\x18\u0095c\u00DC\x1Fv\u00FD?\x03\x11\u0080\x05\u00A4\u0084S\u0092\r\u00AF\u00CA\u00EF\u00CF\x7FA\x14\u0082\x00\u00BB\x10\x0BVE?\u00DF\u00FD\x01\u00D3L\u00C4X;T\x14\u00C2\u00BD\n\u00F3\x1D^\u0085\u00A0p\u00C2\x0B\x18\x18\x18\x00KM\x0E\u00C2\u00AA\x19\u00A8d\x00\x00\x00\x00IEND\u00AEB`\u0082", label: localize("$$$/Menu/Buzzwords/LayerColorViolet=Violet") },
    gray: { img: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x06\x00\x00\x00\u008D2\u00CF\u00BD\x00\x00\x00=IDAT\x18\u0095clk\u00EB\u00FC\u00CF@\x04`\x01)\x11\x12\x12\u00C4\u00AB\u00F2\u00DD\u00BB\u00F7\x10\u0085 \u00C0\u00CB\u00CB\u008BU\u00D1\u00E7\u00CF\u009F\u00C14\x131\u00D6\x0E\x15\u0085p_\u00C3|\u0087W!(\u009C\u00F0\x02\x06\x06\x06\x00\u00BE\u00A9\x0ET.#\u00D2&\x00\x00\x00\x00IEND\u00AEB`\u0082", label: localize("$$$/Menu/Buzzwords/LayerColorGray=Gray") },
},
    blendModes = {
        passThrough: { label: localize("$$$/Menu/TransferMode/PassThrough=Pass Through"), idx: 0 },
        normal: { label: localize("$$$/Menu/TransferMode/Normal=Normal"), idx: 1 },
        dissolve: { label: localize("$$$/Menu/TransferMode/Dissolve=Dissolve"), idx: 2 },
        darken: { label: localize("$$$/Menu/TransferMode/Darken=Darken"), idx: 3 },
        multiply: { label: localize("$$$/Menu/TransferMode/Multiply=Multiply"), idx: 4 },
        colorBurn: { label: localize("$$$/Menu/TransferMode/ColorBurn=Color Burn"), idx: 5 },
        linearBurn: { label: localize("$$$/Menu/TransferMode/LinearBurn=Linear Burn"), idx: 6 },
        darkerColor: { label: localize("$$$/Menu/TransferMode/DarkerColor=Darker Color"), idx: 7 },
        lighten: { label: localize("$$$/Menu/TransferMode/Lighten=Lighten"), idx: 8 },
        screen: { label: localize("$$$/Menu/TransferMode/Screen=Screen"), idx: 9 },
        colorDodge: { label: localize("$$$/Menu/TransferMode/ColorDodge=Color Dodge"), idx: 10 },
        linearDodge: { label: localize("$$$/Menu/TransferMode/LinearDodge=Linear Dodge (Add)").replace(/ ?\(.+\)/, ''), idx: 11 },
        lighterColor: { label: localize("$$$/Menu/TransferMode/LighterColor=Lighter Color"), idx: 12 },
        overlay: { label: localize("$$$/Menu/TransferMode/Overlay=Overlay"), idx: 13 },
        softLight: { label: localize("$$$/Menu/TransferMode/SoftLight=Soft Light"), idx: 14 },
        hardLight: { label: localize("$$$/Menu/TransferMode/HardLight=Hard Light"), idx: 15 },
        vividLight: { label: localize("$$$/Menu/TransferMode/VividLight=Vivid Light"), idx: 16 },
        linearLight: { label: localize("$$$/Menu/TransferMode/LinearLight=Linear Light"), idx: 17 },
        pinLight: { label: localize("$$$/Menu/TransferMode/PinLight=Pin Light"), idx: 18 },
        hardMix: { label: localize("$$$/Menu/TransferMode/HardMix=Hard Mix"), idx: 19 },
        difference: { label: localize("$$$/Menu/TransferMode/Difference=Difference"), idx: 20 },
        exclusion: { label: localize("$$$/Menu/TransferMode/Exclusion=Exclusion"), idx: 21 },
        blendSubtraction: { label: localize("$$$/Menu/TransferMode/Subtraction=Subtract"), idx: 22 },
        blendDivide: { label: localize("$$$/Menu/TransferMode/Division=Divide"), idx: 23 },
        hue: { label: localize("$$$/Menu/TransferMode/Hue=Hue"), idx: 24 },
        saturation: { label: localize("$$$/Menu/TransferMode/Saturation=Saturation"), idx: 25 },
        color: { label: localize("$$$/Menu/TransferMode/Color=Color"), idx: 26 },
        luminosity: { label: localize("$$$/Menu/TransferMode/Luminosity=Luminosity"), idx: 27 }
    };
try {
    var target = arguments[0],
        evt = t2s(arguments[1]);
    if (evt == 'make' || target.getObjectValue(s2t('to')).hasKey(s2t('mode'))) {
        cfg.getScriptSettings()
        activeDocument.suspendHistory('Set blending mode labels', 'makeLabels()')
    }
} catch (e) { }
if (!target) {
    dialogWindow();
}
function dialogWindow() {
    var w = new Window("dialog {text: 'Blend mode labels',alignChildren:['fill','top']}"),
        bnNotifier = w.add("button {text: 'Enable blend mode labels'}"),
        chLabels = w.add("checkbox {text: 'use color labels'}"),
        l = w.add("listbox", undefined, undefined, { multiselect: true }),
        chGroups = w.add("checkbox {text: 'ignore layer sections (groups and artboars)'}"),
        bnCurrentDocument = w.add("button {text: 'Force labels for active document'}"),
        g = w.add("group {alignChildren:['center', 'center']}"),
        bnOk = g.add("button {text:'Save settings'}", undefined, undefined, { name: "ok" }),
        bnCancel = g.add("button {text:'Cancel'}", undefined, undefined, { name: "cancel" }),
        modesList = [],
        evt = new Events();
    for (var k in blendModes) modesList[blendModes[k].idx] = blendModes[k].label;
    l.preferredSize = [250, 500]
    bnNotifier.onClick = function () {
        cfg.enabled = !cfg.enabled
        setEnabledButtonValue()
    }
    chLabels.onClick = function () {
        cfg.setLabels = this.value
        fillList()
    }
    chGroups.onClick = function () {
        cfg.skipSections = this.value
        fillList()
    }
    bnOk.onClick = function () {
        cfg.putScriptSettings()
        cfg.putScriptSettings(true)
        evt.removeEvents()
        if (cfg.enabled) evt.addEvents()
        w.close()
    }
    bnCurrentDocument.onClick = function () {
        activeDocument.suspendHistory('Set blending mode labels', 'makeLabels(true)')
    }
    l.onDoubleClick = function () {
        if (l.selection) {
            var selection = [],
                targetColor,
                targetMode = 0,
                offset = Number(cfg.skipSections);
            for (var i = 0; i < l.items.length; i++) {
                var currentSelection = l.items[i].selected
                selection.push(currentSelection)
                if (currentSelection && targetColor == undefined) targetColor = cfg.colorsList[i + offset]
                if (currentSelection) targetMode += cfg.modesEnabled[i + offset] ? 1 : -1
            }
            if (result = setLabel(targetColor, targetMode)) {
                for (var i = 0; i < cfg.colorsList.length; i++) {
                    if (selection[i]) {
                        if (cfg.setLabels && result.color) cfg.colorsList[i + offset] = result.color
                        cfg.modesEnabled[i + offset] = result.enabled
                    }
                }
                fillList(selection)
            }
        }
    }
    l.addEventListener('mouseup', eventHandler);
    l.addEventListener('mousedown', eventHandler);
    function eventHandler(h) {
        if (h.button == 2 && h.type == 'mouseup') {
            if (l.selection) {
                var offset = Number(cfg.skipSections);
                for (var i = 0; i < l.items.length; i++) {
                    if (l.items[i].selected) l.items[i].checked = l.items[i].enabled = !l.items[i].checked
                    cfg.modesEnabled[i + offset] = l.items[i].checked;
                }
            }
        } else if (h.button == 0 && h.type == 'mousedown') {
            if (l.selection) {
                var offset = Number(cfg.skipSections);
                for (var i = 0; i < l.items.length; i++) {
                    l.items[i].enabled = l.items[i].selected ? true : cfg.modesEnabled[i + offset];
                }
            }
        }
    }
    w.onShow = function () {
        cfg.getScriptSettings(true)
        fillList()
        chLabels.value = cfg.setLabels
        chGroups.value = cfg.skipSections
        cfg.enabled = evt.checkEvents();
        bnCurrentDocument.enabled = (new AM('application')).getProperty('numberOfDocuments')
        setEnabledButtonValue()
    }
    function fillList(selection) {
        l.removeAll()
        offset = Number(cfg.skipSections)
        for (var i = 0; i < modesList.length - offset; i++) {
            l.add('item', ' ' + modesList[offset + i])
            if (cfg.setLabels) l.items[i].image = colorLabels[cfg.colorsList[offset + i]].img
            l.items[i].checked = l.items[i].enabled = cfg.modesEnabled[offset + i]
            if (selection && selection[i]) l.items[i].selected = true
        }
    }
    function setEnabledButtonValue() {
        bnNotifier.text = cfg.enabled ? 'Disable blend mode labels' : 'Enable blend mode labels'
        bnNotifier.graphics.foregroundColor = cfg.enabled ? bnNotifier.graphics.newPen(bnNotifier.graphics.PenType.SOLID_COLOR, [1, 0, 0, 1], 1) : bnNotifier.graphics.newPen(bnNotifier.graphics.PenType.SOLID_COLOR, [0, 0.8, 0, 1], 1)
    }
    function setLabel(selection, enabled) {
        var w = new Window("dialog{text: 'Set label options', orientation: 'column', alignChildren: ['fill', 'top']}"),
            chEnabled = w.add("checkbox {text: 'enabled'}"),
            dl = w.add('dropdownlist{preferredSize: [120, -1]}'),
            g = w.add("group{orientation: 'row', alignChildren: ['left', 'center']}"),
            ok = g.add("button", undefined, 'Save', { name: "ok" }),
            cancel = g.add("button", undefined, 'Cancel', { name: "cancel" }),
            result = null;
        dl.enabled = cfg.setLabels
        ok.onClick = function () {
            var newLabel = dl.selection.text.replace(/^ /, '')
            for (var k in colorLabels) {
                if (colorLabels[k].label == newLabel) {
                    result = { color: k, enabled: chEnabled.value }
                    break;
                }
            }
            if (result == null) result = { color: null, enabled: chEnabled.value }
            w.close()
        }
        w.onShow = function () {
            var i = 0;
            for (var k in colorLabels) {
                dl.add('item', ' ' + colorLabels[k].label)
                dl.items[i++].image = colorLabels[k].img
            }
            dl.add('item', 'Do not change color')
            dl.selection = dl.find(' ' + colorLabels[selection].label)
            chEnabled.value = enabled >= 0 ? true : false;
            if (!cfg.setLabels) dl.selection.text = 'Do not change color'
        }
        w.show();
        return result
    }
    w.show()
}
function makeLabels(wholeDocument) {
    var lr = new AM('layer'),
        doc = new AM('document'),
        selection = doc.getProperty('targetLayersIDs'),
        targetLayers = getTargetIDs();
    if (targetLayers.length) {
        for (var i = 0; i < targetLayers.length; i++) {
            var mode = lr.getProperty('mode', targetLayers[i]).value,
                label = blendModes[mode].label,
                layerName = lr.getProperty('name', targetLayers[i]);
            if (label) {
                var nm = layerName.replace(RegExp(findPreviousTag(blendModes, layerName) + ' ?'), '');
                lr.setLayerName(cfg.modesEnabled[blendModes[mode].idx] ? label + ' ' + nm : nm, targetLayers[i]);
                if (cfg.setLabels) {
                    lr.selectLayerByIDList([targetLayers[i]])
                    lr.setColor(cfg.modesEnabled[blendModes[mode].idx] ? cfg.colorsList[blendModes[mode].idx] : 'none')
                    if (selection) {
                        var ids = [];
                        for (var x = 0; x < selection.count; x++) ids.push(selection.getReference(x).getIdentifier(s2t('layerID')));
                        lr.selectLayerByIDList(ids)
                    }
                }
            }
        }
    }
    function getTargetIDs() {
        var output = [];
        if (wholeDocument) {
            var len = doc.getProperty('numberOfLayers');
            for (var i = 1; i <= len; i++) {
                var layerSection = lr.getProperty('layerSection', i, true).value
                if (layerSection == 'layerSectionStart' && cfg.skipSections) continue;
                if (layerSection == 'layerSectionEnd') continue;
                output.push(lr.getProperty('layerID', i, true))
            }
        } else {
            if (selection) {
                for (var i = 0; i < selection.count; i++) {
                    var id = selection.getReference(i).getIdentifier(s2t('layerID')),
                        layerSection = lr.getProperty('layerSection', id).value;
                    if (layerSection == 'layerSectionStart' && cfg.skipSections) continue;
                    if (layerSection == 'layerSectionEnd') continue;
                    output.push(lr.getProperty('layerID', id))
                }
            }
        }
        return output;
    }
    function findPreviousTag(o, s) {
        for (var k in o) if (s.indexOf(o[k].label) == 0) return o[k].label
        return ''
    }
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
    this.selectLayerByIDList = function (IDList) {
        var r = new ActionReference()
        for (var i = 0; i < IDList.length; i++) {
            r.putIdentifier(s2t('layer'), IDList[i])
        }
        (d = new ActionDescriptor()).putReference(s2t('target'), r);
        d.putBoolean(s2t('makeVisible'), false);
        executeAction(s2t('select'), d, DialogModes.NO);
    }
    this.setColor = function (color) {
        (r = new ActionReference()).putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
        (d = new ActionDescriptor()).putReference(s2t('target'), r);
        (d1 = new ActionDescriptor()).putEnumerated(s2t('color'), s2t('color'), s2t(color));
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
    this.setLayerName = function (s, id) {
        var r = new ActionReference();
        if (id) r.putIdentifier(s2t('layer'), id) else r.putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
        (d = new ActionDescriptor()).putReference(s2t('target'), r);
        (d1 = new ActionDescriptor()).putString(s2t('name'), s);
        d.putObject(s2t('to'), s2t('layer'), d1);
        executeAction(s2t('set'), d, DialogModes.NO);
    }
}
function Config() {
    var f = new File(app.preferencesFolder + '/BlendModeLabels.desc');
    this.enabled = false
    this.setLabels = true
    this.skipSections = true
    this.colorsList = ['none', 'none', 'none', 'red', 'red', 'red', 'red', 'red', 'orange', 'orange', 'orange', 'orange', 'orange', 'yellowColor', 'yellowColor', 'yellowColor', 'green', 'green', 'green', 'green', 'blue', 'blue', 'blue', 'blue', 'violet', 'violet', 'gray', 'gray']
    this.modesEnabled = [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true]
    this.getScriptSettings = function (fromFile) {
        var d = null;
        if (fromFile) {
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
        }
        else try { d = getCustomOptions(UUID) } catch (e) { }
        if (d) {
            for (var i = 0; i < d.count; i++) {
                k = d.getKey(i);
                switch (d.getType(k)) {
                    case DescValueType.BOOLEANTYPE: this[t2s(k)] = d.getBoolean(k); break;
                    case DescValueType.LISTTYPE:
                        var l = d.getList(k),
                            result = [];
                        for (var x = 0; x < l.count; x++) {
                            switch (l.getType(x)) {
                                case DescValueType.BOOLEANTYPE: result.push(l.getBoolean(x)) break;
                                case DescValueType.STRINGTYPE: result.push(l.getString(x)) break;
                            }
                        }
                        this[t2s(k)] = result;
                        break;
                }
            }
        }
    }
    this.putScriptSettings = function (toFile) {
        var d = new ActionDescriptor;
        for (var i = 0; i < this.reflect.properties.length; i++) {
            var k = this.reflect.properties[i].toString();
            if (k == '__proto__' || k == '__count__' || k == '__class__' || k == 'reflect') continue;
            var v = this[k];
            k = s2t(k);
            switch (typeof (v)) {
                case 'boolean': d.putBoolean(k, v); break;
                case 'object':
                    if (v instanceof Array) {
                        var l = new ActionList();
                        for (var x = 0; x < v.length; x++) {
                            switch (typeof (v[x])) {
                                case 'string': l.putString(v[x]); break;
                                case 'boolean': l.putBoolean(v[x]); break;
                            }
                        }
                        d.putList(k, l)
                    }
                    break;
            }
        }
        if (toFile) {
            try {
                f.open('w')
                f.encoding = 'BINARY'
                f.write(d.toStream())
                f.close()
            } catch (e) { }
        } else putCustomOptions(UUID, d)
    }
}
function Events() {
    var f = File($.fileName);
    this.addEvents = function () {
        app.notifiersEnabled = true
        app.notifiers.add('setd', f, 'Lyr ')
        app.notifiers.add('Mk  ', f, 'Lyr ')
        app.notifiers.add('Mk  ', f, 'contentLayer')
        app.notifiers.add('Mk  ', f, 'AdjL')
        app.notifiers.add('Mk  ', f, 'Chnl')
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