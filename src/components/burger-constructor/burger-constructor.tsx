import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../services/store';
import { useSelector, useDispatch } from '../../services/store';
import { isAuthenticated } from '../../services/slices/user';
import {
  getOrderModal,
  getOrderRequest,
  createOrder,
  clearOrderModal
} from '../../services/slices/orders';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userAuthenticated = useSelector(isAuthenticated);
  const orderRequest = useSelector(getOrderRequest);
  const orderData = useSelector(getOrderModal);
  const constructorItems = useSelector(
    (state: RootState) => state.burgerConstructor
  );

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!userAuthenticated) {
      return navigate('/login');
    }
    const burgerData = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((ingredient) => ingredient._id),
      constructorItems.bun._id
    ];
    dispatch(createOrder(burgerData));
  };
  const closeModal = () => {
    dispatch(clearOrderModal());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeModal}
    />
  );
};
