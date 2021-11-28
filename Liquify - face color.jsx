/**the script tries to bring the complexion to the given coordinates using curves  */

#target photoshop

//var targetRGB = 180
var targetRGB = [216, 174, 154]

$.writeln(targetRGB instanceof Array)

if ((new AM('application')).getProperty('numberOfDocuments')) {
    app.activeDocument.suspendHistory('Get face bounds', 'function blankState () {return}')
    app.activeDocument.suspendHistory('Measure face', 'getFaceBounds()')
    app.activeDocument.suspendHistory('Make curves', 'makeCurves()')
}

function getFaceBounds() {
    var lr = new AM('layer'),
        doc = new AM('document');

    doc.flatten()
    lr.copyToNewLayer()
    lr.liquify()
    doc.fade('difference', 100)
    lr.levels(0, 2)
    doc.selectRGBChannel()
    lr.deleteCurrentLayer()
}

function makeCurves() {
    var doc = new AM('document');
    if (doc.hasProperty('selection') && doc.getProperty('mode')[1] == 'RGBColor') {

        var midtone = []
        if (targetRGB instanceof Array) {
            var ch = new AM('channel')
            for (var i = 0; i < 3; i++) {
                midtone.push(middleToneGamma(targetRGB[i], getMidTone(ch.getProperty('histogram', i+1, true))))
            }
        } else {
            midtone.push(middleToneGamma(targetRGB, getMidTone(doc.getProperty('histogram'))))
        }

        doc.deselect()
        doc.stepBack()
        doc.makeCurves(128, midtone)

    } else { doc.stepBack() }
}

function middleToneGamma(x2, x1) {
    return Math.pow(128 / 255, 1 / (Math.log(x1 / 255) / Math.log(x2 / 255))) * 255
}

function getMidTone(h) {
    var pixels = 0,
        sum = 0;

    for (var i = 0; i < h.count; i++) {
        var key = h.getInteger(i)
        pixels += key
        sum += key * i
    }

    $.writeln(sum / pixels)
    return sum / pixels
}

