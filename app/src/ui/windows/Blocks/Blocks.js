const blocks = {
    // Existing for loop block
    for: function(from, to, freq) {
        return {
            from: from,
            to: to,
            freq: freq,
            beginning: `for i = ${from}, ${to}, ${freq} do`,
        };
    },

    // Existing if condition block
    if: function(condition, statement) {
        return {
            condition: condition,
            statement: statement || "then",  // Default to "then" if not provided
            action: `if ${condition} ${statement}`
        };
    },

    // Existing variable declaration block
    zmienna: function(type, name, value) {
        return {
            type: type,
            name: name,
            value: value,
            combined: `${type} ${name} = ${value}`
        };
    },

    // Event Control Blocks:

    // Attach the event controller to the Lua state
    attachController: function(luaState) {
        return {
            action: `attachController(${luaState})`
        };
    },

    // Send text to the current window
    enterText: function(text) {
        return {
            action: `enterText("${text}")`
        };
    },

    // Send text to a specified window with delay
    enterTextAdvanced: function(text, window, delay) {
        return {
            action: `enterTextAdvanced("${text}", ${window}, ${delay})`
        };
    },

    // Get the current mouse location
    getMouseLocation: function() {
        return {
            action: `getMouseLocation()`
        };
    },

    // Get the window under the mouse
    getWindowUnderMouse: function() {
        return {
            action: `getWindowUnderMouse()`
        };
    },

    // Send key sequence to the current window
    keySequence: function(sequence) {
        return {
            action: `keySequence("${sequence}")`
        };
    },

    // Send key sequence to a specified window with delay
    keySequenceAdvanced: function(sequence, window, delay) {
        return {
            action: `keySequenceAdvanced("${sequence}", ${window}, ${delay})`
        };
    },

    // Mouse click on the current window
    mouseClick: function(button) {
        return {
            action: `mouseClick(${button})`
        };
    },

    // Mouse click on a specified window
    mouseClickWindow: function(window, button) {
        return {
            action: `mouseClickWindow(${window}, ${button})`
        };
    },

    // Move mouse to specific coordinates
    moveMouse: function(x, y) {
        return {
            action: `moveMouse(${x}, ${y})`
        };
    },

    // Set global delay for all events
    setGlobalDelay: function(newDelay) {
        return {
            action: `setGlobalDelay(${newDelay})`
        };
    },
    //Runs lua macro from file.
    runFromFile: function(name){
        return{
            action:`runFromFile(${name})`
        };
    },


};