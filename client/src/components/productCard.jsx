import { useEffect, useState } from 'react';
import { SpinningCircles } from 'react-loading-icons';
import { AddItemToCart } from '../redux/handleCart/AddItemToCart';
import { RatingStars } from './Star';

export const ProductCard = ({ _id, name, imageKey, rating, description, price, isAdmin, onEdit, onDelete }) => {
  const [imageError, setImageError] = useState(false);
  const [productImage, setProductImage] = useState()

  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const importImage = async () => {
      try {
        const imageUrl = `${SERVER_URL}/api/uploads/${imageKey}`;
        setProductImage(imageUrl);
      } catch (error) {
        console.log(`Error loading image: ${error.message}`)
        setImageError(true);
      } finally {
        setLoading(false);
      }
    }

    importImage();
  }, [imageKey]);

  return (
    <div className="relative mx-2 my-3 w-80 h-160 max-sm:w-72 max-sm:mx-auto rounded-xl">
      {/* Image */}
      <div className="image-card">
        {imageError ? (
          <SpinningCircles className='bg-[#808080] w-170 h-140'/>
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
      <div className="mt-4 mx-2 text-left">
        <div className="py-2 flex justify-between">
          <h1 className="text-lg font-bold">{name}</h1>
          <div className="text-lg font-bold">RM{price.toFixed(2)}</div>
        </div>
        <div>
        {/* rating here */}
        <RatingStars rating={4.2} />
        </div>
        {description && (
          <p className='py-6 text-m'>{description}</p>
        )}
        {/* Edit and Delete Buttons*/}
        {isAdmin ? (
        <div className="flex space-x-2 mt-2">
          <button onClick={() => onEdit({ _id, name, price })}>Edit</button>
          <button onClick={() => onDelete(_id)}>Delete</button>
        </div>
        ) : (
          <AddItemToCart _id={_id} name={name} price={price} />
        )}
      </div> 
    </div>
  );
};
