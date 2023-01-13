/**
 * Mirroring wrap.
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/mirroring-wrap/m-p/13484489#M697997
 * https://www.youtube.com/watch?v=xbHJSM4xdto
 * https://youtu.be/BoUQIo6ui7A
 */

var apl = new AM('application'),
    doc = new AM('document'),
    lr = new AM('layer'),
    s2t = stringIDToTypeID;
if (apl.getProperty('numberOfDocuments')) {
    var len = doc.getProperty('numberOfLayers'),
        smartObjects = [],
        warpStyles = [];
    for (var i = 1; i <= len; i++) {
        if (lr.getProperty('layerKind', i, true) == 5) {
            var id = lr.getProperty('layerID', i, true),
                title = lr.getProperty('name', i, true);
            if (lr.hasProperty('smartObjectMore', i, true)) {
                var so = lr.getProperty('smartObjectMore', i, true).value,
                    warp = null,
                    quiltWarp = null;
                if (so.hasKey(s2t('warp'))) warp = so.getObjectValue(s2t('warp'))
                if (so.hasKey(s2t('quiltWarp'))) quiltWarp = so.getObjectValue(s2t('quiltWarp'))
                if (warp || quiltWarp) warpStyles.push({ id: id, name: title, quiltWarp: quiltWarp, warp: warp })
            }
            smartObjects.push({ id: id, name: title })
        }
    }
    if (smartObjects.length && warpStyles.length) dialog(smartObjects.reverse(), warpStyles.reverse());
}
function dialog(s, w) {
    var d = new Window("dialog {text: 'Copy quilt warp style'}"),
        stFrom = d.add("statictext {text: 'From:'}"),
        dlFrom = d.add("dropdownlist {preferredSize: [200, -1]}"),
        stTo = d.add("statictext {text: 'To:'}"),
        lbTo = d.add("listbox", [0, 0, 200, 150], undefined, { multiselect: true }),
        grBn = d.add("group"),
        ok = grBn.add("button", undefined, 'ok', { name: "ok" }),
        cancel = grBn.add("button", undefined, 'Cancel', { name: "cancel" });
    dlFrom.onChange = function () {
        var warpId = w[dlFrom.selection.index].id;
        for (var i = 0; i < s.length; i++) {
            lbTo.items[i].selected = false
            if (s[i].id != warpId) lbTo.items[i].selected = true
        }
    }
    ok.onClick = function () {
        d.close()
        for (var i = 0; i < lbTo.selection.length; i++) {
            lr.selectLayerByIDList([s[lbTo.selection[i].index].id])
            lr.copyWarp(w[dlFrom.selection.index])
        }
    }
    d.onShow = function () {
        var activeLayerID = lr.getProperty('layerID');
        for (var i = 0; i < w.length; i++) dlFrom.add('item', w[i].name)
        for (var i = 0; i < s.length; i++) lbTo.add('item', s[i].name)
        for (var i = 0; i < w.length; i++) {
            if (w[i].id == activeLayerID) {
                dlFrom.selection = i
                break;
            }
        }
        if (!dlFrom.selection) dlFrom.selection = 0
    }
    d.show();
}
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
    this.descToObject = function (d, o) {
        o = o ? o : {}
        for (var i = 0; i < d.count; i++) {
            var k = d.getKey(i)
            o[t2s(k)] = getDescValue(d, k)
        }
        return o
    }
    this.selectLayerByIDList = function (IDList) {
        var ref = new ActionReference()
        for (var i = 0; i < IDList.length; i++) {
            ref.putIdentifier(s2t("layer"), IDList[i])
        }
        var desc = new ActionDescriptor()
        desc.putReference(s2t("target"), ref)
        desc.putBoolean(s2t("makeVisible"), false)
        executeAction(s2t("select"), desc, DialogModes.NO)
    }
    this.copyWarp = function (from) {
        (transform = new ActionDescriptor()).putEnumerated(s2t("freeTransformCenterState"), s2t("quadCenterState"), s2t("QCSAverage"));
        (offset = new ActionDescriptor()).putUnitDouble(s2t("horizontal"), s2t("distanceUnit"), 0);
        offset.putUnitDouble(s2t("vertical"), s2t("distanceUnit"), 0);
        transform.putObject(s2t("offset"), s2t("offset"), offset);

        if (from.quiltWarp) {
            (quiltWarp = new ActionDescriptor()).putEnumerated(k = s2t("warpStyle"), s2t("warpStyle"), from.quiltWarp.getEnumerationValue(k));
            quiltWarp.putDouble(k = s2t("warpValue"), from.quiltWarp.getDouble(k));
            quiltWarp.putDouble(k = s2t("warpPerspective"), from.quiltWarp.getDouble(k));
            quiltWarp.putDouble(k = s2t("warpPerspectiveOther"), from.quiltWarp.getDouble(k));
            quiltWarp.putEnumerated(k = s2t("warpRotate"), s2t("orientation"), from.quiltWarp.getEnumerationValue(k));
            var bounds = from.quiltWarp.getObjectValue(s2t('bounds')),
                floatRect = new ActionDescriptor();
            floatRect.putDouble(k = s2t("top"), bounds.getDouble(k));
            floatRect.putDouble(k = s2t("left"), bounds.getDouble(k));
            floatRect.putDouble(k = s2t("bottom"), bounds.getDouble(k));
            floatRect.putDouble(k = s2t("right"), bounds.getDouble(k));
            quiltWarp.putObject(s2t("bounds"), s2t("classFloatRect"), floatRect);
            quiltWarp.putInteger(k = s2t("uOrder"), from.quiltWarp.getInteger(k));
            quiltWarp.putInteger(k = s2t("vOrder"), from.quiltWarp.getInteger(k));
            quiltWarp.putInteger(k = s2t("deformNumRows"), from.quiltWarp.getInteger(k));
            quiltWarp.putInteger(k = s2t("deformNumCols"), from.quiltWarp.getInteger(k))
            var evelopeWarp = new ActionDescriptor(),
                warp = from.quiltWarp.getObjectValue(s2t('customEnvelopeWarp')),
                sliceX = warp.getList(s2t('quiltSliceX')),
                sliceY = warp.getList(s2t('quiltSliceY'));
            var slicesX = new ActionList();
            for (var i = 0; i < sliceX.count; i++) {
                var floatUnit = new ActionDescriptor();
                floatUnit.putUnitDouble(k = s2t("quiltSliceX"), s2t("pixelsUnit"), sliceX.getObjectValue(i).getUnitDoubleValue(k));
                slicesX.putObject(s2t("floatUnit"), floatUnit);
            }
            var slicesY = new ActionList();
            for (var i = 0; i < sliceY.count; i++) {
                var floatUnit = new ActionDescriptor();
                floatUnit.putUnitDouble(k = s2t("quiltSliceY"), s2t("pixelsUnit"), sliceY.getObjectValue(i).getUnitDoubleValue(k));
                slicesY.putObject(s2t("floatUnit"), floatUnit);
            }
            evelopeWarp.putList(s2t("quiltSliceX"), slicesX);
            evelopeWarp.putList(s2t("quiltSliceY"), slicesY);
            var mesh = warp.getList(s2t('meshPoints')),
                meshPoints = new ActionList(); // 
            for (var i = 0; i < mesh.count; i++) {
                var rationalPoint = new ActionDescriptor();
                rationalPoint.putUnitDouble(k = s2t("horizontal"), s2t("pixelsUnit"), mesh.getObjectValue(i).getUnitDoubleValue(k));
                rationalPoint.putUnitDouble(k = s2t("vertical"), s2t("pixelsUnit"), mesh.getObjectValue(i).getUnitDoubleValue(k));
                meshPoints.putObject(s2t("floatUnit"), rationalPoint);
            }
            evelopeWarp.putList(s2t("meshPoints"), meshPoints);
            quiltWarp.putObject(s2t("customEnvelopeWarp"), s2t("customEnvelopeWarp"), evelopeWarp);
            transform.putObject(s2t("quiltWarp"), s2t("quiltWarp"), quiltWarp);
        }

        if (from.warp) {
            var warp = new ActionDescriptor();
            warp.putEnumerated(k = s2t("warpStyle"), k, from.warp.getEnumerationValue(k));
            warp.putDouble(k = s2t("warpValue"), from.warp.getDouble(k));
            warp.putDouble(k = s2t("warpPerspective"), from.warp.getDouble(k));
            warp.putDouble(k = s2t("warpPerspectiveOther"), from.warp.getDouble(k));
            warp.putEnumerated(k = s2t("warpRotate"), s2t("orientation"), from.warp.getEnumerationValue(k));
            var bounds = from.warp.getObjectValue(s2t('bounds')),
                floatWarpRect = new ActionDescriptor();
            floatWarpRect.putDouble(k = s2t("top"), bounds.getDouble(k));
            floatWarpRect.putDouble(k = s2t("left"), bounds.getDouble(k));
            floatWarpRect.putDouble(k = s2t("bottom"), bounds.getDouble(k));
            floatWarpRect.putDouble(k = s2t("right"), bounds.getDouble(k));
            warp.putObject(s2t("bounds"), s2t("classFloatRect"), floatWarpRect);
            warp.putInteger(k = s2t("uOrder"), from.warp.getInteger(k));
            warp.putInteger(k = s2t("vOrder"), from.warp.getInteger(k));

            if (from.warp.hasKey(s2t('customEnvelopeWarp'))) {
                var mesh = from.warp.getObjectValue(s2t('customEnvelopeWarp')).getList(s2t('meshPoints')),
                    meshPoints = new ActionList(); // 
                for (var i = 0; i < mesh.count; i++) {
                    var rationalPoint = new ActionDescriptor();
                    rationalPoint.putUnitDouble(k = s2t("horizontal"), s2t("pixelsUnit"), mesh.getObjectValue(i).getUnitDoubleValue(k));
                    rationalPoint.putUnitDouble(k = s2t("vertical"), s2t("pixelsUnit"), mesh.getObjectValue(i).getUnitDoubleValue(k));
                    meshPoints.putObject(s2t("floatUnit"), rationalPoint);
                }
                var mesh = new ActionDescriptor();
                mesh.putList(s2t("meshPoints"), meshPoints);
                warp.putObject(s2t("customEnvelopeWarp"), s2t("customEnvelopeWarp"), mesh);
            }
            transform.putObject(s2t("warp"), s2t("warp"), warp);
        }

        executeAction(s2t("transform"), transform, DialogModes.NO);
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