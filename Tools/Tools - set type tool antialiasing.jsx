/* Set tool with Action Manager code
https://community.adobe.com/t5/photoshop-ecosystem-discussions/set-tool-with-action-manager-code/td-p/12771952
*/
#target photoshop;
var s2t = stringIDToTypeID;
(r = new ActionReference()).putProperty(s2t('property'), p = s2t('tool'));
r.putEnumerated(s2t('application'), s2t('ordinal'), s2t('targetEnum'));
var toolOptions = executeActionGet(r).getObjectValue(s2t('currentToolOptions')),
    characterOptions = toolOptions.getObjectValue(s2t('textToolCharacterOptions')),
    textStyle = characterOptions.getObjectValue(s2t('textStyle'));
textStyle.putInteger(s2t('antiAlias'), 0);
characterOptions.putObject(s2t('textStyle'), s2t('textStyle'), textStyle);
toolOptions.putObject(s2t('textToolCharacterOptions'), s2t('null'), characterOptions);
(r = new ActionReference()).putClass(s2t('typeCreateOrEditTool'));
(d = new ActionDescriptor()).putReference(s2t('target'), r);
d.putObject(s2t('to'), s2t('target'), toolOptions);
executeAction(s2t('set'), d, DialogModes.NO);
