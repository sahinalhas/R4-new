import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Clock, FileText } from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EnhancedTextarea as Textarea } from "@/components/ui/enhanced-textarea";
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="relative pb-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-md opacity-40" />
                <div className="relative p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600">
                  <FileText className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <DialogTitle className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Görüşmeyi Tamamla
                </DialogTitle>
                <DialogDescription className="mt-1">
                  Görüşme özetini yazın ve kaydı kapatın
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="exitTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-blue-700 dark:text-blue-400 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Çıkış Saati
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="time" 
                      {...field} 
                      className="h-12 border-2 focus:border-blue-400" 
                    />
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
                  <FormLabel className="text-base font-semibold text-purple-700 dark:text-purple-400">Görüşme Özeti</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Görüşmede neler konuşuldu, ne tür kararlar alındı..."
                      rows={6}
                      className="border-2 focus:border-purple-400 resize-none"
                    />
                  </FormControl>
                  <FormDescription>
                    Görüşmenin detaylı özetini yazın
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="border-2"
              >
                İptal
              </Button>
              <Button 
                type="submit" 
                disabled={isPending}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold min-w-[140px]"
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
