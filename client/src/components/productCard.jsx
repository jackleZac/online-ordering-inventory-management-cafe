import { useEffect, useState } from 'react';
import { SpinningCircles } from 'react-loading-icons';
import { AddItemToCart } from '../redux/handleCart/AddItemToCart';
import { AddQuantity } from '../redux/handleCart/AddQuantity';
import { MinusQuantity } from '../redux/handleCart/MinusQuantity';
import { RemoveItem } from '../redux/handleCart/RemoveItem';
import { RatingStars } from './Star';

export const ProductCard = ({ _id, name, imageKey, rating, description, price, accPrice, quantity, isAdmin, onEdit, onDelete, layout = 'column' }) => {
  const [imageError, setImageError] = useState(false);
  const [productImage, setProductImage] = useState();
  const [loading, setLoading] = useState(true);

  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const importImage = async () => {
      try {
        const imageUrl = `${SERVER_URL}/api/uploads/${imageKey}`;
        setProductImage(imageUrl);
      } catch (error) {
        console.log(`Error loading image: ${error.message}`);
        setImageError(true);
      } finally {
        setLoading(false);
      }
    };

    importImage();
  }, [imageKey]);

  // ROW layout for Cart
  if (layout === 'row') {
    return (
      <div className="bg-white flex flex-row items-center p-4 my-2 rounded-xl shadow-sm">
        {/* Image */}
        <div className="w-20 h-20 flex-shrink-0">
          {imageError ? (
            <SpinningCircles className="w-full h-full" />
          ) : (
            <img
              src={productImage}
              alt={name}
              style={{ width: '100%', maxHeight: '250px' }}
              className="mx-auto mt-2 rounded-xl"
            />
          )}
        </div>

        {/* Details */}
        <div className="flex-1 ml-4">
          <h1 className="text-lg font-bold">{name}</h1>
          <span className="text-sm text-gray-600">${accPrice ?? price}</span>
        </div>

        {/* Quantity controls */}
        <div className="flex items-center gap-2">
          <MinusQuantity _id={_id} name={name} price={price} quantity={quantity} />
          <span className="font-medium">{quantity}</span>
          <AddQuantity _id={_id} name={name} price={price} quantity={quantity} />
          <RemoveItem _id={_id} name={name} price={price} quantity={quantity} />
        </div>
      </div>
    );
  }

  // COLUMN layout for Menu (default)
  return (
    <div className="bg-white relative mx-2 my-3 p-6 w-80 h-160 max-sm:w-72 max-sm:mx-auto rounded-xl">
      <div className="image-card">
        {imageError ? (
          <SpinningCircles className="bg-[#808080] w-170 h-140" />
        ) : (
          <img
            src={productImage}
            alt={name}
            style={{ width: '100%', maxHeight: '250px' }}
            className="mx-auto mt-2 rounded-xl"
          />
        )}
      </div>
      <div className="mt-4 mx-2 text-left">
        <div className="py-2 flex justify-between">
          <h1 className="text-lg font-bold">{name}</h1>
          <div className="text-lg font-bold">RM{price.toFixed(2)}</div>
        </div>
        <div>
          <RatingStars rating={4.2} />
        </div>
        {description && <p className="py-6 text-m">{description}</p>}
        {isAdmin ? (
          <div className="flex space-x-2 mt-2">
            <button onClick={() => onEdit({ _id, name, imageKey, price })}>Edit</button>
            <button onClick={() => onDelete(_id)}>Delete</button>
          </div>
        ) : (
          <AddItemToCart _id={_id} name={name} imageKey={imageKey} price={price} />
        )}
      </div>
    </div>
  );
};