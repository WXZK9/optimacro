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
                        {/* Handle other statement types similarly */}
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

            {/* You can add more blocks similarly */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreateMacro;
