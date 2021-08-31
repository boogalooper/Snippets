/*
<javascriptresource>
<category>jazzy</category>
<enableinfo>true</enableinfo>
</javascriptresource>
*/

#target photoshop

activeDocument.suspendHistory('Remove layers', 'removeLayers()')

function removeLayers() {
    var doc = new AM('document'),
        lr = new AM('layer'),
        lrs = getLayersCollection(doc, lr);

    parseLayers(lrs, layers = [], canvas = [], locked = [], lr)

    if (layers.length) {
        if (!canvas.length) {
            var res = doc.getProperty('resolution')
            canvas = [{ top: 0, left: 0, right: doc.getProperty('width') * res / 72, bottom: doc.getProperty('height') * res / 72, }]
        }

        var layersToDelete = []
        do {
            var intersected = false,
                cur = layers.shift();
            for (var i = 0; i < canvas.length; i++) {
                if (intersect(cur.bounds, canvas[i]) && !(!cur.bounds.top && !cur.bounds.right && !cur.bounds.left && !cur.bounds.right)) { intersected = true; break; }
            }
            if (!intersected) layersToDelete.push(cur.id)
        } while (layers.length)

        if (layersToDelete.length) {
            doc.deleteLayers(layersToDelete)
            lrs = getLayersCollection(doc, lr)
            var groupsToDelete = []
            cleanupEmptyGroups(lrs, groupsToDelete)
            if (groupsToDelete.length) do { doc.deleteLayers([groupsToDelete.shift()]) } while (groupsToDelete.length)
        }

        if (locked.length) {
            do {
                var cur = locked.shift()
                try { lr.applyLocking(cur.id, cur.layerLocking) } catch (e) { }
            } while (locked.length)
        }
    }
}

function intersect(lrA, lrB) {
    return (lrB.right < lrA.left || lrB.left > lrA.right) || (lrB.top > lrA.bottom || lrB.bottom < lrA.top) ? false : true
}

function parseLayers(layersCollection, layers, canvas, locked, lr) {
    for (var i = 0; i < layersCollection.length; i++) {
        if (isLocked(layersCollection[i].layerLocking)) {
            locked.push({ layerLocking: layersCollection[i].layerLocking, id: layersCollection[i].id })
            lr.applyLocking(layersCollection[i].id,
                {
                    "protectAll": false,
                    "protectArtboardAutonest": false,
                    "protectComposite": false,
                    "protectPosition": false,
                    "protectTransparency": false
                })
        }

        if (layersCollection[i].artboardRect) {
            canvas.push(layersCollection[i].artboardRect)
        }

        if (layersCollection[i].layerKind == 7) {
            parseLayers(layersCollection[i], layers, canvas, locked, lr)
        } else {
            layers.push(layersCollection[i])
        }
    }
}

function cleanupEmptyGroups(layersCollection, toDelete) {
    var isEmpty = true
    for (var i = 0; i < layersCollection.length; i++) {
        if (layersCollection[i].layerKind == 7 && !layersCollection[i].artboardRect) {
            if (layersCollection[i].length) {
                if (cleanupEmptyGroups(layersCollection[i], toDelete) && layersCollection.id) toDelete.push(layersCollection.id) else isEmpty = false
            } else {
                toDelete.push(layersCollection[i].id)
            }
        } else isEmpty = false
    }
    return isEmpty
}

function getLayersCollection(document, layer) {
    var indexFrom = document.getProperty('hasBackgroundLayer') ? 0 : 1,
        indexTo = document.getProperty('numberOfLayers');

    return layersCollection(indexFrom, indexTo)

    function layersCollection(from, to, parentItem, group) {
        parentItem = parentItem ? parentItem : [];

        for (var i = from; i <= to; i++) {
            if (layer.getProperty('layerSection', i, true).value == 'layerSectionEnd') {
                i = layersCollection(i + 1, to, [], parentItem)
                continue;
            }

            var p = {};
            p.id = layer.getProperty('layerID', i, true)
            p.layerKind = layer.getProperty('layerKind', i, true)
            p.layerLocking = layer.descToObject(layer.getProperty('layerLocking', i, true).value)
            p.bounds = [layer.descToObject(layer.getProperty('bounds', i, true).value)]

            if (layer.hasProperty('boundsNoMask')) p.bounds.push(layer.descToObject(layer.getProperty('boundsNoMask', i, true).value))
            if (layer.hasProperty('boundsNoEffects')) p.bounds.push(layer.descToObject(layer.getProperty('boundsNoEffects', i, true).value))

            p.bounds = p.bounds.sort(function (a, b) { return (a.right - a.left) + (a.bottom - a.top) > (b.right - b.left) + (b.bottom - b.top) ? 1 : 0 }).shift();

            if (p.layerKind == 7 && layer.getProperty('artboardEnabled', i, true)) {
                p.artboardRect = layer.descToObject(layer.getProperty('artboard', i, true).value.getObjectValue(stringIDToTypeID('artboardRect')))
            }

            if (layer.getProperty('layerSection', i, true).value == 'layerSectionStart') {
                for (o in p) { parentItem[o] = p[o] }
                group.push(parentItem);
                return i;
            } else {
                parentItem.push(p)
            }
        }
        return parentItem
    }
}

function isLocked(locking) {
    for (var a in locking) {
        if (locking[a]) return true
    }
    return false
}

function AM(target, order) {
    var s2t = stringIDToTypeID,
        t2s = typeIDToStringID;

    target = target ? s2t(target) : null;

    this.getProperty = function (property, id, idxMode) {
        property = s2t(property);
        (r = new ActionReference()).putProperty(s2t('property'), property);
        id != undefined ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id)) :
            r.putEnumerated(target, s2t('ordinal'), order ? s2t(order) : s2t('targetEnum'));
        return getDescValue(executeActionGet(r), property)
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

    this.objectToDesc = function (o) {
        var d = new ActionDescriptor();
        for (var k in o) {
            var v = o[k];
            switch (typeof (v)) {
                case 'boolean': d.putBoolean(s2t(k), v); break;
                case 'string': d.putString(s2t(k), v); break;
                case 'number': d.putInteger(s2t(k), v); break;
            }
        }
        return d;
    }

    this.applyLocking = function (id, locking) {
        (r = new ActionReference()).putIdentifier(s2t('layer'), id);
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        d.putObject(s2t('layerLocking'), s2t('layerLocking'), this.objectToDesc(locking));
        executeAction(s2t('applyLocking'), d, DialogModes.NO);
    }

    this.selectLayers = function (list) {
        var r = new ActionReference();
        do { r.putIdentifier(s2t('layer'), list.shift()) } while (list.length);
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        executeAction(s2t('select'), d, DialogModes.NO);
    }

    this.deleteLayers = function (list) {
        var r = new ActionReference();
        do { r.putIdentifier(s2t('layer'), list.shift()) } while (list.length);
        (d = new ActionDescriptor()).putReference(s2t('null'), r);
        try { executeAction(s2t('delete'), d, DialogModes.NO) } catch (e) { }
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