/* The script align the centers of all the selected layers and fit them in the size of the lower of the selected */

/*
<javascriptresource>
<category>alignment</category>
<name>Align and fit</name>
<enableinfo>true</enableinfo>
</javascriptresource>
*/

#target photoshop

var sel = getSelectedLayersRefs()

if (sel.length > 1) {
    sel.sort(sortLayers)
    for (var i = 1; i < sel.length; i++) {
        selectLayer(sel[i][2])
        try {transform(new getTransformParams(sel[0][1], sel[i][1]))}catch (e) {alert (e); break;}
    }
    for (var i = 0; i < sel.length; i++) { selectLayer(sel[i][2], true) }
}

function getSelectedLayersRefs() {

    documentEnum = function (type) {
        var ref = new ActionReference()
        ref.putProperty(s2t("property"), type)
        ref.putEnumerated(s2t("document"), s2t("ordinal"), s2t("targetEnum"))
        return ref
    }

    layerProperty = function (type, idx) {
        ref = new ActionReference();
        ref.putProperty(s2t("property"), type)
        ref.putIndex(s2t("layer"), idx)
        return ref
    }

    try {
        var shift = executeActionGet(documentEnum(s2t("hasBackgroundLayer"))).getBoolean(s2t("hasBackgroundLayer")) ? 0 : 1,
            list = executeActionGet(documentEnum(s2t("targetLayers"))).getList(s2t("targetLayers")),
            len = list.count;
    } catch (e) {alert (e); return 0 }

    var output = []

    for (var i = 0; i < len; i++) {
        var idx = list.getReference(i).getIndex() + shift,
        bounds = executeActionGet(layerProperty(s2t("boundsNoEffects"),idx)).getObjectValue(s2t("boundsNoEffects")),
        id = executeActionGet(layerProperty(s2t("layerID"),idx)).getInteger(s2t("layerID")),
        index = executeActionGet(layerProperty(s2t("itemIndex"),idx)).getInteger(s2t("itemIndex")),
        kind = executeActionGet(layerProperty(s2t("layerKind"),idx)).getInteger(s2t("layerKind"))

        if (kind == 1 || kind == 5) output.push([index, bounds, id])
    }
    return output
}

function sortLayers(a, b) { return a[0] > b[0] ? 1 : -1 }

function getTransformParams(lrA, lrB) {
    this.dH = (lrA.getDouble(s2t("right")) + lrA.getDouble(s2t("left"))) / 2 - ((lrB.getDouble(s2t("right")) + lrB.getDouble(s2t("left"))) / 2)
    this.dV = (lrA.getDouble(s2t("bottom")) + lrA.getDouble(s2t("top"))) / 2 - ((lrB.getDouble(s2t("bottom")) + lrB.getDouble(s2t("top"))) / 2)

    var tV = lrA.getDouble(s2t("width")) / lrB.getDouble(s2t("width")) * 100
    var tH = lrA.getDouble(s2t("height")) / lrB.getDouble(s2t("height")) * 100

    this.scale = tV < tH ? tV : tH

    return
}

function transform(scale) {
    var desc = new ActionDescriptor(),
        desc2 = new ActionDescriptor(),
        ref = new ActionReference();

    ref.putEnumerated(s2t("layer"), s2t("ordinal"), s2t("targetEnum"));
    desc.putReference(s2t("null"), ref);
    desc.putEnumerated(s2t("freeTransformCenterState"), s2t("quadCenterState"), s2t("QCSAverage"));
    desc2.putUnitDouble(s2t("horizontal"), s2t("pixelsUnit"), scale.dH);
    desc2.putUnitDouble(s2t("vertical"), s2t("pixelsUnit"), scale.dV);
    desc.putObject(s2t("offset"), s2t("offset"), desc2);
    desc.putUnitDouble(s2t("width"), s2t("percentUnit"), scale.scale);
    desc.putUnitDouble(s2t("height"), s2t("percentUnit"), scale.scale);
    desc.putEnumerated(s2t("interfaceIconFrameDimmed"), s2t("interpolationType"), s2t("bicubic"));
    executeAction(s2t("transform"), desc, DialogModes.NO);
}

this.move = function (){
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

function selectLayer(ID, add) {
    add = (add == undefined) ? add = false : add
    var ref = new ActionReference()
    ref.putIdentifier(s2t("layer"), ID)
    var desc = new ActionDescriptor()
    desc.putReference(s2t("null"), ref)
    if (add) { desc.putEnumerated(s2t("selectionModifier"), s2t("selectionModifierType"), s2t("addToSelection")) }
    desc.putBoolean(s2t("makeVisible"), false)
    executeAction(s2t("select"), desc, DialogModes.NO)
}

function s2t(s) { return stringIDToTypeID(s) }