/**is there way to script data to store row wise in excel? below code help me save in column
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/is-there-way-to-script-data-to-store-row-wise-in-excel-below-code-help-me-save-in-column/td-p/12806715
 */
s2t = stringIDToTypeID;
(r = new ActionReference()).putProperty(s2t('property'), p = s2t('countClass'));
r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
var items = executeActionGet(r).getList(p),
    logFile = File(Folder.desktop.fsName + '/Pixel coordinates (X_Y).csv'); // choosig file name and format
var t1 = ['Name', 'Object', 'type', 'number', 'jpg'],
    labels = ["X -axis: ", "Y -axis: "];
//Excel data feed
const DIV = ',',
    COLUMNS = t1.length - 1,
    ROWS = 6;
var cur = [];
if (logFile.exists) {
    logFile.open('r');
    for (var i = 0; i < ROWS; i++) {
        cur.push(logFile.readln())
    }
    logFile.close();
}
logFile.open('w');
logFile.writeln((cur[0] ? cur[0] + DIV : '') + t1.join(DIV));
var tmp = []; tmp[COLUMNS - labels.length] = '';
logFile.writeln((cur[1] ? cur[1] + DIV : '') + (labels.concat(tmp)).join(DIV));
var line = [], tmp = [];
for (var i = 0; i < ROWS - 2; i++) {
    if (i < items.count) {
        var line = [Math.floor(items.getObjectValue(i).getUnitDoubleValue(s2t('x'))), Math.floor(items.getObjectValue(i).getUnitDoubleValue(s2t('y')))]
        var tmp = []; tmp[COLUMNS - line.length] = '';
        logFile.writeln((cur[i + 2] ? cur[i + 2] + DIV : '') + (line.concat(tmp)).join(DIV));
    }
    else {
        var tmp = []; tmp[COLUMNS] = '';
        logFile.writeln((cur[i + 2] ? cur[i + 2] + DIV : '') + tmp.join(DIV));
    }
}
logFile.close();
