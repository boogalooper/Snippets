/*How to stop recording state with JSX code?
@r-bin
https://community.adobe.com/t5/photoshop-ecosystem/how-to-stop-recording-state-with-jsx-code/m-p/10252491

*/

/////////////////////////////////////////////////////////////////////////////////

function ActionMaker(set_name, act_name)

    {

    try {

        this.set_name = set_name;

        this.act_name = act_name;

 

        this.data = new Array();

        }

    catch (e) { alert(e); throw(e);  }

    }

 

/////////////////////////////////////////////////////////////////////////////////

ActionMaker.prototype.executeAction = function(event, desc)

    {

    try

        {

        this.data.push([event, desc]);

 

        executeAction(event, desc, DialogModes.NO);

        }

    catch (e) { alert(e); throw(e);  }

    }

 

/////////////////////////////////////////////////////////////////////////////////

ActionMaker.prototype.load = function()

    {

    try {

        var file = new File(Folder.temp.fsName + "\\" + "tmp.atn");

 

        var len = this.data.length;

 

        var l0 = (len>>24) & 0xFF;

        var l1 = (len>>16) & 0xFF;

        var l2 = (len>>8 ) & 0xFF;

        var l3 = (len    ) & 0xFF;

 

        file.open("w");

        file.encoding = "BINARY";

 

        file.write(String.fromCharCode(0,0,0,16)); // dword version

 

        file.write(string_to_bin(this.set_name));  // unicode set name

        file.write(String.fromCharCode(0));        // byte  set is expanded

        file.write(String.fromCharCode(0,0,0,1));  // dword number of actions in action set

        file.write(String.fromCharCode(0,0));      // word  index of action

        file.write(String.fromCharCode(0));        // byte  shift key needed for keyboard shortcut

        file.write(String.fromCharCode(0));        // byte  ctrl key needed for keyboard shortcut

        file.write(String.fromCharCode(0,0));      // word  color index

 

        file.write(string_to_bin(this.act_name));     // unicode action name

        file.write(String.fromCharCode(0));           // byte  action is expanded

        file.write(String.fromCharCode(l0,l1,l2,l3)); // dword number of items in action

 

        for (var i = 0; i < len; i++)

            {

            file.write(String.fromCharCode(0));        // byte  item is expanded in the Actions palette

            file.write(String.fromCharCode(1));        // byte  item is enabled

            file.write(String.fromCharCode(0));        // byte  dialogs should be displayed

            file.write(String.fromCharCode(0));        // byte  options for displaying dialogs

 

            file.write("long");

            file.write(typeIDToCharID(this.data[i][0])); // charID of event

            file.write(String.fromCharCode(0,0,0,0));    // dword len and dictionary name

 

            if (this.data[i][1] && this.data[i][1].count)

                {

                file.write(String.fromCharCode(0xFF,0xFF,0xFF,0xFF)); // long -1 if have descriptor

                file.write(this.data[i][1].toStream().substr(4));

                }

            else

                {

                file.write(String.fromCharCode(0,0,0,0));

                }

            }

 

        file.close();

 

        app.load(file);

 

        file.remove();

 

        function string_to_bin(x)

            {  

            try {

                var d = new ActionDescriptor();

                d.putString(0, x);

                return d.toStream().substr(34);

                }

            catch (e) { alert(e); }       

            }

        }

    catch (e) { alert(e); throw(e);  }

    }

 

 

////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////

var a = new ActionMaker("SET", "ACTION");

 

    // Some AM Code. Use a.executeAction() instead of executeAction()

 

    // ctrl-j

    var d = new ActionDescriptor();

    a.executeAction(stringIDToTypeID("copyToLayer"), d, DialogModes.NO);

 

    // cteate mask

    var d = new ActionDescriptor();

    d.putClass(stringIDToTypeID("new"), stringIDToTypeID("channel"));

    var r = new ActionReference();

    r.putEnumerated(stringIDToTypeID("channel"), stringIDToTypeID("channel"), stringIDToTypeID("mask"));

    d.putReference(stringIDToTypeID("at"), r);

    d.putEnumerated(stringIDToTypeID("using"), stringIDToTypeID("userMaskEnabled"), stringIDToTypeID("hideAll"));

    a.executeAction(stringIDToTypeID("make"), d, DialogModes.NO);

   

    // hide layer

    var d = new ActionDescriptor();

    var list = new ActionList();

    var r = new ActionReference();

    r.putEnumerated(stringIDToTypeID("layer"), stringIDToTypeID("ordinal"), stringIDToTypeID("targetEnum"));

    list.putReference(r);

    d.putList(stringIDToTypeID("null"), list);

    a.executeAction(stringIDToTypeID("hide"), d, DialogModes.NO);

 

    // show layer

    var d = new ActionDescriptor();

    var list = new ActionList();

    var r = new ActionReference();

    r.putEnumerated(stringIDToTypeID("layer"), stringIDToTypeID("ordinal"), stringIDToTypeID("targetEnum"));

    list.putReference(r);

    d.putList(stringIDToTypeID("null"), list);

    a.executeAction(stringIDToTypeID("show"), d, DialogModes.NO);

   

    // ctrl-j

    var d = new ActionDescriptor();

    a.executeAction(stringIDToTypeID("copyToLayer"), d, DialogModes.NO);

 

    // delete mask

    var d = new ActionDescriptor();

    var r = new ActionReference();

    r.putEnumerated(stringIDToTypeID("channel"), stringIDToTypeID("channel"), stringIDToTypeID("mask"));

    d.putReference(stringIDToTypeID("null"), r);

    a.executeAction(stringIDToTypeID("delete"), d, DialogModes.NO);

   

   

a.load(); // load action