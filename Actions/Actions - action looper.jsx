/*
When starting from the scripts menu, Action Looper launches the action selected on the actions panel sequentially for each selected layer.
Script supports recursive launch, i.e. The script can run the action in which it itself is recorded (for this it must be pre -written as an action command).
Please note: if the action was recorded in advance and you derive the script launch command, then an error message will appear
(This is due to the fact that Photoshop does not allow you to determine the state of the recording and the script is trying to run the action) 
- it does not affect the work and will not be shown when the action is reproduced.
https://www.youtube.com/watch?v=YPa-56jXpwA
*/

#target photoshop

/*
// BEGIN__HARVEST_EXCEPTION_ZSTRING
<javascriptresource>
<name>Action looper</name>
<category>actions</category>
<eventid>2a53ac7b-9137-4014-8800-d7072db3d946</eventid>
<terminology><![CDATA[<< /Version 1
                       /Events <<
                       /2a53ac7b-9137-4014-8800-d7072db3d946 [(Action looper) <<
                       >>]
                        >>
                     >> ]]></terminology>
</javascriptresource>
// END__HARVEST_EXCEPTION_ZSTRING
*/

var strMessage = "Action looper",
    GUID = "2a53ac7b-9137-4014-8800-d7072db3d946";

var AM = new ActionManager,
    cfg = new Config,
    isCancelled = false,
    event;

try { event = arguments[1] } catch (e) { }

main()

function main() {
    if (!event) {
        var sel = getSelectedLayersIds(),
            a = AM.getCurrentAction()

        if (!app.playbackParameters.count) {
            // normal run
            if (sel.length == 0 || a.atnIndex == 0 || a.atnName == 0) return;
            cfg.atn = a.atnIndex
            cfg.set = a.setIndex
            cfg.toDo = sel.join('\t')
            cfg.sel = sel.join('\t')
            cfg.docID = AM.getDocProperty("documentID")
            AM.putScriptSettings(cfg, true)

            if (AM.createDroplet(a.setName, a.atnName, File(Folder.temp + "/" + generateUUID() + ".tmp"))) {
                doLoop()
            } 
        }
        else {
            if (sel.length <= 1 || a.atnIndex == 0 || a.atnName == 0) return;
            cfg.sel = sel.join('\t')
            var cur = sel.shift()
            cfg.atn = a.atnIndex
            cfg.set = a.setIndex
            cfg.toDo = sel.join('\t')
            cfg.docID = AM.getDocProperty("documentID")

            AM.putScriptSettings(cfg)
            addEvt()
            AM.selectLayerById(cur)
        }
    } else {
        delEvt()
        AM.getScriptSettings(cfg)
        doLoop()
    }

    function doLoop() {
        var sel = cfg.toDo.split('\t')

        if (AM.getDocProperty("documentID") == cfg.docID) {
            do {
                var cur = Number(sel.shift())
                AM.deselectLayers()
                if (AM.selectLayerById(cur)) {
                    if (!AM.runAction(cfg.set, cfg.atn)) break;
                }
            } while (sel.length)
        }

        AM.deselectLayers()
        var sel = cfg.sel.split('\t')
        for (var i = 0; i < sel.length; i++) {
            AM.selectLayerById(Number(sel[i]), true)
        }

        app.eraseCustomOptions(GUID)
    }

    function addEvt() {
        delEvt()

        app.notifiersEnabled = true
        var handlerFile = File($.fileName)
        app.notifiers.add('Ply ', handlerFile)
    }

    function delEvt() {
        for (var i = 0; i < app.notifiers.length; i++) {
            var ntf = app.notifiers[i]
            if (ntf.eventFile.name == File($.fileName).name) { ntf.remove(); i-- }
        }
    }
    return false
}

isCancelled ? 'cancel' : undefined

function getSelectedLayersIds() {
    if (!AM.getApplicationProperty("numberOfDocuments")) return []

    var sel = AM.getDocProperty("targetLayers"),
        len = sel instanceof Object ? sel.count : 0,
        offcet = AM.getDocProperty("hasBackgroundLayer") ? 0 : 1,
        output = []

    for (var i = 0; i < len; i++) {
        output.push(AM.getLayerProperty("layerID", sel.getReference(i).getIndex() + offcet))
    }
    return output
}

