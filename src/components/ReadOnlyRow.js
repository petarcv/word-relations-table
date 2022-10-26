import React from "react";

export const ReadOnlyRow = ({ word, handleEditClick, handleDeleteClick }) => {
  return (
    <tr>
      <td>{word.word1}</td>
      <td>{word.word2}</td>
      <td className="word-relation">{word.relation}</td>
      <td>
        <button type="button" onClick={(e) => handleEditClick(e, word)}>
          Edit
        </button>
        <button type="button" onClick={() => handleDeleteClick(word.id)}>
          Delete
        </button>
      </td>
    </tr>
  );
};
