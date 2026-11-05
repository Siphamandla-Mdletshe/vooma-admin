import palette from "./tokens.json";

export function VoomaMark({ inverse = false }: { inverse?: boolean }) {
  return (
    <svg width="40" height="40" viewBox="0 0 120 100" aria-hidden="true">
      <path
        d="M3 10h24c10 0 14 5 19 13l35 60c-6 17-28 18-36 3Z"
        fill={inverse ? "#ffffff" : "#17263d"}
      />
      <path
        d="M84 4a28 28 0 0 0-24 43l24 38 24-38A28 28 0 0 0 84 4Zm0 17a10 10 0 1 1 0 20 10 10 0 0 1 0-20Z"
        fill={palette.orange}
        fillRule="evenodd"
      />
    </svg>
  );
}
