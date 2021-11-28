/**creating a dodge & burn adjustment layer  */

// BEGIN__HARVEST_EXCEPTION_ZSTRING

<javascriptresource>
<category>User</category>
<enableinfo>true</enableinfo>
</javascriptresource>

// END__HARVEST_EXCEPTION_ZSTRING

// =======================================================
var idMk = charIDToTypeID( "Mk  " );
    var desc16 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref3 = new ActionReference();
        var idLyr = charIDToTypeID( "Lyr " );
        ref3.putClass( idLyr );
    desc16.putReference( idnull, ref3 );
    var idUsng = charIDToTypeID( "Usng" );
        var desc17 = new ActionDescriptor();
        var idNm = charIDToTypeID( "Nm  " );
        desc17.putString( idNm, """Linear light""" );
        var idMd = charIDToTypeID( "Md  " );
        var idBlnM = charIDToTypeID( "BlnM" );
        var idlinearLight = stringIDToTypeID( "linearLight" );
        desc17.putEnumerated( idMd, idBlnM, idlinearLight );
        var idFlNt = charIDToTypeID( "FlNt" );
        desc17.putBoolean( idFlNt, true );
    var idLyr = charIDToTypeID( "Lyr " );
    desc16.putObject( idUsng, idLyr, desc17 );
    var idLyrI = charIDToTypeID( "LyrI" );
    desc16.putInteger( idLyrI, 3 );
executeAction( idMk, desc16, DialogModes.NO );

// =======================================================
var idslct = charIDToTypeID( "slct" );
    var desc19 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref5 = new ActionReference();
        var idBrTl = charIDToTypeID( "BrTl" );
        ref5.putClass( idBrTl );
    desc19.putReference( idnull, ref5 );
executeAction( idslct, desc19, DialogModes.NO );