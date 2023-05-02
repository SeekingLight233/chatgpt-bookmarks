import React, { useState } from 'react';
import type { PlasmoCSConfig } from 'plasmo';
import './base.css';
import { createStyles } from '~utils/base';

export const config: PlasmoCSConfig = {
  matches: ['https://chat.openai.com/*'],
};

export const getShadowHostId = () => 'edit-bookmark-modal';

const EditBookmarkModal = () => {
  const [title, setTitle] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = () => {
    console.log('Title:', title);
  };

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <div style={styles.header}>
          <span>Provide bookmark title</span>
          <button onClick={() => console.log('Cancel clicked')}>Cancel</button>
        </div>
        <textarea
          style={styles.textarea}
          value={title}
          onChange={handleInputChange}
          rows={5}
        />
        <button style={styles.confirmButton} onClick={handleSubmit}>
          Confirm
        </button>
      </div>
    </div>
  );
};

const styles = createStyles({
  modal: {
    position: 'absolute',
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#202123',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    width: '400px',
    borderRadius: '4px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'white',
    marginBottom: '20px',
  },
  textarea: {
    flexGrow: 1,
    backgroundColor: '#343541',
    color: 'white',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '20px',
  },
  confirmButton: {
    backgroundColor: '#343541',
    color: 'white',
    padding: '10px',
    borderRadius: '4px',
    textAlign: 'center',
    cursor: 'pointer',
  },
});

export default EditBookmarkModal;
