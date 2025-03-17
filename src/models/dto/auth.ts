export interface SignUpDTO {
  name: string;
  email: string;
  password: string;
  title: string;
}

export const initSignUpDTO: SignUpDTO = {
  name: "",
  email: "",
  password: "",
  title: "",
};
