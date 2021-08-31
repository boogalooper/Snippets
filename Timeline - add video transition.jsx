#target photoshop

var s2t = stringIDToTypeID,
    transition = {
        fade: 'opacityDissolveTransition',
        crossFade: 'crossDissolveTransition',
        fadeBlack: 'blackDissolveTransition',
        fadeWhite: 'whiteDissolveTransition'
    },
    p = app.activeDocument.activeLayer.parent,
    len = p.layers.length - 1;

for (var i = len; i > 0; i--) {
    selectLayers([p.layers[i].id, p.layers[i - 1].id])
    addTimelineTransition(2, transition.fade)
}

function selectLayers(IDList) {
    var r = new ActionReference();
    for (var i = 0; i < IDList.length; i++) { r.putIdentifier(s2t('layer'), IDList[i]) }
    (d = new ActionDescriptor()).putReference(s2t('null'), r);
    executeAction(s2t('select'), d, DialogModes.NO)
}

function addTimelineTransition(seconds, typeOfTransition) {
    (d = new ActionDescriptor()).putObject(s2t('using'), s2t(typeOfTransition), new ActionDescriptor());
    (d1 = new ActionDescriptor()).putInteger(s2t('seconds'), seconds);
    d.putObject(s2t('duration'), s2t('timecode'), d1);
    d.putEnumerated(s2t('placement'), s2t('transitionPlacement'), s2t('join'));
    executeAction(s2t('addTimelineTransition'), d, DialogModes.NO);
}
