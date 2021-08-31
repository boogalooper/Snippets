#target photoshop

var t2s = typeIDToStringID,
    s2t = stringIDToTypeID,
    ToolUUID = 'ce3d1399-e259-4062-9784-dff51527322b',
    presetMask = '#Auto preset',
    evt = new Events,
    AM = new ActionManager,
    event = null,
    target = null;

evt.addEvt()

$.hiresTimer

try { target = arguments[0], event = t2s(arguments[1]) } catch (e) { }

try {
    switch (event) {
        case 'toolModalStateChanged':
            var c = target.getObjectValue(s2t('tool')).getString(s2t('ID'))
            if (c == 'pntb') {
                var pOptions = null,
                    pTool = null,
                    cOptions = AM.getApplicationProperty('tool', true).getObjectValue(s2t('currentToolOptions')),
                    cTool = AM.getApplicationProperty('tool')[0];

                try { pOptions = app.getCustomOptions(ToolUUID) } catch (e) { }
                if (pOptions) pTool = t2s(pOptions.getKey(0))

                if (pTool == 'paintbrushTool') {
                    if (pOptions.getObjectValue(s2t(pTool)).toStream() != cOptions.toStream()) {
                        AM.setToolOptions(pTool, pOptions.getObjectValue(s2t(pTool)))
                        // AM.createNamedPreset(createPresetName(presetMask))
                        //   AM.setToolOptions(cTool, cOptions)
                        alert(AM.getBrushPresets(presetMask))
                    }
                }


                // получить список пресетов AP, загрузить каждый и проверить не содержит ли он такие же настройки
                // если да, то выбрать его, ничего не делая
                // если нет, то перестроить список пресетов
                /// новый дескриптор
                (d = new ActionDescriptor).putObject(s2t(cTool), s2t('currentToolOptions'), cOptions)
                app.putCustomOptions(ToolUUID, d, false)
            }
            break;
        case 'select':
            alert(target.getReference(s2t('null')).getName())
            break;
    }

    function createPresetName(mask) {
        var d = new Date()
        return mask + ' ' + d.getFullYear() + '-' + ('00' + d.getMonth()).slice(-2) + '-' + ('00' + d.getDay()).slice(-2) + ' ' + ('00' + d.getHours()).slice(-2) + ':' + ('00' + d.getMinutes()).slice(-2) + ':' + ('00' + d.getSeconds()).slice(-2)
    }

} catch (e) { alert(e + '\n' + $.hiresTimer / 1000000 + 's') }

function ActionManager() {
    var gProperty = s2t('property'),
        gAction = s2t('action'),
        gActionSet = s2t('actionSet'),
        gOrdinal = s2t('ordinal'),
        gTargetEnum = s2t('targetEnum'),
        gDocument = s2t('document'),
        gLayer = s2t('layer'),
        gNumberOfChildren = s2t('numberOfChildren'),
        gApplication = s2t('application'),
        gName = s2t('name'),
        gParent = s2t('parentName'),
        gParentIndex = s2t('parentIndex'),
        gItemIndex = s2t('itemIndex'),
        gPlay = s2t('play'),
        gTarget = s2t('target'),
        gSelect = s2t('select'),
        gTo = s2t('to'),
        gSet = s2t('set'),
        gChannel = s2t('channel'),
        gToolPreset = s2t('toolPreset'),
        gNull = s2t('null'),
        gCurrentToolOptions = s2t("currentToolOptions"),
        gUsing = s2t("using"),
        gName = s2t("name"),
        gMake = s2t("make"),
        gPresetManager = s2t('presetManager'),
        gName = s2t('name'),
        gClass = s2t('class');

    this.getApplicationProperty = function (p, getDesc) {
        (r = new ActionReference()).putProperty(gProperty, p = s2t(p));
        r.putEnumerated(gApplication, gOrdinal, gTargetEnum)
        return getDesc ? executeActionGet(r) : getDescValue(executeActionGet(r), p)
    }

    this.setToolOptions = function (tool, options) {
        (r = new ActionReference()).putClass(s2t(tool));
        (d = new ActionDescriptor()).putReference(gTarget, r);
        d.putObject(gTo, gTarget, options)
        try { executeAction(gSet, d, DialogModes.NO) } catch (e) { }
    }

    this.createNamedPreset = function (label) {
        (r1 = new ActionReference()).putClass(gToolPreset);
        (d = new ActionDescriptor()).putReference(gNull, r1);
        (r = new ActionReference()).putProperty(gProperty, gCurrentToolOptions);
        r.putEnumerated(gApplication, gOrdinal, gTargetEnum)
        d.putReference(gUsing, r)
        d.putString(gName, label)
        try { executeAction(gMake, d, DialogModes.NO) } catch (e) { }
    }

    this.getBrushPresets = function (mask) {
        (r = new ActionReference()).putProperty(gProperty, gPresetManager);
        r.putEnumerated(gApplication, gOrdinal, gTargetEnum)
        d = executeActionGet(r).getList(gPresetManager).getObjectValue(0).getList(gName);

        var len = d.count,
            s = [];

        for (var i = 0; i < len; i++) {
            var b = d.getString(i)
            if (mask) { if (b.indexOf(mask, 0) == -1 || b.length != mask.length + 20) continue; }
            s.push(b)
        }
        return s
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
        }
    }
}

function Events() {

    this.addEvt = function () {
        this.delEvt()

        app.notifiersEnabled = true
        var handlerFile = File($.fileName)

        app.notifiers.add('toolModalStateChanged', handlerFile)
        //app.notifiers.add('select', handlerFile, 'toolPreset')
    }

    this.delEvt = function () {
        var handlerFile = File($.fileName).name;
        for (var i = 0; i < app.notifiers.length; i++) {
            if (app.notifiers[i].eventFile.name == handlerFile) { app.notifiers[i].remove(); i-- }
        }
    }
}

function checkDesc(desc) {
    var c = desc.count,
        str = '';
    for (var i = 0; i < c; i++) {
        str += t2s(desc.getKey(i)) +
            ': ' + desc.getType(desc.getKey(i)) +
            ' = ' + getValues(desc, i) + '\n';
    };
    return (str);
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
            var s = desc.getReference(kTypeID)
            return t2s(s.getDesiredClass());
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