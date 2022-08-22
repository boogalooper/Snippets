/*** The script creates a given number of catalogs using digital numbering*/

#target bridge

toolMenu = new MenuElement("command", "Create folders", "at the end of Tools")
thumbnailMenu = new MenuElement("command", "Create folders", "at the end of Thumbnail")

toolMenu.onSelect = function () { thumbnailMenu.onSelect() }
thumbnailMenu.onSelect = function () {
    var p = app.document.presentationPath,
        len = prompt("количество создаваемых каталогов в " + p, 0)

    if (Number(len)) {
        for (var i = 1; i <= len; i++) {
            new Folder(p + "/" + (i < 10 ? "0" + i : i)).create()
        }
    }
}