#target photoshop

f = $.os.indexOf('Windows') != -1 ? new File(app.path + '/Required/UIColors.txt') : new File(app.path.getFiles('*.app')[0] + '/Contents/Required/UIColors.txt')
if (!f.exists) f = File.openDialog('Select your UIColors.txt', '*.txt,*.cel', false)
if (f) {
  var s = '('
  f.open('r')
  while (!f.eof) { s += f.readln() }
  f.close()
  s = s.replace(/00\./g, '0.') + ')'
  var isHex = s.indexOf('0x') != -1 ? true : false
  try { var obj = eval(s) } catch (e) { alert(e, decodeURI(f.name), true) }

  if (obj) {
    if (isHex) HexColor(obj)

    var w = new Window('dialog', 'UIColors'),
      gt = w.add('group {alignment : ["fill", "center"], alignChildren : ["left", "fill"]}'),
      st = gt.add('statictext {text : "filter:"}'),
      e = gt.add('edittext {preferredSize: [310,-1]}'),
      gc = w.add('group'),
      p = gc.add('panel {maximumSize: [355, 400], minimumSize: [355, 400]}'),
      s = gc.add('scrollbar {stepdelta: 100}', [0, 0, 20, 400]),
      g = p.add('group{orientation : "column"}'),
      gh = w.add('group {alignment : ["fill", "center"], alignChildren : ["left", "fill"], orientation : "row"}'),
      c = gh.add('checkbox', [0,0,200,20], 'one element color for all themes'),
      r = gh.add('button', [0,0,145,20], 'random colors'),
      b = w.add('button', undefined, 'Save UIColors.txt', { name: 'ok' });

    w.filter = null
    w.changeAll = false

    e.onChanging = function () {
      w.filter = this.text.toUpperCase()
      for (var i = g.children.length - 1; i >= 0; i--) { g.remove(g.children[0]) }
      loadLabels()
    }

    s.onChanging = function () { g.location.y = -100 * this.value }
    c.onClick = function () { w.changeAll = this.value }

    r.onClick = function () {
      for (a in obj.Colors) {
        if (a.toUpperCase().indexOf(w.filter) != -1 || !w.filter) {
          var rnd = [Math.random(), Math.random(), Math.random()]
          for (var i = 0; i < 4; i++) {
            for (var x = 0; x < 3; x++) {
              obj.Colors[a][i][x] = w.changeAll ? rnd[x] * 255 : Math.random() * 255
            }
          }
        }
      }
      w.layout.layout(true)
    }

    b.onClick = function () {
      var ext = isHex ? 'cel' : 'txt',
        n = f.saveDlg('Save file', '*.' + ext);
      if (n) {
        if (n.exists) {
          var b = new File(n.path + '/UIColors.bak')
          if (!b.exists) n.copy(b)
        }
        if (n.open('w')) {
          w.close()
          if (isHex) HexColor(obj, true)
          var s = obj.toSource()
          n.write(s.substr(1, s.length - 2))
          n.close()
        } else { alert(decodeURI(n) + '\nFile access error\nMake sure you have the required access rights') }
      }
    }

    w.onShow = function () {
      loadLabels()
    }

    w.show()

    function loadLabels() {
      for (a in obj.Colors) {
        if (a.toUpperCase().indexOf(w.filter) != -1 || !w.filter) {
          colorGroup(g, a, [obj.Colors[a][0], obj.Colors[a][1], obj.Colors[a][2], obj.Colors[a][3]])
        }
      }
      w.layout.layout(true)
      s.value = s.minvalue = 0
      s.maxvalue = (g.size.height - p.size.height + 15) / 100
    }

    function colorGroup(parent, cpt, col) {
      var g = parent.add('group{orientation : "row", alignChildren : ["left", "center"]}'),
        s = g.add('statictext', undefined, cpt);
      s.preferredSize.width = 200

      for (var i = 0; i < 4; i++) { addColor(g, col[i], cpt, i) }

      function addColor(parent, col, cpt, idx) {
        var img = parent.add('image {preferredSize : [20,20]}')

        img.onDraw = function () {
          var g = this.graphics
          g.ellipsePath(2, 2, 15, 15)
          g.fillPath(g.newBrush(g.BrushType.SOLID_COLOR, [col[0] / 255, col[1] / 255, col[2] / 255, col[3]]))
          g.strokePath(g.newPen(g.PenType.SOLID_COLOR, [0, 0, 0], 2))
        }

        img.onClick = function () {
          var a = new SolidColor
          a.rgb.red = col[0]
          a.rgb.green = col[1]
          a.rgb.blue = col[2]
          app.foregroundColor = a
          if (app.showColorPicker()) {
            var a = app.foregroundColor,
              from = w.changeAll ? 0 : idx,
              to = w.changeAll ? 3 : idx;
            for (var i = from; i <= to; i++) {
              obj.Colors[cpt][i][0] = col[0] = a.rgb.red
              obj.Colors[cpt][i][1] = col[1] = a.rgb.green
              obj.Colors[cpt][i][2] = col[2] = a.rgb.blue
              parent.visible = false
              parent.visible = true
            }
          }
        }
      }
    }

    function HexColor(obj, backwardMode) {
      for (a in obj.Colors) {
        for (var i = 0; i < 4; i++) {
          for (var x = 0; x < 3; x++) {
            obj.Colors[a][i][x] = backwardMode ? '0x' + ((obj.Colors[a][i][x] / 255 * 65535) + Math.pow(16, 4)).toString(16).substr(-4) : obj.Colors[a][i][x] / 65535 * 255
          }
        }
      }
    }
  }
} else { alert(decodeURI(f.name) + ' format is wrong!') }