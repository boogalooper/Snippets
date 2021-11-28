/*https://feedback-readonly.photoshop.com/conversations/photoshop/ps-scripting-viewless-document-more-examples/5f5f45b94b561a3d425c0034
@Jaroslav Bereza
*/


const kaddLayerFromViewlessDocStr   = app.stringIDToTypeID("addLayerFromViewlessDoc");
const kaspectRatioStr         = app.stringIDToTypeID("aspectRatio");
const keyHeight            = app.charIDToTypeID('Hght');
const keyViewlessDoc      = app.stringIDToTypeID( "viewlessDoc" );
const keyWidth            = app.charIDToTypeID('Wdth');
const klayersStr             = app.stringIDToTypeID("layers");
const kflatnessStr             = app.stringIDToTypeID("flatness");
const kdocumentStr            = app.stringIDToTypeID("document");
const keyFileList          = app.stringIDToTypeID( "fileList" );
const kpreferXMPFromACRStr      = app.stringIDToTypeID("preferXMPFromACR");
const kcloseViewlessDocumentStr = app.stringIDToTypeID("closeViewlessDocument");
const kopenViewlessDocumentStr   = app.stringIDToTypeID("openViewlessDocument");
function ViewlessDocument( desc, pathname )
{
   this.height = new UnitValue( desc.getInteger( keyHeight ), "px" );
   this.width = new UnitValue( desc.getInteger( keyWidth ), "px" );
   this.pixelAspectRatio = desc.getDouble( kaspectRatioStr );
   this.layerCount = desc.getInteger( klayersStr );
   this.isSimple = desc.getBoolean( kflatnessStr );
   
   this.viewlessDocPtr = desc.getData( kdocumentStr );
   this.path = pathname;
   this.isOpen = true;
}
ViewlessDocument.prototype.addToActiveDocument = function()
{
   var i, fileListDesc = new ActionList();
   var ptrListDesc = new ActionList();
   
   fileListDesc.putPath( new File( this.path ) );
   ptrListDesc.putData( this.viewlessDocPtr );
   
   var desc = new ActionDescriptor();
   desc.putList( keyFileList, fileListDesc );
   desc.putList( keyViewlessDoc, ptrListDesc );
   executeAction( kaddLayerFromViewlessDocStr, desc, DialogModes.NO );
   this.isOpen = false; // Adding the layer closes the document
}
ViewlessDocument.prototype.close = function( options )
{
   if (this.isOpen)
   {
      var desc = new ActionDescriptor();
      desc.putData( kdocumentStr, this.viewlessDocPtr );
      executeAction( kcloseViewlessDocumentStr, desc );
      this.isOpen = false;
   }
}
function openViewlessDocument( pathname )
{
   var desc = new ActionDescriptor();
   desc.putBoolean( kpreferXMPFromACRStr, false );
   desc.putPath( app.charIDToTypeID('File'), new File( pathname ) );
   var result = executeAction( kopenViewlessDocumentStr, desc, DialogModes.NO );
   var psViewPtr = result.getData( kdocumentStr );
   if (psViewPtr.length == 0)
   {
      return null;
   }
   return new ViewlessDocument( result, pathname );
}
var fPSDoc = openViewlessDocument ("c://your//path//to//file.png");
fPSDoc.addToActiveDocument();
fPSDoc.close();