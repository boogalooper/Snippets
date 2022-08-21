/**Remove DocumentAncestors recursively for all SmartObjects in a PSD
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/remove-documentancestors-recursively-for-all-smartobjects-in-a-psd/m-p/13048321#M655497
 */
findAndOpen('~/Documents/PSD', 'Italy')
function findAndOpen(folder, text) {
    var fls = Folder(folder).getFiles(),
        r = RegExp('^' + text, 'i');
    for (var i = 0; i < fls.length; i++) {
        var cur = fls[i];
        if (cur instanceof File) {
            if (r.test(decodeURI(cur.name))) open(cur)
        } else findAndOpen(cur, text)
    }
}