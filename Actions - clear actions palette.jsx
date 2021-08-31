#target photoshop

s2t = stringIDToTypeID;

while (true) {
	(r = new ActionReference()).putIndex(s2t("actionSet"), 1);
	(d = new ActionDescriptor()).putReference(s2t("null"), r);
	try {executeAction(s2t("delete"), d, DialogModes.NO)} catch (e) {break}
}