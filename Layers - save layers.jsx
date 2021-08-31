#target photoshop

s2t = stringIDToTypeID;

(r = new ActionReference()).putProperty(s2t('property'), p = s2t('hasBackgroundLayer'));
r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'))
var offset = executeActionGet(r).getBoolean(p) ? 0 : 1;

(r = new ActionReference()).putProperty(s2t('property'), p = s2t('targetLayers'));
r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
var lrs = executeActionGet(r).getList(p);

(r = new ActionReference()).putProperty(s2t('property'), p = s2t('fileReference'));
r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
var pth = executeActionGet(r).getPath(p).parent;

for (var i = lrs.count - 1; i >= 0; i--) {
    (r = new ActionReference()).putIndex(s2t('layer'), lrs.getReference(i).getIndex(s2t('itemIndex')) + offset);
    (d = new ActionDescriptor()).putReference(s2t(('null')), r);
    executeAction(s2t('show'), d, DialogModes.NO);

    (r = new ActionReference()).putProperty(s2t('property'), p = s2t('name'));
    r.putIndex(s2t('layer'), lrs.getReference(i).getIndex(s2t('itemIndex')) + offset);
    var nm = executeActionGet(r).getString(p);

    var pngOpts = new ExportOptionsSaveForWeb;
    pngOpts.format = SaveDocumentType.PNG
    pngOpts.PNG8 = false;
    pngOpts.transparency = true;
    pngOpts.interlaced = false;
    pngOpts.quality = 100;
    activeDocument.exportDocument(new File(pth + '/' + nm + '.png'), ExportType.SAVEFORWEB, pngOpts);
}

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