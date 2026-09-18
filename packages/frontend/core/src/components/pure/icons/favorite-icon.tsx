import { FavoritedIcon, FavoriteIcon } from '@blocksuite/icons/rc';
import clsx from 'clsx';
import { type SVGProps, useEffect, useRef, useState } from 'react';

import * as styles from './favorite-icon.css';

export const IsFavoriteIcon = ({
  favorite,
  className,
  ...props
}: { favorite?: boolean } & SVGProps<SVGSVGElement>) => {
  // Pop only when the user favorites while this icon is on screen. Rows in a
  // virtualized list mount already-favorited stars all the time as they
  // scroll into view, and those must stay still.
  const [popping, setPopping] = useState(false);
  const previous = useRef(favorite);
  useEffect(() => {
    if (favorite && previous.current === false) {
      setPopping(true);
    }
    previous.current = favorite;
  }, [favorite]);

  return favorite ? (
    <FavoritedIcon
      className={clsx(
        styles.favorited,
        popping && styles.justFavorited,
        className
      )}
      onAnimationEnd={() => setPopping(false)}
      {...props}
    />
  ) : (
    <FavoriteIcon className={className} {...props} />
  );
};
