/**Check the document for a margin or border
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/check-the-document-for-a-margin-or-border/td-p/12563008
 */
#target photoshop

var border = 5, //mm
    threshold = 0.1, // deviation of the size of the border on each side  
    doc = new AM('document'),
    res = doc.getProperty('resolution'),
    dW = doc.getProperty('width') * res / 72,
    dH = doc.getProperty('height') * res / 72;

doc.makeSelectionFromChannel('RGB')
doc.inverseSelection()
var lr = doc.descToObject(doc.getProperty('selection').value),
    margins = {
        left: lr.left / res * 25.4,
        top: lr.top / res * 25.4,
        right: (dW - lr.right) / res * 25.4,
        bottom: (dH - lr.bottom) / res * 25.4
    },
    err = (function (o, size) {
        for (var a in o) { if (Math.abs(size - o[a]) > threshold) return true };
        return false;
    })(margins, border);

if (!err) alert('Ok!') else alert('Not ok!\n' + margins.toSource())
doc.deselect()

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

    this.inverseSelection = function () {
        executeAction(s2t('inverse'), undefined, DialogModes.NO);
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