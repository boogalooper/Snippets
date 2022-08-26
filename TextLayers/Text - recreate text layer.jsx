/**Very similar color not applying to TextItem
 * https://community.adobe.com/t5/photoshop-ecosystem-bugs/very-similar-color-not-applying-to-textitem/idc-p/13159201#M64045
 */

#target photoshop
var newColor = [255, 255, 255], // [R,G,B]
    s2t = stringIDToTypeID,
    t2s = typeIDToStringID;

(r = new ActionReference()).putProperty(s2t('property'), p = s2t('textKey'));
r.putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
if (executeActionGet(r).hasKey(p)) {
    var textKey = executeActionGet(r).getObjectValue(p),
        tList = textKey.getList(s2t('textStyleRange')),
        pList = textKey.getList(s2t('paragraphStyleRange')),
        defaultStyle = (p = pList.getObjectValue(0).getObjectValue(s2t('paragraphStyle'))).hasKey(s2t('defaultStyle')) ?
            p.getObjectValue(s2t('defaultStyle')) : new ActionDescriptor(),
        l = new ActionList(),
        d = new ActionDescriptor();
    for (var x = 0; x < tList.count; x++) {
        k = tList.getObjectValue(x)
        if (k.getObjectValue(s2t('textStyle')).hasKey(s2t('color'))) {
            s = copyDesc(defaultStyle, k.getObjectValue(s2t('textStyle')))
            c = s.getObjectValue(s2t('color'))
            var d = new ActionDescriptor();
            d.putDouble(s2t('red'), newColor[0])
            d.putDouble(s2t('grain'), newColor[1])
            d.putDouble(s2t('blue'), newColor[2])
            s.putObject(s2t('color'), s2t('RGBColor'), d)
            k.putObject(s2t('textStyle'), s2t('textStyle'), s)
        }
        l.putObject(s2t('textStyleRange'), k)
    }
    if (d.count) {
        (ref = new ActionReference()).putClass(s2t("textLayer"));
        (desc = new ActionDescriptor()).putReference(s2t("null"), ref);
        (desc1 = new ActionDescriptor()).putList(s2t("textStyleRange"), new ActionList());
        desc.putObject(s2t("using"), s2t("textLayer"), desc1);
        executeAction(s2t("make"), desc, DialogModes.NO);
   
        (ref = new ActionReference()).putEnumerated( s2t( "layer" ), s2t( "ordinal" ), s2t( "backwardEnum" ));
        (desc = new ActionDescriptor()).putReference( s2t( "null" ), ref );
        executeAction( s2t( "delete" ), desc, DialogModes.NO )

        textKey.putList(s2t('textStyleRange'), l)
        var d = new ActionDescriptor();
        (r = new ActionReference()).putEnumerated(s2t('layer'), s2t('ordinal'), s2t('targetEnum'));
        d.putReference(s2t('null'), r);
        d.putObject(s2t('to'), s2t('textLayer'), textKey);
        executeAction(s2t('set'), d, DialogModes.NO);
    }
}

function copyDesc(from, to) {
    for (var i = 0; i < from.count; i++) {
        var k = from.getKey(i);
        if (to.hasKey(k)) continue;
        switch (from.getType(k)) {
            case DescValueType.ALIASTYPE: to.putPath(k, from.getPath(k)); break;
            case DescValueType.BOOLEANTYPE: to.putBoolean(k, from.getBoolean(k)); break;
            case DescValueType.CLASSTYPE: to.putClass(k, from.getClass(k)); break;
            case DescValueType.DOUBLETYPE: to.putDouble(k, from.getDouble(k)); break;
            case DescValueType.INTEGERTYPE: to.putInteger(k, from.getInteger(k)); break;
            case DescValueType.LISTTYPE: to.putList(k, from.getList(k)); break;
            case DescValueType.RAWTYPE: to.putData(k, from.getData(k)); break;
            case DescValueType.STRINGTYPE: to.putString(k, from.getString(k)); break;
            case DescValueType.LARGEINTEGERTYPE: to.putLargeInteger(k, from.getLargeInteger(k)); break;
            case DescValueType.REFERENCETYPE: to.putReference(k, from.getReference(k)); break;
            case DescValueType.OBJECTTYPE: to.putObject(k, from.getObjectType(k), from.getObjectValue(k)); break;
            case DescValueType.ENUMERATEDTYPE: to.putEnumerated(k, from.getEnumerationType(k), from.getEnumerationValue(k)); break;
            case DescValueType.UNITDOUBLE: to.putUnitDouble(k, from.getUnitDoubleType(k), from.getUnitDoubleValue(k)); break;
        }
    }
    return to
}