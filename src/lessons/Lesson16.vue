<script setup lang="ts">
import { ref } from 'vue'
import { useFormValidation, validationRules } from '../composables/useFormValidation'

// 1. Define initial values for the form fields
const initialFormValues = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
}

// 2. Instantiate validation rules using helper rule builders
const rules = {
  username: [
    validationRules.required('Username is required'),
    validationRules.minLength(4, 'Username must be at least 4 characters'),
  ],
  email: [
    validationRules.required('Email address is required'),
    validationRules.email('Please enter a valid email format'),
  ],
  password: [
    validationRules.required('Password is required'),
    validationRules.minLength(6, 'Password must be at least 6 characters'),
  ],
  confirmPassword: [
    validationRules.required('Please confirm your password'),
    validationRules.matching(() => form.password, 'Passwords do not match'),
  ],
}

// 3. Consume the form validation composable
const { form, errors, isValid, validateField, validateForm, resetForm } = useFormValidation(
  initialFormValues,
  rules,
)

const submittedData = ref<typeof initialFormValues | null>(null)

const handleSubmit = () => {
  submittedData.value = null
  // Validate all fields on submit
  const isFormValid = validateForm()

  if (isFormValid) {
    submittedData.value = { ...form }
    resetForm()
  }
}
</script>

<template>
  <div class="lesson-container">
    <header class="lesson-header">
      <span class="badge">Lesson 16</span>
      <h1>Form Validation Composable</h1>
      <p class="subtitle">
        Design reusable, rule-based form validation composables with live blur validation errors.
      </p>
    </header>

    <main class="lesson-content">
      <!-- Validation Card -->
      <section class="card">
        <h2>1. Registration Form Validation</h2>
        <p class="description">
          This form is validated dynamically. Tabbing through fields or typing triggers real-time
          checkups on blur (<code>@blur</code>), keeping validation feedback instantaneous.
        </p>

        <div class="demo-box form-box">
          <form @submit.prevent="handleSubmit" class="validation-form">
            <!-- Username -->
            <div class="input-field" :class="{ 'has-error': errors.username }">
              <label for="username">Username:</label>
              <input
                id="username"
                type="text"
                v-model="form.username"
                @blur="validateField('username')"
                placeholder="Enter username (min 4 chars)"
                class="text-input"
              />
              <span class="error-msg" v-if="errors.username">{{ errors.username }}</span>
            </div>

            <!-- Email -->
            <div class="input-field" :class="{ 'has-error': errors.email }">
              <label for="email">Email Address:</label>
              <input
                id="email"
                type="email"
                v-model="form.email"
                @blur="validateField('email')"
                placeholder="Enter your email"
                class="text-input"
              />
              <span class="error-msg" v-if="errors.email">{{ errors.email }}</span>
            </div>

            <!-- Password -->
            <div class="input-field" :class="{ 'has-error': errors.password }">
              <label for="password">Password:</label>
              <input
                id="password"
                type="password"
                v-model="form.password"
                @blur="validateField('password')"
                placeholder="Enter password (min 6 chars)"
                class="text-input"
              />
              <span class="error-msg" v-if="errors.password">{{ errors.password }}</span>
            </div>

            <!-- Confirm Password -->
            <div class="input-field" :class="{ 'has-error': errors.confirmPassword }">
              <label for="confirmPassword">Confirm Password:</label>
              <input
                id="confirmPassword"
                type="password"
                v-model="form.confirmPassword"
                @blur="validateField('confirmPassword')"
                placeholder="Re-enter password"
                class="text-input"
              />
              <span class="error-msg" v-if="errors.confirmPassword">{{
                errors.confirmPassword
              }}</span>
            </div>

            <div class="form-actions">
              <button type="button" @click="resetForm" class="btn btn-secondary">
                Reset Fields
              </button>
              <button type="submit" class="btn btn-primary">Register Account</button>
            </div>
          </form>
        </div>
      </section>

      <!-- Results Card -->
      <section class="card">
        <h2>2. Validation State Monitor</h2>
        <div class="demo-box monitor-box">
          <div class="monitor-item">
            <span class="label">Overall Form Validity (isValid):</span>
            <span :class="['status-pill', isValid ? 'valid' : 'invalid']">
              {{ isValid ? '✓ VALID' : '✗ INVALID' }}
            </span>
          </div>

          <div class="monitor-item">
            <span class="label">Active Validation Errors Object:</span>
            <pre class="raw-errors">{{ JSON.stringify(errors, null, 2) }}</pre>
          </div>

          <!-- Submitted output -->
          <div v-if="submittedData" class="success-banner">
            <h4>🎉 Registration Successful!</h4>
            <p>Submitted Account Payload:</p>
            <pre class="submitted-payload">{{ JSON.stringify(submittedData, null, 2) }}</pre>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.lesson-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1.5rem;
  font-family:
    'Inter',
    system-ui,
    -apple-system,
    sans-serif;
  color: #f3f4f6;
}

.lesson-header {
  text-align: center;
  margin-bottom: 3rem;
}

.badge {
  background: linear-gradient(135deg, #10b981, #ec4899);
  color: #fff;
  font-weight: 700;
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: inline-block;
  margin-bottom: 0.75rem;
}

.lesson-header h1 {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(to right, #10b981, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: #94a3b8;
  font-size: 1.1rem;
  margin-top: 0.5rem;
}

.lesson-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.card {
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 2rem;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease;
}

.card:hover {
  border-color: rgba(16, 185, 129, 0.4);
}

.card h2 {
  font-size: 1.25rem;
  color: #10b981;
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.description {
  color: #94a3b8;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.demo-box {
  background: rgba(15, 23, 42, 0.8);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.form-box {
  align-items: stretch;
}

.validation-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.input-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  text-align: left;
}

.input-field label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #94a3b8;
}

.text-input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.2s ease;
}

.text-input:focus {
  border-color: #10b981;
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.1);
}

.input-field.has-error .text-input {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.03);
}

.input-field.has-error .text-input:focus {
  box-shadow: 0 0 10px rgba(239, 68, 68, 0.15);
}

.error-msg {
  font-size: 0.8rem;
  color: #f87171;
  font-weight: 500;
  margin-top: 0.15rem;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.monitor-box {
  align-items: stretch;
  text-align: left;
  gap: 1.25rem;
}

.monitor-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #94a3b8;
}

.status-pill {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  letter-spacing: 0.05em;
}

.status-pill.valid {
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #10b981;
}

.status-pill.invalid {
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

.raw-errors,
.submitted-payload {
  margin: 0;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-family: 'Fira Code', monospace;
  font-size: 0.85rem;
  color: #cbd5e1;
  width: 100%;
}

.success-banner {
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #a7f3d0;
  padding: 1.25rem;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.success-banner h4 {
  margin: 0;
  font-size: 1.1rem;
}

.success-banner p {
  margin: 0;
  font-size: 0.85rem;
  color: #6ee7b7;
}

.btn {
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-grow: 1;
}

.btn-primary {
  background: #10b981;
  color: #0f172a;
}

.btn-primary:hover {
  background: #059669;
  transform: translateY(-1px);
}

.btn-secondary {
  background: rgba(148, 163, 184, 0.15);
  color: #f8fafc;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.btn-secondary:hover {
  background: rgba(148, 163, 184, 0.25);
  transform: translateY(-1px);
}
</style>
