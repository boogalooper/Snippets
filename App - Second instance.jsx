/*
// BEGIN__HARVEST_EXCEPTION_ZSTRING
<javascriptresource>
<name>Run second instance of Photoshop</name>
<category>000</category>
</javascriptresource>
// END__HARVEST_EXCEPTION_ZSTRING
*/
// =
try{
var w = new Window("dialog", undefined, undefined, {resizeable: true}); 
    w.text = "Run second instance "; 
var dl = w.add("dropdownlist", undefined, undefined, {name: "dl"}); 
    dl.preferredSize.width = 200; 

var g = w.add("group", undefined, {name: "g"}); 
    g.orientation = "row"; 
    g.alignChildren = ["left","center"]; 

var ok = g.add("button", undefined, "Run", {name: "ok"}); 


g.add("button", undefined,  "Cancel", {name: "cancel"}); 


var b = {};
for (var i=6; i<25; i++ ) 
{
    var a =BridgeTalk.getDisplayName('photoshop-'+i*10);
    if (a)
    {
    b[a] = 'start "" "' + BridgeTalk.getAppPath('photoshop-'+i*10)+'" -Server'
    }
}

ok.onClick = function () {   
    fl = File(preferencesFolder + '/z.bat')
    fl.open("w");
    fl.encoding = "text";
    fl.writeln(b[dl.selection.text])
    w.close()
    fl.close()
    fl.execute()
    $.sleep(2000)
    }
w.onShow = function () {
    for (var a in b )  dl.add('item', a)
    if (dl.items.length) dl.selection = dl.find(BridgeTalk.getDisplayName("photoshop"))
    else dl.enabled = ok.enabled = false
   }

w.show();
} catch (e) {}

