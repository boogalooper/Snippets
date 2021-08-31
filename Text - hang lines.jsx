#target photoshop

s2t = stringIDToTypeID;
(r = new ActionReference()).putProperty(s2t('property'), p = s2t('textKey'));
r.putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
var p = executeActionGet(r).getObjectValue(p).getList(s2t('paragraphStyleRange'))

var newParagraphList = new ActionList
for (var i = 0; i < p.count; i++) {
    var paragraph = p.getObjectValue(i),
        pStyle = paragraph.getObjectValue(s2t('paragraphStyle'));
    pStyle.putBoolean(s2t('hyphenate'), false)
    paragraph.putObject(s2t('paragraphStyle'), s2t('paragraphStyle'), pStyle)
    newParagraphList.putObject(s2t('paragraphStyleRange'), paragraph)
}

(t = new ActionDescriptor).putList(s2t('paragraphStyleRange'), newParagraphList);
(r = new ActionReference).putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
(d = new ActionDescriptor).putReference(s2t('target'), r);
d.putObject(s2t('to'), s2t('textKey'), t);
executeAction(s2t('set'), d, DialogModes.NO);



function checkDesc(desc) {
    var c = desc.count,
        str = '';
    for (var i = 0; i < c; i++) {
        str += t2s(desc.getKey(i)) +
            ': ' + desc.getType(desc.getKey(i)) +
            ' = ' + getValues(desc, i) + '\n';
    };
    $.writeln(str);
};


function getValues(desc, keyNum) {
    var kTypeID = desc.getKey(keyNum);
    switch (desc.getType(kTypeID)) {
        case DescValueType.OBJECTTYPE:
            return (desc.getObjectValue(kTypeID) +
                "_" + t2s(desc.getObjectType(kTypeID)));
            break;
        case DescValueType.LISTTYPE:
            return desc.getList(kTypeID);
            break;
        case DescValueType.REFERENCETYPE:
            return desc.getReference(kTypeID);
            break;
        case DescValueType.BOOLEANTYPE:
            return desc.getBoolean(kTypeID);
            break;
        case DescValueType.STRINGTYPE:
            return desc.getString(kTypeID);
            break;
        case DescValueType.INTEGERTYPE:
            return desc.getInteger(kTypeID);
            break;
        case DescValueType.LARGEINTEGERTYPE:
            return desc.getLargeInteger(kTypeID);
            break;
        case DescValueType.DOUBLETYPE:
            return desc.getDouble(kTypeID);
            break;
        case DescValueType.ALIASTYPE:
            return desc.getPath(kTypeID);
            break;
        case DescValueType.CLASSTYPE:
            return desc.getClass(kTypeID);
            break;
        case DescValueType.UNITDOUBLE:
            return (desc.getUnitDoubleValue(kTypeID) +
                "_" + t2s(desc.getUnitDoubleType(kTypeID)));
            break;
        case DescValueType.ENUMERATEDTYPE:
            return (t2s(desc.getEnumerationValue(kTypeID)) +
                "_" + t2s(desc.getEnumerationType(kTypeID)));
            break;
        case DescValueType.RAWTYPE:
            var tempStr = desc.getData(kTypeID);
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
function t2s(t) { return typeIDToStringID(t) }