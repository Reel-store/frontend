'use client';

import { MessageCircle, ExternalLink } from 'lucide-react';

export function OrderButton({
  whatsappNumber,
  externalLink,
  productName,
  price,
  btnBg,
  btnText,
  btnHover,
  accentStyle,
  compact = false,
  full = false,
}: {
  whatsappNumber?: string | null;
  externalLink?: string | null;
  productName: string;
  price: string;
  btnBg: string;
  btnText: string;
  btnHover: string;
  accentStyle?: React.CSSProperties;
  compact?: boolean;
  full?: boolean;
}) {
  const handleOrder = () => {
    if (whatsappNumber) {
      const msg = `Hi! I'm interested in: ${productName} — ₹${Number(price).toLocaleString('en-IN')}`;
      window.open(
        `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`,
        '_blank'
      );
    } else if (externalLink) {
      window.open(externalLink, '_blank');
    }
  };

  return (
    <button
      onClick={handleOrder}
      style={accentStyle}
      className={`
        ${compact ? 'px-3 py-1.5 text-xs' : full ? 'w-full py-3 px-4 text-sm' : 'w-full mt-2 py-2 px-3 text-xs'}
        font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors
        ${accentStyle ? '' : `${btnBg} ${btnHover}`}
        ${btnText}
      `}
    >
      {whatsappNumber ? (
        <>
          <MessageCircle className={full ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
          {full ? 'Order Now on WhatsApp' : 'Order'}
        </>
      ) : (
        <>
          <ExternalLink className={full ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
          {full ? 'View Product' : 'View'}
        </>
      )}
    </button>
  );
}