import React, { useState, useEffect } from 'react';
import './todo.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import    { faMoon, faEdit, faTrash, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import empty from "./empty.png";

function Home() {
  const [notes, setNotes] = useState([]);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [filter, setFilter] = useState('All');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isEditNoteModalOpen, setIsEditNoteModalOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState({});

  const handleAddNote = () => {
    if (newNote.trim() !== '') {
      const id = notes.length + 1;
      setNotes([...notes, { id, text: newNote, completed: false }]);
      setNewNote('');
      setIsAddingNote(false);
    }
  };

  const handleToggleComplete = (id) => {
    setNotes(
      notes.map((note) =>
        note.id === id ? { ...note, completed: !note.completed } : note
      )
    );
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-theme', !darkMode);
  };

  const handleFilterChange = (filterOption) => {
    setFilter(filterOption);
    setDropdownVisible(false);
  };

  const handleEditNote = (id) => {
    const note = notes.find((note) => note.id === id);
    if (note) {
      setNoteToEdit(note);
      setIsEditNoteModalOpen(true);
    }
  };

  const handleSaveEditedNote = (editedText) => {
    setNotes(
      notes.map((note) => (note.id === noteToEdit.id ? { ...note, text: editedText } : note))
    );
    setIsEditNoteModalOpen(false);
  };

  const handleDeleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const filteredNotes = notes.filter((note) => {
    const matchesSearch = note.text.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === 'All') return matchesSearch;
    if (filter === 'Incomplete') return !note.completed && matchesSearch;
    if (filter === 'Complete') return note.completed && matchesSearch;
    return true;
  });

  useEffect(() => {
    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode !== null) {
      setDarkMode(JSON.parse(storedDarkMode));   
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <div className=" main-css todo-list-container" data-theme={darkMode ? 'dark' : 'light'}>
      <h1>TODO LIST</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search note..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <div className="buttons">
          <div className="dropdown">
            <button id='button1' onClick={() => setDropdownVisible(!dropdownVisible)}>
              All <FontAwesomeIcon icon={faChevronDown} />
            </button>
            {dropdownVisible && (
              <ul className="dropdown-menu">
                <li onClick={() => handleFilterChange('All')}>All</li>
                <li onClick={() => handleFilterChange('Incomplete')}>Incomplete</li>
                <li onClick={() => handleFilterChange('Complete')}>Complete</li>
              </ul>
            )}
          </div>
          <button id='button2' onClick={handleToggleDarkMode}>
            <FontAwesomeIcon icon={faMoon} />
          </button>
        </div>
      </div>
      {isAddingNote && (
        <div className="new-note-modal">
          <input
            type="text"
            placeholder="Input your note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <div className="modal-buttons">
            <button id='canbutton' onClick={() => setIsAddingNote(false)}>CANCEL</button>
            <button id='appbutton' onClick={handleAddNote}>APPLY</button>
          </div>
        </div>
      )}
      {isEditNoteModalOpen && (
        <div className="new-note-modal">
          <input
            type="text"
            placeholder="Edit note..."
            value={noteToEdit.text}
            onChange={(e) => setNoteToEdit({ ...noteToEdit, text: e.target.value })}
          />
          <div className="modal-buttons">
            <button id='canbutton' onClick={() => setIsEditNoteModalOpen(false)}>CANCEL</button>
            <button id='appbutton' onClick={() => handleSaveEditedNote(noteToEdit.text)}>SAVE</button>
          </div>
        </div>
      )}
      {filteredNotes.length === 0 ? (
        <div className="empty-list-message">
          <img src={empty} alt="Empty list image" />
          <p className='emp'>Empty...</p>
        </div>
      ) : (
        <ul className="note-list">
          {filteredNotes.map((note) => (
            <li key={note.id} className="note-item">
              <input
                type="checkbox"
                checked={note.completed}
                onChange={() => handleToggleComplete(note.id)}
              />
              <span className={note.completed ? 'completed' : ''}>{note.text}</span>
              <div className="note-actions">
                <button onClick={() => handleEditNote(note.id)}>
                  <FontAwesomeIcon className='edit' icon={faEdit} />
                </button>
                <button onClick={() => handleDeleteNote(note.id)}>
                  <FontAwesomeIcon className='edit' icon={faTrash} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <button className="add-button" onClick={() => setIsAddingNote(true)}>
        +
      </button>
    </div>
  );
}

export default Home;
