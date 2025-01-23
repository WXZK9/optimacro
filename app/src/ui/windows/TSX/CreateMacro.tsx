import React, { useState } from "react";
import "../CSS/CreateMacro.css";

// NIE DOTYKAC BEZ KONTKATU 
// NIE USUWAC NIC 
interface BlockActions {
  for: (from: number, to: number, freq: number) => any;
  if: (condition: string, statement?: string) => any;
  zmienna: (name: string, value: string) => any;
  attachController: (luaState: string) => any;
  enterText: (text: string) => any;
  enterTextAdvanced: (text: string, window: number, delay: number) => any;
  getMouseLocation: () => any;
  getWindowUnderMouse: () => any;
  keySequence: (sequence: string) => any;
  keySequenceAdvanced: (sequence: string, window: number, delay: number) => any;
  mouseClick: (button: string) => any;
  mouseClickWindow: (window: number, button: string) => any;
  moveMouse: (x: number, y: number) => any;
  setGlobalDelay: (newDelay: number) => any;
  runFromFile: (name: string) => any;
  end: () => any;
  sleep: (time: number) => any;
  print:(text:string)=>any;

}

const blockActions: BlockActions = {
  for: (from, to, freq) => ({
    beginning: `for i = ${from}, ${to}, ${freq} do`
  }),
  if: (condition, statement = "then") => ({
    beginning: `if ${condition} ${statement}`,
    end: "end"
  }),
  end: () => ({
    action: "end"
  }),
  zmienna: ( name, value) => ({
    action: `local ${name} = ${value}`
  }),
  attachController: (luaState) => ({
    action: `event:attachController(${luaState})`
  }),
  enterText: (text) => ({
    action: `event:enterText("${text}")`
  }),
  enterTextAdvanced: (text, window, delay) => ({
    action: `event:enterTextAdvanced("${text}", ${window}, ${delay})`
  }),
  getMouseLocation: () => ({
    action: "local x,y = event:getMouseLocation()"
  }),
  getWindowUnderMouse: () => ({
    action: "event:getWindowUnderMouse()"
  }),
  keySequence: (sequence) => ({
    action: `event:keySequence("${sequence}")`
  }),
  keySequenceAdvanced: (sequence, window, delay) => ({
    action: `event:keySequenceAdvanced("${sequence}", ${window}, ${delay})`
  }),
  mouseClick: (button) => ({
    action: `event:mouseClick(${button})`
  }),
  mouseClickWindow: (window, button) => ({
    action: `event:mouseClickWindow(${window}, ${button})`
  }),
  moveMouse: (x, y) => ({
    action: `event:moveMouse(${x}, ${y})`
  }),
  setGlobalDelay: (newDelay) => ({
    action: `event:setGlobalDelay(${newDelay})`
  }),
  runFromFile: (name) => ({
    action: `event:runFromFile(${name})`
  }),
  sleep:(time)=>({
    action:`sleep(${time})`
  }),
  print:(text)=>({
    action:`print(${text})`
  })
};

