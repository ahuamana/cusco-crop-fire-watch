import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowLeft, ArrowRight, BellRing, Check, ChevronDown, CircleAlert, CloudSun, Flame, HeartHandshake, MapPin, MessageCircle, Phone, Send, ShieldCheck, Sprout, Sun, Users, WifiOff, Wind, Languages, Clock, CloudFog } from "lucide-react";
import fieldImage from "@/assets/cusco-field.webp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { demoRisk, emergencyNumbers, normalizePeruMobile } from "@/lib/chakra-demo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Chakra Alerta | Riesgo de incendios y comunidad en Cusco" },
      { name: "description", content: "Cuida tu chacra en Cusco: riesgo de incendio de demostración, información de SENAMHI, avisos comunitarios y SMS de prueba." },
      { property: "og:title", content: "Chakra Alerta | Cuidamos la chacra juntos" },
      { property: "og:description", content: "Prevención de incendios para agricultores de Cusco. Consulta fuentes oficiales y prueba los avisos comunitarios." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap" },
    ],
  }),
  component: Index,
});

const officialLinks = {
  forecast: "https://www.senamhi.gob.pe/servicios/main.php?dp=cusco&p=pronostico-meteorologico",
  weatherAlerts: "https://www.senamhi.gob.pe/servicios/main.php?dp=cusco&p=aviso-meteorologico",
  fireForecast: "https://www.senamhi.gob.pe/site/incendio/?p=prono-incendio",
  fireAlerts: "https://www.senamhi.gob.pe/site/incendio/?p=aviso-incendio",
};
const reportTypes = [
  { label: "Humo", icon: CloudFog },
  { label: "Fuego", icon: Flame },
  { label: "Quema", icon: CircleAlert },
  { label: "Ayuda", icon: HeartHandshake },
];
type Incident = { id: number; place: string; kind: string; detail: string; time: string };
const sampleIncidents: Incident[] = [
  { id: 1, place: "Calca · Valle Sagrado", kind: "Humo", detail: "Se observa humo en la ladera, cerca de las parcelas. Vecinos están verificando desde un lugar seguro.", time: "Hace 10 min" },
  { id: 2, place: "Anta · Cusco", kind: "Ayuda", detail: "Hoy limpiamos juntos la franja de protección junto a nuestros cultivos.", time: "Hace 1 h" },
  { id: 3, place: "Urubamba · Valle Sagrado", kind: "Quema", detail: "Evitemos las quemas de rastrojos. Hay viento fuerte en la comunidad.", time: "Hace 2 h" },
];

