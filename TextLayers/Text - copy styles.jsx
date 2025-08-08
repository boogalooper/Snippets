
var doc = new AM('document'),
    lr = new AM('layer'),
    cfg = new Config;
targetLayers = doc.getProperty('targetLayersIDs'),
    len = doc.getProperty('numberOfLayers'),
    textLayers = [];

if (targetLayers.count) {
    for (var i = 0; i < targetLayers.count; i++) {
        var id = targetLayers.getReference(i).getIdentifier(stringIDToTypeID('layerID'));
        if (lr.getProperty('layerKind', id) == 3) {
            textLayers.push(textObject(lr.getProperty('layerID', id)))
        }
    }
}

if (textLayers.length < 2) {
    textLayers = [];
    for (var i = 1; i <= len; i++) {
        if (lr.getProperty('layerKind', i, 1) == 3) {
            textLayers.push(textObject(lr.getProperty('layerID', i, true)))
        }
    }
}

function textObject(id) {
    var textKey = lr.getProperty('textKey', id).value;
    return {
        id: id,
        name: lr.getProperty('name', id),
        text: textKey.getString(stringIDToTypeID("textKey")),
        textKey: textKey
    }
}

createDialog(textLayers);

function createDialog(textLayers) {
    var w = new Window('dialog {text: "Перенос стилей"}'),
        gSource = w.add('group {orientation: "column", alignChildren: ["left","fill"], alignment: ["fill","top"]}'),
        stSource = gSource.add('statictext {text: "Источник:"}'),
        dl = gSource.add('dropdownlist {preferredSize: [300,-1]}'),
        gTarget = w.add('group {orientation: "column", alignChildren: ["left","fill"], alignment: ["fill","top"]}'),
        stTarget = gTarget.add('statictext {text: "Назначение:"}'),
        l = gTarget.add('listbox', [0, 0, 300, 400], undefined, { multiselect: true }),
        ch = gTarget.add('checkbox {text: "показывать содержимое текстовых слоев"}'),
        gBn = w.add('group {orientation: "row", alignChildren: ["left","center"]}'),
        bnOk = gBn.add('button', undefined, 'Ok', { name: 'ok' }),
        bnCancel = gBn.add('button', undefined, 'Отмена', { name: 'cancel' });

    bnOk.onClick = function () {
        var source = textLayers[dl.selection.index],
            target = [];

        for (var i = 0; i < textLayers.length; i++) {
            if (l.items[i].selected) target.push(textLayers[i]);
        }
        w.close()

        if (target.length) {
            for (var i = 0; i < target.length; i++) {
                lr.replaceTextLr(target[i].text.split('\r'), target[i].id, source.textKey)
            }
        }
    }

    ch.onClick = function () {
        cfg.showText = this.value
        fillItems(dl.selection.index)
    }

    dl.onChange = function () {
        for (var i = 0; i < textLayers.length; i++) {
            l.items[i].selected = true
        }
        l.items[this.selection.index].selected = false
    }

    w.onShow = function () {
        ch.value = cfg.showText;
        fillItems();
    }

    return w.show();

    function fillItems(selected) {
        if (textLayers.length) {
            l.removeAll();
            for (var i = 0; i < textLayers.length; i++) {
                dl.add('item', cfg.showText ? textLayers[i].text : textLayers[i].name)
                l.add('item', cfg.showText ? textLayers[i].text : textLayers[i].name)
            }
            dl.selection = 0;
            dl.selection = selected ? selected : 0;
        }
    }
}

