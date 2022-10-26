import React, { Fragment } from "react";
import useLocalStorage from "./hooks/useLocalStorage.js";
import { nanoid } from "nanoid";
import { ReadOnlyRow } from "./components/ReadOnlyRow";

import "./App.css";
import data from "./mock-data-word-relations.json";
import EditRow from "./components/EditRow";
import { ToastContainer, toast } from "react-toast";

function App() {
  const [relations, setRelations] = useLocalStorage("relations", data);
  const [addFormData, setAddFormData] = useLocalStorage("formData", {
    word1: "",
    word2: "",
    relation: "",
  });
  const [editFormData, setEditFormData] = useLocalStorage("editFormData", {
    word1: "",
    word2: "",
    relation: "",
  });

  const [editRelationId, setEditRelationId] = useLocalStorage(null);

  const areRotations = (str1, str2) => {
    return str1.length === str2.length && (str1 + str1).indexOf(str2) !== -1;
  };

  const handleAddFormChange = (e) => {
    e.preventDefault();

    const fieldName = e.target.getAttribute("name");
    const fieldValue = e.target.value;

    const newFormData = { ...addFormData };
    newFormData[fieldName] = fieldValue;

    setAddFormData(newFormData);
  };

  const handleEditFormChange = (e) => {
    e.preventDefault();

    const fieldName = e.target.getAttribute("name");
    const fieldValue = e.target.value;

    const newFormData = { ...editFormData };
    newFormData[fieldName] = fieldValue;

    setEditFormData(newFormData);
  };

  const handleSetAddFormSubmit = (e) => {
    e.preventDefault();

    const newRelation = {
      id: nanoid(),
      word1: addFormData.word1,
      word2: addFormData.word2,
      relation: addFormData.relation,
    };

    const newRelations = [...relations, newRelation];

    if (wordEligibility(newRelations)) {
      setRelations(newRelations);
    }
  };

  const wordEligibility = (wordRelation) => {
    const newRelations = wordRelation;

    const words1 = newRelations.map(({ word1 }) => word1.toLowerCase());
    const words2 = newRelations.map(({ word2 }) => word2.toLowerCase());

    let lastIndex = newRelations.length - 1;
    let lastElement = newRelations[lastIndex];
    let lastWord1 = lastElement.word1.toLowerCase();
    let lastWord2 = lastElement.word2.toLowerCase();

    for (let i = 0; i < newRelations.length - 1; i++) {
      if (areRotations(lastWord1, lastWord2)) {
        toast.error("Words are rotations of each other, it's not allowed");
        return;
      } else if (
        (words1[i] === lastWord1 || words1[i] === lastWord2) &&
        (words2[i] === lastWord1 || words2[i] === lastWord2)
      ) {
        toast.error("Relation between those words already exists");
        return;
      }
    }
    return true;
  };

  const handleEditFormSubmit = (e) => {
    e.preventDefault();

    const editedWords = {
      id: editRelationId,
      word1: editFormData.word1,
      word2: editFormData.word2,
      relation: editFormData.relation,
    };
    const newRelations = [...relations];

    const i = relations.findIndex((word) => word.id === editRelationId);

    newRelations[i] = editedWords;

    setRelations(newRelations);
    setEditRelationId(null);
  };

  const handleEditClick = (e, word) => {
    e.preventDefault();
    setEditRelationId(word.id);

    const formValues = {
      word1: word.word1,
      word2: word.word2,
      relation: word.relation,
    };

    setEditFormData(formValues);
  };

  const handleCancelClick = () => {
    setEditRelationId(null);
  };

  const handleDeleteClick = (wordId) => {
    const newRelations = [...relations];

    const i = relations.findIndex((word) => word.id === wordId);

    newRelations.splice(i, 1);

    setRelations(newRelations);
  };

  return (
    <div className="app-container">
      <form onSubmit={handleEditFormSubmit}>
        <table>
          <thead>
            <tr>
              <th>Word 1</th>
              <th>Word 2</th>
              <th>Relation</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {relations.map((word) => (
              <Fragment>
                {editRelationId === word.id ? (
                  <EditRow
                    handleCancelClick={handleCancelClick}
                    editFormData={editFormData}
                    handleEditFormChange={handleEditFormChange}
                  />
                ) : (
                  <ReadOnlyRow
                    word={word}
                    handleEditClick={handleEditClick}
                    handleDeleteClick={handleDeleteClick}
                  />
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </form>
      <h2>Add relations and relation</h2>
      <form onSubmit={handleSetAddFormSubmit}>
        <input
          type="text"
          name="word1"
          required="required"
          placeholder="Enter the first word..."
          pattern="[a-zA-Z]{2,18}"
          title="Use only letters, up to word length of 18"
          onChange={handleAddFormChange}
        ></input>
        <input
          type="text"
          name="word2"
          required="required"
          placeholder="Enter the second word..."
          onChange={handleAddFormChange}
          pattern="[a-zA-Z]{2,18}"
          title="Use only letters, up to word length of 18"
        ></input>
        <input
          type="text"
          name="relation"
          required="required"
          placeholder="Enter the relation..."
          pattern="[a-zA-Z]{2,18}"
          title="Use only letters, up to word length of 18"
          onChange={handleAddFormChange}
        ></input>
        <button type="submit">Add</button>
        <ToastContainer />
      </form>
    </div>
  );
}

export default App;
