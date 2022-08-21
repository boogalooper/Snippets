/**Automate Resize and Crop for objects?
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/automate-resize-and-crop-for-objects/td-p/13010323
 * https://youtu.be/KxKljXoXHmM
 */
#target photoshop
var lr = new AM('layer'),
    doc = new AM('document');
activeDocument.suspendHistory('Align and fit subjects', 'alignAndFit()')
function alignAndFit() { app.doProgress('', 'main ()') }
function main() {
    var targets = [],
        targetIds = doc.getProperty('targetLayersIDs');
    app.updateProgress(1, 2)
    for (var i = 0; i < targetIds.count; i++) {
        doc.selectLayer(id = targetIds.getReference(i).getIdentifier('layerID'))
        app.changeProgressText('Find object bounds: ' + lr.getProperty('name', false, id))
        lr.autoCutout();
        if (doc.hasProperty('selection')) {
            var subject = doc.descToObject(doc.getProperty('selection'))
            lr.deselect()
            with (subject) {
                subject.width = right - left
                subject.height = bottom - top
                subject.center = { y: top + height / 2, x: left + width / 2 }
                subject.vertical = bottom - top > right - left
            }
            subject.id = id
            targets.push(subject)
        }
    }
    app.updateProgress(2, 2)
    if (targets.length > 1) {
        sample = targets.shift()
        for (var i = 0; i < targets.length; i++) {
            lr.selectLayer(targets[i].id)
            app.changeProgressText('Align layer: ' + lr.getProperty('name', false, targets[i].id))
            lr.transform(sample.center.x - targets[i].center.x, sample.center.y - targets[i].center.y,
                sample.vertical ? sample.width / targets[i].width * 100 : sample.height / targets[i].height * 100,
                targets[i].center.x, targets[i].center.y)
        }
    }
}
function AM(target, order) {
    var s2t = stringIDToTypeID,
        t2s = typeIDToStringID;
    target = s2t(target)
    this.getProperty = function (property, descMode, id, idxMode) {
        property = s2t(property);
        (r = new ActionReference()).putProperty(s2t('property'), property);
        id != undefined ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id)) :
            r.putEnumerated(target, s2t('ordinal'), order ? s2t(order) : s2t('targetEnum'));
        return descMode ? executeActionGet(r) : getDescValue(executeActionGet(r), property)
    }
    this.hasProperty = function (property, id, idxMode) {
        property = s2t(property);
        (r = new ActionReference()).putProperty(s2t('property'), property);
        id ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id))
            : r.putEnumerated(target, s2t('ordinal'), order ? s2t(order) : s2t('targetEnum'));
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
    this.selectLayer = function (id, add) {
        add = (add == undefined) ? add = false : add;
        (r = new ActionReference()).putIdentifier(s2t('layer'), id);
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        if (add) { d.putEnumerated(s2t('selectionModifier'), s2t('selectionModifierType'), s2t('addToSelection')) }
        d.putBoolean(s2t('makeVisible'), false)
        executeAction(s2t('select'), d, DialogModes.NO)
    }
    this.deselect = function () {
        (r = new ActionReference()).putProperty(s2t('channel'), s2t('selection'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        d.putEnumerated(s2t('to'), s2t('ordinal'), s2t('none'));
        executeAction(s2t('set'), d, DialogModes.NO);
    }
    this.autoCutout = function (sampleAllLayers) {
        sampleAllLayers = sampleAllLayers == undefined ? false : true;
        (d = new ActionDescriptor()).putBoolean(s2t('sampleAllLayers'), sampleAllLayers);
        executeAction(s2t('autoCutout'), d, DialogModes.NO);
    }
    this.transform = function (dX, dY, scale, x, y) {
        (r = new ActionReference()).putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        d.putEnumerated(s2t("freeTransformCenterState"), s2t("quadCenterState"), s2t("QCSIndependent"));
        ((d1 = new ActionDescriptor())).putUnitDouble(s2t('horizontal'), s2t('pixelsUnit'), x);
        d1.putUnitDouble(s2t('vertical'), s2t('pixelsUnit'), y);
        d.putObject(s2t('position'), s2t('paint'), d1);
        (d2 = new ActionDescriptor()).putUnitDouble(s2t('horizontal'), s2t('pixelsUnit'), dX);
        d2.putUnitDouble(s2t('vertical'), s2t('pixelsUnit'), dY);
        d.putObject(s2t('offset'), s2t('offset'), d2);
        d.putUnitDouble(s2t('width'), s2t('percentUnit'), scale);
        d.putUnitDouble(s2t('height'), s2t('percentUnit'), scale);
        d.putEnumerated(s2t('interfaceIconFrameDimmed'), s2t('interpolationType'), s2t('bicubic'));
        executeAction(s2t('transform'), d, DialogModes.NO);
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