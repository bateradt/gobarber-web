import React, { useCallback, useRef, ChangeEvent, useEffect } from 'react';
import { FiMail, FiUser, FiLock, FiCamera, FiArrowLeft } from 'react-icons/fi';
import { useHistory, Link } from 'react-router-dom'
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup'; //esse tipo de importação irá importar tudo que tem na lib para a variavel Yup
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';
import { useAuth } from '../../hooks/auth';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, AvatarInput } from './styles';

interface IProfileFormData {
  name: string;
  email: string;
  old_password: string;
  new_password: string;
  con_password: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();
  const { user, updateUser } = useAuth();
  // console.log(user);
  // console.log(user.name);

  useEffect(() => {
    if (formRef.current) {
      formRef.current.setData({ name: user.name, email: user.email });
    }

  }, [user.name, user.email])

  const handleSubmit = useCallback(async (data: IProfileFormData) => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string().required('E-mail obrigatório').email('Digite um e-mail válido'),
        old_password: Yup.string(),
        new_password: Yup.string().when('old_password', {
          is: val => !!val.length,
          then: Yup.string().required('Campo obrigatório'),
          otherwise: Yup.string(),
        }),
        con_password: Yup.string().when('old_password', {
          is: val => !!val.length,
          then: Yup.string().required('Campo obrigatório'),
          otherwise: Yup.string(),
        }).oneOf([Yup.ref('new_password'), undefined], 'Confirmação incorreta!'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      const { name, email, old_password, new_password, con_password } = data;

      const updateData = Object.assign({ name, email }, data.old_password ? {
        old_password,
        password: new_password,
        password_confirmation: con_password,
      } : {});

      const response = await api.put('/profile', updateData);

      updateUser(response.data);

      addToast({
        type: 'success',
        title: 'Perfil atualizado!',
        description: 'Suas informações do perfil foram atualizadas com sucesso!',
      });

      history.push('/dashboard');

    } catch (err) {
      //capturar o response do erro err.response.data.message

      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
        formRef.current?.setErrors(errors);
        return;
      }

      addToast({
        type: 'error',
        title: 'Erro ao atualizar o perfil',
        description: err.response.data.message,
      });
    }
  }, [addToast, history, updateUser]);

  const handleAvatarChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const data = new FormData();
      data.append('avatar', e.target.files[0]);
      api.patch('users/avatar', data).then((response) => {
        updateUser(response.data);
        addToast({
          type: 'success',
          title: 'Avatar atualizado',
        });
      }).catch((e: Error) => {
        addToast({
          type: 'error',
          title: 'Erro ao atualizar Avatar ',
          description: e.message,
        });
      });
    }

  }, [addToast, updateUser])

  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>
      <Content>
        <Form ref={formRef}
          initialData={{ name: user.name, email: user.email }}
          onSubmit={handleSubmit} >
          <AvatarInput>
            <img src={user.avatar_url} alt={user.name}></img>
            <label htmlFor="avatar">
              <FiCamera />
              <input type="file" id="avatar" onChange={handleAvatarChange} />
            </label>
          </AvatarInput>

          <h1>Meu perfil</h1>

          <Input icon={FiUser} name="name" placeholder="Nome" />
          <Input icon={FiMail} name="email" placeholder="E-mail" />

          <Input icon={FiLock} containerStyle={{ marginTop: 24 }} name="old_password" type="password" placeholder="Senha atual" autocomplete="current-password" />
          <Input icon={FiLock} name="new_password" type="password" placeholder="Nova senha" autocomplete="new-password" />
          <Input icon={FiLock} name="con_password" type="password" placeholder="Confirmar senha" autocomplete="new-password" />
          <Button type="submit">Confirmar mudanças</Button>
        </Form>
      </Content>
    </Container>
  );

};

export default Profile;
