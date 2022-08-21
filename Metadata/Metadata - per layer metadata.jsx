/** How to tag or embed data in a layer [scripting]
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/how-to-tag-or-embed-data-in-a-layer-scripting/m-p/13135261#M664684
 */

//load external library
if (ExternalObject.AdobeXMPScript == undefined) ExternalObject.AdobeXMPScript = new ExternalObject('lib:AdobeXMPScript')
// set custom namespace properties
const myCustomNamespace = 'layerMetadata',
   myCustomPrefix = 'EmbedData:',
   myProperty = 'label';
//write metadata in active layer  
try { xmpMeta = new XMPMeta(app.activeDocument.activeLayer.xmpMetadata.rawData) } catch (e) { xmpMeta = new XMPMeta() }
XMPMeta.registerNamespace(myCustomNamespace, myCustomPrefix);
xmpMeta.setProperty(myCustomNamespace, myProperty, 'few hundred bytes of related data')
app.activeDocument.activeLayer.xmpMetadata.rawData = xmpMeta.serialize()
//get metadata from active layer
try {
   xmpMeta = new XMPMeta(app.activeDocument.activeLayer.xmpMetadata.rawData)
   if (xmpMeta.doesPropertyExist(myCustomNamespace, myProperty)) alert(xmpMeta.getProperty(myCustomNamespace, myProperty).value)
} catch (e) { alert(e) }