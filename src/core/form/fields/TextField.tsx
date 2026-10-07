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

interface AutoCompleteProps extends Props {
  autocompleteOptions?: AutocompleteOption[];
}

const TextField = ({ label, autocompleteOptions = [] }: AutoCompleteProps) => {
  const ctx = useFieldContext<string>();
  const [hasFocus, setFocus] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    setFocus(true);
  };
  const handleBlur = () => {
    setFocus(false);
  };

  return (
    <Popover.Root open>
      <div className="inline-flex gap-2 flex-col">
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
                  handleBlur();
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
        <Popover.Content>
          {hasFocus && (
            <div>
              <button
                id="test"
                type="button"
                onClick={() => {
                  ctx.handleChange("test");
                }}
              >
                Test
              </button>
            </div>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default TextField;
