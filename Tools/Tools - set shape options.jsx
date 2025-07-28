/**
 * How to change shape tool options?
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/how-to-change-shape-tool-options/td-p/15431799
 */
#target photoshop
s2t = stringIDToTypeID;

const tools = {
    ellipseTool: true,
    rectangleTool: true,
    triangleTool: true,
    polygonTool: true,
    lineTool: true,
    customShapeTool: true
},
    geometryToolMode = ['path', 'shape', 'fill'],
    shapeOperation = ['add', 'subtract', 'intersect'];

if (tools[currentTool]) {
    (r = new ActionReference()).putProperty(s2t('property'), p = s2t('tool'));
    r.putEnumerated(s2t('application'), s2t('ordinal'), s2t('targetEnum'));

    var cto = executeActionGet(r).getObjectValue(s2t('currentToolOptions'));

    cto.putEnumerated(s2t('geometryToolMode'), s2t('geometryToolMode'), s2t(geometryToolMode[0])); // values from geometryToolMode array
    cto.putEnumerated(s2t('shapeOperation'), s2t('shapeOperation'), s2t(shapeOperation[2])); // values from shapeOperation array

    (r = new ActionReference()).putClass(s2t(currentTool));
    (d1 = new ActionDescriptor()).putReference(s2t('target'), r);
    d1.putObject(s2t('to'), s2t('target'), cto);
    executeAction(s2t('set'), d1, DialogModes.NO);
}
