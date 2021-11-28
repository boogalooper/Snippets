/**Label controls?
 * https://community.adobe.com/t5/photoshop/label-controls/m-p/11471812
 */
#target photoshop
// DIALOG
// ======
var dialog = new Window("dialog");

for (i = 0; i<10; i++) {addSlider (dialog, 'slider '+ i)}

function addSlider(parent, label, min, max) {
    var g = parent.add("group");
    g.orientation = "column";
    g.alignChildren = ["fill", "center"];
    g.spacing = 0;
    g.margins = 0;

    var g1 = g.add("group");
    g1.orientation = "row";
    g1.alignChildren = ["left", "center"];

    var statictext1 = g1.add("statictext");
    statictext1.text = label;
    statictext1.preferredSize.width = 100;
    statictext1.justify = "right";

    var d = g1.add("statictext");
    d.text = min ? min : 0;
    d.preferredSize.width = 20;
    d.justify = "right";

    var s = g1.add("slider");
    s.minvalue = min ? min : 0;
    s.maxvalue = max ? max : 100;
    s.value = 50;
    s.preferredSize.width = 150;

    var u = g1.add("statictext");
    u.text = max ? max : 100;

    var g2 = g.add("group");
    g2.orientation = "row";
    g2.alignChildren = ["right", "center"];
    g2.spacing = 10;
    g2.margins = 0;

    var c = g2.add("statictext");
    c.text = "0";
    c.preferredSize.width = 220;
    c.justify = "center"; 

    s.onChanging = function () {
        c.text = this.value
    }
}
dialog.show();