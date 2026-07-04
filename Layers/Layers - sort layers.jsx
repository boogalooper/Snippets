#target photoshop
/*
<javascriptresource>
<category>User</category>
<name>Sort layers</name>
<enableinfo>true</enableinfo>
</javascriptresource>
*/

var doc = activeDocument;
var bkgn = hasBackground ();
var topLayerID//To hold top selected layer ID

var lyrSelIDX = (getSelectedLayersIdx ())//indexes of selected layers
var orgLayA = getLayerSetsData(lyrSelIDX)//array of selected layer names and IDs
multiSelectByIDs (topLayerID);
var topLayer = doc.activeLayer;//top selected layer
moveUpLayer ();
var upLayer = doc.activeLayer
var upLayerIDX = getSelectedLayersIdx ()
multiSelectByIDs (orgLayA[0][1])
var firstLayer = doc.activeLayer

if(upLayerIDX<lyrSelIDX[lyrSelIDX.length-1])
    {firstLayer.move (doc.layers[0], ElementPlacement.PLACEAFTER)}
else 
    {firstLayer.move (topLayer, ElementPlacement.PLACEAFTER)    }    

var lastLayer = doc.activeLayer
for(var i=1;i<orgLayA.length;i++){
    multiSelectByIDs (orgLayA[i][1]);
    nextLayer = doc.activeLayer;
    nextLayer.move (lastLayer, ElementPlacement.PLACEBEFORE)
    lastLayer = doc.activeLayer
    }

    function hasBackground(){// function to check if there is a background layer
        var res = undefined;
        try{
            var ref = new ActionReference();
            ref.putProperty( charIDToTypeID("Prpr") , charIDToTypeID("Nm  "));
            ref.putIndex( charIDToTypeID("Lyr "), 0 );
            executeActionGet(ref).getString(charIDToTypeID("Nm  ") );
            res = true;
        }catch(e){ res = false}
        return res;
    }

//used in getSelectedLayersIds()
    function getSelectedLayersIdx(){// get the selected layers index( positon in layer editor)
         var selectedLayers = new Array;
         var ref = new ActionReference();
         ref.putEnumerated( charIDToTypeID('Dcmn'), charIDToTypeID('Ordn'), charIDToTypeID('Trgt') );
         var desc = executeActionGet(ref);
         var add = 1;
         if(hasBackground()){add = 0}
         if( desc.hasKey( stringIDToTypeID( 'targetLayers' ) ) ){
              desc = desc.getList( stringIDToTypeID( 'targetLayers' ));
              var c = desc.count
              var selectedLayers = new Array();
              for(var i=0;i<c;i++){
                   selectedLayers.push(  (desc.getReference( i ).getIndex()) + add);
              }
         }else{
              var ref = new ActionReference();
              ref.putProperty( charIDToTypeID('Prpr') , charIDToTypeID( 'ItmI' ));
              ref.putEnumerated( charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt') );
              srs = hasBackground()?executeActionGet(ref).getInteger(charIDToTypeID( 'ItmI' ))-1:executeActionGet(ref).getInteger(charIDToTypeID( 'ItmI' ));
              selectedLayers.push( srs);
         }
         return selectedLayers;
    }


function getLayerSetsData(layA)
{
    var lyrSetsList = []
    var lyrSets = [];
    
    for(i=0;i<layA.length;i++){
        var layerSets = layA[i]
       //var layerSets = 4

            ref = new ActionReference();
            ref.putIndex(charIDToTypeID('Lyr '), layerSets);
            var d1 = executeActionGet(ref)
            var c2t = function (s){return app.charIDToTypeID(s);};
            var s2t = function (s){return app.stringIDToTypeID(s);};
            var lyrSet = {};

            lyrSet.name = d1.getString(c2t("Nm  "));
            lyrSet.id = d1.getInteger(s2t("layerID"));
            
            lyrSetsList.push ([lyrSet.name,lyrSet.id])
    } 
    topLayerID = lyrSetsList[lyrSetsList.length -1][1]
    lyrSetsList.sort ()   
    return lyrSetsList
    

};
//=========
    function makeLayerActiveByLayerID(id){//is this needed?
        var desc = new ActionDescriptor();
            var ref = new ActionReference();
            ref.putIdentifier( charIDToTypeID( "Lyr " ), id );
        desc.putReference( charIDToTypeID( "null" ), ref );
        desc.putBoolean( charIDToTypeID( "MkVs" ), false );
    executeAction( charIDToTypeID( "slct" ), desc, DialogModes.NO );
    };

//used in multiSelectByIDs(ids)
    function doesIdExists( id ){// function to check if the id exists
       var res = true;
       var ref = new ActionReference();
       ref.putIdentifier(charIDToTypeID('Lyr '), id);
        try{var desc = executeActionGet(ref)}catch(err){res = false};
        return res;
    }

//uses doesIdExists(id)
    function multiSelectByIDs(ids) {
      if( ids.constructor != Array ) ids = [ ids ];
        var layers = new Array();
        var id54 = charIDToTypeID( "slct" );
        var desc12 = new ActionDescriptor();
        var id55 = charIDToTypeID( "null" );
        var ref9 = new ActionReference();
        for (var i = 0; i < ids.length; i++) {
           if(doesIdExists(ids[i]) == true){// a check to see if the id stil exists
               layers[i] = charIDToTypeID( "Lyr " );
               ref9.putIdentifier(layers[i], ids[i]);
           }
        }
        desc12.putReference( id55, ref9 );
        var id58 = charIDToTypeID( "MkVs" );
        desc12.putBoolean( id58, false );
        executeAction( id54, desc12, DialogModes.NO );
    }

//=======================
function moveUpLayer(){
     var idslct = charIDToTypeID( "slct" );
        var desc3 = new ActionDescriptor();
        var idnull = charIDToTypeID( "null" );
            var ref1 = new ActionReference();
            var idLyr = charIDToTypeID( "Lyr " );
            var idOrdn = charIDToTypeID( "Ordn" );
            var idFrwr = charIDToTypeID( "Frwr" );
            ref1.putEnumerated( idLyr, idOrdn, idFrwr );
        desc3.putReference( idnull, ref1 );
        var idMkVs = charIDToTypeID( "MkVs" );
        desc3.putBoolean( idMkVs, false );
        var idLyrI = charIDToTypeID( "LyrI" );
            var list1 = new ActionList();
            list1.putInteger( 3 );
        desc3.putList( idLyrI, list1 );
    executeAction( idslct, desc3, DialogModes.NO );   
    }