#target photoshop
s2t = stringIDToTypeID;
(r = new ActionReference()).putName(s2t('menuItemClass'), "Remove Background");
(d = new ActionDescriptor()).putReference(s2t('null'), r);
executeAction(s2t('select'), d, DialogModes.NO);