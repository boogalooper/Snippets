/**changing the current layer to the filename for all open documents  */
for (var i = 0; i < app.documents.length; i++) { app.activeDocument = (d = app.documents[i]); d.flatten(); d.activeLayer.name = removeExtension(d.name) }
function removeExtension(s) { return s.length - s.lastIndexOf(".") <= 5 ? s.slice(0, s.lastIndexOf(".")) : s }