import { useState, useEffect } from 'react';

export function useDeviceDetect() {
  const [isMobile, setMobile] = useState(false);
  const [deviceType, setDeviceType] = useState('desktop');

  useEffect(() => {
    const userAgent = typeof window.navigator === "undefined" ? "" : navigator.userAgent;
    const mobile = Boolean(
      userAgent.match(
        /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
      )
    );
    setMobile(mobile);
    setDeviceType(mobile ? 'mobile' : 'desktop');
  }, []);

  return { isMobile, deviceType };
}