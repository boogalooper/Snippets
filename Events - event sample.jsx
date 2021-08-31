#target photoshop
try { var target = arguments[0], event = arguments[1] } catch (e) { }

try {
    if (!target) { // main script code
        var d = app.documents.add()
        app.notifiersEnabled = true
        app.notifiers.add('All ', File($.fileName))
    } else { // event triggering
        var t2s = typeIDToStringID,
            s2t = stringIDToTypeID;
        if (t2s(event) == 'save') {
           // alert(t2s(target.getEnumerationValue (s2t('saveStage'))))
           alert('saveStage')
        }
    }
} catch (e) { alert(e) }