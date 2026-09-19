import { useFieldContext } from "../base";
import { Popover, Checkbox } from "radix-ui";

interface Item {
  label: string;
  value: string | number;
}

interface Props {
  label: string;
  items: Item[];
}

// <input
//   type="text"
//   className="px-3 py-1.5 border border-amber-400"
//   value={ctx.state.value}
//   onInput={(e) => ctx.handleChange(e.currentTarget.value)}
// />
const ListField = ({ label, items }: Props) => {
  const ctx = useFieldContext<(string | number)[]>();
  return (
    <label className="inline-flex flex-col">
      <span>{label}</span>
      <Popover.Root>
        <Popover.Trigger>
          <span>Pick</span>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content>
            <div>
              {items.map((it) => (
                <div key={it.value} className={it.label}>
                  <Checkbox.Root
                    checked={ctx.state?.value?.includes(it.value) ?? false}
                  >
                    <Checkbox.Indicator />
                  </Checkbox.Root>
                </div>
              ))}
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </label>
  );
};

export default ListField;
