import { Button, Icon } from 'doif-react-kit';
import React from 'react';

export interface ButtonInfoProps {
  id: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function useButtons(
  buttonMap: any,
  buttons: Array<ButtonInfoProps>,
) {
  if (!buttonMap) {
    return <></>;
  }

  return (
    <>
      {buttons.map((button) => {
        const buttonInfo = buttonMap[button.id];

        if (!buttonInfo) {
          return null;
        }

        const icon = buttonInfo.icon ? <Icon icon={buttonInfo.icon} /> : null;

        return (
          <Button variant="ghost" key={button.id} onClick={button.onClick}>
            {icon}
            {buttonInfo.name}
          </Button>
        );
      })}
    </>
  );
}
