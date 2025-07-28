/**
 * Change line tool Width programatically? 
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/change-line-tool-width-programatically/td-p/15431962
 */

#target photoshop
s2t = stringIDToTypeID;
c2t = charIDToTypeID;

if (currentTool == 'lineTool') {
    //get current tool property from application
    (r = new ActionReference()).putProperty(s2t('property'), p = s2t('tool'));
    r.putEnumerated(s2t('application'), s2t('ordinal'), s2t('targetEnum'));

    // get and save currentToolOptions object from tool property
    var cto = executeActionGet(r).getObjectValue(s2t('currentToolOptions'));

    // get and save LnWd integer from currentToolOptions
    var lineWidth = cto.getInteger(c2t('LnWd'));

    // put new size to saved currentToolOptions
    cto.putInteger(c2t('LnWd'), lineWidth + 1);

    // describe 'path' to the object with which we will perform actions
    (r = new ActionReference()).putClass(s2t(currentTool));
    (d1 = new ActionDescriptor()).putReference(s2t('target'), r);

    // put  object that we pass along this 'path'
    d1.putObject(s2t('to'), s2t('target'), cto);

    // perform the set command 
    executeAction(s2t('set'), d1, DialogModes.NO);
}