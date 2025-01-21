import { useMemo } from 'react';

interface ProductPriceProps {
  price: {
    current: number;
    min?: number;
    max?: number;
  };
  promotion?: {
    discountPercentage: number;
    startDate: string;
    endDate: string;
  } | null;
}

export default function ProductPrice({ price, promotion }: ProductPriceProps) {
  const isPromotionActive = useMemo(() => {
    if (!promotion) return false;
    const now = new Date();
    const startDate = new Date(promotion.startDate);
    const endDate = new Date(promotion.endDate);
    return now >= startDate && now <= endDate;
  }, [promotion]);

  const calculateDiscountedPrice = (originalPrice: number) => {
    if (!isPromotionActive) return originalPrice;
    const discount = originalPrice * (promotion!.discountPercentage / 100);
    return originalPrice - discount;
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (price.min !== undefined && price.max !== undefined) {
    const discountedMin = calculateDiscountedPrice(price.min);
    const discountedMax = calculateDiscountedPrice(price.max);

    return (
      <div className="space-y-1">
        {isPromotionActive && (
          <div className="text-lg text-gray-500 line-through">
            {formatPrice(price.min)} - {formatPrice(price.max)}
          </div>
        )}
        <div className="text-2xl font-bold text-gray-900">
          {formatPrice(discountedMin)} - {formatPrice(discountedMax)}
        </div>
        {isPromotionActive && (
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            {promotion!.discountPercentage}% OFF
          </div>
        )}
      </div>
    );
  }

  const discountedPrice = calculateDiscountedPrice(price.current);

  return (
    <div className="space-y-1">
      {isPromotionActive && (
        <div className="text-lg text-gray-500 line-through">
          {formatPrice(price.current)}
        </div>
      )}
      <div className="text-2xl font-bold text-gray-900">
        {formatPrice(discountedPrice)}
      </div>
      {isPromotionActive && (
        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          {promotion!.discountPercentage}% OFF
        </div>
      )}
    </div>
  );
}
