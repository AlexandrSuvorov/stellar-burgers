import {
  constructorSlice,
  initialState,
  addIngredient,
  deleteIngredient,
  moveIngredientUp,
  moveIngredientDown,
  resetConstructor
} from './burger-constructor';
import { TIngredient } from '@utils-types';

describe('reducer burgerConstructor', () => {
  const testBun: TIngredient = {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  };

  const firstTestSauce: TIngredient = {
    _id: '643d69a5c3f7b9001cfa0942',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
  };

  const secondTestSauce: TIngredient = {
    _id: '643d69a5c3f7b9001cfa0943',
    name: 'Соус фирменный Space Sauce',
    type: 'sauce',
    proteins: 50,
    fat: 22,
    carbohydrates: 11,
    calories: 14,
    price: 80,
    image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-04-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-04-large.png'
  };

  test('Данный автотест вернет начальное состояние, если состояние undefiend и action unknown', () => {
    const result = constructorSlice.reducer(undefined, { type: 'UNKNOWN' });
    expect(result).toEqual(initialState);
  });

  test('Данный автотест добавляет булку в testBun', () => {
    const action = addIngredient(testBun);
    const result = constructorSlice.reducer(initialState, action);

    expect(result.bun).toEqual({
      ...testBun,
      id: action.payload.id
    });
    expect(result.ingredients).toEqual([]);
  });

  test('Данный автотест добавляет начинку в ingredients', () => {
    const action = addIngredient(firstTestSauce);
    const result = constructorSlice.reducer(initialState, action);

    expect(result.bun).toBeNull();
    expect(result.ingredients).toEqual([
      {
        ...firstTestSauce,
        id: action.payload.id
      }
    ]);
  });

  test('Данный автотест удаляет ингредиент по идентификатору', () => {
    const firstAction = addIngredient(firstTestSauce);
    const secondAction = addIngredient(secondTestSauce);

    const stateWithIngredients = constructorSlice.reducer(
      constructorSlice.reducer(initialState, firstAction),
      secondAction
    );

    const result = constructorSlice.reducer(
      stateWithIngredients,
      deleteIngredient({
        ...stateWithIngredients.ingredients[0]
      })
    );

    expect(result.ingredients).toEqual([
      {
        ...secondTestSauce,
        id: secondAction.payload.id
      }
    ]);
  });

  test('Данный автотест меняет ингредиенты местами вверх', () => {
    const firstAction = addIngredient(firstTestSauce);
    const secondAction = addIngredient(secondTestSauce);

    const stateWithIngredients = constructorSlice.reducer(
      constructorSlice.reducer(initialState, firstAction),
      secondAction
    );

    const result = constructorSlice.reducer(
      stateWithIngredients,
      moveIngredientUp(1)
    );

    expect(result.ingredients[0].name).toBe('Соус фирменный Space Sauce');
    expect(result.ingredients[1].name).toBe('Соус Spicy-X');
  });

  test('Данный автотест меняет ингредиенты местами вниз', () => {
    const firstAction = addIngredient(firstTestSauce);
    const secondAction = addIngredient(secondTestSauce);

    const stateWithIngredients = constructorSlice.reducer(
      constructorSlice.reducer(initialState, firstAction),
      secondAction
    );

    const result = constructorSlice.reducer(
      stateWithIngredients,
      moveIngredientDown(0)
    );

    expect(result.ingredients[0].name).toBe('Соус фирменный Space Sauce');
    expect(result.ingredients[1].name).toBe('Соус Spicy-X');
  });

  test('Данный автотест сбрасывает состояние конструктора бургера', () => {
    const stateWithData = {
      bun: {
        ...testBun,
        id: 'test-id'
      },
      ingredients: [
        {
          ...firstTestSauce,
          id: 'test-id-1'
        }
      ],
      orderRequest: true,
      orderModalData: null,
      error: 'error'
    };

    const result = constructorSlice.reducer(stateWithData, resetConstructor());

    expect(result).toEqual(initialState);
  });
});
