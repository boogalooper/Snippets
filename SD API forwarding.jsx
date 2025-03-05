#target photoshop

/*
// BEGIN__HARVEST_EXCEPTION_ZSTRING
<javascriptresource> 
<name>SD API forwarding</name> 
<eventid>32190faf-82e5-495b-918a-1f52d3029ec1</eventid>
</javascriptresource>
// END__HARVEST_EXCEPTION_ZSTRING
*/
var apl = new AM('application'),
    doc = new AM('document'),
    lr = new AM('layer'),
    s2t = stringIDToTypeID,
    t2s = typeIDToStringID,
    UUID = 'b152e0e3-821d-421f-8b8a-af570f6aaedb',
    cfg = new Config(),
    strength = cfg.getScriptSettings(),
    runMode = false;

try { runMode = (app.playbackParameters.count ? true : false) } catch (e) { }

if (apl.getProperty('numberOfDocuments')) {
    if (lr.getProperty('name') == 'SD' & lr.getProperty('hasUserMask')) {
        doc.makeSelectionFromChannel()
        doc.deleteCurrentLayer()
    }
    if (doc.hasProperty('selection')) {
        var result = true
        if (!strength || runMode) {
            strength = 0.22
            result = dialogWindow()
        }
        if (result) {
            var b = doc.descToObject(doc.getProperty('selection').value),
                w = Math.round((b.right - b.left) / 8) * 8,
                h = Math.round((b.bottom - b.top) / 8) * 8;

            if (w != (b.right - b.left) || hst != (b.bottom - b.top)) {
                doc.makeSelection(b.top, b.left, b.top + h, b.left + w);
            }
            var hst = activeDocument.activeHistoryState;

            doc.copyToLayer()
            doc.convertActiveLayerToSmartObject()
            doc.editSmartObject()
            var f = new File(Folder.temp + '/SDH.jpg');
            doc.saveACopy(f);
            doc.closeDocument();
            activeDocument.activeHistoryState = hst;

            fl = File(Folder.temp + '/SD_vbs_init.vbs')
            fl.open("w");
            fl.encoding = "text";
            fl.writeln('Set WshShell = CreateObject("WScript.Shell")')
            fl.writeln('WshShell.Run "d:\\Макеты\\_Скрипты\\Settings\\sd-webui-img2img-api.pyw ""' + f.fsName.replace('\\', '\\\\') + '"" ' + '""c:\\Users\\Dmitry\\stable-diffusion-webui\\outputs\\img2img-images"" ' + w + ' ' + h + ' ' + strength + '"')
            fl.close()
            fl.execute()
            $.sleep(300)
            fl.remove()
        }
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
    this.convertActiveLayerToSmartObject = function () {
        executeAction(s2t('newPlacedLayer'), undefined, DialogModes.NO)
    }

    this.editSmartObject = function () {
        executeAction(s2t('placedLayerEditContents'), undefined, DialogModes.NO)
    }

    this.copyToLayer = function () {
        executeAction(s2t('copyToLayer'), undefined, DialogModes.NO);
    }

    this.flatten = function () {
        executeAction(s2t("flattenImage"), undefined, DialogModes.NO);
    }
    this.crop = function (del) {
        (d = new ActionDescriptor()).putBoolean(s2t("delete"), del);
        executeAction(s2t("crop"), d, DialogModes.NO);
    }
    this.saveACopy = function (pth) {
        (d1 = new ActionDescriptor()).putInteger(s2t("extendedQuality"), 12);
        d1.putEnumerated(s2t("matteColor"), s2t("matteColor"), s2t("none"));
        (d = new ActionDescriptor()).putObject(s2t("as"), s2t("JPEG"), d1);
        d.putPath(s2t("in"), pth);
        executeAction(s2t("save"), d, DialogModes.NO);
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
    this.closeDocument = function (save) {
        save = save != true ? s2t('no') : s2t('yes');
        (d = new ActionDescriptor()).putEnumerated(s2t('save'), s2t('yesNo'), save);
        executeAction(s2t('close'), d, DialogModes.NO);
    }
    this.deleteCurrentLayer = function () {
        (r = new ActionReference()).putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        executeAction(s2t('delete'), d, DialogModes.NO);
    }

    this.makeSelectionFromChannel = function () {
        (r = new ActionReference()).putProperty(s2t('channel'), s2t('selection'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        (r1 = new ActionReference()).putEnumerated(s2t('channel'), s2t('channel'), s2t("transparencyEnum"));
        d.putReference(s2t('to'), r1);
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

function dialogWindow() {
    var w = new Window("dialog {text: 'Set SD strength',alignChildren:['fill','top']}"),
        text = w.add('statictext'),
        slider = w.add("slider {minvalue:0, maxvalue:50, value:" + strength * 100 + ", preferredSize:[500,-1] }"),
        g = w.add("group {alignChildren:['center', 'center']}"),
        bnOk = g.add("button {text:'Ok'}"),
        cancelled = true;

    slider.active = true
    slider.onChanging = function () {
        bnOk.text = strength = Math.round(this.value, 2) / 100
    }
    slider.addEventListener('keydown', function () { slider.onChanging() })

    bnOk.onClick = function () {
        cfg.putScriptSettings(strength)
        cancelled = false;
        w.close()
    }
    w.onShow = function () {
        var b = doc.descToObject(doc.getProperty('selection').value),
            w = b.right - b.left,
            h = b.bottom - b.top;

        bnOk.text = strength
        text.text = 'Selection size: ' + w + 'x' + h
    }
    w.show()
    return cancelled ? false : true
}

function Config() {
    this.getScriptSettings = function () {
        var d = new ActionDescriptor();
        try { d = getCustomOptions(UUID) } catch (e) { }
        if (d.count) {
            return d.getDouble(s2t('strength'));
        }
        return false
    }
    this.putScriptSettings = function (strength) {
        var d = new ActionDescriptor();
        d.putDouble(s2t('strength'), strength)
        putCustomOptions(UUID, d, false);
    }
}
