import { useFieldContext } from "../base";

interface Props {
  label: string;
}

const NumericField = ({ label }: Props) => {
  const ctx = useFieldContext<number>();
  return (
    <label className="inline-flex flex-col gap-2">
      <span>{label}</span>
      <input
        type="number"
        className="px-3 py-1.5 border border-amber-400"
        value={ctx.state.value}
        onInput={(e) => ctx.handleChange(Number(e.currentTarget.value))}
      />
    </label>
  );
};

export default NumericField;
