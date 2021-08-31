function main() {
	var s2t = stringIDToTypeID;

	(tr = new ActionReference).putProperty(s2t('property'), p = s2t('targetLayersIDs'));
	tr.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));

	(lr = new ActionReference).putProperty(s2t('property'), n = s2t('name'));
	lr.putIdentifier(s2t('layer'), executeActionGet(tr).getList(p).getReference(0).getIdentifier(s2t('layerID')));
	var nm = executeActionGet(lr).getString(n)

    executeAction(s2t('mergeLayers'), new ActionDescriptor(), DialogModes.NO);

	(r = new ActionReference()).putEnumerated(s2t("layer"), s2t("ordinal"), s2t("targetEnum"));
	(d = new ActionDescriptor()).putReference(s2t("null"), r);
	(d1 = new ActionDescriptor()).putString(s2t("name"), nm);
	d.putObject(s2t("to"), s2t("layer"), d1);
	executeAction(s2t("set"), d, DialogModes.NO);
}

app.activeDocument.suspendHistory("Smart Obj Script", "main()");