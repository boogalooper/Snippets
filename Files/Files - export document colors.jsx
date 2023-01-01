/**
 * Export Color Table as hex codes?
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/export-color-table-as-hex-codes/td-p/13217982
 */
const DE_CIE76 = 0; //color difference: 0-255
const THRESHOLD = 0; //color pixels threshold
var s2t = stringIDToTypeID,
    t2s = typeIDToStringID,
    colorsObj = {},
    colorsArr = [];
(r = new ActionReference()).putProperty(s2t('property'), p = s2t('mode'));
r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
if (t2s(executeActionGet(r).getEnumerationValue(p)) == 'RGBColor') {
    var f = new File(Folder.temp + '/colors.raw');
    (d = new ActionDescriptor()).putBoolean(s2t("channelsInterleaved"), true);
    d.putBoolean(s2t('copy'), true);
    (d1 = new ActionDescriptor()).putObject(s2t("as"), s2t("rawFormat"), d);
    d1.putPath(s2t("in"), f);
    executeAction(s2t("save"), d1, DialogModes.NO);
    f.open('r');
    f.encoding = "BINARY";
    doForcedProgress('Reading colors', 'readColors(f.read(), colorsObj)');
    f.close();
    f.remove();
    for (var a in colorsObj) if (colorsObj[a] > THRESHOLD) colorsArr.push({ pixels: colorsObj[a], hex: a });
    if (DE_CIE76) doForcedProgress('Filtering colors by dE = ' + DE_CIE76, 'filterByDE(colorsArr)');
    var f = File(Folder.desktop.fsName + "/" + activeDocument.name.replace(/\.[0-9a-z]+$/i, '') + '.csv');
    f = f.saveDlg('Save file', '*.csv,*.htm');
    if (f) {
        if (f.open('w')) {
            if (f.fsName.match(/\.[0-9a-z]+$/i)[0] == '.csv') {
                f.writeln('HEX;PixelCount')
                for (var i = 0; i < colorsArr.length; i++) {
                    if (!colorsArr[i]) continue;
                    f.writeln('#' + colorsArr[i].hex + ';' + colorsArr[i].pixels)
                }
            } else {
                f.write('<table>\n<tbody>\n<tr>\n<th>HEX</th>\n<th>Color</th>\n<th>Pixel count</th>\n</tr>')
                for (var i = 0; i < colorsArr.length; i++) {
                    if (!colorsArr[i]) continue;
                    f.writeln('<tr>\n<td>#' + colorsArr[i].hex + '</td>\n<td style="background-color: #' + colorsArr[i].hex + ';"></td>\n<td>' + colorsArr[i].pixels + '</td>\n</tr>')
                }
                f.write('</tbody>\n</table>')
            }
            f.close()
        } else { alert(decodeURI(f) + '\nFile access error') }
    }
}
function readColors(s, colorsObj) {
    for (var i = 0; i < s.length; i += 3) {
        var cur = toHex(s, i, 3)
        updateProgress(i, s.length)
        if (colorsObj[cur]) colorsObj[cur]++; else colorsObj[cur] = 1;
    }
}
function filterByDE(c) {
    for (var i = 0; i < c.length; i++) {
        updateProgress(i, c.length)
        if (c[i] == null) continue;
        var cA = new SolidColor;
        cA.rgb.hexValue = c[i].hex;
        for (var x = i + 1; x < c.length; x++) {
            if (c[x] == null || c[i] == null) continue;
            var cB = new SolidColor;
            cB.rgb.hexValue = c[x].hex;
            if (deltaE(cA, cB) <= 10) {
                if (c[i].pixels > c[x].pixels) {
                    c[i].pixels += c[x].pixels
                    c[x] = null
                } else {
                    c[x].pixels += c[i].pixels
                    c[i] = null
                }
            }
        }
    }
}
function toHex(s, from, bits) {
    var h = '';
    for (var i = from; i < from + bits; i++) h += (('0' + s.charCodeAt(i).toString(16)).slice(-2));
    return h
}
function deltaE(a, b) {
    return Math.sqrt(Math.pow(b.lab.l - a.lab.l, 2) + Math.pow(b.lab.a - a.lab.a, 2) + Math.pow(b.lab.b - a.lab.b, 2))
}