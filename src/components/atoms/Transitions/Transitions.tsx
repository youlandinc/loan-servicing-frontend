import { FC, useEffect, useRef } from 'react';
import { createUseStyles } from 'react-jss';

import { TransitionsProps } from './index';

export const Transitions: FC<TransitionsProps> = ({ ...rest }) => {
  const classes = useStyles();

  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (!mutation.addedNodes.length) {
          return;
        }

        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) {
            return;
          }

          node.addEventListener('animationend', (e) => {
            if (!e.animationName.includes('keyframes-in')) {
              return;
            }
            node.classList.remove(classes.item);
          });

          node.classList.add(classes.item);
        });
      });
    });

    if (root.current) {
      observer.observe(root.current, { childList: true });
    }

    return () => {
      observer.disconnect();
    };
  }, [classes]);

  return (
    <div ref={root} {...rest}>
      {rest.children}
    </div>
  );
};

const useStyles = createUseStyles({
  item: {
    animation: '$in 0.3s',
  },
  '@keyframes in': {
    from: {
      opacity: 0,
      transform: 'translateY(20px)',
    },
  },
});
