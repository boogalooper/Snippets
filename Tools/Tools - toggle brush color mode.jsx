#target photoshop;
/*
<javascriptresource>
<category>User</category>
</javascriptresource>
*/
var s2t = stringIDToTypeID,
    t2s = typeIDToStringID;

currentTool = 'paintbrushTool';
(r = new ActionReference()).putProperty(s2t('property'), p = s2t('tool'));
r.putEnumerated(s2t('application'), s2t('ordinal'), s2t('targetEnum'));
var tool = executeActionGet(r);

if (!Number($.getenv('colorMode'))) {
    $.setenv('colorMode', 1)
    setBrushMode('color')
    applyLocking(true)
} else {
    $.setenv('colorMode', 0)
    setBrushMode('normal')
    applyLocking(false)
}

function setBrushMode(mode) {
    (d = new ActionDescriptor()).putEnumerated(s2t('mode'), s2t('blendMode'), s2t(mode));
    d.putBoolean(s2t('useScatter'), tool.getObjectValue(s2t('currentToolOptions')).getBoolean(s2t('useScatter')));
    (r = new ActionReference()).putClass(s2t(currentTool));
    (d1 = new ActionDescriptor()).putReference(s2t('target'), r);
    d1.putObject(s2t('to'), s2t('target'), d);
    executeAction(s2t('set'), d1, DialogModes.NO);
}

function applyLocking(mode) {
    (r = new ActionReference()).putEnumerated(s2t("layer"), s2t("ordinal"), s2t("targetEnum"));
    (d = new ActionDescriptor()).putReference(s2t("null"), r);
    (d1 = new ActionDescriptor()).putBoolean(s2t("protectTransparency"), mode);
    d.putObject(s2t("layerLocking"), s2t("layerLocking"), d1);
    try {executeAction(s2t("applyLocking"), d, DialogModes.NO);} catch(e) {};
}
