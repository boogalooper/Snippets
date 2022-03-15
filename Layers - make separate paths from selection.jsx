/**Деление выделения на сегменты, заливка каждого сегмента произвольным цветом
 * https://community.adobe.com/t5/photoshop-ecosystem/is-it-possible-to-automate-filling-multiple-selections-with-random-colors/m-p/12348736
 * https://youtu.be/9dBFSqCK7ng
 */
#target photoshop
activeDocument.suspendHistory('fill selection', 'main()')
function main() {
    var doc = new AM('document'),
        lr = new AM('layer'),
        pth = new AM('path'),
        channel = new AM('channel'),
        presentColors = {};
    doForcedProgress("", "fillSelection()")
    function fillSelection() {
        if (doc.hasProperty('selection')) {
            lr.makeChannelFromSelection('selection')
            lr.makePathFromSelection(1);
            lr.select(lr.newLayer('colors'))
            var pathContents = pth.getProperty('pathContents').value.getList(stringIDToTypeID('pathComponents'))
            try {
                channel.delete('current fill')
                channel.makeSelection('selection')
            } catch (e) { }
            for (var i = 0; i < pathContents.count; i++) {
                updateProgress(i + 1, pathContents.count);
                changeProgressText(i);
                pth.makePathFromSubpath(pathContents.getObjectValue(i))
                pth.makeSelectionFromPath()
                lr.expandSelection(1)
                lr.makeChannelFromSelection('current fill')
                channel.select('current fill')
                doc.deselect()
                channel.invert()
                channel.makeSelection('selection')
                channel.subtractFromSelection('current fill')
                channel.delete('current fill')
                lr.fillByRandomColor(presentColors)
            }
            lr.deselect()
            channel.delete('selection')
            pth.delete()
        }
    }
}
function AM(target, order) {
    var s2t = stringIDToTypeID,
        t2s = typeIDToStringID;
    target = target ? s2t(target) : null;
    this.getProperty = function (property, id, idxMode) {
        property = s2t(property);
        (r = new ActionReference()).putProperty(s2t('property'), property);
        id != undefined ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id)) :
            r.putEnumerated(target, s2t('ordinal'), order ? s2t(order) : s2t('targetEnum'));
        return getDescValue(executeActionGet(r), property)
    }
    this.hasProperty = function (property, id, idxMode) {
        property = s2t(property);
        (r = new ActionReference()).putProperty(s2t('property'), property);
        id ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id))
            : r.putEnumerated(target, s2t('ordinal'), order ? s2t(order) : s2t('targetEnum'));
        return executeActionGet(r).hasKey(property)
    }
    this.select = function (id) {
        var r = new ActionReference();
        if (typeof id == 'number') r.putIdentifier(target, id) else r.putName(target, id);
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        executeAction(s2t('select'), d, DialogModes.NO);
    }
    this.makeSelectionFromPath = function () {
        (r = new ActionReference()).putProperty(s2t('channel'), s2t('selection'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        (r1 = new ActionReference()).putProperty(s2t('path'), s2t('workPath'));
        d.putReference(s2t('to'), r1);
        d.putBoolean(s2t('vectorMaskParams'), true);
        executeAction(s2t('set'), d, DialogModes.NO);
    }
    this.deleteCurrentPath = function () {
        (r = new ActionReference()).putProperty(s2t('path'), s2t('workPath'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        executeAction(s2t('delete'), d, DialogModes.NO);
    }
    this.makePathFromSelection = function (tolerance) {
        tolerance = tolerance ? tolerance : 10;
        (r = new ActionReference()).putClass(s2t('path'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        (r1 = new ActionReference()).putProperty(s2t('selectionClass'), s2t('selection'));
        d.putReference(s2t('from'), r1);
        d.putUnitDouble(s2t('tolerance'), s2t('pixelsUnit'), tolerance);
        executeAction(s2t('make'), d, DialogModes.NO);
    }
    this.makePathFromSubpath = function (pth) {
        (r = new ActionReference()).putProperty(stringIDToTypeID("path"), stringIDToTypeID("workPath"));
        (d = new ActionDescriptor()).putReference(stringIDToTypeID("null"), r);
        (l = new ActionList()).putObject(stringIDToTypeID("pathComponent"), pth);
        d.putList(stringIDToTypeID("to"), l);
        executeAction(stringIDToTypeID("set"), d, DialogModes.NO);
    }
    this.newLayer = function (name) {
        (d1 = new ActionDescriptor()).putString(s2t('name'), name);
        (d = new ActionDescriptor()).putObject(s2t('new'), s2t('layer'), d1);
        return (executeAction(s2t('make'), d, DialogModes.NO)).getInteger(s2t('layerID'))
    }
    this.makeChannelFromSelection = function (name) {
        (d = new ActionDescriptor()).putString(s2t("name"), name);
        d.putEnumerated(s2t("colorIndicates"), s2t("maskIndicator"), s2t("selectedAreas"));
        (d1 = new ActionDescriptor()).putObject(s2t("new"), s2t("channel"), d);
        (r = new ActionReference()).putProperty(s2t("channel"), s2t("selection"));
        d1.putReference(s2t("using"), r);
        executeAction(s2t("make"), d1, DialogModes.NO);
    }
    this.deselect = function () {
        (r = new ActionReference()).putProperty(s2t('channel'), s2t('selection'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        d.putEnumerated(s2t('to'), s2t('ordinal'), s2t('none'));
        executeAction(s2t('set'), d, DialogModes.NO);
    }
    this.invert = function () {
        executeAction(s2t("invert"), undefined, DialogModes.NO);
    }
    this.makeSelection = function (name) {
        (r = new ActionReference()).putProperty(target, s2t('selection'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        (r1 = new ActionReference()).putName(target, name);
        d.putReference(s2t('to'), r1);
        executeAction(s2t('set'), d, DialogModes.NO);
    }
    this.subtractFromSelection = function (name) {
        (r = new ActionReference()).putName(target, name);
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        (r1 = new ActionReference()).putProperty(target, s2t('selection'));
        d.putReference(s2t('from'), r1);
        executeAction(s2t('subtract'), d, DialogModes.NO);
    }
    this.expandSelection = function (px) {
        (d = new ActionDescriptor()).putUnitDouble(s2t('by'), s2t('pixelsUnit'), px);
        executeAction(s2t('expand'), d, DialogModes.NO);
    }
    this.delete = function (name) {
        var r = new ActionReference();
        if (name) r.putName(target, name) else r.putEnumerated(target, s2t('ordinal'), s2t('targetEnum'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        executeAction(s2t('delete'), d, DialogModes.NO);
    }
    this.fillByRandomColor = function (colorObj) {
        var c = new SolidColor;
        with (c.rgb) {
            do {
                red = Math.random() * 255
                green = Math.random() * 255
                blue = Math.random() * 255
            } while (colorObj[hexValue])
            colorObj[hexValue] = true;
            (d = new ActionDescriptor()).putEnumerated(s2t("using"), s2t("fillContents"), s2t("color"));
            (d1 = new ActionDescriptor()).putDouble(s2t("red"), red);
            d1.putDouble(s2t("green"), green);
            d1.putDouble(s2t("blue"), blue);
            d.putObject(s2t("color"), s2t("RGBColor"), d1);
            executeAction(s2t("fill"), d, DialogModes.NO);
        }
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