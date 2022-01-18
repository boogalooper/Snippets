/*Scripting radial cutout's
https://community.adobe.com/t5/photoshop-ecosystem-discussions/scripting-radial-cutout-s/td-p/12637485*/

#target photoshop

var selWidth = 70, //percents
    selHeight = 90, //percents
    doc = new AM('document'),
    res = doc.getProperty('resolution'),
    docWidth = doc.getProperty('width') * res / 72,
    docHeight = doc.getProperty('height') * res / 72;

doc.makeEllipseSelection(
    (docHeight - docHeight * selHeight / 100) / 2,
    (docWidth - docWidth * selWidth / 100) / 2,
    docHeight - (docHeight - docHeight * selHeight / 100) / 2,
    docWidth - (docWidth - docWidth * selWidth / 100) / 2,
    true
)

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
        try { return executeActionGet(r).hasKey(property) } catch (e) { return false }
    }

    this.descToObject = function (d) {
        var o = {}
        for (var i = 0; i < d.count; i++) {
            var k = d.getKey(i)
            o[t2s(k)] = getDescValue(d, k)
        }
        return o
    }

    this.makeEllipseSelection = function (top, left, bottom, right, AntA) {
        (r = new ActionReference()).putProperty(s2t('channel'), s2t('selection'));
        (d = new ActionDescriptor()).putReference(s2t('target'), r);
        (d1 = new ActionDescriptor()).putUnitDouble(s2t('top'), s2t('pixelsUnit'), top);
        d1.putUnitDouble(s2t('left'), s2t('pixelsUnit'), left);
        d1.putUnitDouble(s2t('bottom'), s2t('pixelsUnit'), bottom);
        d1.putUnitDouble(s2t('right'), s2t('pixelsUnit'), right);
        d.putObject(s2t('to'), s2t('ellipse'), d1);
        d.putBoolean(s2t('antiAlias'), AntA);
        executeAction(s2t('set'), d, DialogModes.NO);

    }
    function getDescValue(d, k) {
        switch (d.getType(k)) {
            case DescValueType.OBJECTTYPE: return { type: t2s(d.getObjectType(k)), value: d.getObjectValue(k) };
            case DescValueType.LISTTYPE: return d.getList(k);
            case DescValueType.REFERENCETYPE: return d.getReference(k);
            case DescValueType.BOOLEANTYPE: return d.getBoolean(k);
            case DescValueType.STRINGTYPE: return d.getString(k);
            case DescValueType.INTEGERTYPE: return d.getInteger(k);
            case DescValueType.LARGEINTEGERTYPE: return d.getLargeInteger(k);
            case DescValueType.DOUBLETYPE: return d.getDouble(k);
            case DescValueType.ALIASTYPE: return d.getPath(k);
            case DescValueType.CLASSTYPE: return d.getClass(k);
            case DescValueType.UNITDOUBLE: return (d.getUnitDoubleValue(k));
            case DescValueType.ENUMERATEDTYPE: return { type: t2s(d.getEnumerationType(k)), value: t2s(d.getEnumerationValue(k)) };
            default: break;
        };
    }
}

