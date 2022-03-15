/** Экспорт в файл всех координат Count Tool 
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/script-to-export-coordinates-x-y-in-pixel/td-p/12558105
*/
#target photoshop
s2t = stringIDToTypeID;

(r = new ActionReference()).putProperty(s2t('property'), p = s2t('countClass'));
r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
var items = executeActionGet(r).getList(p),
    logFile = File(Folder.desktop.fsName + '/' + 'Pixel coordinates (X;Y).csv');

logFile.open('a');
for (var i = 0; i < items.count; i++) {
    logFile.writeln(
        Math.floor(items.getObjectValue(i).getUnitDoubleValue(s2t('x'))) + ';'
        + Math.floor(items.getObjectValue(i).getUnitDoubleValue(s2t('y'))))
}
logFile.close();