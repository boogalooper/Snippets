Option Explicit
On Error Resume Next

Dim WshArguments, i, list, FSO, f, CurrentPath
'Получаем доступ к коллекции через свойство Arguments
set WshArguments=WScript.Arguments
 
'Определяем, есть ли передача параметров
if WshArguments.count()> 0 then
	Set FSO = CreateObject("Scripting.FileSystemObject")
	CurrentPath = WScript.CreateObject("Scripting.FileSystemObject").GetSpecialFolder(2)
	Set f = FSO.CreateTextFile(CurrentPath+"\args.txt", True)
	f.Write(WshArguments(0))
	f.Close
End if

'Dim appRef
'Dim desc

'Set appRef = CreateObject("Photoshop.Application")
'Set desc = CreateObject("Photoshop.ActionDescriptor")
'desc.putString appRef.stringIDToTypeID("args"), "test"
'appRef.executeAction appRef.stringIDToTypeID("808f4b96-50f3-4ff3-b00f-bc4189e89c5c"), desc, 3
