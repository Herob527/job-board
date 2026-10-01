import { useFieldContext } from "../base";

interface Props {
  label: string;
}

const DateField = ({ label }: Props) => {
  const ctx = useFieldContext<Date>();
  return (
    <label className="inline-flex flex-col">
      <span>{label}</span>
      <input
        type="date"
        className="px-3 py-1.5 border border-amber-400"
        value={ctx.state.value?.toISOString().split("T")[0]}
        onInput={(e) => ctx.handleChange(new Date(e.currentTarget.value))}
      />
    </label>
  );
};

export default DateField;
