// Interface for the "for loop" block
interface ForBlock {
    from: number;
    to: number;
    freq: number;
    beginning: string;
  }
  
  // Interface for the "if condition" block
  interface IfBlock {
    condition: string;
    statement: string;
    action: string;
  }
  
  // Interface for the "variable declaration" block
  interface ZmiennaBlock {
    type: string;
    name: string;
    value: string;
    combined: string;
  }
  
  // Interface for the "event control" block
  interface EventControlBlock {
    action: string;
  }
  
  // Interface for the "attach controller" event
  interface AttachControllerBlock extends EventControlBlock {
    action: string;
  }
  
  // Interface for the "enter text" event
  interface EnterTextBlock extends EventControlBlock {
    action: string;
  }
  
  // Interface for the "enter text with delay" event
  interface EnterTextAdvancedBlock extends EventControlBlock {
    action: string;
  }
  
  // Interface for getting the "mouse location" event
  interface GetMouseLocationBlock extends EventControlBlock {
    action: string;
  }
  
  // Interface for getting the "window under mouse" event
  interface GetWindowUnderMouseBlock extends EventControlBlock {
    action: string;
  }
  
  // Interface for sending a "key sequence" event
  interface KeySequenceBlock extends EventControlBlock {
    action: string;
  }
  
  // Interface for sending a "key sequence with delay" event
  interface KeySequenceAdvancedBlock extends EventControlBlock {
    action: string;
  }
  
  // Interface for "mouse click" event
  interface MouseClickBlock extends EventControlBlock {
    action: string;
  }
  
  // Interface for "mouse click on specified window" event
  interface MouseClickWindowBlock extends EventControlBlock {
    action: string;
  }
  
  // Interface for "move mouse" event
  interface MoveMouseBlock extends EventControlBlock {
    action: string;
  }
  
  // Interface for setting a "global delay"
  interface SetGlobalDelayBlock extends EventControlBlock {
    action: string;
  }
  
  // Interface for running a Lua macro from a file
  interface RunFromFileBlock extends EventControlBlock {
    action: string;
  }
  
  const blocks = {
    // Existing for loop block
    for: function(from: number, to: number, freq: number): ForBlock {
        return {
            from: from,
            to: to,
            freq: freq,
            beginning: `for i = ${from}, ${to}, ${freq} do`,
        };
    },

    // Existing if condition block
    if: function(condition: string, statement: string = "then"): IfBlock {
        return {
            condition: condition,
            statement: statement,
            action: `if ${condition} ${statement}`
        };
    },

    // Existing variable declaration block
    zmienna: function(type: string, name: string, value: string): ZmiennaBlock {
        return {
            type: type,
            name: name,
            value: value,
            combined: `${type} ${name} = ${value}`
        };
    },

    // Event Control Blocks:

    // Attach the event controller to the Lua state
    attachController: function(luaState: string): AttachControllerBlock {
        return {
            action: `attachController(${luaState})`
        };
    },

    // Send text to the current window
    enterText: function(text: string): EnterTextBlock {
        return {
            action: `enterText("${text}")`
        };
    },

    // Send text to a specified window with delay
    enterTextAdvanced: function(text: string, window: number, delay: number): EnterTextAdvancedBlock {
        return {
            action: `enterTextAdvanced("${text}", ${window}, ${delay})`
        };
    },

    // Get the current mouse location
    getMouseLocation: function(): GetMouseLocationBlock {
        return {
            action: `getMouseLocation()`
        };
    },

    // Get the window under the mouse
    getWindowUnderMouse: function(): GetWindowUnderMouseBlock {
        return {
            action: `getWindowUnderMouse()`
        };
    },

    // Send key sequence to the current window
    keySequence: function(sequence: string): KeySequenceBlock {
        return {
            action: `keySequence("${sequence}")`
        };
    },

    // Send key sequence to a specified window with delay
    keySequenceAdvanced: function(sequence: string, window: number, delay: number): KeySequenceAdvancedBlock {
        return {
            action: `keySequenceAdvanced("${sequence}", ${window}, ${delay})`
        };
    },

    // Mouse click on the current window
    mouseClick: function(button: string): MouseClickBlock {
        return {
            action: `mouseClick(${button})`
        };
    },

    // Mouse click on a specified window
    mouseClickWindow: function(window: number, button: string): MouseClickWindowBlock {
        return {
            action: `mouseClickWindow(${window}, ${button})`
        };
    },

    // Move mouse to specific coordinates
    moveMouse: function(x: number, y: number): MoveMouseBlock {
        return {
            action: `moveMouse(${x}, ${y})`
        };
    },

    // Set global delay for all events
    setGlobalDelay: function(newDelay: number): SetGlobalDelayBlock {
        return {
            action: `setGlobalDelay(${newDelay})`
        };
    },

    // Runs lua macro from file.
    runFromFile: function(name: string): RunFromFileBlock {
        return {
            action: `runFromFile(${name})`
        };
    },
};
