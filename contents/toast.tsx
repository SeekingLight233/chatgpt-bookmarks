import type { PlasmoCSConfig } from 'plasmo';
import React, { useEffect, useState } from 'react';
import { appStore } from '~model/app';
import { createStyles } from '~utils/base';

export const config: PlasmoCSConfig = {
  matches: ["https://chat.openai.com/*"]
}

const Toast = ({ duration = 2500 }) => {

  const { curToastMsg } = appStore


  useEffect(() => {
    const timer = setTimeout(() => {
      appStore.curToastMsg = null
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, curToastMsg]);


  if (curToastMsg == null) return null;

  return (
    <div style={styles.toast}>
      {curToastMsg}
    </div>
  );
};

const styles = createStyles({
  toast: {
    position: 'fixed',
    top: 20,
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(52, 54, 65, 0.9)', // dark color
    color: 'rgb(236,236,241)', // light text color
    padding: '10px 20px',
    borderRadius: 8, // rounded corners
    textAlign: 'center',
    transition: 'top 0.5s ease',
    zIndex: 1000, // ensure it's on top of other elements
  },
});

export default Toast;
