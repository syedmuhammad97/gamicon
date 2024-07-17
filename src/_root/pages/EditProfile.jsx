import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProfileValidation } from "@/lib/validation";
import {
  useGetUserById,
  useUpdateUser,
} from "@/lib/react-query/queriesAndMutations";
import { Loader, Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ProfileUploader from "@/components/shared/ProfileUploader";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiEdit } from "react-icons/fi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { CommandList } from "cmdk";

/**
 * @typedef {z.infer<typeof ProfileValidation>} ProfileValidationType
 */

const roles = [
  { value: "student", label: "Student" },
  { value: "lecturer", label: "Lecturer" },
  { value: "guest", label: "Guest" },
];

const EditProfile = () => {
  const { toast } = useToast();
  const nav = useNavigate();
  const { id } = useParams();
  const { user, setUser } = useUserContext();
  const [role, setRole] = useState(user.roleType || "student");
  const [open, setOpen] = useState(false);

  /** @type {import('react-hook-form').UseFormReturn<ProfileValidationType>} */
  const form = useForm({
    resolver: zodResolver(ProfileValidation),
    defaultValues: {
      file: [],
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio || "",
      roleType: user.roleType || "student",
    },
  });

  const { data: currentUser } = useGetUserById(id || "");
  const { mutateAsync: updateUser, isLoading: isLoadingUpdate } =
    useUpdateUser();

  useEffect(() => {
    if (currentUser) {
      console.log("Current User: ", currentUser);
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  /**
   *
   * @param {ProfileValidation} value
   */
  const handleUpdate = async (value) => {
    console.log("Updating with values: ", value);
    const updatedUser = await updateUser({
      userId: currentUser.$id,
      name: value.name,
      username: value.username,
      bio: value.bio,
      file: value.file,
      email: value.email,
      imageURL: currentUser.imageURL,
      imageId: currentUser.imageId,
      roleType: value.roleType,
    });

    if (!updatedUser) {
      toast({
        title: "Error, update failed. Please try again later",
      });
      return;
    }

    setUser({
      ...user,
      name: updatedUser?.name,
      bio: updatedUser?.bio,
      username: updatedUser?.username,
      imageURL: updatedUser?.imageURL,
      roleType: updatedUser?.roleType,
      email: updatedUser?.email,
    });
    nav("/feed");
  };

  return (
    <div className="flex flex-1">
      <div className="flex flex-col flex-1 items-center gap-10 overflow-scroll py-10 px-5 md:px-8 lg:p-14 bg-slate-800">
        <div className="flex items-center gap-3 justify-start w-full max-w-5xl">
          <FiEdit size={35} color="white" />
          <h2 className="text-[24px] text-white font-bold leading-[140%] tracking-tighter md:text-[30px] text-left w-full">
            Edit Profile
          </h2>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpdate)}
            className="flex flex-col gap-7 w-full mt-4 max-w-5xl"
          >
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem className="flex">
                  <FormControl>
                    <ProfileUploader
                      fieldChange={field.onChange}
                      mediaUrl={currentUser.imageUrl}
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Name</FormLabel>
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
                  <FormLabel className="text-white">Username</FormLabel>
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
                  <FormLabel className="text-white">Email</FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Bio</FormLabel>
                  <FormControl>
                    <Textarea className="bg-slate-400 text-black" {...field} />
                  </FormControl>
                  <FormMessage className="text-red" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roleType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white flex py-2">Role</FormLabel>
                  <FormControl>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={false}
                          className="w-[200px] justify-between"
                        >
                          {role
                            ? roles.find((r) => r.value === role)?.label
                            : "Select role..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Search role..." />
                          <CommandEmpty>No role found.</CommandEmpty>
                          <CommandGroup>
                            {roles.map((r) => (
                              <CommandList>
                                <CommandItem
                                  key={r.value}
                                  value={r.value}
                                  onSelect={(currentValue) => {
                                    setRole(currentValue);
                                    field.onChange(currentValue);
                                    setOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      role === r.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {r.label}
                                </CommandItem>
                              </CommandList>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4 items-center justify-end">
              <Button
                type="button"
                className="shad-button_dark_4"
                onClick={() => nav(-1)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="shad-button_primary whitespace-nowrap"
                disabled={isLoadingUpdate}
              >
                {isLoadingUpdate && <Loader />}
                Update Profile
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EditProfile;
