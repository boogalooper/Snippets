/**Photoshop Script Count Group Name
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/photoshop-script-count-group-name/td-p/11151420
 */
#target photoshop
var s2t = stringIDToTypeID,
    doc = new AM('document');
if (doc.hasProperty('countClass')) {
    var f = new File(Folder.temp.fsName + "/" + "counters.jpg"),
        wordToHex = {
            aliceblue: "F0F8FF", antiquewhite: "FAEBD7", aqua: "00FFFF", aquamarine: "7FFFD4", azure: "F0FFFF", beige: "F5F5DC", bisque: "FFE4C4", black: "000000",
            blanchedalmond: "FFEBCD", blue: "0000FF", blueviolet: "8A2BE2", brown: "A52A2A", burlywood: "DEB887", cadetblue: "5F9EA0", chartreuse: "7FFF00",
            chocolate: "D2691E", coral: "FF7F50", cornflowerblue: "6495ED", cornsilk: "FFF8DC", crimson: "DC143C", cyan: "00FFFF", darkblue: "00008B",
            darkcyan: "008B8B", darkgoldenrod: "B8860B", darkgray: "A9A9A9", darkgrey: "A9A9A9", darkgreen: "006400", darkkhaki: "BDB76B", darkmagenta: "8B008B",
            darkolivegreen: "556B2F", darkorange: "FF8C00", darkorchid: "9932CC", darkred: "8B0000", darksalmon: "E9967A", darkseagreen: "8FBC8F", darkslateblue: "483D8B",
            darkslategray: "2F4F4F", darkslategrey: "2F4F4F", darkturquoise: "00CED1", darkviolet: "9400D3", deeppink: "FF1493", deepskyblue: "00BFFF", dimgray: "696969",
            dimgrey: "696969", dodgerblue: "1E90FF", firebrick: "B22222", floralwhite: "FFFAF0", forestgreen: "228B22", fuchsia: "FF00FF", gainsboro: "DCDCDC",
            ghostwhite: "F8F8FF", gold: "FFD700", goldenrod: "DAA520", gray: "808080", grey: "808080", green: "008000", greenyellow: "ADFF2F", honeydew: "F0FFF0",
            hotpink: "FF69B4", indianred: "CD5C5C", indigo: "4B0082", ivory: "FFFFF0", khaki: "F0E68C", lavender: "E6E6FA", lavenderblush: "FFF0F5", lawngreen: "7CFC00",
            lemonchiffon: "FFFACD", lightblue: "ADD8E6", lightcoral: "F08080", lightcyan: "E0FFFF", lightgoldenrodyellow: "FAFAD2", lightgray: "D3D3D3", lightgrey: "D3D3D3",
            lightgreen: "90EE90", lightpink: "FFB6C1", lightsalmon: "FFA07A", lightseagreen: "20B2AA", lightskyblue: "87CEFA", lightslategray: "778899", lightslategrey: "778899",
            lightsteelblue: "B0C4DE", lightyellow: "FFFFE0", lime: "00FF00", limegreen: "32CD32", linen: "FAF0E6", magenta: "FF00FF", maroon: "800000", mediumaquamarine: "66CDAA",
            mediumblue: "0000CD", mediumorchid: "BA55D3", mediumpurple: "9370DB", mediumseagreen: "3CB371", mediumslateblue: "7B68EE", mediumspringgreen: "00FA9A",
            mediumturquoise: "48D1CC", mediumvioletred: "C71585", midnightblue: "191970", mintcream: "F5FFFA", mistyrose: "FFE4E1", moccasin: "FFE4B5",
            navajowhite: "FFDEAD", navy: "000080", oldlace: "FDF5E6", olive: "808000", olivedrab: "6B8E23", orange: "FFA500", orangered: "FF4500",
            orchid: "DA70D6", palegoldenrod: "EEE8AA", palegreen: "98FB98", paleturquoise: "AFEEEE", palevioletred: "DB7093", papayawhip: "FFEFD5",
            peachpuff: "FFDAB9", peru: "CD853F", pink: "FFC0CB", plum: "DDA0DD", powderblue: "B0E0E6", purple: "800080", rebeccapurple: "663399",
            red: "FF0000", rosybrown: "BC8F8F", royalblue: "4169E1", saddlebrown: "8B4513", salmon: "FA8072", sandybrown: "F4A460", seagreen: "2E8B57", seashell: "FFF5EE",
            sienna: "A0522D", silver: "C0C0C0", skyblue: "87CEEB", slateblue: "6A5ACD", slategray: "708090", slategrey: "708090", snow: "FFFAFA", springgreen: "00FF7F",
            steelblue: "4682B4", tan: "D2B48C", teal: "008080", thistle: "D8BFD8", tomato: "FF6347", turquoise: "40E0D0", violet: "EE82EE", wheat: "F5DEB3",
            white: "FFFFFF", whitesmoke: "F5F5F5", yellow: "FFFF00", yellowgreen: "9ACD32",
        };
    for (var a in wordToHex) {
        var groupColor = new SolidColor;
        groupColor.rgb.hexValue = wordToHex[a];
        wordToHex[a] = groupColor;
    }
    var l = doc.getProperty('countClass'),
        counters = {},
        groups = [];
    for (i = 0; i < l.count; i++) {
        var cur = l.getObjectValue(i),
            group = cur.getInteger(s2t('group'));
        if (!counters[group]) counters[group] = [];
        counters[group].push({
            itemIndex: cur.getInteger(s2t('itemIndex')),
            x: cur.getUnitDoubleValue(s2t('x')),
            y: cur.getUnitDoubleValue(s2t('y'))
        })
    }
    doc.duplicate('counters', true);
    doc.fill('white', 100)
    activeDocument.xmpMetadata.rawData = '';
    doc.saveAs(f);
    doc.closeDocument();
    if (f.exists) {
        f.open("r");
        f.encoding = "BINARY";
        var s = f.read()
        f.close()
        f.remove()
        i = s.indexOf('Cnt \0\0\0') - 14
        if (i != -1) {
            try {
                var d = new ActionDescriptor();
                d.fromStream(s.substr(i));
                if (d.count) {
                    var l = d.getList(s2t('countGroupList'))
                    for (var i = 0; i < l.count; i++) {
                        var cur = l.getObjectValue(i),
                            groupColor = new SolidColor;
                        with (groupColor.rgb) {
                            red = cur.getInteger(s2t('red'))
                            green = cur.getInteger(s2t('green'))
                            blue = cur.getInteger(s2t('blue'))
                        }
                        var color = 'white',
                            min = deltaE(groupColor, wordToHex[color]);
                        for (var a in wordToHex) {
                            var dE = deltaE(groupColor, wordToHex[a])
                            if (dE < min) { min = dE, color = a }
                        }
                        groups.push({ title: cur.getString(s2t('name')), color: color });
                    }
                }
            } catch (e) { alert(e) }
        }
    }
    var logFile = new File(Folder.desktop + "/CountItem.csv"),
        div = ';'
    logFile.open('w');
    logFile.writeln(['countGroup', 'dotColor', 'itemIndex', 'x', 'y'].join(div))
    for (var a in counters) {
        var cur = counters[a];
        for (var i = 0; i < cur.length; i++) {
            logFile.writeln([
                groups[Number(a)] ? groups[Number(a)].title : 'Count Group ' + a,
                groups[Number(a)] ? groups[Number(a)].color : 'no color',
                cur[i].itemIndex,
                cur[i].x,
                cur[i].y
            ].join(div))
        }
    }
    logFile.close();
    logFile.execute();
}
function AM(target, order) {
    var s2t = stringIDToTypeID,
        t2s = typeIDToStringID;
    target = s2t(target)
    this.getProperty = function (property, descMode, id, idxMode) {
        property = s2t(property);
        (r = new ActionReference()).putProperty(s2t('property'), property);
        id != undefined ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id)) :
            r.putEnumerated(target, s2t('ordinal'), order ? s2t(order) : s2t('targetEnum'));
        return descMode ? executeActionGet(r) : getDescValue(executeActionGet(r), property)
    }
    this.hasProperty = function (property, id, idxMode) {
        property = s2t(property);
        (r = new ActionReference()).putProperty(s2t('property'), property);
        id ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id))
            : r.putEnumerated(target, s2t('ordinal'), order ? s2t(order) : s2t('targetEnum'));
        return executeActionGet(r).hasKey(property)
    }
    this.duplicate = function (title, merged) {
        (r = new ActionReference()).putEnumerated(s2t("document"), s2t("ordinal"), s2t("targetEnum"));
        (d = new ActionDescriptor()).putReference(s2t("target"), r);
        d.putString(s2t("name"), title);
        if (merged) d.putBoolean(s2t("merged"), merged);
        executeAction(s2t("duplicate"), d, DialogModes.NO);
    }
    this.fill = function (fillContents, opacity) {
        (d = new ActionDescriptor()).putEnumerated(s2t("using"), s2t("fillContents"), s2t(fillContents));
        d.putUnitDouble(s2t("opacity"), s2t("percentUnit"), opacity);
        d.putEnumerated(s2t("mode"), s2t("blendMode"), s2t("normal"));
        executeAction(s2t("fill"), d, DialogModes.NO);
    }
    this.saveAsJPG = function (pth) {
        (d = new ActionDescriptor()).putInteger(s2t("extendedQuality"), 0);
        d.putEnumerated(s2t("matteColor"), s2t("matteColor"), s2t("none"));
        (d1 = new ActionDescriptor()).putObject(s2t("as"), s2t("JPEG"), d);
        d1.putPath(s2t("in"), pth);
        d1.putBoolean(s2t("embedProfiles"), false);
        executeAction(s2t("save"), d1, DialogModes.NO);
    }
    this.closeDocument = function () {
        (d = new ActionDescriptor()).putEnumerated(s2t('saving'), s2t('yesNo'), s2t('no'));
        executeAction(s2t('close'), d, DialogModes.NO)
    }
    function getDescValue(d, p) {
        switch (d.getType(p)) {
            case DescValueType.OBJECTTYPE: return (d.getObjectValue(p));
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
            case DescValueType.ENUMERATEDTYPE: return [t2s(d.getEnumerationType(p)), t2s(d.getEnumerationValue(p))];
            default: break;
        };
    }
}
function deltaE(a, b) {
    return Math.sqrt(Math.pow(b.lab.l - a.lab.l, 2) + Math.pow(b.lab.a - a.lab.a, 2) + Math.pow(b.lab.b - a.lab.b, 2))
}
