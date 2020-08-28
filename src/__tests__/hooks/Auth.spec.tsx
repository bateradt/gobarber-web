import { renderHook, act } from "@testing-library/react-hooks";
import { useAuth, AuthProvider } from "../../hooks/auth"
import MockAdapter from 'axios-mock-adapter';
import api from '../../services/api';

const apiMock = new MockAdapter(api);

describe('Auth hook', () => {

  it('should be able to sign in', async () => {

    const apiUser = {
      user: {
        id: "7c0634f3-999b-4551-8eae-c44da63e7093",
        name: "Jonh Doe",
        email: "jonhdoe@example.com.br",
        avatar: "4a6e3c2844d3eabf5724-images.jpg",
        created_at: "2020-07-23T04:36:19.175Z",
        updated_at: "2020-08-23T16:41:25.982Z",
        avatar_url: "http://192.168.0.50:3333/files/4a6e3c2844d3eabf5724-images.jpg"
      },
      token: "00NTUxLThlYWUtYzQ0ZGE2M2U3MDkzIn0.kCApf6GRN-XaSoh60lT-reEus5_l9stpdj_0tgtKYMg"
    };

    apiMock.onPost('sessions').reply(200, apiUser);

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    result.current.signIn({
      email: 'jonhdoe@example.com.br',
      password: '123456',
    });

    await waitForNextUpdate();

    expect(setItemSpy).toHaveBeenCalledWith("GoBarber:token", apiUser.token);
    expect(setItemSpy).toHaveBeenCalledWith("GoBarber:user", JSON.stringify(apiUser.user));

    expect(result.current.user.email).toEqual('jonhdoe@example.com.br');
  });

  it('should restore saved data from storage when auth inits', () => {

    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case 'GoBarber:token':
          return 'token-123';
        case 'GoBarber:user':
          return JSON.stringify({
            id: "7c0634f3-999b-4551-8eae-c44da63e7093",
            name: "Jonh Doe",
            email: "jonhdoe@example.com.br",
            avatar_url: "http://192.168.0.50:3333/files/4a6e3c2844d3eabf5724-images.jpg"
          });
        default:
          return null;
      }
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    console.log(result.current);

    expect(result.current.user.email).toEqual('jonhdoe@example.com.br');
  });

  it('should be able to sign out', async () => {

    const apiUser = {
      user: {
        id: "7c0634f3-999b-4551-8eae-c44da63e7093",
        name: "Jonh Doe",
        email: "jonhdoe@example.com.br",
        avatar: "4a6e3c2844d3eabf5724-images.jpg",
        created_at: "2020-07-23T04:36:19.175Z",
        updated_at: "2020-08-23T16:41:25.982Z",
        avatar_url: "http://192.168.0.50:3333/files/4a6e3c2844d3eabf5724-images.jpg"
      },
      token: "00NTUxLThlYWUtYzQ0ZGE2M2U3MDkzIn0.kCApf6GRN-XaSoh60lT-reEus5_l9stpdj_0tgtKYMg"
    };

    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case 'GoBarber:token':
          return 'token-123';
        case 'GoBarber:user':
          return JSON.stringify({
            apiUser
          });
        default:
          return null;
      }
    });

    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.signOut();
    });

    expect(removeItemSpy).toHaveBeenCalledTimes(2);
    expect(result.current.user).toBeUndefined();
  });

  it('should be able to update user data', async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    const user = {
      id: "7c0634f3-999b-4551-8eae-c44da63e7093",
      name: "Jonh Doe",
      email: "jonhdoe@example.com.br",
      avatar_url: "http://192.168.0.50:3333/files/4a6e3c2844d3eabf5724-images.jpg"
    };

    act(() => {
      result.current.updateUser(user);
    });

    expect(setItemSpy).toHaveBeenCalledWith('GoBarber:user', JSON.stringify(user));
    expect(result.current.user).toEqual(user);
  });

});
