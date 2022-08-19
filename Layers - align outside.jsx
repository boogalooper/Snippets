/**Is there a way to align a layer to the "outside" of a selection?
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/is-there-a-way-to-align-a-layer-to-the-quot-outside-quot-of-a-selection/m-p/13132660#M664410
 */

/*
<javascriptresource>
<name>Alignment tracking</name>
</javascriptresource>
*/
#target photoshop
var s2t = stringIDToTypeID,
    t2s = typeIDToStringID;
try {
    var evt = t2s(arguments[0].getEnumerationValue(s2t('using'))),
        ad = activeDocument;
    if (evt && ad.selection.bounds) {
        if (ScriptUI.environment.keyboardState.shiftKey) {
            var l = ad.activeLayer,
                s = ad.selection;
            switch (evt) {
                case 'ADSBottoms': l.translate(0, -(l.bounds[1].value - s.bounds[3].value)); break;
                case 'ADSTops': l.translate(0, -(l.bounds[3].value - s.bounds[1].value)); break;
                case 'ADSLefts': l.translate(-(l.bounds[2].value - s.bounds[0].value), 0); break;
                case 'ADSRights': l.translate(-(l.bounds[0].value - s.bounds[2].value), 0); break;
            }
        }
    }
} catch (e) { }
if (!evt) {
    dialogWindow();
}
function dialogWindow() {
    var w = new Window("dialog {text: 'Alignment tracking',alignChildren:['fill','top']}"),
        bnNotifier = w.add("button {text: 'Enable alignment tracking'}"),
        bnOk = w.add("button {text:'Ok', properties: {name:'ok'}}}"),
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
        bnNotifier.text = enabled ? 'Disable alignment tracking' : 'Enable alignment tracking'
        bnNotifier.graphics.foregroundColor = enabled ? bnNotifier.graphics.newPen(bnNotifier.graphics.PenType.SOLID_COLOR, [1, 0, 0, 1], 1) : bnNotifier.graphics.newPen(bnNotifier.graphics.PenType.SOLID_COLOR, [0, 0.8, 0, 1], 1)
    }
    w.show()
}
function Events() {
    var f = File($.fileName);
    this.addEvents = function () {
        app.notifiersEnabled = true
        app.notifiers.add('Algn', f)
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
