/** Split files in groups of 12, put each in a subfolder with the name of the first file */


const divide = 12;

var fld = (new Folder).selectDlg();
if (fld) {
    var fls = findAllFiles(fld);
    do {
        var cur = new Folder(fld + '/' + fls[0].name.replace(/\..+$/, ''));
        if (!cur.exists) cur.create();

        for (var i = 0; i < divide; i++) {
            if (fls.length) {
                f = fls.shift();
                f.rename(cur + '/' + f.name)
            }
        }
    } while (fls.length)
}

function findAllFiles(srcFolder, output) {
    if (!srcFolder) return;
    output = output ? output : [];
    var fls = Folder(srcFolder).getFiles(),
        flds = [];
    for (var i = 0; i < fls.length; i++) {
        var fileFoldObj = fls[i];
        if (fileFoldObj instanceof File) {
            if (!fileFoldObj.hidden) output.push(fileFoldObj)
        } else {
            flds.push(fileFoldObj)
        }
    }
    for (var i = 0; i < flds.length; i++) findAllFiles(flds[i], output)
    return output;
}