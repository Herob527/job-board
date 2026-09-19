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

/** Presentational shell shared by both variants. No generics, no unions. */
const ListPopover = ({
  label,
  items,
  display,
  isChecked,
  onToggle,
}: {
  label: string;
  items: Item[];
  display: string;
  isChecked: (itemValue: string | number) => boolean;
  onToggle: (itemValue: string | number) => void;
}) => {
  return (
    <>
      <span>{label}</span>
      <Popover.Root>
        <Popover.Trigger asChild>
          <button
            className="border py-2 border-amber-400"
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
                      value={item.value}
                      className="bg-white h-8 w-8 rounded-sm flex items-center justify-center border border-amber-400"
                      onCheckedChange={() => onToggle(item.value)}
                      checked={isChecked(item.value)}
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

const SingleListField = ({ label, items }: Omit<Props, "multiple">) => {
  const { state, handleChange } = useFieldContext<string | number>();

  const display = (() => {
    if (state.value === undefined || state.value === null) {
      return "Pick something";
    }
    return (
      items.find((item) => item.value === state.value)?.label ??
      "Pick something"
    );
  })();

  const isChecked = (itemValue: string | number) => state.value === itemValue;

  const onToggle = (itemValue: string | number) => {
    handleChange(itemValue);
  };

  return (
    <ListPopover
      label={label}
      items={items}
      display={display}
      isChecked={isChecked}
      onToggle={onToggle}
    />
  );
};

const MultipleListField = ({ label, items }: Omit<Props, "multiple">) => {
  const { state, handleChange } = useFieldContext<(string | number)[]>();
  const value = state.value ?? [];

  const display = (() => {
    if (value.length === 0) {
      return "Pick something";
    }
    return value
      .map((it) => items.find((item) => item.value === it)?.label)
      .join(", ");
  })();

  const isChecked = (itemValue: string | number) => value.includes(itemValue);

  const onToggle = (itemValue: string | number) => {
    const alreadyHas = value.includes(itemValue);
    const newValue = alreadyHas
      ? value.filter((item) => item !== itemValue)
      : [...value, itemValue];
    handleChange(newValue);
  };

  return (
    <ListPopover
      label={label}
      items={items}
      display={display}
      isChecked={isChecked}
      onToggle={onToggle}
    />
  );
};

const ListField = ({ label, items, multiple = false }: Props) => {
  return multiple ? (
    <MultipleListField label={label} items={items} />
  ) : (
    <SingleListField label={label} items={items} />
  );
};

export default ListField;
