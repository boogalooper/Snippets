/**create a copy of the document with the current name  */

#target photoshop
(r = new ActionReference()).putEnumerated(stringIDToTypeID("document"), stringIDToTypeID("ordinal"), stringIDToTypeID("targetEnum"));
(d = new ActionDescriptor()).putReference(stringIDToTypeID("null"), r);
d.putString(stringIDToTypeID("name"), activeDocument.name);
executeAction(stringIDToTypeID("duplicate"), d, DialogModes.NO);