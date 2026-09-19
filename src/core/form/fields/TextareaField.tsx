import { useFieldContext } from "../base";

interface Props {
  label: string;
}

const TextareaField = ({ label }: Props) => {
  const ctx = useFieldContext<string>();
  return (
    <label className="inline-flex flex-col">
      <span>{label}</span>
      <textarea
        className="px-3 py-1.5 border border-amber-400"
        value={ctx.state.value}
        onInput={(e) => ctx.handleChange(e.currentTarget.value)}
      />
    </label>
  );
};

export default TextareaField;
