#target photoshop

try { activeDocument.suspendHistory('Make blur layer', 'main()') } catch (e) { alert(e) }
function main() {
    var lr = new AM('layer'),
        doc = new AM('document');

    lr.copyToLayer('face')
    lr.liquify()
    lr.fade('difference')
    lr.levels([0, 0.2, 8])
    lr.makeSelectionFromChannel('blue')

    if (doc.hasProperty('selection')) {
        var selectionBounds = doc.descToObject(doc.getProperty('selection'));
        doc.deleteCurrentLayer()
        doc.deselect()
        doc.copyToLayer('Low')
        lr.gaussianBlur((selectionBounds.bottom - selectionBounds.top)/200)
    }
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

    this.copyToLayer = function (caption) {
        (d1 = new ActionDescriptor()).putString(s2t('name'), caption);
        (d = new ActionDescriptor()).putObject(s2t('new'), s2t('layer'), d1);
        d.putEnumerated(s2t('using'), s2t('areaSelector'), s2t('selectionEnum'));
        d.putBoolean(s2t('copy'), true);
        executeAction(s2t('make'), d, DialogModes.NO);
    }

    this.gaussianBlur = function (radius) {
        (d = new ActionDescriptor()).putUnitDouble(s2t('radius'), s2t('pixelsUnit'), radius);
        executeAction(s2t('gaussianBlur'), d, DialogModes.NO);
    }

    this.liquify = function () {
        var mesh = String.fromCharCode(0, 0, 0, 16, 0, 0, 0, 1, 0, 0, 0, 0, 0, 8, 102, 97, 99, 101, 77, 101, 115, 104, 0, 0, 0, 3, 0, 0, 0, 21, 102, 97, 99, 101, 68, 101, 115, 99, 114, 105, 112, 116, 111, 114, 86, 101, 114, 115, 105, 111, 110, 108, 111, 110, 103, 0, 0, 0, 2, 0, 0, 0, 15, 102, 97, 99, 101, 77, 101, 115, 104, 86, 101, 114, 115, 105, 111, 110, 108, 111, 110, 103, 0, 0, 0, 2, 0, 0, 0, 12, 102, 97, 99, 101, 73, 110, 102, 111, 76, 105, 115, 116, 86, 108, 76, 115, 0, 0, 0, 1, 79, 98, 106, 99, 0, 0, 0, 1, 0, 0, 0, 0, 0, 8, 102, 97, 99, 101, 73, 110, 102, 111, 0, 0, 0, 3, 0, 0, 0, 10, 102, 97, 99, 101, 67, 101, 110, 116, 101, 114, 79, 98, 106, 99, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 110, 117, 108, 108, 0, 0, 0, 2, 0, 0, 0, 0, 88, 32, 32, 32, 100, 111, 117, 98, 63, 222, 74, 3, 96, 0, 0, 0, 0, 0, 0, 0, 89, 32, 32, 32, 100, 111, 117, 98, 63, 212, 76, 98, 42, 170, 170, 171, 0, 0, 0, 13, 102, 101, 97, 116, 117, 114, 101, 86, 97, 108, 117, 101, 115, 79, 98, 106, 99, 0, 0, 0, 1, 0, 0, 0, 0, 0, 13, 102, 101, 97, 116, 117, 114, 101, 86, 97, 108, 117, 101, 115, 0, 0, 0, 5, 0, 0, 0, 7, 101, 121, 101, 83, 105, 122, 101, 100, 111, 117, 98, 191, 240, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 108, 101, 102, 116, 69, 121, 101, 83, 105, 122, 101, 100, 111, 117, 98, 191, 240, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 114, 105, 103, 104, 116, 69, 121, 101, 83, 105, 122, 101, 100, 111, 117, 98, 191, 240, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 115, 109, 105, 108, 101, 100, 111, 117, 98, 63, 240, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 110, 111, 115, 101, 87, 105, 100, 116, 104, 100, 111, 117, 98, 63, 240, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 102, 101, 97, 116, 117, 114, 101, 68, 105, 115, 112, 108, 97, 99, 101, 109, 101, 110, 116, 115, 79, 98, 106, 99, 0, 0, 0, 1, 0, 0, 0, 0, 0, 20, 102, 101, 97, 116, 117, 114, 101, 68, 105, 115, 112, 108, 97, 99, 101, 109, 101, 110, 116, 115, 0, 0, 0, 0);
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