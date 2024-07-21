#target photoshop

var targetRGB = [50, 50, 50]

if ((new AM('application')).getProperty('numberOfDocuments')) {
    var lr = new AM('layer'),
        doc = new AM('document'),
        bounds = doc.descToObject(lr.getProperty('bounds'));
    doc.makeSelection(bounds)
    makeCurves()
}

function makeCurves() {
    var doc = new AM('document');
    if (doc.hasProperty('selection') && doc.getProperty('mode')[1] == 'RGBColor') {
        var midtone = []
        if (targetRGB instanceof Array) {
            var ch = new AM('channel')
            for (var i = 0; i < 3; i++) {
                midtone.push(getMidTone(ch.getProperty('histogram', i + 1, true)))
            }
        }
        doc.deselect()
        doc.makeCurves(targetRGB, midtone)
    }
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
            this.makeSelection = function (bounds) {
                (r = new ActionReference()).putProperty(s2t('channel'), s2t('selection'));
                (d = new ActionDescriptor()).putReference(s2t('null'), r);
                (d1 = new ActionDescriptor()).putUnitDouble(s2t('top'), s2t('pixelsUnit'), bounds.top);
                d1.putUnitDouble(s2t('left'), s2t('pixelsUnit'), bounds.left);
                d1.putUnitDouble(s2t('bottom'), s2t('pixelsUnit'), bounds.bottom);
                d1.putUnitDouble(s2t('right'), s2t('pixelsUnit'), bounds.right);
                d.putObject(s2t('to'), s2t('rectangle'), d1);
                executeAction(s2t('set'), d, DialogModes.NO);
            }
            this.deselect = function () {
                (r = new ActionReference()).putProperty(s2t('channel'), s2t('selection'));
                (d = new ActionDescriptor()).putReference(s2t('null'), r);
                d.putEnumerated(s2t('to'), s2t('ordinal'), s2t('none'));
                executeAction(s2t('set'), d, DialogModes.NO);
            }
            this.makeCurves = function (to, from) {
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
                    (d4 = new ActionDescriptor()).putDouble(s2t('horizontal'), from[i]);
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