const CreateMacro: React.FC = () => {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [generatedCode, setGeneratedCode] = useState<string>("");
  
  const blockTypes = [
    "for",
    "if",
    "end",
    "zmienna",
    "attachController",
    "enterText",
    "enterTextAdvanced",
    "getMouseLocation",
    "getWindowUnderMouse",
    "keySequence",
    "keySequenceAdvanced",
    "mouseClick",
    "mouseClickWindow",
    "moveMouse",
    "setGlobalDelay",
    "runFromFile",
    "print",
    "sleep",
  ];

  const generateCode = (blockList: any[], indentLevel: number = 0): string => {
    const indent = "  ".repeat(indentLevel);
    let code = "";

    blockList.forEach(block => {
      switch (block.type) {
        case "for":
          const forBlock = blockActions.for(
            Number(block.from) || 0,
            Number(block.to) || 0,
            Number(block.freq) || 1
          );
          code += `${indent}${forBlock.beginning}\n`;
          if (block.statement && block.statement.length > 0) {
            code += generateCode(block.statement, indentLevel + 1);
          }
          break;

        case "if":
          const ifBlock = blockActions.if(block.condition || "true");
          code += `${indent}${ifBlock.beginning}\n`;
          if (block.statement && block.statement.length > 0) {
            code += generateCode(block.statement, indentLevel + 1);
          }
          break;

        case "end":
          code += `${indent}${blockActions.end().action}\n`;
          break;

        case "zmienna":
          const zmiennaBlock = blockActions.zmienna(
            block.name || "variable",
            block.value || '""'
          );
          code += `${indent}${zmiennaBlock.action}\n`;
          break;

        case "attachController":
          code += `${indent}${blockActions.attachController("luaState").action}\n`;
          break;

        case "enterText":
          code += `${indent}${blockActions.enterText(block.text || "").action}\n`;
          break;

        case "enterTextAdvanced":
          code += `${indent}${blockActions.enterTextAdvanced(
            block.text || "",
            Number(block.window) || 0,
            Number(block.delay) || 0
          ).action}\n`;
          break;

        case "getMouseLocation":
          code += `${indent}${blockActions.getMouseLocation().action}\n`;
          break;

        case "getWindowUnderMouse":
          code += `${indent}${blockActions.getWindowUnderMouse().action}\n`;
          break;

        case "keySequence":
          code += `${indent}${blockActions.keySequence(block.sequence || "").action}\n`;
          break;

        case "keySequenceAdvanced":
          code += `${indent}${blockActions.keySequenceAdvanced(
            block.sequence || "",
            Number(block.window) || 0,
            Number(block.delay) || 0
          ).action}\n`;
          break;

        case "mouseClick":
          code += `${indent}${blockActions.mouseClick(block.button || "left").action}\n`;
          break;

        case "mouseClickWindow":
          code += `${indent}${blockActions.mouseClickWindow(
            Number(block.window) || 0,
            block.button || "left"
          ).action}\n`;
          break;

        case "moveMouse":
          code += `${indent}${blockActions.moveMouse(
            Number(block.x) || 0,
            Number(block.y) || 0
          ).action}\n`;
          break;

        case "setGlobalDelay":
          code += `${indent}${blockActions.setGlobalDelay(Number(block.newDelay) || 0).action}\n`;
          break;

        case "runFromFile":
          code += `${indent}${blockActions.runFromFile(block.name || "").action}\n`;
          break;
        case "print":
          code+=`${indent}${blockActions.print(block.text || "").action}\n`;
          break;
        case "sleep":
          code+=`${indent}${blockActions.sleep(Number(block.time) || 0).action}\n`
      }
    });

    return code;
  };
 // NIE USUWAC TS IGNORE
 const [name, setName] = useState('');
 const [shortcut, setShortcut] = useState('');
 
 const handleSaveCode = () => {
  if (generatedCode && name && shortcut) {
    //@ts-ignore
    window.electron.saveLuaCode(generatedCode, name, shortcut)
      .then((filePath: string) => {
        alert(`Code saved to: ${filePath}`);
      })
      .catch((error: any) => {
        console.error('Error saving code:', error);
        alert('Failed to save code');
      });
  } else {
    alert('Please fill in all fields');
  }
};


  const handleGenerateCode = () => {
    const code = generateCode(blocks);
    setGeneratedCode(code);
  };

  const handleBlockAdd = (selectedBlock: string) => {
    const newBlock = { type: selectedBlock, id: Date.now(), statement: [] };
    setBlocks([...blocks, newBlock]);
  };

 
  const updateNestedBlock = (blockId: number, updateFn: (block: any) => any, parentBlocks: any[] = blocks): any[] => {
    return parentBlocks.map(block => {
      if (block.id === blockId) {
        return { ...block, ...updateFn(block) };
      }
      if (block.statement && block.statement.length > 0) {
        return {
          ...block,
          statement: updateNestedBlock(blockId, updateFn, block.statement)
        };
      }
      return block;
    });
  };

  const handleInputChange = (blockId: number, inputName: string, value: string) => {
    setBlocks(updateNestedBlock(blockId, (block) => ({
      ...block,
      [inputName]: value,
    })));
  };

  const handleStatementSelection = (blockId: number, selectedBlockType: string) => {
    if (selectedBlockType) {
      setBlocks(updateNestedBlock(blockId, (block) => ({
        ...block,
        statement: [...block.statement, { 
          type: selectedBlockType, 
          id: Date.now(), 
          statement: [] 
        }],
      })));
    }
  };


  const handleBlockRemove = (blockId: number) => {
    const removeNestedBlock = (blocks: any[]): any[] => {
      return blocks.filter(block => block.id !== blockId).map(block => {
        if (block.statement && block.statement.length > 0) {
          return {
            ...block,
            statement: removeNestedBlock(block.statement)
          };
        }
        return block;
      });
    };

    setBlocks(removeNestedBlock(blocks));
  };
  
  return (
    <div className="create-macro-container">
      <h2>Create Lua Macro</h2>


      <label htmlFor="block-select">Select Block Type:</label>
      <select id="block-select" onChange={(e) => handleBlockAdd(e.target.value)}>
        <option value="">--Select Block--</option>
        {blockTypes.map((blockType, index) => (
          <option key={index} value={blockType}>
            {blockType}
          </option>
        ))}
      </select>

      <div className="added-blocks">
        {blocks.map((block) => (
          <BlockRenderer
            key={block.id}
            block={block}
            blockTypes={blockTypes}
            onBlockRemove={handleBlockRemove}
            onInputChange={handleInputChange}
            onStatementSelection={handleStatementSelection}
          />
        ))}
      </div>

      <div className="generate-code-section">
      <button className="generate-button" onClick={handleGenerateCode}>
        Generate Lua Code
      </button>
        {generatedCode && (
          <div className="generated-code">
            <pre>{generatedCode}</pre>
        <input 
          type="text" 
          placeholder="Enter Description" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Enter shortcut" 
          value={shortcut} 
          onChange={(e) => setShortcut(e.target.value)} 
        />
        <button className="save-button" onClick={handleSaveCode}>
          Save Lua Code
        </button>
        </div>
      )}
    </div>
    
    </div>
  );
};

