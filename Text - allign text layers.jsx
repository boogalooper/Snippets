#target photoshop;

var s2t = stringIDToTypeID,
    t2s = typeIDToStringID;


var ids = []
for (var i = 0; i < 2; i++) {
    ids.push(app.activeDocument.layers[i].id)
}

var AM = new ActionManager;
var units = AM.getRulerUnits()
AM.setRulerUnits('rulerPixels')
var h = AM.getDocProperty('height')
var w = AM.getDocProperty('width')
var lr1 = AM.getLayerPropertyById('textKey', ids[0])
var lr2 = AM.getLayerPropertyById('textKey', ids[1])

var l1 = AM.getTextRect(AM.getLayerPropertyById('textKey', ids[0]), w, h)
var l2 = AM.getTextRect(lr2, w, h)
AM.setRulerUnits(units)
var v = 


function getVector(l1, l2) {
    var x1 = l2[2][0],
        x2 = l2[3][0],
        y1 = l2[2][1],
        y2 = l2[3][1],
        x3 = (l1[2][0] + l1[3][0]) / 2,
        y3 = (l1[2][1] + l1[3][1]) / 2;

    var x4 = ((x2 - x1) * (y2 - y1) * (y3 - y1) + x1 * Math.pow(y2 - y1, 2) + x3 * Math.pow(x2 - x1, 2)) / (Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2)),
        y4 = (y2 - y1) * (x4 - x1) / (x2 - x1) + y1;

    return [x4 - x3, y4 - y3]
}

