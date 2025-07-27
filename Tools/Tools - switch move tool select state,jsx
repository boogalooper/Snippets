/**
 * inconsistencies when a group is selected
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/inconsistencies-when-a-group-is-selected/td-p/15418045
 */

#target photoshop;

switchMoveToolSelectGroup(true);

function switchMoveToolSelectGroup(selectGroup) {
    var s2t = stringIDToTypeID,
        t2s = typeIDToStringID,
        c2t = charIDToTypeID;
    (r = new ActionReference()).putProperty(s2t('property'), p = s2t('tool'));
    r.putEnumerated(s2t('application'), s2t('ordinal'), s2t('targetEnum'));
    var t = t2s(executeActionGet(r).getEnumerationType(s2t('tool')));
    if (t != 'moveTool') currentTool = t;
    (r = new ActionReference()).putProperty(s2t('property'), p = s2t('tool'));
    r.putEnumerated(s2t('application'), s2t('ordinal'), s2t('targetEnum'));
    d = executeActionGet(r).getObjectValue(s2t('currentToolOptions'));
    d.putBoolean(c2t('ASGr'), selectGroup);
    (r = new ActionReference()).putClass(s2t(t));
    (d1 = new ActionDescriptor()).putReference(s2t('target'), r);
    d1.putObject(s2t('to'), s2t('target'), d);
    executeAction(s2t('set'), d1, DialogModes.NO);
}


