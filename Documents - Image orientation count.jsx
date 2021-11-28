/**how to get all open documnet dimensions with one alert
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/how-to-get-all-open-documnet-dimensions-with-one-alert/m-p/12548870
 */
#target photoshop

var s2t = stringIDToTypeID,
    t2s = typeIDToStringID,
    w = new Window("dialog {text: 'Window with the open files in the program'}"),
    l = w.add("dropdownlist{preferredSize: [500, 400]}"),
    b = w.add("button {text:'Ok'}", undefined, undefined, { name: "ok" }),
    icoRed = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x06\x00\x00\x00\u008D2\u00CF\u00BD\x00\x00\x00;IDAT\x18\u0095c\u00FCci\u00F3\u009F\u0081\b\u00C0\x02R\u00C2((\u0084W\u00E5\u00FF\u00F7\u00EF \n\u00C1\u0080\u0087\x17\u00BB\u00AA/\u009F\u00C1\x14\x131\u00D6\x0E\x15\u0085\b_C}\u0087W!(\u009C\u00F0\x02\x06\x06\x06\x00\x18\u00EF\fO\u0083\b\u00CC\u00FD\x00\x00\x00\x00IEND\u00AEB`\u0082",
    icoGreen = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x06\x00\x00\x00\u008D2\u00CF\u00BD\x00\x00\x00=IDAT\x18\u0095c\u00F4\u00DEo\u00F8\u009F\u0081\b\u00C0\x02R\"\u00C6\u00C9\u008FW\u00E5\u00AB\u00EF\x1F!\nA@\u0090\u009D\x1B\u00AB\u00A2\u00F7?\u00BF\u0082i&b\u00AC\x1D*\n\u00E1\u00BE\u0086\u00F9\x0E\u00AFBP8\u00E1\x05\f\f\f\x000\x1F\x0E\x05z4V\u0094\x00\x00\x00\x00IEND\u00AEB`\u0082";


l.onClick = function () {
    if (l.items.length) {
        (r = new ActionReference()).putIndex(s2t('document'), l.selection + 1);
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        executeAction(s2t('select'), d, DialogModes.NO)
    }
}

l.onDoubleClick = function () { w.close() }

w.onShow = function () {
    l.graphics.font = "Tahoma-Bold:14";
    var len = getPropertyDesc('application', p = 'numberOfDocuments').getInteger(s2t(p));
    if (len) {
        for (var i = 1; i <= len; i++) {
            var res = getPropertyDesc('document', p = 'resolution', i).getDouble(s2t(p))
            l.add('item',
                getPropertyDesc('document', p = 'title', i).getString(s2t(p)) +
                ' @ ' + Math.round(getPropertyDesc('document', p = 'zoom', i).getDouble(s2t(p)) * 100, 2) + '% ' +
                Math.round(getPropertyDesc('document', p = 'width', i).getDouble(s2t(p)) * res / 72 / res * 25.4) + 'x' +
                Math.round(getPropertyDesc('document', p = 'height', i).getDouble(s2t(p)) * res / 72 / res * 25.4) + 'mm ' +
                (mode = t2s(getPropertyDesc('document', p = 'mode', i).getEnumerationValue(s2t(p))).replace(new RegExp('Color(Enum)?'), '')) + '/' +
                getPropertyDesc('document', p = 'depth', i).getInteger(s2t(p))
            )
            for(var prop in l.items[i - 1].__proto__) alert(prop)

            l.items[i - 1].image = mode == 'CMYK' ? icoGreen : icoRed

            
        }
        l.selection = getPropertyDesc('document', p = 'itemIndex').getInteger(s2t(p)) - 1
    }
}
w.show();

function getPropertyDesc(target, property, idx) {
    target = s2t(target);
    (r = new ActionReference()).putProperty(s2t('property'), s2t(property));
    idx ? r.putIndex(target, idx) : r.putEnumerated(target, s2t('ordinal'), s2t('targetEnum'));
    return executeActionGet(r);
}