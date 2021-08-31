#target photoshop
var f = new File('e:/_output/testfile.tif'),
    compression = { 1: 'uncompressed', 2: 'CCITT', 5: 'LZW', 7: 'JPEG', 8: 'ZIP' }

ExternalObject.AdobeXMPScript = new ExternalObject('lib:AdobeXMPScript')
xmpMeta = new XMPFile(f.fsName, XMPConst.FILE_TIFF, XMPConst.OPEN_FOR_READ).getXMP()

alert(compression[xmpMeta.getProperty(XMPConst.NS_TIFF, 'Compression')])

#target photoshop
var compression = { 1: 'uncompressed', 2: 'CCITT', 5: 'LZW', 7: 'JPEG', 8: 'ZIP' }

ExternalObject.AdobeXMPScript = new ExternalObject('lib:AdobeXMPScript')
xmpMeta = new XMPMeta(app.activeDocument.xmpMetadata.rawData)

alert(compression[xmpMeta.getProperty(XMPConst.NS_TIFF, 'Compression')])

