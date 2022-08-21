/** Scattered Letters. Need help with algorithm
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/scattered-letters-need-help-with-algorithm/m-p/13058966#M656576
 * by c.pfaffenbichler
 */

// create shape layer for each letter in a type layer;
// just for rgb;
// 2022, use it at your own risk;
if (app.documents.length > 0) {
    var myDocument = app.activeDocument;
    var theLayer = myDocument.activeLayer;
    // check if active layer is type layer;
    if (theLayer.kind == LayerKind.TEXT) {
        app.togglePalettes();
        theLayer.visible = true;
        // get the colors;
        var lettersColors = getLettersColors();
        // create shape layer and collect am and dom subpathitems;
        convertToShapeLayer();
        var theDOMPath = collectPathInfoDOM(myDocument, myDocument.pathItems[myDocument.pathItems.length - 1]);
        var thePath = collectPathInfoFromDesc2012(myDocument, myDocument.pathItems[myDocument.pathItems.length - 1]);
        executeAction(charIDToTypeID("undo"), undefined, DialogModes.NO);
        theLayer.visible = false;
        // process paths;
        var theLayers = new Array;
        var domCount = theDOMPath.length - 1;
        var thisPath = new Array;
        var colorsCount = lettersColors.length - 1;
        for (var m = thePath.length - 1; m >= 0; m--) {
            var theCheck = true;
            var thisDOM = theDOMPath[domCount];
            var thisAM = thePath[m];
            thisPath.push(thisAM);
            // compare dom and am;
            if (thisDOM.length == thisAM.length) {
                for (var n = 0; n < thisDOM.length - 2; n++) {
                    if (String(thisDOM[n][0]) != String(thisAM[n][0])) { theCheck = false };
                    if (String(thisDOM[n][1]) != String(thisAM[n][1])) { theCheck = false };
                    if (String(thisDOM[n][2]) != String(thisAM[n][2])) { theCheck = false };
                };
            } else { theCheck = false };
            // create shape layer if dom and am supathitems are identical;
            if (theCheck == true) {
                var newShape = createShapeLayer(thisPath, lettersColors[colorsCount][1][0], lettersColors[colorsCount][1][1], lettersColors[colorsCount][1][2]);
                colorsCount--;
                theLayers.push(newShape);
                var thisPath = new Array;
                domCount--
            };
        };
        // transform;
        for (var o = 0; o < theLayers.length; o++) {
            var theScale = 100 * (Math.random() * 0.4 + 0.8);
            layerDuplicateOffsetScaleRotate(theLayers[o], 0, 0, theScale, theScale, 15 - Math.random() * 30, false)
        };
        app.togglePalettes();
    };
};
////////////////////////////////////
////////////////////////////////////
////////////////////////////////////
////// get color of letters in type layer //////
function getLettersColors() {
    var ref = new ActionReference();
    ref.putProperty(stringIDToTypeID("property"), stringIDToTypeID('textKey'));
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    var layerDesc = executeActionGet(ref);
    var textDesc = layerDesc.getObjectValue(stringIDToTypeID('textKey'));
    var theText = textDesc.getString(stringIDToTypeID("textKey"));
    var theStyleRanges = new Array;
    var theColors = new Array;
    var rangeList = textDesc.getList(stringIDToTypeID('textStyleRange'));
    for (var o = 0; o < rangeList.count; o++) {
        var thisList = rangeList.getObjectValue(o);
        var theFrom = thisList.getInteger(charIDToTypeID("From"));
        var theTo = thisList.getInteger(charIDToTypeID("T   "));
        var styleDesc = thisList.getObjectValue(stringIDToTypeID('textStyle'));
        var bl = styleDesc.getEnumerationValue(stringIDToTypeID("baseline"));
        var theColor = styleDesc.getObjectValue(stringIDToTypeID("color"));
        var theNumbers = [theColor.getUnitDoubleValue(stringIDToTypeID("red")), theColor.getUnitDoubleValue(stringIDToTypeID("grain")), theColor.getUnitDoubleValue(stringIDToTypeID("blue"))];
        theStyleRanges.push([styleDesc, theFrom, theTo]);
        if (o == 0) { theColors.push([theNumbers, theFrom, theTo]) } else {
            if (theColors[theColors.length - 1][1] != theFrom && theColors[theColors.length - 1][2] != theTo) {
                theColors.push([theNumbers, theFrom, theTo])
            }
        }
    };
    //alert (theText+"\n"+theColors.join("\n"));
    var theLetterColors = new Array;
    var thisColor = theColors[0][0];
    var theCounter = 0;
    // get individual letters’s colors and ignore spaces etc.;
    for (var x = 0; x < theText.length; x++) {
        if (theColors[theCounter][2] == x) {
            theCounter++
            thisColor = theColors[theCounter][0];
        };
        if (theText[x].match(/\S/i) != null) {
            theLetterColors.push([theText[x], thisColor])
        };
    };
    return theLetterColors
};
////// collect path info from actiondescriptor, smooth added //////
function collectPathInfoFromDesc2012(myDocument, thePath) {
    var originalRulerUnits = app.preferences.rulerUnits;
    app.preferences.rulerUnits = Units.POINTS;
    // based of functions from xbytor’s stdlib;
    var ref = new ActionReference();
    for (var l = 0; l < myDocument.pathItems.length; l++) {
        var thisPath = myDocument.pathItems[l];
        if (thisPath == thePath && thisPath.kind == PathKind.WORKPATH) {
            ref.putProperty(cTID("Path"), cTID("WrPt"));
        };
        if (thisPath == thePath && thisPath.kind != PathKind.WORKPATH && thisPath.kind != PathKind.VECTORMASK) {
            ref.putIndex(cTID("Path"), l + 1);
        };
        if (thisPath == thePath && thisPath.kind == PathKind.VECTORMASK) {
            var idPath = charIDToTypeID("Path");
            var idPath = charIDToTypeID("Path");
            var idvectorMask = stringIDToTypeID("vectorMask");
            ref.putEnumerated(idPath, idPath, idvectorMask);
        };
    };
    var desc = app.executeActionGet(ref);
    var pname = desc.getString(cTID('PthN'));
    // create new array;
    var theArray = new Array;
    var pathComponents = desc.getObjectValue(cTID("PthC")).getList(sTID('pathComponents'));
    // for subpathitems;
    for (var m = 0; m < pathComponents.count; m++) {
        var listKey = pathComponents.getObjectValue(m).getList(sTID("subpathListKey"));
        var operation1 = pathComponents.getObjectValue(m).getEnumerationValue(sTID("shapeOperation"));
        switch (operation1) {
            case 1097098272:
                var operation = 1097098272 //cTID('Add ');
                break;
            case 1398961266:
                var operation = 1398961266 //cTID('Sbtr');
                break;
            case 1231975538:
                var operation = 1231975538 //cTID('Intr');
                break;
            default:
                //		case 1102:
                var operation = sTID('xor') //ShapeOperation.SHAPEXOR;
                break;
        };
        // for subpathitem’s count;
        for (var n = 0; n < listKey.count; n++) {
            theArray.push(new Array);
            var points = listKey.getObjectValue(n).getList(sTID('points'));
            try { var closed = listKey.getObjectValue(n).getBoolean(sTID("closedSubpath")) }
            catch (e) { var closed = false };
            // for subpathitem’s segment’s number of points;
            for (var o = 0; o < points.count; o++) {
                var anchorObj = points.getObjectValue(o).getObjectValue(sTID("anchor"));
                var anchor = [anchorObj.getUnitDoubleValue(sTID('horizontal')), anchorObj.getUnitDoubleValue(sTID('vertical'))];
                var thisPoint = [anchor];
                try {
                    var left = points.getObjectValue(o).getObjectValue(cTID("Fwd "));
                    var leftDirection = [left.getUnitDoubleValue(sTID('horizontal')), left.getUnitDoubleValue(sTID('vertical'))];
                    thisPoint.push(leftDirection)
                }
                catch (e) {
                    thisPoint.push(anchor)
                };
                try {
                    var right = points.getObjectValue(o).getObjectValue(cTID("Bwd "));
                    var rightDirection = [right.getUnitDoubleValue(sTID('horizontal')), right.getUnitDoubleValue(sTID('vertical'))];
                    thisPoint.push(rightDirection)
                }
                catch (e) {
                    thisPoint.push(anchor)
                };
                try {
                    var smoothOr = points.getObjectValue(o).getBoolean(cTID("Smoo"));
                    thisPoint.push(smoothOr)
                }
                catch (e) { thisPoint.push(false) };
                theArray[theArray.length - 1].push(thisPoint);
            };
            theArray[theArray.length - 1].push(closed);
            theArray[theArray.length - 1].push(operation);
        };
    };
    // by xbytor, thanks to him;
    function cTID(s) { return cTID[s] || cTID[s] = app.charIDToTypeID(s); };
    function sTID(s) { return sTID[s] || sTID[s] = app.stringIDToTypeID(s); };
    // reset;
    app.preferences.rulerUnits = originalRulerUnits;
    return theArray;
};
////// function to collect path-info as text from dom //////
function collectPathInfoDOM(myDocument, thePath) {
    var originalRulerUnits = app.preferences.rulerUnits;
    app.preferences.rulerUnits = Units.POINTS;
    var theArray = [];
    for (var b = 0; b < thePath.subPathItems.length; b++) {
        theArray[b] = [];
        for (var c = 0; c < thePath.subPathItems[b].pathPoints.length; c++) {
            var pointsNumber = thePath.subPathItems[b].pathPoints.length;
            var theAnchor = thePath.subPathItems[b].pathPoints[c].anchor;
            var theLeft = thePath.subPathItems[b].pathPoints[c].leftDirection;
            var theRight = thePath.subPathItems[b].pathPoints[c].rightDirection;
            var theKind = thePath.subPathItems[b].pathPoints[c].kind;
            theArray[b][c] = [theAnchor, theLeft, theRight, theKind];
        };
        theArray[b][theArray[b].length] = String(thePath.subPathItems[b].closed);
        theArray[b][theArray[b].length] = String(thePath.subPathItems[b].operation);
    };
    app.preferences.rulerUnits = originalRulerUnits;
    return theArray
};
////// convert type layer to shape layer //////
function convertToShapeLayer() {
    try {
        var desc5 = new ActionDescriptor();
        var ref1 = new ActionReference();
        ref1.putClass(stringIDToTypeID("contentLayer"));
        desc5.putReference(stringIDToTypeID("null"), ref1);
        var ref2 = new ActionReference();
        ref2.putEnumerated(stringIDToTypeID("textLayer"), stringIDToTypeID("ordinal"), stringIDToTypeID("targetEnum"));
        desc5.putReference(stringIDToTypeID("using"), ref2);
        executeAction(stringIDToTypeID("make"), desc5, DialogModes.NO);
    } catch (e) { }
};
////// create a solid color layer //////
function createShapeLayer(theArray, theR, theG, theB) {
    var originalRulerUnits = app.preferences.rulerUnits;
    app.preferences.rulerUnits = Units.POINTS;
    // thanks to xbytor;
    cTID = function (s) { return app.charIDToTypeID(s); };
    sTID = function (s) { return app.stringIDToTypeID(s); };


    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putProperty(cTID('Path'), cTID('WrPt'));
    desc1.putReference(sTID('null'), ref1);
    var list1 = new ActionList();

    for (var m = 0; m < theArray.length; m++) {
        var thisSubPath = theArray[m];

        var desc2 = new ActionDescriptor();
        desc2.putEnumerated(sTID('shapeOperation'), sTID('shapeOperation'), 1908);
        //        desc2.putEnumerated(sTID('shapeOperation'), sTID('shapeOperation'), thisSubPath[thisSubPath.length - 1]);
        var list2 = new ActionList();
        var desc3 = new ActionDescriptor();
        desc3.putBoolean(cTID('Clsp'), thisSubPath[thisSubPath.length - 2]);
        var list3 = new ActionList();

        for (var n = 0; n < thisSubPath.length - 2; n++) {
            var thisPoint = thisSubPath[n];

            var desc4 = new ActionDescriptor();
            var desc5 = new ActionDescriptor();
            desc5.putUnitDouble(cTID('Hrzn'), cTID('#Rlt'), thisPoint[0][0]);
            desc5.putUnitDouble(cTID('Vrtc'), cTID('#Rlt'), thisPoint[0][1]);
            desc4.putObject(cTID('Anch'), cTID('Pnt '), desc5);
            var desc6 = new ActionDescriptor();
            desc6.putUnitDouble(cTID('Hrzn'), cTID('#Rlt'), thisPoint[1][0]);
            desc6.putUnitDouble(cTID('Vrtc'), cTID('#Rlt'), thisPoint[1][1]);
            desc4.putObject(cTID('Fwd '), cTID('Pnt '), desc6);
            var desc7 = new ActionDescriptor();
            desc7.putUnitDouble(cTID('Hrzn'), cTID('#Rlt'), thisPoint[2][0]);
            desc7.putUnitDouble(cTID('Vrtc'), cTID('#Rlt'), thisPoint[2][1]);
            desc4.putObject(cTID('Bwd '), cTID('Pnt '), desc7);
            desc4.putBoolean(cTID('Smoo'), thisPoint[3]);
            list3.putObject(cTID('Pthp'), desc4);

        };

        desc3.putList(cTID('Pts '), list3);
        list2.putObject(cTID('Sbpl'), desc3);
        desc2.putList(cTID('SbpL'), list2);
        list1.putObject(cTID('PaCm'), desc2);
    };

    desc1.putList(cTID('T   '), list1);
    executeAction(cTID('setd'), desc1, DialogModes.NO);
    // solid color layer;
    // =======================================================
    var desc16 = new ActionDescriptor();
    var ref4 = new ActionReference();
    ref4.putClass(stringIDToTypeID("contentLayer"));
    desc16.putReference(charIDToTypeID("null"), ref4);
    var desc17 = new ActionDescriptor();
    var desc18 = new ActionDescriptor();
    var desc19 = new ActionDescriptor();
    desc19.putDouble(charIDToTypeID("Rd  "), theR);
    desc19.putDouble(charIDToTypeID("Grn "), theG);
    desc19.putDouble(charIDToTypeID("Bl  "), theB);
    desc18.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), desc19);
    var idsolidColorLayer = stringIDToTypeID("solidColorLayer");
    desc17.putObject(charIDToTypeID("Type"), idsolidColorLayer, desc18);
    desc16.putObject(charIDToTypeID("Usng"), stringIDToTypeID("contentLayer"), desc17);
    executeAction(charIDToTypeID("Mk  "), desc16, DialogModes.NO);
    app.preferences.rulerUnits = originalRulerUnits;
    //    return activeDocument.activeLayer;
    // get identifier;
    var ref = new ActionReference();
    ref.putProperty(stringIDToTypeID("property"), stringIDToTypeID("layerID"));
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    return executeActionGet(ref).getInteger(stringIDToTypeID("layerID"));
};
// based on code by mike hale, via paul riggott;
function selectLayerByID(id, add) {
    add = undefined ? add = false : add
    var ref = new ActionReference();
    ref.putIdentifier(charIDToTypeID("Lyr "), id);
    var desc = new ActionDescriptor();
    desc.putReference(charIDToTypeID("null"), ref);
    if (add) desc.putEnumerated(stringIDToTypeID("selectionModifier"), stringIDToTypeID("selectionModifierType"), stringIDToTypeID("addToSelection"));
    desc.putBoolean(charIDToTypeID("MkVs"), false);
    try {
        executeAction(charIDToTypeID("slct"), desc, DialogModes.NO);
    } catch (e) {
        alert(e.message);
    }
};
////// duplicate layer (id, xOffset, yOffset, theXScale, theYScale, theAngle) //////
function layerDuplicateOffsetScaleRotate(theIdentifier, xOffset, yOffset, theXScale, theYScale, theAngle, copy) {
    selectLayerByID(theIdentifier, false);
    var desc23 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref2 = new ActionReference();
    //            ref2.putIdentifier ( charIDToTypeID( "Lyr " ), theIdentifier );
    ref2.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc23.putReference(idnull, ref2);
    desc23.putEnumerated(charIDToTypeID("FTcs"), charIDToTypeID("QCSt"), charIDToTypeID("Qcsa"));
    var idOfst = charIDToTypeID("Ofst");
    var desc24 = new ActionDescriptor();
    var idPxl = charIDToTypeID("#Pxl");
    desc24.putUnitDouble(charIDToTypeID("Hrzn"), idPxl, xOffset);
    desc24.putUnitDouble(charIDToTypeID("Vrtc"), idPxl, yOffset);
    desc23.putObject(idOfst, idOfst, desc24);
    var idPrc = charIDToTypeID("#Prc");
    desc23.putUnitDouble(charIDToTypeID("Wdth"), idPrc, theXScale);
    desc23.putUnitDouble(charIDToTypeID("Hght"), idPrc, theYScale);
    desc23.putUnitDouble(charIDToTypeID("Angl"), charIDToTypeID("#Ang"), theAngle);
    desc23.putEnumerated(charIDToTypeID("Intr"), charIDToTypeID("Intp"), stringIDToTypeID("bicubicAutomatic"));
    if (copy == true) { desc23.putBoolean(charIDToTypeID("Cpy "), true) };
    executeAction(charIDToTypeID("Trnf"), desc23, DialogModes.NO);
};