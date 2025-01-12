"use client";

import Autoplay from "embla-carousel-autoplay";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";
import {
  authSchema,
  type AuthSchema,
  checkPasswordStrength,
} from "@/schemas/auth";
import { carouselData } from "@/constant";
import { useSearchParams } from "next/navigation";

type AccountType = "personal" | "business" | null;

export default function LoginPage() {
  const [isSignIn, setIsSignIn] = useState(false);
  const [showAccountTypeDialog, setShowAccountTypeDialog] = useState(false);
  const [accountType, setAccountType] = useState<AccountType>(null);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [passwordRequirements, setPasswordRequirements] = useState(
    checkPasswordStrength("", "")
  );

  const searchParams = useSearchParams();

  const form = useForm<AuthSchema>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const watchPassword = form.watch("password");
  const watchEmail = form.watch("email");

  useEffect(() => {
    const type = searchParams.get("type");
    if (type === "login") {
      setIsSignIn(true);
    } else {
      setIsSignIn(false);
      setShowAccountTypeDialog(true)
    }
  }, [searchParams]);

  useEffect(() => {
    setPasswordRequirements(checkPasswordStrength(watchPassword, watchEmail));
  }, [watchPassword, watchEmail]);

  useEffect(() => {
    if (!api) {
      return;
    }
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  function onSubmit(data: AuthSchema) {
    console.log(data);
  }

  const plugin = useRef(Autoplay({ delay: 5000 }));

  return (
    <>
      <Dialog
        open={showAccountTypeDialog}
        onOpenChange={setShowAccountTypeDialog}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Choose Account Type</DialogTitle>
            <DialogDescription>
              Select the type of account you want to create
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button
              variant="outline"
              className="h-auto py-4 px-6"
              onClick={() => {
                setAccountType("personal");
                setShowAccountTypeDialog(false);
              }}
            >
              <div className="text-left space-y-2">
                <div className="font-semibold">Personal Account</div>
                <div className="text-sm text-muted-foreground text-wrap">
                  For individual use and personal projects
                </div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 px-6"
              onClick={() => {
                setAccountType("business");
                setShowAccountTypeDialog(false);
              }}
            >
              <div className="text-left space-y-2">
                <div className="font-semibold">Business Account</div>
                <div className="text-sm text-muted-foreground text-wrap">
                  For organizations and teams
                </div>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="min-h-screen grid lg:grid-cols-2">
        {/* Left Section */}
        <div className="sticky top-0 hidden lg:flex flex-col items-center justify-between p-12 text-white overflow-hidden h-screen">
          <div className="relative flex flex-col items-center">
            <Carousel
              plugins={[plugin.current]}
              className="w-full max-w-lg rounded-2xl overflow-hidden bg-black"
              setApi={setApi}
            >
              <CarouselContent>
                {carouselData.map((slide, index) => (
                  <CarouselItem
                    key={index}
                    className="w-full bg-gradient-to-b from-blue-600 via-blue-950 to-black"
                  >
                    <div className="relative z-10 h-[90vh] flex flex-col px-6 py-6">
                      <div className="w-full flex items-center justify-center">
                        <Link
                          href="/"
                          className="text-3xl font-bold text-center"
                        >
                          LOGO
                        </Link>
                      </div>
                      <div
                        key={index}
                        className="mt-auto mb-16 text-center space-y-4"
                      >
                        <h2 className="text-4xl font-semibold">
                          {slide.title}
                        </h2>
                        <p className="text-xl opacity-90">
                          {slide.description}
                        </p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            <div className="absolute z-10 flex gap-2 mb-8 bottom-4">
              {carouselData.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    current === index + 1 ? "bg-white" : "bg-white/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center justify-center p-8 h-full overflow-y-auto">
          <div className="w-full max-w-md space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">
                {isSignIn
                  ? "LOGIN"
                  : accountType === "business"
                  ? "Become an Owner"
                  : "Create An Account"}
              </h1>
              <p className="text-muted-foreground">
                {accountType === "business"
                  ? "Register you organisation"
                  : "Enjoy premium luxury"}
              </p>
            </div>

            <div className="flex gap-2 bg-muted rounded-lg p-1">
              <Button
                variant={!isSignIn ? "default" : "ghost"}
                className="flex-1 rounded-md"
                onClick={() => setIsSignIn(false)}
              >
                Sign Up
              </Button>
              <Button
                variant={isSignIn ? "default" : "ghost"}
                className="flex-1 rounded-md"
                onClick={() => setIsSignIn(true)}
              >
                Sign In
              </Button>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Id</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter Password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {!isSignIn && watchPassword && (
                  <div className="space-y-2">
                    {passwordRequirements.map((requirement, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <Check
                          className={`h-4 w-4 ${
                            requirement.met ? "text-green-500" : "text-red-500"
                          }`}
                        />
                        {requirement.text}
                      </div>
                    ))}
                  </div>
                )}

                {isSignIn && (
                  <div className="text-right">
                    <Link
                      href="/forgot-password"
                      className="text-sm text-muted-foreground hover:underline"
                    >
                      Forgot Password
                    </Link>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-black text-white hover:bg-black/90"
                >
                  {isSignIn
                    ? "LOGIN"
                    : accountType === "business"
                    ? "Create Account"
                    : "Sign Up"}
                </Button>
              </form>
            </Form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Button variant="outline" className="w-full">
                <Image
                  src="/google.svg"
                  alt="Google"
                  width={24}
                  height={24}
                />
              </Button>
              <Button variant="outline" className="w-full">
                <Image
                  src="/apple.svg"
                  alt="Apple"
                  width={24}
                  height={24}
                />
              </Button>
              <Button variant="outline" className="w-full">
                <Image
                  src="/microsoft.svg"
                  alt="Microsoft"
                  width={24}
                  height={24}
                />
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              By signing up you agree to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of use
              </Link>{" "}
              &{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
