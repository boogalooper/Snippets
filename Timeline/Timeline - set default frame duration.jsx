/**
 * Video Timeline: How to set default frame duration when importing?
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/video-timeline-how-to-set-default-frame-duration-when-importing/m-p/13403104
 * https://youtu.be/Y_JoPV-xO7I
 */

#target photoshop
var UUID = '868e7426-b3ab-4dc4-9633-b1ed366de765',
    s2t = stringIDToTypeID,
    t2s = typeIDToStringID,
    cfg = new Config();
try {
    var args = arguments[0],
        evt = arguments[1];
} catch (e) { }
if (!args) {
    dialogWindow();
} else {
    var frames = cfg.getScriptSettings(),
        layers = [];
    if (t2s(evt) == 'addClipsToTimeline') {
        var numberOfClips = args.getList(s2t('filesList')).count;
        (r = new ActionReference()).putProperty(s2t('property'), p = s2t('itemIndex'));
        r.putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
        var startFrom = executeActionGet(r).getInteger(p);
        for (var i = 0; i < numberOfClips; i++) {
            (r = new ActionReference()).putProperty(s2t('property'), p = s2t('layerID'));
            r.putIndex(s2t('layer'), startFrom - i);
            layers.push(executeActionGet(r).getInteger(p));
        }
        (r = new ActionReference()).putProperty(s2t('property'), p = s2t('frameRate'));
        r.putClass(s2t('timeline'));
        var frameRate = executeActionGet(r).getDouble(p);
        doForcedProgress('Recalculate frame duration...', 'setFrameLength(layers,frames,frameRate)')
    } else {
        (r = new ActionReference()).putProperty(s2t('property'), p = s2t('frameRate'));
        r.putClass(s2t('timeline'));
        try {
            var frameRate = executeActionGet(r).getDouble(p);
            (r = new ActionReference()).putProperty(s2t('property'), p = s2t('numberOfLayers'));
            r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
            var len = executeActionGet(r).getInteger(p);
            for (var i = 1; i <= len; i++) {
                (r = new ActionReference()).putProperty(s2t('property'), p = s2t('layerKind'));
                r.putIndex(s2t('layer'), i);
                if (executeActionGet(r).getInteger(p) != 1) continue;
                (r = new ActionReference()).putProperty(s2t('property'), p = s2t('layerID'));
                r.putIndex(s2t('layer'), i);
                layers.push(executeActionGet(r).getInteger(p));
            }
            doForcedProgress('Recalculate frame duration...', 'setFrameLength(layers,frames,frameRate)')
        } catch (e) { }
    }
    if (layers) selectLayer(layers[0])
}
function dialogWindow() {
    var w = new Window("dialog {text: 'Video timeline tracking',alignChildren:['fill','top']}"),
        g = w.add("group {alignChildren:['fill', 'center']}"),
        st = g.add('statictext {text: "Set default frame duration:"}'),
        et = g.add('editnumber'),
        bnNotifier = w.add("button {text: 'Enable video timeline tracking'}"),
        g = w.add("group {alignChildren:['center', 'center']}"),
        bnOk = g.add("button {text:'Ok'}", undefined, undefined, { name: "ok" }),
        evt = new Events();
    bnNotifier.onClick = function () {
        if (evt.checkEvents()) evt.removeEvents() else evt.addEvents()
        setEnabledButtonValue()
    }
    w.onShow = function () {
        et.text = cfg.getScriptSettings();
        setEnabledButtonValue()
    }
    bnOk.onClick = function () { cfg.putScriptSettings(Number(et.text)); w.close() }
    function setEnabledButtonValue() {
        var enabled = evt.checkEvents()
        bnNotifier.text = enabled ? 'Disable video timeline tracking' : 'Enable video timeline tracking'
        bnNotifier.graphics.foregroundColor = enabled ? bnNotifier.graphics.newPen(bnNotifier.graphics.PenType.SOLID_COLOR, [1, 0, 0, 1], 1) : bnNotifier.graphics.newPen(bnNotifier.graphics.PenType.SOLID_COLOR, [0, 0.8, 0, 1], 1)
    }
    w.show()
}
function setFrameLength(layers, frames, frameRate) {
    for (var i = 0; i < layers.length; i++) {
        updateProgress(i + 1, layers.length);
        selectLayer(layers[i]);
        (d1 = new ActionDescriptor()).putObject(s2t("resetTime"), s2t("timecode"), new ActionDescriptor());
        executeAction(s2t("moveOutTime"), d1, DialogModes.NO);
        (d = new ActionDescriptor()).putInteger(s2t("seconds"), 0);
        d.putInteger(s2t("frame"), frames - 1);
        d.putDouble(s2t("frameRate"), frameRate);
        (d1 = new ActionDescriptor()).putObject(s2t("timeOffset"), s2t("timecode"), d);
        executeAction(s2t("moveOutTime"), d1, DialogModes.NO);
    }
}
function selectLayer(id) {
    (r = new ActionReference()).putIdentifier(s2t('layer'), id);
    (d = new ActionDescriptor()).putReference(s2t('target'), r);
    executeAction(s2t('select'), d, DialogModes.NO);
}
function Config() {
    this.getScriptSettings = function () {
        var d = new ActionDescriptor();
        try { d = getCustomOptions(UUID) } catch (e) { }
        return d.count ? d.getInteger(s2t('frameRate')) : 30;
    }
    this.putScriptSettings = function (v) {
        var d = new ActionDescriptor();
        d.putInteger(s2t('frameRate'), v)
        putCustomOptions(UUID, d, true);
    }
}
function Events() {
    var f = File($.fileName);
    this.addEvents = function () {
        app.notifiersEnabled = true
        app.notifiers.add('addClipsToTimeline', f)
        app.notifiers.add('newDocument', f)
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
