import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { ExperienceList } from "@/components/experience-list";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { ViewTracker } from "@/components/view-tracker";
import { getExperience, getProfile, getProjects, getSkills } from "@/lib/data";

export default async function HomePage() {
  const [profile, projects, experience, skills] = await Promise.all([
    getProfile().catch(() => undefined as any),
    getProjects().catch(() => [] as any),
    getExperience().catch(() => [] as any),
    getSkills().catch(() => [] as any),
  ]);

  const skillGroups = skills.reduce<Record<string, string[]>>(
    (groups, skill) => {
      groups[skill.category] = groups[skill.category] ?? [];
      groups[skill.category].push(skill.name);
      return groups;
    },
    {}
  );

  return (
    <>
      <ViewTracker path="/" />

      <section className="relative overflow-hidden border-b border-line pt-32 sm:pt-40">
        <div className="pointer-events-none absolute inset-0 grid-lines opacity-50" />
        <div className="relative mx-auto max-w-6xl px-5 pb-14 sm:px-8 sm:pb-20">
          <div className="flex flex-wrap items-center gap-3">
            {profile.availability ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {profile.availability}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">
              <MapPin className="h-3 w-3" strokeWidth={1.8} />
              {profile.location}
            </span>
          </div>

          <h1 className="mt-8 font-display text-[clamp(2.8rem,9vw,6.4rem)] leading-[0.93] tracking-[-0.035em]">
            {profile.full_name}
          </h1>

          <div className="mt-7 grid gap-8 md:grid-cols-[1.15fr_0.85fr] md:items-end">
            <p className="max-w-xl text-[clamp(1.05rem,2.2vw,1.35rem)] leading-relaxed text-ink/80">
              {profile.headline}
            </p>
            <p className="max-w-md text-[14px] leading-relaxed text-muted md:justify-self-end">
              {profile.bio?.split(". ").slice(0, 2).join(". ")}.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="#work"
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-ink px-5 py-3 text-[13px] font-medium text-canvas transition-opacity duration-200 hover:opacity-85"
            >
              See selected work
              <ArrowDownRight className="h-4 w-4" strokeWidth={1.8} />
            </Link>
            {profile.email ? (
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line bg-surface px-5 py-3 text-[13px] font-medium transition-colors duration-200 hover:border-ink/30"
              >
                <Mail className="h-4 w-4" strokeWidth={1.8} />
                Email me
              </a>
            ) : null}
            {profile.resume_url ? (
              <a
                href={profile.resume_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex cursor-pointer items-center gap-2 rounded-full px-3 py-3 text-[13px] font-medium text-muted transition-colors duration-200 hover:text-ink"
              >
                Download CV
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.8} />
              </a>
            ) : null}
          </div>
        </div>

        <div className="relative border-t border-line">
          <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-line px-5 sm:grid-cols-4 sm:px-8">
            <Stat value={String(projects.length).padStart(2, "0")} label="Products built" />
            <Stat value={String(experience.length).padStart(2, "0")} label="Roles held" />
            <Stat value="02" label="IT internships" />
            <Stat value="NG" label="Based in Abuja" />
          </div>
        </div>
      </section>

      <section
        id="work"
        className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28"
      >
        <Reveal>
          <SectionHeading
            index="01"
            label="Selected work"
            title="Products I designed, built, and shipped."
            description="Live products, private client work, and systems in progress. Open any project for the full story and media."
          />
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {projects.map((project, index) => (
            <Reveal key={project.id} delay={index * 60}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>

        {projects.length === 0 ? (
          <p className="mt-10 text-sm text-muted">
            No published projects yet. Sign in to the admin and add your first one.
          </p>
        ) : null}
      </section>

      <section id="experience" className="border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28">
          <div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr]">
            <Reveal className="md:sticky md:top-28 md:self-start">
              <SectionHeading
                index="02"
                label="Experience"
                title="Where I have done the work."
                description="From IT support in government offices to owning a corporate learning platform and a portfolio of products."
              />
            </Reveal>
            <Reveal delay={80}>
              <ExperienceList items={experience} />
            </Reveal>
          </div>
        </div>
      </section>

      <section
        id="about"
        className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28"
      >
        <div className="grid gap-12 md:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <div className="relative aspect-[4/5] w-full max-w-xs overflow-hidden rounded-2xl border border-line bg-surface-2">
              {profile.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  fill
                  sizes="320px"
                  className="object-cover"
                />
              ) : (
                <div className="grid h-full w-full place-items-center">
                  <span className="font-display text-6xl tracking-tight text-ink/20">
                    AT
                  </span>
                </div>
              )}
            </div>
          </Reveal>

          <Reveal delay={60}>
            <SectionHeading
              index="03"
              label="About"
              title="Engineer first, product owner always."
            />
            <div className="prose-editorial mt-6 max-w-xl text-[14.5px] leading-relaxed text-muted">
              {profile.bio?.split("\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-10 space-y-6">
              {Object.entries(skillGroups).map(([category, names]) => (
                <div key={category}>
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted">
                    {category}
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {names.map((name) => (
                      <span
                        key={name}
                        className="rounded-full border border-line bg-surface px-3 py-1 text-[12.5px] text-ink/80"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section id="contact" className="border-t border-line bg-surface">
        <div className="mx-auto grid max-w-6xl scroll-mt-24 gap-12 px-5 py-20 sm:px-8 sm:py-28 md:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <SectionHeading
              index="04"
              label="Contact"
              title="Have a product to ship?"
              description="Tell me what you are building and where it is stuck. I reply to every serious message."
            />

            <div className="mt-8 space-y-3">
              {profile.email ? (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex cursor-pointer items-center gap-3 text-sm text-muted transition-colors hover:text-ink"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-line">
                    <Mail className="h-4 w-4" strokeWidth={1.7} />
                  </span>
                  {profile.email}
                </a>
              ) : null}
              {profile.phone ? (
                <a
                  href={`tel:${profile.phone.replace(/\s+/g, "")}`}
                  className="flex cursor-pointer items-center gap-3 text-sm text-muted transition-colors hover:text-ink"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-line">
                    <Phone className="h-4 w-4" strokeWidth={1.7} />
                  </span>
                  {profile.phone}
                </a>
              ) : null}
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="rounded-2xl border border-line bg-canvas p-5 sm:p-7">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="px-4 py-6 first:pl-0 sm:px-6">
      <p className="font-display text-2xl tracking-tight sm:text-3xl">{value}</p>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
        {label}
      </p>
    </div>
  );
}
