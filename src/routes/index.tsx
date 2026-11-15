import { useMemo, useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowRight,
  BellRing,
  BookOpenCheck,
  Check,
  ChevronDown,
  CircleAlert,
  CloudSun,
  Flame,
  HeartHandshake,
  Leaf,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Sprout,
  Sun,
  Wind,
} from "lucide-react";
import fieldImage from "@/assets/cusco-field.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Chakra Alerta | Protección de cosechas en Cusco" },
      {
        name: "description",
        content:
          "Prevención de incendios para agricultores de Cusco: pronósticos oficiales, alertas a la comunidad y mensajes de texto de demostración.",
      },
      { property: "og:title", content: "Chakra Alerta | Cusco" },
      {
        property: "og:description",
        content:
          "Una comunidad agricultora mejor preparada frente a incendios en Cusco, Perú.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap",
      },
    ],
  }),
  component: Index,
});

const officialLinks = {
  forecast:
    "https://www.senamhi.gob.pe/servicios/main.php?dp=cusco&p=pronostico-meteorologico",
  weatherAlerts: "https://www.senamhi.gob.pe/servicios/main.php?dp=cusco&p=aviso-meteorologico",
  fireForecast: "https://www.senamhi.gob.pe/site/incendio/?p=prono-incendio",
  fireAlerts: "https://www.senamhi.gob.pe/site/incendio/?p=aviso-incendio",
};

type Incident = {
  id: number;
  place: string;
  kind: string;
  detail: string;
  time: string;
};

const sampleIncidents: Incident[] = [
  {
    id: 1,
    place: "Valle Sagrado · Calca",
    kind: "Quema cerca de parcelas",
    detail: "Se observa humo en la ladera. Vecinos están verificando la zona.",
    time: "Hace 18 min",
  },
  {
    id: 2,
    place: "Anta · Cusco",
    kind: "Jornada de prevención",
    detail: "La comunidad limpió la franja de protección junto al cultivo.",
    time: "Hace 1 h",
  },
];

