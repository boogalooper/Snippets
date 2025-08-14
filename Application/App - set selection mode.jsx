#target photoshop
/*
<javascriptresource>
<category>User</category>
</javascriptresource>
*/
var s2t = stringIDToTypeID,
    t2s = typeIDToStringID;

(r = new ActionReference()).putProperty(s2t('property'), p = s2t('imageProcessingPrefs'));
r.putEnumerated(s2t('application'), s2t('ordinal'), s2t('targetEnum'));
var curentState = t2s(executeActionGet(r).getObjectValue(p).getEnumerationValue(s2t('imageProcessingSelectSubjectPrefs')));

$.localize = true
var w = new Window("dialog");
w.text = localize('$$$/Menu/Prefs/SelectSubjectProcessing').replace(':', '');

var dl_array = [localize('$$$/Menu/Prefs/SelectSubjectMode/Device'), localize('$$$/Menu/Prefs/SelectSubjectMode/Cloud')];
var dl = w.add("dropdownlist", undefined, undefined, { items: dl_array });
dl.selection = curentState == 'imageProcessingModeDevice' ? 0 : 1;
dl.preferredSize.width = 250;

dl.active = true
var ok = w.add("button", undefined, undefined, { name: "ok" });
ok.text = localize('$$$/ControlStrings/OK');

ok.onClick = function () {
    (r = new ActionReference()).putProperty(s2t("property"), s2t("imageProcessingPrefs"));
    r.putEnumerated(s2t("application"), s2t("ordinal"), s2t("targetEnum"));
    (d = new ActionDescriptor()).putReference(s2t("null"), r);
    (d1 = new ActionDescriptor()).putEnumerated(s2t("imageProcessingSelectSubjectPrefs"), s2t("imageProcessingSelectSubjectPrefs"), s2t(dl.selection.index ? 'imageProcessingModeCloud' : 'imageProcessingModeDevice'));
    d.putObject(s2t("to"), s2t("imageProcessingPrefs"), d1);
    executeAction(s2t("set"), d, DialogModes.NO);
    w.close()
}
w.show();
