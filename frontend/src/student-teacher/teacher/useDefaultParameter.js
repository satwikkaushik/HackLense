"use client"

import { useState } from "react"

export const useDefaultParameter = () => {
  const [defaultParameters] = useState([
    {
      id: "default_param_1",
      name: "Overall Quality",
      description: "Overall quality of the submission",
      weight: 1,
    },
  ])

  return { defaultParameters, useDefaultParameter }
}