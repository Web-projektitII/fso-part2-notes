import React, { useState, useEffect, useRef } from 'react'
import Note from './components/Note'
import Notification from './components/Notification'
import Footer from './components/Footer'
import {Datalist,Button} from './components/Lomake'
import noteService from './services/notes'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  //const [readyNote, setReadyNote] = useState('')
  const [showAll, setShowAll] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  let timerID = useRef(null);

  console.log(`rendering App,newNote:${newNote}`)
  useEffect(() => {
    console.log(`running useEffect, alustus`)
    noteService
      .getAll()
      .then(initialNotes => {
      setNotes(initialNotes)
      console.log(`muutettu notes-tilaa: ${initialNotes}`)
    })
    }, [])

  /*useEffect(() => {
  console.log(`running useEffect, valmis note:${readyNote}`);
  if (!readyNote) return;
  const note = loytyi(readyNote);
  if (note) {
    console.log(`Löytyi:${note.content} (${note.lkm + 1})`)
    updateNoteDelay(note);
    setReadyNote('');
    }
  else {
    addNoteDelay(readyNote);
    setReadyNote('');
    }   
  }, [readyNote])*/

  const loytyi = teksti => {
    const note = notes.find(n => n.content.toUpperCase() === teksti.toUpperCase());
    return note;
    }
 
  const addNoteDelay = content => {
    const noteObject = {
      content: content,
      date: new Date().toISOString(),
      important: Math.random() > 0.5,
      lkm: 1
      }
    noteService.create(noteObject)
      .then(returnedNote => {
      setNotes(notes.concat(returnedNote))
      setNewNote('')
      alert(`Lisätty ${content}`)
      })
    }

  const updateNoteDelay = note => {
    const id = note.id;
    const lkm = (note.lkm) ? note.lkm + 1 : 2;
    const changedNote = { ...note, lkm: lkm}
    noteService.update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(n => n.id !== id ? n : returnedNote))
        setNewNote('');  
        alert(`Löytyi ${note.content}, nyt ${changedNote.lkm} kpl.`)
        })
      .catch(error => {
        setErrorMessage(
          `Note '${note.content}' was removed from server`
          )
        setTimeout(() => {
            setErrorMessage(null)
          }, 5000)  
        })
      }

  const addReadyNote = (ready) => {
    const note = loytyi(ready);
    if (note) {
      console.log(`Löytyi:${note.content} (${note.lkm + 1})`)
      updateNoteDelay(note);
      }
    else {
      addNoteDelay(ready);
      }   
    }    

  const addNote = event => {
    if (event) event.preventDefault();
    if (timerID.current) clearTimeout(timerID.current)
    if (!newNote) {
      alert('Virhe: muistiinpano puuttuu.')
      return;
      }
    addReadyNote(newNote);  
    }

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }
    noteService.update(id, changedNote)
    .then(returnedNote => {
      setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
    .catch(error => {
      setErrorMessage(
        `Note '${note.content}' was already removed from server`
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    })    
  }

  /*const checkDatalist = (value) => {
    console.log(`checkDataList ${value}`)
    const o = document.getElementById('valinnat').options;
    var options = [...o];  
    const note = options.find(option => option.value === value)
    if (note) {
      console.log(`checkDatalist,id:${note.key},note:${note.value}`);
      }
    else console.log('Ei löytynyt datalistalta');
    return (note);
    }*/

  const handleNoteChange = event => {
    let value = event.target.value;
    console.log(`handleNoteChange:${value}`);
    startInputTimer(value);
    setNewNote(value);
    }

  const startInputTimer = note => {
    if (timerID.current) clearTimeout(timerID.current)
    if (note) {
      timerID.current = setTimeout(() => {
      addReadyNote(note)},2500)
      }
    }
    
  /*if (readyNote) {
    const note = loytyi(readyNote);
    if (note) {
      console.log(`Löytyi:${note.content} (${note.lkm + 1})`)
      updateNoteDelay(note);
      setReadyNote('');
      }
    else {
      addNoteDelay(readyNote);
      setReadyNote('');
      }   
    }*/

  const notesToShow = showAll
  ? notes
  : notes.filter(note => note.important)

  return (
    <div className="site-container">
      <div className="site-content">
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>   
      <ul>
        {notesToShow.map(note => 
            <Note
              key={note.id}
              note={note} 
              toggleImportance={() => toggleImportanceOf(note.id)}
            />
        )}
      </ul>
      <form id="lomake" onSubmit={addNote}>
        <Datalist
          value={newNote}
          onChange={handleNoteChange}
          notes={notes}
        />
        <Button type="submit" text="save"/>
      </form>  
      </div>
      <Footer />
    </div>
  )
}

export default App