#target photoshop
s2t = stringIDToTypeID;

var f = new File(Folder.temp + '/args.txt')
if (f.exists) {
    f.open("r");
    f.encoding = "UTF";
    var s = f.read()
    f.close();
    f.remove();
    if (s.indexOf('.atn') > 0) {
        eval('(new POSHelper).runAction(s);')
    }
    else {
        eval('(new POSHelper).loadFile(s);')
    }
}

function POSHelper() {
    this.runAction = function (arg) {
        while (true) {
            (r = new ActionReference()).putIndex(s2t("actionSet"), 1);
            (d = new ActionDescriptor()).putReference(s2t("null"), r);
            try { executeAction(s2t("delete"), d, DialogModes.NO) } catch (e) { break }
        }
        app.load(new File(arg))
    }
    this.loadFile = function (arg) {
        app.load(new File(arg))
    }
}

/*
var d = new Window('dialog {text: "POS Keytboard Helper", orientation: "column", alignChildren: ["center","top"]}'),
    gArgs = d.add('group {orientation: "column", alignChildren:["left","center"]}'),
    gPath = gArgs.add('group{orientation: "row", alignChildren: ["left","center"]}'),
    stPathTip = gPath.add('statictext {text:"Путь:"}'),
    stPath = gPath.add("statictext{preferredSize:[520, -1]}"),
    bnBrowse = gPath.add("button", [0, 0, 90, -1], "Обзор....", { name: "bnBrowse" });

var pnList = d.add('panel', undefined, undefined, { name: 'pnList' });
pnList.orientation = 'column';
pnList.alignChildren = ['left', 'top'];
pnList.spacing = 10;
pnList.margins = 10;
var grMain = pnList.add('group', undefined, { name: 'grMain' });
grMain.orientation = 'row';
grMain.alignChildren = ['left', 'top'];
grMain.spacing = 10;
grMain.margins = 0;
var list = grMain.add('listbox', undefined, undefined, { name: 'list' });
list.selection = 0;
list.preferredSize.width = 550;
list.preferredSize.height = 200;
var grBn = grMain.add('group', undefined, { name: 'grBn' });
grBn.orientation = 'column';
grBn.alignChildren = ['center', 'center'];
grBn.spacing = 2;
grBn.margins = 0;
grBn.alignment = ['left', 'top'];
var bnAdd = grBn.add('button', undefined, undefined, { name: 'bnAdd' });
bnAdd.text = "Добавить";
bnAdd.preferredSize.width = 95;
var bnDel = grBn.add('button', undefined, undefined, { name: 'bnDel' });
bnDel.text = "Удалить";
bnDel.preferredSize.width = bnAdd.preferredSize.width;
var bnEdit = grBn.add('button', undefined, undefined, { name: 'bnEdit' });
bnEdit.text = "Изменить";
bnEdit.preferredSize.width = bnAdd.preferredSize.width;
var bnUp = grBn.add('button', undefined, undefined, { name: 'bnUp' });
bnUp.text = "Вверх";
bnUp.preferredSize.width = bnAdd.preferredSize.width;
var bnDown = grBn.add('button', undefined, undefined, { name: 'bnDown' });
bnDown.text = "Вниз";
bnDown.preferredSize.width = bnAdd.preferredSize.width;
var bnEnable = grBn.add('button', undefined, undefined, { name: 'bnEnable' });
bnEnable.text = "Включить";
bnEnable.preferredSize.width = bnAdd.preferredSize.width;
var bnDisable = grBn.add('button', undefined, undefined, { name: 'bnDisable' });
bnDisable.text = "Отключить";
bnDisable.preferredSize.width = bnAdd.preferredSize.width;

var grButtons = d.add('group', undefined, { name: 'grButtons' });
grButtons.orientation = 'row';
grButtons.alignChildren = ['left', 'top'];
grButtons.spacing = 10;
grButtons.margins = 0;
grButtons.alignment = ['center', 'top'];
var ok = grButtons.add('button', undefined, undefined, { name: 'ok' });
ok.text = "Сохранить";
var cancel = grButtons.add('button', undefined, undefined, { name: 'cancel' });
cancel.text = "Отмена";

d.show();

*/