import React from 'react'
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

const Note = ({ note, toggleImportance, deleteNote }) => {
  const label = note.important
    ? 'make not important' : 'make important'

  return (
    <li className='note'>
      <span>{note.content}</span>
      <span> ({note.lkm}) </span> 
      <button onClick={toggleImportance}>{label}</button>
      <IconButton onClick={deleteNote} size="small" color="secondary">
      <DeleteIcon />
      </IconButton>
    </li>
  )
}

export default Note
