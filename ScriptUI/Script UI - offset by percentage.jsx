/**Add the ability to select percentage in the offset filter.
 * https://community.adobe.com/t5/photoshop-ecosystem-ideas/add-the-ability-to-select-percentage-in-the-offset-filter/idi-p/13251731
 * https://youtu.be/dB3XcZj39AU
 */

#target photoshop
/*
// BEGIN__HARVEST_EXCEPTION_ZSTRING
<javascriptresource>
<name>Offset by percentage</name>
<menu>filter</menu>
<enableinfo>true</enableinfo>
<eventid>77f614d4-53a3-4b8c-9475-791849a9f273</eventid>
<terminology><![CDATA[<< /Version 1
                       /Events <<
                       /77f614d4-53a3-4b8c-9475-791849a9f273 [(Offset by percentage) <<
                       /horizontal [($$$/Dialog/Offset/Horizontal) /number]
                       /vertical [($$$/Dialog/Offset/Vertical) /number]
                       /undefinedAreas [($$$/Dialog/Offset/UndefinedAreas) /string]
                       >>]
                        >>
                     >> ]]></terminology>
</javascriptresource>
// END__HARVEST_EXCEPTION_ZSTRING
*/
$.localize = true
const UUID = '77f614d4-53a3-4b8c-9475-791849a9f273';
var str = new Locale(),
    cfg = new Config(),
    doc = new AM('document'),
    lr = new AM('layer'),
    res = doc.getProperty('resolution'),
    width = doc.getProperty('width') * res / 72,
    height = doc.getProperty('height') * res / 72,
    background = lr.getProperty('itemIndex') == 1 && doc.getProperty('hasBackgroundLayer'),
    isCancelled = false;
