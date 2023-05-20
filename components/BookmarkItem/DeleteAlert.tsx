
import * as React from 'react';
import CheckIcon from '~components/Icons/CheckIcon';
import CrossIcon from '~components/Icons/CrossIcon';
import { styles } from '.';
import { useMemoizedFn } from 'ahooks';

interface AlertProps {
  onConfirm: () => void;
  onCancel: () => void;
}


const AlertIcons: React.FC<AlertProps> = ({ onCancel, onConfirm }) => {

  const handleClickCheck = useMemoizedFn((e) => {
    e.stopPropagation();
    onConfirm()
  })

  const handleClickCross = useMemoizedFn((e) => {
    e.stopPropagation();
    onCancel()
  })

  return <>
    <CheckIcon onClick={handleClickCheck} style={styles.rightIcon}></CheckIcon>
    <CrossIcon onClick={handleClickCross} style={styles.rightIcon}></CrossIcon>
  </>
}

export default AlertIcons