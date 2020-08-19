import React, { InputHTMLAttributes, useEffect, useRef, useState, useCallback } from 'react';
import { IconBaseProps } from 'react-icons';
import { FiAlertCircle } from 'react-icons/fi';
import { useField } from '@unform/core';

import { Container, Error } from './styles';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  containerStyle?: object;
  autocomplete?: string;
  icon?: React.ComponentType<IconBaseProps>;
};

const Input: React.FC<InputProps> = ({ name, containerStyle = {}, icon: Icon, autocomplete, ...restProps }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { error, fieldName, registerField } = useField(name);
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
    setIsFilled(!!inputRef.current?.value);
    // o código acima é a mesma coisa que se fizer um if e um else para testar o valor
    // quando colocamos o !! ele irá transformar em um boolean
    //se tiver valor no campo inputRef.current?.value ele retorna true senão false
  }, []);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  return (
    <Container
      style={containerStyle}
      isErrored={!!error}
      isFocused={isFocused}
      isFilled={isFilled}>
      {Icon && <Icon size={20} />}
      <input
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        ref={inputRef}
        autoComplete={autocomplete || "off"}
        {...restProps} />
      {error &&
        <Error title={error}>
          <FiAlertCircle color="#c53030" size={20} />
        </Error>}
    </Container>
  );

};

export default Input;

