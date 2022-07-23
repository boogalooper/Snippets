/**Get Active Tool (Tool Palette)
 * https://community.adobe.com/t5/photoshop/get-active-tool-tool-palette/m-p/11478858
 */
#target photoshop;
var s2t = stringIDToTypeID,
    t2s = typeIDToStringID,
    tools = {
        marqueeRectTool: 'selectionEnum',
        marqueeEllipTool: 'selectionEnum',
        lassoTool: 'selectionEnum',
        polySelTool: 'selectionEnum',
        magicLassoTool: 'selectionEnum',
        magneticLassoTool: 'selectionEnum',
        patchSelection: 'selectionMode',
        magicWandTool: 'selectionEnum',
        quickSelectTool: 'quickSelectMode'
    };
(r = new ActionReference()).putProperty(s2t('property'), p = s2t('selection'));
r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
if (executeActionGet(r).hasKey(p)) {
    (r = new ActionReference()).putProperty(s2t('property'), p = s2t('tool'));
    r.putEnumerated(s2t('application'), s2t('ordinal'), s2t('targetEnum'));
    var t = t2s(executeActionGet(r).getEnumerationType(s2t('tool')));
    if (tools[t]) {
        (r = new ActionReference()).putProperty(s2t('property'), p = s2t('tool'));
        r.putEnumerated(s2t('application'), s2t('ordinal'), s2t('targetEnum'));
        d = executeActionGet(r).getObjectValue(s2t('currentToolOptions'))
        if (d.getInteger(s2t(tools[t])) == 1) {
            (d = new ActionDescriptor()).putInteger(s2t(tools[t]), 2);
            (r = new ActionReference()).putClass(s2t(t));
            (d1 = new ActionDescriptor()).putReference(s2t('target'), r);
            d1.putObject(s2t('to'), s2t('target'), d);
            executeAction(s2t('set'), d1, DialogModes.NO);
        }
    }
}