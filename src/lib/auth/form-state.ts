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
