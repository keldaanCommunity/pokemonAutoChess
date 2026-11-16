import "./money.css"

export function Money(props: { value?: number | string; className?: string }) {
  return (
    <>
      {props.value != null && (
        <span
          style={{ verticalAlign: "middle", fontWeight: "600" }}
          className={props.className}
        >
          {props.value}
        </span>
      )}
      <img
        className="icon-money"
        src="/assets/icons/money.svg"
        alt="$"
        style={{ marginLeft: "4px" }}
      />
    </>
  )
}
