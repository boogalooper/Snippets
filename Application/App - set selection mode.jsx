#target photoshop
/*
// BEGIN__HARVEST_EXCEPTION_ZSTRING
<javascriptresource>
<name>Set selection mode</name>
<category>User</category>
<eventid>f17a82e6-8792-4bb8-9d6f-f96c0e3794e7</eventid>
<terminology><![CDATA[<< /Version 1
                       /Events <<
                       /f17a82e6-8792-4bb8-9d6f-f96c0e3794e7 [(Set selection mode) <<
                       /mode [(Mode) /string]
                       >>]
                        >>
                     >> ]]></terminology>
</javascriptresource>
// END__HARVEST_EXCEPTION_ZSTRING
*/

var s2t = stringIDToTypeID,
    t2s = typeIDToStringID;

$.localize = true;

var GUID = "f17a82e6-8792-4bb8-9d6f-f96c0e3794e7",
    cfg = new Config(),
    isCancelled = false;

main();
isCancelled ? 'cancel' : undefined;

function main() {
    if (!hasPlaybackParameters()) {
        getScriptSettings(cfg);
        cfg.mode = getCurrentMode();
		
        var w = buildWindow();
        var result = w.show();
        if (result == 2) {
            isCancelled = true;
            return;
        }

        putScriptSettings(cfg, true);
        putScriptSettings(cfg);
        setCurrentMode(cfg.mode);
    } else {
        getScriptSettings(cfg, true);
        cfg.mode = normalizeMode(cfg.mode || getCurrentMode());

        if (app.playbackDisplayDialogs == DialogModes.ALL) {
            var w = buildWindow(true);
            var result = w.show();
            if (result == 2) {
                isCancelled = true;
                return;
            }

            putScriptSettings(cfg, true);
        }

        setCurrentMode(cfg.mode);
    }
}

function Config() {
    this.mode = "imageProcessingModeDevice";
}

function buildWindow(fromAction) {
    var w = new Window("dialog");
    w.text = localize('$$$/Menu/Prefs/SelectSubjectProcessing').replace(':', '');
    w.orientation = "column";
    w.alignChildren = ["fill", "top"];
    w.spacing = 10;
    w.margins = 16;

    var dl_array = [
        localize('$$$/Menu/Prefs/SelectSubjectMode/Device'),
        localize('$$$/Menu/Prefs/SelectSubjectMode/Cloud')
    ];

    var dl = w.add("dropdownlist", undefined, undefined, { items: dl_array });
    dl.selection = cfg.mode == "imageProcessingModeCloud" ? 1 : 0;
    dl.preferredSize.width = 250;
    dl.active = true;

    dl.onChange = function () {
        cfg.mode = this.selection.index ? "imageProcessingModeCloud" : "imageProcessingModeDevice";
    };

    var grBn = w.add("group");
    grBn.orientation = "row";
    grBn.alignChildren = ["center", "center"];
    grBn.alignment = "right";
    grBn.spacing = 10;

    var bnOk = grBn.add("button", undefined, undefined, { name: "ok" });
    bnOk.text = localize('$$$/ControlStrings/OK');

    var bnCancel = grBn.add("button", undefined, undefined, { name: "cancel" });
    bnCancel.text = localize('$$$/ControlStrings/Cancel');

    bnOk.onClick = function () {
        cfg.mode = dl.selection.index ? "imageProcessingModeCloud" : "imageProcessingModeDevice";
        w.close(1);
    };

    bnCancel.onClick = function () {
        w.close(2);
    };

    return w;
}

function hasPlaybackParameters() {
    try {
        return app.playbackParameters.count ? true : false;
    } catch (e) {
        return false;
    }
}

function getCurrentMode() {
    var r = new ActionReference();
    r.putProperty(s2t("property"), s2t("imageProcessingPrefs"));
    r.putEnumerated(s2t("application"), s2t("ordinal"), s2t("targetEnum"));

    try {
        return t2s(executeActionGet(r).getObjectValue(s2t("imageProcessingPrefs")).getEnumerationValue(s2t("imageProcessingSelectSubjectPrefs")));
    } catch (e) {
        return "imageProcessingModeDevice";
    }
}

function setCurrentMode(mode) {
    mode = normalizeMode(mode);

    var r = new ActionReference();
    r.putProperty(s2t("property"), s2t("imageProcessingPrefs"));
    r.putEnumerated(s2t("application"), s2t("ordinal"), s2t("targetEnum"));

    var d = new ActionDescriptor();
    d.putReference(s2t("null"), r);

    var d1 = new ActionDescriptor();
    d1.putEnumerated(
        s2t("imageProcessingSelectSubjectPrefs"),
        s2t("imageProcessingSelectSubjectPrefs"),
        s2t(mode)
    );
    d.putObject(s2t("to"), s2t("imageProcessingPrefs"), d1);

    executeAction(s2t("set"), d, DialogModes.NO);
}

function normalizeMode(mode) {
    return mode == "imageProcessingModeCloud" ? "imageProcessingModeCloud" : "imageProcessingModeDevice";
}

function getScriptSettings(settingsObj, fromAction) {
    var d;

    if (fromAction) {
        d = app.playbackParameters;
    } else {
        try {
            d = app.getCustomOptions(GUID);
        } catch (e) { }
    }

    if (d != undefined) descriptorToObject(settingsObj, d);

    function descriptorToObject(o, d) {
        var l = d.count;
        for (var i = 0; i < l; i++) {
            var k = d.getKey(i),
                t = d.getType(k),
                strk = t2s(k);

            switch (t) {
                case DescValueType.STRINGTYPE:
                    o[strk] = d.getString(k);
                    break;
                case DescValueType.BOOLEANTYPE:
                    o[strk] = d.getBoolean(k);
                    break;
                case DescValueType.INTEGERTYPE:
                    o[strk] = d.getInteger(k);
                    break;
                case DescValueType.DOUBLETYPE:
                    o[strk] = d.getDouble(k);
                    break;
            }
        }
    }
}

function putScriptSettings(settingsObj, toAction) {
    var d = objectToDescriptor(settingsObj);

    if (toAction) {
        app.playbackParameters = d;
    } else {
        app.putCustomOptions(GUID, d);
    }

    function objectToDescriptor(o) {
        var d = new ActionDescriptor(),
            l = o.reflect.properties.length;

        for (var i = 0; i < l; i++) {
            var k = o.reflect.properties[i].toString();
            if (k == "__proto__" || k == "__count__" || k == "__class__" || k == "reflect") continue;

            var v = o[k],
                id = s2t(k);

            switch (typeof v) {
                case "boolean":
                    d.putBoolean(id, v);
                    break;
                case "string":
                    d.putString(id, v);
                    break;
                case "number":
                    d.putInteger(id, v);
                    break;
            }
        }

        return d;
    }
}
