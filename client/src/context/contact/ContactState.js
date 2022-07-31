import React, { useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ContactContext from './contactContext';
import contactReducer from './contactReducer';
import {
  ADD_CONTACT,
  DELETE_CONTACT,
  SET_CURRENT,
  CLEAR_CURRENT,
  UPDATE_CONTACT,
  FILTER_CONTACTS,
  CLEAR_FILTER,
} from '../types';

const ContactState = (props) => {
  const initalState = {
    contacts: [
      {
        _id: '60f6baffea917d3f105bf0c0',
        name: 'Jane Doe',
        email: 'jane.doe@google.com',
        phone: '+971507602668',
        type: 'work',
        user: '60f68c1127ac703c18b37ca0',
        date: '2021-07-20T12:01:03.525Z',
      },
      {
        _id: '60f6baffea917d3f105bf0c1',
        name: 'Sam Smith',
        email: 'jane.doe@google.com',
        phone: '+971507602668',
        type: 'personal',
        user: '60f68c1127ac703c18b37ca0',
        date: '2021-07-20T12:01:03.525Z',
      },
      {
        _id: '60f6baffea917d3f105bf0c2',
        name: 'Harry White',
        email: 'jane.doe@google.com',
        phone: '+971507602668',
        type: 'professional',
        user: '60f68c1127ac703c18b37ca0',
        date: '2021-07-20T12:01:03.525Z',
      },
    ],
    current: null,
    filtered: null,
  };

  const [state, dispatch] = useReducer(contactReducer, initalState);

  // Add Contact
  const addContact = (contact) => {
    contact._id = uuidv4();
    dispatch({ type: ADD_CONTACT, payload: contact });
  };

  // Delete Contact
  const deleteContact = (_id) => {
    dispatch({ type: DELETE_CONTACT, payload: _id });
  };

  // Set Current Contact
  const setCurrent = (contact) => {
    dispatch({ type: SET_CURRENT, payload: contact });
  };

  // Clear Current Contact
  const clearCurrent = () => {
    dispatch({ type: CLEAR_CURRENT });
  };

  // Update Contact
  const updateContact = (contact) => {
    dispatch({ type: UPDATE_CONTACT, payload: contact });
  };

  // Filter Contacts
  const filterContacts = (text) => {
    dispatch({ type: FILTER_CONTACTS, payload: text });
  };

  // Clear Filter
  const clearFilter = () => {
    dispatch({ type: CLEAR_FILTER });
  };

  return (
    <ContactContext.Provider
      value={{
        contacts: state.contacts,
        current: state.current,
        filtered: state.filtered,
        addContact,
        deleteContact,
        setCurrent,
        clearCurrent,
        updateContact,
        filterContacts,
        clearFilter,
      }}
    >
      {props.children}
    </ContactContext.Provider>
  );
};

export default ContactState;
