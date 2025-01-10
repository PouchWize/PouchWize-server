export interface CreateUserRequestBody {
  body: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
}

export interface LoginUserRequestBody {
  body: {
    email: string;
    password: string;
  };
}

export interface GetUserParams {
  id: string;
}
