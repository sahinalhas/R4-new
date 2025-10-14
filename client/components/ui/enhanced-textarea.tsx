import * as React from "react";
import { cn } from "@/lib/utils";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { Mic, MicOff, Sparkles, Loader2 } from "lucide-react";
import { Button } from "./button";
import { toast } from "sonner";

export interface EnhancedTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  enableVoice?: boolean;
  enableAIPolish?: boolean;
  aiContext?: 'academic' | 'counseling' | 'notes' | 'general';
  onValueChange?: (value: string) => void;
}

const EnhancedTextarea = React.forwardRef<HTMLTextAreaElement, EnhancedTextareaProps>(
  ({ className, enableVoice = true, enableAIPolish = true, aiContext = 'general', onValueChange, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
    const [isPolishing, setIsPolishing] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    const [currentValue, setCurrentValue] = React.useState(props.value?.toString() || props.defaultValue?.toString() || '');
    const previousValueRef = React.useRef<string | undefined>(undefined);

    React.useEffect(() => {
      if (props.value !== undefined) {
        const newValue = props.value.toString();
        if (previousValueRef.current !== newValue) {
          previousValueRef.current = newValue;
          setCurrentValue(newValue);
        }
      }
    }, [props.value]);

    const {
      isListening,
      isSupported: isVoiceSupported,
      transcript,
      startListening,
      stopListening,
      resetTranscript,
    } = useVoiceInput({
      language: 'tr-TR',
      continuous: true,
      interimResults: true,
    });

    const onValueChangeRef = React.useRef(onValueChange);
    React.useEffect(() => {
      onValueChangeRef.current = onValueChange;
    }, [onValueChange]);

    React.useEffect(() => {
      if (transcript) {
        setCurrentValue(prevValue => {
          const newValue = prevValue + (prevValue && !prevValue.endsWith(' ') ? ' ' : '') + transcript;
          onValueChangeRef.current?.(newValue);
          
          if (textareaRef.current) {
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
              window.HTMLTextAreaElement.prototype,
              'value'
            )?.set;
            nativeInputValueSetter?.call(textareaRef.current, newValue);
            
            const event = new Event('input', { bubbles: true });
            textareaRef.current.dispatchEvent(event);
          }
          
          return newValue;
        });
        
        resetTranscript();
      }
    }, [transcript, resetTranscript]);

    const handleVoiceToggle = () => {
      if (isListening) {
        stopListening();
        toast.success('Sesli giriş durduruldu');
      } else {
        startListening();
        toast.success('Sesli giriş başladı - konuşmaya başlayın');
      }
    };

    const handleAIPolish = async () => {
      const textarea = textareaRef.current;
      if (!textarea || !textarea.value.trim()) {
        toast.error('Temizlenecek metin bulunamadı');
        return;
      }

      setIsPolishing(true);
      try {
        const response = await fetch('/api/ai-text/polish', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: textarea.value,
            context: aiContext,
          }),
        });

        if (!response.ok) {
          throw new Error('Metin temizlenemedi');
        }

        const data = await response.json();
        const polishedText = data.polishedText;
        
        setCurrentValue(polishedText);
        onValueChange?.(polishedText);

        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLTextAreaElement.prototype,
          'value'
        )?.set;
        nativeInputValueSetter?.call(textarea, polishedText);

        const event = new Event('input', { bubbles: true });
        textarea.dispatchEvent(event);

        toast.success('Metin AI ile temizlendi');
      } catch (error) {
        console.error('AI polish error:', error);
        toast.error('Metin temizlenirken bir hata oluştu');
      } finally {
        setIsPolishing(false);
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setCurrentValue(newValue);
      onValueChange?.(newValue);
      props.onChange?.(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      props.onBlur?.(e);
    };

    const setRefs = React.useCallback(
      (node: HTMLTextAreaElement | null) => {
        textareaRef.current = node;
        
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    const showToolbar = (enableVoice && isVoiceSupported) || enableAIPolish;

    return (
      <div className="relative w-full">
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-lg border border-input bg-background/80 supports-[backdrop-filter]:bg-background/60 backdrop-blur-sm px-3.5 py-2.5 text-sm ring-offset-background transition-all duration-200 placeholder:text-muted-foreground/60 hover:border-border hover:bg-background/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none",
            showToolbar && "pr-24",
            className,
          )}
          ref={setRefs}
          {...props}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        
        {showToolbar && (
          <div className={cn(
            "absolute top-2 right-2 flex items-center gap-1 transition-all duration-300 ease-out",
            (isFocused || isListening || isPolishing) 
              ? "opacity-100 translate-x-0" 
              : "opacity-0 translate-x-2 pointer-events-none"
          )}>
            {enableVoice && isVoiceSupported && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 w-8 p-0 transition-all duration-200",
                  isListening && "text-red-500 animate-pulse"
                )}
                onClick={handleVoiceToggle}
                onMouseDown={(e) => e.preventDefault()}
                disabled={props.disabled}
                title={isListening ? "Sesli girişi durdur" : "Sesli giriş başlat"}
              >
                {isListening ? (
                  <MicOff className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
            )}
            
            {enableAIPolish && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 w-8 p-0 transition-all duration-200",
                  isPolishing && "text-primary"
                )}
                onClick={handleAIPolish}
                onMouseDown={(e) => e.preventDefault()}
                disabled={props.disabled || isPolishing || !currentValue.trim()}
                title="AI ile temizle ve düzelt"
              >
                {isPolishing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }
);

EnhancedTextarea.displayName = "EnhancedTextarea";

export default EnhancedTextarea;
export { EnhancedTextarea };
export const Textarea = EnhancedTextarea;
