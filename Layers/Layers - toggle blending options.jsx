
/**
 *  How to turn visibility on or off for Effects on a layer in JSX?
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/how-to-turn-visibility-on-or-off-for-effects-on-a-layer-in-jsx/m-p/15404878
 */

toggleBlendOptions();
function toggleBlendOptions() {
    var s2t = stringIDToTypeID,
        channelRestrictions,
        blendOptions,
        defaultBlending = {
            opacity: { value: 100, units: "percentUnit" },
            mode: "normal",
            fillOpacity: { value: 100, units: "percentUnit" },
            blendClipped: true,
            blendInterior: false,
            knockout: "none",
            transparencyShapesLayer: true,
            layerMaskAsGlobalMask: false,
            vectorMaskAsGlobalMask: false,
            blendRange:
                [
                    ({ channel: "gray", srcBlackMin: 0, srcBlackMax: 0, srcWhiteMin: 255, srcWhiteMax: 255, destBlackMin: 0, destBlackMax: 0, destWhiteMin: 255, desaturate: 255 }),
                    ({ channel: "red", srcBlackMin: 0, srcBlackMax: 0, srcWhiteMin: 255, srcWhiteMax: 255, destBlackMin: 0, destBlackMax: 0, destWhiteMin: 255, desaturate: 255 }),
                    ({ channel: "grain", srcBlackMin: 0, srcBlackMax: 0, srcWhiteMin: 255, srcWhiteMax: 255, destBlackMin: 0, destBlackMax: 0, destWhiteMin: 255, desaturate: 255 }),
                    ({ channel: "blue", srcBlackMin: 0, srcBlackMax: 0, srcWhiteMin: 255, srcWhiteMax: 255, destBlackMin: 0, destBlackMax: 0, destWhiteMin: 255, desaturate: 255 })
                ],
            channelRestrictions:
                [
                    ({ _enum: "channel", _value: "red" }),
                    ({ _enum: "channel", _value: "grain" }),
                    ({ _enum: "channel", _value: "blue" })
                ]
        };
    (r = new ActionReference()).putProperty(s2t("property"), p = s2t("background"));
    r.putEnumerated(s2t("layer"), s2t("ordinal"), s2t("targetEnum"));
    if (!executeActionGet(r).getBoolean(p)) {
        (r = new ActionReference()).putProperty(s2t("property"), s2t("json"));
        r.putEnumerated(s2t("layer"), s2t("ordinal"), s2t("targetEnum"));
        (d = new ActionDescriptor()).putReference(s2t("null"), r);
        eval("var json=" + executeAction(s2t("get"), d, DialogModes.NO).getString(s2t("json")));
        (r = new ActionReference()).putProperty(s2t('property'), p = s2t('numberOfChannels'));
        r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
        var numberOfChannels = executeActionGet(r).getInteger(p);
        (r = new ActionReference()).putProperty(s2t('property'), p = s2t('channelRestrictions'));
        r.putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
        var channelRestrictionsDesc = executeActionGet(r);
        if (channelRestrictionsDesc.getList(p).count < numberOfChannels) {
            (d = new ActionDescriptor()).putObject(s2t('object'), s2t('object'), channelRestrictionsDesc);
            eval('channelRestrictions = ' + (executeAction(s2t('convertJSONdescriptor'), d).getString(s2t('json'))));
        }
        if (json.layers.length == 1 && json.layers[0].blendOptions) blendOptions = json.layers[0].blendOptions;
        if (channelRestrictions != undefined) blendOptions.channelRestrictions = channelRestrictions.channelRestrictions
        if (blendOptions != undefined) {
            if (setLayerMetadata(blendOptions.toSource(), 'blendOptions')) {
                setBlendOptions(defaultBlending)
            }
        } else {
            var blendingOptionsFromMetadata = getLayerMetadata('blendOptions')
            if (blendingOptionsFromMetadata != undefined) { setBlendOptions(blendingOptionsFromMetadata) }
        }
    }
    function setBlendOptions(options) {
        s2t = stringIDToTypeID;
        var blendingOptions = new ActionDescriptor();
        (r = new ActionReference()).putEnumerated(s2t("layer"), s2t("ordinal"), s2t("targetEnum"));
        (layerOptions = new ActionDescriptor()).putReference(s2t("null"), r);
        var blendingOptions = new ActionDescriptor();
        for (k in options) {
            switch (k) {
                case 'opacity':
                case 'fillOpacity':
                    blendingOptions.putUnitDouble(s2t(k), s2t(options[k].units), options[k].value);
                    break;
                case 'blendClipped':
                case 'blendInterior':
                case 'transparencyShapesLayer':
                case 'layerMaskAsGlobalMask':
                case 'vectorMaskAsGlobalMask':
                    blendingOptions.putBoolean(s2t(k), options[k]);
                    break;
                case 'knockout':
                case 'mode':
                    blendingOptions.putEnumerated(s2t(k), k == 'mode' ? s2t("blendMode") : s2t(k), s2t(options[k]));
                    break;
                case 'blendRange':
                    var rangesList = new ActionList();
                    for (var i = 0; i < options[k].length; i++) {
                        var cur = options[k][i],
                            ref = new ActionReference(),
                            desc = new ActionDescriptor();
                        ref.putEnumerated(s2t("channel"), s2t("channel"), s2t(cur.channel));
                        desc.putReference(s2t("channel"), ref);
                        desc.putInteger(s2t("srcBlackMin"), cur.srcBlackMin);
                        desc.putInteger(s2t("srcBlackMax"), cur.srcBlackMax);
                        desc.putInteger(s2t("srcWhiteMin"), cur.srcWhiteMin);
                        desc.putInteger(s2t("srcWhiteMax"), cur.srcWhiteMax);
                        desc.putInteger(s2t("destBlackMin"), cur.destBlackMin);
                        desc.putInteger(s2t("destBlackMax"), cur.destBlackMax);
                        desc.putInteger(s2t("destWhiteMin"), cur.destWhiteMin);
                        desc.putInteger(s2t("desaturate"), cur.desaturate);
                        rangesList.putObject(s2t("blendRange"), desc);
                    }
                    blendingOptions.putList(s2t("blendRange"), rangesList);
                    break;
                case 'channelRestrictions':
                    var channelsList = new ActionList();
                    for (var i = 0; i < options[k].length; i++) {
                        channelsList.putEnumerated(s2t("channel"), s2t(options[k][i]['_value']));
                    }
                    blendingOptions.putList(s2t("channelRestrictions"), channelsList);
                    break;
            }
        }
        layerOptions.putObject(s2t("to"), s2t("layer"), blendingOptions);
        executeAction(s2t("set"), layerOptions, DialogModes.NO);
    }
    function setLayerMetadata(s, key) {
        try {
            if (ExternalObject.AdobeXMPScript == undefined) ExternalObject.AdobeXMPScript = new ExternalObject('lib:AdobeXMPScript')
            const myCustomNamespace = 'layerMetadata',
                myCustomPrefix = 'EmbedData:',
                myProperty = key;
            try { xmpMeta = new XMPMeta(app.activeDocument.activeLayer.xmpMetadata.rawData) } catch (e) { xmpMeta = new XMPMeta() }
            XMPMeta.registerNamespace(myCustomNamespace, myCustomPrefix);
            xmpMeta.setProperty(myCustomNamespace, myProperty, s)
            app.activeDocument.activeLayer.xmpMetadata.rawData = xmpMeta.serialize()
            return true
        } catch (e) { return false }
    }
    function getLayerMetadata(key) {
        var result;
        if (ExternalObject.AdobeXMPScript == undefined) ExternalObject.AdobeXMPScript = new ExternalObject('lib:AdobeXMPScript')
        const myCustomNamespace = 'layerMetadata',
            myProperty = key;
        try {
            xmpMeta = new XMPMeta(app.activeDocument.activeLayer.xmpMetadata.rawData)
            if (xmpMeta.doesPropertyExist(myCustomNamespace, myProperty)) eval('result = ' + (xmpMeta.getProperty(myCustomNamespace, myProperty).value))
            xmpMeta.deleteProperty(myCustomNamespace, myProperty)
            app.activeDocument.activeLayer.xmpMetadata.rawData = xmpMeta.serialize()
        } catch (e) { }
        return result
    }
}
