/**Растеризация объекта типа shape после окончания процесса рисования (по нажатию Enter)
 * 
 * Скрипт работает с подсистемой событий Фотошопа, поэтому
 * запуск непосредственно из редактора кода невозможен - скрипт 
 * обязательно должен быть сохранен на диске.
 * 
 * https://community.adobe.com/t5/photoshop/javascript-script-trigger-action-through-enter-key-of-path-deselection/m-p/11573965
 https://www.youtube.com/watch?v=s_VdcEk3eJw
 */

#target photoshop
s2t = stringIDToTypeID,
    t2s = typeIDToStringID;
try { var evt = arguments[0] } catch (e) { }
if (evt) {
    if (app.currentTool == "penTool") {
        app.activeDocument.activeLayer.rasterize(RasterizeType.ENTIRELAYER);
    }
} else {
    app.notifiersEnabled = true
    var f = File($.fileName)
    app.notifiers.add('slct', f, 'Path')
}