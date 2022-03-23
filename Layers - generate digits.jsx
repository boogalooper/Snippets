/**Script for generating numerical scoreboards based on a template
 * Toggles digit layouts grouped by digits
 * Layout requirements:
 * - layouts of numbers from 0 to 9 must be formed.
 * 1 digit - 1 layer (layer type is not important). Layer name - the same number
 * - numbers must be grouped by digits
 * (units - a group named 1, tens - 10, hundreds - 100, etc.)
 * - before starting work, all groups with digits must be selected and the file saved
https://community.adobe.com/t5/photoshop-ecosystem-discussions/how-to-write-this-script/td-p/12771527
https://youtu.be/KVg8aFLoIIM
*/
#target photoshop
var apl = new AM('application'),
    doc = new AM('document'),
    lr = new AM('layer');
if (apl.getProperty('numberOfDocuments')) {
    if (doc.getProperty('numberOfLayers')) {
        var targetLayers = doc.hasProperty('targetLayersIDs') ? doc.getProperty('targetLayersIDs') : [],
            pth = (doc.getProperty('fileReference')).path,
            selection = [];
        if (targetLayers) {
            for (var i = 0; i < targetLayers.count; i++) {
                var id = targetLayers.getReference(i).getIdentifier(stringIDToTypeID('layerID'))
                if (lr.getProperty('layerKind', id) == 7) selection.push(id)
            }
        }
        if (selection) {
            var digits = collectLayers(selection);
            for (var i = 123456; i <= 123480; i++) makeFile(i, digits, selection)
        }
    }
}
function collectLayers(s, o) {
    o = o ? o : {};
    for (var i = 0; i < s.length; i++) {
        o[Number(lr.getProperty('name', s[i]))] = getLayersList(s[i]);
    }
    return o;
    function getLayersList(id) {
        var idx = lr.getProperty('itemIndex', id),
            indexFrom = doc.getProperty('hasBackgroundLayer') ? --idx : idx,
            o = {};
        for (var i = indexFrom; i >= 1; i--) {
            var layerSection = lr.getProperty('layerSection', i, true).value
            if (layerSection == 'layerSectionStart') continue;
            if (layerSection == 'layerSectionEnd') break;
            o[Number(lr.getProperty('name', i, true))] = lr.getProperty('layerID', i, true);
        }
        return o
    }
}
function setDigits(o, digit) {
    var ids = []
    for (var a in o) ids.push(o[a])
    doc.visiblity(ids)
    doc.visiblity([o[digit]], true)
}
function makeFile(n, o, digits) {
    var fixed = '';
    for (var i = 0; i < digits.length; i++) fixed += '0'
    var num = (fixed + String(n)).substr(-digits.length),
        len = num.length - 1,
        div = 1;
    for (var i = len; i >= 0; i--) {
        var cur = Number(num.substr(i, 1))
        setDigits(o[div], cur)
        div = div * 10
    }
    doc.saveAsPDF(File(pth + '/' + num))
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
            : r.putEnumerated(target, s2t('ordinal'), order ? s2t(order) : s2t('targetEnum'));
        return executeActionGet(r).hasKey(property)
    }
    this.descToObject = function (d) {
        var o = {}
        for (var i = 0; i < d.count; i++) {
            var k = d.getKey(i)
            o[t2s(k)] = getDescValue(d, k)
        }
        return o
    }
    this.selectLayerByIDList = function (IDList) {
        var ref = new ActionReference()
        for (var i = 0; i < IDList.length; i++) {
            ref.putIdentifier(s2t('layer'), IDList[i])
        }
        var desc = new ActionDescriptor()
        desc.putReference(s2t('target'), ref)
        desc.putBoolean(s2t('makeVisible'), false)
        executeAction(s2t('select'), desc, DialogModes.NO)
    }
    this.visiblity = function (ids, show) {
        var mode = show ? 'show' : 'hide',
            r = new ActionReference();
        do { r.putIdentifier(s2t('layer'), ids.shift()) } while (ids.length)
        (l = new ActionList()).putReference(r);
        (d = new ActionDescriptor()).putList(s2t("target"), l);
        executeAction(s2t(mode), d, DialogModes.NO);
    }
    this.saveAsPDF = function (fle) {
        (d = new ActionDescriptor()).putObject(s2t("as"), s2t("photoshopPDFFormat"), new ActionDescriptor());
        d.putPath(s2t("in"), fle);
        d.putBoolean(s2t("copy"), true);
        d.putBoolean(s2t("layers"), false);
        d.putEnumerated(s2t("saveStage"), s2t("saveStageType"), s2t("saveBegin"));
        executeAction(s2t("save"), d, DialogModes.NO);
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