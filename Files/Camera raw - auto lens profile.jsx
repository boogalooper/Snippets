
var myFile = (new File()).openDlg();

var c2t = charIDToTypeID,
    s2t = stringIDToTypeID;

var d = new ActionDescriptor();
var params = new ActionDescriptor();

d.putPath(s2t("null"), myFile);
d.putBoolean(stringIDToTypeID('overrideOpen'), true);
params.putInteger(c2t("AuCA"), 1);
params.putDouble(c2t("LPEn"), 1);
params.putInteger(c2t("LPSe"), 2);
d.putObject(s2t("as"), s2t("Adobe Camera Raw"), params);
executeAction(s2t("open"), d, DialogModes.ALL);