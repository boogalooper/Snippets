#target photoshop
/*
<javascriptresource>
<category>User</category>
<enableinfo>true</enableinfo>
</javascriptresource>
*/
s2t = stringIDToTypeID;

var selectMasterChannel = true,
    backvardMode = false;

(r = new ActionReference()).putProperty(s2t('property'), p = s2t('visible'));
r.putEnumerated(s2t('channel'), s2t('ordinal'), s2t('RGB'));
var masterChannelVisible = executeActionGet(r).getBoolean(p);

(r = new ActionReference()).putProperty(s2t('property'), p = s2t('count'));
r.putEnumerated(s2t('channel'), s2t('ordinal'), s2t('RGB'));
var numberOfChannels = executeActionGet(r).getInteger(p);

(r = new ActionReference()).putProperty(s2t('property'), p = s2t('itemIndex'));
r.putEnumerated(s2t('channel'), s2t('ordinal'), s2t('targetEnum'));
var activeChannel = executeActionGet(r).getInteger(p) == -1 ? 0 : executeActionGet(r).getInteger(p);

var offset = backvardMode ? -1 : 1,
    currentChannel = activeChannel + offset;

if (currentChannel > numberOfChannels) currentChannel = !selectMasterChannel
if (currentChannel == 0 && !selectMasterChannel && backvardMode) currentChannel = numberOfChannels;
if (currentChannel < 0) currentChannel = numberOfChannels;

selectChannel(currentChannel);
if (masterChannelVisible) showMasterChannel();;

function showMasterChannel() {
    (r = new ActionReference()).putEnumerated(s2t('channel'), s2t('ordinal'), s2t('RGB'));
    (d = new ActionDescriptor()).putReference(s2t("target"), r);
    executeAction(s2t("show"), d, DialogModes.NO);
}

function selectChannel(idx) {
    r = new ActionReference();
    !idx ? r.putEnumerated(s2t('channel'), s2t('channel'), s2t('RGB')) : r.putIndex(s2t("channel"), idx);
    (d = new ActionDescriptor()).putReference(s2t("target"), r);
    executeAction(s2t("select"), d, DialogModes.NO);
}