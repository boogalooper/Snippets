/**Последовательный запуск экшенов из одной группы для активного документа 
 * с возможностью указания от какой и до какой операции проигрывать
 * (скрипт предназначен для записи в экшен, при автономном запуске бесполезен)
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/script-to-play-all-actions-in-a-set-against-a-single-image/m-p/11866609
 * https://www.youtube.com/watch?v=-nDhpjvciG8
 */
#target photoshop
/*
<javascriptresource>
<name>Play all actions</name>
<eventid>957c6aae-60f7-49d7-817a-f93d6c2378ef</eventid>
<terminology><![CDATA[<< /Version 1
                       /Events <<
                       /957c6aae-60f7-49d7-817a-f93d6c2378ef [(Play all actions) <<
                       >>]
                        >>
                     >> ]]></terminology>
</javascriptresource>
*/
var s2t = stringIDToTypeID,
    isCancelled = false,
    u;
if (!playbackParameters.count) {
    (d = new ActionDescriptor()).putString(s2t('target'), 'play from next action');
    if (selectMode(d) == 1) { playbackParameters = d } else { isCancelled = true }
} else {
    d = playbackParameters;
    if (playbackDisplayDialogs == DialogModes.ALL) {
        if (selectMode(d) == 1) { playbackParameters = d }
    } else if (playbackDisplayDialogs != DialogModes.ALL) {
        $.setenv('stop', (d.getString(s2t('target')) == 'stop here'))
        set = getActionIdx()
        for (var i = set.atnIdx; i <= set.len; i++) {
            if ($.getenv('stop') == 'true') {break; }
            (r = new ActionReference()).putIndex(s2t('action'), i);
            r.putIndex(s2t('actionSet'), set.setIdx);
            (d = new ActionDescriptor()).putReference(s2t('target'), r);
            try { executeAction(s2t('play'), d) } catch (e) { }
        }
    }
}
isCancelled ? 'cancel' : u
function selectMode(d) {
    w = new Window("dialog {text: 'Play all actions', orientation: 'column', alignChildren: ['left','top']}"),
        p = w.add("radiobutton{text: 'play from next action'}"),
        s = w.add("radiobutton{text: 'stop here'}"),
        g = w.add("group{orientation: 'row', alignChildren: ['left', 'center']}"),
        ok = g.add("button", u, 'Save settings', { name: 'ok' }),
        cancel = g.add("button", u, 'Cancel', { name: 'cancel' });
    p.value = (d.getString(s2t('target')) == p.text)
    s.value = (d.getString(s2t('target')) == s.text)
    p.onClick = function () { d.putString(s2t('target'), this.text) }
    s.onClick = function () { d.putString(s2t('target'), this.text) }
    return w.show();
}
function getActionIdx() {
    (r = new ActionReference()).putEnumerated(s2t('action'), s2t('ordinal'), s2t('targetEnum'));
    command = executeActionGet(r);
    return getSetIdx(command.getInteger(s2t('parentIndex')), command.getString(s2t('parentName')))
    function getSetIdx(atnIdx, atnName) {
        var setIdx = 1
        while (true) {
            (r = new ActionReference()).putIndex(s2t('actionSet'), setIdx)
            try { d = executeActionGet(r) } catch (e) { break; }
            var numberOfChildren = d.hasKey(s2t('numberOfChildren')) ? d.getInteger(s2t('numberOfChildren')) : 0
            if (numberOfChildren > 0 && atnIdx <= numberOfChildren) {
                (r = new ActionReference()).putProperty(s2t('property'), s2t('name'));
                r.putIndex(s2t('action'), atnIdx);
                r.putIndex(s2t('actionSet'), setIdx);
                if (executeActionGet(r).getString(s2t('name')) == atnName) { return { setIdx: setIdx, len: numberOfChildren, atnIdx: atnIdx + 1 } }
            }
            setIdx++
        }
        return null
    }
}