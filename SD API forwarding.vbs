Option Explicit
On Error Resume Next

Dim appRef
Dim desc

Dim WshArguments, i, list, FSO, f, CurrentPath
set WshArguments=WScript.Arguments
 
Set appRef = CreateObject("Photoshop.Application")
Set desc = CreateObject("Photoshop.ActionDescriptor")
if WshArguments.count()> 0 then
desc.putBoolean appRef.stringIDToTypeID("args"), true
End if
appRef.executeAction appRef.stringIDToTypeID("32190faf-82e5-495b-918a-1f52d3029ec1"), desc, 3
