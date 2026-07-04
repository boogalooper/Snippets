/*
<javascriptresource>
<category>User</category>
<enableinfo>true</enableinfo>
</javascriptresource>
*/
#target photoshop
try{
(r = new ActionReference()).putName(stringIDToTypeID('adjustmentLayer'), 'enhance');
(d = new ActionDescriptor()).putReference(stringIDToTypeID('target'), r);
executeAction(stringIDToTypeID('hide'), d, DialogModes.NO);} catch (e) {}