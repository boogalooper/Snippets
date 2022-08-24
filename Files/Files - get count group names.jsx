/**Photoshop Script Count Group Name
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/photoshop-script-count-group-name/td-p/11151420
 */
#target photoshop
var s2t = stringIDToTypeID,
    doc = new AM('document'),
    f = new File(Folder.temp.fsName + "/" + "counters.jpg");
if (doc.hasProperty('countClass')) {
    var l = doc.getProperty('countClass'),
        counters = {},
        groups = [];
    for (i = 0; i < l.count; i++) {
        var cur = l.getObjectValue(i),
            group = cur.getInteger(s2t('group'));
        if (!counters[group]) counters[group] = [];
        counters[group].push({
            itemIndex: cur.getInteger(s2t('itemIndex')),
            x: cur.getUnitDoubleValue(s2t('x')),
            y: cur.getUnitDoubleValue(s2t('y'))
        })
    }
    doc.duplicate('counters', true);
    doc.fill('white', 100)
    activeDocument.xmpMetadata.rawData = '';
    doc.saveAsJPG(f);
    doc.closeDocument();
    if (f.exists) {
        f.open("r");
        f.encoding = "BINARY";
        var s = f.read()
        f.close()
        f.remove()
        i = s.indexOf('Cnt \0\0\0') - 14
        if (i != -1) {
            try {
                var d = new ActionDescriptor();
                d.fromStream(s.substr(i));
                if (d.count) {
                    var l = d.getList(s2t('countGroupList'))
                    for (var i = 0; i < l.count; i++) {
                        groups.push(l.getObjectValue(i).getString(s2t('name')));
                    }
                }
            } catch (e) { alert(e) }
        }
    }
    var logFile = new File(Folder.desktop + "/CountItem.csv"),
        div = ';'
    logFile.open('w');
    logFile.writeln(['countGroup', 'itemIndex', 'x', 'y'].join(div))
    for (var a in counters) {
        var cur = counters[a],
            group = groups[Number(a)] ? groups[Number(a)] : 'Count Group ' + a
        for (var i = 0; i < cur.length; i++) {
            logFile.writeln([group, cur[i].itemIndex, cur[i].x, cur[i].y].join(div))
        }
    }
    logFile.close();
    logFile.execute();
}
function AM(target, order) {
    var s2t = stringIDToTypeID,
        t2s = typeIDToStringID;
    target = s2t(target)
    this.getProperty = function (property, descMode, id, idxMode) {
        property = s2t(property);
        (r = new ActionReference()).putProperty(s2t('property'), property);
        id != undefined ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id)) :
            r.putEnumerated(target, s2t('ordinal'), order ? s2t(order) : s2t('targetEnum'));
        return descMode ? executeActionGet(r) : getDescValue(executeActionGet(r), property)
    }
    this.hasProperty = function (property, id, idxMode) {
        property = s2t(property);
        (r = new ActionReference()).putProperty(s2t('property'), property);
        id ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id))
            : r.putEnumerated(target, s2t('ordinal'), order ? s2t(order) : s2t('targetEnum'));
        return executeActionGet(r).hasKey(property)
    }
    this.duplicate = function (title, merged) {
        (r = new ActionReference()).putEnumerated(s2t("document"), s2t("ordinal"), s2t("targetEnum"));
        (d = new ActionDescriptor()).putReference(s2t("target"), r);
        d.putString(s2t("name"), title);
        if (merged) d.putBoolean(s2t("merged"), merged);
        executeAction(s2t("duplicate"), d, DialogModes.NO);
    }
    this.fill = function (fillContents, opacity) {
        (d = new ActionDescriptor()).putEnumerated(s2t("using"), s2t("fillContents"), s2t(fillContents));
        d.putUnitDouble(s2t("opacity"), s2t("percentUnit"), opacity);
        d.putEnumerated(s2t("mode"), s2t("blendMode"), s2t("normal"));
        executeAction(s2t("fill"), d, DialogModes.NO);
    }
    this.saveAsJPG = function (pth) {
        (d = new ActionDescriptor()).putInteger(s2t("extendedQuality"), 0);
        d.putEnumerated(s2t("matteColor"), s2t("matteColor"), s2t("none"));
        (d1 = new ActionDescriptor()).putObject(s2t("as"), s2t("JPEG"), d);
        d1.putPath(s2t("in"), pth);
        d1.putBoolean(s2t("embedProfiles"), false);
        executeAction(s2t("save"), d1, DialogModes.NO);
    }
    this.closeDocument = function () {
        (d = new ActionDescriptor()).putEnumerated(s2t('saving'), s2t('yesNo'), s2t('no'));
        executeAction(s2t('close'), d, DialogModes.NO)
    }
    function getDescValue(d, p) {
        switch (d.getType(p)) {
            case DescValueType.OBJECTTYPE: return (d.getObjectValue(p));
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
            case DescValueType.ENUMERATEDTYPE: return [t2s(d.getEnumerationType(p)), t2s(d.getEnumerationValue(p))];
            default: break;
        };
    }
}
