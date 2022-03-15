/**Однослойное изображение - переместить выделенный фрагмент трансформацией и заполнить вырезанный фрагмент
 * https://community.adobe.com/t5/photoshop-ecosystem/can-a-script-call-transform-tool-and-wait-for-it-to-finish/m-p/12239360
 */
#target photoshop
var s2t = stringIDToTypeID;
(r = new ActionReference()).putProperty(s2t('property'), p = s2t('selection'));
r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
if (executeActionGet(r).hasKey(p)) {
    (saveToChannel = function (label) {
        (r = new ActionReference()).putProperty(s2t('channel'), s2t('selection'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        d.putString(s2t('name'), label);
        executeAction(s2t('duplicate'), d, DialogModes.NO);
    })('selection_source');
    try {
        (r = new ActionReference()).putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        executeAction(s2t('transform'), d, DialogModes.ALL);
        saveToChannel('selection_target');
        (r = new ActionReference()).putProperty(s2t('channel'), s2t('selection'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        (r1 = new ActionReference()).putName(s2t('channel'), 'selection_source');
        d.putReference(s2t('to'), r1);
        executeAction(s2t('set'), d, DialogModes.NO);
        (r = new ActionReference()).putName(s2t('channel'), 'selection_target');
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        (r1 = new ActionReference()).putProperty(s2t('channel'), s2t('selection'));
        d.putReference(s2t('from'), r1);
        executeAction(s2t('subtract'), d, DialogModes.NO);
        (r = new ActionReference()).putName(s2t('channel'), 'selection_target');
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        executeAction(s2t('delete'), d, DialogModes.NO);
        (d = new ActionDescriptor()).putUnitDouble(s2t('by'), s2t('pixelsUnit'), 1);
        executeAction(s2t('expand'), d, DialogModes.NO);
        (d = new ActionDescriptor()).putEnumerated(s2t('cafSamplingRegion'), s2t('cafSamplingRegion'), s2t('cafSamplingRegionRectangular'));
        d.putBoolean(s2t('cafSampleAllLayers'), false);
        d.putEnumerated(s2t('cafColorAdaptationLevel'), s2t('cafColorAdaptationLevel'), s2t('cafColorAdaptationDefault'));
        d.putEnumerated(s2t('cafRotationAmount'), s2t('cafRotationAmount'), s2t('cafRotationAmountNone'));
        d.putBoolean(s2t('cafScale'), false);
        d.putBoolean(s2t('cafMirror'), false);
        d.putEnumerated(s2t('cafOutput'), s2t('cafOutput'), s2t('cafOutputToCurrentLayer'));
        executeAction(s2t('cafWorkspace'), d, DialogModes.NO);
        (r = new ActionReference()).putProperty(s2t('channel'), s2t('selection'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        d.putEnumerated(s2t('to'), s2t('ordinal'), s2t('none'));
        executeAction(s2t('set'), d, DialogModes.NO);
    } catch (e) { }
    (r = new ActionReference()).putName(s2t('channel'), 'selection_source');
    (d = new ActionDescriptor()).putReference(s2t('null'), r);
    executeAction(s2t('delete'), d, DialogModes.NO);
}
