/**Arbitrary cropping of the document (to create a preview of a fragment of a given size and a given percentage of overlap)
 * with the possibility of applying a watermark (from a separate file) 
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/random-crop-batch-processing-script/m-p/12468477
 * https://www.youtube.com/watch?v=tYb6Zjwgpag
 */
#target photoshop;
randomSquareCropAndSave(10, 1000, 'e:/Path to watermark.png')
function randomSquareCropAndSave(coveragePercent, size, watermark) {
    try {
        try {
            var doc = new AM(p = 'document'),
                docRes = doc.getProperty(p = 'resolution'),
                docWidth = doc.getProperty(p = 'width') / 72 * docRes,
                docHeight = doc.getProperty(p = 'height') / 72 * docRes,
                docPath = doc.getProperty(p = 'fileReference'),
                quardSide = parseInt(Math.sqrt((coveragePercent / 100) * docWidth * docHeight) / 2);
        } catch (e) { throw ('Document property "' + p + '" not found!\n\n' + e) }
        if (quardSide * 2 > docWidth || quardSide * 2 > docHeight) throw ('Cropping area is larger than the document area!')
        var centerX = parseInt((quardSide + Math.random() * (docWidth - quardSide * 2))),
            centerY = parseInt((quardSide + Math.random() * (docHeight - quardSide * 2)));
        doc.makeNewCopy()
        doc.crop(centerY - quardSide, centerX - quardSide, centerY + quardSide, centerX + quardSide, size, size, docRes)
        if (watermark && File(watermark.exists)) doc.place(File(watermark))
        doc.saveAsJpg(function (fle, ext) {
            var uniqueFileName = fle + ext,
                fileNumber = 1;
            if (!Folder((File(fle).path)).exists) Folder((File(fle).path)).create()
            while (File(uniqueFileName).exists) {
                uniqueFileName = fle + "-" + fileNumber + ext;
                fileNumber++;
            }
            return File(uniqueFileName);
        }(decodeURI(docPath.path) + '/' + decodeURI(docPath.name).replace(/\..+$/, '') + '/' + decodeURI(docPath.name).replace(/\..+$/, ''), '-1.jpg'), 12);
        doc.close();
    } catch (e) { alert(e) }
}
function AM(target) {
    var s2t = stringIDToTypeID,
        t2s = typeIDToStringID;
    target = target ? s2t(target) : null;
    this.getProperty = function (property, id, idxMode) {
        property = s2t(property);
        (r = new ActionReference()).putProperty(s2t('property'), property);
        id != undefined ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id)) :
            r.putEnumerated(target, s2t('ordinal'), s2t('targetEnum'));
        return getDescValue(executeActionGet(r), property)
    }
    this.hasProperty = function (property, id, idxMode) {
        property = s2t(property);
        (r = new ActionReference()).putProperty(s2t('property'), property);
        id ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id))
            : r.putEnumerated(target, s2t('ordinal'), s2t('targetEnum'));
        return executeActionGet(r).hasKey(property)
    }
    this.makeNewCopy = function () {
        (r = new ActionReference()).putClass(s2t('document'));
        (d = new ActionDescriptor()).putReference(s2t('target'), r);
        (r1 = new ActionReference()).putProperty(s2t('historyState'), s2t('currentHistoryState'));
        d.putReference(s2t('using'), r1);
        executeAction(s2t('make'), d, DialogModes.NO);
    }
    this.crop = function (top, left, bottom, right, width, height, resolution) {
        (d = new ActionDescriptor()).putUnitDouble(s2t('top'), s2t('pixelsUnit'), top);
        d.putUnitDouble(s2t('left'), s2t('pixelsUnit'), left);
        d.putUnitDouble(s2t('bottom'), s2t('pixelsUnit'), bottom);
        d.putUnitDouble(s2t('right'), s2t('pixelsUnit'), right);
        (d1 = new ActionDescriptor()).putObject(s2t('to'), s2t('rectangle'), d);
        d1.putUnitDouble(s2t("angle"), s2t("angleUnit"), 0);
        d1.putBoolean(s2t('delete'), true);
        d1.putEnumerated(s2t('cropAspectRatioModeKey'), s2t('cropAspectRatioModeClass'), s2t('targetSize'));
        d1.putUnitDouble(s2t('width'), s2t('pixelsUnit'), width);
        d1.putUnitDouble(s2t('height'), s2t('pixelsUnit'), height);
        d1.putUnitDouble(s2t('resolution'), s2t('densityUnit'), resolution);
        executeAction(s2t('crop'), d1, DialogModes.NO);
    }
    this.saveAsJpg = function (pth, quality) {
        (d = new ActionDescriptor()).putInteger(s2t('extendedQuality'), quality);
        d.putEnumerated(s2t('matteColor'), s2t('matteColor'), s2t('none'));
        (d1 = new ActionDescriptor()).putObject(s2t('as'), s2t('JPEG'), d);
        d1.putPath(s2t('in'), pth);
        executeAction(s2t('save'), d1, DialogModes.NO);
    }
    this.close = function () {
        (d = new ActionDescriptor()).putEnumerated(s2t('saving'), s2t('yesNo'), s2t('no'));
        executeAction(s2t('close'), d, DialogModes.NO)
    }
    this.place = function (pth) {
        (d = new ActionDescriptor()).putPath(s2t("null"), pth);
        executeAction(s2t("placeEvent"), d, DialogModes.NO);
    }
    function getDescValue(d, p) {
        switch (d.getType(p)) {
            case DescValueType.OBJECTTYPE: return { type: t2s(d.getObjectType(p)), value: d.getObjectValue(p) };
            case DescValueType.LISTTYPE: return d.getList(p);
            case DescValueType.REFERENCETYPE: return d.getReference(p);
            case DescValueType.BOOLEANTYPE: return d.getBoolean(p);
            case DescValueType.STRINGTYPE: return d.getString(p);
            case DescValueType.INTEGERTYPE: return d.getInteger(p);
            case DescValueType.LARGEINTEGERTYPE: return d.getLargeInteger(p);
            case DescValueType.DOUBLETYPE: return d.getDouble(p);
            case DescValueType.ALIASTYPE: return d.getPath(p);
            case DescValueType.CLASSTYPE: return d.getClass(p);
            case DescValueType.UNITDOUBLE: return (d.getUnitDoubleValue(p));
            case DescValueType.ENUMERATEDTYPE: return { type: t2s(d.getEnumerationType(p)), value: t2s(d.getEnumerationValue(p)) };
            default: break;
        };
    }
}