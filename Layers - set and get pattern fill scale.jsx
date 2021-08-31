set();
get();

function set() {
    var lr = new AM('layer'),
        meta = new LayerMetadata('pattern', 'scale');

    if (lr.hasProperty('adjustment')) {
        var adj = lr.convertToObject(lr.getProperty(p = 'adjustment'), p)
        for (o in adj) {
            if (adj[o]._obj == 'patternLayer') {
                var scale = adj[o].scale ? adj[o].scale._value : 100;
                meta.set(activeDocument.activeLayer, 'fill', scale)
                break;
            }
        }
    }

    if (lr.hasProperty('layerEffects')) {
        var fx = lr.convertToObject(lr.getProperty(p = 'layerEffects').value, 'patternFill')
        if (fx) {
            var scale = fx.scale ? fx.scale._value : 100;
            meta.set(activeDocument.activeLayer, 'fx', scale)
        }
    }

    function LayerMetadata(customNamespace, prefix) {
        if (ExternalObject.AdobeXMPScript == undefined) ExternalObject.AdobeXMPScript = new ExternalObject('lib:AdobeXMPScript')

        this.set = function (layerObj, key, value) {
            try {
                xmpMeta = new XMPMeta(layerObj.xmpMetadata.rawData)
            } catch (e) { xmpMeta = new XMPMeta() }

            XMPMeta.registerNamespace(customNamespace, prefix)
            xmpMeta.setProperty(customNamespace, key, value)
            layerObj.xmpMetadata.rawData = xmpMeta.serialize()
            return ""
        }

        this.get = function (layerObj, key) {
            try {
                xmpMeta = new XMPMeta(layerObj.xmpMetadata.rawData)
                var data = xmpMeta.getProperty(customNamespace, key)
            } catch (e) { }
            return data == undefined ? "" : data.value
        }
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
            return executeActionGet(r).hasKey(property)
        }

        this.convertToObject = function (obj, key) {
            var d = new ActionDescriptor();
            switch (obj.typename) {
                case 'ActionList': d.putList(s2t(key), obj); break;
                case 'ActionDescriptor': d = obj; break;
            }
            (desc = new ActionDescriptor()).putObject(s2t('object'), s2t('json'), d);
            eval('var o = ' + executeAction(s2t('convertJSONdescriptor'), desc).getString(s2t('json')));
            return o[key]
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
}

function get() {

    var lr = new AM('layer'),
        meta = new LayerMetadata('pattern', 'scale');

    if (lr.hasProperty('adjustment')) {
        var adj = lr.convertToObject(lr.getProperty(p = 'adjustment'), p)
        for (o in adj) {
            if (adj[o]._obj == 'patternLayer') {
                var scale = meta.get(activeDocument.activeLayer, 'fill')
                if (scale) {
                    $.writeln(scale)
                    lr.setAdjustmentFillScale(lr.getProperty(p), Number(scale))
                }
                break;
            }
        }
    }

    if (lr.hasProperty('layerEffects')) {
        var fx = lr.convertToObject(lr.getProperty(p = 'layerEffects').value, 'patternFill')
        if (fx) {
            var scale = meta.get(activeDocument.activeLayer, 'fx')
            if (scale) {
                $.writeln(scale)
                lr.setFxFillScale(lr.getProperty(p).value, Number(scale))
            }

        }
    }

    function LayerMetadata(customNamespace, prefix) {
        if (ExternalObject.AdobeXMPScript == undefined) ExternalObject.AdobeXMPScript = new ExternalObject('lib:AdobeXMPScript')

        this.set = function (layerObj, key, value) {
            try {
                xmpMeta = new XMPMeta(layerObj.xmpMetadata.rawData)
            } catch (e) { xmpMeta = new XMPMeta() }

            XMPMeta.registerNamespace(customNamespace, prefix)
            xmpMeta.setProperty(customNamespace, key, value)
            layerObj.xmpMetadata.rawData = xmpMeta.serialize()
        }

        this.get = function (layerObj, key) {
            try {
                xmpMeta = new XMPMeta(layerObj.xmpMetadata.rawData)
                var data = xmpMeta.getProperty(customNamespace, key)
            } catch (e) { }
            return data == undefined ? "" : data.value

        }
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
            return executeActionGet(r).hasKey(property)
        }

        this.setAdjustmentFillScale = function (list, scale) {
            for (var i = 0; i < list.count; i++) {
                if (t2s(list.getObjectType(i)) == 'patternLayer') {
                    var fill = list.getObjectValue(i)
                    fill.putUnitDouble(s2t('scale'), s2t('percentUnit'), scale)
                }
            }
            (r = new ActionReference()).putEnumerated(s2t("contentLayer"), s2t("ordinal"), s2t("targetEnum"));
            (d = new ActionDescriptor()).putReference(s2t("null"), r);
            d.putObject(s2t("to"), s2t("patternLayer"), fill);
            executeAction(s2t("set"), d, DialogModes.NO);

        }

        this.setFxFillScale = function (desc, scale) {
            s2t = stringIDToTypeID;

            var fill = desc.getObjectValue(s2t("patternFill"));
            fill.putUnitDouble(s2t('scale'), s2t('percentUnit'), scale);

            (r = new ActionReference()).putProperty(s2t("property"), p = s2t("layerEffects"));
            r.putEnumerated(s2t("layer"), s2t("ordinal"), s2t("targetEnum"));
            var fx = executeActionGet(r).getObjectValue(p);
            fx.putObject(s2t("patternFill"), s2t("patternFill"), fill);
            (d = new ActionDescriptor()).putReference(s2t("null"), r);
            d.putObject(s2t("to"), s2t("layerEffects"), fx);
            executeAction(s2t("set"), d, DialogModes.NO);
        }

        this.convertToObject = function (obj, key) {
            var d = new ActionDescriptor();
            switch (obj.typename) {
                case 'ActionList': d.putList(s2t(key), obj); break;
                case 'ActionDescriptor': d = obj; break;
            }
            (desc = new ActionDescriptor()).putObject(s2t('object'), s2t('json'), d);
            eval('var o = ' + executeAction(s2t('convertJSONdescriptor'), desc).getString(s2t('json')));
            return o[key]
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

}