
#target photoshop

$.hiresTimer;

s2t = stringIDToTypeID;

(ref = new ActionReference()).putProperty(s2t('property'), p = s2t('numberOfLayers'));
ref.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
var len = executeActionGet(ref).getInteger(p)

var ids = []
for (var i = 1; i <= len; i++) {
    (ref = new ActionReference()).putProperty(s2t('property'), p = s2t('layerID'));
    ref.putIndex(s2t('layer'), i);
    ids.push(executeActionGet(ref).getInteger(p))
}

selectLayerByIDList(ids)
setLayerLabelCol('violet') 

alert ($.hiresTimer);

function selectLayerByIDList(IDList) {
    var ref = new ActionReference()
    for (var i = 0; i < IDList.length; i++) { ref.putIdentifier(s2t('layer'), IDList[i]) }
    (desc = new ActionDescriptor()).putReference(s2t('null'), ref)
    desc.putEnumerated(s2t('selectionModifier'), s2t('addToSelectionContinuous'), s2t('addToSelection'))
    executeAction(s2t('select'), desc, DialogModes.NO)
}

function setLayerLabelCol(labelCol) {
    /*
        No Color = "none"
        Red = "red"
        Orange = "orange"
        Yellow = "yellowColor"
        Green = "green"
        Blue = "blue"
        Violet = "violet"
        Gray = "gray"
    */
    (ref = new ActionReference).putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
    (desc = new ActionDescriptor()).putReference(s2t('null'), ref);
    (desc1 = new ActionDescriptor()).putEnumerated(s2t('color'), s2t('color'), s2t(labelCol));
    desc.putObject(s2t('to'), s2t('layer'), desc1);
    executeAction(s2t('set'), desc, DialogModes.NO);
}

/*
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
}*/

/*
function setLayerLabelCol(IDList) {


    No Color = "none"
    Red = "red"
    Orange = "orange"
    Yellow = "yellowColor"
    Green = "green"
    Blue = "blue"
    Violet = "violet"
    Gray = "gray"


    var labelCol = "red" // Change to a value listed above
    var c2t = function (s) {
        return app.charIDToTypeID(s);
    };

    var descriptor = new ActionDescriptor();
    var descriptor2 = new ActionDescriptor();
    var reference = new ActionReference();

    for (var i = 1; i < IDList.length; i++) {
        reference.putIdentifier(s2t("layer"), IDList[i])
    }
    descriptor.putReference(c2t("null"), reference);
    descriptor2.putEnumerated(s2t("color"), s2t("color"), s2t(labelCol)); // variable labelCol
    descriptor.putObject(s2t("to"), s2t("layer"), descriptor2);
    executeAction(s2t("set"), descriptor, DialogModes.NO);
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

    function selectLayerByIDList = function (IDList) {
        var ref = new ActionReference()

        for (var i = 1; i < IDList.length; i++) {
            ref.putIdentifier(s2t("layer"), IDList[i])
        }

        var desc = new ActionDescriptor()
        desc.putReference(s2t("null"), ref)
        desc.putEnumerated(s2t("selectionModifier"), s2t("addToSelectionContinuous"), s2t("addToSelection"))

        executeAction(s2t("select"), desc, DialogModes.NO)
    }

    /*
    function select(makeVisible) {
        var c2t = function (s) {
            return app.charIDToTypeID(s);
        };

        var s2t = function (s) {
            return app.stringIDToTypeID(s);
        };

        var descriptor = new ActionDescriptor();
        var list = new ActionList();
        var reference = new ActionReference();

        reference.putName( s2t( "layer" ), "Layer 1" );
        descriptor.putReference( c2t( "null" ), reference );
        descriptor.putEnumerated( s2t( "selectionModifier" ), s2t( "selectionModifierType" ), s2t( "addToSelectionContinuous" ));
        descriptor.putBoolean( s2t( "makeVisible" ), makeVisible );
        list.putInteger( 2 );
        list.putInteger( 3 );
        list.putInteger( 4 );
        list.putInteger( 5 );
        descriptor.putList( s2t( "layerID" ), list );
        executeAction( s2t( "select" ), descriptor, DialogModes.NO );
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

function s2t(s) { return stringIDToTypeID(s) }
function t2s(t) { return typeIDToStringID(t) }*/