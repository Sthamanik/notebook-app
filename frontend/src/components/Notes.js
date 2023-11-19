import React,{ useContext, useEffect, useRef, useState } from 'react';
import noteContext from "../context/notes/noteContext";
import Noteitem from './Noteitem';
import AddNote from './AddNote';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';

const Notes = (props) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

    const context= useContext(noteContext);
    let navigate= useNavigate();
    const {showAlert} = props;
    const {notes, getNotes, editNote} = context;
    useEffect(()=>{
      if (localStorage.getItem('token')){
        getNotes();
      // eslint-disable-next-line
      }else{
        navigate("/login");
        showAlert("Please Login to continue" , "primary")
      }
      // eslint-disable-next-line
    }, [])
    const ref= useRef(null)
    const [note, setNote]= useState({id:"", title: "", edescription: "", etag: ""});

    const updateNote= (currentNote) =>{
      ref.current.click();
      setNote({
        id: currentNote._id,
        etitle: currentNote.title,
        edescription: currentNote.description, 
        etag: currentNote.tag
      });
    }
    
    const handleClick= (e)=>{
      props.showAlert("Updated successfully" , "success")
      editNote(note.id, note.etitle, note.edescription, note.etag);
      handleClose()
    }

    const onChange= (e)=>{
        setNote({...note, [e.target.name]: e.target.value})
    }

  return (
    <>
    <AddNote showAlert={props.showAlert}/>

    <Button variant="primary" ref={ref} onClick={handleShow} hidden>
        edit
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Note</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="my-3">
              <form>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Title</label>
                  <input type="text"  className="form-control"  id="etitle" name="etitle" value={note.etitle}  aria-describedby="titleHelp" onChange={onChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <input  type="text"  className="form-control"  id="edescription" name="edescription" value={note.edescription} onChange={onChange}/>
                </div>
                <div className="mb-3">
                  <label htmlFor="tag" className="form-label">Tag</label>
                  <input  type="text"  className="form-control"  id="etag" name="etag" value={note.etag} onChange={onChange} />
                </div>
              </form>
            </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClick} >
            Update Note
          </Button>
        </Modal.Footer>
      </Modal>
    <div className="container row my-3">
        <h2>Your Notes</h2>
        {notes.length === 0 && <p>No notes to display <i className="fa-solid fa-book-open-reader fa-fade fa-2xl"></i></p>}
        {notes.map((note)=>{
        return <Noteitem key={note._id} updateNote={updateNote} note={note} showAlert={props.showAlert}/>
        })}
    </div>
    </>
  )
}

export default Notes
