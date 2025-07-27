/**
 * Script can't run correctly when it starts by action 
 * https://community.adobe.com/t5/photoshop-ecosystem-discussions/script-can-t-run-correctly-when-it-starts-by-action/td-p/14631413
 */

asyncDeleteActionSet()

function asyncDeleteActionSet(actionSetName) {
    var bt = new BridgeTalk(),
        f = ";f();",
        z = updateActionSet.toSource();
    bt.target = BridgeTalk.getSpecifier('photoshop');
    bt.body = "var f=" + z + f;
    bt.send()
    function updateActionSet() {
        function deleteActionSet(actionSetName) {
            try {
                var iddelete = charIDToTypeID("Dlt ");
                var desc = new ActionDescriptor();
                var ref = new ActionReference();
                ref.putName(charIDToTypeID("ASet"), actionSetName);
                desc.putReference(charIDToTypeID("null"), ref);
                executeAction(iddelete, desc, DialogModes.NO);
            } catch (e) {
                alert(e.message)
            }
        }
        deleteActionSet("Set 1");
        deleteActionSet("Set 2");
        app.load(new File("C:/Program Files/Adobe/My Tools/Actions/Set1Updated.atn"));
        app.load(new File("C:/Program Files/Adobe/My Tools/Actions/Set2Updated.atn"));
        alert("UPDATED!");
    }
}