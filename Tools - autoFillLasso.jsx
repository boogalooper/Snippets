/**I am looking for a way to acive a very simple lasso fill tool
 * https://community.adobe.com/t5/photoshop/i-am-looking-for-a-way-to-acive-a-very-simple-lasso-fill-tool/m-p/11483066
 */
#target photoshop

var s2t = stringIDToTypeID,
    t2s = typeIDToStringID;

try { var target = t2s(arguments[1]) } catch (e) { }

try {
    if (target) {
        (r = new ActionReference()).putProperty(s2t('property'), p = s2t('tool'));
        r.putEnumerated(s2t('application'), s2t('ordinal'), s2t('targetEnum'));
        var tool = t2s(executeActionGet(r).getEnumerationType(s2t('tool')));
        if (tool == 'lassoTool') {
            switch (target) {
                case 'subtractFrom':
                    executeAction(s2t('delete'), undefined, DialogModes.NO);
                    break;
                default:
                    (d = new ActionDescriptor()).putEnumerated(s2t('using'), s2t('fillContents'), s2t('foregroundColor'));
                    d.putUnitDouble(s2t('opacity'), s2t('percentUnit'), 100);
                    d.putEnumerated(s2t('mode'), s2t('blendMode'), s2t('normal'));
                    executeAction(s2t('fill'), d, DialogModes.NO);
                    break;
            }
            (r = new ActionReference()).putProperty(s2t('channel'), s2t('selection'));
            (d = new ActionDescriptor()).putReference(s2t('null'), r);
            d.putEnumerated(s2t('to'), s2t('ordinal'), s2t('none'));
            executeAction(s2t('set'), d, DialogModes.NO);
        }
    } else {
        app.notifiersEnabled = true
        var f = File($.fileName)
        app.notifiers.add('setd', f, 'Chnl')
        app.notifiers.add('AddT', f, 'Chnl')
        app.notifiers.add('SbtF', f, 'Chnl')
    }
} catch (e) { alert(e) }