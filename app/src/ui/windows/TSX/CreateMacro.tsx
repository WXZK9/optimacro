import React, { useState } from "react";
import "../CSS/CreateMacro.css";

// Block types
const blockTypes = [
  "for",
  "if",
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
];

import blocksMethods from "../Blocks/Blocks.ts"; // Import the blocks.ts file

const mapBlocksToLua = (blockData: any[]): string[] => {
  return blockData.map((block) => {
    const { type } = block;

    switch (type) {
      case "for": {
        const { from, to, freq } = block;
        return blocksMethods.for(from, to, freq).beginning;
      }

      case "if": {
        const { condition, statement } = block;
        const conditionAction = blocksMethods.if(condition).action;

        
        const nestedStatements = statement
          ? mapBlocksToLua(statement).join("\n")
          : "";

        return `${conditionAction}\n${nestedStatements}\nend`;
      }

      case "zmienna": {
        const { typeName, name, value } = block;
        return blocksMethods.zmienna(typeName, name, value).combined;
      }

      case "attachController": {
        const { luaState } = block;
        return blocksMethods.attachController(luaState).action;
      }

      case "enterText": {
        const { text } = block;
        return blocksMethods.enterText(text).action;
      }

      case "enterTextAdvanced": {
        const { text, window, delay } = block;
        return blocksMethods.enterTextAdvanced(text, window, delay).action;
      }

      case "getMouseLocation": {
        return blocksMethods.getMouseLocation().action;
      }

      case "getWindowUnderMouse": {
        return blocksMethods.getWindowUnderMouse().action;
      }

      case "keySequence": {
        const { sequence } = block;
        return blocksMethods.keySequence(sequence).action;
      }

      case "keySequenceAdvanced": {
        const { sequence, window, delay } = block;
        return blocksMethods.keySequenceAdvanced(sequence, window, delay).action;
      }

      case "mouseClick": {
        const { button } = block;
        return blocksMethods.mouseClick(button).action;
      }

      case "mouseClickWindow": {
        const { window, button } = block;
        return blocksMethods.mouseClickWindow(window, button).action;
      }

      case "moveMouse": {
        const { x, y } = block;
        return blocksMethods.moveMouse(x, y).action;
      }

      case "setGlobalDelay": {
        const { newDelay } = block;
        return blocksMethods.setGlobalDelay(newDelay).action;
      }

      case "runFromFile": {
        const { name } = block;
        return blocksMethods.runFromFile(name).action;
      }

      default: {
        return "// Unknown block type";
      }
    }
  });
};


