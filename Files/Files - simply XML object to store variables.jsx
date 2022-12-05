/**
 * How edit a running script and replace some variables
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/how-edit-a-running-script-and-replace-some-variables/td-p/13341402
 */

var RedFirst = 0,
    GreenFirst = 0,
    BlueFirst = 0,
    RedSecond = 1,
    GreenSecond = 1,
    BlueSecond = 1;

var myXML = new XML("<variables></variables>")
myXML.RedFirst = RedFirst;
myXML.GreenFirst = GreenFirst;
myXML.BlueFirst = BlueFirst;
myXML.RedSecond = RedSecond;
myXML.GreenSecond = GreenSecond;
myXML.BlueSecond = BlueSecond;

var XMLFile = File(Folder.desktop + "/config.xml");
XMLFile.encoding = "UTF8"
XMLFile.open('w');
XMLFile.write(myXML.toXMLString())
XMLFile.close();

var XMLFile = File(Folder.desktop + "/config.xml");
XMLFile.encoding = "UTF8"
XMLFile.open('r');
var myXML = new XML(XMLFile.read())
XMLFile.close();

$.writeln(myXML.RedFirst)
$.writeln(myXML.GreenFirst)
$.writeln(myXML.BlueFirst)
$.writeln(myXML.RedSecond)
$.writeln(myXML.GreenSecond)
$.writeln(myXML.BlueSecond)

