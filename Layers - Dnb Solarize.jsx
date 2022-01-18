/**creating a dodge & burn adjustment layer  */
// BEGIN__HARVEST_EXCEPTION_ZSTRING

<javascriptresource>
<category>Tools</category>
<name>Dnb Solarize</name>
<enableinfo>true</enableinfo>
</javascriptresource>

#target photoshop
s2t = stringIDToTypeID;

(r = new ActionReference()).putName(s2t('layer'), 'H');
(d = new ActionDescriptor()).putReference(s2t('null'), r);
try { executeAction(s2t('select'), d, DialogModes.NO) } catch (e) { }

// =======================================================
var idMk = charIDToTypeID( "Mk  " );
    var desc15 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref8 = new ActionReference();
        var idAdjL = charIDToTypeID( "AdjL" );
        ref8.putClass( idAdjL );
    desc15.putReference( idnull, ref8 );
    var idUsng = charIDToTypeID( "Usng" );
        var desc16 = new ActionDescriptor();
        desc16.putString ( charIDToTypeID( "Nm  " ), "enhance" );
        var idType = charIDToTypeID( "Type" );
            var desc17 = new ActionDescriptor();
            var idpresetKind = stringIDToTypeID( "presetKind" );
            var idpresetKindType = stringIDToTypeID( "presetKindType" );
            var idpresetKindDefault = stringIDToTypeID( "presetKindDefault" );
            desc17.putEnumerated( idpresetKind, idpresetKindType, idpresetKindDefault );
        var idCrvs = charIDToTypeID( "Crvs" );
        desc16.putObject( idType, idCrvs, desc17 );
    var idAdjL = charIDToTypeID( "AdjL" );
    desc15.putObject( idUsng, idAdjL, desc16 );
executeAction( idMk, desc15, DialogModes.NO );

// =======================================================
var idsetd = charIDToTypeID( "setd" );
    var desc18 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref9 = new ActionReference();
        var idLyr = charIDToTypeID( "Lyr " );
        var idOrdn = charIDToTypeID( "Ordn" );
        var idTrgt = charIDToTypeID( "Trgt" );
        ref9.putEnumerated( idLyr, idOrdn, idTrgt );
    desc18.putReference( idnull, ref9 );
    var idT = charIDToTypeID( "T   " );
        var desc19 = new ActionDescriptor();
        var idMd = charIDToTypeID( "Md  " );
        var idBlnM = charIDToTypeID( "BlnM" );
        var idlinearLight = stringIDToTypeID( "linearLight" );
        desc19.putEnumerated( idMd, idBlnM, idlinearLight );
    var idLyr = charIDToTypeID( "Lyr " );
    desc18.putObject( idT, idLyr, desc19 );
executeAction( idsetd, desc18, DialogModes.NO );

// =======================================================
var idsetd = charIDToTypeID( "setd" );
    var desc15 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref4 = new ActionReference();
        var idAdjL = charIDToTypeID( "AdjL" );
        var idOrdn = charIDToTypeID( "Ordn" );
        var idTrgt = charIDToTypeID( "Trgt" );
        ref4.putEnumerated( idAdjL, idOrdn, idTrgt );
    desc15.putReference( idnull, ref4 );
    var idT = charIDToTypeID( "T   " );
        var desc16 = new ActionDescriptor();
        var idpresetKind = stringIDToTypeID( "presetKind" );
        var idpresetKindType = stringIDToTypeID( "presetKindType" );
        var idpresetKindCustom = stringIDToTypeID( "presetKindCustom" );
        desc16.putEnumerated( idpresetKind, idpresetKindType, idpresetKindCustom );
        var idAdjs = charIDToTypeID( "Adjs" );
            var list2 = new ActionList();
                var desc17 = new ActionDescriptor();
                var idChnl = charIDToTypeID( "Chnl" );
                    var ref5 = new ActionReference();
                    var idChnl = charIDToTypeID( "Chnl" );
                    var idChnl = charIDToTypeID( "Chnl" );
                    var idCmps = charIDToTypeID( "Cmps" );
                    ref5.putEnumerated( idChnl, idChnl, idCmps );
                desc17.putReference( idChnl, ref5 );
                var idCrv = charIDToTypeID( "Crv " );
                    var list3 = new ActionList();
                        var desc18 = new ActionDescriptor();
                        var idHrzn = charIDToTypeID( "Hrzn" );
                        desc18.putDouble( idHrzn, 0.000000 );
                        var idVrtc = charIDToTypeID( "Vrtc" );
                        desc18.putDouble( idVrtc, 0.000000 );
                    var idPnt = charIDToTypeID( "Pnt " );
                    list3.putObject( idPnt, desc18 );
                        var desc19 = new ActionDescriptor();
                        var idHrzn = charIDToTypeID( "Hrzn" );
                        desc19.putDouble( idHrzn, 79.000000 );
                        var idVrtc = charIDToTypeID( "Vrtc" );
                        desc19.putDouble( idVrtc, 37.000000 );
                    var idPnt = charIDToTypeID( "Pnt " );
                    list3.putObject( idPnt, desc19 );
                        var desc20 = new ActionDescriptor();
                        var idHrzn = charIDToTypeID( "Hrzn" );
                        desc20.putDouble( idHrzn, 128.000000 );
                        var idVrtc = charIDToTypeID( "Vrtc" );
                        desc20.putDouble( idVrtc, 128.000000 );
                    var idPnt = charIDToTypeID( "Pnt " );
                    list3.putObject( idPnt, desc20 );
                        var desc21 = new ActionDescriptor();
                        var idHrzn = charIDToTypeID( "Hrzn" );
                        desc21.putDouble( idHrzn, 180.000000 );
                        var idVrtc = charIDToTypeID( "Vrtc" );
                        desc21.putDouble( idVrtc, 218.000000 );
                    var idPnt = charIDToTypeID( "Pnt " );
                    list3.putObject( idPnt, desc21 );
                        var desc22 = new ActionDescriptor();
                        var idHrzn = charIDToTypeID( "Hrzn" );
                        desc22.putDouble( idHrzn, 255.000000 );
                        var idVrtc = charIDToTypeID( "Vrtc" );
                        desc22.putDouble( idVrtc, 255.000000 );
                    var idPnt = charIDToTypeID( "Pnt " );
                    list3.putObject( idPnt, desc22 );
                desc17.putList( idCrv, list3 );
            var idCrvA = charIDToTypeID( "CrvA" );
            list2.putObject( idCrvA, desc17 );
        desc16.putList( idAdjs, list2 );
    var idCrvs = charIDToTypeID( "Crvs" );
    desc15.putObject( idT, idCrvs, desc16 );
executeAction( idsetd, desc15, DialogModes.NO );

// =======================================================
var idGrpL = charIDToTypeID( "GrpL" );
    var desc20 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref10 = new ActionReference();
        var idLyr = charIDToTypeID( "Lyr " );
        var idOrdn = charIDToTypeID( "Ordn" );
        var idTrgt = charIDToTypeID( "Trgt" );
        ref10.putEnumerated( idLyr, idOrdn, idTrgt );
    desc20.putReference( idnull, ref10 );
executeAction( idGrpL, desc20, DialogModes.NO );


(r = new ActionReference()).putName(s2t('layer'), 'H');
(d = new ActionDescriptor()).putReference(s2t('null'), r);
try { executeAction(s2t('select'), d, DialogModes.NO) } catch (e) { }


