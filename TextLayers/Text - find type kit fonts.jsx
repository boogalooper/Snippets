/**
 * Determine if font is type kit font
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/determine-if-font-is-type-kit-font/td-p/13318966
 */

#target photoshop
var s2t = stringIDToTypeID,
    documentFonts = {},
    typeKitFonts = [];

(r = new ActionReference()).putProperty(s2t('property'), p = s2t('numberOfLayers'));
r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
var len = executeActionGet(r).getInteger(p);
for (var i = 1; i <= len; i++) {
    (r = new ActionReference()).putProperty(s2t('property'), p = s2t('textKey'));
    r.putIndex(s2t('layer'), i);
    if (executeActionGet(r).hasKey(p)) {
        var sList = executeActionGet(r).getObjectValue(p).getList(s2t('textStyleRange'));
        for (var x = 0; x < sList.count; x++) {
            documentFonts[sList.getObjectValue(x).getObjectValue(s2t('textStyle')).getString(s2t('fontPostScriptName'))] = false
        }
    }
}
var f = new File(Folder.userData + '/Adobe/CoreSync/plugins/livetype/c/entitlements.xml');
if (f.exists) {
    f.open('r')
    var xmlStr = f.read();
    f.close();
    if (xmlStr.length) {
        var contentXML = new XML(xmlStr),
            typeKit = new XML(contentXML.fonts),
            i = 0;
        while (typeKit.font[i]) typeKitFonts.push(String(typeKit.font[i++].properties.fullName).replace(/\W/g, ''));
    }
}

for (a in documentFonts) {
    var cur = a.replace(/\W/g, '')
    //var cur = 'BerninoSansCondensedCondensedRegularItalic'
    for (var i = 0; i < typeKitFonts.length; i++) {
        $.writeln(cur.length + ':' + Math.abs(levenshteinDistance(cur, typeKitFonts[i])))

    }
}

/**
 * Andrei Mackenzie
 * https://gist.github.com/andrei-m/982927 * 
 */
function levenshteinDistance(a, b) {
    if (a.length == 0) return b.length;
    if (b.length == 0) return a.length;

    var matrix = [];

    // increment along the first column of each row
    var i;
    for (i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    // increment each column in the first row
    var j;
    for (j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for (i = 1; i <= b.length; i++) {
        for (j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) == a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
                    Math.min(matrix[i][j - 1] + 1, // insertion
                        matrix[i - 1][j] + 1)); // deletion
            }
        }
    }

    return matrix[b.length][a.length];
}

$.writeln(documentFonts.toSource());
$.writeln(typeKitFonts);