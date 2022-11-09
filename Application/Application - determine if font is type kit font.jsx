/**
 * Determine if font is type kit font
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/determine-if-font-is-type-kit-font/td-p/13318966
 */

var f = new File(Folder.userData + '/Adobe/CoreSync/plugins/livetype/c/entitlements.xml');
if (f.exists) {
    f.open('r')
    var xmlStr = f.read();
    f.close();
    if (xmlStr.length) {
        var contentXML = new XML(xmlStr),
            typeKitFonts = new XML(contentXML.fonts),
            i = 0, s = [];
        while (typeKitFonts.font[i]) s.push(typeKitFonts.font[i++].properties.fullName);
        $.writeln(s.join('\n'));
    }
}