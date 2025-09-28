import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authService from "@/services/auth.appwrite";
import { useAppDispatch } from "@/store/hook";
import { login } from "@/features/authSlice";
import { toast } from "@/hooks/use-toast";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "All fields are required.",
      });
      return;
    }

    setLoading(true);

    const { data, error } = await authService.signup(name, email, password);

    if (data) {
      const { data: user } = await authService.getCurrentUser();
      if (user) {
        dispatch(login(user));
        toast({
          title: "Account created",
          description: "Signed up successfully!",
        });
        navigate("/");
      }
    }

    if (error) {
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: error || "Something went wrong",
      });
    }

    setLoading(false);
  };

  return (
    <div className="w-full flex min-h-screen items-center justify-center px-4">
      <Card className="w-full md:w-[450px]">
        <CardHeader>
          <CardTitle className="text-center text-xl pt-3">Sign Up</CardTitle>
          <CardDescription className="text-center text-sm">
            Already have an account?{" "}
            <Link className="font-semibold" to="/login">
              Login
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSignup}>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="you@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <CardFooter className="flex justify-center p-0 pt-4">
              <Button className="w-full" disabled={loading} type="submit">
                {loading ? "Creating..." : "Sign Up"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
