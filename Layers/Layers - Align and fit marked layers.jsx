/*** Script that align selected layers to frames.
* The marked layers is a frames, the seleted layers is a photo. 
* Select layers with photos, start the script. It receives the boundaries of marked layers (photos and masks), 
* fits  ptotos to the frame so that: 
* a) the upper boundary of the photo does not cross the frame 
* b) the photo completely overlaps the frame 
* https://www.youtube.com/watch?v=7vCUkDgEALs
*/

/*
<javascriptresource>
<category>jazzy</category>
<name>Align and fit marked layers</name>
<enableinfo>true</enableinfo>
</javascriptresource>
*/

#target photoshop

var lr = new AM('layer'),
    doc = new AM('document'),
    previousLayer = new AM('layer', 'backwardEnum');

activeDocument.suspendHistory('Align and fit subject', 'alignAndFit()')
function alignAndFit() { app.doProgress('', 'main ()') }

function main() {

    var subjects = [],
        subjectColors = {},
        subjectIds = {},
        frames = [],
        frameColors = {},
        targetIds = doc.getProperty('targetLayersIDs');

    app.updateProgress(1, 4)

    for (var i = 0; i < targetIds.count; i++) {
        var subject = lr.descToObject(lr.getProperty('bounds', false, (id = targetIds.getReference(i).getIdentifier('layerID'))))

        with (subject) {
            subject.width = right - left
            subject.height = bottom - top
            subject.center = { y: top + height / 2, x: left + width / 2 }
            subject.vertical = bottom - top > right - left
            subject.ratio = width / height
        }

        subject.color = lr.getProperty('color')[1]
        subject.id = id

        if (!subjectColors[subject.color]) subjectColors[subject.color] = []
        subjectColors[subject.color].push(id)
        subjectIds[id] = subject.color
        subjects.push(subject)

        if (subject.color == 'none') break;
    }

    subjects.sort(function (a, b) { return a.ratio > b.ratio ? 1 : -1 })

    if (subjects.length > 1) {
        var from = doc.getProperty('hasBackgroundLayer') ? 0 : 1,
            len = doc.getProperty('numberOfLayers');

        for (var i = from; i <= len; i++) {
            if (lr.getProperty('layerSection', false, i, true)[1] == 'layerSectionEnd') continue;
            if (subjectIds[id = lr.getProperty('layerID', false, i, true)]) continue;
            var color = lr.getProperty('color', false, i, true)[1];
            if (color != 'none') {
                if (!frameColors[color]) frameColors[color] = []
                frameColors[color].push(id)
            }
        }
    } else {
        frameColors[color = previousLayer.getProperty('color')[1]] = []
        frameColors[color].push(previousLayer.getProperty('layerID'))
    }
    for (var a in subjectColors) {
        if (frameColors[a]) {
            frames = frames.concat(frameColors[a])
        }
    }

    app.updateProgress(2, 4)

    for (var i = 0; i < frames.length; i++) {
        var frame = lr.descToObject(lr.getProperty('bounds', false, frames[i]))

        with (frame) {
            frame.height = bottom - top
            frame.width = right - left
            frame.center = { y: top + height / 2, x: left + width / 2 }
            frame.vertical = bottom - top > right - left
            frame.ratio = width / height
        }

        frame.color = lr.getProperty('color', false, frames[i])[1]
        frame.id = lr.getProperty('layerID', false, frames[i])
        frame.processed = false
        frames[i] = frame
    }

    frames.sort(function (a, b) { return a.ratio > b.ratio ? 1 : -1 })

    app.updateProgress(3, 4)

    var offset = doc.getProperty('hasBackgroundLayer') ? 1 : 0
    for (var i = 0; i < subjects.length; i++) {
        app.changeProgressText('Align layer: ' + lr.getProperty('name', false, subjects[i].id))
        for (var x = 0; x < frames.length; x++) {
            if (frames[x].processed) continue;
            if (frames[x].color != subjects[i].color) continue;

            doc.moveLayer(lr.getProperty('itemIndex', false, subjects[i].id) - offset, lr.getProperty('itemIndex', false, frames[x].id) >= lr.getProperty('count', false, frames[x].id) ? lr.getProperty('count', false, frames[x].id) - 1 : lr.getProperty('itemIndex', false, frames[x].id))

            lr.selectLayer(subjects[i].id)
            if (!lr.getProperty('group', false, subjects[i].id)) lr.groupCurrentLayer()
            alignLayer(subjects[i], frames[x])
            frames[x].processed = true
            break;
        }
    }

}

function alignLayer(subject, frame) {
    var dH = frame.center.x - subject.center.x,
        dV = frame.center.y - subject.center.y,
        sW = frame.width / subject.width * 100,
        sH = frame.height / subject.height * 100,
        scale = sW > sH ? sW : sH

    lr.transform(dH, dV, scale, subject.center.x, subject.center.y)
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

    this.descToObject = function (d) {
        var o = {}
        for (var i = 0; i < d.count; i++) {
            var k = d.getKey(i)
            o[t2s(k)] = getDescValue(d, k)
        }
        return o
    }

    this.selectLayer = function (id, add) {
        add = (add == undefined) ? add = false : add;
        (r = new ActionReference()).putIdentifier(s2t('layer'), id);
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        if (add) { d.putEnumerated(s2t('selectionModifier'), s2t('selectionModifierType'), s2t('addToSelection')) }
        d.putBoolean(s2t('makeVisible'), false)
        executeAction(s2t('select'), d, DialogModes.NO)
    }

    this.moveLayer = function (from, to) {
        (r = new ActionReference()).putIndex(s2t('layer'), from);
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        (r1 = new ActionReference()).putIndex(s2t('layer'), to);
        d.putReference(s2t('to'), r1);
        executeAction(s2t('move'), d, DialogModes.NO);
    }

    this.groupCurrentLayer = function () {
        (r = new ActionReference()).putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        executeAction(s2t('groupEvent'), d, DialogModes.NO);
    }

    this.transform = function (dX, dY, scale, x, y) {
        (r = new ActionReference()).putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        d.putEnumerated(s2t('freeTransformCenterState'), s2t('quadCenterState'), s2t('QCSIndependent'));
        ((d1 = new ActionDescriptor())).putUnitDouble(s2t('horizontal'), s2t('pixelsUnit'), x);
        d1.putUnitDouble(s2t('vertical'), s2t('pixelsUnit'), y);
        d.putObject(s2t('position'), s2t('paint'), d1);
        (d2 = new ActionDescriptor()).putUnitDouble(s2t('horizontal'), s2t('pixelsUnit'), dX);
        d2.putUnitDouble(s2t('vertical'), s2t('pixelsUnit'), dY);
        d.putObject(s2t('offset'), s2t('offset'), d2);
        d.putUnitDouble(s2t('width'), s2t('percentUnit'), scale);
        d.putUnitDouble(s2t('height'), s2t('percentUnit'), scale);
        d.putEnumerated(s2t('interfaceIconFrameDimmed'), s2t('interpolationType'), s2t('bicubic'));
        executeAction(s2t('transform'), d, DialogModes.NO);
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