const CreateMacro: React.FC = () => {
  // State to manage selected blocks and dynamic inputs
  const [blocks, setBlocks] = useState<any[]>([]);

  // Function to handle adding a block
  const handleBlockAdd = (selectedBlock: string) => {
    const newBlock = { type: selectedBlock, id: Date.now() }; // Unique ID to distinguish blocks
    setBlocks([...blocks, newBlock]);
  };

  // Function to handle removal of a block
  const handleBlockRemove = (blockId: number) => {
    setBlocks(blocks.filter((block) => block.id !== blockId));
  };

  // Function to handle changes in block-specific inputs (e.g., for 'if' statement)
  const handleInputChange = (blockId: number, inputName: string, value: string) => {
    setBlocks(
      blocks.map((block) =>
        block.id === blockId ? { ...block, [inputName]: value } : block
      )
    );
  };

  // Function to handle selecting a block for the 'if' statement
  const handleStatementSelection = (blockId: number, selectedBlockType: string) => {
    const newStatementBlock = { type: selectedBlockType, id: Date.now() }; // Create a new statement block
    setBlocks(
      blocks.map((block) =>
        block.id === blockId
          ? { ...block, statement: [...(block.statement || []), newStatementBlock] }
          : block
      )
    );
  };

  // Function to handle removal of a block from the statement dropdown in 'if' block
  const handleStatementRemove = (blockId: number, statementId: number) => {
    setBlocks(
      blocks.map((block) =>
        block.id === blockId
          ? {
              ...block,
              statement: block.statement.filter((stmt: any) => stmt.id !== statementId),
            }
          : block
      )
    );
  };

  return (
    <div className="create-macro-container">
      <h2>Create Lua Macro</h2>

      {/* Select dropdown to choose block */}
      <label htmlFor="block-select">Select Block Type:</label>
      <select
        id="block-select"
        onChange={(e) => handleBlockAdd(e.target.value)}
      >
        <option value="">--Select Block--</option>
        {blockTypes.map((blockType, index) => (
          <option key={index} value={blockType}>
            {blockType}
          </option>
        ))}
      </select>

      {/* Render the selected blocks with dynamic inputs */}
      <div className="added-blocks">
        {blocks.map((block) => (
          <div key={block.id} className="block-item">
            <div className="block-header">
              <h3>{block.type} Block</h3>
              <button onClick={() => handleBlockRemove(block.id)}>Remove</button>
            </div>

            {/* Handle different block types */}
            {block.type === "for" && (
              <div>
                <label>From:</label>
                <input
                  type="number"
                  value={block.from || ""}
                  onChange={(e) => handleInputChange(block.id, "from", e.target.value)}
                />
                <label>To:</label>
                <input
                  type="number"
                  value={block.to || ""}
                  onChange={(e) => handleInputChange(block.id, "to", e.target.value)}
                />
                <label>Frequency:</label>
                <input
                  type="number"
                  value={block.freq || ""}
                  onChange={(e) => handleInputChange(block.id, "freq", e.target.value)}
                />
              </div>
            )}

            {block.type === "if" && (
              <div>
                <label>Condition:</label>
                <input
                  type="text"
                  value={block.condition || ""}
                  onChange={(e) => handleInputChange(block.id, "condition", e.target.value)}
                />

                <label>Statement:</label>
                {/* Dropdown for choosing another block as the statement */}
                <select
                  onChange={(e) => handleStatementSelection(block.id, e.target.value)}
                >
                  <option value="">--Select Statement Block--</option>
                  {blockTypes.map((blockType, index) => (
                    <option key={index} value={blockType}>
                      {blockType}
                    </option>
                  ))}
                </select>

                {/* Render the added statement blocks */}
                <div className="statement-blocks">
                  {block.statement &&
                    block.statement.map((stmt: any) => (
                      <div key={stmt.id} className="statement-block">
                        <h4>{stmt.type} Block</h4>
                        <button
                          onClick={() => handleStatementRemove(block.id, stmt.id)}
                        >
                          Remove
                        </button>
                        {/* Render inputs for the statement block */}
                        {stmt.type === "for" && (
                          <div>
                            <label>From:</label>
                            <input
                              type="number"
                              value={stmt.from || ""}
                              onChange={(e) =>
                                handleInputChange(stmt.id, "from", e.target.value)
                              }
                            />
                            <label>To:</label>
                            <input
                              type="number"
                              value={stmt.to || ""}
                              onChange={(e) =>
                                handleInputChange(stmt.id, "to", e.target.value)
                              }
                            />
                            <label>Frequency:</label>
                            <input
                              type="number"
                              value={stmt.freq || ""}
                              onChange={(e) =>
                                handleInputChange(stmt.id, "freq", e.target.value)
                              }
                            />
                          </div>
                        )}
                        {stmt.type === "zmienna" && (
                          <div>
                            <label>Type:</label>
                            <input
                              type="text"
                              value={stmt.typeName || ""}
                              onChange={(e) => handleInputChange(stmt.id, "typeName", e.target.value)}
                            />
                            <label>Name:</label>
                            <input
                              type="text"
                              value={stmt.name || ""}
                              onChange={(e) => handleInputChange(stmt.id, "name", e.target.value)}
                            />
                            <label>Value:</label>
                            <input
                              type="text"
                              value={stmt.value || ""}
                              onChange={(e) => handleInputChange(stmt.id, "value", e.target.value)}
                            />
                          </div>
                        )}

                        {stmt.type === "attachController" && (
                          <div>
                            <label>LuaState:</label>
                            <input
                              type="text"
                              value={stmt.luaState || ""}
                              onChange={(e) => handleInputChange(stmt.id, "luaState:", e.target.value)}
                            />
                          </div>
                        )}


                        {stmt.type === "enterText" && (
                          <div>
                            <label>Text:</label>
                            <input
                              type="text"
                              value={stmt.text || ""}
                              onChange={(e) => handleInputChange(stmt.id, "text", e.target.value)}
                            />
                          </div>
                        )}

                        {stmt.type === "enterTextAdvanced" && (
                          <div>
                            <label>Text:</label>
                            <input
                              type="text"
                              value={stmt.text || ""}
                              onChange={(e) => handleInputChange(stmt.id, "typeName", e.target.value)}
                            />
                            <label>Window:</label>
                            <input
                              type="number"
                              value={stmt.window || ""}
                              onChange={(e) => handleInputChange(stmt.id, "window", e.target.value)}
                            />
                            <label>Delay:</label>
                            <input
                              type="number"
                              value={stmt.delay || ""}
                              onChange={(e) => handleInputChange(stmt.id, "delay", e.target.value)}
                            />
                          </div>
                        )}
                        
                        {stmt.type === "keySequence" && (
                          <div>
                            <label>Sequence:</label>
                            <input
                              type="text"
                              value={stmt.sequence || ""}
                              onChange={(e) => handleInputChange(stmt.id, "sequence", e.target.value)}
                            />
                          </div>
                        )}

                        {stmt.type === "keySequenceAdvanced" && (
                          <div>
                            <label>Sqeuence:</label>
                            <input
                              type="text"
                              value={stmt.sequence || ""}
                              onChange={(e) => handleInputChange(stmt.id, "sequence", e.target.value)}
                            />
                            <label>Window:</label>
                            <input
                              type="number"
                              value={stmt.window || ""}
                              onChange={(e) => handleInputChange(stmt.id, "window", e.target.value)}
                            />
                            <label>delay:</label>
                            <input
                              type="number"
                              value={stmt.delay || ""}
                              onChange={(e) => handleInputChange(stmt.id, "delay", e.target.value)}
                            />
                          </div>
                        )}

                        {stmt.type === "mouseClick" && (
                          <div>
                            <label>Button:</label>
                            <input
                              type="text"
                              value={stmt.button || ""}
                              onChange={(e) => handleInputChange(stmt.id, "button", e.target.value)}
                            />
                          </div>
                        )}


                        {stmt.type === "mouseClickWindow" && (
                          <div>
                            <label>window:</label>
                            <input
                              type="number"
                              value={stmt.window || ""}
                              onChange={(e) => handleInputChange(stmt.id, "window", e.target.value)}
                            />
                            <label>button:</label>
                            <input
                              type="text"
                              value={stmt.button || ""}
                              onChange={(e) => handleInputChange(stmt.id, "button", e.target.value)}
                            />
                          </div>
                        )}

                        {stmt.type === "moveMouse" && (
                          <div>
                            <label>X:</label>
                            <input
                              type="number"
                              value={stmt.x || ""}
                              onChange={(e) => handleInputChange(stmt.id, "x", e.target.value)}
                            />
                            <label>Y:</label>
                            <input
                              type="number"
                              value={stmt.y || ""}
                              onChange={(e) => handleInputChange(stmt.id, "y", e.target.value)}
                            />
                          </div>
                        )}

                        {stmt.type === "setGlobalDelay" && (
                          <div>
                            <label>newDelay:</label>
                            <input
                              type="number"
                              value={stmt.newDelay || ""}
                              onChange={(e) => handleInputChange(stmt.id, "newDelay", e.target.value)}
                            />
                          </div>
                        )}

                        {stmt.type === "runFromFile" && (
                          <div>
                            <label>Name:</label>
                            <input
                              type="text"
                              value={stmt.name || ""}
                              onChange={(e) => handleInputChange(stmt.id, "name", e.target.value)}
                            />
                          </div>
                        )}
                      
                      </div>
                    ))}
                </div>
              </div>
            )}

            {block.type === "zmienna" && (
              <div>
                <label>Type:</label>
                <input
                  type="text"
                  value={block.typeName || ""}
                  onChange={(e) => handleInputChange(block.id, "typeName", e.target.value)}
                />
                <label>Name:</label>
                <input
                  type="text"
                  value={block.name || ""}
                  onChange={(e) => handleInputChange(block.id, "name", e.target.value)}
                />
                <label>Value:</label>
                <input
                  type="text"
                  value={block.value || ""}
                  onChange={(e) => handleInputChange(block.id, "value", e.target.value)}
                />
              </div>
            )}

            {block.type === "attachController" && (
              <div>
                <label>LuaState:</label>
                <input
                  type="text"
                  value={block.luaState || ""}
                  onChange={(e) => handleInputChange(block.id, "luaState:", e.target.value)}
                />
              </div>
            )}


            {block.type === "enterText" && (
              <div>
                <label>Text:</label>
                <input
                  type="text"
                  value={block.text || ""}
                  onChange={(e) => handleInputChange(block.id, "text", e.target.value)}
                />
              </div>
            )}

            {block.type === "enterTextAdvanced" && (
              <div>
                <label>Text:</label>
                <input
                  type="text"
                  value={block.text || ""}
                  onChange={(e) => handleInputChange(block.id, "typeName", e.target.value)}
                />
                <label>Window:</label>
                <input
                  type="number"
                  value={block.window || ""}
                  onChange={(e) => handleInputChange(block.id, "window", e.target.value)}
                />
                <label>Delay:</label>
                <input
                  type="number"
                  value={block.delay || ""}
                  onChange={(e) => handleInputChange(block.id, "delay", e.target.value)}
                />
              </div>
            )}
            
            {block.type === "keySequence" && (
              <div>
                <label>Sequence:</label>
                <input
                  type="text"
                  value={block.sequence || ""}
                  onChange={(e) => handleInputChange(block.id, "sequence", e.target.value)}
                />
              </div>
            )}

            {block.type === "keySequenceAdvanced" && (
              <div>
                <label>Sqeuence:</label>
                <input
                  type="text"
                  value={block.sequence || ""}
                  onChange={(e) => handleInputChange(block.id, "sequence", e.target.value)}
                />
                <label>Window:</label>
                <input
                  type="number"
                  value={block.window || ""}
                  onChange={(e) => handleInputChange(block.id, "window", e.target.value)}
                />
                <label>delay:</label>
                <input
                  type="number"
                  value={block.delay || ""}
                  onChange={(e) => handleInputChange(block.id, "delay", e.target.value)}
                />
              </div>
            )}

            {block.type === "mouseClick" && (
              <div>
                <label>Button:</label>
                <input
                  type="text"
                  value={block.button || ""}
                  onChange={(e) => handleInputChange(block.id, "button", e.target.value)}
                />
              </div>
            )}


            {block.type === "mouseClickWindow" && (
              <div>
                <label>window:</label>
                <input
                  type="number"
                  value={block.window || ""}
                  onChange={(e) => handleInputChange(block.id, "window", e.target.value)}
                />
                <label>button:</label>
                <input
                  type="text"
                  value={block.button || ""}
                  onChange={(e) => handleInputChange(block.id, "button", e.target.value)}
                />
              </div>
            )}

            {block.type === "moveMouse" && (
              <div>
                <label>X:</label>
                <input
                  type="number"
                  value={block.x || ""}
                  onChange={(e) => handleInputChange(block.id, "x", e.target.value)}
                />
                <label>Y:</label>
                <input
                  type="number"
                  value={block.y || ""}
                  onChange={(e) => handleInputChange(block.id, "y", e.target.value)}
                />
              </div>
            )}

            {block.type === "setGlobalDelay" && (
              <div>
                <label>newDelay:</label>
                <input
                  type="number"
                  value={block.newDelay || ""}
                  onChange={(e) => handleInputChange(block.id, "newDelay", e.target.value)}
                />
              </div>
            )}

            {block.type === "runFromFile" && (
              <div>
                <label>Name:</label>
                <input
                  type="text"
                  value={block.name || ""}
                  onChange={(e) => handleInputChange(block.id, "name", e.target.value)}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreateMacro;
