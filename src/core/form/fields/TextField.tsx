import { Popover } from "radix-ui";
import { useFieldContext } from "../base";
import { useRef, useState } from "react";

interface AutocompleteOption {
  label: string;
  value: string;
}

interface Props {
  label: string;
}

interface Autocomplete {
  dataState: "pending" | "loading" | "ready";
  options: AutocompleteOption[];
}

interface AutoCompleteProps extends Props {
  autocomplete?: Autocomplete;
}

type BlurSource = "input" | "popover" | "button";

const TextField = ({
  label,
  autocomplete: autocompleteOptions,
}: AutoCompleteProps) => {
  const ctx = useFieldContext<string>();
  const [hasFocus, setFocus] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    setFocus(true);
  };
  const handleBlur = (source: BlurSource) => {
    if (source === "button") {
      setFocus(false);
      return;
    }
    if (source === "popover") {
      const isWithinWrapper = wrapperRef.current?.contains(
        document.activeElement,
      );
      if (!isWithinWrapper) {
        setFocus(false);
      }
    }
  };

  return (
    <Popover.Root open>
      <div className="inline-flex gap-2 flex-col" ref={wrapperRef}>
        <div className="inline-flex flex-col">
          <span>{label}</span>

          <Popover.Anchor asChild>
            <div className="inline-flex w-fit">
              <input
                ref={inputRef}
                type="text"
                className="px-3 py-1.5 border border-amber-400"
                value={ctx.state.value}
                onFocus={() => {
                  handleFocus();
                  inputRef.current?.focus();
                }}
                onBlur={() => {
                  handleBlur("input");
                  inputRef.current?.blur();
                }}
                onInput={(e) => ctx.handleChange(e.currentTarget.value)}
              />
            </div>
          </Popover.Anchor>
        </div>
        <span>{ctx.state.meta.errors.at(0)?.code}</span>
      </div>
      <Popover.Portal>
        <Popover.Content
          align="start"
          onInteractOutside={() => handleBlur("popover")}
          sideOffset={3}
        >
          {autocompleteOptions &&
            autocompleteOptions.options?.length > 0 &&
            hasFocus && (
              <div className="space-y-0.5 flex flex-col border border-amber-400 rounded-sm bg-white drop-shadow-xl">
                {autocompleteOptions.options.map((option) => (
                  <button
                    className="px-3 py-1.5 text-left not-first:border-t not-first:border-amber-400"
                    key={option.value}
                    type="button"
                    onClick={() => {
                      ctx.handleChange(option.value);
                      handleBlur("button");
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default TextField;