function Index() {
  const [district, setDistrict] = useState("Calca");
  const [language, setLanguage] = useState<"es" | "qu">("es");
  const [offline, setOffline] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [smsPreview, setSmsPreview] = useState("");
  const [reportStep, setReportStep] = useState(1);
  const [reportKind, setReportKind] = useState("");
  const [reportPlace, setReportPlace] = useState("");
  const [reportDetail, setReportDetail] = useState("");
  const [reportSuccess, setReportSuccess] = useState(false);
  const [incidents, setIncidents] = useState(sampleIncidents);
  const [communityMessage, setCommunityMessage] = useState("");
  const [notice, setNotice] = useState("");
  const qu = language === "qu";
  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => { window.removeEventListener("online", update); window.removeEventListener("offline", update); };
  }, []);
  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(""), 6500);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  function submitReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (reportStep === 1 && reportKind) { setReportStep(2); return; }
    if (reportStep === 2 && reportPlace.trim()) { setReportStep(3); return; }
    if (reportStep !== 3 || !reportKind || !reportPlace.trim()) return;
    // Connect authenticated community submission here when a real service exists.
    // This deliberately stays in memory; no report reaches neighbors or emergency services.
    setIncidents(current => [{ id: Date.now(), place: `${reportPlace.trim()} · ${district}`, kind: reportKind, detail: reportDetail.trim() || "Aviso compartido por un vecino de la zona.", time: "Ahora" }, ...current]);
    setReportSuccess(true);
  }
  function previewSms(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = normalizePeruMobile(phone);
    if (!normalized) { setPhoneError("Ingresa 9 dígitos, empezando por 9. Ejemplo: 987 654 321."); setSmsPreview(""); return; }
    setPhoneError("");
    // Connect a server-side SMS provider such as Twilio here, only after consent.
    // Never place provider credentials in this browser code. Nothing is sent or stored.
    setSmsPreview(`CHAKRA ALERTA · ${district}, Cusco: riesgo alto de ejemplo. No quemes rastrojos. Si ves fuego, aléjate y llama al 116. DEMOSTRACIÓN: no es una alerta oficial.`);
  }
  function postCommunityMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!communityMessage.trim()) return;
    setIncidents(current => [{ id: Date.now(), place: `${district} · Cusco`, kind: "Ayuda", detail: communityMessage.trim(), time: "Ahora" }, ...current]);
    setCommunityMessage("");
    setNotice("Mensaje agregado a la demostración. No se publicó ni se guardó.");
  }

  return (
    <main id="inicio" className="min-h-screen bg-background pb-24">
      <a href="#tiempo" className="skip-link">Ir al riesgo de mi zona</a>
      <header className="border-b border-border bg-background">
        <nav aria-label="Navegación principal" className="page-width flex min-h-20 flex-wrap items-center justify-between gap-3 py-4">
          <a href="#inicio" className="focus-ring flex min-h-12 items-center gap-3" aria-label="Chakra Alerta, inicio">
            <span className="flex size-12 items-center justify-center rounded-md bg-forest text-primary-foreground"><Sprout size={27} aria-hidden="true" /></span>
            <span className="display-font text-2xl text-forest">Chakra Alerta<span className="mt-1 block font-sans text-xs font-bold uppercase tracking-widest text-muted-foreground">Cusco · Perú</span></span>
          </a>
          <div className="hidden items-center gap-7 font-semibold lg:flex">
            <a href="#tiempo" className="focus-ring flex min-h-12 items-center hover:text-primary">Mi zona</a>
            <a href="#comunidad" className="focus-ring flex min-h-12 items-center hover:text-primary">Comunidad</a>
            <a href="#sms" className="focus-ring flex min-h-12 items-center hover:text-primary">Alertas SMS</a>
          </div>
          <div className="flex items-center gap-2" aria-label="Idioma">
            <Languages className="hidden text-muted-foreground sm:block" size={20} aria-hidden="true" />
            <Button variant={qu ? "ghost" : "secondary"} onClick={() => setLanguage("es")} aria-pressed={!qu} className="language-button">Español</Button>
            <Button variant={qu ? "secondary" : "ghost"} onClick={() => setLanguage("qu")} aria-pressed={qu} className="language-button">Quechua</Button>
          </div>
        </nav>
      </header>
      {offline && <div role="status" className="border-b border-maize bg-maize-soft px-5 py-4 font-semibold text-foreground"><div className="page-width flex items-start gap-3"><WifiOff className="shrink-0" aria-hidden="true" /><p>Sin internet. Puedes consultar esta demostración abierta; los enlaces oficiales necesitan conexión. Los avisos no se envían ni se guardan.</p></div></div>}
      {qu && <div className="bg-secondary px-5 py-3 text-center text-base text-forest" lang="qu">Rimaykuna quechua simipi · Textos clave en quechua; traducción preliminar pendiente de revisión local.</div>}

      <section aria-labelledby="hero-title" className="hero relative isolate overflow-hidden bg-forest text-primary-foreground">
        <img src={fieldImage} width={1536} height={1024} alt="Agricultora entre cultivos verdes en las montañas de Cusco" fetchPriority="high" className="absolute inset-0 size-full object-cover object-[35%_center]" />
        <div className="hero-shade absolute inset-0" />
        <div className="page-width relative py-9 sm:py-12">
          <p className="mb-4 flex items-center gap-2 text-base font-semibold"><span className="h-2 w-2 rounded-full bg-maize" /> {qu ? "Chakraykita waqaychay" : "Tu tierra. Tu trabajo. Nuestra comunidad."}</p>
          <h1 id="hero-title" className="display-font max-w-2xl text-5xl leading-[1.08] sm:text-6xl">Chakra Alerta<span className="mt-3 block text-3xl leading-tight sm:text-4xl" lang={qu ? "qu" : "es"}>{qu ? "Chakraykita ninamanta waqaychay." : "Que el fuego no se lleve tu cosecha."}</span></h1>
          <p className="mt-5 max-w-xl leading-7">El calor, el viento y las quemas ponen en riesgo tu chacra. Cuidémosla juntos, a tiempo.</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="hero-cta"><a href="#tiempo"><ShieldCheck aria-hidden="true" />{qu ? "Llaqtaypi ima kasqanta qhaway" : "Ver el riesgo en mi zona"}<ArrowDown aria-hidden="true" /></a></Button>
            <Button asChild variant="ghost" className="hero-secondary"><a href="#avisos"><Flame aria-hidden="true" />{qu ? "Q'usnita utaq ninata willay" : "Reportar humo o fuego"}</a></Button>
          </div>
          <p className="mt-6 inline-flex items-center gap-2 text-sm"><Users size={18} aria-hidden="true" /> Hecho para agricultores de Cusco</p>
        </div>
        <div className="andean-strip absolute inset-x-0 bottom-0 h-2" aria-hidden="true" />
      </section>

      <section id="tiempo" aria-labelledby="weather-title" className="section-space scroll-mt-6 bg-background">
        <div className="page-width">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-5">
            <div><p className="eyebrow">01 / Tiempo y prevención</p><h2 id="weather-title" className="section-title">Tu zona, de un vistazo.</h2></div>
            <label className="flex min-h-14 items-center gap-3 rounded-md border border-border bg-card px-4 font-semibold"><MapPin aria-hidden="true" size={22} className="text-primary" />Mi zona<span className="relative"><select aria-label="Selecciona tu zona" className="focus-ring min-h-12 max-w-40 appearance-none bg-card pr-7 text-lg" value={district} onChange={e => setDistrict(e.target.value)}>{["Calca", "Cusco", "Anta", "Urubamba", "Acomayo"].map(d => <option key={d}>{d}</option>)}</select><ChevronDown aria-hidden="true" size={18} className="pointer-events-none absolute right-0 top-4" /></span></label>
          </div>
          <div className="grid gap-7 lg:grid-cols-[1.15fr_1fr]">
            <article aria-label="Riesgo de incendio de demostración" className="risk-panel rounded-lg border border-fire/35 bg-risk-surface p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3"><span className="demo-label">Demostración · No es una alerta oficial</span><span className="text-base font-semibold">{district}, Cusco</span></div>
              <div className="mt-5 flex items-center gap-5"><span className="display-font text-7xl leading-none text-fire">{demoRisk.level}<span className="font-sans text-2xl text-muted-foreground">/{demoRisk.maximum}</span></span><div><p className="flex items-center gap-2 text-2xl font-bold text-fire"><Flame className="risk-pulse" size={28} aria-hidden="true" />{qu ? "Nina: hatun peligro" : "Riesgo alto"}</p><p className="mt-1 font-semibold">{qu ? "Ama rastrojokunata rupachiychu." : "Hoy, no quemes rastrojos."}</p></div></div>
              <div className="mt-6 grid grid-cols-4 gap-2" aria-label="Escala: 1 bajo, 2 moderado, 3 alto, 4 extremo">
                {[{ n: 1, name: "Bajo", cls: "risk-low" }, { n: 2, name: "Moderado", cls: "risk-medium" }, { n: 3, name: "Alto", cls: "risk-high" }, { n: 4, name: "Extremo", cls: "risk-extreme" }].map(r => <div key={r.n} className={`${r.cls} ${r.n === demoRisk.level ? "risk-selected" : ""} rounded-md px-1 py-2 text-center text-sm font-bold`}><span className="flex items-center justify-center gap-1">{r.n}{r.n === 3 && <Check size={16} aria-hidden="true" />}</span><span>{r.name}</span></div>)}
              </div>
              <p className="mt-5 border-t border-fire/20 pt-4 text-base leading-6">Ejemplo ilustrativo, actualizado el {demoRisk.updated}. No calculado con datos de SENAMHI.</p>
            </article>
            <div className="flex flex-col justify-between gap-6">
              <div className="grid grid-cols-3 divide-x divide-border border-y border-border py-6">
                {[{ icon: Sun, value: `${demoRisk.temperature}°`, name: "Temperatura", unit: "°C" }, { icon: CloudSun, value: `${demoRisk.humidity}%`, name: "Humedad", unit: "Ambiente" }, { icon: Wind, value: `${demoRisk.wind}`, name: "Viento", unit: "km/h" }].map(w => <div key={w.name} className="flex flex-col items-center text-center"><w.icon size={25} className="mb-3 text-stone" aria-hidden="true" /><strong className="text-3xl text-forest">{w.value}</strong><span className="mt-1 text-sm font-semibold">{w.name}</span><span className="text-sm text-muted-foreground">{w.unit}</span></div>)}
              </div>
              <div><p className="mb-3 text-sm font-semibold text-muted-foreground">Condiciones de ejemplo · No son mediciones actuales</p><h3 className="flex items-center gap-2 font-bold"><ShieldCheck className="text-primary" size={22} aria-hidden="true" />La fuente oficial es SENAMHI</h3><p className="mt-2 text-base leading-6 text-muted-foreground">Datos oficiales no sincronizados. La fecha de actualización se consulta en cada boletín de SENAMHI.</p><Button asChild variant="link" className="mt-2 h-auto min-h-12 justify-start whitespace-normal p-0 text-base"><a href={officialLinks.fireAlerts} target="_blank" rel="noreferrer">Consultar avisos oficiales <ArrowRight aria-hidden="true" /></a></Button></div>
            </div>
          </div>
          <div className="mt-7 grid gap-3 md:grid-cols-3">{[{ icon: CloudSun, label: "Pronóstico meteorológico", href: officialLinks.forecast }, { icon: Wind, label: "Avisos del tiempo", href: officialLinks.weatherAlerts }, { icon: Flame, label: "Pronóstico de incendios", href: officialLinks.fireForecast }].map(s => <Button asChild variant="outline" key={s.label} className="min-h-16 justify-between whitespace-normal px-4 py-3 text-base"><a href={s.href} target="_blank" rel="noreferrer"><s.icon size={22} aria-hidden="true" /><span className="flex-1 text-left">{s.label}</span><ArrowRight aria-hidden="true" /></a></Button>)}</div>
        </div>
      </section>

      <section id="avisos" aria-labelledby="report-title" className="section-space scroll-mt-6 border-y border-border bg-paper">
        <div className="page-width grid gap-9 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div><p className="eyebrow text-fire">02 / Reporte rápido</p><h2 id="report-title" className="section-title">Un aviso puede<br className="hidden sm:block" /> salvar una cosecha.</h2><p className="mt-5 max-w-md leading-7 text-muted-foreground">¿Ves humo o fuego? Comparte dónde está, sin acercarte al peligro.</p><div className="mt-7 flex max-w-md gap-3 border-l-4 border-fire pl-4"><ShieldCheck className="mt-1 shrink-0 text-fire" size={24} aria-hidden="true" /><p className="text-base font-semibold leading-6">Primero ponte a salvo. Si hay fuego, llama a Bomberos: <a href="tel:116" className="focus-ring underline underline-offset-4">116</a>.</p></div><p className="mt-6 text-sm leading-6 text-muted-foreground">Demostración: este reporte no se publica, no se guarda y no llega a emergencias.</p></div>
          <div className="min-w-0">
            <ol aria-label="Pasos del reporte" className="mb-7 grid grid-cols-3 gap-2 border-b border-border pb-5">{["Qué ves", "Dónde", "Enviar"].map((s, i) => <li key={s} aria-current={reportStep === i + 1 ? "step" : undefined} className={`flex items-center gap-2 text-base font-semibold ${reportStep === i + 1 ? "text-primary" : "text-muted-foreground"}`}><span className={`flex size-8 shrink-0 items-center justify-center rounded-full ${reportStep === i + 1 ? "bg-primary text-primary-foreground" : "bg-border text-foreground"}`}>{i + 1}</span>{s}</li>)}</ol>
            {reportSuccess ? <div role="status" className="py-5"><Check className="mb-4 text-primary" size={42} aria-hidden="true" /><h3 className="text-2xl font-bold">Aviso añadido a la demostración</h3><p className="mt-3 leading-7">Aparece abajo en la comunidad. No se publicó en internet ni se envió a emergencias.</p><div className="mt-6 flex flex-wrap gap-3"><Button asChild className="action-button"><a href="#comunidad">Ver mi aviso <ArrowDown aria-hidden="true" /></a></Button><Button variant="outline" className="action-button" onClick={() => { setReportSuccess(false); setReportStep(1); setReportKind(""); setReportPlace(""); setReportDetail(""); }}>Nuevo reporte</Button></div></div> : <form onSubmit={submitReport}>
              <h3 className="mb-5 text-2xl font-bold">{reportStep === 1 ? "¿Qué estás viendo?" : reportStep === 2 ? "¿Dónde está ocurriendo?" : "Revisa tu aviso"}</h3>
              {reportStep === 1 && <div role="group" aria-label="Tipo de aviso" className="grid grid-cols-2 gap-3">{reportTypes.map(t => <Button key={t.label} type="button" variant="outline" aria-pressed={reportKind === t.label} onClick={() => setReportKind(t.label)} className={`report-choice ${reportKind === t.label ? "border-primary bg-secondary text-primary ring-1 ring-primary" : ""}`}><t.icon aria-hidden="true" size={30} />{t.label}{reportKind === t.label && <Check className="absolute right-3 top-3" aria-hidden="true" />}</Button>)}</div>}
              {reportStep === 2 && <div className="space-y-5"><label htmlFor="report-place" className="block font-semibold">Sector o comunidad<Input id="report-place" className="large-input mt-2" value={reportPlace} onChange={e => setReportPlace(e.target.value)} placeholder="Ej.: comunidad de Huayllabamba" maxLength={70} required /></label><label htmlFor="report-detail" className="block font-semibold">Detalle <span className="font-normal text-muted-foreground">(opcional)</span><textarea id="report-detail" className="focus-ring mt-2 min-h-28 w-full rounded-md border border-input bg-card p-4 text-lg font-normal" value={reportDetail} onChange={e => setReportDetail(e.target.value)} placeholder="Una referencia para ubicar el lugar…" maxLength={300} rows={3} /></label></div>}
              {reportStep === 3 && <dl className="space-y-4 border-l-4 border-primary pl-5"><div><dt className="text-base text-muted-foreground">Qué ves</dt><dd className="font-bold">{reportKind}</dd></div><div><dt className="text-base text-muted-foreground">Dónde</dt><dd className="break-words font-bold">{reportPlace} · {district}</dd></div>{reportDetail && <div><dt className="text-base text-muted-foreground">Detalle</dt><dd className="break-words">{reportDetail}</dd></div>}</dl>}
              <div className="mt-6 flex justify-between gap-3">{reportStep > 1 ? <Button type="button" variant="ghost" className="action-button" onClick={() => setReportStep(s => s - 1)}><ArrowLeft aria-hidden="true" />Atrás</Button> : <span />}<Button type="submit" className="action-button" disabled={reportStep === 1 ? !reportKind : reportStep === 2 ? !reportPlace.trim() : false}>{reportStep === 3 ? "Enviar aviso de prueba" : "Continuar"}{reportStep === 3 ? <Send aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}</Button></div>
            </form>}
          </div>
        </div>
      </section>

      <section id="comunidad" aria-labelledby="community-title" className="section-space scroll-mt-6 bg-background">
        <div className="page-width grid gap-9 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div><p className="eyebrow">03 / Comunidad</p><h2 id="community-title" className="section-title" lang={qu ? "qu" : "es"}>{qu ? "Ayllunchikwan kuska." : "Entre vecinos, nos cuidamos."}</h2><p className="mt-5 max-w-md leading-7 text-muted-foreground">Una comunidad atenta protege el trabajo de todos. Compartamos avisos y cuidemos nuestras chacras.</p><div className="mt-7 flex items-center gap-4"><span className="flex size-14 items-center justify-center rounded-full bg-secondary text-primary"><Users aria-hidden="true" size={26} /></span><div><p className="font-bold"><span className="text-3xl">128</span> vecinos</p><p className="text-base">protegiendo sus chacras</p></div></div><p className="mt-2 text-sm text-muted-foreground">Contador ilustrativo · Demostración</p><form onSubmit={postCommunityMessage} className="mt-8"><label htmlFor="community-message" className="mb-2 block font-semibold">Un mensaje para tus vecinos</label><div className="flex gap-2"><Input id="community-message" value={communityMessage} onChange={e => setCommunityMessage(e.target.value)} placeholder="Comparte una recomendación…" maxLength={180} required className="large-input min-w-0" /><Button type="submit" size="icon" aria-label="Compartir con la comunidad" className="size-14 shrink-0"><Send aria-hidden="true" /></Button></div><p className="mt-3 text-sm text-muted-foreground">No se publica ni se guarda al cerrar la página.</p></form></div>
          <div className="space-y-4" aria-label="Avisos recientes de la comunidad"><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-bold">Avisos de vecinos</h3><span className="demo-label">Demostración</span></div>{incidents.map(incident => { const Icon = reportTypes.find(t => t.label === incident.kind)?.icon ?? MessageCircle; return <article key={incident.id} className="community-card flex gap-4 rounded-lg border border-border bg-card p-5"><span className={`flex size-12 shrink-0 items-center justify-center rounded-md ${incident.kind === "Ayuda" ? "bg-secondary text-primary" : "bg-risk-surface text-fire"}`}><Icon size={25} aria-hidden="true" /></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><h4 className="font-bold">{incident.kind === "Ayuda" ? "Cuidamos la comunidad" : `${incident.kind} cerca de cultivos`}</h4><span className="inline-flex items-center gap-1 text-sm text-muted-foreground"><Clock size={14} aria-hidden="true" />{incident.time}</span></div><p className="mt-2 flex items-center gap-1 text-sm font-semibold text-primary"><MapPin size={15} className="shrink-0" aria-hidden="true" />{incident.place}</p><p className="mt-3 break-words text-base leading-7">{incident.detail}</p><p className="mt-3 text-xs font-semibold text-muted-foreground">Aviso de demostración · No verificado</p></div></article>; })}</div>
        </div>
      </section>

      <section id="sms" aria-labelledby="sms-title" className="section-space relative scroll-mt-6 bg-forest text-primary-foreground">
        <div className="andean-strip absolute inset-x-0 top-0 h-2" aria-hidden="true" />
        <div className="page-width grid gap-9 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div><p className="eyebrow text-maize">04 / Alertas SMS</p><h2 id="sms-title" className="display-font text-4xl leading-tight">Un aviso a tiempo.<br />Incluso sin internet.</h2><p className="mt-5 max-w-lg leading-7">Los SMS pueden llegar a un celular sin datos móviles, con señal telefónica. Aquí puedes probar un mensaje de ejemplo.</p><ol className="mt-8 space-y-5">{[{ icon: Phone, title: "Te registras", detail: "Con tu número y tu zona." }, { icon: BellRing, title: "Recibes una alerta", detail: "Un mensaje corto y claro." }, { icon: Users, title: "Avisas a tus vecinos", detail: "Nos cuidamos entre todos." }].map((s, i) => <li key={s.title} className="flex items-center gap-4"><span className="flex size-12 shrink-0 items-center justify-center rounded-md border border-primary-foreground/30"><s.icon aria-hidden="true" size={23} /></span><div><p className="font-bold"><span className="mr-2 text-maize">0{i + 1}</span>{s.title}</p><p className="text-base">{s.detail}</p></div></li>)}</ol></div>
          <form onSubmit={previewSms} noValidate className="min-w-0 border-t border-primary-foreground/30 pt-7 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0"><span className="inline-flex rounded-sm border border-primary-foreground/40 px-2 py-1 text-sm font-semibold">Demostración · Sin envío real</span><h3 className="mt-5 text-2xl font-bold">Prepara tu alerta de prueba</h3><label htmlFor="phone" className="mt-6 block font-semibold">Tu número de celular</label><div className="mt-2 flex min-h-16 items-center rounded-md border border-border bg-card text-foreground"><span className="border-r border-border px-4 font-bold">+51</span><Input id="phone" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="987 654 321" value={phone} onChange={e => { setPhone(e.target.value); setPhoneError(""); setSmsPreview(""); }} maxLength={20} aria-invalid={!!phoneError} aria-describedby={phoneError ? "phone-error" : "phone-hint"} className="large-input min-w-0 border-0 shadow-none" /></div><p id="phone-hint" className="mt-2 text-sm">Número peruano: 9 dígitos, empieza por 9.</p>{phoneError && <p id="phone-error" role="alert" className="mt-3 flex items-start gap-2 rounded-md bg-maize-soft p-3 text-base font-semibold text-foreground"><CircleAlert size={20} className="mt-1 shrink-0" aria-hidden="true" />{phoneError}</p>}<p className="mt-5 flex items-center gap-2 text-base"><MapPin size={19} aria-hidden="true" />Zona seleccionada: {district}, Cusco</p><Button type="submit" className="hero-cta mt-5 w-full"><MessageCircle aria-hidden="true" />Preparar SMS de prueba<ArrowRight aria-hidden="true" /></Button><p className="mt-4 text-sm leading-6">No enviamos mensajes, no guardamos tu número y no hay cobros. El servicio SMS real aún no está conectado.</p>{smsPreview && <div role="status" className="mt-6 border-l-4 border-maize pl-4"><p className="mb-2 flex items-center gap-2 font-bold"><Check size={20} aria-hidden="true" />Vista previa · No enviado</p><p className="text-base leading-7">{smsPreview}</p></div>}</form>
        </div>
      </section>
      <footer className="page-width flex flex-col gap-5 py-9 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-2 text-forest"><Sprout size={25} aria-hidden="true" /><span className="display-font text-2xl">Chakra Alerta</span></div><p className="max-w-md text-sm leading-6 text-muted-foreground">Cusco, Perú · MVP demostrativo.<br />No sustituye las alertas oficiales ni la atención de emergencias.</p><a href="https://www.gob.pe/547-telefonos-de-emergencia" target="_blank" rel="noreferrer" className="focus-ring flex min-h-12 items-center gap-2 text-sm font-semibold underline underline-offset-4">Teléfonos oficiales <ArrowRight size={16} aria-hidden="true" /></a></footer>
      <aside aria-label="Llamadas de emergencia" className="emergency-bar fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card"><div className="page-width flex min-h-20 items-center justify-between gap-2 py-3"><p className="hidden items-center gap-3 font-bold md:flex"><ShieldCheck className="text-fire" aria-hidden="true" />Ante peligro, ponte a salvo.</p><div className="flex w-full gap-3 md:w-auto"><Button asChild variant="outline" className="emergency-button flex-1"><a href={`tel:${emergencyNumbers.civilDefense}`}><Phone aria-hidden="true" /><span>Defensa Civil <strong>115</strong></span></a></Button><Button asChild variant="destructive" className="emergency-button flex-1"><a href={`tel:${emergencyNumbers.firefighters}`}><Phone aria-hidden="true" /><span>Bomberos <strong>116</strong></span></a></Button></div></div></aside>
      {notice && <div role="status" className="fixed bottom-24 left-1/2 z-40 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 rounded-md bg-foreground p-4 text-base text-background shadow-lg">{notice}</div>}
    </main>
  );
}
