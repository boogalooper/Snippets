/**
 * How set frame delay of gif with Photoshop Script
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/how-set-frame-delay-of-gif-with-photoshop-script/td-p/10941301
 * */

var s2t = stringIDToTypeID;

(r = new ActionReference()).putEnumerated(s2t("animationFrameClass"), s2t("ordinal"), s2t("last"));
(d = new ActionDescriptor()).putReference(s2t("target"), r);
executeAction(s2t("animationFrameActivate"), d, DialogModes.NO);

(d1 = new ActionDescriptor()).putDouble(s2t("animationFrameDelay"), 1);
d.putObject(s2t("to"), s2t("animationFrameClass"), d1);
executeAction(s2t("set"), d, DialogModes.NO);