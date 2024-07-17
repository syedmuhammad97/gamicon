import React from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../ui/use-toast";
import { useCreateBooking } from "@/lib/react-query/queriesAndMutations";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema } from "@/lib/validation";
import { useUserContext } from "@/context/AuthContext";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { TimePicker } from "../shared/TimePicker";
import { z } from "zod";

const BookingForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { mutateAsync: createBooking, isLoading } = useCreateBooking();
  const { user } = useUserContext();

  const form = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      //dateAndTime: "2024-01-01T00:00",
      userLimit: 1,
    },
  });

  const formSchema = z.object({
    dateAndTime: z.date(),
  });

  async function onSubmit(values) {
    try {
      await createBooking({
        userId: user.id, // Replace with actual user ID
        dateAndTime: values.dateAndTime,
        userLimit: values.userLimit,
      });
      toast({ title: "Booking created successfully!" });
      navigate("/feed");
    } catch (error) {
      toast({ title: "Error creating booking", description: error.message });
    }
  }

  function handleClick(){
    navigate('/feed')
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-9 w-full max-w-5xl"
      >
        <FormField
          control={form.control}
          name="dateAndTime"
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
          name="userLimit"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">User Limit</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  className="shad-input"
                  value={field.value}
                  onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
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
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Create Booking"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BookingForm;
