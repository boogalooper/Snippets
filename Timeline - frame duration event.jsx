#target photoshop

s2t = stringIDToTypeID;

try { var event = arguments[0] } catch (e) { }

try {
    if (event) {
        var descriptor = new ActionDescriptor();
        (d = new ActionDescriptor()).putInteger(s2t("seconds"), -4);
        (d1 = new ActionDescriptor()).putObject(s2t("timeOffset"), s2t("timecode"), d);
        executeAction(s2t("moveOutTime"), d1, DialogModes.NO);
    } else {
        app.notifiersEnabled = true
        var f = File($.fileName)
        app.notifiers.add('addClipsToTimeline', f)
        app.notifiers.add('Mk  ', f, 'Lyr ')
        app.notifiers.add('layersFiltered', f)
    }
} catch (e) { alert(e) }