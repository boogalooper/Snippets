var w = new Window("dialog"),
    slider = w.add("slider {minvalue:0, maxvalue:100, value:50, preferredSize:[500,-1] }");
slider.onChanging = function () { w.text = this.value }
slider.addEventListener('keydown', function () { slider.onChanging() })
w.show();