/**
 * I want to script multiple tweaks to create multiple jpgs with the different tweaks applied.
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/i-want-to-script-multiple-tweaks-to-create-multiple-jpgs-with-the-different-tweaks-applied/td-p/15407958
 */

s2t = stringIDToTypeID;
var apl = new AM('application'),
    doc = new AM('document'),
    lr = new AM('layer'),
    adjustments = {
        'Brightness/Contrast': { brightness: 100, contrast: 100, option: 'useLegacy' },
        'Hue/Saturation': { hue: 180, lightness: 100, saturation: 100 }
    }
if (apl.getProperty('numberOfDocuments')) {
    showDialog(adjustments);
}
function showDialog(p) {
    var w = new Window('dialog{text:"Script settings",orientation:"column",alignChildren:["fill","top"]}'),
        grMode = w.add('group{orientation:"row"}'),
        dlMode = grMode.add('dropdownlist{preferredSize:[150,-1]}'),
        dlTarget = grMode.add('dropdownlist{preferredSize:[150,-1]}'),
        grFrom = w.add('group{preferredSize:[300,-1],orientation:"row",alignChildren:["left","center"]}'),
        stFrom = grFrom.add('statictext{text:"From",preferredSize:[50,-1]}'),
        slFrom = grFrom.add('slider{preferredSize:[200,-1]}'),
        stFromValue = grFrom.add('statictext{preferredSize:[35,-1],justify:"right"}'),
        grTo = w.add('group{preferredSize:[300,-1],orientation:"row",alignChildren:["left","center"]}'),
        stTo = grTo.add('statictext{text:"To",preferredSize:[50,-1]}'),
        slTo = grTo.add('slider{preferredSize:[200,-1]}'),
        stToValue = grTo.add('statictext{preferredSize:[35,-1],justify:"right"}'),
        grStep = w.add('group{preferredSize:[300,-1],orientation:"row",alignChildren:["left","center"]}'),
        stStep = grStep.add('statictext{text:"Step",preferredSize:[50,-1]}'),
        slStep = grStep.add('slider{preferredSize:[200,-1]}'),
        stStepValue = grStep.add('statictext{preferredSize:[35,-1],justify:"right"}'),
        chOptions = w.add('checkbox'),
        grBn = w.add('group{orientation:"row",alignChildren:["center","center"]}'),
        ok = grBn.add("button", undefined, "Save to folder...", { name: "ok" }),
        cancel = grBn.add("button", undefined, "Cancel", { name: "cancel" });
    slFrom.value = 0;
    slTo.value = 0;
    slStep.minvalue = 1;
    slStep.maxvalue = 20;
    slStep.value = 1;
    dlMode.onChange = function () {
        cur = p[this.selection.text];
        do { dlTarget.remove(dlTarget.items[0]) } while (dlTarget.items.length)
        for (a in cur) if (a != 'option') dlTarget.add('item', a)
        dlTarget.selection = 0;
        if (cur['option']) chOptions.text = chOptions.visible = cur['option'] else chOptions.visible = false
    }
    dlTarget.onChange = function () {
        updateSliders(p[dlMode.selection.text][this.selection.text])
    }
    w.onShow = function () {
        for (a in p) dlMode.add('item', a)
        dlMode.selection = 0
    }
    function updateSliders(cur) {
        if (cur) {
            slFrom.minvalue = slTo.minvalue = -cur;
            slFrom.maxvalue = slTo.maxvalue = cur;
        }
        stFromValue.text = parseInt(slFrom.value)
        stToValue.text = parseInt(slTo.value)
        stStepValue.text = parseInt(slStep.value)
        ok.enabled = (slFrom.value != slTo.value)
    }
    ok.onClick = function () {
        var f = ((new Folder).selectDlg());
        if (f) {
            w.close()
            var title = doc.getProperty('title').replace(/\..+$/, '');
            activeDocument.suspendHistory('Save Adjustments',
                "processFiles(f,\
                title,\
                dlMode.selection.text,\
                dlTarget.selection.text,\
                Math.min(parseInt(stFromValue.text), parseInt(stToValue.text)),\
                Math.max(parseInt(stFromValue.text), parseInt(stToValue.text)),\
                parseInt(slStep.value),\
                chOptions.value)")
        }
    }
    slFrom.addEventListener('keydown', sliderHandler)
    slTo.addEventListener('keydown', sliderHandler)
    slStep.addEventListener('keydown', sliderHandler)
    slFrom.addEventListener('changing', sliderHandler)
    slTo.addEventListener('changing', sliderHandler)
    slStep.addEventListener('changing', sliderHandler)
    function sliderHandler(evt) {
        evt.preventDefault();
        if (evt.keyIdentifier == 'Right' || evt.keyIdentifier == 'Up') {
            evt.target.value += slStep.value
        } else if (evt.keyIdentifier == 'Left' || evt.keyIdentifier == 'Down') {
            evt.target.value -= slStep.value
        }
        updateSliders()
    }
    w.show();
}
function processFiles(pth, title, mode, param, min, max, step, option) {
    switch (mode) {
        case 'Brightness/Contrast':
            doc.makeAdjustmentLayer('brightnessContrast')
            for (var i = min; i <= max; i += step) {
                for (a in adjustments[mode]) adjustments[mode][a] = a != param ? 0 : i
                lr.setBrightnessContrast(adjustments[mode]['brightness'], adjustments[mode]['contrast'], option)
                activeDocument.saveAs(File(pth + '/' + title + ' ' + param + ' ' + i), function () { var o = new JPEGSaveOptions; o.quality = 12; return o }(), true)
            }
            break;
        case 'Hue/Saturation':
            doc.makeAdjustmentLayer('hueSaturation')
            for (var i = min; i <= max; i += step) {
                for (a in adjustments[mode]) adjustments[mode][a] = a != param ? 0 : i
                lr.setHueSaturation(adjustments[mode]['hue'], adjustments[mode]['saturation'], adjustments[mode]['lightness'])
                activeDocument.saveAs(File(pth + '/' + title + ' ' + param + ' ' + i), function () { var o = new JPEGSaveOptions; o.quality = 12; return o }(), true)
            }
            break;
    }
    doc.restoreSelection();
    doc.removeAdjustmentLayer();
}
function AM(target, order) {
    var s2t = stringIDToTypeID,
        t2s = typeIDToStringID;
    target = target ? s2t(target) : null;
    this.getProperty = function (property, descMode, id, idxMode) {
        property = s2t(property);
        (r = new ActionReference).putProperty(s2t('property'), property);
        id != undefined ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id)) :
            r.putEnumerated(target, s2t('ordinal'), order ? s2t(order) : s2t('targetEnum'));
        return descMode ? executeActionGet(r) : getDescValue(executeActionGet(r), property);
    }
    this.hasProperty = function (property, id, idxMode) {
        property = s2t(property);
        (r = new ActionReference).putProperty(s2t('property'), property);
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
    this.makeAdjustmentLayer = function (type) {
        (r = new ActionReference()).putClass(s2t("adjustmentLayer"));
        (d = new ActionDescriptor()).putReference(s2t("null"), r);
        (d1 = new ActionDescriptor()).putObject(s2t("type"), s2t(type), new ActionDescriptor());
        d.putObject(s2t("using"), s2t("adjustmentLayer"), d1);
        executeAction(s2t("make"), d, DialogModes.NO);
    }
    this.setHueSaturation = function (hue, saturation, lightness) {
        (r = new ActionReference()).putEnumerated(s2t("adjustmentLayer"), s2t("ordinal"), s2t("targetEnum"));
        (d = new ActionDescriptor()).putReference(s2t("null"), r);
        (d1 = new ActionDescriptor()).putEnumerated(s2t("presetKind"), s2t("presetKindType"), s2t("presetKindCustom"));
        (d2 = new ActionDescriptor()).putEnumerated(s2t("channel"), s2t("channel"), s2t("composite"));
        d2.putInteger(s2t("hue"), hue);
        d2.putInteger(s2t("saturation"), saturation);
        d2.putInteger(s2t("lightness"), lightness);
        (l = new ActionList()).putObject(s2t("hueSatAdjustmentV2"), d2);
        d1.putList(s2t("adjustment"), l);
        d.putObject(s2t("to"), s2t("hueSaturation"), d1);
        executeAction(s2t("set"), d, DialogModes.NO);
    }
    this.setBrightnessContrast = function (brightness, contrast, useLegacy) {
        (r = new ActionReference()).putEnumerated(s2t("adjustmentLayer"), s2t("ordinal"), s2t("targetEnum"));
        (d = new ActionDescriptor()).putReference(s2t("null"), r);
        (d1 = new ActionDescriptor()).putInteger(s2t("brightness"), brightness);
        d1.putInteger(s2t("contrast"), contrast);
        d1.putBoolean(s2t("useLegacy"), useLegacy);
        d.putObject(s2t("to"), s2t("brightnessContrast"), d1);
        executeAction(s2t("set"), d, DialogModes.NO);
    }
    this.restoreSelection = function () {
        (r = new ActionReference()).putProperty(s2t("channel"), s2t("selection"));
        (d = new ActionDescriptor()).putReference(s2t("null"), r);
        (r1 = new ActionReference()).putEnumerated(s2t("channel"), s2t("ordinal"), s2t("targetEnum"));
        d.putReference(s2t("to"), r1);
        executeAction(s2t("set"), d, DialogModes.NO);
    }
    this.removeAdjustmentLayer = function () {
        (r = new ActionReference()).putEnumerated(s2t("layer"), s2t("ordinal"), s2t("targetEnum"));
        (d = new ActionDescriptor()).putReference(s2t("null"), r);
        executeAction(s2t("delete"), d, DialogModes.NO);
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