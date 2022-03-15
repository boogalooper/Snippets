/**Get JSON property of layers
 * @r-bin
 */
var r = new ActionReference();
var d = new ActionDescriptor();

r.putProperty(stringIDToTypeID("property"), stringIDToTypeID("json"));
r.putEnumerated(stringIDToTypeID("layer"), stringIDToTypeID("ordinal"), stringIDToTypeID("targetEnum"));
d.putReference(stringIDToTypeID("null"), r);

eval("var a="+executeAction(stringIDToTypeID("get"), d, DialogModes.NO).getString(stringIDToTypeID("json")));

if (json.layers[0].blendOptions) alert(json.layers[0].blendOptions.toSource());
else alert ("standard");