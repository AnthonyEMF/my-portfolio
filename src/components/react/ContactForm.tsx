import { useCallback, useState } from "react";
import { Send, Loader2, CheckCircle2, AlertCircle, User, Mail, MessageSquare, Type } from "lucide-react";

type FormValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const EMAIL_TO = "anthony07miranda@gmail.com";
const ENDPOINT = `https://formsubmit.co/ajax/${EMAIL_TO}`;

export function ContactForm() {
  const [values, setValues] = useState<FormValues>({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const validate = useCallback((v: FormValues): FormErrors => {
    const e: FormErrors = {};
    const name = v.name.trim();
    if (!name) e.name = "Tu nombre es requerido.";
    else if (name.length < 2) e.name = "Mínimo 2 caracteres.";
    else if (name.length > 60) e.name = "Máximo 60 caracteres.";

    const email = v.email.trim();
    if (!email) e.email = "Tu correo es requerido.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Correo no válido.";

    const subject = v.subject.trim();
    if (subject && subject.length < 5) e.subject = "Mínimo 5 caracteres.";
    else if (subject.length > 100) e.subject = "Máximo 100 caracteres.";

    const message = v.message.trim();
    if (!message) e.message = "Cuéntame tu idea o proyecto.";
    else if (message.length < 20) e.message = "Mínimo 20 caracteres para entender tu necesidad.";
    else if (message.length > 1000) e.message = "Máximo 1000 caracteres.";

    return e;
  }, []);

  const handleChange = (field: keyof FormValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...values, [field]: e.target.value };
    setValues(next);
    if (touched[field]) {
      setErrors(validate(next));
    }
    if (status !== "idle") {
      setStatus("idle");
      setStatusMessage("");
    }
  };

  const handleBlur = (field: keyof FormValues) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate(values));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;

    const validationErrors = validate(values);
    setErrors(validationErrors);
    setTouched({ name: true, email: true, subject: true, message: true });

    if (Object.keys(validationErrors).length > 0) return;

    setStatus("loading");
    setStatusMessage("");

    try {
      const payload = {
        name: values.name.trim(),
        email: values.email.trim(),
        subject: values.subject.trim() || `Nuevo contacto desde portfolio — ${values.name.trim()}`,
        message: values.message.trim(),
        _subject: `Portfolio: ${values.subject.trim() || "Nuevo mensaje"} — ${values.name.trim()}`,
        _template: "table",
        _captcha: "false",
      };

      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.success === "false" || data.success === false) {
        throw new Error(data.message || "No se pudo enviar.");
      }

      setStatus("success");
      setStatusMessage("¡Mensaje enviado! Te responderé en menos de 24h.");
      setValues({ name: "", email: "", subject: "", message: "" });
      setErrors({});
      setTouched({});
    } catch (err) {
      setStatus("error");
      setStatusMessage(
        err instanceof Error && err.message !== "No se pudo enviar."
          ? err.message
          : "No se pudo enviar el mensaje. Intenta de nuevo o escríbeme directo a anthony07miranda@gmail.com"
      );
    }
  };

  const isLoading = status === "loading";

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {/* Honeypot anti-spam */}
      <input
        type="text"
        name="_honey"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <input type="hidden" name="_captcha" value="false" />
      <input type="hidden" name="_template" value="table" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-name" className="text-xs font-medium text-white/80 ml-1">
            Nombre <span className="text-accent-yellow">*</span>
          </label>
          <div className="relative group/input">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-white/60 transition">
              <User className="size-4" />
            </span>
            <input
              id="contact-name"
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange("name")}
              onBlur={handleBlur("name")}
              placeholder="Juan Pérez"
              autoComplete="name"
              maxLength={60}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "error-name" : undefined}
              className={`w-full rounded-xl bg-white/[0.06] backdrop-blur-md border py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/35 focus:outline-none focus:bg-white/[0.08] transition ${errors.name ? "border-red-400/50 focus:border-red-400/50" : "border-white/10 focus:border-white/20 hover:border-white/15"}`}
            />
          </div>
          {errors.name && touched.name && (
            <span id="error-name" className="text-xs text-red-300 ml-1 flex items-center gap-1">
              <AlertCircle className="size-3" /> {errors.name}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-email" className="text-xs font-medium text-white/80 ml-1">
            Correo <span className="text-accent-yellow">*</span>
          </label>
          <div className="relative group/input">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-white/60 transition">
              <Mail className="size-4" />
            </span>
            <input
              id="contact-email"
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange("email")}
              onBlur={handleBlur("email")}
              placeholder="tu@empresa.com"
              autoComplete="email"
              maxLength={254}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "error-email" : undefined}
              className={`w-full rounded-xl bg-white/[0.06] backdrop-blur-md border py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/35 focus:outline-none focus:bg-white/[0.08] transition ${errors.email ? "border-red-400/50 focus:border-red-400/50" : "border-white/10 focus:border-white/20 hover:border-white/15"}`}
            />
          </div>
          {errors.email && touched.email && (
            <span id="error-email" className="text-xs text-red-300 ml-1 flex items-center gap-1">
              <AlertCircle className="size-3" /> {errors.email}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-subject" className="text-xs font-medium text-white/80 ml-1">
          Asunto <span className="text-white/30 font-normal">(opcional)</span>
        </label>
        <div className="relative group/input">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-white/60 transition">
            <Type className="size-4" />
          </span>
          <input
            id="contact-subject"
            type="text"
            name="subject"
            value={values.subject}
            onChange={handleChange("subject")}
            onBlur={handleBlur("subject")}
            placeholder="Ej. Desarrollo web para mi emprendimiento"
            maxLength={100}
            aria-invalid={!!errors.subject}
            aria-describedby={errors.subject ? "error-subject" : undefined}
            className={`w-full rounded-xl bg-white/[0.06] backdrop-blur-md border py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/35 focus:outline-none focus:bg-white/[0.08] transition ${errors.subject ? "border-red-400/50 focus:border-red-400/50" : "border-white/10 focus:border-white/20 hover:border-white/15"}`}
          />
        </div>
        {errors.subject && touched.subject && (
          <span id="error-subject" className="text-xs text-red-300 ml-1 flex items-center gap-1">
            <AlertCircle className="size-3" /> {errors.subject}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="contact-message" className="text-xs font-medium text-white/80 ml-1">
            Mensaje <span className="text-accent-yellow">*</span>
          </label>
          <span className={`text-[11px] tabular-nums ${values.message.length > 900 ? (values.message.length > 1000 ? "text-red-300" : "text-amber-300") : "text-white/35"}`}>
            {values.message.length} / 1000
          </span>
        </div>
        <div className="relative group/input">
          <span className="pointer-events-none absolute left-3.5 top-3.5 text-white/30 group-focus-within/input:text-white/60 transition">
            <MessageSquare className="size-4" />
          </span>
          <textarea
            id="contact-message"
            name="message"
            value={values.message}
            onChange={handleChange("message")}
            onBlur={handleBlur("message")}
            placeholder="Cuéntame sobre tu proyecto, objetivos y tiempos. Entre más detalles, mejor podré ayudarte..."
            rows={5}
            maxLength={1000}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "error-message" : "contact-message-hint"}
            className={`w-full rounded-xl bg-white/[0.06] backdrop-blur-md border py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/35 focus:outline-none focus:bg-white/[0.08] transition resize-none min-h-[128px] ${errors.message ? "border-red-400/50 focus:border-red-400/50" : "border-white/10 focus:border-white/20 hover:border-white/15"}`}
          />
        </div>
        {errors.message && touched.message ? (
          <span id="error-message" className="text-xs text-red-300 ml-1 flex items-center gap-1">
            <AlertCircle className="size-3" /> {errors.message}
          </span>
        ) : (
          <span id="contact-message-hint" className="text-[11px] text-white/30 ml-1 hidden sm:block">
            Respondo en menos de 24 horas. Nunca comparto tu información.
          </span>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="group/btn relative inline-flex w-full items-center justify-center gap-2 rounded-full bg-white text-black text-sm font-semibold py-3.5 px-6 shadow-[0_8px_24px_rgba(255,255,255,0.12),inset_0_1px_0_rgba(255,255,255,0.6)] hover:bg-white/90 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(255,255,255,0.16)] active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      >
        {isLoading ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Enviando...
          </>
        ) : (
          <>
            <Send className="size-4 group-hover/btn:translate-x-0.5 transition-transform" /> Enviar mensaje
          </>
        )}
      </button>

      {/* Indicador de estado */}
      <div aria-live="polite" aria-atomic="true" className="min-h-[52px]">
        {status === "success" && (
          <div className="flex items-start gap-3 rounded-xl bg-emerald-500/10 backdrop-blur-md border border-emerald-400/20 px-4 py-3.5 animate-[fadeUp_0.4s_cubic-bezier(0.22,1,0.36,1)]">
            <span className="size-8 rounded-full bg-emerald-400/15 border border-emerald-400/20 grid place-items-center shrink-0 mt-0.5">
              <CheckCircle2 className="size-4 text-emerald-300" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-emerald-100 leading-tight">¡Mensaje enviado correctamente!</p>
              <p className="text-xs text-emerald-200/70 mt-1 leading-relaxed">{statusMessage}</p>
            </div>
          </div>
        )}
        {status === "error" && (
          <div className="flex items-start gap-3 rounded-xl bg-red-500/10 backdrop-blur-md border border-red-400/20 px-4 py-3.5 animate-[fadeUp_0.4s_cubic-bezier(0.22,1,0.36,1)]">
            <span className="size-8 rounded-full bg-red-400/15 border border-red-400/20 grid place-items-center shrink-0 mt-0.5">
              <AlertCircle className="size-4 text-red-300" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-red-100 leading-tight">No se pudo enviar</p>
              <p className="text-xs text-red-200/70 mt-1 leading-relaxed">{statusMessage}</p>
            </div>
          </div>
        )}
        {status === "idle" && (
          <p className="text-center text-[11px] text-white/25 pt-1">
            Al enviar aceptas ser contactado a tu correo. Sin spam.
          </p>
        )}
      </div>
    </form>
  );
}