function ActionManager() {
    var gProperty = s2t("property"),
        gAction = s2t("action"),
        gActionSet = s2t("actionSet"),
        gOrdinal = s2t("ordinal"),
        gTargetEnum = s2t("targetEnum"),
        gDocument = s2t("document"),
        gLayer = s2t("layer"),
        gNull = s2t("null"),
        gNumberOfChildren = s2t("numberOfChildren"),
        gApplication = s2t("application"),
        gSelectNoLayers = s2t("selectNoLayers"),
        gName = s2t("name"),
        gParent = s2t("parentName"),
        gParentIndex = s2t("parentIndex"),
        gItemIndex = s2t("itemIndex"),
        gPlay = s2t("play"),
        gSelectionModifier = s2t("selectionModifier"),
        gSelectionModifierType = s2t("addToSelectionContinuous"),
        gAddToSelectionContinuous = s2t("addToSelection"),
        gSelectNoLayers = s2t("selectNoLayers"),
        gTarget = s2t("target"),
        gUsing = s2t("using"),
        gIn = s2t("in"),
        gCreateDroplet = s2t("createDroplet"),
        gSelect = s2t("select");

    this.getApplicationProperty = function (property) {
        property = s2t(property)
        ref = new ActionReference()
        ref.putProperty(gProperty, property)
        ref.putEnumerated(gApplication, gOrdinal, gTargetEnum)
        return getDescValue(executeActionGet(ref), property)
    }

    this.getDocProperty = function (property, index) {
        property = s2t(property)
        try {
            ref = new ActionReference()
            ref.putProperty(gProperty, property)
            if (index) {
                ref.putIndex(gDocument, index)
            } else {
                ref.putEnumerated(gDocument, gOrdinal, gTargetEnum)
            }
            return getDescValue(executeActionGet(ref), property)
        } catch (e) { return null }
    }

    this.getLayerProperty = function (property, index) {
        property = s2t(property)
        var ref = new ActionReference()
        ref.putProperty(gProperty, property)
        ref.putIndex(gLayer, index)
        return getDescValue(executeActionGet(ref), property)
    }

    this.deselectLayers = function () {
        try {
            var desc = new ActionDescriptor();
            var ref = new ActionReference();
            ref.putEnumerated(gLayer, gOrdinal, gTargetEnum);
            desc.putReference(gNull, ref);
            executeAction(gSelectNoLayers, desc, DialogModes.NO);
        }
        catch (e) { }
    }

    this.layerVisibilityById = function (id, makeVisible) {
        makeVisible = makeVisible == 1 ? "show" : "hide"
        var desc = new ActionDescriptor()
        var ref = new ActionReference()
        ref.putIdentifier(gLayer, id)
        desc.putReference(gNull, ref)
        executeAction(s2t(makeVisible), desc, DialogModes.NO);
    }

    this.selectLayerById = function (id, add) {
        try {
            var desc = new ActionDescriptor()
            var ref = new ActionReference()
            ref.putIdentifier(gLayer, id)
            desc.putReference(gNull, ref)
            if (add) desc.putEnumerated(gSelectionModifier, gSelectionModifierType, gAddToSelectionContinuous)
            executeAction(gSelect, desc, DialogModes.NO)
            return true
        } catch (e) { return false }
    }

    this.runAction = function (setIndex, atnIndex) {
        var desc = new ActionDescriptor()
        var ref = new ActionReference()

        ref.putIndex(gAction, atnIndex);
        ref.putIndex(gActionSet, setIndex);
        desc.putReference(gTarget, ref);

        try {
            executeAction(gPlay, desc)
            return true
        }
        catch (e) {
            return false
        }
    }

    this.createDroplet = function (set, atn, path) {
        try {
            var desc = new ActionDescriptor()
            var ref = new ActionReference()

            desc.putPath(gIn, path)
            ref.putName(gAction, atn)
            ref.putName(gActionSet, set)
            desc.putReference(gUsing, ref)
            executeAction(gCreateDroplet, desc, DialogModes.NO)
            path.remove()
            return true
        }
        catch (e) { }
        return false
    }

    this.getCurrentAction = function () {
        try {
            var ref = new ActionReference()
            ref.putEnumerated(gAction, gOrdinal, gTargetEnum)

            var atnName = executeActionGet(ref).getString(gParent),
                atnIndex = executeActionGet(ref).getInteger(gParentIndex),
                setIndex = getSetName(atnName, atnIndex)
            if (setIndex) return { atnIndex: atnIndex, setIndex: setIndex[0], atnName: atnName, setName: setIndex[1] }
            else {
                atnName = executeActionGet(ref).getString(gName)
                atnIndex = executeActionGet(ref).getInteger(gItemIndex)
                setIndex = getSetName(atnName, atnIndex)
                if (setIndex) return { atnIndex: atnIndex, setIndex: setIndex[0], atnName: atnName, setName: setIndex[1] }
            }
        } catch (e) { }

        return { atnIndex: 0, setIndex: 0, atnName: "", setName: "" }

        function getSetName(atnName, atnIndex) {
            var setCounter = 1
            while (true) {
                var ref = new ActionReference()
                ref.putIndex(gActionSet, setCounter)
                var desc = undefined
                try { desc = executeActionGet(ref) } catch (e) { break; }

                var numberChildren = desc.hasKey(gNumberOfChildren) ? desc.getInteger(gNumberOfChildren) : 0

                if (numberChildren > 0 && atnIndex <= numberChildren) {
                    var ref = new ActionReference()
                    ref.putProperty(gProperty, gName)
                    ref.putIndex(gAction, atnIndex)
                    ref.putIndex(gActionSet, setCounter)
                    if (executeActionGet(ref).getString(gName) == atnName) {
                        var ref = new ActionReference()
                        ref.putIndex(gActionSet, setCounter)
                        return [executeActionGet(ref).getInteger(gItemIndex), executeActionGet(ref).getString(gName)]
                    }
                }
                setCounter++
            }
            return null
        }
    }

    function getDescValue(desc, property) {

        switch (desc.getType(property)) {
            case DescValueType.OBJECTTYPE:
                return (desc.getObjectValue(property));
                break;
            case DescValueType.LISTTYPE:
                return desc.getList(property);
                break;
            case DescValueType.REFERENCETYPE:
                return desc.getReference(property);
                break;
            case DescValueType.BOOLEANTYPE:
                return desc.getBoolean(property);
                break;
            case DescValueType.STRINGTYPE:
                return desc.getString(property);
                break;
            case DescValueType.INTEGERTYPE:
                return desc.getInteger(property);
                break;
            case DescValueType.LARGEINTEGERTYPE:
                return desc.getLargeInteger(property);
                break;
            case DescValueType.DOUBLETYPE:
                return desc.getDouble(property);
                break;
            case DescValueType.ALIASTYPE:
                return desc.getPath(property);
                break;
            case DescValueType.CLASSTYPE:
                return desc.getClass(property);
                break;
            case DescValueType.UNITDOUBLE:
                return (desc.getUnitDoubleValue(property));
                break;
            case DescValueType.ENUMERATEDTYPE:
                return (t2s(desc.getEnumerationValue(property)));
                break;
            case DescValueType.RAWTYPE:
                var tempStr = desc.getData(property);
                var rawData = new Array();
                for (var tempi = 0; tempi < tempStr.length; tempi++) {
                    rawData[tempi] = tempStr.charCodeAt(tempi);
                }
                return rawData;
                break;
            default:
                break;
        };
    }

    function s2t(s) { return stringIDToTypeID(s) }
    function t2s(t) { return typeIDToStringID(t) }

    this.getScriptSettings = function (settingsObj, fromAction) {
        if (fromAction) {
            var d = app.playbackParameters
        } else {
            try { var d = app.getCustomOptions(GUID) } catch (e) { }
        }

        if (d != undefined) descriptorToObject(settingsObj, d, strMessage)

        function descriptorToObject(o, d, s) {
            var l = d.count;
            if (l) {
                if (d.hasKey(s2t("message")) && (s != d.getString(s2t("message")))) return;
            }
            for (var i = 0; i < l; i++) {
                var k = d.getKey(i);
                var t = d.getType(k);
                strk = app.typeIDToStringID(k);
                switch (t) {
                    case DescValueType.BOOLEANTYPE:
                        o[strk] = d.getBoolean(k);
                        break;
                    case DescValueType.STRINGTYPE:
                        o[strk] = d.getString(k);
                        break;
                    case DescValueType.INTEGERTYPE:
                        o[strk] = d.getDouble(k);
                        break;
                }
            }
        }
    }

    this.putScriptSettings = function (settingsObj, toAction) {
        var d = objectToDescriptor(settingsObj, strMessage)

        if (toAction) { app.playbackParameters = d }
        else { app.putCustomOptions(GUID, d) }

        function objectToDescriptor(o, s) {
            var d = new ActionDescriptor;
            var l = o.reflect.properties.length;
            d.putString(s2t("message"), s);
            for (var i = 0; i < l; i++) {
                var k = o.reflect.properties[i].toString();
                if (k == "__proto__" || k == "__count__" || k == "__class__" || k == "reflect") continue;
                var v = o[k];
                k = app.stringIDToTypeID(k);
                switch (typeof (v)) {
                    case "boolean": d.putBoolean(k, v); break;
                    case "string": d.putString(k, v); break;
                    case "number": d.putInteger(k, v); break;
                }
            }
            return d;
        }
    }
}

function generateUUID() {
    var id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0;
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return id
}

function Config() {
    this.toDo = ""
    this.sel = ""
    this.atn = 0
    this.set = 0
    this.docID = 0
}