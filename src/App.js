import React, { useState, useEffect } from 'react'
import Note from './components/Note'
import Notification from './components/Notification'
import Footer from './components/Footer'
import {Datalist,Button} from './components/Lomake'
import noteService from './services/notes'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  console.log(`rendering App,newNote:${newNote}`)
  useEffect(() => {
    console.log(`running useEffect`)
    noteService
      .getAll()
      .then(initialNotes => {
      setNotes(initialNotes)
      console.log(`muutettu notes-tilaa: ${initialNotes}`)
    })
    }, [])

  const addNoteOrg = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() > 0.5,
      lkm: 1
      }

    noteService
      .create(noteObject)
        .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }
  
    noteService
    .update(id, changedNote)
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

  const addNote = (event) => {
    console.log(`running addNote,newNote:${newNote}`)
    const note = notes.find(n => n.content === newNote)
    if (!note) {
      addNoteOrg(event)
      }
    else {
      console.log(`${note.content} (${note.lkm + 1}),uusi:${newNote}`)
      const changedNote = { ...note, lkm: note.lkm + 1}
      noteService
      .update(note.id, changedNote)
      .then(returnedNote => {
      setNotes(notes.map(n => n.id !== note.id ? n : returnedNote))
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
} 

  const checkDatalist = (value) => {
    console.log(`checkDataList ${value}`)
    /* Etsitään datalistalta */
    const o = document.getElementById('valinnat').options;
    //for (let item of o) console.log(`option:${item.value}`);
    var options = [...o];  
    const note = options.find(option => option.value === value)
    if (note) {
      console.log(`checkDatalist,note:${note.value}`);
      
      }
    else console.log('Ei löytynyt datalistalta');
    return (note ? true : false);
    }

  const handleNoteChange = (event) => {
    if (timerID) clearTimeout(timerID);
    let value = event.target.value;
    console.log(`handleNoteChange:${value}`);
    setNewNote(value);
    }

  let timerID; 
  const startInputTimer = (note) => {
      timerID = setTimeout(() => {
      checkDatalist(note)},2000)
    }  
  
  if (newNote) startInputTimer(newNote); 

  const notesToShow = showAll
  ? notes
  : notes.filter(note => note.important)

  if (newNote && checkDatalist(newNote)) {
    console.log(`Valittu listalta,newNote:${newNote}`)
    //console.log(`lomake.current:${lomake.current}`)
    //lomake.current.submit()
    document.getElementById('painike').click()
    }   

  //console.log(`Suoritetaan return:${newNote},${notes}`)
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