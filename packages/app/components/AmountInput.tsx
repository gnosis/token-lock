import { ComponentProps, ReactNode, useEffect, useState } from "react"
import cls from "./Input.module.css"
import Field from "./Field"
import React from "react"
import { BigNumber } from "ethers"
import { formatUnits, parseUnits } from "ethers/lib/utils"

type Props = ComponentProps<typeof Field> & {
  value: BigNumber | undefined
  max: BigNumber | undefined
  onChange(value: BigNumber | undefined): void
  decimals: number
  unit?: ReactNode
  name?: string
}

const sanitize = (str: string) => {
  // keep only numbers and .
  let result = str.replace(/[^0-9\.]/g, "")
  // prepend a 0 if starts with .
  result = result.startsWith(".") ? `0${result}` : result
  // remove all . chars after the first
  const i = result.indexOf(".")
  return result.substring(0, i + 1) + result.substring(i + 1).replace(/\./g, "")
}

const AmountInput = React.forwardRef<HTMLInputElement, Props>(
  (
    { name, label, value, max, decimals, onChange, meta, unit, className },
    ref
  ) => {
    const [state, setState] = useState(
      value ? formatUnits(value, decimals) : ""
    )

    useEffect(() => {
      let parsed: BigNumber | undefined = undefined
      try {
        parsed = parseUnits(state, decimals)
      } catch (e) {}

      if (parsed && value && parsed.eq(value)) {
        return
      }

      setState(value ? formatUnits(value, decimals) : "")
    }, [state, value, decimals])

    return (
      <Field htmlFor={name} className={className} label={label} meta={meta}>
        <div className={cls.wrapper}>
          <input
            pattern="^[0-9]*[.,]?[0-9]*$"
            placeholder="0.0"
            ref={ref}
            name={name}
            className={cls.input}
            value={state}
            onChange={(ev) => {
              const value = sanitize(ev.target.value)
              setState(value)

              let parsed: BigNumber | undefined = undefined
              try {
                parsed = parseUnits(value, decimals)
              } catch (e) {
              } finally {
                onChange(parsed)
              }
            }}
          />
          {unit && <span className={cls.unit}>{unit}</span>}
        </div>
        {value && max && value.gt(max) && (
          <div className={cls.errorText}>
            You&apos;ve entered an amount that exceeds your balance.
          </div>
        )}
      </Field>
    )
  }
)
AmountInput.displayName = "AmountInput"

export default AmountInput
