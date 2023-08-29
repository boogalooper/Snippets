/**
 * Crop and straighten script photoshop 2023 
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/crop-and-straighten-script-photoshop-2023/m-p/14046082#M751034
 */
var apl = new AM('application'),
    doc = new AM('document'),
    lr = new AM('layer'),
    tiles = [];
const MAXIMUM_RADIUS = 4, //adjust filters -> other -> maximum filter to remove fine black lines
    GLOBAL_OFFSET = 30, //offset selection from the top line of the head
    HEAD_OFFSET = 10;   //offset initial object selection to clarify the position of an object
try {
    if (apl.getProperty('numberOfDocuments')) {
        activeDocument.suspendHistory('Tile Splitting', 'function () {}');
        var docRes = doc.getProperty('resolution'),
            docW = doc.getProperty('width') * docRes / 72,
            docH = doc.getProperty('height') * docRes / 72;
        activeDocument.suspendHistory('Find tiles', 'findTiles()');
        activeDocument.suspendHistory('Save tile', 'saveTile()');
    }
} catch (e) { alert('Many things can be wrong in this script. :(\n\n' + e) }
function findTiles() {
    var guides = activeDocument.guides;
    if (guides && guides.length) {
        var startRulerUnits = preferences.rulerUnits,
            startTypeUnits = preferences.typeUnits,
            v = [],
            h = [];
        preferences.rulerUnits = Units.PIXELS;
        preferences.typeUnits = TypeUnits.PIXELS;
        for (var i = 0; i < guides.length; i++) {
            var cur = guides[i];
            if (cur.direction == Direction.VERTICAL)
                v.push(guides[i].coordinate.value) else
                h.push(guides[i].coordinate.value)
        }
        var top = 0;
        do {
            var len = h.length,
                cur = h.length ? h.shift() : docH,
                left = 0;
            for (var i = 0; i < v.length; i++) {
                tiles.push([top, left, cur, v[i]]);
                left += v[0];
            }
            tiles.push([top, v[i - 1], cur, docW]);
            top = cur;
        } while (len)
        app.preferences.rulerUnits = startRulerUnits;
        app.preferences.typeUnits = startTypeUnits;
    }
}
function saveTile() {
    var title = doc.getProperty('title').replace(/\.[0-9a-z]+$/i, '') + '-',
        pth = doc.getProperty('fileReference').parent;
    for (var i = 0; i < tiles.length; i++) {
        doc.duplicate(i + 1);
        doc.makeSelection(tiles[i][0], tiles[i][1], tiles[i][2], tiles[i][3])
        doc.crop();
        lr.straightenLayer();
        doc.flatten();
        lr.copyToLayer();
        lr.filterMaximum(MAXIMUM_RADIUS, 'squareness')
        lr.selectSubject();
        lr.deleteLayer();
        var sel = doc.getProperty('selection').value;
        doc.makeSelection(
            sel.getDouble(stringIDToTypeID('top')) - GLOBAL_OFFSET,
            sel.getDouble(stringIDToTypeID('left')) - GLOBAL_OFFSET,
            sel.getDouble(stringIDToTypeID('bottom')) + GLOBAL_OFFSET,
            sel.getDouble(stringIDToTypeID('right')) + GLOBAL_OFFSET
        )
        doc.crop();
        lr.selectSubject();
        var sel = doc.getProperty('selection').value;
        doc.makeSelection(
            sel.getDouble(stringIDToTypeID('top')) - HEAD_OFFSET,
            sel.getDouble(stringIDToTypeID('left')),
            sel.getDouble(stringIDToTypeID('bottom')),
            sel.getDouble(stringIDToTypeID('right'))
        )
        doc.crop();
        doc.saveToPSD(title + (i + 1), pth);
        doc.close('no')
    }
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
    this.copyToLayer = function () {
        executeAction(s2t("copyToLayer"), undefined, DialogModes.NO);
    }
    this.filterMaximum = function (radius, mode) {
        (d = new ActionDescriptor()).putUnitDouble(c2t("Rds "), s2t("pixelsUnit"), radius);
        d.putEnumerated(s2t("preserveShape"), s2t("preserveShape"), s2t(mode));
        executeAction(s2t("maximum"), d, DialogModes.NO);
    }
    this.makeSelection = function (top, left, bottom, right) {
        (r = new ActionReference()).putProperty(s2t("channel"), s2t("selection"));
        (d = new ActionDescriptor()).putReference(s2t("null"), r);
        (d1 = new ActionDescriptor()).putUnitDouble(s2t("top"), s2t("pixelsUnit"), top);
        d1.putUnitDouble(s2t("left"), s2t("pixelsUnit"), left);
        d1.putUnitDouble(s2t("bottom"), s2t("pixelsUnit"), bottom);
        d1.putUnitDouble(s2t("right"), s2t("pixelsUnit"), right);
        d.putObject(s2t("to"), s2t("rectangle"), d1);
        executeAction(s2t("set"), d, DialogModes.NO);
    }
    this.crop = function () {
        (d = new ActionDescriptor()).putBoolean(s2t("delete"), true);
        executeAction(s2t("crop"), d, DialogModes.NO);
    }
    this.saveToPSD = function (title, pth) {
        (d = new ActionDescriptor()).putObject(s2t("as"), s2t("photoshop35Format"), new ActionDescriptor());
        d.putPath(s2t("in"), new File(pth + '/' + title));
        d.putBoolean(s2t("copy"), true);
        executeAction(s2t("save"), d, DialogModes.NO);
    }
    this.duplicate = function (title) {
        (r = new ActionReference()).putEnumerated(target, s2t("ordinal"), s2t("targetEnum"));
        (d = new ActionDescriptor()).putReference(s2t("null"), r);
        d.putString(s2t("name"), title);
        executeAction(s2t("duplicate"), d, DialogModes.NO);
    }
    this.selectionFromChannel = function (channel) {
        (r = new ActionReference()).putProperty(s2t("channel"), s2t("selection"));
        (d = new ActionDescriptor()).putReference(s2t("null"), r);
        (r1 = new ActionReference()).putEnumerated(s2t("channel"), s2t("channel"), s2t(channel));
        d.putReference(s2t("to"), r1);
        executeAction(s2t("set"), d, DialogModes.NO);
    }
    this.inverseSelection = function () {
        executeAction(s2t("inverse"), undefined, DialogModes.NO);
    }
    this.close = function (yesNo) {
        (d = new ActionDescriptor()).putEnumerated(s2t("saving"), s2t("yesNo"), s2t(yesNo));
        executeAction(s2t("close"), d, DialogModes.NO);
    }
    this.deleteLayer = function () {
        (r = new ActionReference()).putEnumerated(target, s2t('ordinal'), s2t('targetEnum'));
        (d = new ActionDescriptor()).putReference(s2t("null"), r);
        executeAction(s2t("delete"), d, DialogModes.NO);
    }
    this.selectSubject = function () {
        (d = new ActionDescriptor()).putBoolean(s2t("sampleAllLayers"), false);
        executeAction(s2t("autoCutout"), d, DialogModes.NO);
    }
    this.straightenLayer = function () {
        /** by r-bin
         * https://community.adobe.com/t5/photoshop-ecosystem/use-the-crop-amp-straighten-but-don-t-crop/m-p/12225478
         */
        var d = executeAction(stringIDToTypeID('CropPhotos0001'), undefined, DialogModes.NO);
        var l = d.getList(stringIDToTypeID('value'));
        var p = new Array();
        for (var i = 0; i < 8; i += 2) p.push([l.getDouble(i), l.getDouble(i + 1)]);
        var angle = - Math.atan2(p[1][1] - p[0][1], p[1][0] - p[0][0]) * 180 / Math.PI
        if (angle != 0) {
            if (activeDocument.activeLayer.isBackgroundLayer) executeAction(s2t('copyToLayer'), undefined, DialogModes.NO);
            (r = new ActionReference()).putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
            (d = new ActionDescriptor()).putReference(s2t('null'), r);
            d.putUnitDouble(s2t('angle'), s2t('angleUnit'), angle);
            executeAction(s2t('transform'), d, DialogModes.NO);
        }
    }
    this.flatten = function () {
        executeAction(s2t("flattenImage"), new ActionDescriptor(), DialogModes.NO);
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