/**Toggle anti-aliasing tools on and off
 * https://community.adobe.com/t5/photoshop/toggle-anti-aliasing-tools-on-and-off/m-p/11817340
 */

#target photoshop;

var s2t = stringIDToTypeID,
    c2t = charIDToTypeID,
    tools = {
        marqueeRectTool: 'MrqA'
        marqueeEllipTool: 'MrqA',
        lassoTool: 'DrwA',
        polySelTool: 'DrwA',
        magneticLassoTool: 'DrwA',
        magicWandTool: 'WndA',
    },
    antiAlias = true;

for (t in tools) {
    (d = new ActionDescriptor()).putBoolean(c2t(tools[t]), antiAlias);
    (r = new ActionReference()).putClass(s2t(t));
    (d1 = new ActionDescriptor()).putReference(s2t('target'), r);
    d1.putObject(s2t('to'), s2t('target'), d);
    executeAction(s2t('set'), d1, DialogModes.NO);
}