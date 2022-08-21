/**Opening window on mouse.
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/opening-window-on-mouse/td-p/13143208
 */
var cursor = (getXY());
var w = new Window("dialog", 'Test');
w.preferredSize = [200, 200];
w.location = [cursor[0], cursor[1]]
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