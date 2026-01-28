import { CiSquarePlus } from "react-icons/ci";
import { useDispatch } from 'react-redux';
import { addItemQty } from './CartSlice';

export const AddQuantity = ({ _id}) => {
  const dispatch = useDispatch();
  const handleAddQuantity = () => {
    const item = {_id:_id };
    try {
      dispatch(addItemQty(item));
      console.log(`AddQuantity button clicked: ${JSON.stringify(item)}`);
    } catch(error) {
      console.log(`AddQuantity button did not work as expected ${error}}`);
    }
  }
  return (
  <button onClick={() => handleAddQuantity()} className="text-xl active:scale-105">
    <CiSquarePlus />
  </button>
  )
}
