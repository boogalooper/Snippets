/**  Export results from photoshop count
 * https://community.adobe.com/t5/photoshop/export-results-from-photoshop-count/m-p/11992381
*/
#target photoshop
s2t = stringIDToTypeID;

(r = new ActionReference()).putProperty(s2t('property'), k = s2t('countClass'));
r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
var p = executeActionGet(r);
if (p.hasKey(k)) {
    var counter = p.getList(k),
        n = (new File).saveDlg('Save file', '*.csv');
    if (n) {
        if (n.open('w', 'TEXT')) {
            n.write('x;y\n')
            for (var i = 0; i < counter.count; i++) {
                var c = counter.getObjectValue(i)
                n.write(c.getDouble(s2t('x')) + ';' + c.getDouble(s2t('y')) + '\n')
            }
            n.close()
        }
    }
}


function AMReference(desiredClass) {
    var s2t = stringIDToTypeID,
        t2s = typeIDToStringID;

    ActionDescriptor.prototype.getValue = function (property) {
        if (!property) return this;
        var p = typeof property == 'string' ? s2t(property) : property;

        if (this.hasKey(p)) {
            switch (this.getType(p)) {
                case DescValueType.OBJECTTYPE: return this.getObjectValue(p);
                case DescValueType.LISTTYPE: return this.getList(p);
                case DescValueType.REFERENCETYPE: return this.getReference(p);
                case DescValueType.BOOLEANTYPE: return this.getBoolean(p);
                case DescValueType.STRINGTYPE: return this.getString(p);
                case DescValueType.INTEGERTYPE: return this.getInteger(p);
                case DescValueType.LARGEINTEGERTYPE: return this.getLargeInteger(p);
                case DescValueType.DOUBLETYPE: return this.getDouble(p);
                case DescValueType.ALIASTYPE: return this.getPath(p);
                case DescValueType.CLASSTYPE: return this.getClass(p);
                case DescValueType.UNITDOUBLE: return ({ value: this.getUnitDoubleValue(p), type: t2s(this.getUnitDoubleType(p)) });
                case DescValueType.ENUMERATEDTYPE: return ({ value: t2s(this.getEnumerationValue(p)), type: t2s(this.getEnumerationType(p)) });
                case DescValueType.RAWTYPE: var s = this.getData(p); var rawData = []; for (var i = 0; i < s.length; i++) { rawData[i] = s.charCodeAt(i); } return rawData;
            }
        }
        return null
    }

    this.classID = s2t(desiredClass);

    this.getProperty = function (property) {
        return new Reference(this.classID, property)
    }

    function Reference(c, p) {
        var r = new ActionReference();
        if (p) r.putProperty(s2t('property'), p = s2t(p))

        this.byEnum = function () {
            r.putEnumerated(c, s2t('ordinal'), s2t('targetEnum'))
            return executeActionGet(r).getValue(p)
        }

        this.byIndex = function (i) {
            r.putIndex(c, i)
            return executeActionGet(r).getValue(p)
        }

        this.byClass = function (c) {
            r.putClass(s2t(c))
            return executeActionGet(r).getValue(p)
        }
    }
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