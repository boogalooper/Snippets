#target photoshop
/*
<javascriptresource>
<category>User</category>
<enableinfo>true</enableinfo>
</javascriptresource>
*/
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
    alphaChannel = executeActionGet(r).hasKey(p);
    (r = new ActionReference()).putEnumerated(s2t("channel"), s2t("channel"), s2t(channelName.indexOf(layerName) == 0 && !alphaChannel ? 'RGB' : 'mask'));
    (d = new ActionDescriptor).putReference(s2t("null"), r);
    executeAction(s2t("select"), d, DialogModes.NO);
}