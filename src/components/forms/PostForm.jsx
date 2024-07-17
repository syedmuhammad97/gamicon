"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import FileUploader from "../shared/FileUploader";
import { PostValidation } from "@/lib/validation";
import { useUserContext } from "@/context/AuthContext";
import { toast, useToast } from "../ui/use-toast";
import {
  useCreatePost,
  useUpdatePost,
} from "@/lib/react-query/queriesAndMutations";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { TimePicker } from "../shared/TimePicker";
import { cn } from "@/lib/utils";
import { updateUserPoints, updateUserStars } from "@/lib/appwrite/api";

// Define the form schema using Zod
const formSchema = z.object({
  dateTime: z.date(),
});

/**
 * @typedef {Object} PostFormProps
 * @property {import("appwrite").Models.Document} [post]
 * @property {'Create' | 'Update'} [action]
 */

/**
 * @typedef {z.infer<typeof PostValidation>} PostValidationType
 */

/**
 * PostForm component.
 * @param {PostFormProps} props - The properties object.
 * @returns {JSX.Element} The rendered form component.
 */
const PostForm = ({ post, action }) => {
  const { mutateAsync: createPost, isPending: isLoadingCreate } =
    useCreatePost();
  const { mutateAsync: updatePost, isPending: isLoadingUpdate } =
    useUpdatePost();
  const { user } = useUserContext();
  const { toast } = useToast();
  const navigate = useNavigate();

  /** @type {import('react-hook-form').UseFormReturn<PostValidationType>} */
  const form = useForm({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      content: post ? post.content : "",
      file: [],
      location: post ? post.location : "",
      tags: post ? post.tags.join(",") : "",
    },
  });

  /**
   * Handles the form submission.
   * @param {PostValidationType} values - The validated form values.
   */
  async function onSubmit(values) {
    const { dateTime, content } = form.getValues();
    // Format the dateTime into a readable string
    const formattedDateTime = dateTime
      ? `(${format(dateTime, "PPP HH:mm:ss")})`
      : "";
    // Append the formattedDateTime to the content
    const updatedContent = `${content} ${formattedDateTime}`;

    if (post && action === "Update") {
      const updatedPost = await updatePost({
        ...values,
        content: updatedContent,
        postId: post?.$id,
        imageId: post?.imageId,
        imageURL: post?.imageURL,
      });
      if (!updatedPost) {
        toast({ title: "Error while trying to update post" });
      }
        return navigate(`/posts/${post.$id}`);   
    }
    const newPost = await createPost({
      ...values,
      content: updatedContent,
      userId: user.id,
    });
    if (!newPost) {
      toast({ title: "Error, please try again" });
    }else{
      try {
        await updateUserPoints(user.id, 10); // Increment points by 10
        await updateUserStars(user.id, 10); // Increment stars by 10
        toast({ title: "Post created successfully!" });
      } catch (error) {
        console.error("Error updating user points:", error);
        toast({ title: "Error updating user points" });
      }
    }
    navigate("/feed");
  }

  function handleClick(){
    navigate("/feed")
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-9 w-full max-w-5xl"
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Comment</FormLabel>
              <FormControl>
                <Textarea
                  className="text-black bg-slate-300"
                  placeholder="Place comment here"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.imageURL}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dateTime"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-left text-white">DateTime</FormLabel>
              <Popover>
                <FormControl className="bg-slate-400">
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "PPP HH:mm:ss")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                </FormControl>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                  <div className="p-3 border-t border-border">
                    <TimePicker setDate={field.onChange} date={field.value} />
                  </div>
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Add Tags (separated by comma ",")
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="shad-input"
                  placeholder="Maths, Office, Library"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end">
          <Button type="button" className="shad-button_dark_4" onClick={handleClick}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
            disabled={isLoadingCreate || isLoadingUpdate}
          >
            {isLoadingCreate || (isLoadingUpdate && "Loading...")}
            {action}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
