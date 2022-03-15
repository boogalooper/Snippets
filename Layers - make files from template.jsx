/**Заполнение макета на основе табличных данных
 * таблица с данными в формате CSV (тип разделителя указывается в коде)
 * скрипт поддерживает 2 типа данных для вставки - текст и цвет
 * для того чтобы скрипт сделал подстановку данных слой должен быть назван также как и заголовок столбца таблицы
 * цвет может кодироваться в двух форматах:
 * - три столбца Red Green Blue (в этом случае слой должен быть назван RGB)
 * - один столбец с Hex (в этом случае слой должен быть назван HEX)
 * перед запуском скрипта файл должен быть сохранен
 * https://community.adobe.com/t5/phostoshop-ecosystem/fill-shape-colour-by-adding-dmc-number/m-p/12317703#M573923
 * https://youtu.be/Dv95Y646KaE
 */
#target photoshop
app.doProgress('', 'main()')
function main() {
    try {
        var doc = new AM('document'),
            lr = new AM('layer'),
            strDelimiter = ';'; // change csv div here if needed
        if (doc.hasProperty('numberOfLayers')) {
            var len = doc.getProperty('numberOfLayers'),
                names = [];
            for (var i = 1; i <= len; i++) {
                if (lr.getProperty('layerSection', i, true).value == 'layerSectionEnd') continue;
                var layerKind = lr.getProperty('layerKind', i, true)
                // process only pixel and text layers
                if (layerKind == 1 || layerKind == 3) {
                    names.push({ name: lr.getProperty('name', i, true).toLowerCase(), id: lr.getProperty('layerID', i, true), layerKind: layerKind })
                }
            }
        } else throw (new Error('No open template!'))
        if (names.length) {
            var source = doc.hasProperty('fileReference') ? doc.getProperty('fileReference') : null,
                ext = source ? decodeURI(source.name).match(/\..*$/)[0] : null,
                pth = Folder(source.path);
        } else throw (new Error('No matching layer names found!'))
        if (pth) {
            var csv = pth.getFiles(/\.(csv)$/i);
        } else throw (new Error('Cannot find csv because template file do not saved yet!'))
        if (csv.length) {
            do {
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
                } else throw (new Error('CSV file is empty!'))
                var headers = csvContent.shift(),
                    numberOfLines = csvContent.length;
                csvObject = {};
                do {
                    var cur = headers.shift().toLowerCase();
                    csvObject[cur] = [];
                    for (var i = 0; i < csvContent.length; i++) {
                        csvObject[cur].push(csvContent[i].shift())
                    }
                } while (headers.length)
                for (var x = 1; x <= numberOfLines; x++) {
                    app.updateProgress(x, numberOfLines)
                    app.changeProgressText(x + ' of ' + numberOfLines)
                    var newFilename = fileName + ' ' + (('0000' + x).slice(-4));
                    for (var i = 0; i < names.length; i++) {
                        var cur = names[i];
                        if (cur.layerKind == 1 && (cur.name.match(/RGB/i) || cur.name.match(/HEX/i))) {
                            if (cur.name.match(/RGB/i)) {
                                if (csvObject['red'].length && csvObject['green'].length && csvObject['blue'].length) {
                                    var c = new SolidColor;
                                    newFilename += ' R' + csvObject['red'][0] + ' G' + csvObject['green'][0] + ' B' + csvObject['blue'][0];
                                    with (c.rgb) {
                                        red = csvObject['red'].shift();
                                        green = csvObject['green'].shift();
                                        blue = csvObject['blue'].shift();
                                    }
                                }
                            } else if (cur.name.match(/HEX/i) && csvObject['hex']) {
                                if (csvObject['hex'].length) {
                                    var c = new SolidColor;
                                    newFilename += ' HEX' + csvObject['hex'][0];
                                    c.rgb.hexValue = csvObject['hex'].shift()
                                }
                            }
                            if (c) lr.changeFillEffect(c.rgb.red, c.rgb.green, c.rgb.blue, cur.id)
                            continue;
                        }
                        if (cur.layerKind == 3) {
                            if (csvObject[cur.name]) {
                                if (csvObject[cur.name].length) {
                                    newFilename += ' ' + csvObject[cur.name][0]
                                    lr.changeTextKey(csvObject[cur.name].shift(), cur.id)
                                }
                                continue;
                            }
                        }
                    }
                    activeDocument.saveAs(File(pth + '/' + newFilename.replace(/\.[^\.]+$/, '')))
                }
            } while (csv.length)
            activeDocument.close()
            app.open(source)
        } else throw (new Error('Cannot find csv file in parent folder of template!'))
    } catch (e) { alert(e); return; }
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
    this.changeFillEffect = function (red, green, blue, id) {
        (r = new ActionReference()).putProperty(s2t("property"), p = s2t("layerEffects"));
        r.putIdentifier(s2t("layer"), id);
        var fx = executeActionGet(r).hasKey(p) ? executeActionGet(r).getObjectValue(p) : new ActionDescriptor(),
            currentFill = fx.hasKey(p = s2t("solidFill")) ? fx.getObjectValue(p) : new ActionDescriptor();
        if (fx.hasKey(p = s2t("solidFillMulti"))) fx.erase(p);
        (d = new ActionDescriptor()).putDouble(s2t("red"), red);
        d.putDouble(s2t("green"), green);
        d.putDouble(s2t("blue"), blue);
        currentFill.putObject(s2t("color"), s2t("RGBColor"), d);
        fx.putObject(s2t("solidFill"), s2t("solidFill"), currentFill);
        (d = new ActionDescriptor()).putReference(s2t("null"), r);
        d.putObject(s2t("to"), s2t("layerEffects"), fx);
        executeAction(s2t("set"), d, DialogModes.NO);
    }
    this.changeTextKey = function (text, id) {
        (r = new ActionReference()).putProperty(s2t('property'), p = s2t('textKey'));
        r.putIdentifier(s2t('layer'), id);
        if (executeActionGet(r).hasKey(p)) {
            var textKey = executeActionGet(r).getObjectValue(p);
            textKey.putString(s2t('textKey'), text);
            (r = new ActionReference()).putIdentifier(s2t('layer'), id);
            (d = new ActionDescriptor()).putReference(s2t('null'), r);
            d.putObject(s2t('to'), s2t('textLayer'), textKey);
            executeAction(s2t('set'), d, DialogModes.NO);
        }
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