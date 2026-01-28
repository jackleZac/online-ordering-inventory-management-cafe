import React from 'react';
import { CiSquareMinus } from "react-icons/ci";
import { useDispatch } from 'react-redux';
import { minusItemQty } from './CartSlice';


export const MinusQuantity = ({ _id }) => {
  const dispatch = useDispatch();
  const handleMinusQuantity = () => {
    const item = {_id:_id };
    try {
      dispatch(minusItemQty(item));
      console.log(`AddQuantity button clicked: ${JSON.stringify(item)}`);
    } catch(error) {
      console.log(`AddQuantity button did not work as expected ${error}}`);
    }
  }
  return (
  <button onClick={() => handleMinusQuantity()} className="text-xl active:scale-105">
    <CiSquareMinus />
  </button>
  )
}
