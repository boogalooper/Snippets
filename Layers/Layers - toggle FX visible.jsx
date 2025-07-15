/**
 * How to turn visibility on or off for Effects on a layer in JSX? 
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/how-to-turn-visibility-on-or-off-for-effects-on-a-layer-in-jsx/td-p/15404878
 */

if (getFxState()) setFxState('hide') else setFxState('show')

function getFxState() {
    s2t = stringIDToTypeID;
    (r = new ActionReference()).putProperty(s2t('property'), p = s2t('layerEffects'));
    r.putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
    if (executeActionGet(r).hasKey(p)) {
        (r = new ActionReference()).putProperty(s2t('property'), p = s2t('layerFXVisible'));
        r.putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
        return executeActionGet(r).getBoolean(p)
    }
}

function setFxState(mode) {
    // mode = 'hide' or 'show'
    s2t = stringIDToTypeID;
    (r = new ActionReference()).putProperty(s2t('property'), p = s2t('layerEffects'));
    r.putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
    if (executeActionGet(r).hasKey(p)) {
        (r1 = new ActionReference()).putClass(s2t("layerEffects"));
        r1.putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
        (l = new ActionList()).putReference(r1);
        (d = new ActionDescriptor()).putList(s2t('target'), l);
        executeAction(s2t(mode), d, DialogModes.NO);
    }
}