function ActionManager() {
    var gLayer = s2t('layer'),
        gOrdinal = s2t('ordinal'),
        gTargetEnum = s2t('targetEnum'),
        gProperty = s2t('property'),
        gTop = s2t('top'),
        gLeft = s2t('left'),
        gBottom = s2t('bottom'),
        gRight = s2t('right'),
        gDocument = s2t('document'),
        gNull = s2t('null'),
        gSelectionModifier = s2t('selectionModifier'),
        gSelectionModifierType = s2t('selectionModifierType'),
        gAddToSelection = s2t('addToSelection'),
        gMakeVisible = s2t('makeVisible'),
        gSelect = s2t('select'),
        gRulerUnits = s2t('rulerUnits'),
        gApplication = s2t('application'),
        gUnitsPrefs = s2t('unitsPrefs'),
        gTo = s2t('to'),
        gSet = s2t('set'),
        gTransform = s2t('transform'),
        gXx = s2t('xx'),
        gXy = s2t('xy'),
        gYx = s2t('yx'),
        gYy = s2t('yy'),
        gTx = s2t('tx'),
        gTy = s2t('ty'),
        gBounds = s2t('bounds'),
        gTextClickPoint = s2t('textClickPoint'),
        gVertical = s2t('vertical'),
        gHorizontal = s2t('horizontal');
    ////
    this.getRulerUnits = function () {
        (r = new ActionReference()).putProperty(gProperty, gRulerUnits)
        r.putEnumerated(gApplication, gOrdinal, gTargetEnum);
        return t2s(executeActionGet(r).getEnumerationValue(gRulerUnits));
    }

    this.setRulerUnits = function (units) {
        (r = new ActionReference()).putProperty(gProperty, gUnitsPrefs);
        r.putEnumerated(gApplication, gOrdinal, gTargetEnum);
        (d = new ActionDescriptor).putReference(gNull, r);
        (d1 = new ActionDescriptor).putEnumerated(gRulerUnits, gRulerUnits, s2t(units));
        d.putObject(gTo, gUnitsPrefs, d1);
        executeAction(gSet, d, DialogModes.NO);
    }

    this.getTextRect = function (textKey, width, height) {
        var xx = 1,
            xy = 0,
            yx = 0,
            yy = 1,
            tx = 0,
            ty = 0;

        if (textKey.hasKey(gTransform)) {
            xx = textKey.getObjectValue(gTransform).getDouble(gXx);
            xy = textKey.getObjectValue(gTransform).getDouble(gXy);
            yx = textKey.getObjectValue(gTransform).getDouble(gYx);
            yy = textKey.getObjectValue(gTransform).getDouble(gYy);
            tx = textKey.getObjectValue(gTransform).getDouble(gTx); // not used
            ty = textKey.getObjectValue(gTransform).getDouble(gTy); // not used
        }

        var b = textKey.getObjectValue(gBounds),
            cp = textKey.getObjectValue(gTextClickPoint),
            x0 = b.getUnitDoubleValue(gLeft),
            y0 = b.getUnitDoubleValue(gTop),
            x1 = b.getUnitDoubleValue(gRight),
            y1 = b.getUnitDoubleValue(gBottom),
            p = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]],
            ch = cp.getUnitDoubleValue(gHorizontal),
            cv = cp.getUnitDoubleValue(gVertical);

        tx += width * ch / 100;
        ty += height * cv / 100;

        tranform(p[0], xx, xy, yx, yy, tx, ty);
        tranform(p[1], xx, xy, yx, yy, tx, ty);
        tranform(p[2], xx, xy, yx, yy, tx, ty);
        tranform(p[3], xx, xy, yx, yy, tx, ty);

        return p

        function tranform(p, xx, xy, yx, yy, tx, ty) {
            var x = p[0],
                y = p[1];

            p[0] = xx * x + yx * y + tx;
            p[1] = xy * x + yy * y + ty;
        }
    }

    this.getDocProperty = function (property) {
        var ref = new ActionReference()
        ref.putProperty(gProperty, s2t(property))
        ref.putEnumerated(gDocument, gOrdinal, gTargetEnum)
        return getDescValue(executeActionGet(ref), s2t(property))
    }

    this.getLayerPropertyByIndex = function (property, index) {
        property = s2t(property)
        var ref = new ActionReference()
        ref.putProperty(gProperty, property)
        ref.putIndex(gLayer, index)
        return getDescValue(executeActionGet(ref), property)
    }

    this.getLayerPropertyById = function (property, id) {
        property = s2t(property)
        var ref = new ActionReference()
        ref.putProperty(gProperty, property)
        ref.putIdentifier(gLayer, id)
        return getDescValue(executeActionGet(ref), property)
    }

    this.getLayerReferenceById = function (id) {
        var ref = new ActionReference()
        ref.putIdentifier(gLayer, id)
        return ref
    }

    this.getOrdinalLayerProperty = function (property) {
        property = s2t(property)
        var ref = new ActionReference()
        ref.putProperty(gProperty, property)
        ref.putEnumerated(gLayer, gOrdinal, gTargetEnum)
        return getDescValue(executeActionGet(ref), property)
    }

    this.getCenter = function (bounds, id) {
        var top = bounds.getDouble(gTop)
        var left = bounds.getDouble(gLeft)
        this.bottom = bounds.getDouble(gBottom)
        var right = bounds.getDouble(gRight)

        this.id = id
        this.X = left + (right - left) / 2
        this.Y = top + (this.bottom - top) / 2

        return
    }

    this.selectLayer = function (ID, add) {
        add = (add == undefined) ? add = false : add

        var ref = new ActionReference()
        var desc = new ActionDescriptor()

        ref.putIdentifier(gLayer, ID)
        desc.putReference(gNull, ref)

        if (add) {
            desc.putEnumerated(gSelectionModifier, gSelectionModifierType, gAddToSelection)
        }
        desc.putBoolean(gMakeVisible, false)
        executeAction(gSelect, desc, DialogModes.NO)
    }

    this.moveLayer = function (offset) {
        var ref = new ActionReference()
        var desc = new ActionDescriptor()

        ref.putEnumerated(gLayer, gOrdinal, gTargetEnum)
        desc.putReference(gNull, ref)

        var d1 = new ActionDescriptor();
        d1.putUnitDouble(s2t("horizontal"), s2t("pixelsUnit"), offset[0]);
        d1.putUnitDouble(s2t("vertical"), s2t("pixelsUnit"), offset[1]);
        desc.putObject(s2t("to"), s2t("offset"), d1);
        executeAction(s2t("move"), desc, DialogModes.NO);
    }

    function getDescValue(desc, property) {

        switch (desc.getType(property)) {
            case DescValueType.OBJECTTYPE:
                return (desc.getObjectValue(property));
                break;
            case DescValueType.LISTTYPE:
                return desc.getList(property);
                break;
            case DescValueType.REFERENCETYPE:
                return desc.getReference(property);
                break;
            case DescValueType.BOOLEANTYPE:
                return desc.getBoolean(property);
                break;
            case DescValueType.STRINGTYPE:
                return desc.getString(property);
                break;
            case DescValueType.INTEGERTYPE:
                return desc.getInteger(property);
                break;
            case DescValueType.LARGEINTEGERTYPE:
                return desc.getLargeInteger(property);
                break;
            case DescValueType.DOUBLETYPE:
                return desc.getDouble(property);
                break;
            case DescValueType.ALIASTYPE:
                return desc.getPath(property);
                break;
            case DescValueType.CLASSTYPE:
                return desc.getClass(property);
                break;
            case DescValueType.UNITDOUBLE:
                return (desc.getUnitDoubleValue(property));
                break;
            case DescValueType.ENUMERATEDTYPE:
                return (t2s(desc.getEnumerationValue(property)));
                break;
            case DescValueType.RAWTYPE:
                var tempStr = desc.getData(property);
                var rawData = new Array();
                for (var tempi = 0; tempi < tempStr.length; tempi++) {
                    rawData[tempi] = tempStr.charCodeAt(tempi);
                }
                return rawData;
                break;
            default:
                break;
        };
    }
}
