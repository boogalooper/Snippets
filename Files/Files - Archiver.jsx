#target photoshop

const ver = 0.135,
    API_HOST = '127.0.0.1',
    API_PORT_SEND = 6310,
    API_PORT_LISTEN = 6311,
    API_FILE = 'face-count-api.pyw',
    INIT_DELAY = 15000,
    DETECTION_DELAY = 2000,
    PROGRESS_DELAY = 2500,
    PING_DELAY = 100;
var fd = new faceApi(API_HOST, API_PORT_SEND, API_PORT_LISTEN, new File((new File($.fileName)).path + '/' + API_FILE)),
    s2t = stringIDToTypeID,
    apl = new AM('application'),
    doc = new AM('document'),
    lr = new AM('layer'),
    str = new Locale();
isCancelled = false;
$.localize = true;
if (apl.getProperty('numberOfDocuments')) main();
function main() {
    var pth = doc.getProperty('fileReference'),
        title = decodeURI(pth.name).replace(/\.\w+$/, ''),
        newFile = null,
        s = '';
    if (doc.getProperty('numberOfLayers') > 0) {
        fd.init();
        var docRes = doc.getProperty('resolution'),
            initRes = (doc.getProperty('width') * docRes / 72) * (doc.getProperty('height') * docRes / 72) / 1000000;

        s += 'Init res ' + initRes + '\t'
        if (doc.getProperty('numberOfLayers') == 1) {
            if (lr.hasProperty('smartObject')) lr.rasterize();
            if (lr.getProperty('hasUserMask')) lr.applyMask();
            doc.makeSelectionFromLayer('transparencyEnum');
            if (doc.hasProperty('selection')) doc.crop(true);
            var res = (doc.getProperty('width') * docRes / 72) * (doc.getProperty('height') * docRes / 72) / 1000000;
            if (res != initRes) s += 'Crop to ' + res + '\t'
            if (res > 10) doc.setScale(Math.sqrt(10 / res));
        }
        var cropped = (doc.getProperty('width') * docRes / 72) * (doc.getProperty('height') * docRes / 72) / 1000000;

        if (cropped > 6.3) {
            f = new File(Folder.temp + '/FC.jpg');
            doc.saveACopyJPG(f)
            var result = fd.sendPayload('face_count', f.fsName.replace(/\\/g, '\\\\'));
            s += 'Faces ' + result + '\t'
            if (result) {
                if (result <= 4 && res > 6.3) {
                    doc.setScale(Math.sqrt(6.3 / cropped))
                }
            }
        }
        var res = (doc.getProperty('width') * docRes / 72) * (doc.getProperty('height') * docRes / 72) / 1000000;
        if (res != cropped) s += 'Rescale to ' + res

        newFile = new File(pth.parent + '/' + title + '.tif')
        doc.saveACopyTIFF(newFile, 1)
    } else {
        newFile = new File(pth.parent + '/' + title + '.jpg')
        doc.saveACopyJPG(newFile)
        s += 'Only background layer! Saved to JPG'
    }
    $.writeln(s)
    doc.close(false)
    newFile.rename(newFile.name + 'zzz')
    pth.rename(pth.name + 'xxx')
}
function AM(target, order) {
    var s2t = stringIDToTypeID,
        t2s = typeIDToStringID,
        AR = ActionReference,
        AD = ActionDescriptor;
    target = target ? s2t(target) : null;
    this.getProperty = function (property, id, idxMode, descMode) {
        property = s2t(property);
        (r = new AR).putProperty(s2t('property'), property);
        id != undefined ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id)) :
            r.putEnumerated(target, s2t('ordinal'), order ? s2t(order) : s2t('targetEnum'));
        try { return descMode ? executeActionGet(r) : getDescValue(executeActionGet(r), property) } catch (e) { return false };
    }
    this.hasProperty = function (property, id, idxMode) {
        property = s2t(property);
        (r = new AR).putProperty(s2t('property'), property);
        id ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id))
            : r.putEnumerated(target, s2t('ordinal'), s2t('targetEnum'));
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
    this.saveACopyJPG = function (pth) {
        (d1 = new AD).putInteger(s2t('extendedQuality'), 12);
        d1.putEnumerated(s2t('matteColor'), s2t('matteColor'), s2t('none'));
        (d = new AD).putObject(s2t('as'), s2t('JPEG'), d1);
        d.putPath(s2t('in'), pth);
        d.putBoolean(s2t('copy'), true);
        executeAction(s2t('save'), d, DialogModes.NO);
    }
    this.saveACopyTIFF = function (pth, extendedQuality) {
        var descriptor = new ActionDescriptor();
        var descriptor2 = new ActionDescriptor();
        descriptor2.putEnumerated(s2t("byteOrder"), s2t("platform"), s2t("IBMPC"));
        descriptor2.putEnumerated(s2t("encoding"), s2t("encoding"), s2t("JPEG"));
        descriptor2.putInteger(s2t("extendedQuality"), extendedQuality);
        descriptor2.putEnumerated(s2t("layerCompression"), s2t("encoding"), s2t("zip"));
        descriptor.putObject(s2t("as"), s2t("TIFF"), descriptor2);
        descriptor.putPath(s2t("in"), pth);
        executeAction(s2t("save"), descriptor, DialogModes.NO);

    }
    this.applyMask = function () {
        (r = new AR).putEnumerated(s2t("channel"), s2t("channel"), s2t("mask"));
        (d = new AD).putReference(s2t("null"), r);
        d.putBoolean(s2t("apply"), true);
        executeAction(s2t("delete"), d, DialogModes.NO);
    }
    this.convertToRGB = function () {
        (d = new AD).putClass(s2t('to'), s2t('RGBColorMode'))
        executeAction(s2t('convertMode'), d, DialogModes.NO);
    }
    this.close = function (save) {
        save = save != true ? s2t("no") : s2t("yes");
        (d = new AD).putEnumerated(s2t("saving"), s2t("yesNo"), save);
        executeAction(s2t("close"), d, DialogModes.NO);
    }
    this.setScale = function (width) {
        (d = new AD).putUnitDouble(s2t("width"), s2t("percentUnit"), width * 100);
        d.putBoolean(s2t("scaleStyles"), true);
        d.putBoolean(s2t("constrainProportions"), true);
        d.putEnumerated(s2t("interpolation"), s2t("interpolationType"), s2t("bilinear"));
        executeAction(s2t("imageSize"), d, DialogModes.NO);
    }
    this.crop = function (deletePixels) {
        (d = new AD).putBoolean(s2t('delete'), deletePixels);
        executeAction(s2t('crop'), d, DialogModes.NO);
    }
    this.makeSelectionFromLayer = function (targetEnum, id) {
        try {
            (r = new AR).putProperty(s2t('channel'), s2t('selection'));
            (d = new AD).putReference(s2t('null'), r);
            (r1 = new AR).putEnumerated(s2t('channel'), s2t('channel'), s2t(targetEnum));
            if (id) r1.putIdentifier(s2t('layer'), id);
            d.putReference(s2t('to'), r1);
            executeAction(s2t('set'), d, DialogModes.NO);
        } catch (e) { }
    }
    this.rasterize = function () {
        try {
            (r = new AR).putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
            (d = new AD).putReference(s2t('target'), r);
            executeAction(s2t('rasterizePlaced'), d, DialogModes.NO);
        } catch (e) { }
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
function faceApi(apiHost, portSend, portListen, apiFile) {
    this.init = function () {
        var result = sendMessage({ type: 'handshake', message: '' }, PING_DELAY, true, true)
        if (!result) {
            if (!apiFile.exists) { apiFile = new File(apiFile.fsName.substring(0, apiFile.fsName.length - 1)); }
            if (!apiFile.exists) throw new Error(str.errModule)
            apiFile.execute();
            var result = sendMessage({}, INIT_DELAY, false, true, str.starting);
            if (!result) throw new Error(str.errConnection)
            if (result.type == 'error') throw new Error(result.message)
        }
        return true
    }
    this.sendPayload = function (type, payload) {
        var result = sendMessage({ type: type, message: payload }, DETECTION_DELAY, true, true)
        if (result) {
            if (result.type == 'answer') return result['message']
            if (result.type == 'error') throw new Error(result.message)
        }
        return null;
    }
    function sendMessage(o, delay, sendData, getData, title) {
        delay = delay ? delay : INIT_DELAY;
        var listener = null;
        var t1 = 0, t2 = 0, t3 = 0;
        if (getData) {
            listener = new Socket();
            if (!listener.listen(portListen, 'UTF-8')) {
                return null;
            }
            if (title) {
                var w = new Window('palette', title),
                    bar = w.add('progressbar', undefined, 0, PROGRESS_DELAY);
                bar.preferredSize = [350, 20];
                bar.value = 0;
                w.show();
            }
            t1 = (new Date).getTime();
            t3 = t1;
        }
        if (sendData) {
            var sender = new Socket();
            if (sender.open(apiHost + ':' + portSend, 'UTF-8')) {
                sender.writeln(objectToJSON(o));
                sender.close();
            } else {
                if (listener) listener.close();
                return null;
            }
        }
        if (!getData) return true;
        for (; ;) {
            t2 = (new Date).getTime();
            if (t2 - t1 > delay) {
                if (listener) listener.close();
                if (title) w.close();
                return null;
            }
            if (title && t2 - t3 > 100) {
                t3 = t2
                if (bar.value >= PROGRESS_DELAY) bar.value = 0;
                bar.value = bar.value + 100;
                w.update();
            }
            var answer = listener.poll();
            if (answer != null) {
                try { var a = eval('(' + answer.readln() + ')'); } catch (e) { a = null; }
                if (title) { w.close() }
                answer.close();
                if (listener) listener.close();
                return a;
            }
            $.sleep(1);
        }
    }
    function objectToJSON(obj) {
        if (obj === null) {
            return 'null';
        }
        if (typeof obj !== 'object') {
            return '"' + obj + '"';
        }
        if (obj instanceof Array) {
            var arr = [];
            for (var i = 0; i < obj.length; i++) {
                arr.push(objectToJSON(obj[i]));
            }
            return '[' + arr.join(',') + ']';
        }
        var keys = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                keys.push(key);
            }
        }
        var result = [];
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var value = objectToJSON(obj[key]);
            result.push('"' + key + '":' + value);
        }
        return '{' + result.join(',') + '}';
    }
}
function Locale() {
    this.errModule = { ru: 'Модуль ' + API_FILE + ' не найден! Убедитесь, что он находится в той же папке что и скрипт!', en: 'Module ' + API_FILE + ' not found! Make sure it in the same folder as the script!' }
    this.errConnection = { ru: 'Невозможно установить соединение c ' + API_FILE, en: 'Impossible to establish a connection with ' + API_FILE }
    this.starting = { ru: 'Запуск модуля python...', en: 'Starting python module...' }
}