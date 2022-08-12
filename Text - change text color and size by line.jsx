/**Code for menu design
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/code-for-menu-design/td-p/13106692
 */
#target photoshop
var newColors = ['ff0000', '1200ff'],
    newSizes = [50, 20],
    s2t = stringIDToTypeID;
(r = new ActionReference()).putProperty(s2t('property'), p = s2t('textKey'));
r.putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
if (executeActionGet(r).hasKey(p)) {
    var textKey = executeActionGet(r).getObjectValue(p),
        tList = textKey.getList(s2t('textStyleRange')),
        l = new ActionList(),
        styleSheet = [],
        lines = textKey.getString(s2t('textKey')).split('\r');
    for (var i = 0; i < tList.count; i++) {
        styleSheet.push({
            from: tList.getObjectValue(i).getInteger(s2t('from')),
            to: tList.getObjectValue(i).getInteger(s2t('to')),
            style: function (d) {
                if (d.hasKey(p = s2t('styleSheetHasParent')) && d.getBoolean(p)) if (d.hasKey(p = s2t('baseParentStyle'))) extend_descriptor(d.getObjectValue(p), d)
                return d;
            }(tList.getObjectValue(i).getObjectValue(s2t('textStyle')))
        })
    };
    var from = 0;
    for (var i = 0; i < lines.length; i++) {
        var to = from + lines[i].length + 1,
            cur = function (s, idx) { for (var i = 0; i < s.length; i++) if (s[i].from <= idx && s[i].to > idx) return s[i].style }(styleSheet, from),
            color = function (h) { var c = new SolidColor; c.rgb.hexValue = h; newColors.push(h); return c }(newColors.shift()),
            size = function (s) { newSizes.push(s); return s }(newSizes.shift());
        var d = new ActionDescriptor();
        with (color.rgb) {
            d.putDouble(s2t('red'), red)
            d.putDouble(s2t('green'), green)
            d.putDouble(s2t('blue'), blue)
            cur.putObject(s2t('color'), s2t('RGBColor'), d)
        }
        cur.putUnitDouble(cur.hasKey(s2t('impliedFontSize')) ? s2t('impliedFontSize') : s2t('size'), s2t('pixelsUnit'), size);
        d = new ActionDescriptor();
        d.putObject(s2t('textStyle'), s2t('textStyle'), cur)
        d.putInteger(s2t('from'), from)
        d.putInteger(s2t('to'), to)
        l.putObject(s2t('textStyleRange'), d)
        from = to
    }
    textKey.putList(s2t('textStyleRange'), l);
    (r = new ActionReference()).putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
    (d = new ActionDescriptor()).putReference(s2t('target'), r);
    d.putObject(s2t('to'), s2t('textLayer'), textKey);
    executeAction(s2t('set'), d, DialogModes.NO);
}
/** by @r-bin
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/how-to-copy-save-styles-typeface-font-size-design-etc-of-arbitrary-text-fragments-and-apply-them-to/m-p/10522630?search-action-id=307670300281&search-result-uid=10522630
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
