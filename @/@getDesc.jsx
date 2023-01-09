/*Getting the parameters of the descriptor in two ways - by convertJSONdescriptor object and 'classic' using getKey() */
#target photoshop
s2t = stringIDToTypeID;
/*using json object*/
/*(r = new ActionReference());//.putProperty(s2t('property'), p = s2t('json'));
r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
//r.putName(s2t('channel'),'RGB');
(d = new ActionDescriptor()).putObject(s2t('object'), s2t('object'), executeActionGet(r));
//d.putBoolean(stringIDToTypeID("expandSmartObjects"), true);
$.writeln(executeAction(s2t('convertJSONdescriptor'), d).getString(s2t('json')));*/


/**
 * using JSON property
 */

try {
    var r = new ActionReference();
    var d = new ActionDescriptor();

    r.putProperty(stringIDToTypeID("property"), stringIDToTypeID("json"));
    r.putEnumerated(stringIDToTypeID("document"), stringIDToTypeID("ordinal"), stringIDToTypeID("targetEnum"));
    d.putReference(stringIDToTypeID("null"), r);

    d.putBoolean(stringIDToTypeID("expandSmartObjects"), true);

    eval("var json=" + executeAction(stringIDToTypeID("get"), d, DialogModes.NO).getString(stringIDToTypeID("json")));

    $.writeln(json.toSource());
}
catch (e) { alert(e); }

/*classic way*/
function checkDesc(d) {
    var c = d.count,
        str = '';
    for (var i = 0; i < c; i++) {
        str += t2s(d.getKey(i)) +
            ': ' + d.getType(d.getKey(i)) +
            ' = ' + getValues(d, i) + '\n';
    };
    $.writeln(str);
};
function getValues(d, keyNum) {
    var p = d.getKey(keyNum);
    switch (d.getType(p)) {
        case DescValueType.OBJECTTYPE: return (d.getObjectValue(p) + '_' + t2s(d.getObjectType(p)));
        case DescValueType.LISTTYPE: return d.getList(p);
        case DescValueType.REFERENCETYPE: return d.getReference(p);
        case DescValueType.BOOLEANTYPE: return d.getBoolean(p);
        case DescValueType.STRINGTYPE: return d.getString(p);
        case DescValueType.INTEGERTYPE: return d.getInteger(p);
        case DescValueType.LARGEINTEGERTYPE: return d.getLargeInteger(p);
        case DescValueType.DOUBLETYPE: return d.getDouble(p);
        case DescValueType.ALIASTYPE: return d.getPath(p);
        case DescValueType.CLASSTYPE: return d.getClass(p);
        case DescValueType.UNITDOUBLE: return (d.getUnitDoubleValue(p) + '_' + t2s(d.getUnitDoubleType(p)));
        case DescValueType.ENUMERATEDTYPE: return (t2s(d.getEnumerationValue(p)) + '_' + t2s(d.getEnumerationType(p)));
        case DescValueType.RAWTYPE:
            var tempStr = d.getData(p);
            var rawData = new Array();
            for (var tempi = 0; tempi < tempStr.length; tempi++) {
                rawData[tempi] = tempStr.charCodeAt(tempi);
            }
            return rawData;
        default:
            break;
    };
};

function s2t(s) { return s2t(s) }
function t2s(t) { if (!typeIDToStringID(t)) { return typeIDToCharID(t) } else { return typeIDToStringID(t) } }

/*
 Get information about a document.
     * To find out about the current document, leave documentId empty.
     * @param {?integer} documentId Optional document ID
     * @param {?Object.<string, boolean>} flags Optional override of default flags for
     *   document info request. The optional flags and their default values are:
     *
     *   compInfo:             true
     *   imageInfo:            true
     *   layerInfo:            true
     *     Specifies which info to send (image-specific, layer-specific, comp-specific)
     *     If none of these is specified, all three default to true, otherwise it just
     *     returns the true values
     *   expandSmartObjects:   false
     *     recurse into smart object (placed) documents
     *   getTextStyles:        true
     *     get limited text/style info for text layers. Returned in the "text" property of
     *     layer info
     *   getFullTextStyles:    false
     *     get all text/style info for text layers. Returned in the "text" property of
     *     layer info, can be rather verbose
     *   selectedLayers:       false
     *     If true, only return details on the layers that the user has selected. If false,
     *     all layers are returned
     *   getCompLayerSettings: true
     *     If true, send actual layer settings in comps (not just the comp ids, useVisibility,
     *     usePosition, and useAppearance)
     *   getDefaultLayerFX:    false
     *     If true, send all fx settings for enabled fx, even if they match the defaults. If false
     *     layer fx settings will only be sent if they are different from default settings.
     *   getPathData:          false
     *     If true, shape layers will include detailed path data (in the same format as
     *     generator.getLayerShape)
     */

