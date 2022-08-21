/**Change Font and number
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/change-font-and-number/td-p/12987056
 */
#target photoshop

changeFontForLettersAndNumbers('Times New Roman', 'Arial')

function changeFontForLettersAndNumbers(letters, numbers) {
    var s2t = stringIDToTypeID;
    function t2s(t) { if (!typeIDToStringID(t)) { return typeIDToCharID(t) } else { return typeIDToStringID(t) } }
    (r = new ActionReference()).putProperty(s2t('property'), p = s2t('textKey'));
    r.putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
    if (executeActionGet(r).hasKey(p)) {
        var textKey = executeActionGet(r).getObjectValue(p),
            sList = textKey.getList(s2t('textStyleRange')),
            l = new ActionList(),
            styleSheet = [],
            text = textKey.getString(p);
        for (var i = 0; i < sList.count; i++) {
            var cur = sList.getObjectValue(i);
            styleSheet.push({
                from: cur.getInteger(s2t('from')),
                to: cur.getInteger(s2t('to')),
                style: function (d) {
                    if (d.hasKey(p = s2t('styleSheetHasParent')) && d.getBoolean(p)) if (d.hasKey(p = s2t('baseParentStyle'))) extend_descriptor(d.getObjectValue(p), d)
                    return d;
                }(cur.getObjectValue(s2t('textStyle'))),
            })
            styleSheet[i].text = text.substring(styleSheet[i].from, styleSheet[i].to);
        };
        var len = styleSheet.length;
        for (var i = 0; i < len; i++) {
            var customStyle = setFontName(styleSheet[i], 0, styleSheet[i].text.length, letters)
            styleSheet.splice.apply(styleSheet, [i, 1].concat(customStyle));
        }
        do {
            var len = styleSheet.length,
                found = false;
            for (var i = 0; i < len; i++) {
                var offset = 0,
                    cur = styleSheet[i].text;
                if (cur) {
                    var digits = cur.match(/\d+/),
                        from, to;
                    if (digits) {
                        from = cur.indexOf(digits[0]) + offset
                        to = from + digits[0].length
                        offset += digits[0].length
                        cur = cur.substring(cur.indexOf(digits[0]) + digits[0].length)
                        customStyle = setFontName(styleSheet[i], from, to, numbers, true)
                        styleSheet.splice.apply(styleSheet, [i, 1].concat(customStyle));
                        len += customStyle.length - 1;
                        i += customStyle.length - 1;
                        found = true
                    }
                }
            }
        } while (found)
        var l = new ActionList();
        for (var i = 0; i < styleSheet.length; i++) {
            var d = new ActionDescriptor();
            d.putObject(s2t('textStyle'), s2t('textStyle'), styleSheet[i].style)
            d.putInteger(s2t('from'), styleSheet[i].from)
            d.putInteger(s2t('to'), styleSheet[i].to)
            l.putObject(s2t('textStyleRange'), d)
        }
        textKey.putList(s2t('textStyleRange'), l);
        (r = new ActionReference()).putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
        (d = new ActionDescriptor()).putReference(s2t('target'), r);
        d.putObject(s2t('to'), s2t('textLayer'), textKey);
        executeAction(s2t('set'), d, DialogModes.NO);
    }
    function setFontName(baseStyleSheet, from, to, fontName, erase) {
        var output = [],
            offset = baseStyleSheet.from;
        if (baseStyleSheet.from != from + offset) {
            output.push({
                from: baseStyleSheet.from,
                to: from + offset,
                style: baseStyleSheet.style,
                text: baseStyleSheet.text.substring(0, from)
            })
        }
        var customStyle = new ActionDescriptor();
        extend_descriptor(baseStyleSheet.style, customStyle);
        customStyle.putString(s2t('fontName'), fontName);
        customStyle.erase(s2t('fontPostScriptName'));

        /* If the original and new font do not have the same style (thin, bold, italic, etc.), 
        then you need to uncomment this line - this will reset the style settings.*/
        //  customStyle.erase(s2t('fontStyleName'));

        output.push({
            from: from + offset,
            to: to + offset,
            style: customStyle,
            text: erase ? null : baseStyleSheet.text.substring(from, to)
        })
        if (baseStyleSheet.to != to + offset) {
            output.push({
                from: to + offset,
                to: baseStyleSheet.to,
                style: baseStyleSheet.style,
                text: baseStyleSheet.text.substring(to)
            })
        }
        return output;
    }
    /** tnx to @r-bin
     * https://community.adobe.com/t5/photoshop-ecosystem-discussions/how-to-copy-save-styles-typeface-font-size-design-etc-of-arbitrary-text-fragments-and-apply-them-to/m-p/10522630
     */
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
                    case DescValueType.OBJECTTYPE: dst_desc.putObject(key, src_desc.getObjectType(key), src_desc.getObjectValue(key)); break;
                    case DescValueType.ENUMERATEDTYPE: dst_desc.putEnumerated(key, src_desc.getEnumerationType(key), src_desc.getEnumerationValue(key)); break;
                    case DescValueType.UNITDOUBLE: dst_desc.putUnitDouble(key, src_desc.getUnitDoubleType(key), src_desc.getUnitDoubleValue(key)); break;
                    default: alert("Unknown data type in descriptor"); return false;
                }
            }
            return true;
        }
        catch (e) { throw (e); }
    }
}