/**New button in Adjustment window for Photoshop
 * https://community.adobe.com/t5/photoshop-ecosystem-ideas/new-button-in-adjustment-window-for-photoshop/idi-p/13086063
 * https://youtu.be/WiZDjfqe6B4
 */
/*
<javascriptresource>
<name>Adjustments tracking</name>
</javascriptresource>
*/
#target photoshop
var UUID = '6fdba335-bf6d-4167-8872-8920758ad32b',
    s2t = stringIDToTypeID,
    t2s = typeIDToStringID,
    cfg = new Config();
try {
    var evt = arguments[1];
    if (evt == s2t('curves') || evt == s2t('levels')) {
        cfg.putScriptSettings(arguments[0], evt, cfg.getScriptSettings());
    } else {
        if (ScriptUI.environment.keyboardState.shiftKey) {
            (r = new ActionReference()).putProperty(s2t('property'), p = s2t('adjustment'));
            r.putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
            var kind = executeActionGet(r).getList(p).getObjectType(0);
            var adjustment = cfg.getScriptSettings(kind)
            if (adjustment.count && adjustment.hasKey(s2t('adjustment'))) {
                (r = new ActionReference()).putEnumerated(s2t("adjustmentLayer"), s2t("ordinal"), s2t("targetEnum"));
                (d = new ActionDescriptor()).putReference(s2t("null"), r);
                (d1 = new ActionDescriptor()).putEnumerated(s2t("presetKind"), s2t("presetKindType"), s2t('presetKindCustom'));
                d1.putList(s2t("adjustment"), adjustment.getList(s2t('adjustment')))
                d.putObject(s2t("to"), kind, d1);
                executeAction(s2t("set"), d, DialogModes.NO);
            }
        }
    }
} catch (e) { }
if (!evt) {
    dialogWindow();
}
function dialogWindow() {
    var w = new Window("dialog {text: 'Adjustments tracking',alignChildren:['fill','top']}"),
        bnNotifier = w.add("button {text: 'Enable adjustments tracking'}"),
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
function Config() {
    this.getScriptSettings = function (kind) {
        var d = new ActionDescriptor();
        try { d = getCustomOptions(UUID) } catch (e) { }
        if (d.count) {
            if (kind) if (d.hasKey(kind)) return d.getObjectValue(kind) else return new ActionDescriptor();
        }
        return d
    }
    this.putScriptSettings = function (d, kind, parent) {
        parent.putObject(kind, s2t('object'), d)
        putCustomOptions(UUID, parent, false);
    }
}
function Events() {
    var f = File($.fileName);
    this.addEvents = function () {
        app.notifiersEnabled = true
        app.notifiers.add('Crvs', f)
        app.notifiers.add('levels', f)
        app.notifiers.add('Mk  ', f, 'AdjL')
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