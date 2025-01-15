import React, { useState } from "react";
import "../CSS/CreateMacro.css";

const CreateMacro: React.FC = () => {
  const [blocks, setBlocks] = useState<any[]>([]);

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

  const handleBlockAdd = (selectedBlock: string) => {
    const newBlock = { type: selectedBlock, id: Date.now(), statement: [] };
    setBlocks([...blocks, newBlock]);
  };

  // Updated to handle nested blocks recursively
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

  // Updated to handle nested block removal
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
            <label>Type:</label>
            <input
              type="text"
              value={block.typeName || ""}
              onChange={(e) => onInputChange(block.id, "typeName", e.target.value)}
            />
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