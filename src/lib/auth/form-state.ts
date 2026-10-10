export type LoginActionState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: {
    email?: string[];
    password?: string[];
  };
  values?: {
    email?: string;
  };
};

export type DemoLoginActionState = {
  status: "idle" | "error";
  message?: string;
};

export type RegistrationActionState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Partial<Record<
    | "firstName"
    | "lastName"
    | "email"
    | "phone"
    | "companyName"
    | "legalName"
    | "city"
    | "country"
    | "password"
    | "confirmPassword",
    string[]
  >>;
  values?: {
    role?: "BUYER" | "SUPPLIER";
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    companyName?: string;
    legalName?: string;
    city?: string;
    country?: string;
  };
};
