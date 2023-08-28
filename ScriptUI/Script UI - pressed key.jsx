/**show pressed key */
var s =[];
var l = ScriptUI.environment.keyboardState.reflect.properties.length

for (var i = 0; i < l; i++) {
    var k = ScriptUI.environment.keyboardState.reflect.properties[i].toString();
    if (k == "__proto__" || k == "__count__" || k == "__class__" || k == "reflect") continue;
    s.push(k + ':'+ ScriptUI.environment.keyboardState[k]);
}

alert (s.join('\n'))
