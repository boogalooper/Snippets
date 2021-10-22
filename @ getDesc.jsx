#target photoshop
s2t = stringIDToTypeID;


(r = new ActionReference())//.putProperty(s2t('property'), p = s2t('json'));
r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
(d = new ActionDescriptor()).putObject(s2t('object'), s2t('object'), executeActionGet(r));
eval('textKey = ' + executeAction(s2t('convertJSONdescriptor'), d).getString(s2t('json')));
$.writeln(executeAction(s2t('convertJSONdescriptor'), d).getString(s2t('json')))

/*
(r = new ActionReference());//.putProperty(s2t('property'), p = s2t('textKey'))
r.putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
checkDesc(executeActionGet(r))
*/

/*
s2t = stringIDToTypeID;

(r = new ActionReference()).putProperty(s2t('property'), p = s2t('hasBackgroundLayer'));
r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'))
var indexFrom = executeActionGet(r).getBoolean(p) ? 0 : 1;

(r = new ActionReference()).putProperty(s2t('property'), p = s2t('numberOfLayers'));
r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
var len = executeActionGet(r).getInteger(p),
    vis = [s2t('hide'), s2t('show')],
    lrs = [];

for (var i = indexFrom; i <= len; i++) {
    (r = new ActionReference()).putProperty(s2t('property'), n = s2t('name'))
    r.putIndex(s2t('layer'), i);
    (r1 = new ActionReference()).putProperty(s2t('property'), v = s2t('visible'))
    r1.putIndex(s2t('layer'), i);
    lrs.push({ name: executeActionGet(r).getString(n), visible: Number(executeActionGet(r1).getBoolean(v)) });
}

(r = new ActionReference()).putOffset(s2t('document'), -1);
(d = new ActionDescriptor()).putReference(s2t('target'), r);
executeAction(s2t('select'), d, DialogModes.NO);

do {
    var cur = lrs.shift();
    (r = new ActionReference()).putName(s2t('layer'), cur.name);
    (d = new ActionDescriptor()).putReference(s2t('target'), r);
    try { executeAction(vis[cur.visible], d, DialogModes.NO) } catch (e) { };
} while (lrs.length)

*/

/** 
var s2t = stringIDToTypeID;

(r = new ActionReference).putProperty(s2t('property'), p = s2t('targetLayersIDs'));
r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
var lrs = executeActionGet(r).getList(p),
    sel = new ActionReference();

for (var i = 0; i < lrs.count; i++) {
    sel.putIdentifier(s2t('layer'), s = lrs.getReference(i).getIdentifier(s2t('layerID')));

    (r = new ActionReference).putProperty(s2t('property'), p = s2t('layerKind'));
    r.putIdentifier(s2t('layer'), s);
    if (executeActionGet(r).getInteger(p) == 1) {
        (r = new ActionReference).putIdentifier(s2t('layer'), s);
        (d = new ActionDescriptor()).putReference(s2t("target"), r);
        executeAction(s2t('select'), d, DialogModes.NO);
        executeAction(s2t('delete'), undefined, DialogModes.NO);
    }
}

(d = new ActionDescriptor()).putReference(s2t("target"), sel);
executeAction(s2t('select'), d, DialogModes.NO);*/





function checkDesc(d) {
    var c = d.count,
        str = '';
    for (var i = 0; i < c; i++) {
        str += t2s(d.getKey(i)) +
            ': ' + d.getType(d.getKey(i)) +
            ' = ' + getValues(d, i) + '\n';
    };
    $.writeln(str);
};


function getValues(d, keyNum) {
    var p = d.getKey(keyNum);
    switch (d.getType(p)) {
        case DescValueType.OBJECTTYPE:
            return (d.getObjectValue(p) +
                '_' + t2s(d.getObjectType(p)));
            break;
        case DescValueType.LISTTYPE:
            return d.getList(p);
            break;
        case DescValueType.REFERENCETYPE:
            return d.getReference(p);
            break;
        case DescValueType.BOOLEANTYPE:
            return d.getBoolean(p);
            break;
        case DescValueType.STRINGTYPE:
            return d.getString(p);
            break;
        case DescValueType.INTEGERTYPE:
            return d.getInteger(p);
            break;
        case DescValueType.LARGEINTEGERTYPE:
            return d.getLargeInteger(p);
            break;
        case DescValueType.DOUBLETYPE:
            return d.getDouble(p);
            break;
        case DescValueType.ALIASTYPE:
            return d.getPath(p);
            break;
        case DescValueType.CLASSTYPE:
            return d.getClass(p);
            break;
        case DescValueType.UNITDOUBLE:
            return (d.getUnitDoubleValue(p) +
                '_' + t2s(d.getUnitDoubleType(p)));
            break;
        case DescValueType.ENUMERATEDTYPE:
            return (t2s(d.getEnumerationValue(p)) +
                '_' + t2s(d.getEnumerationType(p)));
            break;
        case DescValueType.RAWTYPE:
            var tempStr = d.getData(p);
            var rawData = new Array();
            for (var tempi = 0; tempi < tempStr.length; tempi++) {
                rawData[tempi] = tempStr.charCodeAt(tempi);
            }
            return rawData;
            break;
        default:
            break;
    };
};

function s2t(s) { return stringIDToTypeID(s) }
function t2s(t) { if (!typeIDToStringID(t)) { return typeIDToCharID(t) } else { return typeIDToStringID(t) } }