/**Photosho Script Copy Text Layer Parameters to another selected text
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/photosho-script-copy-text-layer-parameters-to-another-selected-text/m-p/12553881
 */
#target photoshop
s2t = stringIDToTypeID;
(ref = new ActionReference()).putProperty(s2t('property'), p = s2t('numberOfLayers'));
ref.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
var len = executeActionGet(ref).getInteger(p);
(ref = new ActionReference()).putProperty(s2t('property'), p = s2t('layerID'));
ref.putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
var cur = executeActionGet(ref).getInteger(p);
var lrs = []
for (var i = 1; i <= len; i++) {
    (ref = new ActionReference()).putProperty(s2t('property'), p = s2t('layerKind'));
    ref.putIndex(s2t('layer'), i);
    if (executeActionGet(ref).getInteger(p) == 3) {
        (ref = new ActionReference()).putProperty(s2t('property'), p = s2t('layerID'));
        ref.putIndex(s2t('layer'), i);
        if (executeActionGet(ref).getInteger(p) != cur) lrs.push(executeActionGet(ref).getInteger(p));
    }
}
for (var i = 0; i < lrs.length; i++) set_text_contents(cur, lrs[i])
function set_text_contents(source, target) {
    try {
        var sep = /(,|\.|\s)/;
        var r = new ActionReference();
        r.putIdentifier(s2t("layer"), source);
        var textKey = executeActionGet(r).getObjectValue(s2t("textKey"));
        var style_list = textKey.getList(s2t("textStyleRange"));
        var parag_list = textKey.getList(s2t("paragraphStyleRange"));
        var style0 = style_list.getObjectValue(0).getObjectValue(s2t("textStyle"));
        var parag0 = parag_list.getObjectValue(0).getObjectValue(s2t("paragraphStyle"));
        var old_text = executeActionGet(r).getObjectValue(s2t("textKey")).getString(s2t("textKey"));
        var r1 = new ActionReference();
        r1.putIdentifier(s2t("layer"), target);
        var text = executeActionGet(r1).getObjectValue(s2t("textKey")).getString(s2t("textKey"));
        var old_textKey = executeActionGet(r1).getObjectValue(s2t("textKey"))
        var styles = new Array();
        var from = 0;
        var to = old_text.length + 1;
        var def_style;
        for (var i = 0; i < old_text.length; i++) {
            if (old_text.charAt(i).match(sep)) {
                to = i + 1;
                styles.push([from, to, style0, parag0]);
                from = to;
            }
        }
        styles.push([from, to, style0, parag0]);
        for (var i = 0; i < style_list.count; i++) {
            var d = style_list.getObjectValue(i);
            var x0 = d.getInteger(s2t("from"));
            var x1 = d.getInteger(s2t("to"));
            var st = d.getObjectValue(s2t("textStyle"));
            for (var n = 0; n < styles.length; n++) {
                if (styles[n][0] >= x0) {
                    styles[n][2] = st;
                }
            }
        }
        for (var i = 0; i < parag_list.count; i++) {
            var d = parag_list.getObjectValue(i);
            var x0 = d.getInteger(s2t("from"));
            var x1 = d.getInteger(s2t("to"));
            var st = d.getObjectValue(s2t("paragraphStyle"));
            if (!i && st.hasKey(s2t("defaultStyle"))) def_style = st.getObjectValue(s2t("defaultStyle"));
            for (var n = 0; n < styles.length; n++) {
                if (styles[n][0] >= x0) {
                    styles[n][3] = st;
                }
            }
        }
        var from = 0;
        var to = text.length + 1;
        var idx = 0;
        for (var i = 0; i < text.length; i++) {
            if (text.charAt(i).match(sep)) {
                to = i + 1;
                styles[idx][0] = from;
                styles[idx][1] = to;
                from = to;
                if (idx >= styles.length - 1) break;
                ++idx;
            }
        }
        if (idx > 0) styles[idx][0] = styles[idx - 1][1];
        styles[idx][1] = text.length + 1;
        var new_style = new ActionList();
        var new_parag = new ActionList();
        for (var i = 0; i < styles.length; i++) {
            var d = new ActionDescriptor();
            d.putInteger(s2t("from"), styles[i][0]);
            d.putInteger(s2t("to"), styles[i][1]);
            if (def_style) extend_descriptor(def_style, styles[i][2])
            d.putObject(s2t("textStyle"), s2t("textStyle"), styles[i][2]);
            new_style.putObject(s2t("textStyleRange"), d);
            var d = new ActionDescriptor();
            d.putInteger(s2t("from"), styles[i][0]);
            d.putInteger(s2t("to"), styles[i][1]);
            d.putObject(s2t("paragraphStyle"), s2t("paragraphStyle"), styles[i][3]);
            new_parag.putObject(s2t("paragraphStyleRange"), d);
        }
        old_textKey.putList(s2t("textStyleRange"), new_style);
        old_textKey.putList(s2t("paragraphStyleRange"), new_parag);
        old_textKey.putString(s2t("textKey"), text);
        var d = new ActionDescriptor();
        d.putReference(s2t("null"), r1);
        d.putObject(s2t("to"), s2t("textLayer"), old_textKey);
        executeAction(s2t("set"), d, DialogModes.NO);
    }
    catch (e) { alert(e); }
}
function extend_descriptor(src_desc, dst_desc) {
    try {
        for (var i = 0; i < src_desc.count; i++) {
            var key = src_desc.getKey(i);
            if (dst_desc.hasKey(key)) continue;
            var type = src_desc.getType(key);
            switch (type) {
                case DescValueType.ALIASTYPE: dst_desc.putPath(key, src_desc.getPath(key)); break;
                case DescValueType.BOOLEANTYPE: dst_desc.putBoolean(key, src_desc.getBoolean(key)); break;
                case DescValueType.CLASSTYPE: dst_desc.putClass(key, src_desc.getClass(key)); break;
                case DescValueType.DOUBLETYPE: dst_desc.putDouble(key, src_desc.getDouble(key)); break;
                case DescValueType.INTEGERTYPE: dst_desc.putInteger(key, src_desc.getInteger(key)); break;
                case DescValueType.LISTTYPE: dst_desc.putList(key, src_desc.getList(key)); break;
                case DescValueType.RAWTYPE: dst_desc.putData(key, src_desc.getData(key)); break;
                case DescValueType.STRINGTYPE: dst_desc.putString(key, src_desc.getString(key)); break;
                case DescValueType.LARGEINTEGERTYPE: dst_desc.putLargeInteger(key, src_desc.getLargeInteger(key)); break;
                case DescValueType.REFERENCETYPE: dst_desc.putReference(key, src_desc.getReference(key)); break;
                case DescValueType.OBJECTTYPE:
                    dst_desc.putObject(key, src_desc.getObjectType(key), src_desc.getObjectValue(key));
                    break;
                case DescValueType.ENUMERATEDTYPE:
                    dst_desc.putEnumerated(key, src_desc.getEnumerationType(key), src_desc.getEnumerationValue(key));
                    break;
                case DescValueType.UNITDOUBLE:
                    dst_desc.putUnitDouble(key, src_desc.getUnitDoubleType(key), src_desc.getUnitDoubleValue(key));
                    break;
                default: alert("Unknown data type in descriptor"); return false;
            }
        }
        return true;
    }
    catch (e) { throw (e); }
}