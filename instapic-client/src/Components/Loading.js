import * as React from "react"

function Loading(props) {
  return (
    <svg
      data-testid="loading"
      style={{
        margin: "auto",
        background: "#ffffff00"
      }}
      width="200px"
      height="200px"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
      display="block"
      {...props}
    >
      <circle cx={26} cy={50} fill="#ff4747" r={24}>
        <animate
          attributeName="cx"
          repeatCount="indefinite"
          dur="1.7543859649122806s"
          keyTimes="0;0.5;1"
          values="26;74;26"
          begin="-0.8771929824561403s"
        />
      </circle>
      <circle cx={74} cy={50} fill="#d3d3d3" r={24}>
        <animate
          attributeName="cx"
          repeatCount="indefinite"
          dur="1.7543859649122806s"
          keyTimes="0;0.5;1"
          values="26;74;26"
          begin="0s"
        />
      </circle>
      <circle cx={26} cy={50} fill="#ff4747" r={24}>
        <animate
          attributeName="cx"
          repeatCount="indefinite"
          dur="1.7543859649122806s"
          keyTimes="0;0.5;1"
          values="26;74;26"
          begin="-0.8771929824561403s"
        />
        <animate
          attributeName="fill-opacity"
          values="0;0;1;1"
          calcMode="discrete"
          keyTimes="0;0.499;0.5;1"
          dur="1.7543859649122806s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  )
}

export default Loading
