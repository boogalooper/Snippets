#target photoshop
app.bringToFront();

if (!app.documents.length) {
    alert("Нет открытого документа");
    exit();
}

var doc = app.activeDocument;
var guides = doc.guides;

if (guides.length === 0) {
    alert("В документе нет guides");
    exit();
}

var data = [];
var oldUnits = app.preferences.rulerUnits;
app.preferences.rulerUnits = Units.PIXELS;

for (var i = 0; i < guides.length; i++) {
    var g = guides[i];
    data.push({
        o: g.direction === Direction.HORIZONTAL ? "h" : "v",
        p: g.coordinate.value
    });
}

app.preferences.rulerUnits = oldUnits;

var file = File.saveDialog("Сохранить guides", "*.txt");
if (!file) exit();

file.open("w");
file.write(data.toSource());
file.close();

alert("Guides сохранены");
