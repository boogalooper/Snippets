#target photoshop
const SEARCH_IN_SUBFOLDERS = true;
const PLACE_FILE = false;
const PLACE_AS_LINKED = false;
var apl = new AM('application'),
    doc = new AM('document');
if (apl.getProperty('numberOfDocuments') && doc.hasProperty('fileReference')) {
    var pth = doc.getProperty('fileReference'),
        f = decodeURI(pth),
        pattern = decodeURI(pth.name).replace(/\..+$/, ''),
        result = null;
    findAllFiles(pth.parent, allFiles = [], SEARCH_IN_SUBFOLDERS)
    for (var i = 0; i < allFiles.length; i++) {
        if (f == decodeURI(allFiles[i])) continue;
        if (pattern == decodeURI(allFiles[i].name).replace(/\..+$/, '')) { result = allFiles[i] }
    }
    if (result) {
        if (PLACE_FILE) doc.place(result) else open(result)
    }
}
function findAllFiles(srcFolder, fileObj, useSubfolders) {
    if (!srcFolder) return
    var fileFolderArray = Folder(srcFolder).getFiles(),
        subfolderArray = [];
    for (var i = 0; i < fileFolderArray.length; i++) {
        if (fileFolderArray[i] instanceof File) {
            if (!fileFolderArray[i].hidden) fileObj.push(fileFolderArray[i])
        } else if (useSubfolders) {
            subfolderArray.push(fileFolderArray[i])
        }
    }
    if (useSubfolders) {
        for (var i = 0; i < subfolderArray.length; i++) findAllFiles(subfolderArray[i], fileObj, useSubfolders)
    }
}
function AM(target, order) {
    var s2t = stringIDToTypeID,
        t2s = typeIDToStringID;
    target = target ? s2t(target) : null;
    this.getProperty = function (property, id, idxMode) {
        property = s2t(property);
        (r = new ActionReference()).putProperty(s2t('property'), property);
        id != undefined ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id)) :
            r.putEnumerated(target, s2t('ordinal'), order ? s2t(order) : s2t('targetEnum'));
        return getDescValue(executeActionGet(r), property)
    }
    this.hasProperty = function (property, id, idxMode) {
        property = s2t(property);
        (r = new ActionReference()).putProperty(s2t('property'), property);
        id ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id))
            : r.putEnumerated(target, s2t('ordinal'), s2t('targetEnum'));
        try { return executeActionGet(r).hasKey(property) } catch (e) { return false }
    }
    this.place = function (pth) {
        (d = new ActionDescriptor()).putPath(s2t("null"), pth);
        d.putBoolean(s2t("linked"), PLACE_AS_LINKED);
        executeAction(s2t("placeEvent"), d, DialogModes.NO);
    }
    function getDescValue(d, p) {
        switch (d.getType(p)) {
            case DescValueType.OBJECTTYPE: return { type: t2s(d.getObjectType(p)), value: d.getObjectValue(p) };
            case DescValueType.LISTTYPE: return d.getList(p);
            case DescValueType.REFERENCETYPE: return d.getReference(p);
            case DescValueType.BOOLEANTYPE: return d.getBoolean(p);
            case DescValueType.STRINGTYPE: return d.getString(p);
            case DescValueType.INTEGERTYPE: return d.getInteger(p);
            case DescValueType.LARGEINTEGERTYPE: return d.getLargeInteger(p);
            case DescValueType.DOUBLETYPE: return d.getDouble(p);
            case DescValueType.ALIASTYPE: return d.getPath(p);
            case DescValueType.CLASSTYPE: return d.getClass(p);
            case DescValueType.UNITDOUBLE: return (d.getUnitDoubleValue(p));
            case DescValueType.ENUMERATEDTYPE: return { type: t2s(d.getEnumerationType(p)), value: t2s(d.getEnumerationValue(p)) };
            default: break;
        };
    }
}
