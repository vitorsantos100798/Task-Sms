import React from 'react';
import { render } from 'test-utils';

import { SignIn } from '.';

// jest.doMock('react-native-paper', () => {
//   return {
//     stopBackgroundTimer: jest.fn(),
//     runBackgroundTimer: jest.fn(),
//   };
// });

describe('SignIn screen', () => {
  it('renders correctly', () => {
    render(<SignIn />);
  });

  // it('renders components successfully', async () => {
  //   const { getByTestId, getByText } = render(<SignIn />, {
  //     wrapper: AppProvider,
  //   });

  //   expect(
  //     getByText('A plataforma N°1 em Automação de Marketing para o Varejo')
  //   ).toBeTruthy();

  //   expect(
  //     getByText(
  //       'Para continuar, insira seu login e senha que recebeu por email'
  //     )
  //   ).toBeTruthy();

  //   expect(getByTestId('email-input')).toBeTruthy();
  //   expect(getByTestId('password-input')).toBeTruthy();
  //   expect(getByTestId('forgot-password-button')).toBeTruthy();
  //   expect(getByTestId('sign-in-button')).toBeTruthy();
  // });

  // it('should navigate to Forgot Password screen', async () => {
  //   const { getByTestId, findByText } = render(<AuthStackNavigator />, {
  //     wrapper: AppProvider,
  //   });

  //   act(() => {
  //     fireEvent.press(getByTestId('forgot-password-button'));
  //   });

  //   const newBody = await findByText('Qual o seu -email?');

  //   expect(newBody).toBeTruthy();
  // });

  // it('should call signIn function', async () => {
  //   const email = 'test@email.com';
  //   const password = 'password';

  //   const { getByTestId } = render(<SignIn />, {
  //     wrapper: AppProvider,
  //   });

  //   const emailInput = getByTestId('email-input');
  //   const passwordInput = getByTestId('password-input');
  //   const signInButton = getByTestId('sign-in-button');

  //   act(() => {
  //     fireEvent.changeText(emailInput, email);
  //     fireEvent.changeText(passwordInput, password);
  //   });

  //   expect(emailInput.props.value).toBe(email);
  //   expect(passwordInput.props.value).toBe(password);

  //   act(() => {
  //     fireEvent.press(signInButton);
  //   });

  // expect(mockedSignIn).toHaveBeenCalledWith(email, password);
  // });
});
