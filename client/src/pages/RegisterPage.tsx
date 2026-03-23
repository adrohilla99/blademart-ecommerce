import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface FormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const { register, isLoading } = useAuth();
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});

  const validate = (): boolean => {
    const errs: Partial<FormState> = {};
    if (!form.name || form.name.length < 2) errs.name = 'Name must be at least 2 characters';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Valid email required';
    if (!form.password || form.password.length < 8) errs.password = 'Password must be at least 8 characters';
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password))
      errs.password = 'Must contain uppercase, lowercase, and a number';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await register(form.name, form.email, form.password);
    } catch {
      // Error handled in hook
    }
  };

  const field = (key: keyof FormState) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm({ ...form, [key]: e.target.value }),
    className: `input-field ${errors[key] ? 'border-red-500 focus:ring-red-500' : ''}`,
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white">Create account</h1>
          <p className="text-slate-400 mt-2">Join BladeMart and start shopping</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {(
              [
                { key: 'name', label: 'Full name', type: 'text', placeholder: 'John Doe', autocomplete: 'name' },
                { key: 'email', label: 'Email address', type: 'email', placeholder: 'you@example.com', autocomplete: 'email' },
                { key: 'password', label: 'Password', type: 'password', placeholder: '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022', autocomplete: 'new-password' },
                { key: 'confirmPassword', label: 'Confirm password', type: 'password', placeholder: '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022', autocomplete: 'new-password' },
              ] as const
            ).map(({ key, label, type, placeholder, autocomplete }) => (
              <div key={key}>
                <label htmlFor={key} className="block text-sm font-medium text-slate-300 mb-1.5">
                  {label}
                </label>
                <input
                  id={key}
                  type={type}
                  autoComplete={autocomplete}
                  placeholder={placeholder}
                  {...field(key)}
                />
                {errors[key] && (
                  <p className="text-xs text-red-400 mt-1">{errors[key]}</p>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 text-base mt-2"
            >
              {isLoading ? 'Creating account\u2026' : 'Create Account'}
            </button>
          </form>

          <p className="text-sm text-slate-500 text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
