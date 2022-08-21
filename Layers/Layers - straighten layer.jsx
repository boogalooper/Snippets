/**Use the Crop & Straighten, but don't crop.
 * https://community.adobe.com/t5/photoshop-ecosystem/use-the-crop-amp-straighten-but-don-t-crop/m-p/12225478
 */
#target photoshop
s2t = stringIDToTypeID;
try {
    var d = executeAction(stringIDToTypeID('CropPhotos0001'), undefined, DialogModes.NO);
    var l = d.getList(stringIDToTypeID('value'));
    var p = new Array();
    for (var i = 0; i < 8; i += 2) p.push([l.getDouble(i), l.getDouble(i + 1)]);
    var angle = - Math.atan2(p[1][1] - p[0][1], p[1][0] - p[0][0]) * 180 / Math.PI
    if (angle != 0) {
        if (activeDocument.activeLayer.isBackgroundLayer) executeAction(s2t('copyToLayer'), undefined, DialogModes.NO);
        (r = new ActionReference()).putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        d.putUnitDouble(s2t('angle'), s2t('angleUnit'), angle);
        executeAction(s2t('transform'), d, DialogModes.NO);
    }
}
catch (e) { alert(e); throw (e); }