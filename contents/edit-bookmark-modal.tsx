import React, { useState } from 'react';
import type { PlasmoCSConfig } from 'plasmo';
import "./styles/base.css";
import { createStyles } from '~utils/base';
import { appStore, setShowEditBookmarkModal } from '~model/app';
import { bookmarkStore, setTitle } from '~model/bookmark';

export const config: PlasmoCSConfig = {
  matches: ['https://chat.openai.com/*'],
};

export const getShadowHostId = () => 'edit-bookmark-modal';

const EditBookmarkModal = () => {

  const { curTitle, curSessionId, curBookmarkId, onSave } = bookmarkStore;

  const { showEditBookmarkModal } = appStore

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = () => {
    onSave({
      title: curTitle,
      sessionId: curSessionId,
      bookmarkId: curBookmarkId,
    });
  };

  return (
    <>
      {showEditBookmarkModal && <div style={styles.modal}>
        <div style={styles.modalContent}>
          <div style={styles.header}>
            <span>Provide bookmark title</span>
            <button onClick={() => setShowEditBookmarkModal(false)}>Cancel</button>
          </div>
          <textarea
            style={styles.textarea}
            value={curTitle}
            onChange={handleInputChange}
            rows={5}
          />
          <button style={styles.confirmButton} onClick={handleSubmit}>
            Confirm
          </button>
        </div>
      </div>}
    </>

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
