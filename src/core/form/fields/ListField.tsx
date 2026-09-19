import { useFieldContext } from "../base";
import { Popover, Checkbox } from "radix-ui";

interface Item {
  label: string;
  value: string | number;
}

interface Props {
  label: string;
  items: Item[];
  multiple?: boolean;
}

// <input
//   type="text"
//   className="px-3 py-1.5 border border-amber-400"
//   value={ctx.state.value}
//   onInput={(e) => ctx.handleChange(e.currentTarget.value)}
// />
const ListField = ({ label, items, multiple = false }: Props) => {
  const ctx = useFieldContext<(string | number)[] | string | number>();

  const handleChange = (value: string | number) => {
    if (!multiple) {
      return ctx.handleChange(value);
    }

    const currentValue = (() => {
      const value = ctx.state.value;
      if (Array.isArray(value)) return value;
      if (value !== undefined && value !== null) return [value];
      return [];
    })();

    const alreadyHas = currentValue.includes(value);
    if (alreadyHas) {
      return ctx.handleChange(currentValue.filter((item) => item !== value));
    }
    ctx.handleChange([...currentValue, value]);
  };

  const display = (() => {
    const value = ctx.state.value;
    if (value === undefined || value === null) {
      return "Pick something";
    }
    if (Array.isArray(value)) {
      if (value.length === 0) return "Pick something";
      return value
        .map((it) => items.find((item) => item.value === it)?.label)
        .join(", ");
    }
    return (
      items.find((item) => item.value === value)?.label ?? "Pick something"
    );
  })();

  return (
    <>
      <span>{label}</span>
      <Popover.Root>
        <Popover.Trigger asChild>
          <button
            className="border border-amber-400"
            type="button"
            aria-label="Update dimensions"
          >
            <span>{display}</span>
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className="PopoverContent" sideOffset={5}>
            <div className="bg-white border border-amber-400 rounded-sm px-4 py-2">
              <Popover.Close className="PopoverClose" aria-label="Close">
                X
              </Popover.Close>
              <div className="flex flex-col gap-2">
                {items.map((item) => (
                  <div className="flex items-center gap-2" key={item.value}>
                    <Checkbox.Root
                      key={item.value}
                      value={item.value}
                      className="bg-white h-8 w-8 rounded-sm flex items-center justify-center border border-amber-400"
                      onCheckedChange={() => handleChange(item.value)}
                      checked={(() => {
                        const value = ctx.state.value;
                        if (Array.isArray(value)) {
                          return value.includes(item.value);
                        }
                        return value === item.value;
                      })()}
                    >
                      <Checkbox.Indicator>X</Checkbox.Indicator>
                    </Checkbox.Root>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <Popover.Arrow className="PopoverArrow" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </>
  );
};

export default ListField;