const BlockRenderer: React.FC<{
  block: any;
  blockTypes: string[];
  onBlockRemove: (id: number) => void;
  onInputChange: (id: number, name: string, value: string) => void;
  onStatementSelection: (id: number, blockType: string) => void;
}> = ({
  block,
  blockTypes,
  onBlockRemove,
  onInputChange,
  onStatementSelection,
}) => {
  const renderBlockContent = () => {
    switch (block.type) {
      case "for":
        return (
          <div className="block-content">
            <label>From:</label>
            <input
              type="number"
              value={block.from || ""}
              onChange={(e) => onInputChange(block.id, "from", e.target.value)}
            />
            <label>To:</label>
            <input
              type="number"
              value={block.to || ""}
              onChange={(e) => onInputChange(block.id, "to", e.target.value)}
            />
            <label>Frequency:</label>
            <input
              type="number"
              value={block.freq || ""}
              onChange={(e) => onInputChange(block.id, "freq", e.target.value)}
            />
          </div>
        );

      case "if":
        return (
          <div className="block-content">
            <label>Condition:</label>
            <input
              type="text"
              value={block.condition || ""}
              onChange={(e) => onInputChange(block.id, "condition", e.target.value)}
            />
            <div className="statement-section">
              <label>Add Statement:</label>
              <select 
                value="" 
                onChange={(e) => onStatementSelection(block.id, e.target.value)}
              >
                <option value="">--Select Statement Block--</option>
                {blockTypes.map((blockType, index) => (
                  <option key={index} value={blockType}>
                    {blockType}
                  </option>
                ))}
              </select>
              
              <div className="nested-blocks">
                {block.statement.map((stmt: any) => (
                  <BlockRenderer
                    key={stmt.id}
                    block={stmt}
                    blockTypes={blockTypes}
                    onBlockRemove={onBlockRemove}
                    onInputChange={onInputChange}
                    onStatementSelection={onStatementSelection}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case "zmienna":
        return (
          <div className="block-content">
            
            <label>Name:</label>
            <input
              type="text"
              value={block.name || ""}
              onChange={(e) => onInputChange(block.id, "name", e.target.value)}
            />
            <label>Value:</label>
            <input
              type="text"
              value={block.value || ""}
              onChange={(e) => onInputChange(block.id, "value", e.target.value)}
            />
          </div>
        );

        case "attachController":
        return (
          <div className="block-content">
            <label>luaState:</label>
            <input
              type="text"
              value={block.luaState || ""}
              onChange={(e) => onInputChange(block.id, "luaState", e.target.value)}
            />
          </div>
        );

        case "enterText":
        return (
          <div className="block-content">
            <label>text:</label>
            <input
              type="text"
              value={block.text || ""}
              onChange={(e) => onInputChange(block.id, "text", e.target.value)}
            />
          </div>
        );

        case "enterTextAdvanced":
        return (
          <div className="block-content">
            <label>text:</label>
            <input
              type="text"
              value={block.text || ""}
              onChange={(e) => onInputChange(block.id, "text", e.target.value)}
            />
            <label>window:</label>
            <input
              type="number"
              value={block.window || ""}
              onChange={(e) => onInputChange(block.id, "window", e.target.value)}
            />
            <label>delay:</label>
            <input
              type="number"
              value={block.delay || ""}
              onChange={(e) => onInputChange(block.id, "delay", e.target.value)}
            />
          </div>
        );

        case "keySequence":
        return (
          <div className="block-content">
            <label>Sequence:</label>
            <input
              type="text"
              value={block.sequence || ""}
              onChange={(e) => onInputChange(block.id, "sequence", e.target.value)}
            />
          </div>
        );

        case "keySequenceAdvanced":
        return (
          <div className="block-content">
            <label>sequence:</label>
            <input
              type="text"
              value={block.sequence || ""}
              onChange={(e) => onInputChange(block.id, "sequence", e.target.value)}
            />
            <label>window:</label>
            <input
              type="number"
              value={block.window || ""}
              onChange={(e) => onInputChange(block.id, "window", e.target.value)}
            />
            <label>delay:</label>
            <input
              type="number"
              value={block.delay || ""}
              onChange={(e) => onInputChange(block.id, "delay", e.target.value)}
            />
          </div>
        );

        case "mouseClick":
        return (
          <div className="block-content">
            <label>button:</label>
            <input
              type="text"
              value={block.button || ""}
              onChange={(e) => onInputChange(block.id, "button", e.target.value)}
            />
          </div>
        );

        case "mouseClickWindow":
        return (
          <div className="block-content">
            <label>window:</label>
            <input
              type="number"
              value={block.window || ""}
              onChange={(e) => onInputChange(block.id, "window", e.target.value)}
            />
            <label>button:</label>
            <input
              type="text"
              value={block.button || ""}
              onChange={(e) => onInputChange(block.id, "button", e.target.value)}
            />
          </div>
        );

        case "moveMouse":
        return (
          <div className="block-content">
            <label>x:</label>
            <input
              type="number"
              value={block.x || ""}
              onChange={(e) => onInputChange(block.id, "x", e.target.value)}
            />
            <label>y:</label>
            <input
              type="number"
              value={block.y || ""}
              onChange={(e) => onInputChange(block.id, "y", e.target.value)}
            />
          </div>
        );

        case "setGlobalDelay":
        return (
          <div className="block-content">
            <label>newDelay:</label>
            <input
              type="number"
              value={block.newDelay || ""}
              onChange={(e) => onInputChange(block.id, "newDelay", e.target.value)}
            />
          </div>
        );

        case "runFromFile":
        return (
          <div className="block-content">
            <label>name:</label>
            <input
              type="text"
              value={block.name || ""}
              onChange={(e) => onInputChange(block.id, "name", e.target.value)}
            />
          </div>
        );

        case "sleep":
          return (
            <div className="block-content">
              <label>time:</label>
              <input
                type="number"
                value={block.time || ""}
                onChange={(e) => onInputChange(block.id, "time", e.target.value)}
              />
            </div>
          );

          case "print":
          return (
            <div className="block-content">
              <label>text to print:</label>
              <input
                type="text"
                value={block.text || ""}
                onChange={(e) => onInputChange(block.id, "text", e.target.value)}
              />
            </div>
          );

      default:
        return (
          <div className="block-content">
            <p>Block type: {block.type}</p>
          </div>
        );
    }
  };

  return (
    <div className="block-item">
      <div className="block-header">
        <h3>{block.type} Block</h3>
        <button onClick={() => onBlockRemove(block.id)}>Remove</button>
      </div>
      {renderBlockContent()}
    </div>
  );
};

export default CreateMacro;