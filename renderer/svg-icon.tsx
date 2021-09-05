import React from "react";

type IProps = {
  name: string,
} & React.AllHTMLAttributes<SVGSVGElement>;

function SVG (props: IProps) :React.ReactElement {
  const { name, className } = props;

  return (
    <svg
      aria-hidden="true"
      className={`svg-icon ${className}`}
      width="28"
      height="28"
    >
      <use xlinkHref={"#icon-" + name} />
    </svg>
  );
}

export default SVG;