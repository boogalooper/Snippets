/** A script for automatic search, fit size, position of persons in the layers of a document.
 * https://www.youtube.com/watch?v=mx4DwQFhlL0
 * https://www.youtube.com/watch?v=XP5FWSPE0to
*/

/*
<javascriptresource>
<category>alignment</category>
<enableinfo>true</enableinfo>
</javascriptresource>
*/

const moveMode = 1// 0 - Align centers of the layers is turned off, 1 - Align of the centers of layers is included, 2 - Align only horizontally, 3 - Align only vertically
const transformMode = 1 // 0 - Scaling is turned off, 1 - Scaling is turned on
const rotateMode = 1 // 0 - The rotation of the head is turned off, 1 - the rotation of the head is turned on
const debugMode = 0 // 0 - Turned off, 1 - draw the found boundaries of the face and the positioning center
const dialogMode = DialogModes.NO // DialogModes.ALL - interactive transform,  DialogModes.NO - silent transform

#target photoshop

var AM = new ActionManager,
    selectedLayers = getSelectedLayersIds(),
    activeSelection = AM.getActiveDocumentProperty("selection"),
    len = selectedLayers.length

if (activeSelection) {
    if (len > 0) {
        getFaceBounds(selectedLayers)
        if (selectedLayers[0] instanceof Object) {
            AM.deselect()
            transformLayers(selectedLayers, new AM.measureSelection(activeSelection))
        }
    }
} else {
    if (len > 1) {
        app.doForcedProgress("Detect faces", "getFaceBounds(selectedLayers)")
        if (selectedLayers[0] instanceof Object) {
            app.doForcedProgress("Align layers", "transformLayers(selectedLayers, selectedLayers.shift())")
        }
    }
}


function getSelectedLayersIds() {
    if (!AM.getApplicationProperty("numberOfDocuments")) return []

    var sel = AM.getActiveDocumentProperty("targetLayers"),
        len = sel instanceof Object ? sel.count : 0,
        offcet = AM.getActiveDocumentProperty("hasBackgroundLayer") ? 0 : 1,
        output = []

    for (var i = 0; i < len; i++) {
        var id = AM.getLayerPropertyByIndex("layerID", sel.getReference(i).getIndex() + offcet)
        kind = AM.getLayerPropertyById("layerKind", id)

        if (i == 0 && AM.getLayerPropertyById("background", id)) { output.push(id) } else {
            if (kind == 1 || kind == 5) {
                if (!AM.isPixlelsLocked(AM.getLayerPropertyById("layerLocking", id))) output.push(id)
            }
        }
    }
    return output
}

