import { useFieldContext } from "../base";

interface Item {
  label: string;
  value: string | number;
}

interface Props {
  label: string;
  items: Item[];
}

const ListField = ({ label }: Props) => {
  const ctx = useFieldContext<string>();
  return (
    <label class="inline-flex flex-col">
      <span>{label}</span>
      <input
        type="text"
        class="px-3 py-1.5 border border-amber-400"
        value={ctx.state.value}
        onInput={(e) => ctx.handleChange(e.currentTarget.value)}
      />
    </label>
  );
};

export default ListField;
