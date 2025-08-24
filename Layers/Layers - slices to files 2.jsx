/**
 * Slices from Guides + Save for Web (Legacy)” Unusable for Images Over 30,000 Pixels in Height 
 * https://community.adobe.com/t5/photoshop-ecosystem-ideas/slices-from-guides-save-for-web-legacy-unusable-for-images-over-30-000-pixels-in-height/idc-p/15460936#M26297
 */
#target photoshop
const exportQuality = 100,
    autoClose = true;
var apl = new AM('application'),
    doc = new AM('document'),
    lr = new AM('layer');
doForcedProgress('', 'main()')
function main() {
    try {
        if (apl.getKey('numberOfDocuments')) {
            var initState = activeDocument.activeHistoryState;
            if (activeDocument.guides.length) doc.slicesFromGuides();
            if (doc.hasKey('slices')) {
                var slices = doc.getKey('slices').value.getList(stringIDToTypeID('slices'));
                if (slices.count > 1) {
                    var selection = [];
                    for (var i = 0; i < slices.count - 1; i++) selection.push(slices.getObjectValue(i).getObjectValue(stringIDToTypeID('bounds')));
                    doc.clearGuides();
                    doc.clearSlices();
                    selection.reverse();
                    var len = selection.length,
                        digits = len > 0 && len <= 9 ? 2 : (String(len)).length,
                        h = activeDocument.activeHistoryState,
                        title = doc.getKey('title').replace(/\.[^\.]+$/, ''),
                        pth = getUniqueFolderPath(doc.getKey('fileReference').path, title),
                        options = function () { var o = new ExportOptionsSaveForWeb(); o.format = SaveDocumentType.JPEG; o.includeProfile = false; o.interlaced = false; o.optimized = false; o.quality = exportQuality; return o }();
                    for (var i = 0; i < len; i++) {
                        changeProgressText('Export slices: ' + (i + 1) + '/' + len)
                        doc.makeSelection(selection[i]);
                        doc.crop();
                        activeDocument.exportDocument(File(pth + '/' + title + '_' + (('0000' + (i + 1)).slice(-digits)) + '.jpg'), ExportType.SAVEFORWEB, options)
                        activeDocument.activeHistoryState = h;
                    }
                    activeDocument.activeHistoryState = initState;
                    if (autoClose) activeDocument.close(SaveOptions.DONOTSAVECHANGES);
                } else throw new Error('Slices or guides not found in current document!');
            } else throw new Error('This version of Photoshop does not have access to slices');
        } else throw new Error('No opened documents!');
    } catch (e) { alert(e) }
    function getUniqueFolderPath(pth, folderName) {
        var fullPath = new Folder(pth + '/' + folderName);
        if (!fullPath.exists) { fullPath.create(); return fullPath; }
        var i = 1;
        while (true) {
            var suffix = (i < 10) ? '--0' + i : '--' + i;
            fullPath = new Folder(pth + '/' + folderName + suffix);
            if (!fullPath.exists) { fullPath.create(); return fullPath; }
            i++;
        }
    }
}
function AM(target) {
    var s2t = stringIDToTypeID,
        t2s = typeIDToStringID;
    target = target ? s2t(target) : null;
    this.getKey = function (property, id, idxMode) {
        property = s2t(property);
        (r = new ActionReference()).putProperty(s2t('property'), property);
        id != undefined ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id)) :
            r.putEnumerated(target, s2t('ordinal'), s2t('targetEnum'));
        return getDescValue(executeActionGet(r), property)
    }
    this.hasKey = function (property, id, idxMode) {
        property = s2t(property);
        (r = new ActionReference()).putProperty(s2t('property'), property);
        id ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id))
            : r.putEnumerated(target, s2t('ordinal'), s2t('targetEnum'));
        return executeActionGet(r).hasKey(property)
    }
    this.clearSlices = function () {
        (r = new ActionReference()).putEnumerated(s2t('slice'), s2t('ordinal'), s2t('allEnum'));
        (d = new ActionDescriptor()).putReference(s2t('target'), r);
        executeAction(s2t('delete'), d, DialogModes.NO);
    }
    this.clearGuides = function () {
        executeAction(s2t('clearAllGuides'), undefined, DialogModes.NO);
    }
    this.slicesFromGuides = function () {
        (r = new ActionReference()).putClass(s2t('slice'));
        (d = new ActionDescriptor()).putReference(s2t('target'), r);
        d.putClass(s2t('using'), s2t('guides'));
        executeAction(s2t('make'), d, DialogModes.NO);
    }
    this.makeSelection = function (bounds) {
        (r = new ActionReference()).putProperty(s2t('channel'), s2t('selection'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        (d1 = new ActionDescriptor()).putUnitDouble(s2t('top'), s2t('pixelsUnit'), bounds.getDouble(s2t('top')));
        d1.putUnitDouble(s2t('left'), s2t('pixelsUnit'), bounds.getDouble(s2t('left')));
        d1.putUnitDouble(s2t('bottom'), s2t('pixelsUnit'), bounds.getDouble(s2t('bottom')));
        d1.putUnitDouble(s2t('right'), s2t('pixelsUnit'), bounds.getDouble(s2t('right')));
        d.putObject(s2t('to'), s2t('rectangle'), d1);
        executeAction(s2t('set'), d, DialogModes.NO);
    }
    this.crop = function () {
        (d = new ActionDescriptor()).putBoolean(s2t('delete'), true);
        executeAction(s2t('crop'), d, DialogModes.NO);
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
