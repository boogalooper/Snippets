/**
 * Modify the Same Adjustment Layer with the same Name
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/modify-the-same-adjustment-layer-with-the-same-name/td-p/13163359
 */
#target photoshop
s2t = stringIDToTypeID;
(r = new ActionReference()).putProperty(s2t('property'), p = s2t('json'));
r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
eval('var layersCollection = ' + executeActionGet(r).getString(p).replace(/\\/g, ''));
var needToProcess = collectAdjustmentLayers(layersCollection.layers)
for (var i = 0; i < needToProcess.length; i++)
    $.writeln('Check name: "' + needToProcess[i].name + '" and do stuff here with\n.putIdentifier(stringIDToTypeID("adjustmentLayer"), ' + needToProcess[i].id + ')\nif it matches')
function collectAdjustmentLayers(layersObject, collectedLayers) {
    collectedLayers = collectedLayers ? collectedLayers : [];
    for (var i = 0; i < layersObject.length; i++) {
        cur = layersObject[i];
        if (cur.layers) collectAdjustmentLayers(cur.layers, collectedLayers)
        else if (cur.type == 'adjustmentLayer') collectedLayers.push({ name: cur.name, id: cur.id })
    }
    return collectedLayers;
}