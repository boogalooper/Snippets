/**Can a script detect I'm in Full Screen Mode?
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/can-a-script-detect-i-m-in-full-screen-mode/m-p/13006281#M650666
 */

#target photoshop
s2t = stringIDToTypeID;

(r = new ActionReference()).putProperty(s2t('property'), p = s2t('documentArea'));
r.putEnumerated(s2t('application'), s2t('ordinal'), s2t('targetEnum'));
(d = new ActionDescriptor()).putObject(s2t('object'), s2t('object'), executeActionGet(r).getObjectValue(p));
eval('a = '+(executeAction(s2t('convertJSONdescriptor'), d).getString(s2t('json'))));

(r = new ActionReference()).putProperty(s2t('property'), p = s2t('panelList'));
r.putEnumerated(s2t('application'), s2t('ordinal'), s2t('targetEnum'));
(d = new ActionDescriptor()).putObject(s2t('object'), s2t('object'), executeActionGet(r));
eval('panels = '+(executeAction(s2t('convertJSONdescriptor'), d).getString(s2t('json'))));

var screens = $.screens
do b=screens.shift() while (!b.primary)

alert (a.top == b.top &&  a.left == b.left &&a.bottom >=b.bottom && a.right >= b.right 
&& !function () {for (var a in panels['panelList'])  if(panels['panelList'][a].visible || panels['panelList'][a].obscured) return true}() 
? 'fullScreen' : 'no fullScren')