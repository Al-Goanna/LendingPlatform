import {useEffect} from 'react';
import {useLocation} from 'react-router-dom';

/**
 * Scrolls to top of page on every render.
 */
export default function ScrollToTop() {
  const {pathname} = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: -100,
      behavior: 'instant',
    });
  }, [pathname]);
}
