/**Selecting the most prominent color from a PSD layer 
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/adobe-script-selecting-the-most-prominent-color-from-a-psd-layer/td-p/14054526
 */
var apl = new AM('application'),
    doc = new AM('document');
const DE_THRESHOLD = 15,
    RESIZE_TO = 35;
if (apl.getProperty('numberOfDocuments')) {
    var docRes = doc.getProperty('resolution'),
        docW = doc.getProperty('width') * docRes / 72,
        docH = doc.getProperty('height') * docRes / 72;
    doc.duplicate();
    doc.resize(docW > docH ? 'width' : 'height', RESIZE_TO)
    var f = new File(Folder.temp + '/colors.raw');
    doc.flatten();
    doc.saveToRAW(f);
    doc.close('no');
    var colors = findColors(f);
    f.remove();
    for (var i = 0; i < colors.length; i++) {
        colors[i][3] = 0;
        for (var x = 0; x < colors.length; x++) {
            if (x != i && dE(colors[i], colors[x]) <= DE_THRESHOLD) colors[i][3]++
        }
    }
    var result = 0,
        idx = null;
    for (var i = 0; i < colors.length; i++) {
        if (colors[i][3] >= result) { result = colors[i][3]; idx = i; }
    }
    var c = new SolidColor;
    c.rgb.red = colors[idx][0],
        c.rgb.green = colors[idx][1],
        c.rgb.blue = colors[idx][2];
    foregroundColor = c;
}
function findColors(f) {
    var content = '';
    if (f.exists) {
        f.open('r');
        f.encoding = "BINARY";
        content = f.read();
        f.close();
        f.remove();
        return colors = function (s) {
            var m = [],
                offset = 0;
            do {
                var c = [];
                for (i = 0; i < 3; i++) {
                    var k = s.charCodeAt(offset + i);
                    c.push(k)
                };
                m.push(c)
                offset += 3;
            } while (offset < s.length)
            return m;
        }(content);
    }
}
function dE(a, b) {
    return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2) + Math.pow(a[2] - b[2], 2));
}
function AM(target) {
    var s2t = stringIDToTypeID,
        t2s = typeIDToStringID,
        c2t = charIDToTypeID;
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
    this.resize = function (dimension, value) {
        (d = new ActionDescriptor()).putUnitDouble(s2t(dimension), s2t("pixelsUnit"), value);
        d.putBoolean(s2t("constrainProportions"), true);
        d.putEnumerated(c2t("Intr"), s2t("interpolationType"), s2t("automaticInterpolation"));
        executeAction(s2t("imageSize"), d, DialogModes.NO);
    }
    this.flatten = function () {
        executeAction(s2t("flattenImage"), new ActionDescriptor(), DialogModes.NO);
    }
    this.saveToRAW = function (f) {
        (d = new ActionDescriptor()).putBoolean(s2t('copy'), true);
        (d1 = new ActionDescriptor()).putObject(s2t("as"), s2t("rawFormat"), d);
        d1.putPath(s2t("in"), f);
        executeAction(s2t("save"), d1, DialogModes.NO);
    }
    this.duplicate = function () {
        (r = new ActionReference()).putEnumerated(target, s2t("ordinal"), s2t("targetEnum"));
        (d = new ActionDescriptor()).putReference(s2t("null"), r);
        executeAction(s2t("duplicate"), d, DialogModes.NO);
    }
    this.close = function (yesNo) {
        (d = new ActionDescriptor()).putEnumerated(s2t("saving"), s2t("yesNo"), s2t(yesNo));
        executeAction(s2t("close"), d, DialogModes.NO);
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