function AM(target) {
    var s2t = stringIDToTypeID,
        t2s = typeIDToStringID;

    target = s2t(target)

    this.getProperty = function (property, id, idxMode) {
        property = s2t(property);
        (r = new ActionReference()).putProperty(s2t('property'), property);
        id ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id))
            : r.putEnumerated(target, s2t('ordinal'), s2t('targetEnum'));
        return getDescValue(executeActionGet(r), property)
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

    switch (t2s(target)) {
        case 'document':
            this.flatten = function () {
                executeAction(s2t('flattenImage'), undefined, DialogModes.NO);
            }

            this.fade = function (mode, opacity) {
                (d = new ActionDescriptor()).putUnitDouble(s2t('opacity'), s2t('percentUnit'), opacity);
                d.putEnumerated(s2t('mode'), s2t('blendMode'), s2t(mode));
                executeAction(s2t('fade'), d, DialogModes.NO);
            }

            this.selectRGBChannel = function () {
                (r = new ActionReference()).putProperty(s2t('channel'), s2t('selection'));
                (d = new ActionDescriptor()).putReference(s2t('null'), r);
                (r1 = new ActionReference()).putEnumerated(s2t('channel'), s2t('channel'), s2t('RGB'));
                d.putReference(s2t('to'), r1);
                executeAction(s2t('set'), d, DialogModes.NO);
            }

            this.stepBack = function () {
                (r = new ActionReference()).putEnumerated(charIDToTypeID('HstS'), s2t('ordinal'), s2t('previous'));
                (d = new ActionDescriptor()).putReference(s2t('null'), r);
                executeAction(s2t('select'), d, DialogModes.NO);
            }

            this.deselect = function () {
                (r = new ActionReference()).putProperty(s2t('channel'), s2t('selection'));
                (d = new ActionDescriptor()).putReference(s2t('null'), r);
                d.putEnumerated(s2t('to'), s2t('ordinal'), s2t('none'));
                executeAction(s2t('set'), d, DialogModes.NO);
            }

            this.makeCurves = function (from, to) {
                (r = new ActionReference()).putClass(s2t('adjustmentLayer'));
                (d = new ActionDescriptor()).putReference(s2t('null'), r);
                (d2 = new ActionDescriptor()).putEnumerated(s2t('presetKind'), s2t('presetKindType'), s2t('presetKindDefault'));
                (d1 = new ActionDescriptor()).putObject(s2t('type'), s2t('curves'), d2);
                d.putObject(s2t('using'), s2t('adjustmentLayer'), d1);
                executeAction(s2t('make'), d, DialogModes.NO);

                (r = new ActionReference()).putEnumerated(s2t('adjustmentLayer'), s2t('ordinal'), s2t('targetEnum'));
                (d = new ActionDescriptor()).putReference(s2t('null'), r);
                (d1 = new ActionDescriptor()).putEnumerated(s2t('presetKind'), s2t('presetKindType'), s2t('presetKindCustom'));

                var mode = to.length == 1 ? ['composite'] : ['red', 'green', 'blue'],
                    l = new ActionList();

                for (var i = 0; i < to.length; i++) {
                    (r1 = new ActionReference()).putEnumerated(s2t('channel'), s2t('channel'), s2t(mode[i]));
                    (d2 = new ActionDescriptor()).putReference(s2t('channel'), r1);
                    (d3 = new ActionDescriptor()).putDouble(s2t('horizontal'), 0);
                    d3.putDouble(s2t('vertical'), 0);
                    (l1 = new ActionList()).putObject(s2t('Pnt '), d3);
                    (d4 = new ActionDescriptor()).putDouble(s2t('horizontal'), from);
                    d4.putDouble(s2t('vertical'), to[i]);
                    l1.putObject(s2t('Pnt '), d4);
                    (d5 = new ActionDescriptor()).putDouble(s2t('horizontal'), 255);
                    d5.putDouble(s2t('vertical'), 255);
                    l1.putObject(s2t('Pnt '), d5);
                    d2.putList(s2t('curve'), l1);
                    l.putObject(s2t('curvesAdjustment'), d2);
                }

                d1.putList(s2t('adjustment'), l);
                d.putObject(s2t('to'), s2t('curves'), d1);
                executeAction(s2t('set'), d, DialogModes.NO);
            }

            break;
        case 'layer':
            this.liquify = function () {
                var mesh = String.fromCharCode(0, 0, 0, 16, 0, 0, 0, 1, 0, 0, 0, 0, 0, 8, 102, 97, 99, 101, 77, 101, 115, 104, 0, 0, 0, 3, 0, 0, 0, 21, 102, 97, 99, 101, 68, 101, 115, 99, 114, 105, 112, 116, 111, 114, 86, 101, 114, 115, 105, 111, 110, 108, 111, 110, 103, 0, 0, 0, 2, 0, 0, 0, 15, 102, 97, 99, 101, 77, 101, 115, 104, 86, 101, 114, 115, 105, 111, 110, 108, 111, 110, 103, 0, 0, 0, 2, 0, 0, 0, 12, 102, 97, 99, 101, 73, 110, 102, 111, 76, 105, 115, 116, 86, 108, 76, 115, 0, 0, 0, 1, 79, 98, 106, 99, 0, 0, 0, 1, 0, 0, 0, 0, 0, 8, 102, 97, 99, 101, 73, 110, 102, 111, 0, 0, 0, 3, 0, 0, 0, 10, 102, 97, 99, 101, 67, 101, 110, 116, 101, 114, 79, 98, 106, 99, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 110, 117, 108, 108, 0, 0, 0, 2, 0, 0, 0, 0, 88, 32, 32, 32, 100, 111, 117, 98, 63, 228, 166, 26, 13, 248, 61, 51, 0, 0, 0, 0, 89, 32, 32, 32, 100, 111, 117, 98, 63, 203, 48, 176, 9, 117, 167, 81, 0, 0, 0, 13, 102, 101, 97, 116, 117, 114, 101, 86, 97, 108, 117, 101, 115, 79, 98, 106, 99, 0, 0, 0, 1, 0, 0, 0, 0, 0, 13, 102, 101, 97, 116, 117, 114, 101, 86, 97, 108, 117, 101, 115, 0, 0, 0, 1, 0, 0, 0, 9, 110, 111, 115, 101, 87, 105, 100, 116, 104, 100, 111, 117, 98, 191, 240, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 102, 101, 97, 116, 117, 114, 101, 68, 105, 115, 112, 108, 97, 99, 101, 109, 101, 110, 116, 115, 79, 98, 106, 99, 0, 0, 0, 1, 0, 0, 0, 0, 0, 20, 102, 101, 97, 116, 117, 114, 101, 68, 105, 115, 112, 108, 97, 99, 101, 109, 101, 110, 116, 115, 0, 0, 0, 0);
                (d = new ActionDescriptor()).putData(s2t('faceMeshData'), mesh);
                executeAction(charIDToTypeID('LqFy'), d, DialogModes.NO);
            }

            this.levels = function (begin, end) {
                (d = new ActionDescriptor()).putEnumerated(s2t('presetKind'), s2t('presetKindType'), s2t('presetKindCustom'));
                (r = new ActionReference()).putEnumerated(s2t('channel'), s2t('channel'), s2t('composite'));
                (d1 = new ActionDescriptor()).putReference(s2t('channel'), r);
                (l = new ActionList()).putInteger(begin);
                l.putInteger(end);
                d1.putList(s2t('input'), l);
                (l1 = new ActionList()).putObject(s2t('levelsAdjustment'), d1);
                d.putList(s2t('adjustment'), l1);
                executeAction(s2t('levels'), d, DialogModes.NO);
            }

            this.copyToNewLayer = function () {
                executeAction(s2t("copyToLayer"), undefined, DialogModes.NO);
            }

            this.deleteCurrentLayer = function () {
                (r = new ActionReference()).putEnumerated(s2t("layer"), s2t("ordinal"), s2t("targetEnum"));
                (d = new ActionDescriptor()).putReference(s2t("null"), r);
                executeAction(s2t("delete"), d, DialogModes.NO);
            }
            break;
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
