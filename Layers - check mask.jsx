#target photoshop

s2t = stringIDToTypeID;

(r = new ActionReference()).putProperty(s2t('property'), p = s2t('hasUserMask'));
r.putEnumerated(s2t("layer"), s2t("ordinal"), s2t("targetEnum"));
if (executeActionGet(r).getBoolean(p)) {
    (r = new ActionReference()).putProperty(s2t('property'), p = s2t('name'));
    (r = new ActionReference()).putEnumerated(s2t("layer"), s2t("ordinal"), s2t("targetEnum"));
    layerName = executeActionGet(r).getString(p);

    (r = new ActionReference()).putProperty(s2t('property'), p = s2t('channelName'));
    r.putEnumerated(s2t("channel"), s2t("ordinal"), s2t("targetEnum"));
    channelName = executeActionGet(r).getString(p);

    (r = new ActionReference()).putProperty(s2t('property'), p = s2t('alphaChannelOptions'));
    r.putEnumerated(s2t("channel"), s2t("ordinal"), s2t("targetEnum"));
    alphaChannel = executeActionGet(r).hasKey(p)

    if (channelName.indexOf(layerName) == 0 && !alphaChannel) {
        var select = confirm('Layer mask selected\nSelect layer?') ? 'RGB' : null
    } else {
        var select = confirm('Layer selecter\nSelect mask?') ? 'mask' : null
    }
    if (select) {
        (r = new ActionReference()).putEnumerated(s2t("channel"), s2t("channel"), s2t(select));
        (d = new ActionDescriptor).putReference(s2t("null"), r);
        executeAction(s2t("select"), d, DialogModes.NO);
    }
}