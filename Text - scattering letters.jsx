var app = app;
var app = new AM('application'),
    lr = new AM('layer'),
    scale = 30, // %, randomize size of each letter (percent of size)
    offset = 2, //%. randomize Y position of each letter, (percent of size)
    angle = 15; //deg, randomize angle of each letter (max angle)
if (app.getProperty('numberOfDocuments')) activeDocument.suspendHistory('Scattering letters', 'main()')
function main() {
    if (lr.hasProperty('textKey')) {
        lr.setVisiblity('show')
        var fx = lr.hasProperty('layerEffects');
        if (fx) lr.copyStyle();
        lr.setVisiblity('hide')
        lr.duplicateLayer(lr.getProperty('name'));
        lr.setVisiblity('show')
        if (fx) lr.clearStyle();
        lr.convertToSmartObject();
        if (fx) lr.pasteStyle();
        lr.editSmartObject();
        activeDocument.suspendHistory('Scattering letters', 'splitLetters()')
        function splitLetters() {
            var letters = lr.describeTextLayer(),
                baseLayerId = lr.getProperty('layerID');
            doForcedProgress('letter preparation', 'prepareLetters ()')
            doForcedProgress('move letters', 'moveLetters ()')
            function prepareLetters() {
                lr.randomizeSize(letters, scale);
                lr.revealAll();
                lr.splitLetters(letters);
                var IDs = [];
                for (var i = 0; i < letters.length; i++) if (letters[i].id) IDs.push(letters[i].id)
                lr.setVisiblity('hide', IDs)
            }
            function moveLetters() {
                for (var i = 0; i < letters.length; i++) {
                    updateProgress(i + 1, letters.length);
                    changeProgressText('move letter: ' + letters[i].content)
                    if (letters[i].id) {
                        lr.selectLayer([letters[i].id])
                        lr.setWhiteText(baseLayerId)
                        lr.setBlackText(baseLayerId, i)
                        lr.selectRGBChannel()
                        lr.inverseSelection()
                        lr.alignLayer()
                        lr.deselect()
                    }
                }
                for (var i = 0; i < letters.length; i++) {
                    if (letters[i].id) {
                        lr.selectLayer([letters[i].id], true)
                        var rotate = Math.random() > 0.5 ? Math.random() * angle : -Math.random() * angle,
                            bounds = lr.descToObject(lr.getProperty('bounds').value),
                            height = bounds.bottom - bounds.top,
                            shift = height * Math.random() > 0.5 ? Math.random() * offset / 100 : -Math.random() * offset / 100;
                        lr.transform(rotate, 0, shift)
                    }
                }
            }
            lr.selectLayer([baseLayerId])
            lr.removeLayer()
            lr.revealAll()
            app.closeDocument(true)
        }
    }
}
function AM(target) {
    var s2t = stringIDToTypeID,
        t2s = typeIDToStringID;
    target = target ? s2t(target) : null;
    this.getProperty = function (property, id, idxMode) {
        property = s2t(property);
        (r = new ActionReference()).putProperty(s2t('property'), property);
        id != undefined ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id)) :
            r.putEnumerated(target, s2t('ordinal'), s2t('targetEnum'));
        return getDescValue(executeActionGet(r), property)
    }
    this.hasProperty = function (property, id, idxMode) {
        property = s2t(property);
        (r = new ActionReference()).putProperty(s2t('property'), property);
        id ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id))
            : r.putEnumerated(target, s2t('ordinal'), s2t('targetEnum'));
        try { return executeActionGet(r).hasKey(property) } catch (e) { return false }
    }
    this.descToObject = function (d) {
        var o = {}
        for (var i = 0; i < d.count; i++) {
            var k = d.getKey(i)
            o[t2s(k)] = getDescValue(d, k)
        }
        return o
    }
    this.duplicateLayer = function (name) {
        (r = new ActionReference()).putEnumerated(target, s2t('ordinal'), s2t('targetEnum'));
        (d = new ActionDescriptor()).putReference(s2t('target'), r);
        d.putString(s2t('name'), name);
        executeAction(s2t('duplicate'), d, DialogModes.NO);
    }
    this.removeLayer = function (name) {
        (r = new ActionReference()).putEnumerated(target, s2t('ordinal'), s2t('targetEnum'));
        (d = new ActionDescriptor()).putReference(s2t('target'), r);
        executeAction(s2t('delete'), d, DialogModes.NO);
    }
    this.copyStyle = function () {
        executeAction(s2t('copyEffects'), undefined, DialogModes.NO);
    }
    this.pasteStyle = function () {
        executeAction(s2t('pasteEffects'), undefined, DialogModes.NO);
    }
    this.clearStyle = function () {
        (r = new ActionReference()).putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
        (d = new ActionDescriptor()).putReference(s2t('target'), r);
        executeAction(s2t('disableLayerFX'), d, DialogModes.NO);
    }
    this.setVisiblity = function (mode, IDsList) {
        var r = new ActionReference();
        if (IDsList) for (var i = 0; i < IDsList.length; i++)r.putIdentifier(s2t('layer'), IDsList[i]);
        else r.putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
        (d = new ActionDescriptor()).putReference(s2t('target'), r);
        executeAction(s2t(mode), d, DialogModes.NO);
    }
    this.convertToSmartObject = function () {
        executeAction(s2t('newPlacedLayer'), undefined, DialogModes.NO);
    }
    this.editSmartObject = function () {
        executeAction(s2t('placedLayerEditContents'), undefined, DialogModes.NO);
    }
    this.selectLayer = function (IDsList, makeVisible) {
        var r = new ActionReference()
        if (IDsList) for (var i = 0; i < IDsList.length; i++)r.putIdentifier(s2t('layer'), IDsList[i]);
        (d = new ActionDescriptor()).putReference(s2t('target'), r)
        d.putBoolean(s2t('makeVisible'), makeVisible ? makeVisible : false)
        executeAction(s2t('select'), d, DialogModes.NO)
    }
    this.describeTextLayer = function () {
        (r = new ActionReference()).putProperty(s2t('property'), p = s2t('textKey'));
        r.putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
        var textKey = executeActionGet(r).getObjectValue(p),
            tList = textKey.getList(s2t('textStyleRange')),
            styleSheet = { textStyle: [], paragraphStyle: [] },
            text = textKey.getString(s2t('textKey')),
            output = [];
        for (var i = 0; i < tList.count; i++) {
            styleSheet.textStyle.push({
                from: tList.getObjectValue(i).getInteger(s2t('from')),
                to: tList.getObjectValue(i).getInteger(s2t('to')),
                style: tList.getObjectValue(i).getObjectValue(s2t('textStyle'))
            })
        };
        for (var i = 0; i < text.length; i++) {
            output.push({
                content: text.substr(i, 1),
                textStyle: findStyle(styleSheet.textStyle, i),
            });
        };
        return output;
        function findStyle(style, idx) {
            for (var i = 0; i < style.length; i++) {
                if (idx >= style[i].from && idx < style[i].to) return copyDesc(style[i].style, new ActionDescriptor())
            }
        }
    }
    this.randomizeSize = function (letters, ratio) {
        ratio = ratio ? ratio : 0.5;
        (r = new ActionReference()).putProperty(s2t('property'), p = s2t('textKey'));
        r.putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
        var textKey = executeActionGet(r).getObjectValue(p);
        for (var i = 0; i < letters.length; i++) {
            if (!/\s/.test(letters[i].content)) {
                var impliedFontSize = letters[i].textStyle.getUnitDoubleValue(s2t('impliedFontSize'))
                letters[i].textStyle.putUnitDouble(s2t('    '), s2t('pointsUnit'), impliedFontSize + impliedFontSize * (Math.random() > 0.5 ? Math.random() * ratio / 100 : -Math.random() * ratio / 100));
            }
        }
        var l = new ActionList();
        for (var i = 0; i < letters.length; i++) {
            var d = new ActionDescriptor();
            d.putObject(s2t('textStyle'), s2t('textStyle'), letters[i].textStyle);
            d.putInteger(s2t('from'), i);
            d.putInteger(s2t('to'), i + 1);
            l.putObject(s2t('textStyleRange'), d)
        }
        textKey.putList(s2t('textStyleRange'), l);
        (r = new ActionReference()).putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        d.putObject(s2t('to'), s2t('textLayer'), textKey);
        executeAction(s2t('set'), d, DialogModes.NO);
    }
    this.revealAll = function () {
        executeAction(s2t('revealAll'), new ActionDescriptor(), DialogModes.NO);
    }
    this.splitLetters = function (letters) {
        (r = new ActionReference()).putProperty(s2t('property'), p = s2t('textKey'));
        r.putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
        var textKey = executeActionGet(r).getObjectValue(p);
        for (var i = 0; i < letters.length; i++) {
            if (!/\s/.test(letters[i].content)) {
                lr.duplicateLayer(letters[i].content)
                var d = new ActionDescriptor(),
                    l = new ActionList();
                d.putObject(s2t('textStyle'), s2t('textStyle'), letters[i].textStyle);
                d.putInteger(s2t('from'), 0);
                d.putInteger(s2t('to'), 1);
                l.putObject(s2t('textStyleRange'), d)
                textKey.putList(s2t('textStyleRange'), l);
                (r = new ActionReference()).putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
                (d = new ActionDescriptor()).putReference(s2t('null'), r);
                textKey.putString(s2t('textKey'), letters[i].content);
                d.putObject(s2t('to'), s2t('textLayer'), textKey);
                executeAction(s2t('set'), d, DialogModes.NO);
                (r = new ActionReference()).putProperty(s2t('property'), p = s2t('layerID'));
                r.putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
                letters[i].id = executeActionGet(r).getInteger(p);
            }
        }
    }
    this.setWhiteText = function (id) {
        (r = new ActionReference()).putProperty(s2t('property'), p = s2t('textKey'));
        r.putIdentifier(s2t('layer'), id);
        var textKey = executeActionGet(r).getObjectValue(p),
            tList = textKey.getList(s2t('textStyleRange')),
            l = new ActionList();
        for (var i = 0; i < tList.count; i++) {
            var k = tList.getObjectValue(i),
                s = k.getObjectValue(s2t('textStyle'));
            var d = new ActionDescriptor();
            d.putDouble(s2t('red'), 255)
            d.putDouble(s2t('grain'), 255)
            d.putDouble(s2t('blue'), 255)
            s.putObject(s2t('color'), s2t('RGBColor'), d)
            k.putObject(s2t('textStyle'), s2t('textStyle'), s)
            l.putObject(s2t('textStyleRange'), k)
        }
        textKey.putList(s2t('textStyleRange'), l)
        var d = new ActionDescriptor();
        (r = new ActionReference()).putIdentifier(s2t('layer'), id);
        d.putReference(s2t('target'), r);
        d.putObject(s2t('to'), s2t('textLayer'), textKey);
        executeAction(s2t('set'), d, DialogModes.NO);
    }
    this.setBlackText = function (id, idx) {
        (r = new ActionReference()).putProperty(s2t('property'), p = s2t('textKey'));
        r.putIdentifier(s2t('layer'), id);
        var textKey = executeActionGet(r).getObjectValue(p),
            tList = textKey.getList(s2t('textStyleRange')),
            l = new ActionList();
        for (var i = 0; i < tList.count; i++) {
            var k = tList.getObjectValue(i),
                s = k.getObjectValue(s2t('textStyle'));
            if (idx == i) {
                var d = new ActionDescriptor();
                d.putDouble(s2t('red'), 0)
                d.putDouble(s2t('grain'), 0)
                d.putDouble(s2t('blue'), 0)
                s.putObject(s2t('color'), s2t('RGBColor'), d)
            }
            k.putObject(s2t('textStyle'), s2t('textStyle'), s)
            l.putObject(s2t('textStyleRange'), k)
        }
        textKey.putList(s2t('textStyleRange'), l)
        var d = new ActionDescriptor();
        (r = new ActionReference()).putIdentifier(s2t('layer'), id);
        d.putReference(s2t('target'), r);
        d.putObject(s2t('to'), s2t('textLayer'), textKey);
        executeAction(s2t('set'), d, DialogModes.NO);
    }
    this.selectRGBChannel = function () {
        (r = new ActionReference()).putProperty(s2t('channel'), s2t('selection'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        (r1 = new ActionReference()).putEnumerated(s2t('channel'), s2t('channel'), s2t('RGB'));
        d.putReference(s2t('to'), r1);
        executeAction(s2t('set'), d, DialogModes.NO);
    }
    this.inverseSelection = function () {
        executeAction(s2t('inverse'), undefined, DialogModes.NO);
    }
    this.transform = function (angle, dX, dY) {
        (r = new ActionReference()).putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
        (d = new ActionDescriptor()).putReference(s2t('target'), r);
        d.putEnumerated(s2t('freeTransformCenterState'), s2t('quadCenterState'), s2t('QCSAverage'));
        (d1 = new ActionDescriptor()).putUnitDouble(s2t('horizontal'), s2t('distanceUnit'), dX);
        d1.putUnitDouble(s2t('vertical'), s2t('distanceUnit'), dY);
        d.putObject(s2t('offset'), s2t('offset'), d1);
        d.putUnitDouble(s2t('angle'), s2t('angleUnit'), angle);
        d.putEnumerated(s2t('interfaceIconFrameDimmed'), s2t('interpolationType'), s2t('bicubic'));
        executeAction(s2t('transform'), d, DialogModes.NO);
    }
    this.alignLayer = function () {
        (r = new ActionReference()).putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
        (d = new ActionDescriptor()).putReference(s2t('target'), r);
        d.putEnumerated(s2t('using'), s2t('alignDistributeSelector'), s2t('ADSCentersH'));
        d.putBoolean(s2t('alignToCanvas'), false);
        executeAction(s2t('align'), d, DialogModes.NO);
        (r = new ActionReference()).putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
        (d = new ActionDescriptor()).putReference(s2t('target'), r);
        d.putEnumerated(s2t('using'), s2t('alignDistributeSelector'), s2t('ADSCentersV'));
        d.putBoolean(s2t('alignToCanvas'), false);
        executeAction(s2t('align'), d, DialogModes.NO);
    }
    this.deselect = function () {
        (r = new ActionReference()).putProperty(s2t('channel'), s2t('selection'));
        (d = new ActionDescriptor()).putReference(s2t('target'), r);
        d.putEnumerated(s2t('to'), s2t('ordinal'), s2t('none'));
        executeAction(s2t('set'), d, DialogModes.NO);
    }
    this.closeDocument = function (save) {
        save = save != true ? s2t('no') : s2t('yes');
        (d = new ActionDescriptor()).putEnumerated(s2t('saving'), s2t('yesNo'), save);
        executeAction(s2t('close'), d, DialogModes.NO);
    }
    function copyDesc(from, to) {
        for (var i = 0; i < from.count; i++) {
            var k = from.getKey(i);
            if (to.hasKey(k)) continue;
            switch (from.getType(k)) {
                case DescValueType.ALIASTYPE: to.putPath(k, from.getPath(k)); break;
                case DescValueType.BOOLEANTYPE: to.putBoolean(k, from.getBoolean(k)); break;
                case DescValueType.CLASSTYPE: to.putClass(k, from.getClass(k)); break;
                case DescValueType.DOUBLETYPE: to.putDouble(k, from.getDouble(k)); break;
                case DescValueType.INTEGERTYPE: to.putInteger(k, from.getInteger(k)); break;
                case DescValueType.LISTTYPE: to.putList(k, from.getList(k)); break;
                case DescValueType.RAWTYPE: to.putData(k, from.getData(k)); break;
                case DescValueType.STRINGTYPE: to.putString(k, from.getString(k)); break;
                case DescValueType.LARGEINTEGERTYPE: to.putLargeInteger(k, from.getLargeInteger(k)); break;
                case DescValueType.REFERENCETYPE: to.putReference(k, from.getReference(k)); break;
                case DescValueType.OBJECTTYPE: to.putObject(k, from.getObjectType(k), from.getObjectValue(k)); break;
                case DescValueType.ENUMERATEDTYPE: to.putEnumerated(k, from.getEnumerationType(k), from.getEnumerationValue(k)); break;
                case DescValueType.UNITDOUBLE: to.putUnitDouble(k, from.getUnitDoubleType(k), from.getUnitDoubleValue(k)); break;
            }
        }
        return to
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