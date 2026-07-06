import { reactive, computed } from 'vue'

type ValidationRule = (value: any) => string | null | undefined
type FormRules<T> = Partial<Record<keyof T, ValidationRule[]>>
type FormErrors<T> = Record<keyof T, string>

// useFormValidation tracks form input values, validates them against defined rules,
// and manages reactive error messages for instant feedback.
export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  rules: FormRules<T>,
) {
  // 1. Reactive form state and error tracking
  const form = reactive({ ...initialValues }) as T
  const errors = reactive(
    Object.keys(initialValues).reduce((acc, key) => {
      acc[key as keyof T] = ''
      return acc
    }, {} as FormErrors<T>),
  ) as FormErrors<T>

  // 2. Validate a single field
  const validateField = (field: keyof T) => {
    const fieldRules = rules[field]
    if (!fieldRules) return true

    // Check all rules sequentially for this field, stop at first error
    for (const rule of fieldRules) {
      const errorMsg = rule(form[field])
      if (errorMsg) {
        errors[field] = errorMsg
        return false
      }
    }

    // Clear error if all rules pass
    errors[field] = ''
    return true
  }

  // 3. Validate all fields at once (usually called on form submit)
  const validateForm = () => {
    let formIsValid = true
    for (const field of Object.keys(form) as Array<keyof T>) {
      const fieldIsValid = validateField(field)
      if (!fieldIsValid) {
        formIsValid = false
      }
    }
    return formIsValid
  }

  // 4. Reset form fields back to their initial state and clear errors
  const resetForm = () => {
    for (const key of Object.keys(initialValues) as Array<keyof T>) {
      form[key] = initialValues[key]
      errors[key] = ''
    }
  }

  // 5. Computed overall form validity state
  const isValid = computed(() => {
    return Object.values(errors).every((errorMsg) => !errorMsg)
  })

  return {
    form,
    errors,
    isValid,
    validateField,
    validateForm,
    resetForm,
  }
}

// --- Predefined Common Validation Rules (Helper exports) ---
export const validationRules = {
  required: (msg = 'This field is required'): ValidationRule => {
    return (val) => (val === undefined || val === null || val === '' ? msg : null)
  },
  minLength: (min: number, msg?: string): ValidationRule => {
    return (val) => (val && val.length < min ? msg || `Must be at least ${min} characters` : null)
  },
  email: (msg = 'Invalid email format'): ValidationRule => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return (val) => (val && !emailRegex.test(val) ? msg : null)
  },
  matching: (targetValueRef: () => any, msg = 'Fields do not match'): ValidationRule => {
    return (val) => (val !== targetValueRef() ? msg : null)
  },
}
