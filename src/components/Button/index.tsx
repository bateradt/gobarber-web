import React, { ButtonHTMLAttributes } from 'react'

import { Container } from './styles';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }
// para pegar o conteúdo digitado no botão, foi criado o parâmetro childre, e o outro parâmetro ...rest é o restando das props do componente
const Button: React.FC<ButtonProps> = ({ children, loading, ...restProps }) => (
  <Container type="button" {...restProps}>
    {loading ? 'Carregando ...' : children}
  </Container>
);

export default Button;

