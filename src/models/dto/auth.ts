export interface SignUpDTO {
  name: string;
  email: string;
  password: string;
}

export const initSignUpDTO: SignUpDTO = {
  name: "",
  email: "",
  password: "",
};
