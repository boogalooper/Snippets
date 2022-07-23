#target photoshop
//app.doProgress('', 'main()')
main()
function main() {
    var doc = new AM('document'),
        strDelimiter = ';', // change csv div here if needed
        source = doc.hasProperty('fileReference') ? doc.getProperty('fileReference') : null,
        ext = source ? decodeURI(source.name).match(/\..*$/)[0] : null,
        pth = Folder(source.path),
        init = activeDocument.activeHistoryState;
    if (pth) {
        var csv = pth.getFiles(/\.(csv)$/i);
        if (csv.length) {
            var fileContent = [],
                currentFile = csv.shift(),
                fileName = decodeURI(currentFile.name).replace(/\.csv/i, '');
            currentFile.open("r");
            do {
                var line = currentFile.readln()
                if (line != "") fileContent.push(line)
            } while (!currentFile.eof)
            currentFile.close()
            if (fileContent.length) {
                var csvContent = [];
                do {
                    csvContent.push(splitCSVLine(fileContent.shift(), strDelimiter))
                } while (fileContent.length)
            }
            var headers = csvContent.shift(),
                numberOfLines = csvContent.length,
                csvObject = {};
            do {
                var cur = headers.shift().toLowerCase();
                csvObject[cur] = [];
                for (var i = 0; i < csvContent.length; i++) {
                    csvObject[cur].push(csvContent[i].shift())
                }
            } while (headers.length)
            for (var i = 0; i < numberOfLines; i++) {
                var newFilename = fileName + ' ' + (('0000' + (i + 1)).slice(-4));
                doc.hslAdjustment(csvObject['hue'][i], csvObject['saturation'][i], csvObject['lightness'][i], csvObject['colorize'][i])
                activeDocument.saveAs(File(pth + '/' + newFilename.replace(/\.[^\.]+$/, '')), function () { var o = new JPEGSaveOptions; o.quality = 12; return o }(), true)
                activeDocument.activeHistoryState = init
            }
        }
    }
}
function splitCSVLine(strData, strDelimiter) {
    strDelimiter = (strDelimiter);
    var objPattern = new RegExp(
        (
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
    );
    var arrData = [],
        arrMatches = null;
    while (arrMatches = objPattern.exec(strData)) {
        var strMatchedDelimiter = arrMatches[1];
        if (strMatchedDelimiter != undefined) {
            if (
                strMatchedDelimiter.length &&
                strMatchedDelimiter !== strDelimiter
            ) {
                arrData.push();
            }
        }
        var strMatchedValue;
        if (arrMatches[2]) {
            strMatchedValue = arrMatches[2].replace(
                new RegExp("\"\"", "g"),
                "\""
            );
        } else {
            strMatchedValue = arrMatches[3];
        }
        arrData.push(strMatchedValue);
    }
    return (arrData);
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
        try { return executeActionGet(r).hasKey(property) } catch (e) { return false }
    }
    this.descToObject = function (d) {
        var o = {}
        for (var i = 0; i < d.count; i++) {
            var k = d.getKey(i)
            o[t2s(k)] = getDescValue(d, k)
        }
        return o
    }
    this.hslAdjustment = function (hue, saturation, lightness, colorize) {
        (d = new ActionDescriptor()).putEnumerated(s2t("presetKind"), s2t("presetKindType"), s2t("presetKindCustom"));
        d.putBoolean(s2t("colorize"), colorize == 'true' ? true : false);
        (d1 = new ActionDescriptor()).putInteger(s2t("hue"), Number(hue));
        d1.putInteger(s2t("saturation"), Number(saturation));
        d1.putInteger(s2t("lightness"), Number(lightness));
        (l = new ActionList()).putObject(s2t("hueSatAdjustmentV2"), d1);
        d.putList(s2t("adjustment"), l);
        executeAction(s2t("hueSaturation"), d, DialogModes.NO);
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