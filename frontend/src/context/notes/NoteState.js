import React, { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props)=>{
    const host = "http://localhost:5000"
    const notesInitial=[]
    const [notes, setNotes]= useState(notesInitial)

    // fetch all note 
    const getNotes = async ()=>{
        // API CALL
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
            method: "GET", // *GET, POST, PUT, DELETE, etc.
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem('token')
            }
          });
          const json= await response.json();
          setNotes(json)
    }
    
    // Add a note 
    const addNote = async (title, description, tag)=>{
        // API CALL
        const response = await fetch(`${host}/api/notes/addnotes`, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem('token')
            },body: JSON.stringify({title, description, tag})
          });
          const note= await response.json();
        setNotes(notes.concat(note))
    }

    // Delete a note 
    const deleteNote = async (id)=>{
      // API CALL
      const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
        method: "DELETE", // *GET, POST, PUT, DELETE, etc.
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token')
        }
      });
      console.log(response)
        const newNotes = notes.filter((note)=>{return note._id!==id})
        setNotes(newNotes)
    }

    // Edit a note 
    const editNote = async (id, title, description, tag)=>{
        // API CALL
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: "PUT", // *GET, POST, PUT, DELETE, etc.
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem('token')
            },body: JSON.stringify({title, description, tag})
          });
          console.log(response)

          let newNotes = JSON.parse(JSON.stringify(notes))
        // Logic to edit in client
        for(let index=0; index < newNotes.length; index++){
            const element = newNotes[index];
            if(element._id === id){
                element.title = title;
                element.description = description;
                element.tag = tag;
            }
        }
        setNotes(newNotes);
    }

    return (
        <NoteContext.Provider value={{notes, addNote, deleteNote, editNote, getNotes}}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;