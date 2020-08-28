import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Signin from '../../pages/Signin';

jest.setTimeout(50000);

const mockedHistoryPush = jest.fn(); //crio uma variavel que irá apontar para a função vazia do Jest
const mockedSignIn = jest.fn();
const mockedAddToast = jest.fn();

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

jest.mock('react-router-dom', () => {
  return {
    //aqui iremos falar que o useHistory é vazio mas irá retornar uma função chamada push também vazia
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('../../hooks/auth', () => {
  return {
    useAuth: () => ({
      signIn: mockedSignIn,
    }),
  };
});

describe('Signin Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
    // mockedAddToast.mockClear();
    // mockedSignIn.mockClear();
  })


  it('should be able to sign in', async () => {
    // const result = render(<SignIn />); // renderiza a página inteira e retorna em uma variavel
    const { getByPlaceholderText, getByText, getByTestId } = render(<Signin />); // desestruturação do objeto e pego as funções que vou utilizar

    const emailField = getByPlaceholderText('E-mail'); // neste caso ele está buscando na página de SignIn o campo que tenha o placeholder com o nome "E-mail"
    const passwordField = getByPlaceholderText('Senha'); //mesmo caso acima
    // const ButtonElement = getByText('Entrar'); //captura pelo conteúdo do campo neste caso o Button tem o texto Entrar.

    const ButtonElement = getByTestId('button-entrar');

    fireEvent.change(emailField, { target: { value: 'jonhdoe@example.com' } });
    fireEvent.change(passwordField, { target: { value: '123456' } });

    // está função fireEvent irá disparar qualquer evento que o usuário possa executar na página da web, no caso acima
    //ele está simulando o OnChange de um input, ou seja, conforme vai digitando o conteúdo
    fireEvent.click(ButtonElement);
    //simula o click no button

    //como criamos uma variavel do tipo jest.fn, ele irá preencher essa variavél caso o login funcione, pois lá na página
    // signin após efetuar o login ele é redirecionado para o dashboard através do useHistory.push e essa função que foi mockada
    //irá simular isso

    await waitFor(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard');
    });
  });


  it('should not be able to sign in with invalid credentials', async () => {
    const result = render(<Signin />); // renderiza a página inteira e retorna em uma variavel
    const { getByPlaceholderText, getByText } = result; // desestruturação do objeto e pego as funções que vou utilizar

    const emailField = getByPlaceholderText('E-mail'); // neste caso ele está buscando na página de SignIn o campo que tenha o placeholder com o nome "E-mail"
    const passwordField = getByPlaceholderText('Senha'); //mesmo caso acima
    const ButtonElement = getByText('Entrar'); //captura pelo conteúdo do campo neste caso o Button tem o texto Entrar.

    fireEvent.change(emailField, { target: { value: 'not-valid-email' } });
    fireEvent.change(passwordField, { target: { value: '123456' } });
    // está função fireEvent irá disparar qualquer evento que o usuário possa executar na página da web, no caso acima
    //ele está simulando o OnChange de um input, ou seja, conforme vai digitando o conteúdo
    fireEvent.click(ButtonElement);
    //simula o click no button

    //como criamos uma variavel do tipo jest.fn, ele irá preencher essa variavél caso o login funcione, pois lá na página
    // signin após efetuar o login ele é redirecionado para o dashboard através do useHistory.push e essa função que foi mockada
    //irá simular isso

    await waitFor(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    });
  });

  it('should display an error if login fails', async () => {
    mockedSignIn.mockImplementation(() => {
      throw new Error('Erro no login')
    });

    const result = render(<Signin />); // renderiza a página inteira e retorna em uma variavel
    const { getByPlaceholderText, getByText } = result; // desestruturação do objeto e pego as funções que vou utilizar

    const emailField = getByPlaceholderText('E-mail'); // neste caso ele está buscando na página de SignIn o campo que tenha o placeholder com o nome "E-mail"
    const passwordField = getByPlaceholderText('Senha'); //mesmo caso acima
    const ButtonElement = getByText('Entrar'); //captura pelo conteúdo do campo neste caso o Button tem o texto Entrar.

    fireEvent.change(emailField, { target: { value: 'jonhdoe@example.com' } });
    fireEvent.change(passwordField, { target: { value: '123456' } });
    // está função fireEvent irá disparar qualquer evento que o usuário possa executar na página da web, no caso acima
    //ele está simulando o OnChange de um input, ou seja, conforme vai digitando o conteúdo
    fireEvent.click(ButtonElement);
    //simula o click no button

    //como criamos uma variavel do tipo jest.fn, ele irá preencher essa variavél caso o login funcione, pois lá na página
    // signin após efetuar o login ele é redirecionado para o dashboard através do useHistory.push e essa função que foi mockada
    //irá simular isso

    await waitFor(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(expect.objectContaining({ type: 'error' }));
    });
  });
});
