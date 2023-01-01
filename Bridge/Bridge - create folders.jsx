/*** The script creates a given number of catalogs using digital numbering*/

#target bridge

toolMenu = new MenuElement("command", "Create folders", "at the end of Tools")
thumbnailMenu = new MenuElement("command", "Create folders", "at the end of Thumbnail")

toolMenu.onSelect = function () { thumbnailMenu.onSelect() }
thumbnailMenu.onSelect = function () {
    var p = app.document.presentationPath,
        len = createDialog();

    if (len) {
        for (var i = 1; i <= len; i++) {
            new Folder(p + "/" + (i < 10 ? "0" + i : i)).create()
        }
    }
}

function createDialog() {
    var d = new Window("dialog");
    d.text = "Create folders";
    d.orientation = "column";
    d.alignChildren = ["center", "top"];
    d.spacing = 10;
    d.margins = 16;

    var et = d.add('edittext');
    et.preferredSize.width = 152;
    et.text = 12

    var ok = d.add("button", undefined, undefined, { name: "ok" });
    ok.text = "ok";

    d.onShow = function () {
        et.active = true
    }

    d.show();

    return Number(et.text);
}