function Index() {
  const [district, setDistrict] = useState("Cusco");
  const [phone, setPhone] = useState("");
  const [smsPreview, setSmsPreview] = useState("");
  const [reportKind, setReportKind] = useState("Humo o incendio observado");
  const [reportPlace, setReportPlace] = useState("");
  const [reportDetail, setReportDetail] = useState("");
  const [communityMessage, setCommunityMessage] = useState("");
  const [incidents, setIncidents] = useState(sampleIncidents);
  const [notice, setNotice] = useState("");

  const districtSuffix = useMemo(
    () => (district === "Cusco" ? "Cusco" : `${district}, Cusco`),
    [district],
  );

  function previewSms(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!phone.trim()) {
      setNotice("Escribe tu número para preparar el mensaje de prueba.");
      return;
    }
    setSmsPreview(
      `CHAKRA ALERTA · ${districtSuffix}: aviso preventivo de incendio. Si observas humo, avisa a tu comunidad y al servicio local de emergencias. Mensaje de demostración; no es una alerta oficial.`,
    );
    setNotice("Vista previa preparada. No se envió ningún mensaje.");
  }

  function submitReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!reportPlace.trim()) {
      setNotice("Indica el sector o la comunidad para registrar el reporte.");
      return;
    }
    const newIncident: Incident = {
      id: Date.now(),
      place: `${reportPlace.trim()} · ${district}`,
      kind: reportKind,
      detail: reportDetail.trim() || "Aviso compartido por un agricultor de la zona.",
      time: "Ahora",
    };
    setIncidents((current) => [newIncident, ...current]);
    setReportPlace("");
    setReportDetail("");
    setNotice("Reporte agregado a esta vista de demostración; no se publicó en internet.");
  }

  function postCommunityMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!communityMessage.trim()) return;
    setIncidents((current) => [
      {
        id: Date.now(),
        place: `Comunidad · ${district}`,
        kind: "Mensaje de la comunidad",
        detail: communityMessage.trim(),
        time: "Ahora",
      },
      ...current,
    ]);
    setCommunityMessage("");
    setNotice("Mensaje agregado a esta vista de demostración.");
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="relative z-10 border-b border-border bg-background">
        <nav
          aria-label="Navegación principal"
          className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-8"
        >
          <a href="#inicio" className="focus-ring flex shrink-0 items-center gap-2.5 rounded-sm">
            <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Sprout aria-hidden="true" size={20} />
            </span>
            <span className="display-font text-xl leading-none text-forest">Chakra Alerta</span>
          </a>
          <div className="hidden items-center gap-7 text-sm font-semibold text-muted-foreground md:flex">
            <a className="focus-ring rounded-sm transition-colors hover:text-foreground" href="#tiempo">
              El tiempo
            </a>
            <a className="focus-ring rounded-sm transition-colors hover:text-foreground" href="#comunidad">
              Comunidad
            </a>
            <a className="focus-ring rounded-sm transition-colors hover:text-foreground" href="#avisos">
              Avisar
            </a>
          </div>
          <a
            href="#sms"
            className="focus-ring inline-flex h-10 items-center gap-2 rounded-md bg-primary px-3.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-forest sm:px-4"
          >
            <BellRing aria-hidden="true" size={16} />
            <span className="hidden sm:inline">Preparar un aviso</span>
            <span className="sm:hidden">Aviso SMS</span>
          </a>
        </nav>
      </header>

      <section
        id="inicio"
        aria-labelledby="hero-title"
        className="relative isolate min-h-[510px] overflow-hidden bg-forest sm:min-h-[580px]"
      >
        <img
          src={fieldImage}
          width={1536}
          height={1024}
          alt="Agricultora cuidando sus cultivos en las montañas de Cusco"
          fetchPriority="high"
          className="absolute inset-0 size-full object-cover object-[38%_center] sm:object-[center_48%]"
        />
        <div className="hero-shade absolute inset-0" />
        <div className="relative mx-auto flex min-h-[510px] max-w-7xl items-center justify-end px-5 py-14 sm:min-h-[580px] sm:px-8 sm:py-20">
          <div className="w-full max-w-xl text-left text-primary-foreground sm:ml-auto sm:text-right">
            <p className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-primary-foreground/90">
              <MapPin aria-hidden="true" size={16} />
              Cusco, Perú <span aria-hidden="true">·</span> Cuidamos la chacra juntos
            </p>
            <h1
              id="hero-title"
              className="display-font max-w-xl text-5xl leading-[1.07] sm:ml-auto sm:text-6xl"
            >
              Que el fuego no se lleve tu cosecha.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-primary-foreground/90 sm:ml-auto sm:text-lg">
              Calor, viento y quemas pueden cambiarlo todo. Estemos atentos y cuidemos el trabajo de nuestra comunidad.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3 sm:justify-end">
              <Button asChild size="lg" className="h-12 rounded-md px-5 font-bold">
                <a href="#avisos">
                  <ShieldCheck aria-hidden="true" />
                  Cuidar mi parcela
                </a>
              </Button>
              <a
                className="focus-ring inline-flex h-12 items-center gap-2 rounded-md px-4 font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
                href="#tiempo"
              >
                Consultar el tiempo <ArrowDown aria-hidden="true" size={16} />
              </a>
            </div>
            <p className="mt-8 text-xs text-primary-foreground/70">
              Herramienta comunitaria de prevención. Ante peligro, llama a los servicios locales de emergencia.
            </p>
          </div>
        </div>
        <a
          href="#tiempo"
          aria-label="Bajar a la información del tiempo"
          className="focus-ring absolute bottom-5 left-1/2 hidden -translate-x-1/2 rounded-full border border-primary-foreground/50 p-2.5 text-primary-foreground transition-colors hover:bg-primary-foreground/10 sm:block"
        >
          <ArrowDown aria-hidden="true" size={18} />
        </a>
      </section>

      <div role="status" aria-live="polite" className="sr-only">
        {notice}
      </div>

      <section id="tiempo" aria-labelledby="weather-title" className="scroll-mt-20 bg-paper py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-leaf">
                Tiempo y prevención
              </p>
              <h2 id="weather-title" className="display-font text-3xl leading-tight text-forest sm:text-4xl">
                Mantente alerta en tu zona
              </h2>
              <p className="mt-3 max-w-lg leading-7 text-muted-foreground">
                Revisa el pronóstico y los avisos vigentes publicados por SENAMHI para la región Cusco.
              </p>
            </div>
            <label className="flex min-h-11 max-w-full items-center gap-3 self-start rounded-md border border-border bg-background px-3.5 text-sm font-semibold text-foreground lg:self-end">
              <MapPin aria-hidden="true" size={17} className="text-leaf" />
              <span>Mi zona</span>
              <span className="relative ml-2">
                <select
                  aria-label="Selecciona tu zona"
                  value={district}
                  onChange={(event) => setDistrict(event.target.value)}
                  className="focus-ring max-w-[152px] cursor-pointer appearance-none bg-background py-2 pr-6 text-sm font-bold text-forest"
                >
                  <option>Cusco</option>
                  <option>Anta</option>
                  <option>Calca</option>
                  <option>Acomayo</option>
                  <option>Urubamba</option>
                </select>
                <ChevronDown aria-hidden="true" size={15} className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground" />
              </span>
            </label>
          </div>

          <div className="mt-8 grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-3">
            <SourceTile
              icon={<CloudSun aria-hidden="true" size={22} />}
              label="Pronóstico meteorológico"
              detail={`Pronóstico oficial de SENAMHI · ${districtSuffix}`}
              href={officialLinks.forecast}
              action="Ver pronóstico"
              tone="sky"
            />
            <SourceTile
              icon={<Wind aria-hidden="true" size={22} />}
              label="Avisos del tiempo"
              detail="Consulta alertas y avisos preventivos vigentes."
              href={officialLinks.weatherAlerts}
              action="Ver avisos"
              tone="leaf"
            />
            <SourceTile
              icon={<Flame aria-hidden="true" size={22} />}
              label="Riesgo por incendios"
              detail="Revisa el pronóstico de condiciones asociadas a incendios."
              href={officialLinks.fireForecast}
              action="Ver pronóstico"
              tone="fire"
            />
          </div>
          <a
            href={officialLinks.fireAlerts}
            target="_blank"
            rel="noreferrer"
            className="focus-ring mt-4 inline-flex min-h-10 items-center gap-2 rounded-sm text-sm font-bold text-forest underline decoration-border underline-offset-4 transition-colors hover:text-leaf"
          >
            <CircleAlert aria-hidden="true" size={16} />
            Revisar avisos de SENAMHI sobre incendios <ArrowRight aria-hidden="true" size={15} />
          </a>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">
            Chakra Alerta no mide el clima ni emite alertas oficiales. Consulta SENAMHI para las condiciones más recientes.
          </p>
        </div>
      </section>

      <section id="avisos" aria-labelledby="report-title" className="scroll-mt-16 border-y border-border bg-background py-14 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="max-w-md">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-fire">
              Ojos abiertos, chacras protegidas
            </p>
            <h2 id="report-title" className="display-font text-3xl leading-tight text-forest sm:text-4xl">
              ¿Ves humo o fuego cerca?
            </h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              Comparte la información con tus vecinos. No te acerques al fuego ni intentes combatirlo sin preparación.
            </p>
            <div className="mt-6 flex gap-3 border-l-2 border-fire pl-4">
              <ShieldCheck aria-hidden="true" className="mt-0.5 shrink-0 text-fire" size={20} />
              <p className="text-sm leading-6 text-muted-foreground">
                Si existe peligro inmediato, aléjate y avisa a las autoridades o equipos de emergencia de tu localidad.
              </p>
            </div>
            <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-forest">
              <MapPin aria-hidden="true" size={17} className="text-fire" />
              <span>{districtSuffix}</span>
            </div>
          </div>
          <form onSubmit={submitReport} className="space-y-5 border-t border-border pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold text-foreground">
                ¿Qué observaste?
                <select
                  value={reportKind}
                  onChange={(event) => setReportKind(event.target.value)}
                  className="focus-ring h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option>Humo o incendio observado</option>
                  <option>Quema cerca de cultivos</option>
                  <option>Calor o viento fuerte</option>
                  <option>Ayuda para proteger la cosecha</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm font-semibold text-foreground">
                Sector o comunidad
                <Input
                  value={reportPlace}
                  onChange={(event) => setReportPlace(event.target.value)}
                  placeholder="Ej.: comunidad o sector"
                  maxLength={70}
                  required
                  className="h-11"
                />
              </label>
            </div>
            <label className="grid gap-2 text-sm font-semibold text-foreground">
              Detalle para los vecinos <span className="font-normal text-muted-foreground">(opcional)</span>
              <textarea
                value={reportDetail}
                onChange={(event) => setReportDetail(event.target.value)}
                placeholder="¿Qué está pasando? Comparte solo información segura."
                maxLength={300}
                rows={3}
                className="focus-ring min-h-[100px] w-full resize-y rounded-md border border-input bg-background px-3 py-2.5 text-sm font-normal placeholder:text-muted-foreground"
              />
            </label>
            <div className="flex flex-wrap items-center gap-4">
              <Button type="submit" className="h-11 rounded-md px-5 font-bold">
                <Send aria-hidden="true" size={16} />
                Compartir aviso
              </Button>
              <p className="max-w-sm text-xs leading-5 text-muted-foreground">
                Demostración: el aviso solo aparece en esta vista y no se envía a emergencias.
              </p>
            </div>
          </form>
        </div>
      </section>

      <section id="comunidad" aria-labelledby="community-title" className="scroll-mt-16 bg-paper py-14 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-leaf">Cuidarnos entre vecinos</p>
            <h2 id="community-title" className="display-font text-3xl leading-tight text-forest sm:text-4xl">
              La comunidad se protege junta.
            </h2>
            <p className="mt-4 max-w-md leading-7 text-muted-foreground">
              Comparte un aviso, acuerden cómo cuidar las parcelas y avisen a los vecinos que no usan internet.
            </p>
            <form onSubmit={postCommunityMessage} className="mt-6 max-w-lg">
              <label className="mb-2 block text-sm font-semibold text-foreground" htmlFor="community-message">
                Mensaje para la comunidad de {district}
              </label>
              <div className="flex gap-2">
                <Input
                  id="community-message"
                  value={communityMessage}
                  onChange={(event) => setCommunityMessage(event.target.value)}
                  placeholder="Comparte una recomendación…"
                  maxLength={180}
                  className="h-11 min-w-0"
                />
                <Button type="submit" size="icon" aria-label="Compartir con la comunidad" className="size-11 shrink-0 rounded-md">
                  <Send aria-hidden="true" size={17} />
                </Button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Vista de demostración; los mensajes no se guardan.</p>
            </form>
          </div>

          <div aria-label="Avisos recientes de la comunidad" className="divide-y divide-border border-y border-border">
            {incidents.map((incident, index) => (
              <article key={incident.id} className="flex gap-4 py-5 first:pt-2 last:pb-2">
                <span
                  className={`mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-md ${
                    incident.kind.includes("quema") || incident.kind.includes("incendio")
                      ? "bg-fire/10 text-fire"
                      : "bg-secondary text-leaf"
                  }`}
                >
                  {incident.kind.includes("quema") || incident.kind.includes("incendio") ? (
                    <Flame aria-hidden="true" size={19} />
                  ) : (
                    <HeartHandshake aria-hidden="true" size={19} />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                    <h3 className="text-sm font-bold text-foreground">{incident.kind}</h3>
                    <time className="text-xs text-muted-foreground">{incident.time}</time>
                  </div>
                  <p className="mt-1 text-xs font-semibold text-leaf">{incident.place}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{incident.detail}</p>
                  {index < 2 && incident.id < 3 ? (
                    <span className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-bold text-stone">
                      <BookOpenCheck aria-hidden="true" size={13} /> Ejemplo de demostración
                    </span>
                  ) : null}
                </div>
              </article>
            ))}
            {incidents.length === 0 ? (
              <p className="py-8 text-sm text-muted-foreground">Aún no hay avisos en esta comunidad.</p>
            ) : null}
          </div>
        </div>
      </section>

      <section id="sms" aria-labelledby="sms-title" className="scroll-mt-16 bg-forest py-14 text-primary-foreground sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-9 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-16">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-primary-foreground/70">Avisos por mensaje de texto</p>
            <h2 id="sms-title" className="display-font text-3xl leading-tight sm:text-4xl">
              Que el aviso llegue a tiempo.
            </h2>
            <p className="mt-4 max-w-md leading-7 text-primary-foreground/80">
              Prepara un SMS de muestra para compartir una recomendación preventiva con un vecino.
            </p>
            <div className="mt-6 flex items-start gap-3 border-t border-primary-foreground/20 pt-5">
              <Phone aria-hidden="true" size={20} className="mt-0.5 shrink-0 text-primary-foreground/80" />
              <p className="text-sm leading-6 text-primary-foreground/75">
                El envío real de mensajes todavía no está conectado. No se solicitará ningún pago ni se enviará un SMS.
              </p>
            </div>
          </div>
          <form onSubmit={previewSms} className="space-y-4 border-t border-primary-foreground/25 pt-6 lg:border-t-0 lg:pt-0">
            <label className="grid gap-2 text-sm font-semibold" htmlFor="phone">
              Número de teléfono
              <Input
                id="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                maxLength={24}
                placeholder="Ej.: 987 654 321"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="h-12 border-primary-foreground/35 bg-primary-foreground/10 text-base text-primary-foreground placeholder:text-primary-foreground/55"
              />
            </label>
            <Button
              type="submit"
              variant="secondary"
              className="h-11 rounded-md px-5 font-bold"
            >
              <MessageCircle aria-hidden="true" size={17} />
              Preparar SMS de prueba
            </Button>
            {smsPreview ? (
              <div className="border-l-2 border-primary-foreground/60 pl-4" aria-live="polite">
                <p className="mb-1 text-xs font-bold uppercase tracking-[0.12em] text-primary-foreground/70">Vista previa · {district}</p>
                <p className="text-sm leading-6 text-primary-foreground">{smsPreview}</p>
                <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-primary-foreground/75">
                  <Check aria-hidden="true" size={14} /> No enviado
                </p>
              </div>
            ) : null}
          </form>
        </div>
      </section>

      <footer className="bg-background">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:px-8 md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-2 text-forest">
            <Leaf aria-hidden="true" size={19} />
            <span className="display-font text-lg">Chakra Alerta</span>
          </div>
          <p className="max-w-xl text-xs leading-5 text-muted-foreground">
            Proyecto demostrativo de prevención comunitaria. Los avisos mostrados no sustituyen las alertas oficiales ni los servicios de emergencia.
          </p>
          <a
            href={officialLinks.forecast}
            target="_blank"
            rel="noreferrer"
            className="focus-ring inline-flex shrink-0 items-center gap-1.5 rounded-sm text-sm font-semibold text-forest hover:text-leaf"
          >
            Fuente oficial: SENAMHI <ArrowRight aria-hidden="true" size={14} />
          </a>
        </div>
      </footer>

      <div className="pointer-events-none fixed bottom-3 left-1/2 z-20 -translate-x-1/2 px-4">
        {notice ? (
          <div
            role="status"
            onAnimationEnd={() => setNotice("")}
            className="pointer-events-auto max-w-[min(34rem,calc(100vw-2rem))] rounded-md bg-foreground px-4 py-3 text-center text-sm font-medium text-background shadow-lg [animation:notice-in_180ms_ease-out]"
          >
            {notice}
          </div>
        ) : null}
      </div>
    </main>
  );
}

function SourceTile({
  icon,
  label,
  detail,
  href,
  action,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  detail: string;
  href: string;
  action: string;
  tone: "sky" | "leaf" | "fire";
}) {
  const toneStyles = {
    sky: { icon: "bg-sky/10 text-sky", link: "text-sky" },
    leaf: { icon: "bg-leaf/10 text-leaf", link: "text-leaf" },
    fire: { icon: "bg-fire/10 text-fire", link: "text-fire" },
  }[tone];

  return (
    <article className="flex min-h-40 flex-col bg-background p-5 sm:p-6">
      <span className={`mb-4 flex size-10 items-center justify-center rounded-md ${toneStyles.icon}`}>
        {icon}
      </span>
      <h3 className="font-bold text-foreground">{label}</h3>
      <p className="mt-1 text-sm leading-5 text-muted-foreground">{detail}</p>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={`focus-ring mt-auto inline-flex w-fit items-center gap-1.5 rounded-sm pt-4 text-sm font-bold transition-opacity hover:opacity-75 ${toneStyles.link}`}
      >
        {action} <ArrowRight aria-hidden="true" size={15} />
      </a>
    </article>
  );
}