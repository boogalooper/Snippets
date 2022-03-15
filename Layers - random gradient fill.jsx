/**Скрипт генерирующий случайные градиенты 
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/need-help-with-randomizing-gradient-fills/m-p/12349293
 */
s2t = stringIDToTypeID;

(r = new ActionReference()).putClass(s2t("contentLayer"));
(d = new ActionDescriptor()).putReference(s2t("null"), r);
(d2 = new ActionDescriptor()).putUnitDouble(s2t("angle"), s2t("angleUnit"), Math.floor(Math.random() * 360));
d2.putEnumerated(s2t("type"), s2t("gradientType"), s2t("linear"));
(d3 = new ActionDescriptor()).putEnumerated(s2t("gradientForm"), s2t("gradientForm"), s2t("colorNoise"));
d3.putBoolean(s2t("showTransparency"), true);
d3.putInteger(s2t("smoothness"), 1024);
d3.putEnumerated(s2t("colorSpace"), s2t("colorSpace"), s2t("RGBColor"));
d3.putInteger(s2t("randomSeed"), Math.random() * 10000000000000);
d2.putObject(s2t("gradient"), s2t("gradient"), d3);
(d1 = new ActionDescriptor()).putObject(s2t("type"), s2t("gradientLayer"), d2);
d.putObject(s2t("using"), s2t("contentLayer"), d1);
executeAction(s2t("make"), d, DialogModes.NO);