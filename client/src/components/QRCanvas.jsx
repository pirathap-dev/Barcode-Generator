import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

export default function QRCanvas({ value, size=200, margin=2 }) {
  const ref = useRef();
  useEffect(() => {
    if (!value) return;
    QRCode.toCanvas(ref.current, value, { width: size, margin });
  }, [value, size, margin]);
  return <canvas ref={ref} />;
}
