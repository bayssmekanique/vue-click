import { DirectiveBinding } from 'vue/types/options'
import { TimeParser, IsTime } from './time'

export enum Behavior {
  Default = 'default',
  Throttle = 'throttle',
  Debounce = 'debounce'
}

export interface BindingResult {
  behavior: Behavior
  time: number | null
  argument: string | null
  dispatch: Function | (() => void)
}

export const ParseBinding = (binding: DirectiveBinding) => {
  const result = {
    behavior: Behavior.Default,
    time: null,
    argument: null,
    dispatch: () => { return }
  } as BindingResult

  for (let modKey in binding.modifiers) {
    const mods = modKey.split(':')
    if (mods[1]) {
      result.argument = mods[1]
    }

    if (IsTime(mods[0])) {
      result.time = TimeParser(mods[0])
    } else if (Object.values(Behavior).indexOf(mods[0] as Behavior) > 0) {
      result.behavior = mods[0] as Behavior
    }
  }

  if (binding.arg) {
    result.argument = binding.arg
  }

  if (typeof binding.value === 'function') {
    result.dispatch = () => binding.value(result.argument)
  }

  return result
}