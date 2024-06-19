import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const SignUpPage = () => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { mutate: signUpMutation, isPending, isError, error } = useMutation({
    mutationFn: async (formData) => {
      try {
        const res = await fetch("http://localhost:3000/api/auth/signup", {
          credentials: "include", // Include credentials in the request
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create account");
        console.log(data);
        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Account created successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data) => {
    signUpMutation(data);
  };

  return (
    <div className="max-w-sm mx-auto mt-4 p-4 border rounded shadow-lg">
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold">Sign Up</h2>
        <p>Enter your information to create an account</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            type="email"
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            placeholder="m@example.com"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            id="password"
            type="password"
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && (
            <span className="text-red-500 text-sm">{errors.password.message}</span>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          {isPending ? "Loading..." : "Create an account"}
        </button>
        {isError && <p className="text-red-500 text-sm mt-2">{error.message}</p>}
      </form>
      <div className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <a href="/login" className="underline text-blue-500">
          Sign in
        </a>
      </div>
    </div>
  );
};

export default SignUpPage;
