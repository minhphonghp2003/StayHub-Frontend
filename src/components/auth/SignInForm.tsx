"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import OauthOption from "./OauthOption";
import authenticationService from "@/core/service/RBAC/AuthenticationService";
import { showToast } from "@/utils/alert-helper";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/features/RBAC/UserSlice";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const dispatch = useDispatch();
  let onLogin = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target); // Create FormData object from the form element
    const formValues = Object.fromEntries(formData.entries()); // Convert FormData to a plain object
    let result = await authenticationService.login({
      username: formValues.username as string,
      password: formValues.password as string,
    });
    if (!result.success) {
      showToast({
        type: "error", content: result.message, options: {
          position: "top-right"
        }
      })
    } else {
      dispatch(setUser(result.data!))
      showToast({
        type: "success",
        content: result.message,
        options: { position: "top-right" },
      });
      window.location.href = "/";
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
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Ghi nhớ đăng nhập
                    </span>
                  </div>
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

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Chưa có tài khoản? {""}
                <Link
                  href="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Đăng ký
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
