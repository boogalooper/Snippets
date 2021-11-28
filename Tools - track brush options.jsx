/**  Photoshop Tool Preset Parameters via Script
 * https://community.adobe.com/t5/photoshop/photoshop-tool-preset-parameters-via-script/m-p/11847219
*/
#target photoshop

var t2s = typeIDToStringID,
    s2t = stringIDToTypeID,
    evt = null,
    tgt = null;

var trackTools = {
    spotHealingBrushTool: true,
    magicStampTool: true,
    paintbrushTool: true,
    pencilTool: true,
    colorReplacementBrushTool: true,
    wetBrushTool: true,
    cloneStampTool: true,
    patternStampTool: true,
    historyBrushTool: true,
    artBrushTool: true,
    eraserTool: true,
    backgroundEraserTool: true,
    blurTool: true,
    sharpenTool: true,
    smudgeTool: true,
    dodgeTool: true,
    burnInTool: true,
    saturationTool: true
};

try { tgt = arguments[0], evt = t2s(arguments[1]) } catch (e) { };

try {
    if (evt) {
        switch (evt) {
            case 'toolModalStateChanged':
                if (t2s(tgt.getEnumerationValue(s2t('kind'))) == 'paint') {
                    if (tool = getCurrentToolOptions())
                        if (trackTools[tool.toolName]) app.putCustomOptions(tool.toolName, tool.brush, false)
                }
                break;
            case 'select':
                if (tool = getCurrentToolOptions()) {
                    try { var tracked = app.getCustomOptions(tool.toolName) } catch (e) { }
                    if (tracked) {
                        tool.brush.putUnitDouble(s2t('diameter'), s2t('pixelsUnit'), tracked.getUnitDoubleValue(s2t('diameter')));
                        tool.brush.putUnitDouble(s2t('hardness'), s2t('percentUnit'), tracked.getUnitDoubleValue(s2t('hardness')));
                        tool.options.putObject(s2t('brush'), s2t('computedBrush'), tool.brush);
                        (r = new ActionReference()).putClass(s2t(tool.toolName));
                        (d = new ActionDescriptor()).putReference(s2t('target'), r);
                        d.putObject(s2t('to'), s2t('target'), tool.options);
                        executeAction(s2t('set'), d, DialogModes.NO);
                    }
                }
                break;
        }
    } else {
        var ntf = new Notifiers,
            status = ntf.checkNotifier();
        if (status) ntf.delNotifier(); else ntf.addNotifier();
        alert('Brush tracking ' + (status ? 'disabled' : 'enabled') + '!\nRun "' + decodeURI(File($.fileName).name) + '" again to ' + (status ? 'enable' : 'disable') + ' it')
    }
} catch (e) { }

function getCurrentToolOptions() {
    (r = new ActionReference()).putProperty(s2t('property'), p = s2t('tool'));
    r.putEnumerated(s2t('application'), s2t('ordinal'), s2t('targetEnum'));
    var d = executeActionGet(r),
        o = d.getObjectValue(s2t('currentToolOptions'));

    if (o.hasKey(s2t('brush'))) {
        return {
            toolName: t2s(d.getEnumerationType(s2t('tool'))),
            options: o,
            brush: o.getObjectValue(s2t('brush'))
        }
    } else return null

}

function Notifiers() {
    this.addNotifier = function () {
        app.notifiersEnabled = true
        var handlerFile = File($.fileName)
        app.notifiers.add('toolModalStateChanged', handlerFile)
        app.notifiers.add('select', handlerFile, 'toolPreset')
    }

    this.delNotifier = function () {
        var handlerFile = File($.fileName).name,
            len = app.notifiers.length;
        for (var i = 0; i < len; i++) {
            if (app.notifiers[i].eventFile.name == handlerFile) {
                app.notifiers[i].remove(); i--; len--
            }
        }
    }

    this.checkNotifier = function () {
        var handlerFile = File($.fileName).name,
            len = app.notifiers.length;
        for (var i = 0; i < len; i++) {
            if (app.notifiers[i].eventFile.name == handlerFile) return true
        }
        return false
    }
}
