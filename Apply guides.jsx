#target photoshop
app.bringToFront();

if (!app.documents.length) {
    alert("Нет открытого документа");
    exit();
}

var doc = app.activeDocument;

var file = File.openDialog("Выбери файл с guides", "*.txt");
if (!file) exit();

file.open("r");
var content = file.read();
file.close();

var data;
try {
    data = eval(content);
} catch (e) {
    alert("Ошибка чтения файла");
    exit();
}

if (!(data instanceof Array)) {
    alert("Неверный формат данных");
    exit();
}

var oldUnits = app.preferences.rulerUnits;
app.preferences.rulerUnits = Units.PIXELS;

// удалить все guides
while (doc.guides.length > 0) {
    doc.guides[0].remove();
}

// создать новые guides
for (var i = 0; i < data.length; i++) {
    var g = data[i];
    var dir = g.o === "h" ? Direction.HORIZONTAL : Direction.VERTICAL;
    doc.guides.add(dir, g.p);
}

app.preferences.rulerUnits = oldUnits;

alert("Guides загружены");
