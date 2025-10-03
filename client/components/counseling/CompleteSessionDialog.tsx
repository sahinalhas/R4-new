import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { completeSessionSchema, type CompleteSessionFormValues, type CounselingSession } from "./types";

interface CompleteSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: CounselingSession | null;
  onSubmit: (data: CompleteSessionFormValues) => void;
  isPending: boolean;
}

export default function CompleteSessionDialog({
  open,
  onOpenChange,
  session,
  onSubmit,
  isPending,
}: CompleteSessionDialogProps) {
  const form = useForm<CompleteSessionFormValues>({
    resolver: zodResolver(completeSessionSchema),
    defaultValues: {
      exitTime: new Date().toTimeString().slice(0, 5),
      detailedNotes: "",
    },
  });

  const handleSubmit = (data: CompleteSessionFormValues) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Görüşmeyi Tamamla</DialogTitle>
          <DialogDescription>
            Görüşme özetini yazın ve kaydı kapatın
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="exitTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Çıkış Saati</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="detailedNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Görüşme Özeti</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Görüşmede neler konuşuldu, ne tür kararlar alındı..."
                      rows={6}
                    />
                  </FormControl>
                  <FormDescription>
                    Görüşmenin detaylı özetini yazın
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                İptal
              </Button>
              <Button 
                type="submit" 
                disabled={isPending}
              >
                {isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Tamamla
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
