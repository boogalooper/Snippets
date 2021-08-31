#target photoshop
var bt = new BridgeTalk(),
    ph = BridgeTalk.getSpecifier('photoshop'),
    buildWindow = function () {
        var z = Window.find('palette', 'Toggle visiblity');
        if (z) {
            z.show();
            return;
        }

        var dialog = new Window("palette");
        dialog.text = "Toggle visiblity";

        dialog.orientation = "column";
        dialog.alignChildren = ["center", "center"];
        dialog.spacing = 10;
        dialog.margins = 16;
        var panel = dialog.add('panel', undefined, 'Panel');
        var toggleButton = panel.add('button', undefined, 'Toggle', {
            name: 'Toggle'
        });

        toggleButton.onClick = function () {
            app.activeDocument.activeLayer.visible = !app.activeDocument.activeLayer.visible;
        };

        var exitButton = panel.add('button', undefined, 'Exit', {
            name: 'Exit'
        });

        exitButton.onClick = function () {
            dialog.close();
        }

        dialog.show();
    }
bt.target = ph;
bt.body = "var f=" + buildWindow.toSource() + ";f();";
bt.send();