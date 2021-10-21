#target photoshop

var s2t = stringIDToTypeID,
    t2s = typeIDToStringID;

$.writeln(getProfiles())
$.writeln(proofState() )

function getProfiles() {
    var profiles = Folder($.getenv('windir') + '/system32/spool/drivers/color').getFiles('*fotoprosto*'),
        output = [];
    for (var i = 0; i < profiles.length; i++)  output.push(decodeURI(profiles[i].name))
    return output;
}

function proofState() {
    var r = new ActionReference();
    r.putProperty(s2t('property'), s2t('menuBarInfo'));
    r.putEnumerated(s2t('application'), s2t('ordinal'), s2t('targetEnum'));
    var mainMenu = executeActionGet(r).getObjectValue(s2t('menuBarInfo')).getList(s2t('submenu'))

    for (var i = 0; i < mainMenu.count; i++) {
        if (mainMenu.getObjectValue(i).getString(s2t('title')) == localize('$$$/Menu/View')) {
            var viewMenu = mainMenu.getObjectValue(i).getList(s2t('submenu'))
            break;
        }
    }
        for (var i = 0; i < mainMenu.count; i++) {
            if (viewMenu.getObjectValue(i).getString(s2t('title')) == localize('$$$/Menu/View/ProofColors')){
              return viewMenu.getObjectValue(i).getBoolean(s2t('checked')) 
            }
        }
        
    return null
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
