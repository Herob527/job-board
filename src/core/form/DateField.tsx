import { useFieldContext } from "./base";

interface Props {
  label: string;
}

const DateField = ({ label }: Props) => {
  const ctx = useFieldContext<string>();
  return (
    <label class="inline-flex flex-col">
      <span>{label}</span>
      <input
        type="date"
        className="px-3 py-1.5 border border-amber-400"
        value={ctx.state.value}
        onInput={(e) => ctx.handleChange(e.currentTarget.value)}
      />
    </label>
  );
};

export default DateField;
