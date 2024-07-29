import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useToast } from '@/components/ui/use-toast'
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { SignUpValidation } from '@/lib/validation'
import { useCreateUserAccount, useSignInAccount} from '@/lib/react-query/queriesAndMutations'
import { useUserContext } from '@/context/AuthContext'


const SignupForms = () => {
  // 1. Define your form.
  const {toast} = useToast();
  const {checkAuthUser} = useUserContext();
  const navigate = useNavigate();
  
  const {mutateAsync: createUserAccount} = useCreateUserAccount();

  const {mutateAsync: signInAccount} = useSignInAccount();

  const form = useForm({
    resolver: zodResolver(SignUpValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });
 
  // 2. Define a submit handler.
  async function onSubmit(values) {
    const newUser = await createUserAccount(values);
    console.log(newUser);

    if(!newUser){
      return (
            toast({
              title: "Sign up failed. Please try again later."
            })
      )
    }

    const session = await signInAccount({
      email: values.email,
      password: values.password,
    })

    if(!session){
      return toast({title: 'Sign in failed, please try again.'})
    }

    const isLoggedIn = await checkAuthUser();

    if(isLoggedIn){
      form.reset();

      navigate('/feed')
    }else{
      return toast({title: "Sign Up failed, please try again"})
    }
  }

  return (
    <div className='bg-white py-10'>
      <Form {...form}>
      <div className='sm:w-[420] flex justify-center items-center flex-col px-4'>
        <img src="/assets/images/logo.png" alt='Logo'/>
        <h2 className='text-[24px] font-bold leading-[140%] tracking-tighter md:text-[30px] 
        md:font-bold md:leading-[140%] md:tracking-tighter pt-5 sm:pt-12'>Create an account</h2>
        <p className='mt-2 text-neutral-700 text-[14px] font-medium leading-[140%] md:text-[16px] md:font-normal md:leading-[140%]'>Please enter your account informations</p>
      
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
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
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary">Sign Up</Button>
          <p className='text-[14px] font-medium leading-[140%] text-center mt-2'>
            Already a Gamicon member? 
            <Link to="/sign-in" className='text-primary-500 text-[14px] font-semibold leading-[140%] tracking-tighter ml-1'>Log in here</Link>
          </p>
        </form>
      </div>
    </Form>
    </div>
    
  )
}

export default SignupForms