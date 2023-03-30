#target photoshop
s2t = stringIDToTypeID;

(r = new ActionReference()).putProperty(s2t("property"), s2t("json"));
r.putEnumerated(s2t("document"), s2t("ordinal"), s2t("targetEnum"));
(d = new ActionDescriptor()).putReference(s2t("null"), r);
d.putBoolean(s2t("expandSmartObjects"), true);
eval("var json=" + executeAction(s2t("get"), d, DialogModes.NO).getString(s2t("json")));

$.writeln(json.toSource());

