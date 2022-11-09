/**Change color of a single word in a text layer and turn symbols to superscript using Javascript?
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/change-color-of-a-single-word-in-a-text-layer-and-turn-symbols-to-superscript-using-javascript/td-p/13288472
 */

#target photoshop

var params = {
    color:
        [
            { text: 'discount', _obj: { RGBColor: { red: 0, green: 255, blue: 0 } } },
            { text: '#', _obj: { RGBColor: { red: 255, green: 255, blue: 0 } } },
            { text: 'get', _obj: { RGBColor: { red: 255, green: 0, blue: 0 } } },
            { text: '20%', _obj: { RGBColor: { red: 0, green: 0, blue: 255 } } },
        ],
    baseline:
        [
            { text: '#', _enum: { baseline: 'superscript' } }
        ]
},
    s2t = stringIDToTypeID;

var doc = app.activeDocument;
var oldPref = app.preferences.rulerUnits;
app.preferences.rulerUnits = Units.PIXELS;

var ab, aLayer, aW, aH

var defaultValue = 'Get 20% discount#';
//desktopHead = prompt("Paste your new headline", defaultValue);
desktopHead = defaultValue
var docLayers = doc.layers.length; //getting top layers because artboards are top layers

for (var i = 0; i < docLayers; i++) {
    aLayer = doc.layers[i];
    ab = artboard_rectangle(aLayer);
    aW = ab[2] - ab[0];
    aH = ab[3] - ab[1];
    //   if ((aW == 1000 && aH == 1000) || (aW == 400 && aH == 500)) {//add more sizes here
    findTextLayer(aLayer)
    //   }//end if for artboard size
}//end for loop

app.preferences.rulerUnits = oldPref;

function findTextLayer(pLayer) {
    var layLen = pLayer.layers.length;
    for (var j = 0; j < layLen; j++) {
        var layerRef = pLayer.layers[j];
        if (pLayer.layers[j].typename == 'LayerSet') {
            findTextLayer(pLayer.layers[j]);
        }//end if for finding layerset
        else {
            if (layerRef.kind === LayerKind.TEXT) {
                //      if (layerRef.textItem.font === "Arial-BoldMT") {//make sure you have correct font name
                //  layerRef.textItem.contents = desktopHead;

                replaceTextStyleByContent(layerRef.id, params, desktopHead)

                /*      var style = new ActionDescriptor();
                      style.putEnumerated(s2t('baseline'), s2t('baseline'), s2t('superScript'))
                      replaceTextStyleByContent(layerRef.id, superscriptText, style)*/
                //     }//end if for text font
            }//end if for layerkind text
        }//end else
    };//end for loop

};//end function

function artboard_rectangle(layer) {
    try {
        var r = new ActionReference();
        r.putProperty(stringIDToTypeID("property"), stringIDToTypeID("artboard"));
        if (layer) r.putIdentifier(stringIDToTypeID("layer"), layer.id);
        else r.putEnumerated(stringIDToTypeID("layer"), stringIDToTypeID("ordinal"), stringIDToTypeID("targetEnum"));
        var d = executeActionGet(r).getObjectValue(stringIDToTypeID("artboard")).getObjectValue(stringIDToTypeID("artboardRect"));
        var bounds = new Array();
        bounds[0] = d.getUnitDoubleValue(stringIDToTypeID("left"));
        bounds[1] = d.getUnitDoubleValue(stringIDToTypeID("top"));
        bounds[2] = d.getUnitDoubleValue(stringIDToTypeID("right"));
        bounds[3] = d.getUnitDoubleValue(stringIDToTypeID("bottom"));

        return bounds;
    }
    catch (e) { alert(e); }
}

function replaceTextStyleByContent(layerID, params, content) {
    var s2t = stringIDToTypeID;
    (r = new ActionReference()).putProperty(s2t('property'), p = s2t('textKey'));
    r.putIdentifier(s2t('layer'), layerID);

    if (executeActionGet(r).hasKey(p)) {
        var textItem = executeActionGet(r).getObjectValue(p),
            sList = textItem.getList(s2t('textStyleRange')),
            l = new ActionList(),
            styleSheet = [{
                from: 0,
                to: content.length,
                style: function (d) {
                    if (d.hasKey(p = s2t('styleSheetHasParent')) && d.getBoolean(p)) if (d.hasKey(p = s2t('baseParentStyle'))) extendDescriptor(d.getObjectValue(p), d)
                    return d;
                }(sList.getObjectValue(0).getObjectValue(s2t('textStyle'))),
                text: content
            }]

        processParams(params);

        function processParams(p, param) {
            for (var k in p) {
                if (p[k] instanceof Array) {
                    for (var i = 0; i < p[k].length; i++) {
                        processParams(p[k][i], k)
                    }
                } else {
                    $.writeln(param + ': ' + p[k])

                }
            }
        }

        function objToDesc(o, type) {

        }
        /*     do {
     var len = styleSheet.length,
         found = false;
     for (var i = 0; i < len; i++) {
         var offset = 0,
             cur = styleSheet[i].text;
         if (cur) {
             var match = cur.match(new RegExp(text, 'i')),
                 from, to;
             if (match) {
                 from = cur.indexOf(match[0]) + offset
                 to = from + match[0].length
                 offset += match[0].length
                 cur = cur.substring(cur.indexOf(match[0]) + match[0].length)
                 customStyle = setCustomStyle(styleSheet[i], from, to, newStyleDesc)
                 styleSheet.splice.apply(styleSheet, [i, 1].concat(customStyle));
                 len += customStyle.length - 1;
                 i += customStyle.length - 1;
                 found = true
             }
         }
     }
 } while (found)*/

        var l = new ActionList();
        for (var i = 0; i < styleSheet.length; i++) {
            var d = new ActionDescriptor();
            d.putObject(s2t('textStyle'), s2t('textStyle'), styleSheet[i].style)
            d.putInteger(s2t('from'), styleSheet[i].from)
            d.putInteger(s2t('to'), styleSheet[i].to)
            l.putObject(s2t('textStyleRange'), d)
        }
        textItem.putList(s2t('textStyleRange'), l);
        (r = new ActionReference()).putIdentifier(s2t('layer'), layerID);
        (d = new ActionDescriptor()).putReference(s2t('target'), r);
        d.putObject(s2t('to'), s2t('textLayer'), textItem);
        executeAction(s2t('set'), d, DialogModes.NO);
    }

    function setCustomStyle(baseStyleSheet, from, to, newStyleDesc) {
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
        extendDescriptor(baseStyleSheet.style, customStyle);
        extendDescriptor(customStyle, newStyleDesc, true);

        output.push({
            from: from + offset,
            to: to + offset,
            style: newStyleDesc,
            text: null
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
    function extendDescriptor(src_desc, dst_desc) {
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

function colorDescFromHEX(hex) {
    var d = new ActionDescriptor(),
        style = new ActionDescriptor(),
        c = new SolidColor;
    c.rgb.hexValue = hex;
    d.putDouble(s2t('red'), c.rgb.red)
    d.putDouble(s2t('grain'), c.rgb.green)
    d.putDouble(s2t('blue'), c.rgb.blue)
    style.putObject(s2t('color'), s2t('RGBColor'), d)

    return style;
}