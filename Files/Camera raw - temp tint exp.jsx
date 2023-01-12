var myFile = (new File()).openDlg();

var c2t = charIDToTypeID,
    s2t = stringIDToTypeID;

var d = new ActionDescriptor();
var params = new ActionDescriptor();

d.putPath(s2t("null"), myFile);
params.putInteger(c2t("Temp"), temperature);
params.putInteger(c2t("Tint"), tint);
params.putDouble(c2t("Ex12"), exposure);
d.putObject(s2t("as"), s2t("Adobe Camera Raw"), params);
executeAction(s2t("open"), d, DialogModes.NO);