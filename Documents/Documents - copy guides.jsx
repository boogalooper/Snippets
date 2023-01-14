/**
 * activeDocument array?
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/activedocument-array/td-p/13482837
 */

var startRulerUnits = preferences.rulerUnits,
  startTypeUnits = preferences.typeUnits,
  doc = activeDocument,
  activeDocumentW = doc.width.value,
  activeDocumentH = doc.height.value;
app.preferences.rulerUnits = Units.PIXELS
app.preferences.typeUnits = TypeUnits.PIXELS
if (doc.guides.length) {
  var guides = [];
  for (var i = 0; i < doc.guides.length; i++) {
    guides.push({ direction: doc.guides[i].direction, coordinate: doc.guides[i].coordinate })
  }
  var len = documents.length;
  for (var i = 0; i < len; i++) {
    var cur = documents[i];
    if (cur == doc) continue;
    activeDocument = cur;
    if (cur.width == activeDocumentW && cur.height == activeDocumentH && !cur.guides.length) {
      for (var x = 0; x < guides.length; x++) {
        cur.guides.add(guides[x].direction, guides[x].coordinate)
      }
    }
  }
}
activeDocument = doc;
app.preferences.rulerUnits = startRulerUnits
app.preferences.typeUnits = startTypeUnits