/**https://community.adobe.com/t5/photoshop-ecosystem-discussions/script-copying-text-layers-contents-to-clipboard/td-p/12660715 */
lS = activeDocument.layerSets.getByName('Text')
tLs = [].slice.call(lS.artLayers), cntnts = []; while (tLs.length)
	cntnts.push(tLs.shift().textItem.contents); sTT = stringIDToTypeID;
(dsc = new ActionDescriptor()).putString(sTT('textData'), cntnts.join(' '))
executeAction(sTT('textToClipboard'), dsc)