main()
isCancelled ? 'cancel' : undefined
function main() {
    if (!app.playbackParameters.count) {
        cfg.getScriptSettings()
        var w = dialogWindow(); var result = w.show()
        if (result == 2) {
            isCancelled = true;
            return;
        } else {
            cfg.putScriptSettings(true)
            cfg.putScriptSettings()
        }
    }
    else {
        cfg.getScriptSettings(true)
        if (app.playbackDisplayDialogs == DialogModes.ALL) {
            var w = dialogWindow(true); var result = w.show()
            if (result == 2) {
                isCancelled = true;
                return;
            } else {
                cfg.putScriptSettings(true)
            }
        }
        if (app.playbackDisplayDialogs != DialogModes.ALL) {
            doc.offset(cfg.horizontal * width / 100, cfg.vertical * height / 100, cfg.undefinedAreas)
        }
    }
}
function dialogWindow() {
    activeDocument.suspendHistory('Initial offset state', '');
    var initialState = activeDocument.activeHistoryState;
    var w = new Window("dialog {alignChildren: ['fill', 'top']}"),
        gOffset = w.add("group{orientation:'row', alignChildren:['left', 'fill']}"),
        gSliders = gOffset.add("group{orientation:'column', alignChildren:['left', 'center'], spacing:5}"),
        gHorizontal = gSliders.add("group{orientation:'column',alignChildren:['left', 'center'],spacing:0}"),
        gHorizontalOptions = gHorizontal.add("group{orientation:'row',alignChildren:['left', 'center']}"),
        stHorizontal = gHorizontalOptions.add("statictext{preferredSize:[75,-1], justify:'right'}"),
        gHorizontalValue = gHorizontalOptions.add("group{orientation:'row',alignChildren:['left', 'center'],spacing:0}"),
        etHorizontal = gHorizontalValue.add("editnumber{preferredSize:[40,-1]}"),
        slHorizontal = gHorizontal.add("slider{minvalue:-200,maxvalue:200,value:0,preferredSize:[200,-1],alignment:['center', 'center']}"),
        stHorizontalLabel = gHorizontalOptions.add("statictext{preferredSize:[70,-1]}"),
        gVertical = gSliders.add("group{orientation:'column',alignChildren:['left', 'center'],spacing:0}"),
        gVerticalOptions = gVertical.add("group{orientation:'row',alignChildren:['left', 'center']}"),
        stVertical = gVerticalOptions.add("statictext{preferredSize:[75,-1], justify:'right'}"),
        gVerticalValue = gVerticalOptions.add("group{orientation:'row',alignChildren:['left', 'center'],spacing:0}"),
        etVertical = gVerticalValue.add("editnumber{preferredSize:[40,-1]}"),
        slVertical = gVertical.add("slider{minvalue:-200,maxvalue:200,value:0,preferredSize:[200,-1],alignment:['center', 'center']}"),
        stVerticalLabel = gVerticalOptions.add("statictext{preferredSize:[70,-1]}"),
        gButtons = gOffset.add("group{orientation:'column',alignChildren:['fill', 'top']}"),
        bnOk = gButtons.add('button', undefined, undefined, { name: 'ok' }),
        bnCancel = gButtons.add('button', undefined, undefined, { name: 'cancel' }),
        bnPreview = gButtons.add('button'),
        pnUndefinedAreas = w.add("panel{orientation:'column',alignChildren:['left', 'top']}"),
        chSetToBackround = pnUndefinedAreas.add('radiobutton{label:"background"}'),
        chRepeatEdgePixels = pnUndefinedAreas.add('radiobutton{label:"repeat"}'),
        chWrapAround = pnUndefinedAreas.add('radiobutton{label:"wrap"}'),
        offsetOptions = { background: chSetToBackround, repeat: chRepeatEdgePixels, wrap: chWrapAround };
    w.text = str.Offset;
    stHorizontal.text = str.Horizontal;
    stHorizontalLabel.text = str.Percent + ' ' + str.Right;
    stVertical.text = str.Vertical;
    stVerticalLabel.text = str.Percent + ' ' + str.Down;
    bnOk.text = str.Ok;
    bnCancel.text = str.Cancel;
    bnPreview.text = str.Preview;
    pnUndefinedAreas.text = str.UndefinedAreas;
    chSetToBackround.text = background ? str.SetToBackground : str.SetToTransparent;
    chRepeatEdgePixels.text = str.RepeatEdgePixels;
    chWrapAround.text = str.WrapAround;
    slHorizontal.onChanging = function () { cfg.horizontal = etHorizontal.text = Math.round(this.value) };
    slVertical.onChanging = function () { cfg.vertical = etVertical.text = Math.round(this.value) };
    etVertical.onChanging = function () { checkValues(this, slVertical); cfg.vertical = Math.round(Number(this.text)) };
    etHorizontal.onChanging = function () { checkValues(this, slHorizontal); cfg.horizontal = Math.round(Number(this.text)) };
    chWrapAround.onClick = chSetToBackround.onClick = chRepeatEdgePixels.onClick = function () { cfg.undefinedAreas = this.label };
    bnPreview.onClick = function () { cfg.preview = this.value };
    etVertical.addEventListener('keydown', eventHandler);
    etHorizontal.addEventListener('keydown', eventHandler);
    slVertical.addEventListener('keydown', eventHandler);
    slHorizontal.addEventListener('keydown', eventHandler);
    w.onShow = function () {
        etHorizontal.value = cfg.horizontal;
        etVertical.value = cfg.vertical;
        offsetOptions[cfg.undefinedAreas].value = true;
        etHorizontal.onChanging();
        etVertical.onChanging();
    }
    bnPreview.onClick = function () {
        activeDocument.activeHistoryState = initialState;
        doc.offset(cfg.horizontal * width / 100, cfg.vertical * height / 100, cfg.undefinedAreas)
        app.refresh();
    }
    bnOk.onClick = function () {
        activeDocument.activeHistoryState = initialState;
        doc.offset(cfg.horizontal * width / 100, cfg.vertical * height / 100, cfg.undefinedAreas);
        w.close(1)
    }
    bnCancel.onClick = function () { activeDocument.activeHistoryState = initialState; w.close(2) }
    return w;
    function eventHandler(evt) {
        if (evt.currentTarget.type == 'editnumber') {
            if (evt.keyName == 'Up') evt.currentTarget.text = Number(evt.currentTarget.text) + 1;
            if (evt.keyName == 'Down') evt.currentTarget.text = Number(evt.currentTarget.text) - 1;
        };
        evt.currentTarget.onChanging();
    }
    function checkValues(source, target) {
        if (Number(source.text) > 200) source.text = 200;
        if (Number(source.text) < -200) source.text = -200;
        target.value = Number(source.text);
    }
}
function Locale() {
    this.Offset = localize('$$$/Actions/Event/Offset');
    this.SetToTransparent = localize('$$$/OffsetFilter/BackgroundRadio/Title/SetToTransparent');
    this.Horizontal = localize('$$$/Dialog/Offset/Horizontal');
    this.Down = localize('$$$/Actions/Enum/Down');
    this.Right = localize('$$$/Actions/Enum/Right');
    this.Percent = '%';
    this.Ok = localize('$$$/Liquify/FilterDialog/OK');
    this.Cancel = localize('$$$/Liquify/FilterDialog/Cancel');
    this.Preview = localize('$$$/Actions/Key/Preview');
    this.RepeatEdgePixels = localize('$$$/Dialog/Offset/RepeatEdgePixels');
    this.SetToBackground = localize('$$$/Dialog/Offset/SetToBackground');
    this.UndefinedAreas = localize('$$$/Dialog/Offset/UndefinedAreas');
    this.Vertical = localize('$$$/Dialog/Offset/Vertical');
    this.WrapAround = localize('$$$/Dialog/Offset/WrapAround');
}
function Config() {
    var s2t = stringIDToTypeID,
        t2s = typeIDToStringID;
    this.horizontal = 0
    this.vertical = 0
    this.undefinedAreas = 'wrap';
    settingsObj = this;
    this.getScriptSettings = function (fromAction) {
        if (fromAction) d = playbackParameters else try { var d = getCustomOptions(UUID) } catch (e) { };
        if (d != undefined) descriptorToObject(settingsObj, d)
        function descriptorToObject(o, d) {
            var l = d.count;
            for (var i = 0; i < l; i++) {
                var k = d.getKey(i);
                var t = d.getType(k);
                strk = app.typeIDToStringID(k);
                switch (t) {
                    case DescValueType.BOOLEANTYPE: o[strk] = d.getBoolean(k); break;
                    case DescValueType.STRINGTYPE: o[strk] = d.getString(k); break;
                    case DescValueType.INTEGERTYPE: o[strk] = d.getDouble(k); break;
                }
            }
        }
    }
    this.putScriptSettings = function (toAction) {
        var d = objectToDescriptor(settingsObj, UUID)
        if (toAction) playbackParameters = d else putCustomOptions(UUID, d);
        function objectToDescriptor(o) {
            var d = new ActionDescriptor;
            var l = o.reflect.properties.length;
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
function AM(target, order) {
    var s2t = stringIDToTypeID,
        t2s = typeIDToStringID;
    target = s2t(target)
    this.getProperty = function (property, descMode, id, idxMode) {
        property = s2t(property);
        (r = new ActionReference()).putProperty(s2t('property'), property);
        id != undefined ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id)) :
            r.putEnumerated(target, s2t('ordinal'), order ? s2t(order) : s2t('targetEnum'));
        return descMode ? executeActionGet(r) : getDescValue(executeActionGet(r), property)
    }
    this.hasProperty = function (property, id, idxMode) {
        property = s2t(property);
        (r = new ActionReference()).putProperty(s2t('property'), property);
        id ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id))
            : r.putEnumerated(target, s2t('ordinal'), order ? s2t(order) : s2t('targetEnum'));
        return executeActionGet(r).hasKey(property)
    }
    this.descToObject = function (d) {
        var o = {}
        for (var i = 0; i < d.count; i++) {
            var k = d.getKey(i)
            o[t2s(k)] = getDescValue(d, k)
        }
        return o
    }
    this.offset = function (dH, dV, mode) {
        (d = new ActionDescriptor()).putInteger(s2t('horizontal'), dH);
        d.putInteger(s2t('vertical'), dV);
        d.putEnumerated(s2t('fill'), s2t('fillMode'), s2t(mode));
        executeAction(s2t('offset'), d, DialogModes.ERROR);
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
        };
    }
}