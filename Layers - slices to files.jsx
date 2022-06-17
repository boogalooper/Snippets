/**Divide my image to layers
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/divide-my-image-to-layers/m-p/12467520
 */
#target photoshop
var s2t = stringIDToTypeID,
    AR = ActionReference,
    AD = ActionDescriptor;

try {
    try {
        (r = new AR).putProperty(s2t('property'), p = s2t('layerID'));
        r.putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
        var id = executeActionGet(r).getInteger(p);
    }
    catch (e) { throw "No layer selected!\nOpen the document and select layer" }

    try {
        (r = new AR).putProperty(s2t('property'), p = s2t('slices'));
        r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
        var slices = executeActionGet(r).getObjectValue(p).getList(p);
    }
    catch (e) { throw "This version of photoshop does not have access to slices" }

    (r = new AR).putProperty(s2t('property'), p = s2t('resolution'));
    r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
    var res = executeActionGet(r).getDouble(p);

    (r = new AR).putProperty(s2t('property'), p = s2t('title'));
    r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
    var nm = executeActionGet(r).getString(p).replace(/\..+$/, '');

    try {
        (r = new AR).putProperty(s2t('property'), p = s2t('fileReference'));
        r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
        var pth = executeActionGet(r).getPath(p);
    }
    catch (e) { throw "File not saved!" }

    for (var i = 0; i < slices.count - 1; i++) {
        (r = new AR).putIdentifier(s2t('layer'), id);
        (d = new AD).putReference(s2t('target'), r);
        executeAction(s2t('select'), d, DialogModes.NO);

        (r = new AR).putProperty(s2t('channel'), s2t('selection'));
        (d = new AD).putReference(s2t('target'), r);
        d.putObject(s2t('to'), s2t('rectangle'),
            function (b, d) {
                for (var i = 0; i < b.count; i++)
                    d.putUnitDouble(k = (b.getKey(i)), s2t('pixelsUnit'), b.getInteger(k))
                return d;
            }(slices.getObjectValue(i).getObjectValue(s2t('bounds')), new AD)
        );
        executeAction(s2t('set'), d, DialogModes.NO);

        try {
            (d = new AD).putString(s2t("copyHint"), "pixels");
            executeAction(s2t("copyEvent"), d, DialogModes.NO);

            (d = new AD).putClass(s2t("mode"), s2t("RGBColorMode"));
            d.putUnitDouble(s2t("width"), s2t("distanceUnit"), 1 * 72 / res);
            d.putUnitDouble(s2t("height"), s2t("distanceUnit"), 1 * 72 / res);
            d.putUnitDouble(s2t("resolution"), s2t("densityUnit"), res);
            d.putEnumerated(s2t("fill"), s2t("fill"), s2t("white"));
            d.putInteger(s2t("depth"), 8);
            d.putString(s2t("profile"), "sRGB IEC61966-2.1");
            (d1 = new AD).putObject(s2t("new"), s2t("document"), d);
            executeAction(s2t("make"), d1, DialogModes.NO);

            (d = new AD).putEnumerated(s2t("antiAlias"), s2t("antiAliasType"), s2t("antiAliasNone"));
            d.putClass(s2t("as"), s2t("pixel"));
            executeAction(s2t("paste"), d, DialogModes.NO);

            executeAction(s2t("revealAll"), new AD, DialogModes.NO);
            executeAction(s2t("flattenImage"), undefined, DialogModes.NO);

            (d = new AD).putObject(s2t("as"), s2t("JPEG"), new AD);//photoshop35Format
            d.putPath(s2t("in"), File(pth.path + '/' + nm + ' ' + ('0' + i).slice(-2) + '.jpg'));
        //    d.putEnumerated(s2t("saveStage"), s2t("saveStageType"), s2t("saveBegin"));
            executeAction(s2t("save"), d, DialogModes.NO);

            executeAction(s2t("close"), new AD, DialogModes.NO);

            (r = new AR).putProperty(s2t('channel'), s2t('selection'));
            (d = new AD).putReference(s2t('null'), r);
            d.putEnumerated(s2t('to'), s2t('ordinal'), s2t('none'));
            executeAction(s2t('set'), d, DialogModes.NO);
        }
        catch (e) { throw e + "\nScript cannot create layer from empty space!\nMake sure that current layer contains pixels in all slices." }
    }
} catch (e) { alert(e) }