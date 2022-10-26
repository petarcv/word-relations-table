import React, { Fragment, useEffect } from "react";
import useLocalStorage from "./hooks/useLocalStorage.js";
import { nanoid } from "nanoid";
import { ReadOnlyRow } from "./components/ReadOnlyRow";

import "./App.css";
import api from "./api/posts";
// import data from "./mock-data-word-relations.json";
import EditRow from "./components/EditRow";
import { ToastContainer, toast } from "react-toast";

function App() {
  const [relations, setRelations] = useLocalStorage("relations", []);
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

  //decided to use axios to simplify the api calls
  //fake GET
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get("/items");
        setRelations(response.data);
      } catch (err) {}
    };
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleSetAddFormSubmit = async (e) => {
    e.preventDefault();

    const newRelation = {
      id: nanoid(),
      word1: addFormData.word1,
      word2: addFormData.word2,
      relation: addFormData.relation,
    };

    //fake POST
    try {
      const newRelations = [...relations, newRelation];
      if (wordEligibility(newRelations)) {
        const response = await api.post("/items", newRelation);
        const allRelations = [...relations, response.data];
        setRelations(allRelations);
      }
    } catch (err) {
      console.log("Error: ", err.message);
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

  //fake DELETE
  const handleDeleteClick = async (wordId) => {
    try {
      await api.delete(`/items/${wordId}`);
      const newRelations = [...relations];

      const i = relations.findIndex((word) => word.id === wordId);

      newRelations.splice(i, 1);

      setRelations(newRelations);
    } catch (err) {
      console.log("Error: ", err.message);
    }
  };

  return (
    <div className="app-container">
      <form onSubmit={handleEditFormSubmit}>
        <table className="word-table">
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
      <h2>Add words and relation</h2>
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
        <ToastContainer delay={3500} />
      </form>
    </div>
  );
}

export default App;
