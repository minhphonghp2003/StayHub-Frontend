"use client";
import Input from "@/components/form/InputField";
import Label from "@/components/form/Label";
import authenticationService from "@/core/service/RBAC/authentication-service";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { toastPromise } from "@/lib/alert-helper";
import Link from "next/link";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "../ui/shadcn/button";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const dispatch = useDispatch();
  let onLogin = async (e: any) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      const loginRequest = authenticationService.login({ username, password })
        .then((res) => {
          if (!res.success) throw new Error(res.message);
          return res;
        });

      // 2. Pass the modified promise into toastPromise
      await toastPromise(loginRequest, {
        loading: "Đang đăng nhập...",
        success: "Đăng nhập thành công!",
        error: "Đăng nhập thất bại!",
      });

      window.location.href = "/";

    } catch (error) {

    }

  };
  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">

      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Đăng nhập
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Đăng nhập bằng tài khoản và mật khẩu
            </p>
          </div>
          <div>

            <form onSubmit={onLogin}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Tên đăng nhập <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input placeholder="Tên đăng nhập" type="text" name="username" />
                </div>
                <div>
                  <Label>
                    Mật khẩu <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mật khẩu"
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">

                  <Link
                    href="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <div>
                  <Button type="submit" className="w-full" size="sm">
                    Đăng nhập
                  </Button>
                </div>
              </div>
            </form>


          </div>
        </div>
      </div>
    </div>
  );
}
