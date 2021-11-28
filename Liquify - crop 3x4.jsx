/**Crop/trim image automation 3:4
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/crop-trim-image-automation-3-4/m-p/12185480
 */
#target photoshop

var lr = new AM('layer'),
    doc = new AM('document');

lr.copyCurentToLayer()
lr.liquify()
lr.fade('difference')
lr.levels([0, 0.2, 8])
lr.makeSelectionFromChannel('blue')

if (doc.hasProperty('selection')) {
    var selectionBounds = doc.descToObject(doc.getProperty('selection')),
        noseTop = selectionBounds.bottom;

    doc.deleteCurrentLayer()
    lr.autoCutout()

    selectionBounds = doc.descToObject(doc.getProperty('selection'))
    doc.deselect()

    var bodyCenter = selectionBounds.left + (selectionBounds.right - selectionBounds.left) / 2,
        layerBounds = doc.descToObject(lr.getProperty('bounds')),
        lrHeight = layerBounds.bottom,
        lrWidth = layerBounds.right,
        selectionWidth = bodyCenter <= lrWidth / 2 ? bodyCenter : (lrWidth - bodyCenter),
        selectionHeight = selectionWidth * 2 / 4 * 3;

    if ((noseTop + selectionHeight) > lrHeight) {
        selectionHeight = lrHeight - noseTop
        selectionWidth = selectionHeight / 3 * 4 / 2
    }

    doc.makeSelection(noseTop, bodyCenter - selectionWidth, noseTop + selectionHeight, bodyCenter + selectionWidth)

}

