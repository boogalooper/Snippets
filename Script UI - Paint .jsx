/**IDFN */
#target photoshop

var bt = new BridgeTalk(),
    ph = BridgeTalk.getSpecifier('photoshop'),
    f = ";f();",
    z = "(function fnctn(){w = new Window('palette', 'PREVIEW')\
            w.add('image', undefined, File('/e/_Output/Untitled-1-assets/Layer 1.png'))\
            w.show()})"
bt.target = ph;
bt.body = "var f=" + z + f;
bt.send();


var bt = new BridgeTalk(),
    ph = BridgeTalk.getSpecifier('photoshop'),
    f = ";f();",
    z = "(function fnctn(){wn = Window.find('palette', 'PREVIEW')\
do {$.sleep (100); try {wn.children[0].image = File('/e/_Output/Untitled-1-assets/Layer 1.png')} catch (e) {alert (e)}} while (true)\
})"
bt.target = ph;
bt.body = "var f=" + z + f;
bt.send();
