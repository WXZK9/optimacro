sleep(2)
local firefox = event:searchWindowByName("Mozilla")
--event:focusWindow(firefox)
--event:enterText('bbb')
event:activateWindow(firefox)
event:keySequence("ctrl+l")
event:enterText("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
event:keySequence("Return")

--event:keySequence('Space')
--event:enterTextToWindow('aaa', firefox)

event:moveMouse(0, 0)
--print(firefox)