function AM(target) {
    var s2t = stringIDToTypeID,
        t2s = typeIDToStringID;

    target = s2t(target)
    this.getProperty = function (property, descMode, id, idxMode, parent, parentIdx) {
        property = s2t(property);
        (r = new ActionReference()).putProperty(s2t('property'), property);
        id != undefined ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id)) :
            r.putEnumerated(target, s2t('ordinal'), s2t('targetEnum'));
        if (parent) r.putIndex(s2t(parent), parentIdx);
        return descMode ? executeActionGet(r) : getDescValue(executeActionGet(r), property)
    }

    this.hasProperty = function (property, id, idxMode) {
        property = s2t(property);
        (r = new ActionReference()).putProperty(s2t('property'), property);
        id ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id))
            : r.putEnumerated(target, s2t('ordinal'), s2t('targetEnum'));
        return executeActionGet(r).hasKey(property)
    }

    this.descToObject = function (d) {
        var o = {}
        for (var i = 0; i < d.count; i++) {
            var k = d.getKey(i)
            o[t2s(k)] = getDescValue(d, k)
        }
        return o
    }

    this.copyCurentToLayer = function (numberOfCopies) {
        numberOfCopies = numberOfCopies == undefined ? 1 : numberOfCopies
        for (var i = 0; i < numberOfCopies; i++) { executeAction(s2t('copyToLayer'), undefined, DialogModes.NO) }
    }

    this.liquify = function () {
        var mesh = String.fromCharCode(0, 0, 0, 16,0, 0, 0, 4, 121, 102, 113, 76, 104, 115, 101, 77, 2, 0, 0, 0, 150, 0, 0, 0, 225, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 132, 3, 0, 0, 88, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 132, 3, 0, 0, 88, 2, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 150, 0, 0, 0, 101, 99, 97, 70, 196, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 0, 0, 0, 1, 0, 0, 0, 0, 0, 8, 102, 97, 99, 101, 77, 101, 115, 104, 0, 0, 0, 3, 0, 0, 0, 21, 102, 97, 99, 101, 68, 101, 115, 99, 114, 105, 112, 116, 111, 114, 86, 101, 114, 115, 105, 111, 110, 108, 111, 110, 103, 0, 0, 0, 2, 0, 0, 0, 15, 102, 97, 99, 101, 77, 101, 115, 104, 86, 101, 114, 115, 105, 111, 110, 108, 111, 110, 103, 0, 0, 0, 2, 0, 0, 0, 12, 102, 97, 99, 101, 73, 110, 102, 111, 76, 105, 115, 116, 86, 108, 76, 115, 0, 0, 0, 1, 79, 98, 106, 99, 0, 0, 0, 1, 0, 0, 0, 0, 0, 8, 102, 97, 99, 101, 73, 110, 102, 111, 0, 0, 0, 3, 0, 0, 0, 10, 102, 97, 99, 101, 67, 101, 110, 116, 101, 114, 79, 98, 106, 99, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 110, 117, 108, 108, 0, 0, 0, 2, 0, 0, 0, 0, 88, 32, 32, 32, 100, 111, 117, 98, 63, 222, 208, 81, 126, 75, 23, 229, 0, 0, 0, 0, 89, 32, 32, 32, 100, 111, 117, 98, 63, 214, 68, 141, 240, 18, 52, 86, 0, 0, 0, 13, 102, 101, 97, 116, 117, 114, 101, 86, 97, 108, 117, 101, 115, 79, 98, 106, 99, 0, 0, 0, 1, 0, 0, 0, 0, 0, 13, 102, 101, 97, 116, 117, 114, 101, 86, 97, 108, 117, 101, 115, 0, 0, 0, 5, 0, 0, 0, 5, 115, 109, 105, 108, 101, 100, 111, 117, 98, 63, 204, 40, 245, 192, 0, 0, 0, 0, 0, 0, 8, 117, 112, 112, 101, 114, 76, 105, 112, 100, 111, 117, 98, 191, 202, 225, 71, 160, 0, 0, 0, 0, 0, 0, 8, 108, 111, 119, 101, 114, 76, 105, 112, 100, 111, 117, 98, 63, 202, 225, 71, 160, 0, 0, 0, 0, 0, 0, 10, 109, 111, 117, 116, 104, 87, 105, 100, 116, 104, 100, 111, 117, 98, 63, 196, 122, 225, 64, 0, 0, 0, 0, 0, 0, 11, 109, 111, 117, 116, 104, 72, 101, 105, 103, 104, 116, 100, 111, 117, 98, 63, 204, 40, 245, 192, 0, 0, 0, 0, 0, 0, 20, 102, 101, 97, 116, 117, 114, 101, 68, 105, 115, 112, 108, 97, 99, 101, 109, 101, 110, 116, 115, 79, 98, 106, 99, 0, 0, 0, 1, 0, 0, 0, 0, 0, 20, 102, 101, 97, 116, 117, 114, 101, 68, 105, 115, 112, 108, 97, 99, 101, 109, 101, 110, 116, 115, 0, 0, 0, 0 );
        (d = new ActionDescriptor()).putData(s2t('faceMeshData'), mesh)
        executeAction(charIDToTypeID('LqFy'), d, DialogModes.NO)
    }

    this.fade = function (mode) {
        (d = new ActionDescriptor()).putEnumerated(s2t('mode'), s2t('blendMode'), s2t(mode))
        executeAction(s2t('fade'), d, DialogModes.NO)
    }

    this.levels = function (paramsArray) {
        var left = paramsArray[0],
            gamma = paramsArray[1],
            right = paramsArray[2];

        (d = new ActionDescriptor()).putEnumerated(s2t('presetKind'), s2t('presetKindType'), s2t('presetKindCustom'));
        (r = new ActionReference()).putEnumerated(s2t('channel'), s2t('channel'), s2t('composite'));
        (d1 = new ActionDescriptor()).putReference(s2t('channel'), r);
        (l = new ActionList()).putInteger(left);
        l.putInteger(right);
        d1.putList(s2t('input'), l);
        d1.putDouble(s2t('gamma'), gamma);
        (l1 = new ActionList()).putObject(s2t('levelsAdjustment'), d1);
        d.putList(s2t('adjustment'), l1);
        executeAction(s2t('levels'), d, DialogModes.NO)
    }

    this.makeSelectionFromChannel = function (channel) {
        (r = new ActionReference()).putProperty(s2t('channel'), s2t('selection'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        (r1 = new ActionReference()).putEnumerated(s2t('channel'), s2t('channel'), s2t(channel));
        d.putReference(s2t('to'), r1)
        executeAction(s2t('set'), d, DialogModes.NO)
    }

    this.deselect = function () {
        (r = new ActionReference()).putProperty(s2t('channel'), s2t('selection'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        d.putEnumerated(s2t('to'), s2t('ordinal'), s2t('none'));
        executeAction(s2t('set'), d, DialogModes.NO);
    }

    this.deleteCurrentLayer = function () {
        (r = new ActionReference()).putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r)
        executeAction(s2t('delete'), d, DialogModes.NO)
    }

    this.autoCutout = function (sampleAllLayers) {
        sampleAllLayers = sampleAllLayers == undefined ? false : true;
        (d = new ActionDescriptor()).putBoolean(s2t('sampleAllLayers'), sampleAllLayers);
        executeAction(s2t('autoCutout'), d, DialogModes.NO);
    }

    this.makeSelection = function (top, left, bottom, right) {
        (r = new ActionReference()).putProperty(s2t('channel'), s2t('selection'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        (d1 = new ActionDescriptor()).putUnitDouble(s2t('top'), s2t('pixelsUnit'), top);
        d1.putUnitDouble(s2t('left'), s2t('pixelsUnit'), left);
        d1.putUnitDouble(s2t('bottom'), s2t('pixelsUnit'), bottom);
        d1.putUnitDouble(s2t('right'), s2t('pixelsUnit'), right);
        d.putObject(s2t('to'), s2t('rectangle'), d1);
        executeAction(s2t('set'), d, DialogModes.NO);
    }

    function getDescValue(d, p) {
        switch (d.getType(p)) {
            case DescValueType.OBJECTTYPE: return (d.getObjectValue(p));
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
            case DescValueType.ENUMERATEDTYPE: return [t2s(d.getEnumerationType(p)), t2s(d.getEnumerationValue(p))];
            default: break;
        };
    }
}