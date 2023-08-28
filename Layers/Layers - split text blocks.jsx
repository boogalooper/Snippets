
/**
 * Automatic Tile Splitting 
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/automatic-tile-splitting/td-p/14043141
 */
var apl = new AM('application'),
    doc = new AM('document'),
    lr = new AM('layer'),
    tiles = [];
const THRESHOLD_LEVEL = 80,
    MINIMUM_RADIUS = 30,
    BLUR_DISTANCE = 200;
try {
    if (apl.getProperty('numberOfDocuments')) {
        activeDocument.suspendHistory('Tile Splitting', 'function () {}');
        activeDocument.suspendHistory('Trim', 'trim()');
        var docRes = doc.getProperty('resolution'),
            docW = doc.getProperty('width') * docRes / 72,
            docH = doc.getProperty('height') * docRes / 72;
        activeDocument.suspendHistory('Save strip', 'getPixelStrip()');
        doc.stepBack();
        if (tiles.length) {
            var title = doc.getProperty('title').replace(/\.[0-9a-z]+$/i, '') + '-',
                pth = doc.getProperty('fileReference').parent;
            for (var i = 0; i < tiles.length; i++) {
                doc.duplicate(i + 1);
                doc.makeSelection(tiles[i][0], 0, tiles[i][1], docW);
                doc.crop();
                lr.copyToLayer();
                doc.levels([128, 220]);
                doc.selectionFromChannel('RGB');
                doc.inverseSelection();
                var bounds = doc.getProperty('selection').value;
                lr.deleteLayer();
                doc.makeSelection(bounds.getDouble(stringIDToTypeID('top')) - 2, 0, bounds.getDouble(stringIDToTypeID('bottom')) + 2, docW);
                doc.crop();
                doc.saveToPNG(title + (i + 1), pth);
                doc.close('no');
            }
        }
        doc.stepBack();
    }
} catch (e) { alert('A lot of things can go wrong in this script. :(\n\n' + e) }
function trim() {
    lr.copyToLayer();
    lr.invert();
    lr.threshold(THRESHOLD_LEVEL);
    lr.trim('topLeftPixelColor', 1, 1, 1, 1);
    lr.deleteLayer();
}
function getPixelStrip() {
    lr.copyToLayer();
    lr.filterMinimum(MINIMUM_RADIUS, 'squareness');
    lr.motionBlur(0, BLUR_DISTANCE)
    lr.levels([195, 220])
    doc.makeSelection(0, 0, docH, 1);
    doc.flatten();
    doc.crop();
    doc.convertToGrayscale();
    var f = new File(Folder.temp + '/colors.raw');
    doc.saveToRAW(f)
    tiles = findTiles(f);
}
function findTiles(f) {
    var content = '';
    if (f.exists) {
        f.open('r');
        f.encoding = "BINARY";
        content = f.read();
        f.close();
        f.remove();
        var colors = function (s) {
            var m = 0, c = [];
            for (var i = 0; i < s.length; i++) {
                var k = s.charCodeAt(i); m += k; c.push(k)
            };
            return c
        }(content);
        var tiles = [],
            cur = 0;
        do {
            var tile = [];
            for (cur; cur < colors.length; cur++) {
                if (cur == colors.length - 1) {
                    c = 0
                }
                if (colors[cur] < 16) {
                    if (!tile.length || cur == colors.length - 1) {
                        tile.push(cur)
                        if (cur == colors.length - 1) tiles.push(tile);
                    } else continue;
                }
                if (colors[cur] > 128) {
                    if (tile.length == 1) {
                        tile.push(cur - 1);
                        tiles.push(tile);
                        break;
                    } else continue;
                }
            }
            if (cur == colors.length) break;
        } while (true);
        return tiles;
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
    this.invert = function () {
        executeAction(s2t("invert"), new ActionDescriptor(), DialogModes.NO);
    }
    this.threshold = function (level) {
        (d = new ActionDescriptor()).putInteger(s2t("level"), level);
        executeAction(s2t("thresholdClassEvent"), d, DialogModes.NO);
    }
    this.trim = function (mode, top, bottom, left, right) {
        (d = new ActionDescriptor()).putEnumerated(s2t("trimBasedOn"), s2t("trimBasedOn"), s2t(mode));
        d.putBoolean(s2t("top"), top);
        d.putBoolean(s2t("bottom"), bottom);
        d.putBoolean(s2t("left"), left);
        d.putBoolean(s2t("right"), right);
        executeAction(s2t("trim"), d, DialogModes.NO);
    }
    this.filterMinimum = function (radius, mode) {
        (d = new ActionDescriptor()).putUnitDouble(c2t("Rds "), s2t("pixelsUnit"), radius);
        d.putEnumerated(s2t("preserveShape"), s2t("preserveShape"), s2t(mode));
        executeAction(s2t("minimum"), d, DialogModes.NO);
    }
    this.motionBlur = function (angle, distance) {
        (d = new ActionDescriptor()).putInteger(s2t("angle"), angle);
        d.putUnitDouble(s2t("distance"), s2t("pixelsUnit"), distance);
        executeAction(s2t("motionBlur"), d, DialogModes.NO);
    }
    this.levels = function (levels) {
        (d = new ActionDescriptor()).putEnumerated(s2t("presetKind"), s2t("presetKindType"), s2t("presetKindCustom"));
        (r = new ActionReference()).putEnumerated(s2t("channel"), s2t("channel"), s2t("composite"));
        (d1 = new ActionDescriptor()).putReference(s2t("channel"), r);
        var l1 = new ActionList();
        for (var i = 0; i < levels.length; i++)  l1.putInteger(levels[i]);
        d1.putList(s2t("input"), l1);
        (l = new ActionList()).putObject(s2t("levelsAdjustment"), d1);
        d.putList(s2t("adjustment"), l);
        executeAction(s2t("levels"), d, DialogModes.NO);
    }
    this.convertToGrayscale = function () {
        (d = new ActionDescriptor()).putClass(s2t("to"), s2t("grayscaleMode"));
        executeAction(s2t("convertMode"), d, DialogModes.NO);
    }
    this.flatten = function () {
        executeAction(s2t("flattenImage"), new ActionDescriptor(), DialogModes.NO);
    }
    this.stepBack = function () {
        (r = new ActionReference()).putProperty(c2t("HstS"), s2t("currentHistoryState"));
        (d = new ActionDescriptor()).putReference(s2t("target"), r);
        executeAction(s2t("delete"), d, DialogModes.NO);
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
    this.saveToRAW = function (f) {
        (d = new ActionDescriptor()).putBoolean(s2t('copy'), true);
        (d1 = new ActionDescriptor()).putObject(s2t("as"), s2t("rawFormat"), d);
        d1.putPath(s2t("in"), f);
        executeAction(s2t("save"), d1, DialogModes.NO);
    }
    this.saveToPNG = function (title, pth) {
        (d = new ActionDescriptor()).putObject(s2t("as"), s2t("PNGFormat"), new ActionDescriptor());
        d.putPath(s2t("in"), new File(pth + '/' + title + '.png'));
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