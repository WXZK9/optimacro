import React from "react";

const BlockRenderer = ({
  block,
  blockTypes,
  onBlockRemove,
  onInputChange,
  onStatementSelection,
  onStatementRemove,
}: any) => {
  return (
    <div key={block.id} className="block-item">
      <div className="block-header">
        <h3>{block.type} Block</h3>
        <button onClick={() => onBlockRemove(block.id)}>Remove</button>
      </div>

      {/* Render block-specific inputs */}
      {block.type === "for" && (
        <div>
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
      )}

      {block.type === "if" && (
        <div>
          <label>Condition:</label>
          <input
            type="text"
            value={block.condition || ""}
            onChange={(e) => onInputChange(block.id, "condition", e.target.value)}
          />

          <label>Statement:</label>
          <select
            onChange={(e) => onStatementSelection(block.id, e.target.value)}
          >
            <option value="">--Select Statement Block--</option>
            {blockTypes.map((blockType: string, index: number) => (
              <option key={index} value={blockType}>
                {blockType}
              </option>
            ))}
          </select>

          {/* Render nested statement blocks */}
          <div className="statement-blocks">
            {block.statement &&
              block.statement.map((stmt: any) => (
                <BlockRenderer
                  key={stmt.id}
                  block={stmt}
                  blockTypes={blockTypes}
                  onBlockRemove={(id: number) => onStatementRemove(block.id, id)}
                  onInputChange={onInputChange}
                  onStatementSelection={(id: number, type: string) =>
                    onStatementSelection(id, type)
                  }
                  onStatementRemove={(parentId: number, id: number) =>
                    onStatementRemove(parentId, id)
                  }
                />
              ))}
          </div>
        </div>
      )}

      {/* Render other block types similarly */}
      {block.type === "zmienna" && (
        <div>
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
      )}

      {/* Add cases for other block types */}
    </div>
  );
};

export default BlockRenderer;
