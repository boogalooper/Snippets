/**Add to selection nearest (by boundaries) layer */

#target photoshop

main ()

function main ()
{
    var ref = new ActionReference();
    ref.putIdentifier(charIDToTypeID('Lyr '), app.activeDocument.activeLayer.id);
    var desc = executeActionGet(ref)
    var lr = new getCenter (desc)
    var lrs = getLayers ()

    var minDist = []
    var len = lrs.length
    for (var i=0; i<len; i++) {minDist.push (new distance(lr, lrs[i]))}

    minDist.sort (compareDist)  

    selectLayer (lr.id, false)
    selectLayer (minDist[1].id, true)
    }

function compareDist (a,b) {if (a.dist > b.dist) return 1; if (a.dist < b.dist) return -1}

function distance (lrA, lrB)
{    
    var a =lrA.X - lrB.X
    var b =lrA.Y - lrB.Y

    this.dist = Math.sqrt( a*a + b*b )
    this.id = lrB.id
    
    return
}

function getLayers()
{     
   var ref = new ActionReference()     
   ref.putProperty( charIDToTypeID('Prpr') , charIDToTypeID('NmbL'))  
   ref.putEnumerated( charIDToTypeID('Dcmn'), charIDToTypeID('Ordn'), charIDToTypeID('Trgt') )     
   var count = executeActionGet(ref).getInteger(charIDToTypeID('NmbL')) +1     
   var lrs=[]    
try{activeDocument.backgroundLayer; var i = 0}catch(e){var i = 1} 

for(i;i<count;i++){     
        if(i == 0) continue;  
        ref = new ActionReference()     
        ref.putIndex( charIDToTypeID( 'Lyr ' ), i )   
        var desc = executeActionGet(ref)     
        if (desc.getInteger(stringIDToTypeID("layerKind")) == 7 || desc.getBoolean(stringIDToTypeID("visible")) == false) continue;
        lrs.push (new getCenter (desc))
        }  
    return lrs  
}   

function getCenter (desc)
{
        var bounds = desc.getObjectValue(stringIDToTypeID("bounds"))
        var top = bounds.getDouble(stringIDToTypeID("top"))
        var left = bounds.getDouble(stringIDToTypeID("left"))
        var bottom = bounds.getDouble(stringIDToTypeID("bottom"))
        var right = bounds.getDouble(stringIDToTypeID("right"))
        
        this.id = desc.getInteger(stringIDToTypeID("layerID"))
        this.X = left + (right-left)/2
        this.Y = top + (bottom-top)/2
       
        return
}

 function selectLayer (ID, add) {
    add = (add == undefined)  ? add = false : add
   var ref = new ActionReference()
   ref.putIdentifier(charIDToTypeID('Lyr '), ID)
   var desc = new ActionDescriptor()
   desc.putReference(charIDToTypeID('null'), ref)
   if (add) {
      desc.putEnumerated(stringIDToTypeID('selectionModifier'), stringIDToTypeID('selectionModifierType'), stringIDToTypeID('addToSelection'))
   }
   desc.putBoolean(charIDToTypeID('MkVs'), false)
   executeAction(charIDToTypeID('slct'), desc, DialogModes.NO)
}