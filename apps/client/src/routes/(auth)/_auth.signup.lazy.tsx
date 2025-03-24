import React from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { createLazyFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signUpUserSchema } from "@repo/shared/auth";

import { Button } from "@/components/ui/button";
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
import { useAuthStore } from "@/store/auth-store";

export const Route = createLazyFileRoute("/(auth)/_auth/signup")({
  component: RouteComponent,
});

function RouteComponent() {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const { register, handleSubmit } = useForm<z.infer<typeof signUpUserSchema>>({
    resolver: zodResolver(signUpUserSchema),
  });

  const onSubmit = async (data: z.infer<typeof signUpUserSchema>) => {
    setIsLoading(true);

    const res = await fetch("http://localhost:3000/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message);
    }

    const { user, accessToken } = await res.json();

    setAccessToken({ accessToken, userEmail: user.email });
    navigate({ to: "/" });
    setIsLoading(false);
  };

  return (
    <Card className="mx-auto w-full max-w-md gap-0">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">회원가입</CardTitle>
        <CardDescription className="sr-only">
          이메일과 비밀번호를 입력하여 회원가입을 진행해주세요.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4 p-6">
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              required
              {...register("email")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>

            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                {...register("password")}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">비밀번호 확인</Label>

            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                required
                {...register("confirmPassword")}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Link
              to="/login"
              className="text-muted-foreground text-sm font-normal hover:underline hover:underline-offset-4"
            >
              로그인 페이지로 이동
            </Link>
          </div>
        </CardContent>

        <CardFooter>
          <Button className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                회원가입 중...
              </>
            ) : (
              "회원가입"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
