import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cart: [],
  total: null,
};

/*  Cart Properties
  _id: string,
  name: string,
  imageKey: string,
  initialPrice: number,
  accPrice: number,
  quantity: number,
*/

// Update the total cost for all items in a cart
const calcTotal = (cart) => {
  return cart.reduce((acc, item) => acc + item.accPrice, 0);
};

export const CartSlice = createSlice({
  name: 'CartSliceName',
  initialState: initialState,
  reducers: {
    addToCart: (state, action) => {
      try {
        const itemToAdd = action.payload;
        // Check if similar item already exists in a cart
        const existingItem = state.cart.find(item => item._id === itemToAdd._id);
        if (existingItem) {
          // If similar item exists, update quantity and price accordingly
          existingItem.quantity += itemToAdd.quantity;
          existingItem.accPrice = existingItem.initialPrice * existingItem.quantity;
        } else {
          // Otherwise, add the new item with _id, name, imageKey, initialPrice, accPrice, quantity: 1
          state.cart = [...state.cart, { ...itemToAdd }];
        }
      } catch (err) {
        console.log(`addToCart did not work as expected. ${err}`);
      } finally {
        state.total = calcTotal(state.cart);
      }
    },
    deleteItem: (state, action) => {
      try {
        const itemToRemove = action.payload;
        // Find similar item by _id
        const updatedCart = state.cart.filter(item => item._id !== itemToRemove._id);
        // Remove item, return the updated cart
        state.cart = updatedCart;
      } catch (err) {
        console.log(err);
      } finally {
        state.total = calcTotal(state.cart);
      }
    },
    addItemQty: (state, action) => {
      try {
        const itemToAdd = action.payload;
        // Find item to update
        const existingItem = state.cart.find(item => item._id === itemToAdd._id);
        console.log(existingItem);
        if (existingItem) {
          // If found, update quantity and recalculate price accordingly
          existingItem.quantity += 1;
          existingItem.accPrice = existingItem.initialPrice * existingItem.quantity;
        };
      } catch (err) {
        console.log(err);
      } finally {
        state.total = calcTotal(state.cart);
      }
    },
    minusItemQty: (state, action) => {
      try {
        const itemToDeduct = action.payload;
        // Find similar item by _id
        const existingItem = state.cart.find(item => item._id === itemToDeduct._id);
        console.log(existingItem);
        if (existingItem.quantity > 1) {
          // If similar item exists, update quantity and price accordingly
          existingItem.quantity -= 1;
          existingItem.accPrice = existingItem.initialPrice * existingItem.quantity;
        } else {
          const updatedCart = state.cart.filter(item => item._id !== itemToDeduct._id);
          // Remove item, return the updated cart
          state.cart = updatedCart;
        };
      } catch (err) {
        console.log(err);
      } finally {
        state.total = calcTotal(state.cart);
      }
    },
  },
});

export const { addToCart, deleteItem, addItemQty, minusItemQty, showTotal} = CartSlice.actions;
export const itemsInCart = (state) => state.CartSliceName.cart;
export const itemsTotalPrice = (state) => state.CartSliceName.total;
export default CartSlice.reducer;