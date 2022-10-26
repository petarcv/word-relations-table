import React from "react";

const EditRow = ({ editFormData, handleEditFormChange, handleCancelClick }) => {
  return (
    <tr>
      <td>
        <input
          type="text"
          required="required"
          placeholder="Enter the first word..."
          name="word1"
          onChange={handleEditFormChange}
          value={editFormData.word1}
          pattern="[a-zA-Z]{2,18}"
          title="Use only letters, up to word length of 18"
        ></input>
      </td>
      <td>
        <input
          type="text"
          required="required"
          placeholder="Enter the second word..."
          name="word2"
          onChange={handleEditFormChange}
          value={editFormData.word2}
          pattern="[a-zA-Z]{2,18}"
          title="Use only letters, up to word length of 18"
        ></input>
      </td>
      <td>
        <input
          type="text"
          required="required"
          placeholder="Enter the relation..."
          name="relation"
          onChange={handleEditFormChange}
          value={editFormData.relation}
          pattern="[a-zA-Z]{2,18}"
          title="Use only letters, up to word length of 18"
        ></input>
      </td>
      <td>
        <button type="submit">Save</button>
        <button onClick={handleCancelClick}>Cancel</button>
      </td>
    </tr>
  );
};

export default EditRow;
