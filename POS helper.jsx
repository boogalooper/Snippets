#target photoshop
s2t = stringIDToTypeID;

var f = new File(Folder.temp + '/args.txt'),
    c = 0;
do {
    c++;
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
        break;
    }
    $.sleep(250)
} while (c < 5)

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
