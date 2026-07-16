import {
  ingredientsSlice,
  initialState,
  fetchIngredients
} from './ingredients';
import { TIngredient } from '@utils-types';

describe('reducer ingredientsSlice', () => {
  const ingredients: TIngredient[] = [
    {
      _id: '643d69a5c3f7b9001cfa0941',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main',
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'https://code.s3.yandex.net/react/code/meat-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
    }
  ];
  test('Данный автотест вернет начальное состояние, если состояние undefiend и action unknown', () => {
    const result = ingredientsSlice.reducer(undefined, { type: 'UNKNOWN' });

    expect(result).toEqual(initialState);
  });

  test('Данный автотест обрабатывает action fetchIngredients.pending', () => {
    const result = ingredientsSlice.reducer(
      initialState,
      fetchIngredients.pending('', undefined)
    );

    expect(result).toEqual({
      ...initialState,
      loading: true,
      error: null
    });
  });

  test('Данный автотест обрабатывает action fetchIngredients.rejected', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: 'Загрузка не удалась' }
    };

    const result = ingredientsSlice.reducer(initialState, action);

    expect(result).toEqual({
      ...initialState,
      loading: false,
      error: 'Загрузка не удалась'
    });
  });

  test('Данный автотест обрабатывает action fetchIngredients.fulfilled', () => {
    const result = ingredientsSlice.reducer(
      initialState,
      fetchIngredients.fulfilled(ingredients, '')
    );

    expect(result).toEqual({
      ...initialState,
      loading: false,
      ingredients
    });
  });
});
