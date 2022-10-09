/** How do you creating a sub menu of actions to pick from using script
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/how-do-you-creating-a-sub-menu-of-actions-to-pick-from-using-script/td-p/13168058
 * https://www.youtube.com/watch?v=yfc6mIuGCmE
 */

var s2t = stringIDToTypeID,
    atn = getActionsList(),
    cur = getActionName();

if (cur && atn[cur]) {
    var cursor = (getXY()),
        w = new Window("dialog", cur);
    w.preferredSize = [200, 200];
    w.spacing = 0;
    w.location = [cursor[0], cursor[1] + 100]
    for (var i = 0; i < atn[cur].length; i++) {
        var b = w.add('button')
        b.text = atn[cur][i];
        b.onClick = function () {
            w.close()
            doAction(this.text, cur)
        }
    }
    w.show();

    function getXY() {
        var w = new Window("dialog {alignChildren: ['fill','fill'], margins: 0}"),
            g = w.add("button"),
            X, Y;
        w.preferredSize = [$.screens[0].right, $.screens[0].bottom]
        g.addEventListener('mouseover', handler)
        function handler(evt) { w.close(); X = evt.screenX, Y = evt.screenY }
        w.show();
        return [X, Y]
    }
}

function getActionsList() {
    var output = {},
        setCounter = 1
    while (true) {
        (r = new ActionReference()).putIndex(s2t('actionSet'), setCounter);
        try { desc = executeActionGet(r) } catch (e) { break; }
        var numberChildren = desc.hasKey(s2t('numberOfChildren')) ? desc.getInteger(s2t('numberOfChildren')) : 0
        if (numberChildren > 0) {
            output[desc.getString(s2t('name'))] = getActionList(setCounter, numberChildren)
        }
        setCounter++
    }
    return output;

    function getActionList(setIndex, numChildren) {
        var current = []
        for (var i = 1; i <= numChildren; i++) {
            (r = new ActionReference()).putIndex(s2t('action'), i);
            r.putIndex(s2t('actionSet'), setIndex)
            current.push(executeActionGet(r).getString(s2t('name')))
        }
        return current
    }
}

function getActionName() {
    var atn;
    try {
        (r = new ActionReference()).putEnumerated(s2t('action'), s2t('ordinal'), s2t('targetEnum'));
        var parent = executeActionGet(r).getString(s2t('parentName')),
            title = executeActionGet(r).getString(s2t('name'));
        try {
            (r = new ActionReference()).putName(s2t('actionSet'), parent);
            executeActionGet(r).getInteger(s2t('itemIndex'));
            atn = parent;
        } catch (e) {
            (r = new ActionReference()).putName(s2t('actionSet'), title);
            executeActionGet(r).getInteger(s2t('itemIndex'));
            atn = title;
        }
    }
    catch (e) { atn = null }
    return atn;
}