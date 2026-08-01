"use client"
import store from '@/store';
import { Provider } from 'react-redux';
import { useEffect } from 'react';
import { cartActions } from '@/store/cart-slice';
import type { CartItem } from '@/models/states/cart-state';

const ReactReduxProvider = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
      const saved = window.localStorage.getItem('famplants-cart');
      let items: CartItem[] = [];
      try { items = saved ? JSON.parse(saved) as CartItem[] : []; } catch { items = []; }
      store.dispatch(cartActions.hydrateCart(items));
      return store.subscribe(() => {
        window.localStorage.setItem('famplants-cart', JSON.stringify(store.getState().cart.items));
      });
    }, []);

    return (
      <Provider store={store}>{children}</Provider>
    );
  };
  
  export default ReactReduxProvider;
