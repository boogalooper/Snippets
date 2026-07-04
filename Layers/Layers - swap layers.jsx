#target photoshop
/*
// BEGIN__HARVEST_EXCEPTION_ZSTRING
<javascriptresource>
<name>Swap layers</name>
<category>User</category>
<enableinfo>true</enableinfo>
</javascriptresource>
// END__HARVEST_EXCEPTION_ZSTRING
*/
(function () {
    var s2t = stringIDToTypeID;
    var c2t = charIDToTypeID;
    var EPS = 0.001;
    var PASSES = 3;

    // contain — слой целиком помещается в старое место второго слоя.
    // cover — слой полностью перекрывает старое место второго слоя, возможен выход за края.
    var FIT_MODE = "contain";

    try {
        main();
    } catch (e) {
        alert("Swap layers error:\n\n" + e.message);
    }

    function main() {
        var ids = selectedLayerIDs();

        if (ids.length !== 2) {
            throw new Error("Выдели ровно два слоя.");
        }

        var A = snap(ids[0]);
        var B = snap(ids[1]);

        unlink(A.id);
        unlink(B.id);

        fit(A.id, B.frame);
        fit(B.id, A.frame);

        swapStack(A, B);

        setClip(A.id, B.clipped);
        setClip(B.id, A.clipped);

        unlink(A.id);
        unlink(B.id);

        link(A.id, remap(B.links, A.id, B.id));
        link(B.id, remap(A.links, A.id, B.id));

        selectID(A.id, false);
    }

    // ============================================================
    // Snapshot
    // ============================================================

    function snap(id) {
        var d = layerDesc(id);

        return {
            id: id,
            index: d.getInteger(s2t("itemIndex")),
            clipped: has(d, "group") ? d.getBoolean(s2t("group")) : false,
            links: layerLinks(d),
            frame: layerFrame(d)
        };
    }

    function layerFrame(d) {
        var q = smartObjectQuad(d);
        return q ? frameFromQuad(q) : frameFromBounds(readBounds(d));
    }

    // ============================================================
    // Geometry
    // ============================================================

    function fit(id, target) {
        for (var i = 0; i < PASSES; i++) {
            var cur = layerFrame(layerDesc(id));
            var useQuad = cur.quad && target.quad;

            var sx = useQuad ? target.qw / cur.qw : target.bounds.w / cur.bounds.w;
            var sy = useQuad ? target.qh / cur.qh : target.bounds.h / cur.bounds.h;

            // Важно: один общий коэффициент масштаба.
            // Так слой сохраняет свои исходные пропорции.
            var scale = uniformScale(sx, sy);
            var angle = useQuad ? normAngle(target.angle - cur.angle) : 0;

            var dx = target.cx - cur.cx;
            var dy = target.cy - cur.cy;

            if (
                Math.abs(scale - 1) < EPS &&
                Math.abs(angle) < EPS &&
                Math.abs(dx) < EPS &&
                Math.abs(dy) < EPS
            ) {
                break;
            }

            transform(id, scale * 100, scale * 100, angle, dx, dy);
        }

        // Финальное выравнивание по центру.
        var f = layerFrame(layerDesc(id));
        var fdx = target.cx - f.cx;
        var fdy = target.cy - f.cy;

        if (Math.abs(fdx) > EPS || Math.abs(fdy) > EPS) {
            transform(id, 100, 100, 0, fdx, fdy);
        }
    }

    function transform(id, w, h, angle, dx, dy) {
        selectID(id, false);

        var d = new ActionDescriptor();
        var r = new ActionReference();

        r.putEnumerated(s2t("layer"), s2t("ordinal"), s2t("targetEnum"));
        d.putReference(s2t("null"), r);

        d.putEnumerated(
            s2t("freeTransformCenterState"),
            s2t("quadCenterState"),
            s2t("QCSAverage")
        );

        var o = new ActionDescriptor();
        o.putUnitDouble(s2t("horizontal"), s2t("pixelsUnit"), dx);
        o.putUnitDouble(s2t("vertical"), s2t("pixelsUnit"), dy);
        d.putObject(s2t("offset"), s2t("offset"), o);

        d.putUnitDouble(s2t("width"), s2t("percentUnit"), w);
        d.putUnitDouble(s2t("height"), s2t("percentUnit"), h);

        if (Math.abs(angle) > EPS) {
            d.putUnitDouble(s2t("angle"), s2t("angleUnit"), angle);
        }

        // Дополнительно включаем linked, хотя w и h уже одинаковые.
        d.putBoolean(s2t("linked"), true);

        executeAction(s2t("transform"), d, DialogModes.NO);
    }

    // ============================================================
    // Stack
    // ============================================================

    function swapStack(A, B) {
        if (A.index === B.index) return;

        if (A.index < B.index) {
            moveToIndex(B.id, A.index);
            moveToIndex(A.id, B.index);
        } else {
            moveToIndex(A.id, B.index);
            moveToIndex(B.id, A.index);
        }
    }

    function moveToIndex(id, index) {
        var d = new ActionDescriptor();

        var from = new ActionReference();
        from.putIdentifier(s2t("layer"), id);
        d.putReference(s2t("null"), from);

        var to = new ActionReference();
        to.putIndex(s2t("layer"), index);
        d.putReference(s2t("to"), to);

        d.putBoolean(s2t("adjustment"), false);
        d.putInteger(s2t("version"), 5);

        executeAction(s2t("move"), d, DialogModes.NO);
    }

    // ============================================================
    // Clipping
    // ============================================================

    function setClip(id, value) {
        var d0 = layerDesc(id);
        var now = has(d0, "group") && d0.getBoolean(s2t("group"));
        if (now === value) return;

        selectID(id, false);

        var d = new ActionDescriptor();
        var r = new ActionReference();

        r.putEnumerated(s2t("layer"), s2t("ordinal"), s2t("targetEnum"));
        d.putReference(s2t("null"), r);

        try {
            executeAction(value ? s2t("groupEvent") : s2t("releaseClippingMask"), d, DialogModes.NO);
        } catch (e) {
            // Fallback для старых версий Photoshop.
            try {
                executeAction(value ? c2t("GrpL") : c2t("Ungr"), d, DialogModes.NO);
            } catch (e) {}
        }
    }

    // ============================================================
    // Links
    // ============================================================

    function layerLinks(d) {
        var out = [];

        if (!has(d, "linkedLayerIDs")) return out;

        var list = d.getList(s2t("linkedLayerIDs"));

        for (var i = 0; i < list.count; i++) {
            try {
                out.push(list.getReference(i).getIdentifier(s2t("layerID")));
            } catch (e) {
                try {
                    out.push(list.getInteger(i));
                } catch (e) {}
            }
        }

        return unique(out);
    }

    function unlink(id) {
        selectID(id, false);

        try {
            executeAction(s2t("unlinkSelectedLayers"), new ActionDescriptor(), DialogModes.NO);
        } catch (e) {
            try {
                executeAction(c2t("Unlk"), new ActionDescriptor(), DialogModes.NO);
            } catch (e) {}
        }
    }

    function link(id, ids) {
        ids = existing(unique(ids), id);
        if (!ids.length) return;

        selectIDs([id].concat(ids));

        try {
            executeAction(s2t("linkSelectedLayers"), new ActionDescriptor(), DialogModes.NO);
        } catch (e) {
            try {
                executeAction(c2t("Lnk "), new ActionDescriptor(), DialogModes.NO);
            } catch (e) {}
        }
    }

    function remap(ids, a, b) {
        var out = [];

        for (var i = 0; i < ids.length; i++) {
            out.push(ids[i] === a ? b : ids[i] === b ? a : ids[i]);
        }

        return out;
    }

    // ============================================================
    // Bounds / Smart Object quad
    // ============================================================

    function readBounds(d) {
        var b = d.getObjectValue(
            has(d, "boundsNoEffects") ? s2t("boundsNoEffects") : s2t("bounds")
        );

        var l = unit(b, "left");
        var t = unit(b, "top");
        var r = unit(b, "right");
        var bt = unit(b, "bottom");

        return {
            left: l,
            top: t,
            right: r,
            bottom: bt,
            w: r - l,
            h: bt - t
        };
    }

    function smartObjectQuad(d) {
        if (!has(d, "smartObjectMore")) return null;

        try {
            var so = d.getObjectValue(s2t("smartObjectMore"));
            if (!so.hasKey(s2t("transform"))) return null;

            var list = so.getList(s2t("transform"));
            if (list.count < 8) return null;

            return [
                { x: num(list, 0), y: num(list, 1) },
                { x: num(list, 2), y: num(list, 3) },
                { x: num(list, 4), y: num(list, 5) },
                { x: num(list, 6), y: num(list, 7) }
            ];
        } catch (e) {
            return null;
        }
    }

    function frameFromBounds(b) {
        return {
            bounds: b,
            quad: null,
            cx: (b.left + b.right) / 2,
            cy: (b.top + b.bottom) / 2,
            qw: b.w,
            qh: b.h,
            angle: 0
        };
    }

    function frameFromQuad(q) {
        var b = quadBounds(q);

        return {
            bounds: b,
            quad: q,
            cx: (q[0].x + q[1].x + q[2].x + q[3].x) / 4,
            cy: (q[0].y + q[1].y + q[2].y + q[3].y) / 4,
            qw: dist(q[0], q[1]),
            qh: dist(q[1], q[2]),
            angle: deg(Math.atan2(q[1].y - q[0].y, q[1].x - q[0].x))
        };
    }

    function quadBounds(q) {
        var l = q[0].x;
        var r = q[0].x;
        var t = q[0].y;
        var b = q[0].y;

        for (var i = 1; i < 4; i++) {
            l = Math.min(l, q[i].x);
            r = Math.max(r, q[i].x);
            t = Math.min(t, q[i].y);
            b = Math.max(b, q[i].y);
        }

        return {
            left: l,
            top: t,
            right: r,
            bottom: b,
            w: r - l,
            h: b - t
        };
    }

    // ============================================================
    // Selection
    // ============================================================

    function selectedLayerIDs() {
        var ids = [];

        var r = new ActionReference();
        r.putProperty(s2t("property"), s2t("targetLayersIDs"));
        r.putEnumerated(s2t("document"), s2t("ordinal"), s2t("targetEnum"));

        var d = executeActionGet(r);
        var list = d.getList(s2t("targetLayersIDs"));

        for (var i = 0; i < list.count; i++) {
            ids.push(list.getReference(i).getIdentifier(s2t("layerID")));
        }

        return ids;
    }

    function selectID(id, add) {
        var d = new ActionDescriptor();
        var r = new ActionReference();

        r.putIdentifier(s2t("layer"), id);
        d.putReference(s2t("null"), r);

        if (add) {
            d.putEnumerated(
                s2t("selectionModifier"),
                s2t("selectionModifierType"),
                s2t("addToSelection")
            );
        }

        d.putBoolean(s2t("makeVisible"), false);
        executeAction(s2t("select"), d, DialogModes.NO);
    }

    function selectIDs(ids) {
        ids = existing(unique(ids), null);
        if (!ids.length) return;

        selectID(ids[0], false);

        for (var i = 1; i < ids.length; i++) {
            selectID(ids[i], true);
        }
    }

    // ============================================================
    // Low-level helpers
    // ============================================================

    function layerDesc(id) {
        var r = new ActionReference();
        r.putIdentifier(s2t("layer"), id);
        return executeActionGet(r);
    }

    function has(d, key) {
        return d.hasKey(s2t(key));
    }

    function unit(d, key) {
        return d.getUnitDoubleValue(s2t(key));
    }

    function num(list, i) {
        try {
            return list.getDouble(i);
        } catch (e) {
            try {
                return list.getUnitDoubleValue(i);
            } catch (e) {
                return list.getInteger(i);
            }
        }
    }

    function exists(id) {
        try {
            layerDesc(id);
            return true;
        } catch (e) {
            return false;
        }
    }

    function existing(ids, exclude) {
        var out = [];

        for (var i = 0; i < ids.length; i++) {
            if (ids[i] !== exclude && exists(ids[i])) {
                out.push(ids[i]);
            }
        }

        return out;
    }

    function unique(ids) {
        var out = [];
        var seen = {};

        for (var i = 0; i < ids.length; i++) {
            var id = Number(ids[i]);

            if (!id || seen[id]) continue;

            seen[id] = true;
            out.push(id);
        }

        return out;
    }


    function uniformScale(sx, sy) {
        if (FIT_MODE === "cover") {
            return Math.max(sx, sy);
        }

        return Math.min(sx, sy);
    }

    function dist(a, b) {
        var x = b.x - a.x;
        var y = b.y - a.y;
        return Math.sqrt(x * x + y * y);
    }

    function deg(rad) {
        return rad * 180 / Math.PI;
    }

    function normAngle(a) {
        while (a > 180) a -= 360;
        while (a < -180) a += 360;
        return a;
    }
})();
