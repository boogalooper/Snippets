// BEGIN__HARVEST_EXCEPTION_ZSTRING

<javascriptresource>
<category>User</category>
<enableinfo>true</enableinfo>
</javascriptresource>

// END__HARVEST_EXCEPTION_ZSTRING

// =======================================================
var idMk = charIDToTypeID( "Mk  " );
    var desc4 = new ActionDescriptor();
// =======================================================
var idMk = charIDToTypeID( "Mk  " );
    var desc9 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref1 = new ActionReference();
        var idLyr = charIDToTypeID( "Lyr " );
        ref1.putClass( idLyr );
    desc9.putReference( idnull, ref1 );
    var idUsng = charIDToTypeID( "Usng" );
        var desc10 = new ActionDescriptor();
        var idNm = charIDToTypeID( "Nm  " );
        desc10.putString( idNm, """overlay""" );
        var idMd = charIDToTypeID( "Md  " );
        var idBlnM = charIDToTypeID( "BlnM" );
        var idOvrl = charIDToTypeID( "Ovrl" );
        desc10.putEnumerated( idMd, idBlnM, idOvrl );
        var idFlNt = charIDToTypeID( "FlNt" );
        desc10.putBoolean( idFlNt, true );
    var idLyr = charIDToTypeID( "Lyr " );
    desc9.putObject( idUsng, idLyr, desc10 );
    var idLyrI = charIDToTypeID( "LyrI" );
    desc9.putInteger( idLyrI, 2 );
executeAction( idMk, desc9, DialogModes.NO );

// =======================================================
var idslct = charIDToTypeID( "slct" );
    var desc11 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref2 = new ActionReference();
        var idBrTl = charIDToTypeID( "BrTl" );
        ref2.putClass( idBrTl );
    desc11.putReference( idnull, ref2 );
executeAction( idslct, desc11, DialogModes.NO );

