/*https://community.adobe.com/t5/photoshop-ecosystem/paid-request-find-installed-pattern-names-with-script/td-p/11436521
@r-bin
*/

var r = new ActionReference();    
r.putProperty(stringIDToTypeID("property"), stringIDToTypeID("presetManager"));  
r.putEnumerated(stringIDToTypeID("application"), stringIDToTypeID("ordinal"), stringIDToTypeID("targetEnum"));

var list = executeActionGet(r).getList(stringIDToTypeID("presetManager")).getObjectValue(4).getList(stringIDToTypeID("name"));        

var patterns = new Array();    

for (var i = 0; i < list.count; i++) patterns.push(list.getString(i));    

var file = new File(Folder.temp.fsName + "/" + "TMP");

file.remove();

var d = new ActionDescriptor();
d.putPath(stringIDToTypeID("null"), file);
var r = new ActionReference();
r.putProperty(stringIDToTypeID("property"), stringIDToTypeID("pattern"));
r.putEnumerated(stringIDToTypeID("application"), stringIDToTypeID("ordinal"), stringIDToTypeID("targetEnum"));
d.putReference(stringIDToTypeID("to"), r);
executeAction(stringIDToTypeID("set"), d, DialogModes.NO);

patterns.reverse();


file.open("r");
file.encoding = "BINARY";

var s = file.read();

file.remove();

var n = s.indexOf("8BIMphry");

if (n > 0)
    {
    s = s.substr(n+12);

    var d = new ActionDescriptor();
    d.fromStream(s);

    var list = d.getList(stringIDToTypeID("hierarchy"));

    var hierarchy = new Array();

    var grp = new Array();

    for (var i = 0; i < list.count; i++)
        {
        switch (list.getClass(i))
            {
            case stringIDToTypeID("group"):
                var nm = list.getObjectValue(i).getString(stringIDToTypeID("name"));
                grp.push(nm);

                hierarchy.push({path:[]});

                for (var x = 0; x < grp.length; x++) hierarchy[hierarchy.length-1].path.push(grp[x]);

                break;

            case stringIDToTypeID("groupEnd"):
                grp.pop();
                break;
                

            case stringIDToTypeID("preset"):
                hierarchy.push({path:[]});

                for (var x = 0; x < grp.length; x++) hierarchy[hierarchy.length-1].path.push(grp[x]);

                hierarchy[hierarchy.length-1].pattern = patterns.pop();
                break;
            }
        }

    alert(hierarchy.toSource())        
    }        