function getFaceBounds(selectedLayers) {
    app.activeDocument.suspendHistory("Get face bounds", "function blankState () {return}")
    var len = selectedLayers.length
    for (var i = 0; i < len; i++) {
        if (i == 0 && AM.getLayerPropertyById("background", selectedLayers[i])) {
            AM.convertToLayer(selectedLayers[i], AM.getLayerPropertyById("name", selectedLayers[i]))
            selectedLayers[i] = AM.getLayerPropertyByIndex("layerID", 1)
        }
        app.changeProgressText("Get face bounds: " + AM.getLayerPropertyById("name", selectedLayers[i]))
        AM.selectLayerById(selectedLayers[i])
        var layerBoundsDesc = AM.getLayerPropertyById("bounds", selectedLayers[i]),
            measurerment = rotateMode ? ["L", "R", "F"] : ["E", "F"]

        measurerment = activeSelection ? ["S"] : measurerment

        if (layerBoundsDesc != null) {
            AM.convertActiveLayerToSmartObject()
            AM.editSmartObject()
            app.activeDocument.suspendHistory("Measure Face", "measureFace (measurerment)")
            if (checkMeasurment(measurerment)) {
                selectedLayers[i] = new getRelativeBounds(selectedLayers[i], measurerment)
            }
            AM.closeDocument()
            AM.selectPreviousHistoryState()
        }

    }

    function measureFace(measurerment) {
        AM.flatten()
        AM.convertToRGB()

        var len = measurerment.length
        for (var i = 1; i < len; i++) { AM.copyToLayer() }

        for (var i = 0; i < len; i++) {
            var levelsParams = AM.liquify(measurerment[i])
            AM.fade("difference")
            AM.levels(levelsParams)
            AM.makeSelectionFromChannel("blue")
            var selectionBoundsDesc = AM.getActiveDocumentProperty("selection")
            if (selectionBoundsDesc != null) { measurerment[i] = new AM.measureLayer(layerBoundsDesc, selectionBoundsDesc) } else { break; }

            if (i < len - 1) {
                AM.deleteCurrentLayer()
                AM.deselect()
            }
        }
    }

    function checkMeasurment(measurerment) {
        var len = measurerment.length
        for (var i = 0; i < len; i++) { if (typeof (measurerment[i]) != "object") return false }
        return true
    }

    function getRelativeBounds(id, measurerment) {

        this.offcet = 0
        this.angle = 0
        var shiftL = 0,
            shiftR = 0

        switch (measurerment.length) {
            case 1:
                var f = measurerment[0]
                this.X = f.left + (f.right - f.left) / 2
                this.Y = f.top + (f.bottom - f.top) / 2
                this.top = f.top
                break;
            case 2:
                var e = measurerment[0],
                    f = measurerment[1],
                    dl = Math.sqrt(Math.pow(e.left - f.left, 2)),
                    dr = Math.sqrt(Math.pow(f.right - e.right, 2)),
                    shift = Math.abs(dl - dr)

                shiftL = dl > dr ? shift : 0
                shiftR = dr > dl ? shift : 0

                this.X = e.left + (e.right - e.left) / 2 + shiftR - shiftL
                this.Y = e.top + (e.bottom - e.top) / 2
                this.top = e.top
                break;
            case 3:
                var l = measurerment[0],
                    r = measurerment[1],
                    f = measurerment[2],
                    x1 = l.left + (l.right - l.left) / 2,
                    y1 = l.top + (l.bottom - l.top) / 2,
                    x2 = r.left + (r.right - r.left) / 2,
                    y2 = r.top + (r.bottom - r.top) / 2,
                    dl = Math.sqrt(Math.pow(l.left - f.left, 2)),
                    dr = Math.sqrt(Math.pow(f.right - r.right, 2)),
                    shift = Math.abs(dl - dr)

                shiftL = dl < dr ? 0 : shift
                shiftR = dr < dl ? 0 : shift

                this.offcet = Math.abs(((Math.sqrt(Math.pow(r.right - l.left, 2) + Math.pow(r.top - l.top, 2))) - (r.right - l.left)) / 2)
                this.angle = - Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI
                this.X = (x1 + x2) / 2 + shiftR - shiftL
                this.Y = (y1 + y2) / 2
                this.top = l.top > r.top ? l.top : r.top
                break;
        }

        this.top = this.top - this.offcet
        this.bottom = f.bottom + this.offcet
        this.left = f.left - this.offcet
        this.right = f.right + this.offcet
        this.width = this.right - this.left
        this.height = this.bottom - this.top
        this.id = id
        this.measurerment = measurerment
        return
    }

}

function transformLayers(selectedLayers, baseLayer) {
    var len = selectedLayers.length

    if (debugMode && baseLayer.id != 0) {
        AM.selectLayerById(baseLayer.id)
        app.activeDocument.suspendHistory("Draw debug rectangle", "drawDebugRect (baseLayer)")
    }

    for (var i = 0; i < len; i++) {
        app.changeProgressText("Align layer: " + AM.getLayerPropertyById("name", selectedLayers[i].id))
        if (selectedLayers[i] instanceof Object) {
            AM.selectLayerById(selectedLayers[i].id)
            app.updateProgress(i + 1, len)
            if (selectedLayers[i] instanceof Object) {
                var dH = baseLayer.X - selectedLayers[i].X,
                    dV = baseLayer.Y - selectedLayers[i].Y,
                    scaleH = 100 / (selectedLayers[i].height / baseLayer.height),
                    scaleW = 100 / (selectedLayers[i].width / baseLayer.width),
                    scale = selectedLayers[i].height > selectedLayers[i].width ? scaleH : scaleW,
                    angle = selectedLayers[i].angle - (baseLayer.angle ? baseLayer.angle : 0)

                AM.selectLayerById(selectedLayers[i].id)

                if (debugMode) {
                    app.activeDocument.suspendHistory("Draw debug rectangle", "drawDebugRect (selectedLayers[i])")
                }

                scale = transformMode ? scale : 100
                angle = rotateMode ? angle : 0
                switch (moveMode) {
                    case 0: dV = dH = 0; break;
                    case 2: dV = 0; break;
                    case 3: dH = 0; break;
                }

                if (activeSelection) {
                    if (moveMode) AM.move(dH, dV)
                    if (transformMode || rotateMode) AM.transform(scale, baseLayer.X, baseLayer.Y, angle, dialogMode)
                } else {
                    if (transformMode || rotateMode) AM.transform(scale, selectedLayers[i].X, selectedLayers[i].Y, angle, dialogMode)
                    if (moveMode) AM.move(dH, dV)
                }
            }
        }
    }

    function drawDebugRect(layer) {
        AM.draw(layer.top, layer.left, layer.bottom, layer.right, "00ff00", 16)
        AM.draw(layer.Y - 8, layer.X - 8, layer.Y + 8, layer.X + 8, "00ff00", 16)

        var len = layer.measurerment.length
        for (var i = 0; i < len; i++) {
            cur = layer.measurerment[i]
            AM.draw(cur.top, cur.left, cur.bottom, cur.right, "fff600", 8)
            AM.draw(cur.Y - 4, cur.X - 4, cur.Y + 4, cur.X + 4, "ff0000", 8)
        }
    }
}

