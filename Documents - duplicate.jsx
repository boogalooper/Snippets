/*Создание копии текущего документа с использованием того же имени
* https://www.youtube.com/watch?v=D0sLd7B0bEY
*/

#target photoshop
(r = new ActionReference()).putEnumerated(stringIDToTypeID("document"), stringIDToTypeID("ordinal"), stringIDToTypeID("targetEnum"));
(d = new ActionDescriptor()).putReference(stringIDToTypeID("null"), r);
d.putString(stringIDToTypeID("name"), activeDocument.name);
executeAction(stringIDToTypeID("duplicate"), d, DialogModes.NO);