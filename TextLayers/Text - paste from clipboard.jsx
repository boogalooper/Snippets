/**
 * Paste text from clipboard to textItem
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/paste-text-from-clipboard-to-textitem/td-p/13486645
 */ 

var f = new File(Folder.temp + '/script.vbs'),
    s = 'Set o = CreateObject("htmlfile"):t = o.ParentWindow.ClipboardData.GetData("text"):f=CreateObject("WScript.Shell").ExpandEnvironmentStrings("%TEMP%") & "\\clipboard.txt":set c = CreateObject("Scripting.FileSystemObject").OpenTextFile(f, 2, True):c.WriteLine(t):c.Close';
f.open("w");
f.encoding = "TEXT";
f.write(s);
f.close()
f.execute()

$.sleep(500)
var c = new File(Folder.temp + '/clipboard.txt'),
    s = '';
if (c.exists) {
    c.open("r");
    s = c.read();
    c.close()
}
alert (s)
f.remove()
c.remove()

var layers = app.activeDocument.artLayers;
var layer = layers.add();
layer.kind = LayerKind.TEXT;
var textItem = layer.textItem;
textItem.kind = TextType.PARAGRAPHTEXT;
textItem.size = 30;
textItem.position = [10, 10];
textItem.contents = s