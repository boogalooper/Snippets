#target photoshop
var s2t = stringIDToTypeID,
    t2s = typeIDToStringID,
    UUID = 'bf7064f7-eee2-4ac2-a639-5c3832469b43';

try {
    var target = t2s(arguments[0].getReference(s2t('null')).getDesiredClass())
    alert (target)
    if (target == 'workspace') {
        var d = new ActionDescriptor();
        d.putString(s2t('workspace'), arguments[0].getReference(s2t('null')).getName())
        app.putCustomOptions(UUID, d)
    }
} catch (e) {
    app.notifiersEnabled = true
    var f = File($.fileName),
        deleted;
    for (var i = 0; i < app.notifiers.length; i++) {
        var ntf = app.notifiers[i]
        if (ntf.eventFile.name == f.name) { ntf.remove(); i--; deleted = true }
    }

    if (deleted) {
        alert('event listening disabled!')
    } else {
        alert('event listening enabled!')

        //app.notifiers.add('slct', f)
      //  app.notifiers.add('Mk  ', f, 'AdjL')
        app.notifiers.add('Mk  ', f)
        var r = new ActionReference();
        r.putProperty(s2t('property'), s2t('menuBarInfo'));
        r.putEnumerated(s2t('application'), s2t('ordinal'), s2t('targetEnum'));
        var mainMenu = executeActionGet(r).getObjectValue(s2t('menuBarInfo')).getList(s2t('submenu'))

        var windowMenu = new ActionDescriptor()

        for (var i = 0; i < mainMenu.count; i++) {
            if (mainMenu.getObjectValue(i).getString(s2t('title')) == localize('$$$/Menu/Window')) {
                var windowMenu = mainMenu.getObjectValue(i).getList(s2t('submenu'))
                break;
            }
        }

        var workspaceMenu = new ActionDescriptor()
        for (var i = 0; i < windowMenu.count; i++) {
            if (windowMenu.getObjectValue(i).getString(s2t('title')) == localize('$$$/Menu/Window/ProjectWorkSpace')) {
                workspaceMenu = windowMenu.getObjectValue(i).getList(s2t('submenu'))
                break;
            }
        }

        for (var i = 0; i < workspaceMenu.count; i++) {
            if (workspaceMenu.getObjectValue(i).getBoolean(s2t('checked'))) {
                var d = new ActionDescriptor();
                d.putString(s2t('workspace'), workspaceMenu.getObjectValue(i).getString(s2t('title')))
                app.putCustomOptions(UUID, d)
            }
        }
    }
}

var s2t = stringIDToTypeID,
    UUID = 'bf7064f7-eee2-4ac2-a639-5c3832469b43';
try { var d = app.getCustomOptions(UUID) } catch (e) { }
if (d) var w = d.getString(s2t('workspace'))

if (w == localize('$$$/FileName/Presets/WorkSpaces/Photography')) {
    // call function for photography workspace here
} else if (w == localize('$$$/FileName/Presets/WorkSpaces/Painting')) {
    // call function for painting workspace here
}
/*
#target photoshop
s2t = stringIDToTypeID;

var r = new ActionReference();
r.putProperty(s2t('property'), s2t('menuBarInfo'));
r.putEnumerated(s2t('application'), s2t('ordinal'), s2t('targetEnum'));
var mainMenu = executeActionGet(r).getObjectValue(s2t('menuBarInfo')).getList(s2t('submenu'))

var windowMenu = new ActionDescriptor(),
    windowTitle = localize('$$$/Menu/Window').replace(/\&/, '');
for (var i = 0; i < mainMenu.count; i++) {
    if (mainMenu.getObjectValue(i).getString(s2t('title')).replace(/\&/, '') == windowTitle) {
        var windowMenu = mainMenu.getObjectValue(i).getList(s2t('submenu'))
        break;
    }
}

var workspaceMenu = new ActionDescriptor(),
    workspaceTitle = localize('$$$/Menu/Window/ProjectWorkSpace').replace(/\&/, '');
for (var i = 0; i < windowMenu.count; i++) {
    if (windowMenu.getObjectValue(i).getString(s2t('title')).replace(/\&/, '') == workspaceTitle) {
        workspaceMenu = windowMenu.getObjectValue(i).getList(s2t('submenu'))
        break;
    }
}

var reset = localize("$$$/Menu/WorkSpace/Reset=&Reset ^0").replace(/[(\&)( \^0$)]/g, '');
for (var i = 0; i < workspaceMenu.count; i++) {
    if (workspaceMenu.getObjectValue(i).getString(s2t('title')).replace(/\&/, '').indexOf(reset) != -1) {
        var currentWorkspaceTitle = workspaceMenu.getObjectValue(i).getString(s2t('title')).replace(/\&/, '').replace(RegExp(reset + ' '), '')

        if (currentWorkspaceTitle == localize('$$$/FileName/Presets/WorkSpaces/Photography').replace(/\&/, '')){
            alert ('фото')
            // call function for photography workspace here
        }else if (currentWorkspaceTitle == localize('$$$/FileName/Presets/WorkSpaces/Painting').replace(/\&/, '')) {
            // call function for painting workspace here
            alert ('рисовач')
        }
        break;
    }
}*/