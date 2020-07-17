import React, { ButtonHTMLAttributes } from 'react'

import { Container } from './styles';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

// para pegar o conteúdo digitado no botão, foi criado o parâmetro childre, e o outro parâmetro ...rest é o restando das props do componente
const Button: React.FC<ButtonProps> = ({ children, ...restProps }) => (
  <Container type="button" {...restProps}>
    {children}
  </Container>
);

export default Button;

