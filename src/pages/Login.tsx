import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginSchemaType } from "@/schema/schemas";
import authService from "@/services/auth.appwrite";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState } from "react";
import { useAppDispatch } from "@/store/hook";
import { login } from "@/features/authSlice";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginSchemaType) => {
    setLoading(true);

    const result = await authService.login(values.email, values.password);

    if (result.data) {
      const userRes = await authService.getCurrentUser();
      if (userRes.data) {
        dispatch(login(userRes.data));
        toast.success("Login Successful", {
          description: `Welcome back`,
        });
      }
      navigate("/");
    } else if ("error" in result && result.error) {
      toast.error("Login Failed", {
        description: result.error,
      });
    }

    setLoading(false);
  };

  return (
    <div className=" w-full flex min-h-screen items-center justify-center px-4">
      <Card className="w-full md:w-[450px]">
        <CardHeader>
          <CardTitle className="text-center text-xl pt-3">Login</CardTitle>
          <CardDescription className="text-center text-sm">
            Don't have an account?{" "}
            <Link className="font-semibold" to={"/signup"}>
              Sign up
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="Enter your email"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <CardFooter className="flex justify-center p-0 pt-2">
              <Button
                className="w-full tracking-wide"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Sign In"
                )}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
