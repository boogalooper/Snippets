
/**
 * Reset View (rotation) via scripting? 
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/reset-view-rotation-via-scripting/td-p/15414250
 */

s2t = stringIDToTypeID;

(d1 = new ActionDescriptor()).putClass(s2t("mode"), s2t("RGBColorMode"));
d1.putUnitDouble(s2t("width"), s2t("distanceUnit"), 1);
d1.putUnitDouble(s2t("height"), s2t("distanceUnit"), 1);
d1.putUnitDouble(s2t("resolution"), s2t("densityUnit"), 72);
d1.putEnumerated(s2t("fill"), s2t("fill"), s2t("white"));
(d = new ActionDescriptor()).putObject(s2t("new"), s2t("document"), d1);

executeAction(s2t("make"), d, DialogModes.NO);

(r = new ActionReference()).putEnumerated(s2t('menuItemClass'), s2t('menuItemType'), s2t("matchRotation"));
(d = new ActionDescriptor()).putReference(s2t('null'), r);
executeAction(s2t('select'), d, DialogModes.NO);

executeAction(s2t("close"), new ActionDescriptor(), DialogModes.NO);
