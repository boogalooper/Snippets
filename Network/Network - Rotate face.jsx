/**
 * Straighten photos and save photos in same directory. 
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/straighten-photos-and-save-photos-in-same-directory/td-p/15438965
 */

#target photoshop

const API_HOST = '127.0.0.1',
    API_PORT_SEND = 6320,
    API_PORT_LISTEN = 6321,
    API_DELAY = 10000;
var OpenCV = new SDApi(API_HOST, API_PORT_SEND, API_PORT_LISTEN),
    apl = new AM('application'),
    doc = new AM('document');

try { init() } catch (e) {
    alert(e)
}

function init() {
    if (apl.getProperty('numberOfDocuments')) {
        if (OpenCV.initialize()) {
            var f = new File(Folder.temp + '/OpenCV.jpg');
            doc.saveACopy(f);
            var result = OpenCV.sendPayload(f.fsName.replace(/\\/g, '\\\\'));
            f.remove();
            if (result) doc.rotateDocument(result)
        }
    }
}

function SDApi(apiHost, portSend, portListen) {
    this.initialize = function () {
        var result = sendMessage({ type: 'handshake', message: {} }, true, API_DELAY)
        if (!result) throw new Error('cannot connect to python!')
        return true
    }
    this.exit = function () {
        sendMessage({ type: 'exit' })
    }
    this.sendPayload = function (payload) {
        var result = sendMessage({ type: 'payload', message: payload }, true, API_DELAY)
        if (result) return result['message']
        return null;
    }
    function sendMessage(o, getAnswer, delay) {
        var tcp = new Socket;
        tcp.open(apiHost + ':' + portSend, 'UTF-8')
        tcp.writeln(objectToJSON(o))
        tcp.close()
        if (getAnswer) {
            var t1 = (new Date).getTime(),
                t2 = 0;
            var tcp = new Socket;
            if (tcp.listen(portListen, 'UTF-8')) {
                for (; ;) {
                    t2 = (new Date).getTime()
                    if (t2 - t1 > delay) return null;
                    var answer = tcp.poll();
                    if (answer != null) {
                        var a = eval('(' + answer.readln() + ')');
                        answer.close();
                        return a;
                    }
                }
            }
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
function AM(target, order) {
    var s2t = stringIDToTypeID,
        t2s = typeIDToStringID,
        AR = ActionReference,
        AD = ActionDescriptor;
    target = target ? s2t(target) : null;
    this.getProperty = function (property, descMode, id, idxMode) {
        property = s2t(property);
        (r = new AR).putProperty(s2t('property'), property);
        id != undefined ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id)) :
            r.putEnumerated(target, s2t('ordinal'), order ? s2t(order) : s2t('targetEnum'));
        return descMode ? executeActionGet(r) : getDescValue(executeActionGet(r), property);
    }
    this.hasProperty = function (property, id, idxMode) {
        property = s2t(property);
        (r = new AR).putProperty(s2t('property'), property);
        id ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id))
            : r.putEnumerated(target, s2t('ordinal'), s2t('targetEnum'));
        try { return executeActionGet(r).hasKey(property) } catch (e) { return false }
    }
    this.saveACopy = function (pth) {
        (d1 = new AD).putInteger(s2t('extendedQuality'), 12);
        d1.putEnumerated(s2t('matteColor'), s2t('matteColor'), s2t('none'));
        (d = new AD).putObject(s2t('as'), s2t('JPEG'), d1);
        d.putPath(s2t('in'), pth);
        d.putBoolean(s2t('copy'), true);
        executeAction(s2t('save'), d, DialogModes.NO);
    }
    this.rotateDocument = function (angle) {
        (r = new ActionReference()).putEnumerated(s2t("document"), s2t("ordinal"), s2t("targetEnum"));
        (d = new ActionDescriptor()).putReference(s2t("null"), r);
        d.putUnitDouble(s2t("angle"), s2t("angleUnit"), angle);
        executeAction(s2t("rotateEventEnum"), d, DialogModes.NO);
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