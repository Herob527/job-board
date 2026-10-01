import { Popover } from "radix-ui";
import { useFieldContext } from "../base";

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

const BaseTextField = ({}: Props) => {};

const TextField = ({ label, autocompleteOptions = [] }: AutoCompleteProps) => {
  const ctx = useFieldContext<string>();
  return (
    <Popover.Root open>
      <Popover.Trigger asChild>
        <div>
          <label className="inline-flex flex-col">
            <span>{label}</span>
            <input
              type="text"
              className="px-3 py-1.5 border border-amber-400"
              value={ctx.state.value}
              onInput={(e) => ctx.handleChange(e.currentTarget.value)}
            />
          </label>
          <span>{ctx.state.meta.errors.at(0)?.code}</span>
        </div>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content>
          <div>
            <button type="button">Test</button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default TextField;