function AM(target) {
    var s2t = stringIDToTypeID,
        t2s = typeIDToStringID;
    const gOrdinal = s2t('ordinal'),
        gTargetEnum = s2t('targetEnum'),
        gProperty = s2t('property'),
        gNull = s2t('null'),
        gTo = s2t('to'),
        gTextLayer = s2t('textLayer'),
        gSet = s2t('set'),
        gTextStyleRange = s2t('textStyleRange'),
        gParagraphStyleRange = s2t('paragraphStyleRange'),
        gTextKey = s2t('textKey'),
        gFrom = s2t('from'),
        gTextStyle = s2t('textStyle'),
        gParagraphStyle = s2t('paragraphStyle'),
        gDefaultStyle = s2t('defaultStyle');


    target = target ? s2t(target) : null;
    this.getProperty = function (property, id, idxMode) {
        property = s2t(property);
        (r = new ActionReference()).putProperty(gProperty, property);
        id != undefined ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id)) :
            r.putEnumerated(target, gOrdinal, gTargetEnum);
        return getDescValue(executeActionGet(r), property)
    }
    this.hasProperty = function (property, id, idxMode) {
        property = s2t(property);
        (r = new ActionReference()).putProperty(gProperty, property);
        id ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id))
            : r.putEnumerated(target, gOrdinal, gTargetEnum);
        return executeActionGet(r).hasKey(property)
    }
    this.replaceTextLr = function (newText, id, source) {
        var textKey = lr.getProperty('textKey', id).value,
            styleList = source.getList(gTextStyleRange),
            paragList = source.getList(gParagraphStyleRange);
        var styles = new Array(),
            parag = new Array(),
            defaultStyle;
        var sourceTextKey = source.getString(gTextKey).split('\r');
        var shift = 0,
            sourceText = [],
            len = sourceTextKey.length;
        for (var i = 0; i < len; i++) {
            var tmp = (sourceTextKey[i].replace(/[\s]/g, ' ').split(' ')),
                words = [],
                wLen = tmp.length;
            for (var n = 0; n < wLen; n++) {
                if (tmp[n] != "") {
                    words.push([shift, tmp[n].length + shift, [], []])
                    shift = shift + tmp[n].length + 1
                } else { shift++ }
            }
            if (words.length == 0) { words.push([0, 1, [], []]) }
            sourceText.push(words)
        }
        for (var i = 0; i < styleList.count; i++) {
            var d = styleList.getObjectValue(i);
            var x0 = d.getInteger(gFrom);
            var x1 = d.getInteger(gTo);
            var st = d.getObjectValue(gTextStyle);
            if (styles.length > 0) {
                if (styles[styles.length - 1][0] == x0 && styles[styles.length - 1][1] == x1) {
                    styles[styles.length - 1][2] == st
                } else { styles.push([x0, x1, st]) }
            } else { styles.push([x0, x1, st]) }
        }
        for (var i = 0; i < paragList.count; i++) {
            var d = paragList.getObjectValue(i);
            var x0 = d.getInteger(gFrom);
            var x1 = d.getInteger(gTo);
            var st = d.getObjectValue(gParagraphStyle);
            if (!i && st.hasKey(gDefaultStyle)) defaultStyle = st.getObjectValue(gDefaultStyle);
            if (parag.length > 0) {
                if (parag[parag.length - 1][0] == x0 && parag[parag.length - 1][1] == x1) {
                    parag[parag.length - 1][2] == st
                } else { parag.push([x0, x1, st]) }
            } else { parag.push([x0, x1, st]) }
            parag.push([x0, x1, st])
        }
        var len = sourceText.length;
        for (var i = 0; i < len; i++) {
            for (var x = 0; x < sourceText[i].length; x++) {
                var sLen = styles.length;
                for (var n = 0; n < sLen; n++) {
                    matchStyles(sourceText[i][x], styles[n].slice(), 2)
                }
                var sLen = parag.length;
                for (var n = 0; n < sLen; n++) {
                    matchStyles(sourceText[i][x], parag[n].slice(), 3)
                }
            }
        }
        var txt = [],
            txtStyles = [],
            txtParag = [],
            len = newText.length;
        for (var i = 0; i < len; i++) { txt.push(newText[i].replace(/[\s]/g, ' ').split(' ')) }
        var shiftStyle = 0,
            shiftParag = 0,
            len = sourceText.length;
        for (var i = 0; i < len; i++) {
            if (i < txt.length) {
                shiftStyle = fitStyle(sourceText[i], txt[i].slice(), txtStyles, 2, shiftStyle)
                shiftParag = fitStyle(sourceText[i], txt[i].slice(), txtParag, 3, shiftParag)
            }
        }
        var len = txt.join('\r').length
        if (shift <= len) {
            txtStyles[txtStyles.length - 1][1] += len - shiftStyle + 1
            txtParag[txtParag.length - 1][1] += len - shiftParag + 1
        }
        txtStyles = optimizeStyle(txtStyles)
        txtParag = optimizeStyle(txtParag)
        var new_style = new ActionList();
        var new_parag = new ActionList();
        for (var i = 0; i < txtStyles.length; i++) {
            var d = new ActionDescriptor();
            d.putInteger(gFrom, txtStyles[i][0]);
            d.putInteger(gTo, txtStyles[i][1]);
            if (defaultStyle) extend_descriptor(defaultStyle, txtStyles[i][2])
            d.putObject(gTextStyle, gTextStyle, txtStyles[i][2]);
            new_style.putObject(gTextStyleRange, d);
        }
        for (var i = 0; i < txtParag.length; i++) {
            var d = new ActionDescriptor();
            d.putInteger(gFrom, txtParag[i][0]);
            d.putInteger(gTo, txtParag[i][1]);
            d.putObject(gParagraphStyle, gParagraphStyle, txtParag[i][2]);
            new_parag.putObject(gParagraphStyleRange, d);
        }
        textKey.putList(gTextStyleRange, new_style);
        textKey.putList(gParagraphStyleRange, new_parag);
        textKey.putString(gTextKey, newText.join('\r'));
        var d = new ActionDescriptor();
        var r = new ActionReference();
        r.putIdentifier(target, id)
        d.putReference(gNull, r);
        d.putObject(gTo, gTextLayer, textKey);
        executeAction(gSet, d, DialogModes.NO);
        function matchStyles(source, style, idx) {
            if (style[0] < source[1] && style[1] > source[0]) {
                if (style[0] < source[0]) { style[0] = source[0] }
                if (style[1] > source[1]) { style[1] = source[1] }
                style[0] = style[0] - source[0]
                style[1] = style[1] - source[0]
                source[idx].push(style)
            }
        }
        function fitStyle(style, txt, output, idx, shift) {
            var counter = output.length
            var styleCounter = 0
            var len = txt.length
            for (var i = 0; i < len; i++) {
                if (styleCounter >= style.length) { break; }
                var next = false
                var word = txt.shift()
                if (word.length == 0) {
                    if (output.length == 0) {
                        output.push([0, 0, style[styleCounter][idx][0][2]])
                        counter++
                    }
                    shift++
                    output[counter - 1][1]++
                    continue;
                }
                for (var n = 0; n < style[styleCounter][idx].length; n++) {
                    var cur = style[styleCounter][idx][n].slice()
                    if (cur[0] <= word.length) {
                        if (cur[1] >= word.length) {
                            cur[1] = word.length + 1
                            next = true
                        }
                        cur[0] += shift
                        cur[1] += shift
                        output.push(cur)
                        counter++
                        if (next) { break; }
                    }
                }
                if (word.length >= output[counter - 1][1] - shift) { output[counter - 1][1] = word.length + 1 + shift }
                shift = output[counter - 1][1]
                styleCounter++
            }
            if (txt.length > 0) {
                shift += txt.join(' ').length + 1
                output[counter - 1][1] += txt.join(' ').length + 1
            }
            return shift
        }
        function optimizeStyle(style) {
            var tmp = style.slice()
            var counter = 0
            style = []
            style.push(tmp[0])
            for (var i = 1; i < tmp.length; i++) {
                if (style[counter][2].isEqual(tmp[i][2])) {
                    style[counter][1] = tmp[i][1]
                } else {
                    style.push(tmp[i])
                    counter++
                }
            }
            return style
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

function Config() {
    this.showText = false;
}