function ActionManager() {
    var gAdjustment = s2t("adjustment"),
        gAngle = s2t("angle"),
        gAngleUnit = s2t("angleUnit"),
        gApplication = s2t("application"),
        gBicubic = s2t("bicubic"),
        gBlendMode = s2t("blendMode"),
        gBacground = s2t("background"),
        gBottom = s2t("bottom"),
        gChannel = s2t("channel"),
        gClose = s2t("close"),
        gComposite = s2t("composite"),
        gConvertMode = s2t("convertMode"),
        gCopyToLayer = s2t("copyToLayer"),
        gDelete = s2t("delete"),
        gDocument = s2t("document"),
        gFaceMeshData = s2t("faceMeshData"),
        gFade = s2t("fade"),
        gFlatten = s2t("flattenImage"),
        gFreeTransformCenterState = s2t("freeTransformCenterState"),
        gGamma = s2t("gamma"),
        gHeight = s2t("height"),
        gHistoryState = s2t("historyState"),
        gHorizontal = s2t("horizontal"),
        gInput = s2t("input"),
        gInterfaceIconFrameDimmed = s2t("interfaceIconFrameDimmed"),
        gInterpolationType = s2t("interpolationType"),
        gLayer = s2t("layer"),
        gLayerId = s2t("layerID"),
        gLeft = s2t("left"),
        gLevels = s2t("levels"),
        gLevelsAdjustment = s2t("levelsAdjustment"),
        gLiquify = charIDToTypeID("LqFy"),
        gMakeVisible = s2t("makeVisible"),
        gMenu = s2t("menuItemClass"),
        gMenuItem = s2t("menuItemType"),
        gMode = s2t("mode"),
        gMove = s2t("move"),
        gName = s2t("name"),
        gNewPlacedLayer = s2t("newPlacedLayer"),
        gNo = s2t("no"),
        gNone = s2t("none"),
        gNull = s2t("null"),
        gOffset = s2t("offset"),
        gOrdinal = s2t("ordinal"),
        gPaint = s2t("paint"),
        gPercentUnit = s2t("percentUnit"),
        gPixelsUnit = s2t("pixelsUnit"),
        gPlacedLayerEditContents = s2t("placedLayerEditContents"),
        gPosition = s2t("position"),
        gPresetKind = s2t("presetKind"),
        gPresetKindCustom = s2t("presetKindCustom"),
        gPresetKindType = s2t("presetKindType"),
        gPrevious = s2t("previous"),
        gProperty = s2t("property"),
        gQCSIndependent = s2t("QCSIndependent"),
        gQuadCenterState = s2t("quadCenterState"),
        gRasterizePlaced = s2t("rasterizePlaced"),
        gRectangle = s2t("rectangle"),
        gRGBColorMode = s2t("RGBColorMode"),
        gRight = s2t("right"),
        gSave = s2t("saving"),
        gSelect = s2t("select"),
        gSelection = s2t("selection"),
        gSet = s2t("set"),
        gTargetEnum = s2t("targetEnum"),
        gTo = s2t("to"),
        gTop = s2t("top"),
        gTransform = s2t("transform"),
        gVertical = s2t("vertical"),
        gWidth = s2t("width"),
        gYes = s2t("yes"),
        gYesNo = s2t("yesNo")

    this.getApplicationProperty = function (property) {
        property = s2t(property)
        var ref = new ActionReference()
        ref.putProperty(gProperty, property)
        ref.putEnumerated(gApplication, gOrdinal, gTargetEnum)
        return getDescValue(executeActionGet(ref), property)
    }

    this.getActiveDocumentProperty = function (property) {
        property = s2t(property)
        var ref = new ActionReference()
        ref.putProperty(gProperty, property)
        ref.putEnumerated(gDocument, gOrdinal, gTargetEnum)
        return getDescValue(executeActionGet(ref), property)
    }

    this.getLayerPropertyById = function (property, id) {
        try {
            property = s2t(property)
            ref = new ActionReference()
            ref.putProperty(gProperty, property)
            ref.putIdentifier(gLayer, id)
            return getDescValue(executeActionGet(ref), property)
        } catch (e) { return "" }
    }

    this.getLayerPropertyByIndex = function (property, idx) {
        property = s2t(property)
        ref = new ActionReference()
        ref.putProperty(gProperty, property)
        ref.putIndex(gLayer, idx)
        return getDescValue(executeActionGet(ref), property)
    }

    this.selectLayerById = function (id) {
        var ref = new ActionReference();
        ref.putIdentifier(gLayer, id)
        var desc = new ActionDescriptor()
        desc.putReference(gNull, ref)
        desc.putBoolean(gMakeVisible, true)
        executeAction(gSelect, desc, DialogModes.NO)
    }

    this.isPixlelsLocked = function (desc) {
        // 1 - pixels, 2 - position. 4 - allLocked
        if (desc.getBoolean(desc.getKey(1)) || desc.getBoolean(desc.getKey(2)) || desc.getBoolean(desc.getKey(4))) return true
        return false
    }

    this.flatten = function () {
        executeAction(gFlatten, undefined, DialogModes.NO);
    }

    this.convertActiveLayerToSmartObject = function () {
        executeAction(gNewPlacedLayer, undefined, DialogModes.NO)
    }

    this.editSmartObject = function () {
        executeAction(gPlacedLayerEditContents, undefined, DialogModes.NO)
    }

    this.copyToLayer = function () {
        executeAction(gCopyToLayer, undefined, DialogModes.NO);
    }

    this.deleteCurrentLayer = function () {
        var desc = new ActionDescriptor()
        var ref = new ActionReference()

        ref.putEnumerated(gLayer, gOrdinal, gTargetEnum)
        desc.putReference(gNull, ref)
        executeAction(gDelete, desc, DialogModes.NO)
    }

    this.liquify = function (mode) {
        var params,
            levels = []
        switch (mode) {
            case "L":
                params = String.fromCharCode(0, 0, 0, 16, 0, 0, 0, 1, 0, 0, 0, 0, 0, 8, 102, 97, 99, 101, 77, 101, 115, 104, 0, 0, 0, 3, 0, 0, 0, 21, 102, 97, 99, 101, 68, 101, 115, 99, 114, 105, 112, 116, 111, 114, 86, 101, 114, 115, 105, 111, 110, 108, 111, 110, 103, 0, 0, 0, 2, 0, 0, 0, 15, 102, 97, 99, 101, 77, 101, 115, 104, 86, 101, 114, 115, 105, 111, 110, 108, 111, 110, 103, 0, 0, 0, 2, 0, 0, 0, 12, 102, 97, 99, 101, 73, 110, 102, 111, 76, 105, 115, 116, 86, 108, 76, 115, 0, 0, 0, 1, 79, 98, 106, 99, 0, 0, 0, 1, 0, 0, 0, 0, 0, 8, 102, 97, 99, 101, 73, 110, 102, 111, 0, 0, 0, 3, 0, 0, 0, 10, 102, 97, 99, 101, 67, 101, 110, 116, 101, 114, 79, 98, 106, 99, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 110, 117, 108, 108, 0, 0, 0, 2, 0, 0, 0, 0, 88, 32, 32, 32, 100, 111, 117, 98, 63, 222, 73, 253, 128, 0, 0, 0, 0, 0, 0, 0, 89, 32, 32, 32, 100, 111, 117, 98, 63, 212, 77, 77, 192, 0, 0, 0, 0, 0, 0, 13, 102, 101, 97, 116, 117, 114, 101, 86, 97, 108, 117, 101, 115, 79, 98, 106, 99, 0, 0, 0, 1, 0, 0, 0, 0, 0, 13, 102, 101, 97, 116, 117, 114, 101, 86, 97, 108, 117, 101, 115, 0, 0, 0, 1, 0, 0, 0, 13, 108, 101, 102, 116, 69, 121, 101, 72, 101, 105, 103, 104, 116, 100, 111, 117, 98, 191, 185, 153, 153, 160, 0, 0, 0, 0, 0, 0, 20, 102, 101, 97, 116, 117, 114, 101, 68, 105, 115, 112, 108, 97, 99, 101, 109, 101, 110, 116, 115, 79, 98, 106, 99, 0, 0, 0, 1, 0, 0, 0, 0, 0, 20, 102, 101, 97, 116, 117, 114, 101, 68, 105, 115, 112, 108, 97, 99, 101, 109, 101, 110, 116, 115, 0, 0, 0, 0)
                levels = [0, 0.3, 8]
                break;
            case "R":
                params = String.fromCharCode(0, 0, 0, 16, 0, 0, 0, 1, 0, 0, 0, 0, 0, 8, 102, 97, 99, 101, 77, 101, 115, 104, 0, 0, 0, 3, 0, 0, 0, 21, 102, 97, 99, 101, 68, 101, 115, 99, 114, 105, 112, 116, 111, 114, 86, 101, 114, 115, 105, 111, 110, 108, 111, 110, 103, 0, 0, 0, 2, 0, 0, 0, 15, 102, 97, 99, 101, 77, 101, 115, 104, 86, 101, 114, 115, 105, 111, 110, 108, 111, 110, 103, 0, 0, 0, 2, 0, 0, 0, 12, 102, 97, 99, 101, 73, 110, 102, 111, 76, 105, 115, 116, 86, 108, 76, 115, 0, 0, 0, 1, 79, 98, 106, 99, 0, 0, 0, 1, 0, 0, 0, 0, 0, 8, 102, 97, 99, 101, 73, 110, 102, 111, 0, 0, 0, 3, 0, 0, 0, 10, 102, 97, 99, 101, 67, 101, 110, 116, 101, 114, 79, 98, 106, 99, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 110, 117, 108, 108, 0, 0, 0, 2, 0, 0, 0, 0, 88, 32, 32, 32, 100, 111, 117, 98, 63, 222, 73, 253, 128, 0, 0, 0, 0, 0, 0, 0, 89, 32, 32, 32, 100, 111, 117, 98, 63, 212, 77, 77, 192, 0, 0, 0, 0, 0, 0, 13, 102, 101, 97, 116, 117, 114, 101, 86, 97, 108, 117, 101, 115, 79, 98, 106, 99, 0, 0, 0, 1, 0, 0, 0, 0, 0, 13, 102, 101, 97, 116, 117, 114, 101, 86, 97, 108, 117, 101, 115, 0, 0, 0, 1, 0, 0, 0, 14, 114, 105, 103, 104, 116, 69, 121, 101, 72, 101, 105, 103, 104, 116, 100, 111, 117, 98, 191, 185, 153, 153, 160, 0, 0, 0, 0, 0, 0, 20, 102, 101, 97, 116, 117, 114, 101, 68, 105, 115, 112, 108, 97, 99, 101, 109, 101, 110, 116, 115, 79, 98, 106, 99, 0, 0, 0, 1, 0, 0, 0, 0, 0, 20, 102, 101, 97, 116, 117, 114, 101, 68, 105, 115, 112, 108, 97, 99, 101, 109, 101, 110, 116, 115, 0, 0, 0, 0)
                levels = [0, 0.3, 8]
                break;
            case "F":
                params = String.fromCharCode(0, 0, 0, 16, 0, 0, 0, 1, 0, 0, 0, 0, 0, 8, 102, 97, 99, 101, 77, 101, 115, 104, 0, 0, 0, 3, 0, 0, 0, 21, 102, 97, 99, 101, 68, 101, 115, 99, 114, 105, 112, 116, 111, 114, 86, 101, 114, 115, 105, 111, 110, 108, 111, 110, 103, 0, 0, 0, 2, 0, 0, 0, 15, 102, 97, 99, 101, 77, 101, 115, 104, 86, 101, 114, 115, 105, 111, 110, 108, 111, 110, 103, 0, 0, 0, 2, 0, 0, 0, 12, 102, 97, 99, 101, 73, 110, 102, 111, 76, 105, 115, 116, 86, 108, 76, 115, 0, 0, 0, 1, 79, 98, 106, 99, 0, 0, 0, 1, 0, 0, 0, 0, 0, 8, 102, 97, 99, 101, 73, 110, 102, 111, 0, 0, 0, 3, 0, 0, 0, 10, 102, 97, 99, 101, 67, 101, 110, 116, 101, 114, 79, 98, 106, 99, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 110, 117, 108, 108, 0, 0, 0, 2, 0, 0, 0, 0, 88, 32, 32, 32, 100, 111, 117, 98, 63, 222, 243, 126, 128, 212, 223, 18, 0, 0, 0, 0, 89, 32, 32, 32, 100, 111, 117, 98, 63, 215, 73, 116, 44, 238, 218, 193, 0, 0, 0, 13, 102, 101, 97, 116, 117, 114, 101, 86, 97, 108, 117, 101, 115, 79, 98, 106, 99, 0, 0, 0, 1, 0, 0, 0, 0, 0, 13, 102, 101, 97, 116, 117, 114, 101, 86, 97, 108, 117, 101, 115, 0, 0, 0, 2, 0, 0, 0, 8, 108, 111, 119, 101, 114, 76, 105, 112, 100, 111, 117, 98, 63, 201, 153, 153, 160, 0, 0, 0, 0, 0, 0, 10, 110, 111, 115, 101, 72, 101, 105, 103, 104, 116, 100, 111, 117, 98, 63, 201, 153, 153, 160, 0, 0, 0, 0, 0, 0, 20, 102, 101, 97, 116, 117, 114, 101, 68, 105, 115, 112, 108, 97, 99, 101, 109, 101, 110, 116, 115, 79, 98, 106, 99, 0, 0, 0, 1, 0, 0, 0, 0, 0, 20, 102, 101, 97, 116, 117, 114, 101, 68, 105, 115, 112, 108, 97, 99, 101, 109, 101, 110, 116, 115, 0, 0, 0, 0)
                levels = [0, 0.8, 8]
                break;
            case "E":
                params = String.fromCharCode(0, 0, 0, 16, 0, 0, 0, 1, 0, 0, 0, 0, 0, 8, 102, 97, 99, 101, 77, 101, 115, 104, 0, 0, 0, 3, 0, 0, 0, 21, 102, 97, 99, 101, 68, 101, 115, 99, 114, 105, 112, 116, 111, 114, 86, 101, 114, 115, 105, 111, 110, 108, 111, 110, 103, 0, 0, 0, 2, 0, 0, 0, 15, 102, 97, 99, 101, 77, 101, 115, 104, 86, 101, 114, 115, 105, 111, 110, 108, 111, 110, 103, 0, 0, 0, 2, 0, 0, 0, 12, 102, 97, 99, 101, 73, 110, 102, 111, 76, 105, 115, 116, 86, 108, 76, 115, 0, 0, 0, 1, 79, 98, 106, 99, 0, 0, 0, 1, 0, 0, 0, 0, 0, 8, 102, 97, 99, 101, 73, 110, 102, 111, 0, 0, 0, 3, 0, 0, 0, 10, 102, 97, 99, 101, 67, 101, 110, 116, 101, 114, 79, 98, 106, 99, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 110, 117, 108, 108, 0, 0, 0, 2, 0, 0, 0, 0, 88, 32, 32, 32, 100, 111, 117, 98, 63, 214, 168, 24, 114, 155, 183, 191, 0, 0, 0, 0, 89, 32, 32, 32, 100, 111, 117, 98, 63, 198, 184, 100, 157, 44, 14, 74, 0, 0, 0, 13, 102, 101, 97, 116, 117, 114, 101, 86, 97, 108, 117, 101, 115, 79, 98, 106, 99, 0, 0, 0, 1, 0, 0, 0, 0, 0, 13, 102, 101, 97, 116, 117, 114, 101, 86, 97, 108, 117, 101, 115, 0, 0, 0, 3, 0, 0, 0, 9, 101, 121, 101, 72, 101, 105, 103, 104, 116, 100, 111, 117, 98, 191, 195, 51, 51, 64, 0, 0, 0, 0, 0, 0, 13, 108, 101, 102, 116, 69, 121, 101, 72, 101, 105, 103, 104, 116, 100, 111, 117, 98, 191, 195, 51, 51, 64, 0, 0, 0, 0, 0, 0, 14, 114, 105, 103, 104, 116, 69, 121, 101, 72, 101, 105, 103, 104, 116, 100, 111, 117, 98, 191, 195, 51, 51, 64, 0, 0, 0, 0, 0, 0, 20, 102, 101, 97, 116, 117, 114, 101, 68, 105, 115, 112, 108, 97, 99, 101, 109, 101, 110, 116, 115, 79, 98, 106, 99, 0, 0, 0, 1, 0, 0, 0, 0, 0, 20, 102, 101, 97, 116, 117, 114, 101, 68, 105, 115, 112, 108, 97, 99, 101, 109, 101, 110, 116, 115, 0, 0, 0, 0)
                levels = [0, 0.3, 8]
                break;
            case "S":
                params = String.fromCharCode(0, 0, 0, 16, 0, 0, 0, 1, 0, 0, 0, 0, 0, 8, 102, 97, 99, 101, 77, 101, 115, 104, 0, 0, 0, 3, 0, 0, 0, 21, 102, 97, 99, 101, 68, 101, 115, 99, 114, 105, 112, 116, 111, 114, 86, 101, 114, 115, 105, 111, 110, 108, 111, 110, 103, 0, 0, 0, 2, 0, 0, 0, 15, 102, 97, 99, 101, 77, 101, 115, 104, 86, 101, 114, 115, 105, 111, 110, 108, 111, 110, 103, 0, 0, 0, 2, 0, 0, 0, 12, 102, 97, 99, 101, 73, 110, 102, 111, 76, 105, 115, 116, 86, 108, 76, 115, 0, 0, 0, 1, 79, 98, 106, 99, 0, 0, 0, 1, 0, 0, 0, 0, 0, 8, 102, 97, 99, 101, 73, 110, 102, 111, 0, 0, 0, 3, 0, 0, 0, 10, 102, 97, 99, 101, 67, 101, 110, 116, 101, 114, 79, 98, 106, 99, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 110, 117, 108, 108, 0, 0, 0, 2, 0, 0, 0, 0, 88, 32, 32, 32, 100, 111, 117, 98, 63, 222, 85, 224, 192, 0, 0, 0, 0, 0, 0, 0, 89, 32, 32, 32, 100, 111, 117, 98, 63, 212, 77, 155, 106, 170, 170, 171, 0, 0, 0, 13, 102, 101, 97, 116, 117, 114, 101, 86, 97, 108, 117, 101, 115, 79, 98, 106, 99, 0, 0, 0, 1, 0, 0, 0, 0, 0, 13, 102, 101, 97, 116, 117, 114, 101, 86, 97, 108, 117, 101, 115, 0, 0, 0, 4, 0, 0, 0, 9, 101, 121, 101, 72, 101, 105, 103, 104, 116, 100, 111, 117, 98, 191, 185, 153, 153, 160, 0, 0, 0, 0, 0, 0, 13, 108, 101, 102, 116, 69, 121, 101, 72, 101, 105, 103, 104, 116, 100, 111, 117, 98, 191, 185, 153, 153, 160, 0, 0, 0, 0, 0, 0, 14, 114, 105, 103, 104, 116, 69, 121, 101, 72, 101, 105, 103, 104, 116, 100, 111, 117, 98, 191, 185, 153, 153, 160, 0, 0, 0, 0, 0, 0, 8, 108, 111, 119, 101, 114, 76, 105, 112, 100, 111, 117, 98, 191, 240, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 102, 101, 97, 116, 117, 114, 101, 68, 105, 115, 112, 108, 97, 99, 101, 109, 101, 110, 116, 115, 79, 98, 106, 99, 0, 0, 0, 1, 0, 0, 0, 0, 0, 20, 102, 101, 97, 116, 117, 114, 101, 68, 105, 115, 112, 108, 97, 99, 101, 109, 101, 110, 116, 115, 0, 0, 0, 0)
                levels = [0, 0.4, 8]
                break;
        }
        var desc = new ActionDescriptor()
        desc.putData(gFaceMeshData, params)
        executeAction(gLiquify, desc, DialogModes.NO)
        return levels
    }

    this.fade = function (mode) {
        mode = s2t(mode)
        var desc = new ActionDescriptor()
        desc.putEnumerated(gMode, gBlendMode, mode)
        executeAction(gFade, desc, DialogModes.NO)
    }

    this.levels = function (paramsArray) {
        var left = paramsArray[0],
            gamma = paramsArray[1],
            right = paramsArray[2]

        var desc = new ActionDescriptor()
        var desc2 = new ActionDescriptor()
        var list = new ActionList()
        var list2 = new ActionList()
        var ref = new ActionReference()
        desc.putEnumerated(gPresetKind, gPresetKindType, gPresetKindCustom)
        ref.putEnumerated(gChannel, gChannel, gComposite)
        desc2.putReference(gChannel, ref)
        list2.putInteger(left)
        list2.putInteger(right)
        desc2.putList(gInput, list2)
        desc2.putDouble(gGamma, gamma)
        list.putObject(gLevelsAdjustment, desc2)
        desc.putList(gAdjustment, list)
        executeAction(gLevels, desc, DialogModes.NO)
    }

    this.makeSelectionFromChannel = function (channel) {
        channel = s2t(channel)
        var desc = new ActionDescriptor()
        var ref = new ActionReference()
        var ref2 = new ActionReference()

        ref.putProperty(gChannel, gSelection)
        desc.putReference(gNull, ref)
        ref2.putEnumerated(gChannel, gChannel, channel)
        desc.putReference(gTo, ref2)
        executeAction(gSet, desc, DialogModes.NO)
    }

    this.convertToRGB = function () {
        var desc = new ActionDescriptor()
        desc.putClass(gTo, gRGBColorMode)
        executeAction(gConvertMode, desc, DialogModes.NO);
    }

    this.closeDocument = function (save) {
        save = save != true ? gNo : gYes
        var desc = new ActionDescriptor()
        desc.putEnumerated(gSave, gYesNo, save)
        executeAction(gClose, desc, DialogModes.NO)
    }

    this.selectPreviousHistoryState = function () {
        var desc = new ActionDescriptor()
        var ref = new ActionReference()
        ref.putEnumerated(gHistoryState, gOrdinal, gPrevious)
        desc.putReference(gNull, ref)
        executeAction(gSelect, desc, DialogModes.NO)
    }

    this.deselect = function () {
        var desc = new ActionDescriptor();
        var ref = new ActionReference();
        ref.putProperty(gChannel, gSelection);
        desc.putReference(gNull, ref);
        desc.putEnumerated(gTo, gOrdinal, gNone);
        executeAction(gSet, desc, DialogModes.NO);
    }

    this.measureLayer = function (lrBounds, selBounds) {
        var top = selBounds.getDouble(gTop) + lrBounds.getDouble(gTop),
            left = selBounds.getDouble(gLeft) + lrBounds.getDouble(gLeft),
            bottom = selBounds.getDouble(gBottom) - selBounds.getDouble(gTop) + top,
            right = selBounds.getDouble(gRight) - selBounds.getDouble(gLeft) + left

        this.top = top
        this.left = left
        this.bottom = bottom
        this.right = right
        this.width = right - left
        this.height = bottom - top
        this.X = left + (right - left) / 2
        this.Y = top + (bottom - top) / 2

        return
    }

    this.measureSelection = function (selBounds) {
        var top = selBounds.getDouble(gTop),
            left = selBounds.getDouble(gLeft),
            bottom = selBounds.getDouble(gBottom),
            right = selBounds.getDouble(gRight)

        this.top = top
        this.left = left
        this.bottom = bottom
        this.right = right
        this.width = right - left
        this.height = bottom - top
        this.X = left + (right - left) / 2
        this.Y = top + (bottom - top) / 2
        this.id = 0

        return
    }

    this.transform = function (scale, cH, cV, angle, dialogMode) {
        dialogMode = dialogMode == DialogModes.ALL ? DialogModes.ALL : DialogModes.NO
        var desc = new ActionDescriptor(),
            desc2 = new ActionDescriptor(),
            ref = new ActionReference()
        ref.putEnumerated(gLayer, gOrdinal, gTargetEnum)
        desc.putReference(gNull, ref)
        desc.putEnumerated(gFreeTransformCenterState, gQuadCenterState, gQCSIndependent)
        desc2.putUnitDouble(gHorizontal, gPixelsUnit, cH)
        desc2.putUnitDouble(gVertical, gPixelsUnit, cV)
        desc.putObject(gPosition, gPaint, desc2)
        desc.putUnitDouble(gWidth, gPercentUnit, scale)
        desc.putUnitDouble(gHeight, gPercentUnit, scale)
        desc.putUnitDouble(gAngle, gAngleUnit, angle)
        desc.putEnumerated(gInterfaceIconFrameDimmed, gInterpolationType, gBicubic)
        executeAction(gTransform, desc, dialogMode)
    }

    this.move = function (dH, dV) {
        var desc = new ActionDescriptor()
        var ref = new ActionReference()
        ref.putEnumerated(gLayer, gOrdinal, gTargetEnum)
        desc.putReference(gNull, ref)
        var desc2 = new ActionDescriptor()
        desc2.putUnitDouble(gHorizontal, gPixelsUnit, dH)
        desc2.putUnitDouble(gVertical, gPixelsUnit, dV)
        desc.putObject(gTo, gOffset, desc2)
        executeAction(gMove, desc, DialogModes.NO)
    }

    this.draw = function (top, left, bottom, right, color, pen) {
        try {
            var desc = new ActionDescriptor()
            var ref = new ActionReference()
            ref.putEnumerated(gMenu, gMenuItem, gRasterizePlaced)
            desc.putReference(gNull, ref)
            executeAction(gSelect, desc, DialogModes.NO)
        } catch (e) { }


        var desc = new ActionDescriptor()
        var desc2 = new ActionDescriptor()
        var ref = new ActionReference()

        ref.putProperty(gChannel, gSelection)
        desc.putReference(gNull, ref)
        desc2.putUnitDouble(gTop, gPixelsUnit, top)
        desc2.putUnitDouble(gLeft, gPixelsUnit, left)
        desc2.putUnitDouble(gBottom, gPixelsUnit, bottom)
        desc2.putUnitDouble(gRight, gPixelsUnit, right)
        desc.putObject(gTo, gRectangle, desc2)
        executeAction(gSet, desc, DialogModes.NO)

        var col = new SolidColor()
        col.rgb.hexValue = color
        app.activeDocument.selection.stroke(col, pen, StrokeLocation.CENTER)
        app.activeDocument.selection.deselect()
    }

    this.convertToLayer = function (id, newName) {
        var desc = new ActionDescriptor()
        var desc2 = new ActionDescriptor()
        var ref = new ActionReference()

        ref.putProperty(gLayer, gBacground)
        desc.putReference(gNull, ref)

        desc2.putString(gName, newName);
        desc.putObject(gTo, gLayer, desc2)
        desc.putInteger(gLayerId, id)
        executeAction(gSet, desc, DialogModes.NO)
    }

    function getDescValue(desc, property) {

        try {
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
            }
        } catch (e) { return null }
    }

    function s2t(s) { return stringIDToTypeID(s) }
    function t2s(t) { return typeIDToStringID(t) }
}
