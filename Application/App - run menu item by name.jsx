/**Run menu item by name */
#target photoshop
s2t = stringIDToTypeID;
(r = new ActionReference()).putEnumerated(s2t('menuItemClass'), s2t('menuItemType'), s2t("matchRotation"));
(d = new ActionDescriptor()).putReference(s2t('null'), r);
executeAction(s2t('select'), d, DialogModes.NO);

