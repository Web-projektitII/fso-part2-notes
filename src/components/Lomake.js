import React from 'react'

const Input = (props) => {
  return (
    <input 
      value={props.value}
      onChange={props.onChange}>
    </input>
  )
}

const Button = ({type,text}) => 
<input id="painike" type={type} value={text}></input>
      
const Datalist = (props) => 
    (
      <>  
      <input
        id="valinta"
        value={props.value} 
        onChange={props.onChange}
        list="valinnat"/>
      <datalist id="valinnat">
        {props.notes.map(note => (
            <option key={note.id} value={note.content}/>
        ))}  
      </datalist>
      </>
      )
    

export {Input,Button,Datalist}
