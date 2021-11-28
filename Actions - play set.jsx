/**Script to play all actions in a set against a single image
 * community.adobe.com/t5/photoshop-ecosystem-discussions/script-to-play-all-actions-in-a-set-against-a-single-image/m-p/11864769
 */
#target photoshop

var s2t = stringIDToTypeID,
    w = new Window("dialog {text: 'Select action set', orientation: 'column', alignChildren: ['center','top']}"),
    l = w.add("listbox{helpTip: 'doble click to play all actions', preferredSize: [250, 200]}"),
    g = w.add("group{orientation: 'row', alignChildren: ['left', 'center']}"),
    ok = g.add("button", undefined, 'Play all actions', { name: 'ok' }),
    cancel = g.add("button", undefined, 'Cancel', { name: 'cancel' }),
    idx = 1;

while (true) {
    (r = new ActionReference()).putIndex(s2t('actionSet'), idx++);
    try { l.add('item', executeActionGet(r).getString(s2t('name'))) } catch (e) { break; }
}
l.selection = 0; ok.enabled = l.items.length;
l.onClick = function () { ok.enabled = this.selection ? true : false };
ok.onClick = function () { l.onDoubleClick() }
l.onDoubleClick = function () {
    if (idx = this.selection.index + 1) {
        w.close();
        (r = new ActionReference()).putIndex(s2t('actionSet'), idx);
        var len = executeActionGet(r).getInteger(s2t('numberOfChildren'));
        for (var i = 1; i <= len; i++) {
            (r = new ActionReference()).putIndex(s2t('action'), i);
            r.putIndex(s2t('actionSet'), idx);
            (d = new ActionDescriptor()).putReference(s2t('target'), r);
            try { executeAction(s2t('play'), d) } catch (e) { }
        }
    }
}
w.show();